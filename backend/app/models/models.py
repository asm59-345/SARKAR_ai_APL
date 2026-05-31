from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
# pyrefly: ignore [missing-import]
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True) # Clerk ID or local ID
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(String, default="citizen", nullable=False) # citizen, officer, admin
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    approvals = relationship("Approval", back_populates="officer")

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    code = Column(String, nullable=False, unique=True)
    active_queue_depth = Column(Integer, default=0)

class Workflow(Base):
    __tablename__ = "workflows"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    citizen_name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    type = Column(String, nullable=False) # property, grievance, pension
    status = Column(String, default="pending", nullable=False) # pending, active, completed, escalated, rejected
    current_step = Column(String, default="input", nullable=False)
    progress = Column(Integer, default=10, nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # SAFE ADDITIONS - nullable columns preserving backward compatibility
    urgency = Column(String, default="medium", nullable=True) # low, medium, high, critical
    category = Column(String, default="general", nullable=True) # road_damage, women_safety, fire, corruption, etc.
    feedback_rating = Column(Integer, nullable=True) # 1 to 5 satisfaction
    feedback_text = Column(Text, nullable=True)
    
    documents = relationship("Document", back_populates="workflow", cascade="all, delete-orphan")
    approvals = relationship("Approval", back_populates="workflow", cascade="all, delete-orphan")
    histories = relationship("WorkflowHistory", back_populates="workflow", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="workflow", cascade="all, delete-orphan")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(String, ForeignKey("workflows.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    url = Column(String, nullable=False)
    size = Column(String, nullable=False)
    status = Column(String, default="uploaded", nullable=False) # uploaded, verified, failed
    
    workflow = relationship("Workflow", back_populates="documents")

class Approval(Base):
    __tablename__ = "approvals"
    
    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(String, ForeignKey("workflows.id", ondelete="CASCADE"), nullable=False)
    officer_id = Column(String, ForeignKey("users.id"), nullable=True)
    decision = Column(String, nullable=False) # approved, rejected, escalated
    risk_score = Column(Float, default=0.0)
    remarks = Column(Text, nullable=True)
    signed_at = Column(DateTime, default=datetime.utcnow)
    
    workflow = relationship("Workflow", back_populates="approvals")
    officer = relationship("User", back_populates="approvals")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    type = Column(String, default="info") # info, success, warning, escalation
    read = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    action = Column(String, nullable=False)
    details = Column(Text, nullable=False)
    ip_address = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Analytics(Base):
    __tablename__ = "analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    metric_name = Column(String, nullable=False, index=True)
    value = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class WorkflowHistory(Base):
    __tablename__ = "workflow_history"
    
    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(String, ForeignKey("workflows.id", ondelete="CASCADE"), nullable=False)
    agent_name = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String, nullable=False) # info, success, warning, error
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    workflow = relationship("Workflow", back_populates="histories")

class AgentState(Base):
    __tablename__ = "agent_states"
    
    id = Column(Integer, primary_key=True, index=True)
    agent_name = Column(String, nullable=False, unique=True)
    current_status = Column(String, default="idle")
    is_busy = Column(Boolean, default=False)
    last_active_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# NEW TABLE — ChatMessage (Secure citizen-officer real-time chat)
class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(String, ForeignKey("workflows.id", ondelete="CASCADE"), nullable=False)
    sender_id = Column(String, nullable=False) # e.g. "citizen-101" or "officer-dm-101"
    receiver_id = Column(String, nullable=True)
    role = Column(String, nullable=False) # "citizen" or "officer"
    message = Column(Text, nullable=False)
    attachment_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)
    
    workflow = relationship("Workflow", back_populates="chat_messages")

# NEW TABLE — SmartCityNews (Lucknow updates, infrastructure, and heritage trends)
class SmartCityNews(Base):
    __tablename__ = "smart_city_news"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    summary = Column(Text, nullable=False)
    category = Column(String, nullable=False) # news, project, real_estate, tourism, governance, infrastructure, smart_city, emergency
    image_url = Column(String, nullable=True)
    article_url = Column(String, nullable=True)
    language = Column(String, default="en")
    created_at = Column(DateTime, default=datetime.utcnow)
    ai_summary = Column(Text, nullable=True)
    tags = Column(String, nullable=True) # comma-separated tag list
    
    # Safe additions for live news integration
    source_name = Column(String, nullable=True)
    source_logo = Column(String, nullable=True)
    affected_areas = Column(String, nullable=True)
    importance_reason = Column(Text, nullable=True)
    citizen_impact = Column(Text, nullable=True)
    multilingual_summaries = Column(Text, nullable=True) # JSON string with en, hi, aw, hl summaries

