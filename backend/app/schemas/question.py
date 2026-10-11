from typing import List, Optional
from pydantic import BaseModel, Field


class QuestionOptionSchema(BaseModel):
    id: str
    text: str

    model_config = {"from_attributes": True}


class QuestionSchema(BaseModel):
    id: str
    testId: Optional[str] = Field(None, alias="testId")
    questionNumber: int
    subject: str
    topic: str
    statement: str
    options: List[QuestionOptionSchema]
    correctOptionId: str
    explanation: str
    difficulty: str
    positiveMarks: float = 4.0
    negativeMarks: float = -1.0
    commonMisconception: Optional[str] = None
    rememberRule: Optional[str] = None

    model_config = {
        "from_attributes": True,
        "populate_by_name": True
    }


class QuestionClientView(BaseModel):
    """View sent to student during test taking (omitting correct answer & explanation)."""
    id: str
    testId: Optional[str] = None
    questionNumber: int
    subject: str
    topic: str
    statement: str
    options: List[QuestionOptionSchema]
    difficulty: str

    model_config = {
        "from_attributes": True,
        "populate_by_name": True
    }
