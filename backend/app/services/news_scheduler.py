import asyncio
import threading
import time
from datetime import datetime
from app.core.database import SessionLocal
from app.services.news_scraper import news_scraper_service
from app.services.websocket import websocket_service, sio
from app.services.workflow import run_async

class NewsScheduler:
    def __init__(self):
        self.scheduler_thread = None
        self._stop_event = threading.Event()
        self.is_running = False

    def start(self):
        if self.is_running:
            return
        self.is_running = True
        self._stop_event.clear()
        self.scheduler_thread = threading.Thread(target=self._run_loop, daemon=True)
        self.scheduler_thread.start()
        print("SarkarAI News Aggregation Scheduler Thread spawned successfully.")

    def stop(self):
        if not self.is_running:
            return
        self._stop_event.set()
        self.is_running = False
        if self.scheduler_thread:
            self.scheduler_thread.join(timeout=2.0)
        print("SarkarAI News Scheduler stopped.")

    def _run_loop(self):
        # Allow server to fully boot up before first run
        time.sleep(10)
        
        while not self._stop_event.is_set():
            print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Launching Lucknow live news aggregation sync...")
            db = SessionLocal()
            try:
                # Sync news in a synchronous manner under this thread
                # This will populate sqlite db and generate multi-lingual summaries
                # Let's run the sync!
                # Since fetch is async in our service, let's execute it synchronously or via asyncio run loop
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                loop.run_until_complete(news_scraper_service.run_news_sync(db))
                
                # Emit global WebSocket alert for the feed!
                run_async(websocket_service.broadcast_smart_city_update({
                    "id": "news-sync-event",
                    "title": "📰 Live City News Synced",
                    "message": "SarkarAI Live News aggregated new headlines from TOI, Dainik Jagran, and Amar Ujala.",
                    "timestamp": datetime.utcnow().strftime("%H:%M:%S")
                }))
                
                # Mirror as a global live notification so it flashes instantly on dashboards
                run_async(websocket_service.send_live_notification({
                    "id": "news-sync-notif",
                    "title": "📰 Live Lucknow Updates Synced",
                    "description": "SarkarAI aggregated fresh Lucknow news and compiled multi-lingual citizen impact reports.",
                    "type": "info"
                }))
                
            except Exception as e:
                print(f"News aggregation sync cycle warning: {str(e)}")
            finally:
                db.close()
                
            # Sleep for 5 minutes (300s) before next check
            # We check _stop_event frequently to stop instantly if app shuts down
            for _ in range(30):
                if self._stop_event.is_set():
                    break
                time.sleep(10)

news_scheduler = NewsScheduler()
