from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: str = "citizen"

class UserCreate(UserBase):
    id: str # Clerk auth ID

class UserResponse(UserBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Document Schemas
class DocumentResponse(BaseModel):
    id: int
    workflow_id: str
    name: str
    url: str
    size: str
    status: str

    class Config:
        from_attributes = True

# Workflow History
class WorkflowHistoryResponse(BaseModel):
    id: int
    agent_name: str
    message: str
    status: str
    timestamp: datetime

    class Config:
        from_attributes = True

# Approval Schemas
class ApprovalCreate(BaseModel):
    decision: str # approved, rejected
    remarks: Optional[str] = None

class ApprovalResponse(BaseModel):
    id: int
    workflow_id: str
    officer_id: Optional[str] = None
    decision: str
    risk_score: float
    remarks: Optional[str] = None
    signed_at: datetime

    class Config:
        from_attributes = True

# Workflow Schemas
class WorkflowCreate(BaseModel):
    title: str
    citizen_name: str
    location: str
    type: str # property, grievance, pension
    doc_name: str
    doc_size: str = "1.5 MB"

class WorkflowResponse(BaseModel):
    id: str
    title: str
    citizen_name: str
    location: str
    type: str
    status: str
    current_step: str
    progress: int
    submitted_at: datetime
    documents: List[DocumentResponse] = []
    histories: List[WorkflowHistoryResponse] = []

    class Config:
        from_attributes = True

# Notification Schemas
class NotificationResponse(BaseModel):
    id: str
    title: str
    description: str
    type: str
    read: bool
    timestamp: datetime

    class Config:
        from_attributes = True

# Analytics Schemas
class AnalyticsResponse(BaseModel):
    id: int
    metric_name: str
    value: float
    timestamp: datetime

    class Config:
        from_attributes = True
