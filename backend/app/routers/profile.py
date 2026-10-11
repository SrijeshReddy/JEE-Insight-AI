from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.user import StudentProfileModel
from backend.app.schemas.user import StudentProfileResponse, StudentProfileUpdate
from backend.app.seed.seeder import seed_database

router = APIRouter(prefix="/profile", tags=["Profile & Settings"])


@router.get("", response_model=StudentProfileResponse)
def get_profile(
    student_id: str = "student-aarav-01",
    db: Session = Depends(get_db)
):
    """Retrieve student aspirant profile and preparation parameters."""
    profile = db.query(StudentProfileModel).filter_by(id=student_id).first()
    if not profile:
        seed_database(db)
        profile = db.query(StudentProfileModel).filter_by(id=student_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found.")
    return profile


@router.put("", response_model=StudentProfileResponse)
def update_profile(
    payload: StudentProfileUpdate,
    student_id: str = "student-aarav-01",
    db: Session = Depends(get_db)
):
    """Update student aspirant profile preferences."""
    profile = db.query(StudentProfileModel).filter_by(id=student_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found.")

    if payload.name is not None:
        profile.name = payload.name
    if payload.target_exam is not None:
        profile.target_exam = payload.target_exam
    if payload.target_score is not None:
        profile.target_score = payload.target_score
    if payload.daily_study_hours is not None:
        profile.daily_study_hours = payload.daily_study_hours
    if payload.preferred_subjects is not None:
        profile.preferred_subjects = payload.preferred_subjects
    if payload.theme is not None:
        profile.theme = payload.theme
    if payload.timer_mode is not None:
        profile.timer_mode = payload.timer_mode

    db.commit()
    db.refresh(profile)
    return profile


@router.post("/reset", response_model=StudentProfileResponse)
def reset_profile(
    student_id: str = "student-aarav-01",
    db: Session = Depends(get_db)
):
    """Resets demonstration parameters to factory baseline."""
    profile = db.query(StudentProfileModel).filter_by(id=student_id).first()
    if profile:
        profile.name = "Aarav Sharma"
        profile.target_exam = "JEE Main 2027"
        profile.target_score = 210
        profile.daily_study_hours = 6
        profile.preferred_subjects = ["Physics", "Chemistry", "Mathematics"]
        profile.theme = "light"
        profile.timer_mode = "Flexible Demo"
        db.commit()
        db.refresh(profile)
        return profile
    seed_database(db)
    return db.query(StudentProfileModel).filter_by(id=student_id).first()
