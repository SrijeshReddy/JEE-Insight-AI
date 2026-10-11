from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class StudentProfileBase(BaseModel):
    name: str = Field(..., examples=["Aarav Sharma"])
    target_exam: str = Field("JEE Main 2027", examples=["JEE Main 2027"])
    target_score: int = Field(210, ge=60, le=300, examples=[210])
    daily_study_hours: int = Field(6, ge=1, le=16, examples=[6])
    preferred_subjects: List[str] = Field(default=["Physics", "Chemistry", "Mathematics"])
    theme: str = Field("light", examples=["light"])
    timer_mode: str = Field("Flexible Demo", examples=["Flexible Demo"])


class StudentProfileUpdate(BaseModel):
    name: Optional[str] = None
    target_exam: Optional[str] = None
    target_score: Optional[int] = None
    daily_study_hours: Optional[int] = None
    preferred_subjects: Optional[List[str]] = None
    theme: Optional[str] = None
    timer_mode: Optional[str] = None


class StudentProfileResponse(StudentProfileBase):
    id: str
    registered_date: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
