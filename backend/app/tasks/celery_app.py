from celery import Celery
# pyrefly: ignore [missing-import]
from app.core.config import settings

celery_app = Celery(
    "sarkarai_tasks",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
    enable_utc=True,
    imports=("app.tasks.tasks",)
)
