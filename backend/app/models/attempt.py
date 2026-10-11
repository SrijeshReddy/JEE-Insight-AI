from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, JSON, ForeignKey, UniqueConstraint
)
from sqlalchemy.orm import relationship
from backend.app.database import Base


class TestAttemptModel(Base):
    __tablename__ = "test_attempts"
    __test__ = False

    id = Column(String(64), primary_key=True, index=True)
    student_id = Column(String(64), ForeignKey("student_profiles.id"), nullable=False, index=True)
    test_id = Column(String(64), ForeignKey("mock_tests.id"), nullable=False, index=True)
    test_title = Column(String(256), nullable=False)
    date = Column(String(32), nullable=False)
    start_time = Column(DateTime, default=datetime.utcnow, nullable=False)
    submission_time = Column(DateTime, nullable=True)
    time_spent_seconds = Column(Integer, default=0, nullable=False)

    score = Column(Float, default=0.0, nullable=False)
    total_marks = Column(Integer, default=300, nullable=False)
    correct_count = Column(Integer, default=0, nullable=False)
    incorrect_count = Column(Integer, default=0, nullable=False)
    unattempted_count = Column(Integer, default=0, nullable=False)
    accuracy = Column(Float, default=0.0, nullable=False)
    percentile = Column(Float, nullable=True)
    status = Column(String(32), default="completed", nullable=False)  # in_progress, completed

    marking_scheme = Column(JSON, nullable=False)
    subject_breakdown = Column(JSON, nullable=False, default={})
    topic_breakdown = Column(JSON, nullable=False, default=[])
    observations = Column(JSON, nullable=False, default=[])
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    test = relationship("MockTestModel", back_populates="attempts")
    responses = relationship("AttemptResponseModel", back_populates="attempt", cascade="all, delete-orphan")
    telemetries = relationship("QuestionTelemetryModel", back_populates="attempt", cascade="all, delete-orphan")


class AttemptResponseModel(Base):
    __tablename__ = "attempt_responses"

    id = Column(String(128), primary_key=True)
    attempt_id = Column(String(64), ForeignKey("test_attempts.id"), nullable=False, index=True)
    question_id = Column(String(64), ForeignKey("questions.id"), nullable=False, index=True)
    selected_option = Column(String(8), nullable=True)
    is_correct = Column(Boolean, nullable=True)
    marked_for_review = Column(Boolean, default=False, nullable=False)
    time_spent_seconds = Column(Integer, default=0, nullable=False)
    marks_awarded = Column(Float, default=0.0, nullable=False)

    __table_args__ = (
        UniqueConstraint("attempt_id", "question_id", name="uq_attempt_question"),
    )

    attempt = relationship("TestAttemptModel", back_populates="responses")
    question = relationship("QuestionModel", back_populates="responses")


class QuestionTelemetryModel(Base):
    __tablename__ = "question_telemetries"

    id = Column(String(128), primary_key=True)
    attempt_id = Column(String(64), ForeignKey("test_attempts.id"), nullable=False, index=True)
    question_id = Column(String(64), ForeignKey("questions.id"), nullable=False, index=True)
    visit_count = Column(Integer, default=1, nullable=False)
    time_to_first_action_seconds = Column(Float, nullable=True)
    answer_change_count = Column(Integer, default=0, nullable=False)
    review_toggle_count = Column(Integer, default=0, nullable=False)
    initial_option = Column(String(8), nullable=True)
    final_option = Column(String(8), nullable=True)
    telemetry_events = Column(JSON, default=list, nullable=False)

    __table_args__ = (
        UniqueConstraint("attempt_id", "question_id", name="uq_telemetry_attempt_question"),
    )

    attempt = relationship("TestAttemptModel", back_populates="telemetries")
