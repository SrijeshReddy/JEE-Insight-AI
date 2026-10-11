from typing import Dict, List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field
from backend.app.schemas.test import MarkingSchemeSchema


class QuestionResponseInput(BaseModel):
    selectedOption: Optional[str] = None
    markedForReview: bool = False
    timeSpentSeconds: int = 0


class QuestionTelemetryInput(BaseModel):
    visitCount: int = 1
    timeToFirstActionSeconds: Optional[float] = None
    answerChangeCount: int = 0
    reviewToggleCount: int = 0
    initialOption: Optional[str] = None
    finalOption: Optional[str] = None
    telemetryEvents: List[Dict[str, Any]] = []


class StartAttemptInput(BaseModel):
    testId: Optional[str] = None
    studentId: Optional[str] = "student-aarav-01"


class SubmitAttemptInput(BaseModel):
    studentId: Optional[str] = "student-aarav-01"
    responses: Dict[str, QuestionResponseInput]
    telemetry: Optional[Dict[str, QuestionTelemetryInput]] = None
    timeSpentSeconds: int


class SubjectPerformanceItem(BaseModel):
    score: float
    accuracy: float
    correct: int
    incorrect: int
    unattempted: int
    avgTime: float


class TopicPerformanceItem(BaseModel):
    topic: str
    subject: str
    accuracy: float
    correct: int
    total: int
    avgTime: float


class TestAttemptResponse(BaseModel):
    id: str
    testId: str
    testTitle: str
    date: str
    timeSpentSeconds: int
    score: float
    totalMarks: int
    correctCount: int
    incorrectCount: int
    unattemptedCount: int
    accuracy: float
    percentile: Optional[float] = None
    markingScheme: MarkingSchemeSchema
    responses: Dict[str, Dict[str, Any]]
    subjectBreakdown: Dict[str, SubjectPerformanceItem]
    topicBreakdown: List[TopicPerformanceItem]
    observations: List[str]

    model_config = {
        "from_attributes": True,
        "populate_by_name": True
    }
