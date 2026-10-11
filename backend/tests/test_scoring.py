import pytest
from backend.app.services.scoring import ScoringEngine
from backend.app.models.test import MockTestModel
from backend.app.models.question import QuestionModel
from backend.app.schemas.attempt import QuestionResponseInput


def test_authoritative_scoring_calculation():
    test = MockTestModel(
        id="t-mock",
        title="Test Mock",
        max_marks=12,
        marking_scheme={"correct": 4.0, "incorrect": -1.0, "unattempted": 0.0}
    )

    q1 = QuestionModel(id="q1", subject="Physics", topic="Electrostatics", correct_option_id="opt_a")
    q2 = QuestionModel(id="q2", subject="Physics", topic="Electrostatics", correct_option_id="opt_b")
    q3 = QuestionModel(id="q3", subject="Mathematics", topic="Calculus", correct_option_id="opt_c")

    # Responses: q1 correct (+4), q2 incorrect (-1), q3 unattempted (0)
    responses = {
        "q1": QuestionResponseInput(questionId="q1", selectedOption="opt_a", timeSpentSeconds=60),
        "q2": QuestionResponseInput(questionId="q2", selectedOption="opt_d", timeSpentSeconds=80),
        "q3": QuestionResponseInput(questionId="q3", selectedOption=None, timeSpentSeconds=10)
    }

    result = ScoringEngine.grade_attempt(
        test=test,
        questions=[q1, q2, q3],
        responses=responses,
        total_time_spent_seconds=150
    )

    assert result["score"] == 3.0  # +4 - 1 + 0 = 3
    assert result["correctCount"] == 1
    assert result["incorrectCount"] == 1
    assert result["unattemptedCount"] == 1
    # Accuracy: 1 correct out of 2 attempted = 50.0%
    assert result["accuracy"] == 50.0

    # Check question-level detail
    assert result["gradedResponses"]["q1"]["isCorrect"] is True
    assert result["gradedResponses"]["q1"]["marksAwarded"] == 4.0
    assert result["gradedResponses"]["q2"]["isCorrect"] is False
    assert result["gradedResponses"]["q2"]["marksAwarded"] == -1.0
    assert result["gradedResponses"]["q3"]["isCorrect"] is None
    assert result["gradedResponses"]["q3"]["marksAwarded"] == 0.0


def test_unattempted_and_all_incorrect_handling():
    test = MockTestModel(
        id="t-all-wrong",
        title="Test Negatives",
        max_marks=8,
        marking_scheme={"correct": 4.0, "incorrect": -1.0, "unattempted": 0.0}
    )
    q1 = QuestionModel(id="q1", subject="Chemistry", topic="Thermodynamics", correct_option_id="opt_a")
    q2 = QuestionModel(id="q2", subject="Chemistry", topic="Thermodynamics", correct_option_id="opt_b")

    # Both incorrect: -1, -1 = -2
    responses = {
        "q1": QuestionResponseInput(questionId="q1", selectedOption="opt_c", timeSpentSeconds=30),
        "q2": QuestionResponseInput(questionId="q2", selectedOption="opt_c", timeSpentSeconds=40),
    }

    result = ScoringEngine.grade_attempt(
        test=test,
        questions=[q1, q2],
        responses=responses,
        total_time_spent_seconds=70
    )

    assert result["score"] == -2.0
    assert result["correctCount"] == 0
    assert result["incorrectCount"] == 2
    assert result["unattemptedCount"] == 0
    assert result["accuracy"] == 0.0
