from sqlalchemy.orm import Session
from typing import List, Optional
# pyrefly: ignore [missing-import]
from app.repositories.base import BaseRepository
# pyrefly: ignore [missing-import]
from app.models.models import User, Workflow, Notification, AuditLog, Department

class UserRepository(BaseRepository[User]):
    def __init__(self):
        super().__init__(User)
        
    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        return db.query(self.model).filter(self.model.email == email).first()

class WorkflowRepository(BaseRepository[Workflow]):
    def __init__(self):
        super().__init__(Workflow)

    def get_active_workflows(self, db: Session) -> List[Workflow]:
        return db.query(self.model).filter(self.model.status.in_(["pending", "active", "escalated"])).all()

class NotificationRepository(BaseRepository[Notification]):
    def __init__(self):
        super().__init__(Notification)

    def get_unread(self, db: Session) -> List[Notification]:
        return db.query(self.model).filter(self.model.read == False).order_by(self.model.timestamp.desc()).all()

class AuditLogRepository(BaseRepository[AuditLog]):
    def __init__(self):
        super().__init__(AuditLog)

    def log(self, db: Session, action: str, details: str, ip: Optional[str] = None) -> AuditLog:
        return self.create(db, {"action": action, "details": details, "ip_address": ip})

# Singletons for ease of dependency injection
user_repo = UserRepository()
workflow_repo = WorkflowRepository()
notification_repo = NotificationRepository()
audit_repo = AuditLogRepository()
