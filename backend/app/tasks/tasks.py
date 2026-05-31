import time
from datetime import datetime, timedelta
# pyrefly: ignore [missing-import]
from app.tasks.celery_app import celery_app
# pyrefly: ignore [missing-import]
from app.core.database import SessionLocal
# pyrefly: ignore [missing-import]
from app.models.models import Workflow, WorkflowHistory, Notification
# pyrefly: ignore [missing-import]
from app.services.ocr import ocr_service
# pyrefly: ignore [missing-import]
from app.services.workflow import workflow_service, run_async
# pyrefly: ignore [missing-import]
from app.services.websocket import websocket_service

@celery_app.task(name="app.tasks.process_ocr_task")
def process_ocr_task(workflow_id: str, file_path: str):
    """
    Asynchronous Celery task processing image thresholding, Tesseract text extraction,
    Aadhaar/PAN matching and database commit.
    """
    db = SessionLocal()
    try:
        wf = db.query(Workflow).filter(Workflow.id == workflow_id).first()
        if not wf:
            return f"Workflow {workflow_id} not found."

        # Emit processing start log via Socket.IO
        run_async(websocket_service.stream_agent_activity(
            workflow_id, 
            "Verification Agent", 
            "Asynchronous Celery task started. Initializing OpenCV filters...", 
            "info"
        ))
        
        # Simulate heavy processing lag
        time.sleep(3)
        
        # Ingest document
        ocr_results = ocr_service.process_document(file_path)
        
        # Update history
        hist = WorkflowHistory(
            workflow_id=workflow_id,
            agent_name="Verification Agent",
            message=f"Celery completed OCR check. Identity name check match details successfully extracted. Confidence: {ocr_results['confidence_score']}%",
            status="success" if ocr_results["confidence_score"] > 60 else "warning"
        )
        db.add(hist)
        
        wf.current_step = "ocr"
        wf.progress = 35
        db.commit()

        # Emit updates
        run_async(websocket_service.stream_agent_activity(
            workflow_id, 
            "Verification Agent", 
            f"Celery finished! Findings: {', '.join(ocr_results['missing_fields'])} if any.", 
            "success"
        ))
        
        return f"OCR finished for workflow {workflow_id}"
    except Exception as e:
        return f"OCR failed: {str(e)}"
    finally:
        db.close()

@celery_app.task(name="app.tasks.escalate_delayed_workflows_task")
def escalate_delayed_workflows_task():
    """
    SLA escalation daemon checker. Scans pending workflows; if a case has been
    idle for more than 5 minutes, auto-escalates it and alerts commissioners.
    """
    db = SessionLocal()
    try:
        # pyrefly: ignore [deprecated]
        cutoff = datetime.utcnow() - timedelta(minutes=5)
        stale_wfs = db.query(Workflow).filter(
            Workflow.status == "pending",
            Workflow.updated_at < cutoff
        ).all()

        for wf in stale_wfs:
            wf.status = "escalated"
            
            # Log history
            hist = WorkflowHistory(
                workflow_id=wf.id,
                agent_name="Escalation Agent",
                message=f"SLA violation detected. Delay exceed 5 minutes. Auto-escalating approval authority to Lucknow DM.",
                status="warning"
            )
            db.add(hist)
            
            # Emit live socket notification
            run_async(websocket_service.send_live_notification({
                "id": wf.id,
                "title": "SLA Delay Auto-Escalated",
                "description": f"{wf.title} auto-escalated due to administrative review delay.",
                "type": "escalation",
                # pyrefly: ignore [deprecated]
                "timestamp": datetime.utcnow().strftime("%H:%M:%S")
            }))
            
        db.commit()
        return f"SLA check run completed. Escalated {len(stale_wfs)} cases."
    except Exception as e:
        return f"Escalation loop error: {str(e)}"
    finally:
        db.close()
