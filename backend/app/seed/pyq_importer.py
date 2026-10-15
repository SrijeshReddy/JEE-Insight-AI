import os
import sys

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath("."))

import json
import logging
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal, engine, Base
from backend.app.models.question import QuestionModel, QuestionOptionModel
from backend.app.models.test import MockTestModel
from backend.app.models.taxonomy import ConceptModel, ChapterModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("pyq_importer")

PROCESSED_FILE = "data/question_bank/processed/jee_main_pyqs_normalized.jsonl"

OFFICIAL_75Q_PAPERS = {
    "01": {
        "id": "pyq-jee-2020-p01",
        "title": "JEE Main 2020 Official Paper 01 (Full 75-Q Mock)",
        "description": "Authentic full-length JEE Main 2020 examination paper. 25 questions each in Physics, Chemistry, and Mathematics (20 MCQs + 5 Numerical value questions per subject).",
        "questions_count": 75,
        "duration_minutes": 180,
        "max_marks": 300,
        "difficulty": "Moderate"
    },
    "06": {
        "id": "pyq-jee-2020-p06",
        "title": "JEE Main 2020 Official Paper 06 (Full 75-Q Mock)",
        "description": "Authentic full-length JEE Main 2020 examination paper. Standard NTA 3-hour pattern covering full syllabus with worked step-by-step solutions.",
        "questions_count": 75,
        "duration_minutes": 180,
        "max_marks": 300,
        "difficulty": "Moderate"
    },
    "10": {
        "id": "pyq-jee-2020-p10",
        "title": "JEE Main 2020 Official Paper 10 (Full 75-Q Mock)",
        "description": "Authentic full-length JEE Main 2020 examination paper from October shift with complete answer key and analytical explanations.",
        "questions_count": 75,
        "duration_minutes": 180,
        "max_marks": 300,
        "difficulty": "Challenging"
    },
    "11": {
        "id": "pyq-jee-2020-p11",
        "title": "JEE Main 2020 Official Paper 11 (Full 75-Q Mock)",
        "description": "Authentic full-length JEE Main 2020 examination paper from November session with full subject split.",
        "questions_count": 75,
        "duration_minutes": 180,
        "max_marks": 300,
        "difficulty": "Moderate"
    },
    "12": {
        "id": "pyq-jee-2020-p12",
        "title": "JEE Main 2020 Official Paper 12 (Full 75-Q Mock)",
        "description": "Authentic full-length JEE Main 2020 examination paper from November session.",
        "questions_count": 75,
        "duration_minutes": 180,
        "max_marks": 300,
        "difficulty": "Moderate"
    }
}


def build_concept_lookup(db: Session) -> Dict[str, str]:
    """Build a keyword-to-concept_id mapping based on seeded taxonomy concepts."""
    lookup = {}
    concepts = db.query(ConceptModel).all()
    for c in concepts:
        lookup[c.name.lower()] = c.id
        lookup[c.code.lower()] = c.id
    return lookup


def import_pyqs(db: Session = None, max_records: int = None):
    """
    Import normalized PYQ records into the database idempotently.
    Preserves all existing benchmark tests (e.g. mock-jee-09) and student attempts.
    """
    if db is None:
        db = SessionLocal()

    print("=" * 65)
    print("JEE InsightAI — Phase 6: Ingesting Validated PYQ Question Bank")
    print("=" * 65)

    if not os.path.exists(PROCESSED_FILE):
        print(f"[ERROR] Processed file {PROCESSED_FILE} not found. Run normalizer first.")
        return

    concept_lookup = build_concept_lookup(db)

    # 1. Ensure official full-length test headers exist in mock_tests table
    for pcode, pmeta in OFFICIAL_75Q_PAPERS.items():
        existing_test = db.query(MockTestModel).filter_by(id=pmeta["id"]).first()
        if not existing_test:
            new_test = MockTestModel(
                id=pmeta["id"],
                title=pmeta["title"],
                test_type="Full-Length",
                subject=None,
                questions_count=pmeta["questions_count"],
                duration_minutes=pmeta["duration_minutes"],
                max_marks=pmeta["max_marks"],
                difficulty=pmeta["difficulty"],
                status="Available",
                description=pmeta["description"],
                marking_scheme={"correct": 4, "incorrect": -1, "unattempted": 0}
            )
            db.add(new_test)
            print(f"Created MockTest header: {pmeta['id']} - {pmeta['title']}")
        else:
            print(f"MockTest header already exists: {pmeta['id']}")
    db.commit()

    # 2. Ingest normalized questions
    imported_count = 0
    updated_count = 0
    skipped_count = 0
    test_assigned_count = 0

    paper_question_counters = {pcode: 1 for pcode in OFFICIAL_75Q_PAPERS}

    with open(PROCESSED_FILE, "r", encoding="utf-8") as f:
        for idx, line in enumerate(f, start=1):
            if max_records and idx > max_records:
                break
            line_s = line.strip()
            if not line_s:
                continue

            rec = json.loads(line_s)
            qid = rec["question_id"]
            subject = rec["subject"]
            topic = rec["topic"]
            chapter = rec["chapter"]
            qtype = rec.get("question_type", "single_correct")
            diff = rec.get("difficulty", "Medium")
            stmt = rec.get("question_text", "")
            corr_ans = str(rec.get("correct_answer", "A"))
            exp = rec.get("explanation", "")
            yr = rec.get("year", 2020)
            session = rec.get("exam_session", "Session 1")
            shift = rec.get("shift", "Shift 1")
            src_ref = rec.get("source_question_reference", "")
            num_ans = rec.get("numerical_answer") if qtype == "numerical" else None
            diag_data = rec.get("image_or_diagram_reference")
            v_status = rec.get("verification_status", "VERIFIED")

            # Determine if question belongs to one of the complete 75-Q official paper tests
            parts = qid.replace("JEE-", "").split("-")
            paper_code = parts[1] if len(parts) >= 2 else None

            test_id = None
            q_num = 1
            if paper_code in OFFICIAL_75Q_PAPERS:
                test_id = OFFICIAL_75Q_PAPERS[paper_code]["id"]
                q_num = paper_question_counters[paper_code]
                paper_question_counters[paper_code] += 1
                test_assigned_count += 1
            else:
                q_num = idx

            # Concept matching fallback
            matched_concept_id = None
            t_lower = topic.lower()
            ch_lower = chapter.lower()
            for k, cid in concept_lookup.items():
                if k in t_lower or k in ch_lower:
                    matched_concept_id = cid
                    break

            # Check if exists in DB
            q_model = db.query(QuestionModel).filter_by(id=qid).first()
            if not q_model:
                q_model = QuestionModel(
                    id=qid,
                    test_id=test_id,
                    question_number=q_num,
                    subject=subject,
                    topic=topic,
                    concept_id=matched_concept_id,
                    statement=stmt,
                    correct_option_id=corr_ans,
                    explanation=exp,
                    difficulty=diff,
                    positive_marks=4.0,
                    negative_marks=-1.0 if qtype == "single_correct" else 0.0,
                    common_misconception=None,
                    remember_rule=None,
                    year=yr,
                    exam_session=session,
                    shift=shift,
                    chapter=chapter,
                    question_type=qtype,
                    numerical_answer=num_ans,
                    source_paper=src_ref,
                    is_pyq=1,
                    verification_status=v_status,
                    diagram_data=diag_data
                )
                db.add(q_model)
                imported_count += 1
            else:
                # Update metadata in place
                q_model.test_id = test_id
                q_model.question_number = q_num
                q_model.subject = subject
                q_model.topic = topic
                q_model.chapter = chapter
                q_model.statement = stmt
                q_model.correct_option_id = corr_ans
                q_model.explanation = exp
                q_model.difficulty = diff
                q_model.year = yr
                q_model.exam_session = session
                q_model.shift = shift
                q_model.question_type = qtype
                q_model.numerical_answer = num_ans
                q_model.source_paper = src_ref
                q_model.is_pyq = 1
                q_model.verification_status = v_status
                q_model.diagram_data = diag_data
                updated_count += 1

            # Populate Options for MCQs
            raw_options = rec.get("options", [])
            if raw_options and qtype == "single_correct":
                # Clear old options if any
                db.query(QuestionOptionModel).filter_by(question_id=qid).delete()
                for opt in raw_options:
                    opt_key = opt.get("id", "A")
                    opt_text = opt.get("text", "")
                    opt_model = QuestionOptionModel(
                        id=f"{qid}-{opt_key}",
                        question_id=qid,
                        option_key=opt_key,
                        text=opt_text
                    )
                    db.add(opt_model)

            # Commit periodically to keep memory bounded
            if idx % 200 == 0:
                db.commit()
                print(f"  Processed {idx} questions...")

    db.commit()
    print("=" * 65)
    print("PYQ Ingestion Completed!")
    print(f"  New questions imported: {imported_count}")
    print(f"  Existing questions updated: {updated_count}")
    print(f"  Questions assigned to Official 75-Q Mock Tests: {test_assigned_count}")
    print(f"  Standalone Question Bank items: {imported_count + updated_count - test_assigned_count}")
    print("=" * 65)


if __name__ == "__main__":
    import_pyqs()
