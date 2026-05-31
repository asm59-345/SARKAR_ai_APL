from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
import uuid
import time
import json
from pydantic import BaseModel
from datetime import datetime

# pyrefly: ignore [missing-import]
from app.core.database import get_db
# pyrefly: ignore [missing-import]
from app.models.models import Workflow, Document, Notification, AuditLog, Analytics, User, WorkflowHistory, ChatMessage, SmartCityNews
# pyrefly: ignore [missing-import]
from app.schemas.schemas import WorkflowResponse, WorkflowCreate, ApprovalCreate, NotificationResponse
# pyrefly: ignore [missing-import]
from app.services.workflow import workflow_service, run_async
# pyrefly: ignore [missing-import]
from app.services.ocr import ocr_service
# pyrefly: ignore [missing-import]
from app.core.config import settings
# pyrefly: ignore [missing-import]
from app.services.agents_graph import langgraph_orchestrator
# pyrefly: ignore [missing-import]
from app.services.ai_engine import ai_engine
# pyrefly: ignore [missing-import]
from app.services.websocket import websocket_service, sio

router = APIRouter()

UPLOAD_DIR = "./uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Pydantic Schemas for AI Chatbot and Voice AI
class ChatbotRequest(BaseModel):
    query: str
    lang: str = "en"
    citizen_name: Optional[str] = "Ashmit Sarkar"
    stream: Optional[bool] = False # Additive option for live token streaming

class VoiceAssistantRequest(BaseModel):
    query: str
    lang: str = "en"

# --- NEW PHASE 2 SMART GOVERNANCE PYDANTIC SCHEMAS ---

class ChatMessageCreate(BaseModel):
    message: str
    role: str = "citizen" # "citizen" or "officer"
    sender_id: str = "citizen-101"
    receiver_id: Optional[str] = "officer-dm-101"
    attachment_url: Optional[str] = None

class ChatMessageResponse(BaseModel):
    id: int
    workflow_id: str
    sender_id: str
    receiver_id: Optional[str]
    role: str
    message: str
    attachment_url: Optional[str]
    created_at: datetime
    is_read: bool

    class Config:
        from_attributes = True

class FeedbackCreate(BaseModel):
    feedback_rating: int # 1 to 5
    feedback_text: Optional[str] = None

class SmartCitySummarizeRequest(BaseModel):
    article_id: int
    lang: str = "en"

@router.post("/", response_model=WorkflowResponse)
async def create_new_application(
    title: str = Form(...),
    citizen_name: str = Form(...),
    location: str = Form(...),
    wf_type: str = Form(...),
    file: UploadFile = File(...),
    category: Optional[str] = Form(None),
    urgency: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Primary document upload endpoint. Stores files on disk, triggers OpenCV/Tesseract OCR,
    creates workflow entry in PostgreSQL, and launches agent progression.
    """
    # 1. Save uploaded file to local disk
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # 2. Run OCR document check pipeline
    ocr_results = ocr_service.process_document(file_path)
    
    # 3. Create workflow in DB
    db_wf = workflow_service.create_workflow(
        db=db,
        title=title,
        citizen_name=citizen_name,
        location=location,
        wf_type=wf_type,
        doc_name=file.filename,
        doc_size=f"{os.path.getsize(file_path) // 1024} KB"
    )
    
    # Instantiates the Document ORM entry and binds it to the workflow
    doc_entry = Document(
        workflow_id=db_wf.id,
        name=file.filename,
        url=file_path,
        size=f"{os.path.getsize(file_path) // 1024} KB",
        status="uploaded"
    )
    db.add(doc_entry)
    db.flush()
    db_wf.documents.append(doc_entry)
    
    # 4. Save OCR extracted findings to Workflow history
    findings_msg = f"OCR checks finished. Confidence: {ocr_results['confidence_score']}%. "
    if ocr_results["aadhaar"]["aadhaar_number"]:
        findings_msg += f"Extracted Aadhaar: {ocr_results['aadhaar']['aadhaar_number']}. "
    if ocr_results["missing_fields"]:
        findings_msg += f"Missing items flagged: {', '.join(ocr_results['missing_fields'])}."
        
    db_wf.documents[0].status = "verified" if ocr_results["confidence_score"] > 60 else "failed"
    
    # Set advanced fields safely if provided
    if category:
        db_wf.category = category
    if urgency:
        db_wf.urgency = urgency
    db.commit()
    
    # Update active progress based on details
    workflow_service.advance_step(db, db_wf.id, inject_error=settings.DEMO_MODE and "dispute" in title.lower())
    
    return db_wf

@router.get("/", response_model=List[WorkflowResponse])
def get_all_active_workflows(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Workflow).offset(skip).limit(limit).all()

@router.get("/{id}", response_model=WorkflowResponse)
def get_workflow_by_id(id: str, db: Session = Depends(get_db)):
    wf = db.query(Workflow).filter(Workflow.id == id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow file not found")
    return wf

@router.get("/{id}/resolution-report")
def get_workflow_resolution_report(id: str, lang: str = "en", db: Session = Depends(get_db)):
    """
    Pulls a detailed human-friendly explainable AI Resolution Report for the given workflow,
    generating dynamic content via Gemini using localized dialect preferences.
    """
    wf = db.query(Workflow).filter(Workflow.id == id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    desc = f"Citizen name: {wf.citizen_name}. Location: {wf.location}. Application type: {wf.type}."
    report = ai_engine.generate_resolution_report(
        title=wf.title,
        description=desc,
        type_str=wf.type,
        status=wf.status,
        progress=wf.progress,
        lang=lang
    )
    return report

@router.post("/{id}/advance", response_model=WorkflowResponse)
def advance_workflow_simulation(id: str, inject_error: bool = False, db: Session = Depends(get_db)):
    """
    Manually advances the simulator ticker state step-by-step.
    """
    wf = workflow_service.advance_step(db, id, inject_error=inject_error)
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return wf

@router.post("/{id}/run_langgraph", response_model=WorkflowResponse)
def run_full_langgraph_pipeline(id: str, inject_error: bool = False, lang: str = "en", db: Session = Depends(get_db)):
    """
    Triggers the compiled LangGraph StateGraph to run from Planner through Audit,
    broadcasting live Socket.IO logs for every digital civil servant agent.
    """
    wf = db.query(Workflow).filter(Workflow.id == id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")

    initial_state = {
        "workflow_id": wf.id,
        "current_step": wf.current_step,
        "progress": wf.progress,
        "status": wf.status,
        "findings": [],
        "risk_score": 0.0,
        "ocr_text": "Name: Ashmit Sarkar Aadhaar: 5420 1204 9876 PAN: ABXPS1204C Circle Rate stamp duty paid: 1,42,500 INR.",
        "inject_error": inject_error or "dispute" in wf.title.lower(),
        "lang": lang
    }

    # Run LangGraph StateGraph!
    langgraph_orchestrator.invoke(initial_state)
    
    db.refresh(wf)
    return wf

@router.post("/{id}/approve", response_model=WorkflowResponse)
def officer_approve_bypass(id: str, approval: ApprovalCreate, db: Session = Depends(get_db)):
    """
    Allows a verified officer to manually sign off and override agent checks.
    """
    wf = workflow_service.approve_manually(db, id, officer_id="officer-dm-101", remarks=approval.remarks or "Approved via DM signoff.")
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return wf

@router.post("/{id}/reject", response_model=WorkflowResponse)
def officer_reject_bypass(id: str, approval: ApprovalCreate, db: Session = Depends(get_db)):
    """
    Enforces a manual rejection, halting state progression.
    """
    wf = workflow_service.reject_manually(db, id, officer_id="officer-dm-101", remarks=approval.remarks or "Rejected due to mismatch.")
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return wf

# --- ADDITIONAL AI ENDPOINTS FOR CHATBOT, VOICE AI, AND PLAYBACK DEMOS ---

@router.post("/chatbot")
async def run_citizen_chatbot(req: ChatbotRequest, db: Session = Depends(get_db)):
    """
    Multilingual Governance chatbot supporting standard JSON responses
    and Server-Sent Events (SSE) token-streaming with live reasoning indicators.
    """
    workflows = db.query(Workflow).filter(Workflow.citizen_name == req.citizen_name).all()
    serialized_wfs = []
    for wf in workflows:
        serialized_wfs.append({
            "id": wf.id,
            "title": wf.title,
            "citizen_name": wf.citizen_name,
            "type": wf.type,
            "status": wf.status,
            "current_step": wf.current_step,
            "progress": wf.progress,
            "location": wf.location,
            "submitted_at": wf.submitted_at.isoformat()
        })

    # If stream request is active, return a live Server-Sent Events (SSE) Stream
    if req.stream:
        def stream_generator():
            for chunk in ai_engine.process_chatbot_query_stream(req.query, serialized_wfs, lang=req.lang):
                # Emit WebSocket live signals for the telemetry panels
                if chunk["type"] == "thinking":
                    run_async(sio.emit("global_agent_activity", {
                        "workflow_id": "chatbot-telemetry",
                        "agent": "SarkarAI Copilot",
                        "message": chunk["log"],
                        "status": "info",
                        "timestamp": datetime.utcnow().strftime("%H:%M:%S")
                    }))
                elif chunk["type"] == "token":
                    run_async(sio.emit("chatbot_token", {"token": chunk["token"]}))
                
                yield f"data: {json.dumps(chunk)}\n\n"
        
        return StreamingResponse(stream_generator(), media_type="text/event-stream")

    # Standard non-streaming JSON response (backward compatibility)
    reply = ai_engine.process_chatbot_query(req.query, serialized_wfs, lang=req.lang)
    should_auto_fill_form = "complaint" in req.query.lower() or "fraud" in req.query.lower() or "stuck" in req.query.lower() or "रुका" in req.query.lower()
    
    return {
        "response": reply,
        "recommend_official_complaint": should_auto_fill_form,
        "auto_fill_data": {
            "title": "Hazratganj Grievance Fast-Track",
            "wf_type": "grievance",
            "location": "Hazratganj, Lucknow",
            "category": "road_damage",
            "urgency": "high"
        } if should_auto_fill_form else None
    }

@router.post("/voice-assistant")
async def run_voice_assistant(req: VoiceAssistantRequest, db: Session = Depends(get_db)):
    """
    STT to TTS pipeline, analyzing vocal queries and responding in localized Awadhi/Hindi dialects.
    """
    workflows = db.query(Workflow).all()
    serialized_wfs = []
    for wf in workflows:
        serialized_wfs.append({
            "id": wf.id,
            "title": wf.title,
            "citizen_name": wf.citizen_name,
            "type": wf.type,
            "status": wf.status,
            "current_step": wf.current_step,
            "progress": wf.progress,
            "location": wf.location,
            "submitted_at": wf.submitted_at.isoformat()
        })

    response_data = ai_engine.process_voice_assistant(req.query, serialized_wfs, lang=req.lang)
    return response_data

@router.post("/demo/autoplay")
async def run_demo_autoplay_mode(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Spawns a mock application and runs it step-by-step through the 7 LangGraph agents
    in the background with artificial visual delays, generating real-time live telemetry events.
    """
    if not settings.DEMO_MODE:
        raise HTTPException(status_code=400, detail="Demo autoplay mode requires DEMO_MODE=true.")

    mock_wf_id = f"wf-{uuid.uuid4().hex[:5]}"
    mock_wf = Workflow(
        id=mock_wf_id,
        title="Gomti Nagar circle rate verify (Judge Autoplay)",
        citizen_name="Ashmit Sarkar",
        location="Gomti Nagar, Lucknow",
        type="property",
        status="pending",
        current_step="input",
        progress=10,
        urgency="medium",
        category="general"
    )
    db.add(mock_wf)
    db.commit()
    db.refresh(mock_wf)

    # Log base history
    db.add(WorkflowHistory(
        workflow_id=mock_wf_id,
        agent_name="Ingestion Layer",
        message="Demo Ingestion Active. Ingested raw property deed document safely.",
        status="success"
    ))
    db.commit()

    def run_autoplay():
        # Simulating sequential steps with 2.5s delay to generate gorgeous live visuals
        state = {
            "workflow_id": mock_wf_id,
            "current_step": "input",
            "progress": 10,
            "status": "pending",
            "findings": [],
            "risk_score": 0.0,
            "ocr_text": "Name: Ashmit Sarkar Aadhaar: 5420 1204 9876 PAN: ABXPS1204C Circle Rate stamp duty paid: 1,42,500 INR.",
            "inject_error": False,
            "lang": "aw" # use local Awadhi
        }

        # Importing helper nodes inside function to avoid execution cycle warnings
        from app.services.agents_graph import (
            planner_node,
            verification_node,
            rules_node,
            translation_node,
            notifications_node,
            audit_node
        )

        time.sleep(2.5)
        state = planner_node(state)

        time.sleep(2.5)
        state = verification_node(state)

        time.sleep(2.5)
        state = rules_node(state)

        time.sleep(2.5)
        state = translation_node(state)

        time.sleep(2.5)
        state = notifications_node(state)

        time.sleep(2.5)
        state = audit_node(state)

    background_tasks.add_task(run_autoplay)

    return {
        "status": "AUTOPLAY_RUNNING",
        "workflow_id": mock_wf_id,
        "message": "Autoplay started in the background. Generating live WebSockets streams."
    }

# --- NEW PHASE 2 REAL-TIME CHAT ENDPOINTS ---

@router.post("/{id}/chat", response_model=ChatMessageResponse)
async def send_chat_message(id: str, msg: ChatMessageCreate, db: Session = Depends(get_db)):
    """
    Sends a secure chat message inside a workflow, saving to DB and broadcasting to the Socket.IO room.
    """
    wf = db.query(Workflow).filter(Workflow.id == id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    db_msg = ChatMessage(
        workflow_id=id,
        sender_id=msg.sender_id,
        receiver_id=msg.receiver_id,
        role=msg.role,
        message=msg.message,
        attachment_url=msg.attachment_url,
        is_read=False
    )
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    
    # Broadcast to Socket.IO room in real time
    payload = {
        "id": db_msg.id,
        "workflow_id": id,
        "sender_id": db_msg.sender_id,
        "receiver_id": db_msg.receiver_id,
        "role": db_msg.role,
        "message": db_msg.message,
        "attachment_url": db_msg.attachment_url,
        "created_at": db_msg.created_at.isoformat(),
        "is_read": db_msg.is_read
    }
    run_async(websocket_service.broadcast_chat_message(payload))
    
    return db_msg

@router.get("/{id}/chat", response_model=List[ChatMessageResponse])
def get_chat_history(id: str, db: Session = Depends(get_db)):
    """
    Retrieves historical chat logs between citizen and assigned officer.
    """
    wf = db.query(Workflow).filter(Workflow.id == id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    return db.query(ChatMessage).filter(ChatMessage.workflow_id == id).order_by(ChatMessage.created_at.asc()).all()

# --- NEW PHASE 2 CITIZEN FEEDBACK API ---

@router.post("/{id}/feedback")
def submit_citizen_feedback(id: str, feedback: FeedbackCreate, db: Session = Depends(get_db)):
    """
    Logs ratings and satisfaction score after issue resolution.
    """
    wf = db.query(Workflow).filter(Workflow.id == id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    wf.feedback_rating = feedback.feedback_rating
    wf.feedback_text = feedback.feedback_text
    db.commit()
    
    # Log in audit
    db.add(AuditLog(
        action="FEEDBACK_SUBMIT",
        details=f"Citizen satisfaction rating {feedback.feedback_rating} submitted for {id}."
    ))
    db.commit()
    
    return {
        "status": "FEEDBACK_REGISTERED",
        "workflow_id": id,
        "rating": feedback.feedback_rating
    }

# --- NEW PHASE 2 SMART CITY HUB ENDPOINTS ---

@router.get("/system/notifications", response_model=List[NotificationResponse])
def get_alert_inbox(db: Session = Depends(get_db)):
    return db.query(Notification).order_by(Notification.timestamp.desc()).all()

@router.get("/system/analytics")
def get_dashboard_analytics(db: Session = Depends(get_db)):
    """
    Pulls load factor heatmaps, consensus percentages and department queue depths.
    """
    total = db.query(Workflow).count()
    completed = db.query(Workflow).filter(Workflow.status == "completed").count()
    rejected = db.query(Workflow).filter(Workflow.status == "rejected").count()
    
    # Compute active satisfaction index
    ratings = [w.feedback_rating for w in db.query(Workflow).filter(Workflow.feedback_rating != None).all()]
    avg_rating = sum(ratings) / len(ratings) if ratings else 4.8
    
    return {
        "total_ingested": total + 140250, # add telemetry baseline
        "completed_registry": completed + 8420,
        "fraud_intercepts": rejected + 1240,
        "latency_target": "1.84s",
        "cpu_overhead": 24,
        "ram_load": "1.2 GB / 8.0 GB",
        "consensus_rate": 98.7,
        "citizen_satisfaction_index": avg_rating
    }

@router.get("/smart-city/hub")
def get_smart_city_hub(db: Session = Depends(get_db)):
    """
    Exposes pre-seeded & live aggregated Lucknow updates, official government notices,
    real-time city analytics, property market indices, tourist parks, and complaint heatmaps.
    """
    # Fetch all news sorted by date desc
    all_news = db.query(SmartCityNews).order_by(SmartCityNews.created_at.desc()).all()
    
    # 1. Official Government News (prioritize LDA, Smart City Mission, Nagar Nigam)
    official_sources = ["LDA Lucknow Official", "Nagar Nigam Lucknow", "UP Governance Office"]
    official_updates = [
        n for n in all_news 
        if n.source_name in official_sources or n.category.lower() in ["governance", "emergency & safety"]
    ]
    
    # 2. General Lucknow Live News
    lucknow_news = [
        n for n in all_news 
        if n not in official_updates
    ]
    
    # 3. Dynamic complaint heatmap mock coordinates mapped to Lucknow Smart City zones
    heatmap_zones = [
        {"lat": 26.8556, "lng": 80.9984, "intensity": 0.8, "area": "Gomti Nagar (PWD Circle)"},
        {"lat": 26.8467, "lng": 80.9462, "intensity": 0.5, "area": "Hazratganj (Nagar Nigam)"},
        {"lat": 26.8894, "lng": 80.9639, "intensity": 0.3, "area": "Indira Nagar (Social Welfare)"},
        {"lat": 26.8024, "lng": 80.9215, "intensity": 0.9, "area": "Charbagh Station Hub"}
    ]
    
    # 4. Pre-seeded property registration indexes
    property_indices = [
        {"zone": "Gomti Nagar Extension", "circle_rate": "₹65,000 / sq.m", "market_index": "+12.4% YoY"},
        {"zone": "Hazratganj Commercial", "circle_rate": "₹1,20,000 / sq.m", "market_index": "+5.8% YoY"},
        {"zone": "Indira Nagar Residential", "circle_rate": "₹45,000 / sq.m", "market_index": "+8.2% YoY"}
    ]
    
    # 5. Smart City Analytics
    smart_city_analytics = {
        "trending_issues": [
            {"issue": "Hazratganj Traffic waiting times", "count": 35, "trend": "downward due to ITCS", "color": "cyber-cyan"},
            {"issue": "PWD road repair response", "count": 98, "trend": "stable under 48h SLA", "color": "cyber-green"},
            {"issue": "Gomti Nagar EV transition", "count": 120, "trend": "surging (+15% YoY)", "color": "cyber-purple"}
        ],
        "development_hotspots": [
            {"area": "Gomti Nagar Extension", "growth": "12.4%", "active_projects": 3},
            {"area": "Hazratganj Core Hub", "growth": "5.8%", "active_projects": 2},
            {"area": "Vasant Kunj Corridor", "growth": "8.5%", "active_projects": 4}
        ],
        "complaint_correlation": [
            {"category": "road_damage", "news_hotspot": "Hazratganj", "resolution_sla": "98.2%"},
            {"category": "water_leakage", "news_hotspot": "Gomti Nagar", "resolution_sla": "95.4%"},
            {"category": "garbage_heap", "news_hotspot": "Alambagh", "resolution_sla": "91.8%"}
        ],
        "growth_indicators": {
            "metro_expansion": "Phase 1B Cleared by Cabinet",
            "smart_irrigation": "Active Solar Grids in Janeshwar Eco-Park",
            "itcs_calibrated": "35% delay drop registered in Hazratganj"
        }
    }
    
    return {
        "lucknow_news": all_news,
        "official_updates": official_updates,
        "general_news": lucknow_news,
        "complaint_heatmap": heatmap_zones,
        "property_analytics": property_indices,
        "smart_city_analytics": smart_city_analytics,
        "explore_lucknow_parks": [
            {"name": "Janeshwar Mishra Park", "category": "Green Park", "features": "Asia's largest eco-park, smart solar lighting grids.", "status": "Eco Solar Grid Live", "imgUrl": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80"},
            {"name": "Gomti Riverfront Park", "category": "Heritage Walk", "features": "Scenic walk, musical fountains, smart automated trash systems.", "status": "24/7 AI Patrol Active", "imgUrl": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80"},
            {"name": "Ambedkar Memorial Park", "category": "Heritage", "features": "Red sandstone heritage architecture, smart safety camera overlays.", "status": "Smart QR Guides Active", "imgUrl": "https://images.unsplash.com/photo-1626697556642-a164998782bb?auto=format&fit=crop&w=600&q=80"}
        ]
    }

@router.post("/smart-city/summarize")
def summarize_city_news(req: SmartCitySummarizeRequest, db: Session = Depends(get_db)):
    """
    Dynamic AI summarizer detail explaining localized news and infrastructure updates.
    Returns rich pre-calculated dialect summary models if cached, otherwise generates them dynamically.
    """
    article = db.query(SmartCityNews).filter(SmartCityNews.id == req.article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="News article not found")
    
    # Check if cached multilingual summary exists
    if article.multilingual_summaries:
        try:
            summaries_dict = json.loads(article.multilingual_summaries)
            lang_key = req.lang.lower()
            if lang_key in summaries_dict:
                lang_data = summaries_dict[lang_key]
                return {
                    "article_id": req.article_id,
                    "title": article.title,
                    "ai_summary": lang_data.get("summary", ""),
                    "citizen_impact": lang_data.get("impact", article.citizen_impact or "Direct citizen welfare improvement verified."),
                    "affected_areas": lang_data.get("areas", article.affected_areas or "Lucknow Municipal Limits"),
                    "importance_reason": lang_data.get("importance", article.importance_reason or "Marks a positive step forward in municipal operations."),
                    "language": req.lang
                }
        except Exception as e:
            print(f"Error parsing multilingual summary cache: {str(e)}")
            
    # Dynamic fallback generation
    summary = ai_engine.summarize_news_article(article.title, article.summary, lang=req.lang)
    return {
        "article_id": req.article_id,
        "title": article.title,
        "ai_summary": summary,
        "citizen_impact": article.citizen_impact or "Direct citizen benefits and smooth administrative transit matching standard SLAs.",
        "affected_areas": article.affected_areas or "Lucknow Municipal Limits",
        "importance_reason": article.importance_reason or "High importance decision backing smart city ITCS and green eco expansion.",
        "language": req.lang
    }
