from typing import List, Optional
from pydantic import BaseModel, Field


class ActionLinkSchema(BaseModel):
    label: str
    page: str
    context: Optional[str] = None


class CoachChatRequest(BaseModel):
    studentId: Optional[str] = "student-aarav-01"
    message: str
    contextTopic: Optional[str] = None


class CoachChatResponse(BaseModel):
    id: str
    sender: str = "coach"
    text: str
    timestamp: str
    contextTopic: Optional[str] = None
    actionSuggestions: List[str] = []
    actionLinks: List[ActionLinkSchema] = []
    isSimulated: bool = True
    disclaimer: str = "Rule-based pedagogical intelligence based on your database performance records. Live open-weight LLM planned for later stage."
