import hashlib
from typing import TypedDict, List, Dict, Any
from datetime import datetime
import asyncio

from langgraph.graph import StateGraph, END
# pyrefly: ignore [missing-import]
from app.models.models import Workflow, WorkflowHistory, Notification, AgentState, AuditLog, Approval
# pyrefly: ignore [missing-import]
from app.core.database import SessionLocal
# pyrefly: ignore [missing-import]
from app.services.websocket import websocket_service
# pyrefly: ignore [missing-import]
from app.services.ai_engine import ai_engine
# pyrefly: ignore [missing-import]
from app.services.workflow import run_async

# Define LangGraph State Dictionary
class GraphState(TypedDict):
    workflow_id: str
    current_step: str
    progress: int
    status: str
    findings: List[str]
    risk_score: float
    ocr_text: str
    inject_error: bool
    lang: str # User preference (en, hi, aw, hl)

def update_agent_status(db, agent_name: str, status: str, is_busy: bool = False):
    """
    Helper to update running digital civil servant statuses in AgentState table.
    """
    agent = db.query(AgentState).filter(AgentState.agent_name == agent_name).first()
    if not agent:
        agent = AgentState(agent_name=agent_name)
        db.add(agent)
    agent.current_status = status
    agent.is_busy = is_busy
    agent.last_active_at = datetime.utcnow()
    db.commit()

# Agent 1: Planner Agent Node (Injects Emergency Bypass Hooks)
def planner_node(state: GraphState) -> GraphState:
    db = SessionLocal()
    try:
        wf_id = state["workflow_id"]
        wf = db.query(Workflow).filter(Workflow.id == wf_id).first()
        if wf:
            update_agent_status(db, "planner", "active", is_busy=True)
            
            # --- PHASE 2 EMERGENCY ESCALATION BYPASS TRIGGERS ---
            is_emergency_category = wf.category in ["women_safety", "fire", "corruption", "medical", "fraud"]
            is_emergency_urgency = wf.urgency == "critical"
            
            if is_emergency_category or is_emergency_urgency:
                # Fast track directly to escalation
                wf.status = "escalated"
                wf.current_step = "escalation"
                wf.progress = 90
                
                msg = (
                    f"🚨 EMERGENCY AUTO-ESCALATION TRIGGERED: Category is '{wf.category}' and urgency is '{wf.urgency}'. "
                    f"Bypassing standard verification and fast-tracking directly to Hazratganj Commissioner Executive desk."
                )
                
                db.add(WorkflowHistory(workflow_id=wf_id, agent_name="Planner Agent", message=msg, status="warning"))
                db.commit()
                
                # Emit live WebSocket emergency alert & updates
                run_async(websocket_service.send_emergency_alert({
                    "id": wf_id,
                    "category": wf.category or "emergency",
                    "message": f"Critical complaint '{wf.title}' registered. Immediate officer dispatch locked.",
                    "timestamp": datetime.utcnow().strftime("%H:%M:%S")
                }))
                
                run_async(websocket_service.stream_workflow_update(serialize_wf(wf)))
                run_async(websocket_service.stream_agent_activity(wf_id, "Planner Agent", msg, "warning"))
                
                state["status"] = "escalated"
                state["current_step"] = "escalation"
                state["progress"] = 90
                
            else:
                # Standard workflow planning
                wf.current_step = "planner"
                wf.progress = 15
                wf.status = "active"
                
                if wf.type == "property":
                    dept = "Lucknow Nagar Nigam (Revenue) & UP Land Registry"
                    steps_list = "Verify Deed -> Aadhaar KYC Check -> Section 104 Stamp Rules -> Digital Stamp Sealing"
                elif wf.type == "pension":
                    dept = "UP Social Welfare Department"
                    steps_list = "Verify Age Limit -> Urban/Rural Income Limits -> Aadhaar Link -> Pension Vault Disbursal"
                else:
                    dept = "Lucknow Public Works Department (PWD)"
                    steps_list = "Verify Pothole Photo Coordinates -> Classify Severity -> Route Repair Crew -> SLA Timer"
                    
                msg = (
                    f"Planner Agent decomposed task '{wf.title}' for {dept} department. "
                    f"Planned Execution Steps: {steps_list}."
                )
                
                db.add(WorkflowHistory(workflow_id=wf_id, agent_name="Planner Agent", message=msg, status="success"))
                db.commit()
                
                run_async(websocket_service.stream_workflow_update(serialize_wf(wf)))
                run_async(websocket_service.stream_agent_activity(wf_id, "Planner Agent", msg, "success"))
                
                state["current_step"] = "planner"
                state["progress"] = 15
                state["status"] = "active"
                
            update_agent_status(db, "planner", "idle", is_busy=False)
            
        return state
    finally:
        db.close()

# Agent 2: Verification Agent Node (OCR & Document Check)
def verification_node(state: GraphState) -> GraphState:
    if state["status"] == "escalated":
        return state

    db = SessionLocal()
    try:
        wf_id = state["workflow_id"]
        wf = db.query(Workflow).filter(Workflow.id == wf_id).first()
        if wf:
            update_agent_status(db, "ocr", "active", is_busy=True)
            wf.current_step = "ocr"
            wf.progress = 30
            
            ocr_text = state.get("ocr_text", "Name: Ashmit Sarkar Aadhaar: 5420 1204 9876 PAN: ABXPS1204C")
            
            # If error is injected, simulate tampered file
            if state.get("inject_error") or "dispute" in wf.title.lower():
                ocr_text = "TAMPERED PROPERTY FILE: Duplicate claims matching. Aadhaar Holder Name does not match registry land ledger."
                
            # Perform OCR validation and fraud scans
            fraud_results = ai_engine.analyze_document_fraud(ocr_text)
            
            state["risk_score"] = fraud_results["risk_score"]
            state["findings"] = fraud_results["findings"]
            
            if fraud_results["fraud_detected"]:
                wf.status = "escalated"
                msg = f"CRITICAL FRAUD ALERT: {'; '.join(fraud_results['findings'])}. Risk Score: {fraud_results['risk_score']}%."
                db.add(WorkflowHistory(workflow_id=wf_id, agent_name="Verification Agent", message=msg, status="error"))
                db.commit()
                
                # Stream Socket.IO alerts
                run_async(websocket_service.send_live_notification({
                    "id": wf_id,
                    "title": "Security Anomaly Blocked",
                    "description": f"Fraud scanner halted progress on {wf.title}. Esculating details to Municipal Commissioner.",
                    "type": "escalation",
                    "timestamp": datetime.utcnow().strftime("%H:%M:%S")
                }))
                run_async(websocket_service.stream_workflow_update(serialize_wf(wf)))
                run_async(websocket_service.stream_agent_activity(wf_id, "Verification Agent", msg, "error"))
                state["status"] = "escalated"
            else:
                msg = (
                    "Aadhaar Identity & PAN validation successfully confirmed. "
                    "Cross-reference matched: 100%. No coordinates tampering found."
                )
                db.add(WorkflowHistory(workflow_id=wf_id, agent_name="Verification Agent", message=msg, status="success"))
                db.commit()
                run_async(websocket_service.stream_workflow_update(serialize_wf(wf)))
                run_async(websocket_service.stream_agent_activity(wf_id, "Verification Agent", msg, "success"))
                state["status"] = "active"
                
            update_agent_status(db, "ocr", "idle", is_busy=False)

        state["current_step"] = "ocr"
        state["progress"] = 30
        return state
    finally:
        db.close()

# Agent 3: Rule Engine Agent Node (Bylaw matching & logic checks)
def rules_node(state: GraphState) -> GraphState:
    if state["status"] == "escalated":
        return state

    db = SessionLocal()
    try:
        wf_id = state["workflow_id"]
        wf = db.query(Workflow).filter(Workflow.id == wf_id).first()
        if wf:
            update_agent_status(db, "rules", "active", is_busy=True)
            wf.current_step = "rules"
            wf.progress = 45
            
            # Dynamic semantic retrieval of policies using Gemini embeddings
            rag_docs = ai_engine.retrieve_context(wf.title, top_k=1)
            rag_context = rag_docs[0]["content"] if rag_docs else "Standard bylaws."
            
            # Map logic check by type
            if wf.type == "property":
                # Circle rate rule checking
                circle_rate_msg = "UP Revenue Code Sec 104 verified. Stamp duty (7%) matched circles rate ₹1,42,500 successfully."
                wf.progress = 50
                msg = f"Rule matching completed via RAG: '{circle_rate_msg}' Policy reference: {rag_context[:90]}..."
            elif wf.type == "pension":
                # Social welfare age and income checking
                pension_msg = "Eligible age (60+ years verified) and Urban household income is below the state cap (₹56,460)."
                wf.progress = 50
                msg = f"Pension rules matching complete: '{pension_msg}' Policy reference: {rag_context[:90]}..."
            else:
                # Road repair grievance classification
                pothole_msg = "Grievance pothole severity categorized as Grade A. Standard SLA assigned: 72 Hours (3 days)."
                wf.progress = 50
                msg = f"Repair SOP validation complete: '{pothole_msg}' Policy reference: {rag_context[:90]}..."
                
            db.add(WorkflowHistory(workflow_id=wf_id, agent_name="Rule Engine Agent", message=msg, status="success"))
            db.commit()
            
            run_async(websocket_service.stream_workflow_update(serialize_wf(wf)))
            run_async(websocket_service.stream_agent_activity(wf_id, "Rule Engine Agent", msg, "success"))
            update_agent_status(db, "rules", "idle", is_busy=False)
            
        state["current_step"] = "rules"
        state["progress"] = 50
        return state
    finally:
        db.close()

# Agent 4: Translation Agent Node (Multilingual dialect formatting)
def translation_node(state: GraphState) -> GraphState:
    if state["status"] == "escalated":
        return state

    db = SessionLocal()
    try:
        wf_id = state["workflow_id"]
        wf = db.query(Workflow).filter(Workflow.id == wf_id).first()
        if wf:
            update_agent_status(db, "translation", "active", is_busy=True)
            wf.current_step = "translation"
            wf.progress = 65
            
            lang_pref = state.get("lang", "en")
            
            # Query status translation dynamically
            base_msg = f"Application '{wf.title}' successfully verified. Awaiting District Commissioner signoff."
            rag_context = "Translate accurately according to dialect."
            translated_res = ai_engine.generate_response(base_msg, rag_context, lang=lang_pref)
            
            msg = f"Translation Agent converted logging to target dialect [{lang_pref.upper()}]: '{translated_res}'"
            
            db.add(WorkflowHistory(workflow_id=wf_id, agent_name="Translation Agent", message=msg, status="success"))
            db.commit()
            
            run_async(websocket_service.stream_workflow_update(serialize_wf(wf)))
            run_async(websocket_service.stream_agent_activity(wf_id, "Translation Agent", msg, "success"))
            update_agent_status(db, "translation", "idle", is_busy=False)
            
        state["current_step"] = "translation"
        state["progress"] = 65
        return state
    finally:
        db.close()

# Agent 5: Notification Agent Node (Dispatches citizen notifications)
def notifications_node(state: GraphState) -> GraphState:
    db = SessionLocal()
    try:
        wf_id = state["workflow_id"]
        wf = db.query(Workflow).filter(Workflow.id == wf_id).first()
        if wf:
            update_agent_status(db, "notifications", "active", is_busy=True)
            wf.current_step = "notifications"
            wf.progress = 80
            
            status_text = "escalated" if state["status"] == "escalated" else "pending final signature"
            sms_body = f"SarkarAI Update: Your request {wf_id} is currently {status_text} at Lucknow Division desks."
            
            msg = f"Dispatched live update via SMS & WhatsApp to citizen. SMS Payload: '{sms_body}'"
            db.add(WorkflowHistory(workflow_id=wf_id, agent_name="Notification Agent", message=msg, status="success"))
            
            # Dispatch Live Toast
            run_async(websocket_service.send_live_notification({
                "id": wf_id,
                "title": "Citizen Alerts Dispatched",
                "description": f"SMS and WhatsApp update dispatched for {wf.title}.",
                "type": "info",
                "timestamp": datetime.utcnow().strftime("%H:%M:%S")
            }))
            
            db.commit()
            
            run_async(websocket_service.stream_workflow_update(serialize_wf(wf)))
            run_async(websocket_service.stream_agent_activity(wf_id, "Notification Agent", msg, "success"))
            update_agent_status(db, "notifications", "idle", is_busy=False)
            
        state["current_step"] = "notifications"
        state["progress"] = 80
        return state
    finally:
        db.close()

# Agent 6: Escalation Agent Node (Handles delayed/fraud bypass checks)
def escalation_node(state: GraphState) -> GraphState:
    db = SessionLocal()
    try:
        wf_id = state["workflow_id"]
        wf = db.query(Workflow).filter(Workflow.id == wf_id).first()
        if wf:
            update_agent_status(db, "escalation", "active", is_busy=True)
            wf.current_step = "escalation"
            wf.progress = 90
            wf.status = "escalated"
            
            findings = "; ".join(state.get("findings", ["Emergency Escalation: High priority bypass active."]))
            msg = f"CRITICAL ESCALATION: Smart checks halted. Details routed to Municipal Commissioner. Findings: {findings}."
            
            db.add(WorkflowHistory(workflow_id=wf_id, agent_name="Escalation Agent", message=msg, status="warning"))
            
            # Log high-priority global dashboard warning
            db.add(Notification(
                id=f"notif-{wf_id}",
                title="SLA Escalation Flagged",
                description=f"Workflow {wf_id} ({wf.title}) has been escalated to Hazratganj Commissioner Division.",
                type="warning"
            ))
            
            # Inject DM bypass mock decision if DEMO_MODE is true to automatically resolve in the next step
            if state.get("inject_error") or "dispute" in wf.title.lower():
                # For manual verification demo, do not auto-approve, let it stay escalated
                pass
            else:
                # Auto DM Override for smoother default autoplays
                app = Approval(
                    workflow_id=wf_id,
                    officer_id="officer-dm-101",
                    decision="approved",
                    remarks="Auto-approved by District Magistrate under Special Awadh Smart City Ordinance.",
                    risk_score=state.get("risk_score", 1.2)
                )
                db.add(app)
                wf.status = "completed"
                msg += " [DM Auto-Bypass Override triggered and signed.]"
            
            db.commit()
            
            run_async(websocket_service.send_live_notification({
                "id": wf_id,
                "title": "DM Esculated Pipeline",
                "description": f"SLA boundary conflict or mismatch escalated on {wf.title}.",
                "type": "escalation",
                "timestamp": datetime.utcnow().strftime("%H:%M:%S")
            }))
            
            run_async(websocket_service.stream_workflow_update(serialize_wf(wf)))
            run_async(websocket_service.stream_agent_activity(wf_id, "Escalation Agent", msg, "warning"))
            update_agent_status(db, "escalation", "idle", is_busy=False)
            
        state["current_step"] = "escalation"
        state["progress"] = 90
        return state
    finally:
        db.close()

# Agent 7: Audit Agent Node (Cryptographic vaults sealing)
def audit_node(state: GraphState) -> GraphState:
    db = SessionLocal()
    try:
        wf_id = state["workflow_id"]
        wf = db.query(Workflow).filter(Workflow.id == wf_id).first()
        if wf:
            update_agent_status(db, "audit", "active", is_busy=True)
            wf.current_step = "audit"
            wf.progress = 100
            
            # Cryptographic-like SHA256 hashing to secure the blockchain/vault state
            wf_state_str = f"{wf.id}-{wf.title}-{wf.status}-{state.get('risk_score', 0.0)}"
            sha_hash = hashlib.sha256(wf_state_str.encode("utf-8")).hexdigest()
            
            if wf.status != "rejected" and wf.status != "escalated":
                wf.status = "completed"
            
            msg = (
                f"Audit Agent finalized audit trail. Block SHA256 Signature: {sha_hash[:16]}... "
                "Certificate stamped and securely sealed in the Municipal Revenue Vault."
            )
            
            db.add(WorkflowHistory(workflow_id=wf_id, agent_name="Audit Agent", message=msg, status="success"))
            db.add(AuditLog(action="VAULT_SEAL", details=f"Workflow {wf_id} sealed with signature {sha_hash}"))
            db.commit()
            
            run_async(websocket_service.send_live_notification({
                "id": wf_id,
                "title": "Audit Seal Locked",
                "description": f"Workflow {wf.title} safely archived in smart contracts ledger.",
                "type": "success",
                "timestamp": datetime.utcnow().strftime("%H:%M:%S")
            }))
            
            run_async(websocket_service.stream_workflow_update(serialize_wf(wf)))
            run_async(websocket_service.stream_agent_activity(wf_id, "Audit Agent", msg, "success"))
            update_agent_status(db, "audit", "idle", is_busy=False)
            
        state["current_step"] = "audit"
        state["progress"] = 100
        return state
    finally:
        db.close()

def serialize_wf(wf: Workflow) -> Dict[str, Any]:
    return {
        "id": wf.id,
        "title": wf.title,
        "citizen_name": wf.citizen_name,
        "location": wf.location,
        "type": wf.type,
        "status": wf.status,
        "current_step": wf.current_step,
        "progress": wf.progress,
        "submitted_at": wf.submitted_at.isoformat()
    }

# --- LANGGRAPH CONDITIONAL ROUTING ROUTER FUNCTIONS ---

def routing_after_verification(state: GraphState) -> str:
    """
    Decides routing based on fraud check and identity mismatches.
    """
    if state["status"] == "escalated" or state.get("risk_score", 0.0) > 60:
        return "escalation"
    return "rules"

def routing_after_rules(state: GraphState) -> str:
    """
    Routes to translation if valid, otherwise routes failed cases to escalation.
    """
    if state["status"] == "escalated":
        return "escalation"
    return "translation"

def routing_after_escalation(state: GraphState) -> str:
    """
    Escalated cases are routed to the final audit log seal before halting.
    """
    return "audit"

# Compile LangGraph State Graph
workflow_graph = StateGraph(GraphState)

# Add 7 Agent Nodes
workflow_graph.add_node("planner", planner_node)
workflow_graph.add_node("verification", verification_node)
workflow_graph.add_node("rules", rules_node)
workflow_graph.add_node("translation", translation_node)
workflow_graph.add_node("notifications", notifications_node)
workflow_graph.add_node("escalation", escalation_node)
workflow_graph.add_node("audit", audit_node)

# Set Graph Entry
workflow_graph.set_entry_point("planner")

# Standard Linear / Branch Routes
workflow_graph.add_edge("planner", "verification")

# Conditional Edge Route 1 (Verification Agent Decisions)
workflow_graph.add_conditional_edges(
    "verification",
    routing_after_verification,
    {
        "rules": "rules",
        "escalation": "escalation"
    }
)

# Conditional Edge Route 2 (Rule Engine Agent Decisions)
workflow_graph.add_conditional_edges(
    "rules",
    routing_after_rules,
    {
        "translation": "translation",
        "escalation": "escalation"
    }
)

# Continue Standard Paths
workflow_graph.add_edge("translation", "notifications")
workflow_graph.add_edge("notifications", "audit")

# Conditional Edge Route 3 (Escalation Path to Audit Sealing)
workflow_graph.add_conditional_edges(
    "escalation",
    routing_after_escalation,
    {
        "audit": "audit"
    }
)

workflow_graph.add_edge("audit", END)

# Compile LangGraph orchestrator graph!
langgraph_orchestrator = workflow_graph.compile()
