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

    # PYQ Metadata
    year: Optional[int] = None
    examSession: Optional[str] = Field(None, alias="examSession")
    shift: Optional[str] = None
    chapter: Optional[str] = None
    questionType: Optional[str] = Field("single_correct", alias="questionType")
    numericalAnswer: Optional[str] = Field(None, alias="numericalAnswer")
    sourcePaper: Optional[str] = Field(None, alias="sourcePaper")
    isPyq: Optional[bool] = Field(True, alias="isPyq")
    verificationStatus: Optional[str] = Field("VERIFIED", alias="verificationStatus")
    diagramData: Optional[dict] = Field(None, alias="diagramData")

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
    chapter: Optional[str] = None
    questionType: Optional[str] = Field("single_correct", alias="questionType")
    diagramData: Optional[dict] = Field(None, alias="diagramData")

    model_config = {
        "from_attributes": True,
        "populate_by_name": True
    }
