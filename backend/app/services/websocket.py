# pyrefly: ignore [missing-import]
import socketio
from typing import Dict, Any
# pyrefly: ignore [missing-import]
from app.core.config import settings

# Initialize Async Socket.IO Server supporting clean CORS rules
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins=[])
sio_app = socketio.ASGIApp(sio)

@sio.event
async def connect(sid, environ):
    print(f"Socket Client Connected: {sid}")
    await sio.emit("system_status", {"status": "ONLINE", "consensus": "98.7%"}, to=sid)

@sio.event
async def disconnect(sid):
    print(f"Socket Client Disconnected: {sid}")

@sio.event
async def join_workflow(sid, data: Dict[str, Any]):
    workflow_id = data.get("workflow_id")
    if workflow_id:
        sio.enter_room(sid, workflow_id)
        print(f"Client {sid} joined workflow room: {workflow_id}")
        await sio.emit("workflow_joined", {"workflow_id": workflow_id}, to=sid)

@sio.event
async def leave_workflow(sid, data: Dict[str, Any]):
    workflow_id = data.get("workflow_id")
    if workflow_id:
        sio.leave_room(sid, workflow_id)
        print(f"Client {sid} left workflow room: {workflow_id}")

class WebSocketService:
    async def stream_agent_activity(self, workflow_id: str, agent: str, message: str, status: str = "info"):
        """
        Streams character logs from running Celery task agents in real time.
        """
        payload = {
            "workflow_id": workflow_id,
            "agent": agent,
            "message": message,
            "status": status,
            "timestamp": datetime_string()
        }
        # Emit to the specific workflow room, and also broadcast globally to administrative dashboards
        await sio.emit("agent_activity", payload, room=workflow_id)
        await sio.emit("global_agent_activity", payload)

    async def stream_workflow_update(self, workflow_data: Dict[str, Any]):
        """
        Updates the React Flow node structures dynamically as steps progress.
        """
        await sio.emit("workflow_update", workflow_data, room=workflow_data.get("id"))
        await sio.emit("global_workflow_update", workflow_data)

    async def send_live_notification(self, notification_data: Dict[str, Any]):
        """
        Pushes critical warnings and DM vault approval overlays instantly.
        """
        await sio.emit("live_notification", notification_data)

    # --- NEW PHASE 2 SOCKET.IO EVENT EMITTERS ---

    async def send_emergency_alert(self, alert_data: Dict[str, Any]):
        """
        Fires live critical emergency alerts to administrative consoles instantly.
        """
        await sio.emit("emergency_alert", alert_data)
        # Also mirror as live notification for visual alerts
        await sio.emit("live_notification", {
            "id": alert_data.get("id", "alert-999"),
            "title": f"🚨 EMERGENCY: {alert_data.get('category', 'Critical').upper()}",
            "description": alert_data.get("message", "High priority escalation triggered."),
            "type": "escalation"
        })

    async def broadcast_chat_message(self, message_data: Dict[str, Any]):
        """
        Broadcasts citizen-officer chat messages inside the workflow room in real time.
        """
        wf_id = message_data.get("workflow_id")
        await sio.emit("chat_message", message_data, room=wf_id)

    async def broadcast_smart_city_update(self, update_data: Dict[str, Any]):
        """
        Dispatches real-time smart Lucknow alerts and project updates globally.
        """
        await sio.emit("smart_city_update", update_data)

def datetime_string() -> str:
    from datetime import datetime
    return datetime.utcnow().strftime("%H:%M:%S")

websocket_service = WebSocketService()
