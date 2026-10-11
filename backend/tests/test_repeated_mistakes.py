import pytest
from backend.app.services.repeated_mistakes import RepeatedMistakesDetector
from backend.app.models.attempt import TestAttemptModel


def test_repeated_mistakes_insufficient_data():
    # Fewer than 3 attempts should return insufficient data status without false alerts
    attempts = [
        TestAttemptModel(
            id="a1", test_title="Mock 1", date="2026-03-01",
            topic_breakdown=[{"topic": "Rotational Dynamics", "subject": "Physics", "accuracy": 25.0, "total": 4, "correct": 1}]
        ),
        TestAttemptModel(
            id="a2", test_title="Mock 2", date="2026-03-05",
            topic_breakdown=[{"topic": "Rotational Dynamics", "subject": "Physics", "accuracy": 20.0, "total": 5, "correct": 1}]
        )
    ]

    result = RepeatedMistakesDetector.detect_repeated_mistakes(attempts)
    assert result.hasRepeatedMistakes is False
    assert result.alertCount == 0
    assert "Insufficient" in result.dataSufficiencyStatus


def test_repeated_mistakes_detected_across_three_consecutive_attempts():
    attempts = [
        TestAttemptModel(
            id="a1", test_title="Mock 1", date="2026-03-01",
            topic_breakdown=[{"topic": "Rotational Dynamics", "subject": "Physics", "accuracy": 20.0, "total": 5, "correct": 1}]
        ),
        TestAttemptModel(
            id="a2", test_title="Mock 2", date="2026-03-05",
            topic_breakdown=[{"topic": "Rotational Dynamics", "subject": "Physics", "accuracy": 25.0, "total": 4, "correct": 1}]
        ),
        TestAttemptModel(
            id="a3", test_title="Mock 3", date="2026-03-10",
            topic_breakdown=[{"topic": "Rotational Dynamics", "subject": "Physics", "accuracy": 33.3, "total": 3, "correct": 1}]
        )
    ]

    result = RepeatedMistakesDetector.detect_repeated_mistakes(attempts)
    assert result.hasRepeatedMistakes is True
    assert result.alertCount >= 1
    alert = result.alerts[0]
    assert alert.conceptOrTopic == "Rotational Dynamics"
    assert alert.consecutiveErrorCount >= 3
    assert len(alert.attemptTitles) == 3
