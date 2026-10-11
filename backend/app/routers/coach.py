import uuid
from datetime import datetime
from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.attempt import TestAttemptModel
from backend.app.schemas.coach import CoachChatRequest, CoachChatResponse, ActionLinkSchema

router = APIRouter(prefix="/coach", tags=["AI Performance Coach"])


@router.post("/chat", response_model=CoachChatResponse)
def coach_chat(
    payload: CoachChatRequest,
    db: Session = Depends(get_db)
):
    """
    AI Performance Coach dialog endpoint.
    Retrieves student's database attempt metrics and generates contextual guidance with structured deep links.
    Clearly labeled as prototype/heuristic intelligence until live Gemini integration.
    """
    msg = payload.message.lower().strip()
    msg_id = f"coach-msg-{int(datetime.utcnow().timestamp())}-{uuid.uuid4().hex[:4]}"
    now_str = datetime.utcnow().strftime("%I:%M %p")

    attempts = db.query(TestAttemptModel).filter(
        TestAttemptModel.status == "completed"
    ).order_by(TestAttemptModel.start_time.asc()).all()

    latest_attempt = attempts[-1] if attempts else None
    latest_score = latest_attempt.score if latest_attempt else 128.0
    latest_title = latest_attempt.test_title if latest_attempt else "Mock #8"

    # 1. Weak topics query
    if any(k in msg for k in ["weak", "struggl", "worst", "lowest", "bottleneck"]):
        response_text = (
            f"Based on your diagnostic database records across {len(attempts)} mock tests, your primary bottleneck is "
            "**Integral Calculus & Differential Equations** (34% accuracy) and **Rotational Dynamics** (38% accuracy). "
            f"In {latest_title}, these two topics contributed to excessive negative penalties. "
            "I recommend allocating a 60-minute daily session starting with parallel-axis theorem drills."
        )
        suggestions = ["Add weak topics to study plan", "Analyze my test time allocation", "How to avoid negative marks?"]
        links = [
            ActionLinkSchema(label="Inspect Weak Concepts", page="weak-concepts"),
            ActionLinkSchema(label="Add to Study Planner", page="study-planner", context="Rotational Dynamics")
        ]

    # 2. Study Plan query
    elif any(k in msg for k in ["plan", "schedule", "routine", "planner", "week"]):
        response_text = (
            "I have synthesized a high-yield revision roadmap from your recorded mark loss. "
            "Prioritize: (1) Mon: Rotational Dynamics derivations, (2) Tue: Definite integrals King's rule drills, "
            "(3) Wed: Chemical Thermodynamics Gibbs spontaneity criteria. "
            "Click below to sync these objectives into your interactive planner."
        )
        suggestions = ["Show my weakest topics", "Simulate score with +15 marks in Math", "Review latest mock results"]
        links = [
            ActionLinkSchema(label="Open Study Planner", page="study-planner"),
            ActionLinkSchema(label="View Weak Concepts Matrix", page="weak-concepts")
        ]

    # 3. Latest Test analysis
    elif any(k in msg for k in ["mock", "test", "result", "score", "performance", "exam"]):
        response_text = (
            f"In your latest recorded examination (**{latest_title}**), you scored **{latest_score:.0f}/300** with "
            f"an accuracy of {latest_attempt.accuracy if latest_attempt else 61.0}%. "
            "Your strongest area was Physical Chemistry, while Mathematics experienced pacing drag (155s per question). "
            "Would you like a forensic question-by-question breakdown?"
        )
        suggestions = ["Review question-by-question explanations", "Simulate what-if scenarios", "Create revision tasks"]
        links = [
            ActionLinkSchema(label="Review Latest Test Results", page="results"),
            ActionLinkSchema(label="Explore Score Simulator", page="score-simulator")
        ]

    # 4. Negative marks & speed query
    elif any(k in msg for k in ["negative", "guess", "time", "speed", "fast", "slow"]):
        response_text = (
            "Telemetry shows that approximately 40% of your negative marks stem from rapid answering (<45s) on deceptive easy-tier problems, "
            "combined with time exhaustion on lengthy calculations. "
            "Rule of thumb: If you cannot identify the first solution step within 45 seconds, flag the question for review and move on."
        )
        suggestions = ["Show my speed-accuracy quadrants", "Explain my weakest topics", "What is my student persona?"]
        links = [
            ActionLinkSchema(label="View Performance Analytics", page="analytics"),
            ActionLinkSchema(label="Explore Score Simulator", page="score-simulator")
        ]

    # 5. Default pedagogical response
    else:
        response_text = (
            f"Hello Aarav! I am monitoring your JEE preparation across all {len(attempts)} recorded mock attempts. "
            f"Your current baseline stands at **{latest_score:.0f}/300**. "
            "I can diagnose your mark-loss patterns, explain solution concepts, auto-generate your weekly revision plan, "
            "or explore what-if score simulations. Where would you like to focus?"
        )
        suggestions = ["Explain my weakest topics", "Create a tailored revision plan", "Analyze my latest mock test"]
        links = [
            ActionLinkSchema(label="Open Dashboard", page="overview"),
            ActionLinkSchema(label="Inspect Weak Concepts", page="weak-concepts")
        ]

    return CoachChatResponse(
        id=msg_id,
        sender="coach",
        text=response_text,
        timestamp=now_str,
        contextTopic=payload.contextTopic,
        actionSuggestions=suggestions,
        actionLinks=links,
        isSimulated=True
    )
