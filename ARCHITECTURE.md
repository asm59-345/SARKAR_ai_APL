# 🏛️ SarkarAI OS — Master System Architecture Blueprint

This document details the complete, high-fidelity system architecture, agentic orchestration layers, database schemas, and real-time communications flow of **SarkarAI OS**—a futuristic AI-powered sovereign operating system engineered for the **Lucknow Municipal Administration (Lucknow Nagar Nigam)** and the **Lucknow Development Authority (LDA)**.

---

## 🗺️ 1. Multi-Layer System Topology

SarkarAI OS utilizes a decoupled, modern asynchronous architecture optimized for local low-latency responses, resilient API caching, and real-time notifications:

```mermaid
graph TB
    subgraph Client Tier [Next.js 15 App Router - React Client]
        UI[Glassmorphic Responsive UI] -->|Direct Route| Prefetch[Prefetch Router Core]
        UI -->|State Management| State[Zustand Local Cache]
        UI -->|Event Listener| WS_Client[socket.io-client]
    end

    subgraph API Gateway [FastAPI / Uvicorn Server - Port 8000]
        B[REST Controllers / routers/workflows.py] -->|Verify Auth| JWT[Demo Auth Middleware]
        B -->|Lifespan Setup| WS_Server[python-socketio AsyncServer]
    end

    subgraph Cognitive Engine [Awadh Intelligence Layer]
        AI[google-genai Client] -->|Model: gemini-2.5-pro| Planner[Multi-Agent Graph Planner]
        AI -->|Model: gemini-2.5-flash| Classifier[NLP Auto-Classifier]
        AI -->|Model: text-embedding-004| Embeddings[Cosine RAG Retrieval]
    end

    subgraph Data & Caching Tier
        DB[(SQLite / Postgres Engine)]
        Redis[(Upstash Cloud Redis)]
    end

    subgraph Daemon Services [Background Task Workers]
        Sched[news_scheduler.py Thread] -->|Polls every 5m| Scrape[news_scraper.py]
    end

    %% Communication Flows
    UI -->|JSON REST Requests| B
    WS_Client <==>|Bi-directional WebSocket| WS_Server
    B -->|Schema Check & Writes| DB
    B -->|Connection Verification r.ping| Redis
    B -->|Invokes Cognitive Layer| AI
    Scrape -->|Scrapes 7 Local Sources| AI
    Scrape -->|Saves news & pre-caches summaries| DB
    Scrape -->|Emits smart_city_news_update| WS_Server
```

---

## 🧠 2. Cognitive Agentic Orchestration & Emergency Fast-Track

The system features an advanced multi-agent workflow engine. When a citizen files a grievance, it is passed through an intelligent auto-classification pipeline with a critical **Emergency Bypass Bypass** built directly into the graph:

```mermaid
graph TD
    Start([Citizen Logs Grievance]) --> Classifier{NLP Auto-Classifier}
    
    %% Classification Checks
    Classifier -->|Standard Query| Normal[Standard Route]
    Classifier -->|Urgency: Critical OR Category: emergency/women_safety/fire/corruption| Emergency[Emergency Bypass Route]

    %% Standard Flow
    Normal --> Step1[Planner Agent: Structure workflow timeline]
    Step1 --> Step2[Verification Agent: Crosscheck KYC Aadhaar]
    Step2 --> Step3[Rules Agent: Inspect municipal laws]
    Step3 --> Step4[Officer Review: Standard queue depth]
    Step4 --> Seal[Cryptographic Registry Seal SHA-256]

    %% Emergency Flow
    Emergency --> FastTrack[Fast-Track: Set workflow progress directly to 90%]
    FastTrack --> RouteSpecial[Route to Specialist: Assign high-priority department division]
    RouteSpecial --> ImmediateAction[Immediate Dispatch / Action]
    ImmediateAction --> Seal

    Seal --> Done([Completed SLA Resolution])
```

### Cognitive Operations:
1. **Auto-Classification**: Processes natural language descriptors, extracts categories (e.g. `water_leakage`, `women_safety`), and scores priority levels (`low`, `medium`, `critical`).
2. **Specialist Department Assignment**: Matches issues dynamically with correct municipal divisions (*Jal Sansthan*, *UP Land Registry*, *Lucknow CMO*, or specialized *Police Commissions*).
3. **Ledger Integrity Seals**: Upon resolution, hashes citizen data via SHA-256 to generate an official cryptographic governance proof certificate.

---

## 🗄️ 3. Database Relational Schemas

SarkarAI OS incorporates a **Safe Additive Auto-Migration System** (`database.py`) that scans the SQL metadata at startup. If columns are missing, they are appended dynamically without locking tables, losing records, or crashing existing structures.

```mermaid
erDiagram
    USER {
        string id PK
        string email
        string full_name
        string role
    }
    DEPARTMENT {
        integer id PK
        string name
        string code
        integer active_queue_depth
    }
    WORKFLOW {
        string id PK
        string title
        string citizen_name
        string location
        string type
        string status
        string current_step
        integer progress
        string urgency "Safe Additive Migration Column"
        string category "Safe Additive Migration Column"
        integer feedback_rating "Safe Additive Migration Column"
        string feedback_text "Safe Additive Migration Column"
    }
    WORKFLOW_HISTORY {
        integer id PK
        string workflow_id FK
        string step_name
        string status
        datetime completed_at
        string details
    }
    SMART_CITY_NEWS {
        integer id PK
        string title
        string summary
        string category
        string language
        string tags
        string source_name "Safe Additive Migration Column"
        string source_logo "Safe Additive Migration Column"
        string affected_areas "Safe Additive Migration Column"
        string importance_reason "Safe Additive Migration Column"
        string citizen_impact "Safe Additive Migration Column"
        string multilingual_summaries "Safe Additive Migration Column [JSON Data]"
    }

    USER ||--o{ WORKFLOW : registers
    WORKFLOW ||--o{ WORKFLOW_HISTORY : contains
```

---

## 📡 4. Real-Time Communications & WebSocket CORS Architecture

To ensure immediate visual updates without page refreshes, SarkarAI OS establishes bidirectional WebSockets connected directly to the user dashboard.

### CORS Conflict Resolution
* **The Problem**: Duplicate CORS headers occurred because both FastAPI’s `CORSMiddleware` and Socket.IO’s `AsyncServer` independently appended `Access-Control-Allow-Origin` headers.
* **The Architecture**:
  1. CORS checking is completely disabled inside python-socketio by configuring `cors_allowed_origins=[]` inside the constructor.
  2. All CORS validation is unified under FastAPI's `CORSMiddleware` configuration block in `main.py`.
  3. This delegative structure routes handshakes cleanly, resolving CORS handshaking locks:

```text
[Browser Client] <== /socket.io Connection ==> [FastAPI CORSMiddleware] (Unified Header Injection)
                                                          ||
                                              [socketio.AsyncServer] (Header Checks Bypassed)
```

---

## 🗃️ 5. Upstash Cloud Redis Integration

SarkarAI OS utilizes secure Upstash Cloud Redis to back cache parameters, maintain quick API rate limits, and provide robust, low-latency key-value cache indexes:
* **Connection Layer**: Swaps local broker threads with secure `rediss://` TLS-wrapped protocols.
* **Resilience Framework**: Validates the cloud socket status upon lifespan boot. If the cloud database fails, it triggers a graceful local thread fallback so dashboard telemetry remains fully active.

```text
[FastAPI lifespans] ──> check settings.REDIS_URL ──> r.ping() 
                                                          │
                                         ┌────────────────┴────────────────┐
                                         ▼                                 ▼
                                  [Ping Success: True]           [Graceful Fallback]
                            Cloud Cache & Queues Active     Local memory simulation activated
```

---

## 📁 6. Technical Stack Reference

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Core** | Next.js 15, React 19, TypeScript | Core application logic, layout components, and static rendering |
| **Styling & UI** | Tailwind CSS | Sleek glassmorphism overlay grids, neon glows, and dark typography |
| **Fonts & Typography**| Google Fonts (Roboto) | High-fidelity readable administrative and citizen layouts |
| **Backend Framework** | FastAPI (ASGI), Uvicorn | High-performance, asynchronous REST API and WebSocket host |
| **AI Models & SDK** | google-genai, Gemini 2.5 Pro & Flash | Multi-class classifications, dialect summarizations, and agent graphs |
| **Real-time Pipeline**| python-socketio, socket.io-client | Live timeline logging, breaking news marquee ticks, and chat rooms |
| **Database ORM** | SQLAlchemy, SQLite (fallback), Postgres | Relational data management and dynamic runtime auto-migrations |
| **Caching Broker** | Upstash Cloud Redis, redis-py | Global cache pool, state sync registers, and rate limeters |
