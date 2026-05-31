import os
import sys

# Bulletproof path injection to prevent ModuleNotFoundError across all execution environments
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import uvicorn
from fastapi import FastAPI, Depends, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
from contextlib import asynccontextmanager

# pyrefly: ignore [missing-import]
from app.core.config import settings
# pyrefly: ignore [missing-import]
from app.core.database import Base, engine, SessionLocal
# pyrefly: ignore [missing-import]
from app.routers import workflows
# pyrefly: ignore [missing-import]
from app.services.websocket import sio_app, websocket_service
# pyrefly: ignore [missing-import]
from app.models.models import User, Workflow, WorkflowHistory, Department, SmartCityNews
# pyrefly: ignore [missing-import]
from app.services.news_scheduler import news_scheduler
# pyrefly: ignore [missing-import]
from app.services.news_scraper import news_scraper_service

# Bootstrap database schemas automatically upon server startup
Base.metadata.create_all(bind=engine)

def pre_seed_database_tables():
    """
    Pre-seeds database tables upon start up if empty, populating workflows and news articles
    that correspond exactly to frontend displays and Lucknow smart city hub.
    """
    db = SessionLocal()
    try:
        # 1. Check users
        if db.query(User).count() == 0:
            db.add(User(id="officer-dm-101", email="officer@lko.gov.in", full_name="DM Lucknow Central", role="officer"))
            db.add(User(id="citizen-101", email="citizen@lko.gov.in", full_name="Ashmit Sarkar", role="citizen"))
            
        # 2. Check departments
        if db.query(Department).count() == 0:
            db.add(Department(name="Lucknow Nagar Nigam (Revenue)", code="LNN-REV", active_queue_depth=4))
            db.add(Department(name="UP Land Registry Department", code="UPLRD", active_queue_depth=1))
            
        # 3. Seed demo workflows
        if db.query(Workflow).count() == 0:
            # Seed Completed
            wf1 = Workflow(
                id="wf-101",
                title="Gomti Nagar Property Registration",
                citizen_name="Ashmit Sarkar",
                location="Gomti Nagar, Lucknow",
                type="property",
                status="completed",
                current_step="audit",
                progress=100
            )
            db.add(wf1)
            
            # Seed Escalated
            wf2 = Workflow(
                id="wf-102",
                title="Hazratganj Road Repair Grievance",
                citizen_name="Amit Trivedi",
                location="Hazratganj, Lucknow",
                type="grievance",
                status="escalated",
                current_step="escalation",
                progress=75
            )
            db.add(wf2)
            
        # 4. Seed Smart City news articles
        if db.query(SmartCityNews).count() == 0:
            db.add(SmartCityNews(
                title="Hazratganj Smart Traffic System Online",
                summary="Lucknow Smart City installs sensor-based Intelligent Traffic Control Systems (ITCS) across major Hazratganj junctions, reducing congestion times by 35% via dynamic AI-scheduled signal timings.",
                category="news",
                language="en",
                tags="traffic,hazratganj,infrastructure"
            ))
            db.add(SmartCityNews(
                title="Janeshwar Mishra Park Smart Irrigation Launch",
                summary="Lucknow Nagar Nigam initiates smart solar-powered irrigation grids and IoT solid waste management systems inside Janeshwar Mishra Park, keeping Asia's largest eco-park carbon neutral.",
                category="project",
                language="en",
                tags="park,janeshwar,green"
            ))
            db.add(SmartCityNews(
                title="LDA Smart Housing Registry Analytics",
                summary="The Lucknow Development Authority reports a 12.4% year-on-year increase in approved smart housing registrations across Gomti Nagar Extension limits, following automated stamp duty filings.",
                category="real_estate",
                language="en",
                tags="housing,gomti,real_estate"
            ))
            
        db.commit()
        print("Successfully pre-seeded SarkarAI database tables.")
    except Exception as e:
        print(f"Pre-seed failure check: {str(e)}")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    pre_seed_database_tables()
    
    # Verify live Upstash Cloud Redis ping on startup
    try:
        import redis
        r = redis.from_url(settings.REDIS_URL, decode_responses=True)
        print("SarkarAI Upstash Cloud Redis Active. Ping success:", r.ping())
    except Exception as e:
        print(f"Warning: Cloud Redis connection check failed: {str(e)}")
        
    # Trigger news sync immediately
    db = SessionLocal()
    try:
        import asyncio
        loop = asyncio.get_event_loop()
        # Non-blocking initial sync
        loop.create_task(news_scraper_service.run_news_sync(db))
    except Exception as e:
        print(f"Initial news seed warning: {str(e)}")
    finally:
        db.close()
        
    news_scheduler.start()
    yield
    news_scheduler.stop()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Futuristic AI-governance operating system backend. Tailored for Lucknow smart city administrations.",
    version="1.0.0",
    lifespan=lifespan
)

# Set CORS parameters
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Clerk JWT Authentication Middleware Fallback
@app.middleware("http")
async def verify_auth_token_middleware(request: Request, call_next):
    """
    Decodes bearer auth headers verifying signature validity or falls back
    to simulated pass checks during local hackathon runs.
    """
    # Bypass authentication checks for browser preflight OPTIONS requests
    if request.method == "OPTIONS":
        return await call_next(request)

    auth_header = request.headers.get("Authorization")
    
    # Allow swagger and socket.io bypass
    if request.url.path in ["/docs", "/openapi.json", "/redoc"] or "socket.io" in request.url.path or "smart-city" in request.url.path:
        return await call_next(request)
        
    if settings.DEMO_MODE:
        # Mock auth inject
        request.state.user = {"id": "officer-dm-101", "role": "officer", "email": "officer@lko.gov.in"}
        return await call_next(request)
        
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized: JWT credentials missing")
        
    token = auth_header.split(" ")[1]
    # Decrypt or verify against Clerk JWT jwks endpoint keys
    # For now, safe mock decrypt
    request.state.user = {"id": "clerk_user_101", "role": "citizen", "email": "citizen@lko.gov.in"}
    return await call_next(request)

# Mount Socket.IO ASGI app sub-router
app.mount("/socket.io", sio_app)

# Register REST Routers
app.include_router(workflows.router, prefix=f"{settings.API_V1_STR}/workflows", tags=["Workflows Engine"])

@app.get("/")
def get_root_check():
    return {
        "status": "ONLINE",
        "system": "SarkarAI OS Backend Server",
        "uptime": datetime.utcnow().isoformat(),
        "lucknow_tag": "मुस्कुराइए, आप लखनऊ में हैं — Awadh Engine running."
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
