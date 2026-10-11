from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class DashboardMetricsResponse(BaseModel):
    latestScore: float
    latestMaxMarks: int
    averageScore: float
    averageAccuracy: float
    completedTestsCount: int
    targetScore: int
    streakDays: int = 5
    weakestSubject: str
    strongestSubject: str
    lastAttemptDate: Optional[str] = None


class ScoreProgressionPoint(BaseModel):
    mockName: str
    score: float
    accuracy: float
    date: str


class SubjectAccuracyItem(BaseModel):
    subject: str
    accuracy: float
    score: float
    totalMarks: float


class TopicRankingItem(BaseModel):
    topic: str
    subject: str
    accuracy: float
    attempts: int
    priority: str


class DifficultyBreakdownItem(BaseModel):
    difficulty: str
    accuracy: float
    attempted: int
    total: int


class OutcomeDistributionItem(BaseModel):
    status: str
    count: int
    percentage: float
    color: str


class TimeAnalysisItem(BaseModel):
    subject: str
    avgSeconds: float
    targetSeconds: float


class AnalyticsWorkspaceResponse(BaseModel):
    scoreProgression: List[ScoreProgressionPoint]
    subjectAccuracy: List[SubjectAccuracyItem]
    topicRankings: List[TopicRankingItem]
    difficultyBreakdown: List[DifficultyBreakdownItem]
    outcomeDistribution: List[OutcomeDistributionItem]
    timeAnalysis: List[TimeAnalysisItem]
    strongestTopics: List[Dict[str, Any]]
    weakestTopics: List[Dict[str, Any]]
    errorPatternStats: Dict[str, Any]
