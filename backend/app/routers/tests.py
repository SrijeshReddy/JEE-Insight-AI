from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.test import MockTestModel
from backend.app.models.question import QuestionModel
from backend.app.schemas.test import MockTestSummarySchema
from backend.app.schemas.question import QuestionSchema, QuestionClientView

router = APIRouter(prefix="/tests", tags=["Mock Tests"])


@router.get("", response_model=List[MockTestSummarySchema])
def list_mock_tests(
    test_type: Optional[str] = Query(None, alias="type"),
    subject: Optional[str] = None,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Retrieve catalog of available mock tests with metadata and marking schemes."""
    query = db.query(MockTestModel)
    if test_type and test_type != "All":
        query = query.filter(MockTestModel.test_type == test_type)
    if subject and subject != "All":
        query = query.filter(MockTestModel.subject == subject)
    if difficulty and difficulty != "All":
        query = query.filter(MockTestModel.difficulty == difficulty)

    tests = query.all()
    results = []
    for t in tests:
        results.append(MockTestSummarySchema(
            id=t.id,
            title=t.title,
            type=t.test_type,
            subject=t.subject,
            questionsCount=t.questions_count,
            durationMinutes=t.duration_minutes,
            maxMarks=t.max_marks,
            difficulty=t.difficulty,
            status=t.status,
            description=t.description,
            markingScheme=t.marking_scheme
        ))
    return results


@router.get("/{test_id}", response_model=MockTestSummarySchema)
def get_test_details(test_id: str, db: Session = Depends(get_db)):
    """Retrieve details for a specific mock test."""
    test = db.query(MockTestModel).filter_by(id=test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail=f"Mock test '{test_id}' not found.")

    return MockTestSummarySchema(
        id=test.id,
        title=test.title,
        type=test.test_type,
        subject=test.subject,
        questionsCount=test.questions_count,
        durationMinutes=test.duration_minutes,
        maxMarks=test.max_marks,
        difficulty=test.difficulty,
        status=test.status,
        description=test.description,
        markingScheme=test.marking_scheme
    )


@router.get("/{test_id}/questions", response_model=List[QuestionSchema])
def get_test_questions(test_id: str, db: Session = Depends(get_db)):
    """Retrieve questions belonging to a mock test for examination taking or review."""
    test = db.query(MockTestModel).filter_by(id=test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail=f"Mock test '{test_id}' not found.")

    questions = db.query(QuestionModel).filter_by(test_id=test_id).order_by(QuestionModel.question_number).all()
    results = []
    for q in questions:
        results.append(QuestionSchema(
            id=q.id,
            testId=q.test_id,
            questionNumber=q.question_number,
            subject=q.subject,
            topic=q.topic,
            statement=q.statement,
            options=[{"id": o.option_key, "text": o.text} for o in q.options],
            correctOptionId=q.correct_option_id,
            explanation=q.explanation,
            difficulty=q.difficulty,
            positiveMarks=q.positive_marks,
            negativeMarks=q.negative_marks,
            commonMisconception=q.common_misconception,
            rememberRule=q.remember_rule
        ))
    return results
