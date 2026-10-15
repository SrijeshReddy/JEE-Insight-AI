# JEE Insight AI 🚀

**Understand Your Performance. Improve With Evidence.**

An AI-powered examination intelligence, cognitive behavior analysis, and personalized adaptive learning platform for **JEE Main & JEE Advanced** aspirants.

---

## 🌟 Architecture Overview (Stage 3 Completed)

JEE Insight AI is built with a decoupled modern architecture combining a React 19 client with a high-performance Python FastAPI relational backend and behavioral intelligence processing engines:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 19 + Vite 6)                    │
│   Dashboard • CBT Mock Engine • Diagnostics Autopsy • Study Planner    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ REST API (/api/v1) + Telemetry
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     BACKEND (FastAPI + SQLAlchemy)                     │
│  Authoritative Scoring • Invisible Telemetry • Behavioral Engines      │
├────────────────────────────────────────────────────────────────────────┤
│ • Mark-Loss Forensic Engine (Conceptual, Careless, Time, Unattempted)  │
│ • Speed vs. Accuracy 4-Quadrant Cognitive Pacing Matrix                │
│ • Recurring Mistake Detection (≥3 Consecutive Attempt Errors)          │
│ • Rule-Based Student Persona Archetype Classifier                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ SQLAlchemy ORM
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        DATABASE LAYER                                  │
│  PostgreSQL (Target Production) / SQLite (Local Windows Development)   │
│  Normalized Taxonomy (Subject → Unit → Chapter → Concept → Archetype)  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🗺️ Project Roadmap & Stage Tracking

| Stage | Focus Area | Technologies & Deliverables | Status |
| :---: | :--- | :--- | :---: |
| **Stage 1** | **System Blueprint & Requirements** | Pedagogical specs, 5-level taxonomy design, forensic diagnostic rules | **Completed** ✅ |
| **Stage 2** | **Frontend Website & CBT Engine** | React 19, TypeScript, Vite 6, dark mode, CBT engine, results autopsy, study planner | **Completed** ✅ |
| **Stage 3** | **Backend, Relational DB & Behavioral Engine** | FastAPI, SQLAlchemy, SQLite/PostgreSQL, authoritative scoring, invisible telemetry, 15 tests | **Completed & Verified** ✅ |
| **Stage 4** | **Data Science, Analytics & ML** | Concept weakness analysis, Item Response Theory (IRT), rank & percentile predictive modeling | **Up Next** ⏳ |
| **Stage 5** | **Real AI Coach (LLM Integration)** | Google Gemini API (`google-genai` SDK), Socratic guidance, error archetype remediation | **Pending** 📋 |
| **Stage 6** | **Integration, Polish & Deployment** | End-to-end smoke testing, Docker containerization, final defense demonstration | **Pending** 📋 |

*For complete stage-by-stage engineering plans, see [ROADMAP.md](ROADMAP.md).*

---

## 🛠️ Full Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API Client**: Centralized typed HTTP client (`src/services/apiClient.ts`) with seamless fallback & local storage synchronization
- **Styling**: Modern Vanilla CSS Design System with dark mode, glassmorphism, responsive typography, and micro-interactions

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **ORM / Database**: [SQLAlchemy 2.0](https://www.sqlalchemy.org/) with PostgreSQL driver (`psycopg2-binary`) and SQLite support
- **Validation**: [Pydantic v2](https://docs.pydantic.dev/) schemas
- **Server**: [Uvicorn](https://www.uvicorn.org/) with ASGI reload
- **Automated Testing**: [Pytest](https://docs.pytest.org/) with 15 passing integration tests

---

## 🚀 Quick Start on Windows

We provide one-click Windows batch scripts for effortless local launching:

### 1. Launch Entire Application (Backend + Frontend)
Double-click or run:
```cmd
start_all.bat
```
This automatically starts:
- **FastAPI Backend** on `http://127.0.0.1:8000` (seeds database if needed)
- **React Frontend** on `http://localhost:5173`
- Opens interactive Swagger documentation at `http://127.0.0.1:8000/docs`

### 2. Launch Backend Only
```cmd
start_backend.bat
```

### 3. Launch Frontend Only
```cmd
dev.bat
```

---

## 📦 Manual Setup & Installation

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create Python virtual environment
python -m venv .venv

# 3. Activate virtual environment (Windows PowerShell)
.\.venv\Scripts\Activate.ps1
# Or on Windows Command Prompt:
# .\.venv\Scripts\activate.bat

# 4. Install dependencies
pip install -r requirements.txt

# 5. Initialize & seed the database
python -m app.seed.seeder

# 6. Start the FastAPI backend server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Backend endpoints will be available at:
- **API Base**: `http://127.0.0.1:8000/api/v1`
- **Swagger Documentation**: `http://127.0.0.1:8000/docs`
- **ReDoc Documentation**: `http://127.0.0.1:8000/redoc`
- **Health Check**: `http://127.0.0.1:8000/api/v1/health`

### Frontend Setup

```bash
# 1. From root directory, install dependencies
npm install

# 2. Run type check and Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Database Architecture & PostgreSQL Setup

The project uses an environment-driven relational architecture via `DATABASE_URL`:

- **Local Windows Development (Default)**: `sqlite:///./jee_insight.db` (zero setup, fully persistent).
- **Production Relational Database (Blueprint Target)**: `postgresql://user:password@localhost:5432/jee_insight_ai`.

### To Run with PostgreSQL:
1. Ensure PostgreSQL is installed and the service is active on port 5432:
   ```sql
   CREATE DATABASE jee_insight_ai;
   ```
2. Update `backend/.env`:
   ```ini
   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/jee_insight_ai
   ```
3. Run the database seeder:
   ```bash
   python -m app.seed.seeder
   ```

### Relational Schema Tables:
1. `student_profiles`: User preferences, study hours, target score.
2. `subjects`, `units`, `chapters`, `concepts`, `error_archetypes`: 5-level taxonomy hierarchy.
3. `questions`: Question bank with subject/concept associations, options, answers, explanations, and marking scheme.
4. `mock_tests`: Test configuration, duration, positive/negative marking rules.
5. `test_attempts`: Authoritative attempt records, timestamps, score, accuracy, completion status.
6. `attempt_responses`: Question responses, option selected, correctness, time spent, review state.
7. `question_telemetry`: View duration without double-counting, visits, time-to-first-action, answer changes, review toggles.
8. `study_tasks`: Relational task manager with priority, completion state, and automated planner generation.

---

## 🧠 Behavioral Intelligence Engines

### 1. Authoritative Backend Scoring
- All scores are calculated authoritatively on the backend using the test's configured marking scheme (`+4` correct, `-1` incorrect, `0` unattempted).
- Built-in duplicate submission protection and transaction safety.

### 2. Four-Category Mark-Loss Forensic Autopsy
Dissects total lost marks into 4 categories:
- **Conceptual Mistakes**: High-difficulty questions where extended dwell time (>180s) ended in an error.
- **Careless Mistakes**: Fast responses (<45s) on standard questions or answers changed from right to wrong.
- **Time-Pressure Losses**: Excessive section latency causing rushed penalties.
- **Unattempted Opportunities**: Blank standard questions with forfeit +4 marks.
- **Mathematical Guarantee**: `Conceptual + Careless + Time + Unattempted = Total Mark Deficit` (No double-counting).

### 3. Speed vs. Accuracy 4-Quadrant Cognitive Matrix
- **Fast & Accurate (<90s, ≥75%)**: Mastered strengths.
- **Slow & Accurate (>150s, ≥75%)**: Pacing bottlenecks needing speed drills.
- **Fast & Inaccurate (<90s, <50%)**: Impulsive rushing and trap vulnerability.
- **Slow & Inaccurate (>150s, <50%)**: Critical conceptual weak points.

### 4. Recurring Mistake Detection
- Traces concept-level errors across attempts and triggers high-priority alerts when errors repeat in **≥3 consecutive attempts**.

### 5. Rule-Based Student Persona Archetype Classifier
- Classifies candidate behavior into archetypes (e.g., *Accurate but Slow Solver*, *Fast but Error-Prone Solver*, *Balanced Candidate*) with empirical evidence trails and data sufficiency validation.

---

## 🧪 Automated Testing

Run the automated backend test suite:

```bash
# From project root
backend\.venv\Scripts\pytest.exe backend\tests -v
```

15 unit & integration tests verify:
- Database initialization and persistence.
- Health checks and system versioning.
- Authoritative marking scheme (+4, -1, 0) and accuracy calculations.
- Full CBT attempt lifecycle (start, answer, telemetry, submit, duplicate protection).
- Mark-loss non-double-counting guarantees.
- Speed vs. accuracy quadrant thresholds.
- Recurring mistake detection (3 consecutive attempts).
- Student persona classification and data sufficiency handling.
- Study task CRUD and automated task generation.

---

## 📄 License

This project is licensed under the MIT License.
