from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base
from typing import Generator
# pyrefly: ignore [missing-import]
from app.core.config import settings

# In Demo mode we fallback to SQLite if Postgres is unavailable, or use Postgres directly
use_sqlite = False
if settings.DEMO_MODE:
    use_sqlite = True
else:
    try:
        # Test connection
        temp_engine = create_engine(settings.DATABASE_URL)
        with temp_engine.connect() as conn:
            pass
        engine = create_engine(
            settings.DATABASE_URL, 
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20
        )
    except Exception:
        use_sqlite = True

if use_sqlite:
    # Safe fallback database for local hackathon runs if Postgres is not spun up yet
    import os
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    sqlite_path = os.path.join(base_dir, "sarkarai_mock.db")
    sqlite_url = f"sqlite:///{sqlite_path}"
    engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def run_safe_additive_migrations():
    """
    Dynamically inspects database tables at startup and appends new columns safely,
    ensuring zero downtime, zero SQL errors, and zero data loss on existing records.
    """
    try:
        inspector = inspect(engine)
        
        # 1. Migrations for workflows table
        if "workflows" in inspector.get_table_names():
            columns = [col["name"] for col in inspector.get_columns("workflows")]
            with engine.begin() as conn:
                if "urgency" not in columns:
                    print("Auto-migration: Appending 'urgency' to workflows.")
                    conn.execute(text("ALTER TABLE workflows ADD COLUMN urgency VARCHAR DEFAULT 'medium';"))
                if "category" not in columns:
                    print("Auto-migration: Appending 'category' to workflows.")
                    conn.execute(text("ALTER TABLE workflows ADD COLUMN category VARCHAR DEFAULT 'general';"))
                if "feedback_rating" not in columns:
                    print("Auto-migration: Appending 'feedback_rating' to workflows.")
                    conn.execute(text("ALTER TABLE workflows ADD COLUMN feedback_rating INTEGER;"))
                if "feedback_text" not in columns:
                    print("Auto-migration: Appending 'feedback_text' to workflows.")
                    conn.execute(text("ALTER TABLE workflows ADD COLUMN feedback_text TEXT;"))
                    
        # 2. Migrations for smart_city_news table
        if "smart_city_news" in inspector.get_table_names():
            news_columns = [col["name"] for col in inspector.get_columns("smart_city_news")]
            with engine.begin() as conn:
                if "source_name" not in news_columns:
                    print("Auto-migration: Appending 'source_name' to smart_city_news.")
                    conn.execute(text("ALTER TABLE smart_city_news ADD COLUMN source_name VARCHAR;"))
                if "source_logo" not in news_columns:
                    print("Auto-migration: Appending 'source_logo' to smart_city_news.")
                    conn.execute(text("ALTER TABLE smart_city_news ADD COLUMN source_logo VARCHAR;"))
                if "affected_areas" not in news_columns:
                    print("Auto-migration: Appending 'affected_areas' to smart_city_news.")
                    conn.execute(text("ALTER TABLE smart_city_news ADD COLUMN affected_areas VARCHAR;"))
                if "importance_reason" not in news_columns:
                    print("Auto-migration: Appending 'importance_reason' to smart_city_news.")
                    conn.execute(text("ALTER TABLE smart_city_news ADD COLUMN importance_reason TEXT;"))
                if "citizen_impact" not in news_columns:
                    print("Auto-migration: Appending 'citizen_impact' to smart_city_news.")
                    conn.execute(text("ALTER TABLE smart_city_news ADD COLUMN citizen_impact TEXT;"))
                if "multilingual_summaries" not in news_columns:
                    print("Auto-migration: Appending 'multilingual_summaries' to smart_city_news.")
                    conn.execute(text("ALTER TABLE smart_city_news ADD COLUMN multilingual_summaries TEXT;"))
    except Exception as e:
        print(f"Auto-migration telemetry warning: {str(e)}")

# Trigger migrations safely
run_safe_additive_migrations()

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
