# JEE InsightAI — Official Project Roadmap & Stage Tracking 🗺️

**Tagline**: *Understand Your Performance. Improve With Evidence.*

---

## 📌 Development Lifecycle Status

| Stage | Focus Area | Technologies / Deliverables | Status |
| :---: | :--- | :--- | :---: |
| **Stage 1** | **System Blueprint & Requirements** | Pedagogical specs, 5-level taxonomy design, forensic diagnostic rules | **Completed** ✅ |
| **Stage 2** | **Frontend Website & CBT Engine** | React 19, TypeScript, Vite 6, dark mode, CBT engine, results autopsy, study planner | **Completed** ✅ |
| **Stage 3** | **Backend, Relational DB & Behavioral Engine** | FastAPI, SQLAlchemy, SQLite/PostgreSQL, authoritative scoring, invisible telemetry, 15 tests | **Completed & Verified** ✅ |
| **Stage 4** | **Data Science, Analytics & ML** | Concept weakness analysis, Item Response Theory (IRT), rank & percentile predictive modeling | **Up Next** ⏳ |
| **Stage 5** | **Real AI Coach (LLM Integration)** | Google Gemini API (`google-genai` SDK), Socratic guidance, error archetype remediation | **Pending** 📋 |
| **Stage 6** | **Integration, Polish & Deployment** | End-to-end smoke testing, Docker containerization, final defense demonstration | **Pending** 📋 |

---

## 🔍 Detailed Breakdown by Stage

### ✅ Stage 1 — Requirements & System Blueprint
- **Objective**: Establish the core architecture, cognitive examination model, and diagnostic rules.
- **Key Deliverables**:
  - 5-Level Concept Taxonomy: $\text{Subject} \to \text{Unit} \to \text{Chapter} \to \text{Concept} \to \text{Error Archetype}$.
  - Behavioral heuristic definitions (4-category mark-loss autopsy, speed-vs-accuracy 4 quadrants).
  - Negative marking penalty analysis formulation ($+4, -1, 0$).

---

### ✅ Stage 2 — Frontend Website
- **Objective**: Build a complete, responsive, modern web application for JEE candidates.
- **Technologies**: React 19, TypeScript, Vite 6, Vanilla CSS Design System, Lucide React.
- **Completed Components & Pages**:
  - `LandingPage`: Public platform overview and feature highlights.
  - `OverviewPage`: Performance dashboard, subject readiness meters, and study action cards.
  - `MockTestsPage`: Real-time CBT examination interface with question palette, timers, and subject switching.
  - `ResultsPage`: Diagnostic test autopsy with question-by-question explanations.
  - `AnalyticsPage`: Longitudinal subject, topic, and difficulty distribution analysis.
  - `WeakConceptsPage`: Evidence-based bottleneck priority matrix.
  - `StudyPlannerPage`: Adaptive day-by-day revision and drill scheduler.
  - `ScoreSimulatorPage`: What-if scenario modeling for score, accuracy, and negative marks.
  - `AICoachPage`: Pedagogical chat interface for study guidance.
  - `ProgressHistoryPage`: Historical benchmark tracking and test-to-test deltas.
  - `ProfileSettingsPage`: Student preferences, target score ($210/300$), and study schedule.

---

### ✅ Stage 3 — Backend, Database & Behavioral Intelligence Foundation
- **Objective**: Deliver a persistent relational database, authoritative server-side scoring, invisible telemetry tracking, and behavioral diagnostics.
- **Technologies**: Python FastAPI, SQLAlchemy 2.0, Pydantic v2, SQLite (`jee_insight.db`) / PostgreSQL ready, Pytest, Uvicorn.
- **Verified Deliverables**:
  - **Relational Schema**: 8 normalized tables (`student_profiles`, `subjects`, `units`, `chapters`, `concepts`, `error_archetypes`, `questions`, `mock_tests`, `test_attempts`, `attempt_responses`, `question_telemetry`, `study_tasks`).
  - **Authoritative Scoring**: Calculations performed on backend with duplicate submission prevention.
  - **Invisible CBT Telemetry**: Dwell duration without double-counting, hesitation latency to first action, answer switch counts, review toggles.
  - **4-Category Mark-Loss Engine**: Conceptual, Careless, Time-Pressure, and Unattempted losses with mathematical non-double-counting guarantees ($\sum \text{Losses} = \text{Total Deficit}$).
  - **Speed vs. Accuracy Matrix**: 4-quadrant cognitive pacing ($<90$s fast, $>150$s slow, $\ge 75\%$ accurate, $<50\%$ inaccurate).
  - **Consecutive Error Detector**: High-priority alert triggered on errors repeated across $\ge 3$ consecutive attempts.
  - **Rule-Based Student Persona Classifier**: Empirical archetype assignment with supporting telemetry evidence.
  - **Centralized API Client**: `src/services/apiClient.ts` with transparent offline fallback.
  - **Live Connection Status**: `🟢 Backend Connected` badge in application header.
  - **Automated Tests**: 15 passing integration tests (`backend/tests/`).
  - **One-Click Launchers**: `start_all.bat`, `start_backend.bat`, `dev.bat`.

---

### ⏳ Stage 4 — Data Science and ML (Up Next)
- **Objective**: Implement quantitative algorithms, latent trait estimation, and predictive performance intelligence.
- **Planned Work**:
  1. **Concept Weakness & Error Archetype Mining**:
     - Statistical aggregation of recurring errors across student cohorts.
     - Severity scoring based on concept weightage in JEE Main & Advanced.
  2. **Psychometric & Latent Ability Modeling (IRT)**:
     - 1PL / 2PL Item Response Theory model to estimate student ability ($\theta$) versus question difficulty ($\beta$) and discrimination ($\alpha$).
  3. **Predictive Percentile & Rank Bracket Estimator**:
     - Statistical calibration against historical NTA score-percentile distributions.
     - Explicit confidence intervals rather than fabricated exact rank claims.
  4. **Unsupervised Behavioral Clustering**:
     - K-Means / DBSCAN clustering on dwell time, accuracy, and review toggles to uncover latent problem-solving patterns.

---

### 📋 Stage 5 — Real AI Coach (Gemini API Integration)
- **Objective**: Replace prototype conversational responses with live, multimodal Google Gemini models.
- **Planned Work**:
  1. **SDK Integration**:
     - Official `google-genai` Python SDK implemented securely on the FastAPI backend (`POST /api/v1/coach/chat`).
     - Strict server-side API key protection (no keys exposed to client-side code).
  2. **Grounded Socratic Prompt Engineering**:
     - Inject real telemetry, error archetypes, and concept taxonomy into model context.
     - Provide step-by-step Socratic hints without spoiling full solutions prematurely.
  3. **Personalized Remediation Plans**:
     - Dynamic generation of customized multi-day revision routines based on recent exam losses.

---

### 📋 Stage 6 — Integration, Polish & Deployment
- **Objective**: Conduct comprehensive end-to-end testing, eliminate edge-case bugs, and deploy for evaluation.
- **Planned Work**:
  1. **End-to-End Testing**:
     - Automated browser flow verification (Start mock test $\to$ Answer $\to$ Telemetry $\to$ Submit $\to$ Autopsy $\to$ Study plan).
  2. **Containerization & Deployment**:
     - Multi-stage `Dockerfile` and `docker-compose.yml` for unified backend and frontend orchestration.
     - Cloud deployment configuration (e.g., Google Cloud Run / Render / Vercel).
  3. **Defense & Demonstration Packaging**:
     - Presentation walkthrough script, live examiner demo dataset, and architectural documentation.
