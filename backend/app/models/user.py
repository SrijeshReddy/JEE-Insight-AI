from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, JSON
from backend.app.database import Base


class StudentProfileModel(Base):
    __tablename__ = "student_profiles"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    target_exam = Column(String(64), nullable=False, default="JEE Main 2027")
    target_score = Column(Integer, nullable=False, default=210)
    daily_study_hours = Column(Integer, nullable=False, default=6)
    preferred_subjects = Column(JSON, nullable=False, default=["Physics", "Chemistry", "Mathematics"])
    theme = Column(String(16), nullable=False, default="light")
    timer_mode = Column(String(32), nullable=False, default="Flexible Demo")
    registered_date = Column(String(32), nullable=False, default="2026-08-15")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
