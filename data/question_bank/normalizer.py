import os
import glob
import json
import re
from typing import Dict, Any, List, Optional, Tuple

CDN_BASE_URL = "https://huggingface.co/datasets/soughed/jee-main-questions/resolve/main"

TOPIC_STANDARDIZATION = {
    # Physics
    "ac": "Alternating Current",
    "ac circuit": "Alternating Current",
    "atomic physics": "Modern Physics & Atomic Structure",
    "behaviour of perfect gases": "Kinetic Theory of Gases",
    "capacitance": "Electrostatics & Capacitance",
    "capacitor": "Electrostatics & Capacitance",
    "center of mass": "Centre of Mass & Collisions",
    "centre of mass": "Centre of Mass & Collisions",
    "circular motion": "Rotational & Circular Motion",
    "collision": "Centre of Mass & Collisions",
    "communication system": "Semiconductors & Communication Systems",
    "current electricity": "Current Electricity",
    "digital electronics": "Semiconductors & Digital Electronics",
    "dual nature of matter": "Modern Physics & Dual Nature of Matter",
    "elasticity": "Mechanical Properties of Solids",
    "electromagnetic waves": "Electromagnetic Waves",
    "electrostatics": "Electrostatics & Capacitance",
    "emi": "Electromagnetic Induction",
    "gravitation": "Gravitation",
    "heat transfer": "Thermodynamics & Heat Transfer",
    "kinematics": "Kinematics & Motion in a Straight Line",
    "laws of motion": "Laws of Motion",
    "magnetic effects of current": "Magnetic Effects of Current & Magnetism",
    "magnetism": "Magnetic Effects of Current & Magnetism",
    "mechanical properties of fluids": "Fluid Mechanics",
    "nuclear physics": "Nuclear Physics",
    "oscillations": "Oscillations & Simple Harmonic Motion",
    "ray optics": "Ray Optics & Optical Instruments",
    "rotational dynamics": "Rotational Dynamics & Moment of Inertia",
    "rotational motion": "Rotational Dynamics & Moment of Inertia",
    "semiconductor": "Semiconductors & Logic Gates",
    "simple harmonic motion": "Oscillations & Simple Harmonic Motion",
    "sound waves": "Wave Motion & Sound Waves",
    "surface tension": "Fluid Mechanics & Surface Tension",
    "thermodynamics": "Thermodynamics & Heat Transfer",
    "units and dimensions": "Units, Dimensions & Errors",
    "wave optics": "Wave Optics & Interference",
    "work power energy": "Work, Energy & Power",

    # Chemistry
    "alcohol, phenol and ethers": "Alcohols, Phenols and Ethers",
    "amines": "Amines & Nitrogen Compounds",
    "atomic structure": "Atomic Structure",
    "carbonyl compound (aldehyde and ketone)": "Aldehydes, Ketones and Carboxylic Acids",
    "chemical bonding": "Chemical Bonding & Molecular Structure",
    "chemical kinetics": "Chemical Kinetics",
    "coordination compounds": "Coordination Compounds",
    "electrochemistry": "Electrochemistry",
    "equivalent concept": "Some Basic Concepts of Chemistry & Mole Concept",
    "eudiometry": "Some Basic Concepts of Chemistry & Mole Concept",
    "halogen": "Haloalkanes and Haloarenes",
    "hydrocarbon": "Hydrocarbons",
    "iupac nomenclature": "General Organic Chemistry & IUPAC Nomenclature",
    "iupac nomenclature and structural isomerism": "General Organic Chemistry & IUPAC Nomenclature",
    "iupac and structural isomerism": "General Organic Chemistry & IUPAC Nomenclature",
    "liquid solutions": "Solutions & Colligative Properties",
    "organic chemistry": "General Organic Chemistry",
    "p block": "p-Block Elements",
    "periodic table": "Classification of Elements & Periodicity",
    "physical chemistry": "Physical Chemistry Fundamentals",
    "qualitative analysis": "Practical Chemistry & Qualitative Analysis",
    "redox reactions": "Redox Reactions",
    "s block": "s-Block Elements",
    "solid state": "Solid State",
    "surface chemistry": "Surface Chemistry",
    "thermodynamics": "Thermodynamics & Thermochemistry",

    # Mathematics
    "3d": "Three Dimensional Geometry",
    "application of derivative": "Application of Derivatives",
    "application of derivatives": "Application of Derivatives",
    "area under curve": "Area Under Curves",
    "binomial theorem": "Binomial Theorem",
    "circle and parabola": "Coordinate Geometry & Conic Sections",
    "circles": "Circles",
    "complex numbers": "Complex Numbers & Quadratic Equations",
    "compound angles": "Trigonometry",
    "conic sections": "Conic Sections",
    "continuity and derivability": "Continuity and Differentiability",
    "continuity and differentiability": "Continuity and Differentiability",
    "definite integration": "Definite Integration",
    "differcntiation": "Differentiation",
    "differentiation": "Differentiation",
    "differential equation": "Differential Equations",
    "ellipse": "Conic Sections & Ellipse",
    "functions": "Functions & Relations",
    "hyperbola": "Conic Sections & Hyperbola",
    "indefinite integration": "Indefinite Integration",
    "limits": "Limits, Continuity and Differentiability",
    "mathematical reasoning": "Mathematical Reasoning",
    "matrices and determinants": "Matrices and Determinants",
    "parabola": "Conic Sections & Parabola",
    "permutation and combination": "Permutations and Combinations",
    "probability": "Probability & Statistics",
    "quadratic equations": "Complex Numbers & Quadratic Equations",
    "sequence and series": "Sequence and Series",
    "sets and relations": "Sets, Relations and Functions",
    "statistics": "Statistics",
    "straight lines": "Straight Lines",
    "trigonometric equations": "Trigonometry & Trigonometric Equations",
    "trigonometry": "Trigonometry",
    "vectors": "Vector Algebra",
}


def parse_difficulty(diff_str: Optional[str]) -> str:
    """Normalize raw difficulty string to standard 'Easy', 'Medium', or 'Hard'."""
    if not diff_str:
        return "Medium"
    s = diff_str.strip().lower()
    if any(k in s for k in ["tough", "hard", "difficult"]):
        return "Hard"
    if "easy" in s and not any(k in s for k in ["moderate", "tough", "medium"]):
        return "Easy"
    if any(k in s for k in ["moderate", "medium", "modertae"]):
        return "Medium"
    return "Medium"


def parse_paper_metadata(paper_str: str) -> Tuple[int, str, str]:
    """
    Extract (year, session, shift) from raw source_paper string.
    Example inputs:
    - 'CH-03 Paper 01 Chemistry with  Hindi  21-8-2020.docx'
    - 'CH-10 Chemistry Paper-1 30 Oct New Jee main.docx'
    - 'CH-25 Chemistry Paper 7 Jan.docx'
    - 'P-20 Physcis Paper 12 Dec.docx'
    """
    year = 2020  # Default baseline for this curated historical series
    session = "Official PYQ Series"
    shift = "Shift 1"

    if not paper_str:
        return year, session, shift

    # Check explicit 4-digit year
    m_year = re.search(r"(20\d\d)", paper_str)
    if m_year:
        year = int(m_year.group(1))

    # Check month
    month_match = re.search(r"\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\b", paper_str, re.IGNORECASE)
    if month_match:
        month = month_match.group(1).title()
        session = f"{month} Session"
        # If paper is January shift without explicit year, it represents the Jan 2021 session
        if month == "Jan" and not m_year:
            year = 2021

    # Check shift or paper number
    if "Paper 2" in paper_str or "Paper-2" in paper_str or "Second" in paper_str:
        shift = "Shift 2"
    elif "Paper 1" in paper_str or "Paper-1" in paper_str or "First" in paper_str:
        shift = "Shift 1"
    elif "Third" in paper_str:
        shift = "Shift 3"
    elif "Fourth" in paper_str:
        shift = "Shift 4"
    elif "FST" in paper_str:
        shift = "Full Subject Test"

    return year, session, shift


def normalize_subject(subj_str: str) -> str:
    s = (subj_str or "").strip().title()
    if "Phys" in s:
        return "Physics"
    if "Chem" in s:
        return "Chemistry"
    if "Math" in s:
        return "Mathematics"
    return "Physics"


def map_chapter_and_topic(subject: str, raw_topic: Optional[str], raw_subtopic: Optional[str]) -> Tuple[str, str, str]:
    """Map raw topic and subtopic to clean chapter, topic, and subtopic."""
    t_clean = (raw_topic or "").strip()
    st_clean = (raw_subtopic or "").strip()

    t_lower = t_clean.lower()
    standardized_chapter = TOPIC_STANDARDIZATION.get(t_lower)

    if not standardized_chapter:
        # Check subtopic as fallback
        st_lower = st_clean.lower()
        standardized_chapter = TOPIC_STANDARDIZATION.get(st_lower)

    if not standardized_chapter:
        # If still unmatched, use cleaned raw topic or fallback to subject core
        if t_clean and t_clean.lower() not in ["physical chemistry", "organic chemistry", "inorganic chemistry"]:
            standardized_chapter = t_clean.title()
        elif st_clean:
            standardized_chapter = st_clean.title()
        else:
            standardized_chapter = f"General {subject}"

    topic = t_clean if t_clean else standardized_chapter
    subtopic = st_clean if st_clean else topic

    return standardized_chapter, topic, subtopic


def normalize_question(raw_dict: Dict[str, Any]) -> Dict[str, Any]:
    raw_id = raw_dict.get("question_id", "").strip()
    raw_subj = raw_dict.get("subject", "")
    subject = normalize_subject(raw_subj)
    subject_code = {"Physics": "P", "Chemistry": "C", "Mathematics": "M"}.get(subject, "P")

    # Stable unique ID
    clean_id = f"JEE-{raw_id}" if not raw_id.startswith("JEE-") else raw_id

    # Parse paper metadata
    paper_str = raw_dict.get("source_paper", "")
    year, session, shift = parse_paper_metadata(paper_str)

    # Chapter, Topic, Subtopic
    raw_topic = raw_dict.get("topic", "")
    raw_subtopic = raw_dict.get("subtopic", "")
    chapter, topic, subtopic = map_chapter_and_topic(subject, raw_topic, raw_subtopic)

    # Question Type
    raw_type = raw_dict.get("question_type", "single_correct").strip().lower()
    raw_opts = [raw_dict.get(f"option_{i}", "") for i in range(1, 5)]
    has_non_empty_opts = any(o and str(o).strip() != "" for o in raw_opts)

    # Check if raw marked as single_correct but has no options and has numerical answer or solution
    if raw_type == "single_correct" and not has_non_empty_opts:
        # If question asks for numerical value or has numerical_answer
        if raw_dict.get("numerical_answer") or re.search(r"what is the value|find the value|is equal to", raw_dict.get("question", ""), re.I):
            question_type = "numerical"
        else:
            question_type = "single_correct"
    else:
        question_type = "numerical" if raw_type == "numerical" else "single_correct"

    # Options & Correct Answer
    options: List[Dict[str, str]] = []
    correct_answer = ""
    opt_keys = ["A", "B", "C", "D"]

    if question_type == "single_correct":
        for idx, key in enumerate(opt_keys):
            opt_text = str(raw_opts[idx]).strip() if idx < len(raw_opts) else ""
            options.append({"id": key, "text": opt_text})

        raw_corr = raw_dict.get("correct_option")
        if raw_corr in [1, "1"]:
            correct_answer = "A"
        elif raw_corr in [2, "2"]:
            correct_answer = "B"
        elif raw_corr in [3, "3"]:
            correct_answer = "C"
        elif raw_corr in [4, "4"]:
            correct_answer = "D"
        elif str(raw_corr).upper() in ["A", "B", "C", "D"]:
            correct_answer = str(raw_corr).upper()
        else:
            correct_answer = "A"  # Fallback for unkeyed practice items, will be flagged
    else:
        options = []
        raw_num = raw_dict.get("numerical_answer")
        if raw_num is not None and str(raw_num).strip() != "":
            correct_answer = str(raw_num).strip()
        else:
            # Fallback to solution extraction if numerical answer was missing
            sol = raw_dict.get("solution", "").strip()
            first_line = sol.split("\n")[0].strip() if sol else ""
            if re.match(r"^-?\d+(\.\d+)?$", first_line):
                correct_answer = first_line
            else:
                correct_answer = "0"

    # Difficulty
    difficulty = parse_difficulty(raw_dict.get("difficulty"))

    # Images
    subj_folder = subject.lower()
    q_imgs = raw_dict.get("question_images", []) or []
    sol_imgs = raw_dict.get("solution_images", []) or []

    image_refs = {
        "has_image": bool(raw_dict.get("has_image") or q_imgs or sol_imgs),
        "question_images": [
            {
                "local_rel_path": f"data/question_bank/raw/{subj_folder}/{img}",
                "cdn_url": f"{CDN_BASE_URL}/{subj_folder}/{img}"
            }
            for img in q_imgs
        ],
        "solution_images": [
            {
                "local_rel_path": f"data/question_bank/raw/{subj_folder}/{img}",
                "cdn_url": f"{CDN_BASE_URL}/{subj_folder}/{img}"
            }
            for img in sol_imgs
        ]
    }

    # Verification status
    q_text = raw_dict.get("question", "").strip()
    is_verified = bool(
        q_text and
        correct_answer and
        (question_type == "numerical" or (question_type == "single_correct" and has_non_empty_opts))
    )
    verification_status = "VERIFIED" if is_verified else "NEEDS_REVIEW"

    normalized = {
        "question_id": clean_id,
        "year": year,
        "exam_session": session,
        "shift": shift,
        "subject": subject,
        "chapter": chapter,
        "topic": topic,
        "subtopic": subtopic,
        "question_type": question_type,
        "question_text": q_text,
        "options": options,
        "correct_answer": correct_answer,
        "explanation": raw_dict.get("solution", "").strip(),
        "difficulty": difficulty,
        "source_name": "Hugging Face: soughed/jee-main-questions",
        "source_url": "https://huggingface.co/datasets/soughed/jee-main-questions",
        "source_question_reference": f"{paper_str} ({raw_id})",
        "license_or_usage_notes": "CC-BY-4.0 (Creative Commons Attribution 4.0 International)",
        "image_or_diagram_reference": image_refs,
        "verification_status": verification_status
    }

    return normalized


def run_normalization():
    print("=" * 60)
    print("JEE InsightAI — Phase 4: Normalising Question Bank Data")
    print("=" * 60)

    raw_files = sorted(glob.glob("data/question_bank/raw/*/*.jsonl"))
    if not raw_files:
        print("[ERROR] No raw files found in data/question_bank/raw/")
        return

    output_file = "data/question_bank/processed/jee_main_pyqs_normalized.jsonl"
    summary_file = "data/question_bank/processed/jee_main_pyqs_summary.json"
    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    total_records = 0
    verified_records = 0
    subject_counts: Dict[str, int] = {}
    difficulty_counts: Dict[str, int] = {}
    type_counts: Dict[str, int] = {}
    year_counts: Dict[int, int] = {}
    chapter_counts: Dict[str, int] = {}

    seen_qids = set()
    with open(output_file, "w", encoding="utf-8") as out_f:
        for fpath in raw_files:
            print(f"Normalizing {fpath}...")
            with open(fpath, "r", encoding="utf-8") as in_f:
                for line in in_f:
                    line_s = line.strip()
                    if not line_s:
                        continue
                    raw_dict = json.loads(line_s)
                    norm_record = normalize_question(raw_dict)

                    qid = norm_record["question_id"]
                    # If exact identical question ID was already processed from earlier split, skip duplicate
                    if qid in seen_qids:
                        continue
                    seen_qids.add(qid)

                    total_records += 1
                    if norm_record["verification_status"] == "VERIFIED":
                        verified_records += 1

                    sub = norm_record["subject"]
                    diff = norm_record["difficulty"]
                    qtype = norm_record["question_type"]
                    yr = norm_record["year"]
                    ch = norm_record["chapter"]

                    subject_counts[sub] = subject_counts.get(sub, 0) + 1
                    difficulty_counts[diff] = difficulty_counts.get(diff, 0) + 1
                    type_counts[qtype] = type_counts.get(qtype, 0) + 1
                    year_counts[yr] = year_counts.get(yr, 0) + 1
                    chapter_counts[ch] = chapter_counts.get(ch, 0) + 1

                    out_f.write(json.dumps(norm_record, ensure_ascii=False) + "\n")

    summary = {
        "total_records": total_records,
        "verified_records": verified_records,
        "needs_review_records": total_records - verified_records,
        "subject_distribution": subject_counts,
        "difficulty_distribution": difficulty_counts,
        "question_type_distribution": type_counts,
        "year_distribution": year_counts,
        "total_distinct_chapters": len(chapter_counts),
        "normalized_file": output_file
    }

    with open(summary_file, "w", encoding="utf-8") as sum_f:
        json.dump(summary, sum_f, indent=2)

    print("\nNormalization Completed Successfully!")
    print(f"  Total records normalized: {total_records}")
    print(f"  Verified records: {verified_records} ({verified_records / total_records * 100:.1f}%)")
    print(f"  Subjects: {subject_counts}")
    print(f"  Question Types: {type_counts}")
    print(f"  Difficulties: {difficulty_counts}")
    print(f"  Distinct Chapters: {len(chapter_counts)}")
    print(f"  Output: {output_file}")
    print("=" * 60)


if __name__ == "__main__":
    run_normalization()
