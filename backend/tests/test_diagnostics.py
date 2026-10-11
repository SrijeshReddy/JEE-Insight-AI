import pytest
from backend.app.services.diagnostics import MarkLossAnalyzer
from backend.app.services.speed_accuracy import SpeedAccuracyAnalyzer
from backend.app.models.attempt import TestAttemptModel, AttemptResponseModel
from backend.app.models.question import QuestionModel


def test_mark_loss_categorization_and_non_double_counting():
    attempt = TestAttemptModel(
        id="att-test",
        test_id="t-mock",
        score=20.0,
        total_marks=50.0  # Lost 30 marks total
    )

    q_careless = QuestionModel(id="q1", difficulty="easy", subject="Physics", topic="Kinematics")
    q_time = QuestionModel(id="q2", difficulty="medium", subject="Physics", topic="Kinematics")
    q_conceptual = QuestionModel(id="q3", difficulty="hard", subject="Physics", topic="Kinematics")
    q_unatt = QuestionModel(id="q4", difficulty="medium", subject="Physics", topic="Kinematics")

    # Responses
    r_careless = AttemptResponseModel(question_id="q1", is_correct=False, time_spent_seconds=25, selected_option="opt_a")
    r_time = AttemptResponseModel(question_id="q2", is_correct=False, time_spent_seconds=210, selected_option="opt_b")
    r_conceptual = AttemptResponseModel(question_id="q3", is_correct=False, time_spent_seconds=90, selected_option="opt_c")
    r_unatt = AttemptResponseModel(question_id="q4", is_correct=None, time_spent_seconds=10, selected_option=None)

    result = MarkLossAnalyzer.analyze_attempt(
        attempt=attempt,
        questions=[q_careless, q_time, q_conceptual, q_unatt],
        responses=[r_careless, r_time, r_conceptual, r_unatt]
    )

    assert result.totalMarksPossible == 50.0
    assert result.marksObtained == 20.0
    assert result.totalMarksLost == 30.0
    assert result.integrityCheckPassed is True

    # Sum of categories must not exceed total marks lost (30.0)
    category_sum = sum(c.marksLost for c in result.categories)
    assert category_sum <= result.totalMarksLost + 0.1  # allow minor floating point rounding

    # Check that each category is present
    cat_names = [c.category for c in result.categories]
    assert "Conceptual Deficits" in cat_names
    assert "Careless / Calculation Slips" in cat_names
    assert "Time Pressure & Pacing Traps" in cat_names
    assert "Unattempted Opportunities" in cat_names


def test_speed_accuracy_quadrants():
    topics = [
        {"topic": "Vectors", "subject": "Physics", "accuracy": 85.0, "avgTime": 65.0, "attempts": 12},     # Fast & Accurate
        {"topic": "Chemical Bonding", "subject": "Chemistry", "accuracy": 35.0, "avgTime": 50.0, "attempts": 10}, # Fast & Inaccurate
        {"topic": "Rotational Dynamics", "subject": "Physics", "accuracy": 80.0, "avgTime": 175.0, "attempts": 8}, # Slow & Accurate
        {"topic": "Thermodynamics", "subject": "Physics", "accuracy": 40.0, "avgTime": 190.0, "attempts": 15},   # Slow & Inaccurate
        {"topic": "Matrices", "subject": "Mathematics", "accuracy": 65.0, "avgTime": 110.0, "attempts": 9}      # Moderate
    ]

    result = SpeedAccuracyAnalyzer.classify_topics(topics)

    assert result.distributionSummary["Strength"] == 1
    assert result.distributionSummary["Rushing"] == 1
    assert result.distributionSummary["Speed Bottleneck"] == 1
    assert result.distributionSummary["Conceptual Weakness"] == 1
    assert result.distributionSummary["Moderate Pacing"] == 1


def test_diagnostics_api_endpoint(client):
    response = client.get("/api/v1/analytics/diagnostics")
    assert response.status_code == 200
    data = response.json()
    assert "markLoss" in data
    assert "speedAccuracy" in data
    assert "repeatedMistakes" in data
    assert "persona" in data
