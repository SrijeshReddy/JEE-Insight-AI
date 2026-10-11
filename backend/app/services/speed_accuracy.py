from typing import List, Dict, Any
from backend.app.schemas.diagnostics import SpeedAccuracyResponse, SpeedAccuracyQuadrantItem
from backend.app.config import settings


class SpeedAccuracyAnalyzer:
    @staticmethod
    def classify_topics(topic_performances: List[Dict[str, Any]]) -> SpeedAccuracyResponse:
        """
        Classifies topic diagnostics across the 4 behavioral quadrants:
        - Fast (<90s) & Accurate (>=75%) -> Strength
        - Fast (<90s) & Inaccurate (<50%) -> Rushing / Impulsive
        - Slow (>150s) & Accurate (>=75%) -> Speed Bottleneck
        - Slow (>150s) & Inaccurate (<50%) -> Conceptual Weakness
        """
        fast_sec = settings.SPEED_FAST_THRESHOLD_SECONDS
        slow_sec = settings.SPEED_SLOW_THRESHOLD_SECONDS
        acc_high = settings.ACCURACY_HIGH_THRESHOLD
        acc_low = settings.ACCURACY_LOW_THRESHOLD

        items: List[SpeedAccuracyQuadrantItem] = []
        summary = {
            "Strength": 0,
            "Rushing": 0,
            "Speed Bottleneck": 0,
            "Conceptual Weakness": 0,
            "Moderate Pacing": 0
        }

        for t in topic_performances:
            topic_name = t.get("topic", "General Topic")
            subject = t.get("subject", "Physics")
            acc = float(t.get("accuracy", 0.0))
            avg_time = float(t.get("avgTime", t.get("avgTimeSeconds", 120.0)))
            attempts = int(t.get("attempts", t.get("attemptCount", 10)))

            if avg_time <= fast_sec and acc >= acc_high:
                quad = "Fast & Accurate (Strength)"
                summary["Strength"] += 1
                rec = "Maintain rhythm; high mastery and rapid execution."
            elif avg_time <= fast_sec and acc < acc_low:
                quad = "Fast & Inaccurate (Rushing)"
                summary["Rushing"] += 1
                rec = "Slow down reading phase; verify problem constraints before selecting."
            elif avg_time >= slow_sec and acc >= acc_high:
                quad = "Slow & Accurate (Speed Bottleneck)"
                summary["Speed Bottleneck"] += 1
                rec = "Strong understanding; practice timed shortcut heuristics to trim solving duration."
            elif avg_time >= slow_sec and acc < acc_low:
                quad = "Slow & Inaccurate (Conceptual Weakness)"
                summary["Conceptual Weakness"] += 1
                rec = "Critical intervention needed; rebuild core theory before attempting timed drills."
            else:
                quad = "Moderate Pacing (Developing)"
                summary["Moderate Pacing"] += 1
                rec = "Solid baseline; work on incremental accuracy gains."

            items.append(SpeedAccuracyQuadrantItem(
                quadrant=quad,
                topic=topic_name,
                subject=subject,
                avgTimeSeconds=round(avg_time, 1),
                accuracy=round(acc, 1),
                attemptCount=attempts,
                recommendation=rec
            ))

        return SpeedAccuracyResponse(
            fastThresholdSeconds=fast_sec,
            slowThresholdSeconds=slow_sec,
            accurateThresholdPercent=acc_high,
            inaccurateThresholdPercent=acc_low,
            quadrantItems=items,
            distributionSummary=summary
        )
