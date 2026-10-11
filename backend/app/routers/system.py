from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.database import get_db
from backend.app.config import settings

router = APIRouter(prefix="", tags=["System"])


@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint validating API and database connectivity."""
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "database": db_status
    }


@router.get("/version")
def version_info():
    """Returns platform version and capability specifications."""
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "stage": "Stage 3 (Backend, Database & Behavioral Intelligence)",
        "databaseEngine": "PostgreSQL-ready with local SQLite fallback",
        "features": [
            "Authoritative Backend Scoring Engine",
            "Real-Time Question Telemetry Tracking",
            "Mark-Loss Behavioral Diagnostics",
            "Speed vs. Accuracy 4-Quadrant Analysis",
            "Consecutive Repeated Mistakes Detection",
            "Rule-Based Student Persona Classification",
            "Study Tasks CRUD & Taxonomy Mapping"
        ]
    }
