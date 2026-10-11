from typing import Optional, Dict
from pydantic import BaseModel, Field


class MarkingSchemeSchema(BaseModel):
    correct: float = 4.0
    incorrect: float = -1.0
    unattempted: float = 0.0


class MockTestSummarySchema(BaseModel):
    id: str
    title: str
    type: str = Field(..., alias="type")
    subject: Optional[str] = None
    questionsCount: int
    durationMinutes: int
    maxMarks: int
    difficulty: str
    status: str
    lastScore: Optional[float] = None
    lastAttemptDate: Optional[str] = None
    description: str
    markingScheme: MarkingSchemeSchema

    model_config = {
        "from_attributes": True,
        "populate_by_name": True
    }
