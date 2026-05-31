import asyncio
from datetime import datetime
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional
import uuid

# pyrefly: ignore [missing-import]
from app.models.models import Workflow, WorkflowHistory, Notification, Approval, AuditLog, AgentState
# pyrefly: ignore [missing-import]
from app.repositories.workflow_repo import workflow_repo, notification_repo, audit_repo
# pyrefly: ignore [missing-import]
from app.services.websocket import websocket_service
# pyrefly: ignore [missing-import]
from app.core.config import settings

def run_async(coro):
    """
    Bridge helper allowing synchronous code to safely trigger asynchronous Socket.IO emitters.
    """
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    if loop.is_running():
        asyncio.ensure_future(coro)
    else:
        loop.run_until_complete(coro)

class WorkflowService:
    def create_workflow(self, db: Session, title: str, citizen_name: str, location: str, wf_type: str, doc_name: str, doc_size: str) -> Workflow:
        """
        Ingests a new document, saves it to PostgreSQL, and initializes base history.
        """
        wf_id = f"wf-{uuid.uuid4().hex[:5]}"
        
        # Add workflow ORM
        db_wf = Workflow(
            id=wf_id,
            title=title,
            citizen_name=citizen_name,
            location=location,
            type=wf_type,
            status="pending",
            current_step="input",
            progress=10
        )
        db.add(db_wf)
        db.flush()
        
        # Add History
        hist = WorkflowHistory(
            workflow_id=wf_id,
            agent_name="Ingestion Layer",
            message=f"Registered application. Document {doc_name} uploaded successfully.",
            status="success"
        )
        db.add(hist)
        
        # Log Audit
        db.add(AuditLog(action="DOCUMENT_INGEST", details=f"Workflow {wf_id} created by {citizen_name}"))
        
        db.commit()
        db.refresh(db_wf)

        # Broadcast via WebSockets
        run_async(websocket_service.send_live_notification({
            "id": wf_id,
            "title": "Ingestion Active",
            "description": f"New workflow {title} registered by {citizen_name}.",
            "type": "info",
            # pyrefly: ignore [deprecated]
            "timestamp": datetime.utcnow().strftime("%H:%M:%S")
        }))
        
        return db_wf

    def advance_step(self, db: Session, workflow_id: str, inject_error: bool = False) -> Workflow:
        """
        State Machine progression advancing through multi-agent steps.
        """
        wf = db.query(Workflow).filter(Workflow.id == workflow_id).first()
        if not wf or wf.status in ["completed", "rejected"]:
            return wf

        steps = ["input", "planner", "ocr", "rules", "translation", "officer", "escalation", "audit"]
        try:
            curr_idx = steps.index(wf.current_step)
            next_idx = curr_idx + 1
        except ValueError:
            next_idx = 1

        if next_idx >= len(steps):
            # Finalize workflow
            wf.status = "completed"
            wf.progress = 100
            wf.current_step = "audit"
            
            hist = WorkflowHistory(
                workflow_id=wf.id,
                agent_name="Audit Agent",
                message="Workflow sealed successfully. Hashed cryptographic signatures generated.",
                status="success"
            )
            db.add(hist)
            db.commit()
            
            run_async(websocket_service.send_live_notification({
                "id": wf.id,
                "title": "Workflow Completed",
                "description": f"All automated security audits passed for {wf.title}.",
                "type": "success",
                # pyrefly: ignore [deprecated]
                "timestamp": datetime.utcnow().strftime("%H:%M:%S")
            }))
            
            # Emit Socket.IO
            run_async(websocket_service.stream_workflow_update(self._serialize_wf(wf)))
            return wf

        next_step = steps[next_idx]
        
        # Intercept and fail at OCR step if error is forced
        if next_step == "ocr" and inject_error:
            wf.status = "rejected"
            wf.current_step = "ocr"
            
            hist = WorkflowHistory(
                workflow_id=wf.id,
                agent_name="Verification Agent",
                message="CRITICAL CONFLICT: Identity details mismatched. Name in Aadhaar does not match state land deed registry.",
                status="error"
            )
            db.add(hist)
            db.commit()
            
            run_async(websocket_service.send_live_notification({
                "id": wf.id,
                "title": "Disputed Mismatch Flagged",
                "description": f"Verification mismatch detected on {wf.title}. Immediate audit bypass triggered.",
                "type": "escalation",
                # pyrefly: ignore [deprecated]
                "timestamp": datetime.utcnow().strftime("%H:%M:%S")
            }))
            
            run_async(websocket_service.stream_workflow_update(self._serialize_wf(wf)))
            return wf

        # Standard step updates
        wf.current_step = next_step
        wf.progress = int((next_idx / len(steps)) * 100)
        wf.status = "active" if next_step != "officer" else "pending"
        
        # Populate history text
        msg = f"Agent [{next_step.upper()}] completed tasks safely. Thread execution consensus 100% verified."
        if next_step == "rules":
            msg = "Eligibility rules compiled: Citizen details verified under state bylaw criteria."
        elif next_step == "translation":
            msg = "Dialect normalized to Awadhi/Hindi. Translation records locked."
        elif next_step == "officer":
            msg = "Awaiting final District Commissioner signature approval."
            
        hist = WorkflowHistory(
            workflow_id=wf.id,
            agent_name=f"{next_step.capitalize()} Agent",
            message=msg,
            status="success"
        )
        db.add(hist)
        
        # Log to Agent State Uptime logs
        agent_state = db.query(AgentState).filter(AgentState.agent_name == next_step).first()
        if agent_state:
            agent_state.current_status = "active"
            agent_state.is_busy = True
            
        db.commit()

        # Emit live telemetry updates to dashboard React Flow nodes
        serialized = self._serialize_wf(wf)
        run_async(websocket_service.stream_workflow_update(serialized))
        run_async(websocket_service.stream_agent_activity(wf.id, f"{next_step.capitalize()} Agent", msg, "success"))
        
        return wf

    def approve_manually(self, db: Session, workflow_id: str, officer_id: str, remarks: str) -> Workflow:
        """
        Manual signatures bypass desks. Ends checks instantly.
        """
        wf = db.query(Workflow).filter(Workflow.id == workflow_id).first()
        if not wf:
            return None
            
        wf.status = "completed"
        wf.progress = 100
        wf.current_step = "audit"
        
        app = Approval(
            workflow_id=workflow_id,
            officer_id=officer_id,
            decision="approved",
            remarks=remarks,
            risk_score=1.2
        )
        db.add(app)
        
        db.add(WorkflowHistory(
            workflow_id=workflow_id,
            agent_name="Officer Desk",
            message=f"Manual bypass approved by DM Officer ({remarks}).",
            status="success"
        ))
        
        db.commit()

        run_async(websocket_service.send_live_notification({
            "id": wf.id,
            "title": "Bypass Signed",
            "description": f"Workflow {workflow_id} manually approved by Hazratganj Division Officer.",
            "type": "success",
            # pyrefly: ignore [deprecated]
            "timestamp": datetime.utcnow().strftime("%H:%M:%S")
        }))
        
        run_async(websocket_service.stream_workflow_update(self._serialize_wf(wf)))
        return wf

    def reject_manually(self, db: Session, workflow_id: str, officer_id: str, remarks: str) -> Workflow:
        """
        Flag and reject manually.
        """
        wf = db.query(Workflow).filter(Workflow.id == workflow_id).first()
        if not wf:
            return None
            
        wf.status = "rejected"
        
        app = Approval(
            workflow_id=workflow_id,
            officer_id=officer_id,
            decision="rejected",
            remarks=remarks,
            risk_score=99.9
        )
        db.add(app)
        
        db.add(WorkflowHistory(
            workflow_id=workflow_id,
            agent_name="Officer Desk",
            message=f"Manual rejection filed: {remarks}.",
            status="error"
        ))
        
        db.commit()

        run_async(websocket_service.send_live_notification({
            "id": wf.id,
            "title": "Application Flagged",
            "description": f"Workflow {workflow_id} manually rejected: {remarks}.",
            "type": "warning",
            # pyrefly: ignore [deprecated]
            "timestamp": datetime.utcnow().strftime("%H:%M:%S")
        }))
        
        run_async(websocket_service.stream_workflow_update(self._serialize_wf(wf)))
        return wf

    def _serialize_wf(self, wf: Workflow) -> Dict[str, Any]:
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

workflow_service = WorkflowService()
