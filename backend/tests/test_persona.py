import pytest
from backend.app.services.persona import StudentPersonaClassifier
from backend.app.models.attempt import TestAttemptModel


def test_persona_insufficient_data():
    attempts = [
        TestAttemptModel(
            id="a1", score=120.0, accuracy=75.0, time_spent_seconds=5000,
            correct_count=30, incorrect_count=10, unattempted_count=35
        )
    ]
    result = StudentPersonaClassifier.classify(attempts)
    assert result.isMachineLearningModel is False
    assert "Insufficient" in result.dataSufficiency
    assert result.personaTitle == "Emerging Aspirant Profile"


def test_persona_accurate_but_slow():
    # Accuracy >= 72% and avg_sec_per_question > 140s
    attempts = [
        TestAttemptModel(
            id="a1", score=180.0, accuracy=80.0, time_spent_seconds=7200,
            correct_count=32, incorrect_count=8, unattempted_count=35
        ),  # 40 attempted, 7200s / 40 = 180s/question
        TestAttemptModel(
            id="a2", score=190.0, accuracy=82.0, time_spent_seconds=7200,
            correct_count=33, incorrect_count=7, unattempted_count=35
        )   # 40 attempted, 7200s / 40 = 180s/question
    ]
    result = StudentPersonaClassifier.classify(attempts)
    assert result.personaTitle == "Accurate but Deliberate Solver"
    assert result.isMachineLearningModel is False
    assert result.dataSufficiency == "Sufficient"


def test_persona_rapid_error_prone():
    # Accuracy < 55% and avg_sec_per_question < 80s
    attempts = [
        TestAttemptModel(
            id="a1", score=90.0, accuracy=45.0, time_spent_seconds=3600,
            correct_count=25, incorrect_count=35, unattempted_count=15
        ),  # 60 attempted, 3600 / 60 = 60s/question
        TestAttemptModel(
            id="a2", score=85.0, accuracy=42.0, time_spent_seconds=3600,
            correct_count=24, incorrect_count=36, unattempted_count=15
        )
    ]
    result = StudentPersonaClassifier.classify(attempts)
    assert result.personaTitle == "Rapid but Error-Prone Solver"
    assert result.isMachineLearningModel is False
