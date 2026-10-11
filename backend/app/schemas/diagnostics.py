from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class MarkLossCategory(BaseModel):
    category: str  # "Conceptual", "Careless", "Time-Pressure", "Unattempted Opportunities"
    marksLost: float
    percentageOfLoss: float
    questionCount: int
    evidence: str
    actionRecommendation: str


class MarkLossBreakdownResponse(BaseModel):
    totalMarksPossible: float
    marksObtained: float
    totalMarksLost: float
    categories: List[MarkLossCategory]
    integrityCheckPassed: bool  # Ensures sum(categories.marksLost) <= totalMarksLost
    methodologyNote: str


class SpeedAccuracyQuadrantItem(BaseModel):
    quadrant: str  # "Fast & Accurate (Strength)", "Fast & Inaccurate (Rushing)", "Slow & Accurate (Speed Bottleneck)", "Slow & Inaccurate (Conceptual Weakness)", "Moderate Pacing"
    topic: str
    subject: str
    avgTimeSeconds: float
    accuracy: float
    attemptCount: int
    recommendation: str


class SpeedAccuracyResponse(BaseModel):
    fastThresholdSeconds: float = 90.0
    slowThresholdSeconds: float = 150.0
    accurateThresholdPercent: float = 75.0
    inaccurateThresholdPercent: float = 50.0
    quadrantItems: List[SpeedAccuracyQuadrantItem]
    distributionSummary: Dict[str, int]


class RepeatedMistakeAlert(BaseModel):
    conceptOrTopic: str
    subject: str
    consecutiveErrorCount: int
    attemptTitles: List[str]
    lastEncounteredDate: str
    diagnosis: str
    recommendedAction: str


class RepeatedMistakesResponse(BaseModel):
    alertCount: int
    hasRepeatedMistakes: bool
    alerts: List[RepeatedMistakeAlert]
    dataSufficiencyStatus: str  # "Sufficient Evidence", "Insufficient Historical Depth (<3 Attempts)"


class StudentPersonaResponse(BaseModel):
    personaTitle: str
    confidence: str  # "High Confidence", "Moderate Confidence", "Preliminary (Limited Data)"
    dataSufficiency: str  # "Sufficient", "Insufficient Data (<3 attempts)"
    primaryTrait: str
    observedEvidence: List[str]
    strategicPrescription: List[str]
    isMachineLearningModel: bool = False
    disclaimer: str = "Deterministic behavioral heuristic based on empirical speed, accuracy, and error archetype telemetry."
