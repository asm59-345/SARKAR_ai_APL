import os
import sys
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Append the project backend directory to PYTHONPATH
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import Base
from app.models.models import Workflow, WorkflowHistory
from app.services.ai_engine import ai_engine
from app.services.agents_graph import langgraph_orchestrator

# Setup memory-isolated SQLite database engine for testing
TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    """
    Spins up and teardowns isolated in-memory testing tables automatically.
    """
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session():
    """
    Session transaction fixture ensuring cleanup.
    """
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_embeddings_generation():
    """
    Asserts semantic embeddings calculate consistent arrays (768 dimensions).
    """
    text = "Lucknow Smart City Revenue property Circle Rate"
    vec = ai_engine.get_embedding(text)
    assert isinstance(vec, list)
    assert len(vec) == 768
    assert all(isinstance(val, float) for val in vec)

def test_rag_semantic_retrieval():
    """
    Asserts RAG cosine similarity yields correct policy context matching for queries.
    """
    query = "pension income ceiling guidelines"
    context_docs = ai_engine.retrieve_context(query, top_k=1)
    assert len(context_docs) == 1
    assert "Pension" in context_docs[0]["title"]
    assert "income" in context_docs[0]["content"].lower()

def test_multilingual_dialect_matrix():
    """
    Asserts dialect response generation routes appropriately.
    """
    context = "UP old-age eligibility threshold: age 60+, income ceiling limits met."
    query = "Is my pension verified?"
    
    # Awadhi
    awadhi_res = ai_engine.generate_response(query, context, lang="aw")
    assert any(term in awadhi_res for term in ["अम्मा", "भैया", "चिंता", "पेंशन"])
    
    # Hindi
    hindi_res = ai_engine.generate_response(query, context, lang="hi")
    assert any(term in hindi_res for term in ["प्रणाम", "सत्यापन", "पेंशन", "स्वीकृति"])
    
    # Hinglish
    hinglish_res = ai_engine.generate_response(query, context, lang="hl")
    assert any(term in hinglish_res.lower() for term in ["pension", "approve", "complete", "stuck"])

def test_ocr_fraud_and_anomaly_scanner():
    """
    Asserts validation scanner correctly flags suspicious coordinates and duplicate claims.
    """
    tampered_text = "TAMPERED PROPERTY FILE: duplicate coordinates mismatch outside Lucknow boundary."
    fraud_res = ai_engine.analyze_document_fraud(tampered_text)
    assert fraud_res["fraud_detected"] is True
    assert fraud_res["risk_score"] == 99.8
    assert len(fraud_res["findings"]) >= 2
    assert "FRAUD" in fraud_res["findings"][0] or "ANOMALY" in fraud_res["findings"][1]

def test_7_agent_langgraph_isolated_execution(db_session):
    """
    Executes compiled 7-agent LangGraph workflow end-to-end verifying state persistence.
    """
    wf_id = "wf-test-pytest-101"
    
    # Setup database record using mock Testing Session overrides
    # Import override references
    from app.core import database
    original_session_local = database.SessionLocal
    database.SessionLocal = TestingSessionLocal # override SessionLocal
    
    try:
        wf = Workflow(
            id=wf_id,
            title="Hazratganj Road Repair Grievance",
            citizen_name="Amit Trivedi",
            location="Hazratganj, Lucknow",
            type="grievance",
            status="pending",
            current_step="input",
            progress=10
        )
        db_session.add(wf)
        db_session.commit()
        
        initial_state = {
            "workflow_id": wf_id,
            "current_step": "input",
            "progress": 10,
            "status": "pending",
            "findings": [],
            "risk_score": 0.0,
            "ocr_text": "Hazratganj pothole road repair grievance uploaded.",
            "inject_error": False,
            "lang": "en"
        }
        
        # Invoke compiled StateGraph
        final_state = langgraph_orchestrator.invoke(initial_state)
        
        assert final_state["current_step"] == "audit"
        assert final_state["progress"] == 100
        
        # Verify DB entries
        db_session.expire_all()
        wf_record = db_session.query(Workflow).filter(Workflow.id == wf_id).first()
        assert wf_record is not None
        assert wf_record.status == "completed"
        assert wf_record.progress == 100
        
        histories = db_session.query(WorkflowHistory).filter(WorkflowHistory.workflow_id == wf_id).all()
        assert len(histories) >= 6
        assert histories[-1].agent_name == "Audit Agent"
        
    finally:
        database.SessionLocal = original_session_local # revert
