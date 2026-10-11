from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, JSON, DateTime
from sqlalchemy.orm import relationship
from backend.app.database import Base


class MockTestModel(Base):
    __tablename__ = "mock_tests"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(256), nullable=False)
    test_type = Column(String(32), nullable=False)  # Full-Length, Subject, Chapter
    subject = Column(String(32), nullable=True)     # Physics, Chemistry, Mathematics
    questions_count = Column(Integer, nullable=False, default=30)
    duration_minutes = Column(Integer, nullable=False, default=60)
    max_marks = Column(Integer, nullable=False, default=120)
    difficulty = Column(String(32), nullable=False, default="Moderate")  # Easy, Moderate, Challenging
    status = Column(String(32), nullable=False, default="Available")
    description = Column(Text, nullable=False)
    marking_scheme = Column(JSON, nullable=False, default={"correct": 4, "incorrect": -1, "unattempted": 0})
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    questions = relationship("QuestionModel", back_populates="test", cascade="all, delete-orphan")
    attempts = relationship("TestAttemptModel", back_populates="test")
