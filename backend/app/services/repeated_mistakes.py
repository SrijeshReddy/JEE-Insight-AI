from typing import List, Dict, Any
from backend.app.models.attempt import TestAttemptModel
from backend.app.schemas.diagnostics import RepeatedMistakesResponse, RepeatedMistakeAlert


class RepeatedMistakesDetector:
    @staticmethod
    def detect_repeated_mistakes(attempts: List[TestAttemptModel]) -> RepeatedMistakesResponse:
        """
        Detects recurring errors on the same concept/topic across >= 3 consecutive relevant attempts.
        Requires >= 3 completed attempts for sufficient statistical depth.
        """
        if len(attempts) < 3:
            return RepeatedMistakesResponse(
                alertCount=0,
                hasRepeatedMistakes=False,
                alerts=[],
                dataSufficiencyStatus="Insufficient Historical Depth (<3 Completed Attempts)"
            )

        # Sort attempts chronologically by date/submission_time
        sorted_attempts = sorted(attempts, key=lambda a: a.date)

        # Track consecutive incorrect occurrences for each topic
        # Map: topic -> list of attempts where it had accuracy < 50%
        topic_history: Dict[str, List[Dict[str, Any]]] = {}

        for att in sorted_attempts:
            breakdown = att.topic_breakdown or []
            for tb in breakdown:
                topic = tb.get("topic")
                subject = tb.get("subject", "Physics")
                acc = float(tb.get("accuracy", 100.0))
                incorrect = int(tb.get("total", 0)) - int(tb.get("correct", 0))

                if topic not in topic_history:
                    topic_history[topic] = []

                topic_history[topic].append({
                    "testTitle": att.test_title,
                    "date": att.date,
                    "subject": subject,
                    "isError": acc < 50.0 and incorrect > 0
                })

        alerts: List[RepeatedMistakeAlert] = []

        for topic, events in topic_history.items():
            # Check for 3 consecutive events where isError is True
            consecutive_count = 0
            failing_titles = []
            last_date = ""
            subject = "Physics"

            for ev in events:
                subject = ev["subject"]
                if ev["isError"]:
                    consecutive_count += 1
                    failing_titles.append(ev["testTitle"])
                    last_date = ev["date"]
                else:
                    consecutive_count = 0
                    failing_titles = []

                if consecutive_count >= 3:
                    alerts.append(RepeatedMistakeAlert(
                        conceptOrTopic=topic,
                        subject=subject,
                        consecutiveErrorCount=consecutive_count,
                        attemptTitles=list(failing_titles[-3:]),
                        lastEncounteredDate=last_date,
                        diagnosis=f"Recurring misconception observed across {consecutive_count} consecutive examination appearances.",
                        recommendedAction=f"Urgent priority: Schedule targeted concept reconstruction and step-by-step problem drill in {topic}."
                    ))
                    break

        return RepeatedMistakesResponse(
            alertCount=len(alerts),
            hasRepeatedMistakes=len(alerts) > 0,
            alerts=alerts,
            dataSufficiencyStatus="Sufficient Historical Evidence"
        )
