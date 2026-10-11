from typing import Dict, List, Any, Tuple
from backend.app.models.question import QuestionModel
from backend.app.models.test import MockTestModel
from backend.app.schemas.attempt import QuestionResponseInput


class ScoringEngine:
    @staticmethod
    def grade_attempt(
        test: MockTestModel,
        questions: List[QuestionModel],
        responses: Dict[str, QuestionResponseInput],
        total_time_spent_seconds: int
    ) -> Dict[str, Any]:
        """
        Authoritative grading calculation performed on the backend.
        Never relies on client-provided scores. Applies configurable marking schemes.
        """
        scheme = test.marking_scheme or {"correct": 4.0, "incorrect": -1.0, "unattempted": 0.0}
        pos_mark = float(scheme.get("correct", 4.0))
        neg_mark = float(scheme.get("incorrect", -1.0))
        unatt_mark = float(scheme.get("unattempted", 0.0))

        correct_count = 0
        incorrect_count = 0
        unattempted_count = 0
        total_score = 0.0

        graded_responses: Dict[str, Dict[str, Any]] = {}
        subject_stats: Dict[str, Dict[str, Any]] = {
            "Physics": {"score": 0.0, "correct": 0, "incorrect": 0, "unattempted": 0, "total_time": 0, "count": 0},
            "Chemistry": {"score": 0.0, "correct": 0, "incorrect": 0, "unattempted": 0, "total_time": 0, "count": 0},
            "Mathematics": {"score": 0.0, "correct": 0, "incorrect": 0, "unattempted": 0, "total_time": 0, "count": 0}
        }
        topic_stats: Dict[str, Dict[str, Any]] = {}

        for q in questions:
            resp_input = responses.get(q.id)
            selected = resp_input.selectedOption if resp_input else None
            marked_review = resp_input.markedForReview if resp_input else False
            time_spent = resp_input.timeSpentSeconds if resp_input else 0

            # Subject tracking
            subj = q.subject if q.subject in subject_stats else "Physics"
            subject_stats[subj]["count"] += 1
            subject_stats[subj]["total_time"] += time_spent

            # Topic tracking
            top = q.topic
            if top not in topic_stats:
                topic_stats[top] = {
                    "topic": top,
                    "subject": subj,
                    "correct": 0,
                    "incorrect": 0,
                    "total": 0,
                    "total_time": 0
                }
            topic_stats[top]["total"] += 1
            topic_stats[top]["total_time"] += time_spent

            is_correct = None
            marks_awarded = 0.0

            if selected is None or selected == "":
                unattempted_count += 1
                marks_awarded = unatt_mark
                subject_stats[subj]["unattempted"] += 1
            elif selected.strip().upper() == q.correct_option_id.strip().upper():
                correct_count += 1
                is_correct = True
                marks_awarded = pos_mark
                subject_stats[subj]["correct"] += 1
                subject_stats[subj]["score"] += pos_mark
                topic_stats[top]["correct"] += 1
            else:
                incorrect_count += 1
                is_correct = False
                marks_awarded = neg_mark
                subject_stats[subj]["incorrect"] += 1
                subject_stats[subj]["score"] += neg_mark
                topic_stats[top]["incorrect"] += 1

            total_score += marks_awarded

            graded_responses[q.id] = {
                "selectedOption": selected,
                "isCorrect": is_correct,
                "markedForReview": marked_review,
                "timeSpentSeconds": time_spent,
                "marksAwarded": marks_awarded
            }

        # Calculate accuracies with explicit formulas
        attempted_count = correct_count + incorrect_count
        overall_accuracy = round((correct_count / attempted_count * 100), 1) if attempted_count > 0 else 0.0

        subject_breakdown = {}
        for s_name, s_data in subject_stats.items():
            s_attempted = s_data["correct"] + s_data["incorrect"]
            s_acc = round((s_data["correct"] / s_attempted * 100), 1) if s_attempted > 0 else 0.0
            avg_time = round(s_data["total_time"] / s_data["count"], 1) if s_data["count"] > 0 else 0.0
            subject_breakdown[s_name] = {
                "score": round(s_data["score"], 1),
                "accuracy": s_acc,
                "correct": s_data["correct"],
                "incorrect": s_data["incorrect"],
                "unattempted": s_data["unattempted"],
                "avgTime": avg_time
            }

        topic_breakdown = []
        for top_name, top_data in topic_stats.items():
            t_acc = round((top_data["correct"] / top_data["total"] * 100), 1) if top_data["total"] > 0 else 0.0
            avg_t_time = round(top_data["total_time"] / top_data["total"], 1) if top_data["total"] > 0 else 0.0
            topic_breakdown.append({
                "topic": top_name,
                "subject": top_data["subject"],
                "accuracy": t_acc,
                "correct": top_data["correct"],
                "total": top_data["total"],
                "avgTime": avg_t_time
            })
        topic_breakdown.sort(key=lambda x: x["accuracy"])

        # Forensic observations
        observations = []
        if incorrect_count > 4:
            negative_penalty = abs(incorrect_count * neg_mark)
            observations.append(f"Excessive negative penalty: Lost {negative_penalty:.0f} raw marks from {incorrect_count} incorrect attempts.")
        if unattempted_count > len(questions) * 0.4:
            observations.append(f"Conservative pacing: {unattempted_count} questions remained unattempted, indicating time allocation constraints.")
        if overall_accuracy >= 75.0:
            observations.append(f"High precision: Maintained strong overall accuracy of {overall_accuracy}%.")

        return {
            "score": round(total_score, 1),
            "totalMarks": test.max_marks,
            "correctCount": correct_count,
            "incorrectCount": incorrect_count,
            "unattemptedCount": unattempted_count,
            "accuracy": overall_accuracy,
            "gradedResponses": graded_responses,
            "subjectBreakdown": subject_breakdown,
            "topicBreakdown": topic_breakdown,
            "observations": observations
        }
