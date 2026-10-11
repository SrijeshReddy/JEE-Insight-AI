from typing import List
from backend.app.models.attempt import TestAttemptModel
from backend.app.schemas.diagnostics import StudentPersonaResponse


class StudentPersonaClassifier:
    @staticmethod
    def classify(attempts: List[TestAttemptModel]) -> StudentPersonaResponse:
        """
        Rule-based behavioral persona classification.
        Transparently labeled as a deterministic heuristic in Stage 3.
        """
        if len(attempts) < 2:
            return StudentPersonaResponse(
                personaTitle="Emerging Aspirant Profile",
                confidence="Preliminary (Limited Data)",
                dataSufficiency="Insufficient Data (<2 attempts)",
                primaryTrait="Baseline Establishing Phase",
                observedEvidence=[
                    f"Only {len(attempts)} attempt(s) recorded in the database.",
                    "Complete at least 2 full-length mocks to establish statistical pacing baselines."
                ],
                strategicPrescription=[
                    "Continue completing scheduled mock examinations to build empirical telemetry.",
                    "Focus on completing questions within reasonable bounds."
                ],
                isMachineLearningModel=False
            )

        avg_score = sum(a.score for a in attempts) / len(attempts)
        avg_acc = sum(a.accuracy for a in attempts) / len(attempts)
        total_time = sum(a.time_spent_seconds for a in attempts)
        total_questions_attempted = sum(a.correct_count + a.incorrect_count for a in attempts)
        avg_sec_per_question = total_time / total_questions_attempted if total_questions_attempted > 0 else 120.0
        avg_unattempted = sum(a.unattempted_count for a in attempts) / len(attempts)

        # Rule-based persona mapping
        if avg_acc >= 72.0 and avg_sec_per_question > 140.0:
            return StudentPersonaResponse(
                personaTitle="Accurate but Deliberate Solver",
                confidence="High Confidence",
                dataSufficiency="Sufficient",
                primaryTrait="High Precision, Conservative Pacing",
                observedEvidence=[
                    f"Consistently high accuracy ({avg_acc:.1f}%) across attempted questions.",
                    f"Elevated solving duration ({avg_sec_per_question:.0f}s per question vs 100s target).",
                    f"Leaves an average of {avg_unattempted:.0f} questions unattempted due to time exhaustion."
                ],
                strategicPrescription=[
                    "Implement a strict 2-round question selection strategy.",
                    "In round 1, only attempt questions solvable in under 90 seconds.",
                    "Save multi-step numerical calculations for round 2."
                ],
                isMachineLearningModel=False
            )

        if avg_acc < 55.0 and avg_sec_per_question < 80.0:
            return StudentPersonaResponse(
                personaTitle="Rapid but Error-Prone Solver",
                confidence="High Confidence",
                dataSufficiency="Sufficient",
                primaryTrait="Impulsive Pacing, High Negative Penalties",
                observedEvidence=[
                    f"Rapid pacing ({avg_sec_per_question:.0f}s per question vs 100s benchmark).",
                    f"Subdued accuracy ({avg_acc:.1f}%) resulting in frequent negative mark erosion.",
                    "Frequent answer changes and high submission speed."
                ],
                strategicPrescription=[
                    "Slow down the initial problem reading phase by 15 seconds.",
                    "Underline units, signs, and boundary conditions before calculating.",
                    "Eliminate blind guessing on ambiguous questions to stop negative mark leakage."
                ],
                isMachineLearningModel=False
            )

        if avg_acc >= 65.0 and avg_unattempted > 12:
            return StudentPersonaResponse(
                personaTitle="Strong Fundamentals with Pacing Bottleneck",
                confidence="Moderate Confidence",
                dataSufficiency="Sufficient",
                primaryTrait="Solid Conceptual Grounding, Sub-optimal Test Navigation",
                observedEvidence=[
                    f"Solid conceptual conversion rate ({avg_acc:.1f}% accuracy).",
                    f"Average of {avg_unattempted:.0f} questions left unattempted per mock test.",
                    "Time gets disproportionately spent on complex initial problems."
                ],
                strategicPrescription=[
                    "Practice aggressive question triage: abandon stubborn problems after 120 seconds.",
                    "Ensure you see all 75 questions before time runs out."
                ],
                isMachineLearningModel=False
            )

        return StudentPersonaResponse(
            personaTitle="Balanced & Methodical Aspirant",
            confidence="Moderate Confidence",
            dataSufficiency="Sufficient",
            primaryTrait="Steady Pacing, Balanced Subject Distribution",
            observedEvidence=[
                f"Balanced pacing averaging {avg_sec_per_question:.0f}s per question.",
                f"Consistent accuracy baseline of {avg_acc:.1f}%.",
                f"Moderate unattempted cushion of {avg_unattempted:.0f} questions."
            ],
            strategicPrescription=[
                "Focus on subject-specific deep dives in your lowest accuracy topics.",
                "Simulate higher-difficulty JEE Advanced sectional sets to stress-test mastery."
            ],
            isMachineLearningModel=False
        )
