from sqlalchemy import Column, String, Integer, Float, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.database import Base


class QuestionModel(Base):
    __tablename__ = "questions"

    id = Column(String(64), primary_key=True, index=True)
    test_id = Column(String(64), ForeignKey("mock_tests.id"), nullable=True, index=True)
    question_number = Column(Integer, nullable=False)
    subject = Column(String(32), nullable=False, index=True)
    topic = Column(String(128), nullable=False, index=True)
    concept_id = Column(String(64), ForeignKey("taxonomy_concepts.id"), nullable=True, index=True)
    statement = Column(Text, nullable=False)
    correct_option_id = Column(String(8), nullable=False)
    explanation = Column(Text, nullable=False)
    difficulty = Column(String(16), nullable=False, default="Medium")  # Easy, Medium, Hard
    positive_marks = Column(Float, nullable=False, default=4.0)
    negative_marks = Column(Float, nullable=False, default=-1.0)
    common_misconception = Column(Text, nullable=True)
    remember_rule = Column(Text, nullable=True)

    # Enhanced PYQ & Question Bank Metadata
    year = Column(Integer, nullable=True, index=True)
    exam_session = Column(String(64), nullable=True)
    shift = Column(String(64), nullable=True)
    chapter = Column(String(128), nullable=True, index=True)
    question_type = Column(String(32), nullable=True, default="single_correct")
    numerical_answer = Column(String(64), nullable=True)
    source_paper = Column(String(256), nullable=True)
    is_pyq = Column(Integer, nullable=False, default=1)
    verification_status = Column(String(32), nullable=False, default="VERIFIED")
    diagram_data = Column(JSON, nullable=True)

    test = relationship("MockTestModel", back_populates="questions")
    options = relationship("QuestionOptionModel", back_populates="question", cascade="all, delete-orphan", order_by="QuestionOptionModel.option_key")
    responses = relationship("AttemptResponseModel", back_populates="question")


class QuestionOptionModel(Base):
    __tablename__ = "question_options"

    id = Column(String(128), primary_key=True)
    question_id = Column(String(64), ForeignKey("questions.id"), nullable=False, index=True)
    option_key = Column(String(8), nullable=False)  # 'A', 'B', 'C', 'D'
    text = Column(Text, nullable=False)

    question = relationship("QuestionModel", back_populates="options")
