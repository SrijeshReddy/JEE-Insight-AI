from datetime import datetime
from sqlalchemy.orm import Session
from backend.app.models.user import StudentProfileModel
from backend.app.models.taxonomy import (
    SubjectModel, UnitModel, ChapterModel, ConceptModel, ErrorArchetypeModel
)
from backend.app.models.test import MockTestModel
from backend.app.models.question import QuestionModel, QuestionOptionModel
from backend.app.models.task import StudyTaskModel
from backend.app.models.attempt import TestAttemptModel


def seed_database(db: Session) -> None:
    """Idempotently seeds baseline taxonomy, mock tests, questions, and benchmark attempts."""

    # 1. Seed Student Profile
    profile = db.query(StudentProfileModel).filter_by(id="student-aarav-01").first()
    if not profile:
        profile = StudentProfileModel(
            id="student-aarav-01",
            name="Aarav Sharma",
            target_exam="JEE Main 2027",
            target_score=210,
            daily_study_hours=6,
            preferred_subjects=["Physics", "Chemistry", "Mathematics"],
            theme="light",
            timer_mode="Flexible Demo",
            registered_date="2026-08-15"
        )
        db.add(profile)
        db.commit()

    # 2. Seed Subjects
    subjects_data = [
        ("Physics", "Physics"),
        ("Chemistry", "Chemistry"),
        ("Mathematics", "Mathematics")
    ]
    for s_id, s_name in subjects_data:
        if not db.query(SubjectModel).filter_by(id=s_id).first():
            db.add(SubjectModel(id=s_id, name=s_name))
    db.commit()

    # 3. Seed Units & Chapters & Concepts
    taxonomy_hierarchy = [
        # Physics
        ("u-p-mech", "Physics", "Classical Mechanics", [
            ("ch-p-rot", "Rotational Dynamics & Moment of Inertia", [
                ("c-p-moi", "PHY-ROT-01", "Parallel & Perpendicular Axes Theorems", "High"),
                ("c-p-angmom", "PHY-ROT-02", "Conservation of Angular Momentum", "High"),
                ("c-p-torque", "PHY-ROT-03", "Torque and Equilibrium in Rigid Bodies", "Medium")
            ]),
            ("ch-p-shm", "Oscillations & Simple Harmonic Motion", [
                ("c-p-shm-en", "PHY-SHM-01", "Energy in Simple Harmonic Motion", "Medium"),
                ("c-p-shm-t", "PHY-SHM-02", "Time Period Calculations for Springs & Pendulums", "High")
            ])
        ]),
        ("u-p-em", "Physics", "Electricity & Magnetism", [
            ("ch-p-emi", "Electromagnetic Induction & Alternating Current", [
                ("c-p-emi-fl", "PHY-EMI-01", "Faraday's Law & Lenz's Law Applications", "High"),
                ("c-p-emi-lcr", "PHY-EMI-02", "LCR Series Resonance & Power Factor", "High")
            ]),
            ("ch-p-opt", "Wave Optics & Interference", [
                ("c-p-opt-ydse", "PHY-OPT-01", "Young's Double Slit Experiment & Fringe Width", "High")
            ])
        ]),
        # Chemistry
        ("u-c-phys", "Chemistry", "Physical Chemistry", [
            ("ch-c-thermo", "Thermodynamics & Thermochemistry", [
                ("c-c-gibbs", "CHM-THM-01", "Gibbs Free Energy & Spontaneity Criteria", "High"),
                ("c-c-calor", "CHM-THM-02", "Hess's Law & Enthalpy of Reactions", "Medium")
            ]),
            ("ch-c-equil", "Chemical & Ionic Equilibrium", [
                ("c-c-ph", "CHM-EQU-01", "pH of Buffer Solutions & Salt Hydrolysis", "High")
            ])
        ]),
        ("u-c-org", "Chemistry", "Organic Chemistry", [
            ("ch-c-carb", "Carbonyl Compounds & Reaction Mechanisms", [
                ("c-c-aldol", "CHM-ORG-01", "Aldol & Cannizzaro Condensation Mechanisms", "High"),
                ("c-c-reduc", "CHM-ORG-02", "Selective Hydride Reductions (NaBH4 vs LiAlH4)", "Medium")
            ])
        ]),
        # Mathematics
        ("u-m-calc", "Mathematics", "Calculus & Analysis", [
            ("ch-m-integ", "Integral Calculus & Differential Equations", [
                ("c-m-byparts", "MTH-INT-01", "Integration by Parts & Reduction Formulas", "High"),
                ("c-m-defprop", "MTH-INT-02", "King's Rule & Symmetry in Definite Integrals", "High"),
                ("c-m-diffeq", "MTH-INT-03", "Linear First Order Differential Equations", "High")
            ])
        ]),
        ("u-m-alg", "Mathematics", "Algebra & Geometry", [
            ("ch-m-coord", "Coordinate Geometry & Conic Sections", [
                ("c-m-parab", "MTH-CON-01", "Tangents & Normals to Parabola & Ellipse", "High")
            ]),
            ("ch-m-vec3d", "Vectors & 3D Geometry", [
                ("c-m-coplan", "MTH-VEC-01", "Scalar Triple Product & Coplanarity", "High"),
                ("c-m-shortest", "MTH-VEC-02", "Shortest Distance Between Skew Lines", "High")
            ])
        ])
    ]

    for u_id, s_id, u_name, chapters in taxonomy_hierarchy:
        if not db.query(UnitModel).filter_by(id=u_id).first():
            db.add(UnitModel(id=u_id, subject_id=s_id, name=u_name))
        for ch_id, ch_name, concepts in chapters:
            if not db.query(ChapterModel).filter_by(id=ch_id).first():
                db.add(ChapterModel(id=ch_id, unit_id=u_id, name=ch_name))
            for c_id, c_code, c_name, c_tier in concepts:
                if not db.query(ConceptModel).filter_by(id=c_id).first():
                    db.add(ConceptModel(id=c_id, chapter_id=ch_id, code=c_code, name=c_name, weightage_tier=c_tier))
    db.commit()

    # 4. Seed Mock Tests
    tests_data = [
        {
            "id": "test-jee-09",
            "title": "JEE Main Mock #9 — Live Demo Examination",
            "test_type": "Full-Length",
            "subject": None,
            "questions_count": 15,
            "duration_minutes": 30,
            "max_marks": 60,
            "difficulty": "Moderate",
            "status": "Available",
            "description": "Balanced 15-question demonstration paper covering Physics, Chemistry, and Mathematics with instant automated analysis.",
            "marking_scheme": {"correct": 4.0, "incorrect": -1.0, "unattempted": 0.0}
        },
        {
            "id": "mock-jee-09",
            "title": "JEE Main Full Mock #9 (Diagnostic)",
            "test_type": "Full-Length",
            "subject": None,
            "questions_count": 15,
            "duration_minutes": 30,
            "max_marks": 60,
            "difficulty": "Moderate",
            "status": "Available",
            "description": "Full syllabus mock examination diagnostic covering foundational chapters of Physics, Chemistry, and Mathematics.",
            "marking_scheme": {"correct": 4.0, "incorrect": -1.0, "unattempted": 0.0}
        },
        {
            "id": "test-math-sec",
            "title": "Mathematics Sectional Speed Sprint",
            "test_type": "Subject",
            "subject": "Mathematics",
            "questions_count": 10,
            "duration_minutes": 25,
            "max_marks": 40,
            "difficulty": "Challenging",
            "status": "Available",
            "description": "High-yield Mathematics sectional test testing speed and precision across Calculus, Vectors, and Conics.",
            "marking_scheme": {"correct": 4.0, "incorrect": -1.0, "unattempted": 0.0}
        },
        {
            "id": "test-chap-integ",
            "title": "Chapter Diagnostic: Integral Calculus",
            "test_type": "Chapter",
            "subject": "Mathematics",
            "questions_count": 5,
            "duration_minutes": 15,
            "max_marks": 20,
            "difficulty": "Moderate",
            "status": "Available",
            "description": "Focused chapter-level assessment covering King's Property, integration by parts, and linear differential equations.",
            "marking_scheme": {"correct": 4.0, "incorrect": -1.0, "unattempted": 0.0}
        }
    ]

    for t in tests_data:
        if not db.query(MockTestModel).filter_by(id=t["id"]).first():
            db.add(MockTestModel(**t))
    db.commit()

    # 5. Seed Questions for Mock #9
    questions_mock_09 = [
        # Physics
        {
            "id": "q-m9-p01", "test_id": "mock-jee-09", "question_number": 1, "subject": "Physics",
            "topic": "Rotational Dynamics & Moment of Inertia", "concept_id": "c-p-moi",
            "statement": "A uniform thin rod of mass M and length L has moment of inertia I₁ about an axis perpendicular to the rod passing through its center of mass. The rod is now bent at its midpoint into an L-shape at an angle of 90°. What is the moment of inertia I₂ of this bent rod about the same perpendicular axis passing through the corner vertex?",
            "options": [("A", "I₂ = (1/3) M L²"), ("B", "I₂ = (1/12) M L²"), ("C", "I₂ = (1/6) M L²"), ("D", "I₂ = (1/4) M L²")],
            "correct_option_id": "B",
            "explanation": "Initial rod: I₁ = (1/12) M L². When bent at midpoint, each half has mass m = M/2 and length l = L/2. Moment of inertia of a rod about its end is (1/3) m l². For two halves meeting at the vertex: I₂ = 2 * [(1/3) * (M/2) * (L/2)²] = 2 * (1/3) * (M/2) * (L²/4) = (1/12) M L².",
            "difficulty": "Medium"
        },
        {
            "id": "q-m9-p02", "test_id": "mock-jee-09", "question_number": 2, "subject": "Physics",
            "topic": "Rotational Dynamics & Moment of Inertia", "concept_id": "c-p-angmom",
            "statement": "A disc of mass M and radius R rotates freely about its central axis with angular velocity ω₀. A second identical stationary disc of mass M and radius R is gently dropped coaxially onto the first disc. What fraction of the initial rotational kinetic energy is dissipated as thermal friction?",
            "options": [("A", "25%"), ("B", "50%"), ("C", "75%"), ("D", "33.3%")],
            "correct_option_id": "B",
            "explanation": "Conservation of angular momentum: I ω₀ = (I + I) ω_final => ω_final = ω₀ / 2. Initial KE = (1/2) I ω₀². Final KE = (1/2) (2I) (ω₀/2)² = (1/4) I ω₀². Energy lost = (1/2) - (1/4) = 1/4 of initial energy scale, which is exactly (1/2) or 50% of initial KE.",
            "difficulty": "Easy"
        },
        {
            "id": "q-m9-p03", "test_id": "mock-jee-09", "question_number": 3, "subject": "Physics",
            "topic": "Simple Harmonic Motion & Waves", "concept_id": "c-p-shm-en",
            "statement": "A particle executes SHM with amplitude A. At what displacement x from the mean position is its kinetic energy equal to 3 times its potential energy?",
            "options": [("A", "x = A / 2"), ("B", "x = A / √2"), ("C", "x = (√3 / 2) A"), ("D", "x = A / 4")],
            "correct_option_id": "A",
            "explanation": "KE = (1/2) k (A² - x²), PE = (1/2) k x². If KE = 3 PE => (1/2) k (A² - x²) = 3 * (1/2) k x² => A² - x² = 3x² => 4x² = A² => x = A / 2.",
            "difficulty": "Easy"
        },
        {
            "id": "q-m9-p04", "test_id": "mock-jee-09", "question_number": 4, "subject": "Physics",
            "topic": "Electromagnetic Induction & AC", "concept_id": "c-p-emi-lcr",
            "statement": "In a series LCR circuit, R = 10 Ω, L = 0.1 H, and C = 10 µF. When the circuit is connected to an AC source of variable frequency, what is the resonance angular frequency ω_r?",
            "options": [("A", "1000 rad/s"), ("B", "100 rad/s"), ("C", "500 rad/s"), ("D", "2000 rad/s")],
            "correct_option_id": "A",
            "explanation": "Resonant angular frequency ω_r = 1 / √(L C) = 1 / √(0.1 * 10 * 10⁻⁶) = 1 / √(10⁻⁶) = 1 / 10⁻³ = 1000 rad/s.",
            "difficulty": "Medium"
        },
        {
            "id": "q-m9-p05", "test_id": "mock-jee-09", "question_number": 5, "subject": "Physics",
            "topic": "Optics & Wave Motion", "concept_id": "c-p-opt-ydse",
            "statement": "In Young's double slit experiment, yellow light of wavelength 600 nm produces fringes of width 2.0 mm on a screen. If the entire apparatus is immersed in water of refractive index µ = 4/3, what will be the new fringe width?",
            "options": [("A", "1.5 mm"), ("B", "2.67 mm"), ("C", "2.0 mm"), ("D", "1.33 mm")],
            "correct_option_id": "A",
            "explanation": "In medium of refractive index µ, wavelength λ' = λ / µ. Fringe width β = λ D / d, so β' = β / µ = 2.0 / (4/3) = 2.0 * 0.75 = 1.5 mm.",
            "difficulty": "Easy"
        },
        # Chemistry
        {
            "id": "q-m9-c01", "test_id": "mock-jee-09", "question_number": 6, "subject": "Chemistry",
            "topic": "Chemical Thermodynamics", "concept_id": "c-c-gibbs",
            "statement": "For a chemical reaction at 300 K, ΔH = -60.0 kJ/mol and ΔS = -100.0 J/(K·mol). What is the value of ΔG, and is the reaction spontaneous?",
            "options": [("A", "ΔG = -30.0 kJ/mol, Spontaneous"), ("B", "ΔG = +30.0 kJ/mol, Non-spontaneous"), ("C", "ΔG = -90.0 kJ/mol, Spontaneous"), ("D", "ΔG = 0, At equilibrium")],
            "correct_option_id": "A",
            "explanation": "ΔG = ΔH - T ΔS. ΔH = -60.0 kJ/mol, T ΔS = 300 * (-0.100 kJ/mol) = -30.0 kJ/mol. ΔG = -60.0 - (-30.0) = -30.0 kJ/mol. Since ΔG < 0, the reaction is spontaneous.",
            "difficulty": "Easy"
        },
        {
            "id": "q-m9-c02", "test_id": "mock-jee-09", "question_number": 7, "subject": "Chemistry",
            "topic": "Chemical Thermodynamics", "concept_id": "c-c-gibbs",
            "statement": "For the vaporization of water at 1 atm: H₂O(l) ⇌ H₂O(g), ΔH_vap = 40.7 kJ/mol and ΔS_vap = 109 J/(K·mol). At what temperature does the reaction transition to spontaneous vaporization?",
            "options": [("A", "373.4 K (~100.2 °C)"), ("B", "298.0 K"), ("C", "420.5 K"), ("D", "350.0 K")],
            "correct_option_id": "A",
            "explanation": "Transition temperature T = ΔH / ΔS = (40.7 * 10³ J/mol) / (109 J/(K·mol)) ≈ 373.4 K ≈ 100.2 °C, which matches the normal boiling point of water.",
            "difficulty": "Medium"
        },
        {
            "id": "q-m9-c03", "test_id": "mock-jee-09", "question_number": 8, "subject": "Chemistry",
            "topic": "Ionic Equilibrium", "concept_id": "c-c-ph",
            "statement": "What is the pH of an aqueous buffer solution containing 0.1 M CH₃COOH and 0.1 M CH₃COONa? (Given: pKa of CH₃COOH = 4.74).",
            "options": [("A", "pH = 4.74"), ("B", "pH = 5.74"), ("C", "pH = 3.74"), ("D", "pH = 7.00")],
            "correct_option_id": "A",
            "explanation": "Henderson-Hasselbalch equation: pH = pKa + log([Salt] / [Acid]) = 4.74 + log(0.1 / 0.1) = 4.74 + log(1) = 4.74.",
            "difficulty": "Easy"
        },
        {
            "id": "q-m9-c04", "test_id": "mock-jee-09", "question_number": 9, "subject": "Chemistry",
            "topic": "Organic Carbonyl Reactions", "concept_id": "c-c-aldol",
            "statement": "Which of the following carbonyl compounds CANNOT undergo self-aldol condensation in the presence of dilute aqueous NaOH?",
            "options": [("A", "Formaldehyde (HCHO)"), ("B", "Acetaldehyde (CH₃CHO)"), ("C", "Acetone (CH₃COCH₃)"), ("D", "Propanal (CH₃CH₂CHO)")],
            "correct_option_id": "A",
            "explanation": "Aldol condensation requires at least one α-hydrogen to form the enolate nucleophile. Formaldehyde (HCHO) lacks an α-carbon and therefore has no α-hydrogen (it undergoes Cannizzaro reaction instead).",
            "difficulty": "Easy"
        },
        {
            "id": "q-m9-c05", "test_id": "mock-jee-09", "question_number": 10, "subject": "Chemistry",
            "topic": "Organic Carbonyl Reactions", "concept_id": "c-c-reduc",
            "statement": "When ethyl acetate (CH₃COOCH₂CH₃) is treated with lithium aluminium hydride (LiAlH₄) followed by acidic workup, the primary organic products obtained are:",
            "options": [("A", "Two equivalents of Ethanol (CH₃CH₂OH)"), ("B", "Acetic acid + Ethanol"), ("C", "Acetaldehyde + Ethanol"), ("D", "Ethane + Ethanol")],
            "correct_option_id": "A",
            "explanation": "LiAlH₄ reduces esters completely to alcohols. Ethyl acetate breaks into ethanol from the acyl fragment (CH₃CH₂OH) and ethanol from the alkoxy fragment (CH₃CH₂OH), yielding 2 equivalents of ethanol.",
            "difficulty": "Medium"
        },
        # Mathematics
        {
            "id": "q-m9-m01", "test_id": "mock-jee-09", "question_number": 11, "subject": "Mathematics",
            "topic": "Integral Calculus & Differential Equations", "concept_id": "c-m-defprop",
            "statement": "Evaluate the definite integral I = ∫₀^(π/2) [ (sin x)^(3/2) / ((sin x)^(3/2) + (cos x)^(3/2)) ] dx.",
            "options": [("A", "π / 4"), ("B", "π / 2"), ("C", "π"), ("D", "1")],
            "correct_option_id": "A",
            "explanation": "By King's property: ∫₀^a f(x) dx = ∫₀^a f(a - x) dx. Here f(π/2 - x) swaps sin x and cos x. Adding the two integrals gives 2I = ∫₀^(π/2) 1 dx = π/2 => I = π/4.",
            "difficulty": "Easy"
        },
        {
            "id": "q-m9-m02", "test_id": "mock-jee-09", "question_number": 12, "subject": "Mathematics",
            "topic": "Integral Calculus & Differential Equations", "concept_id": "c-m-diffeq",
            "statement": "What is the integrating factor (I.F.) for the linear differential equation (dy/dx) + (2x / (1 + x²)) y = (4x² / (1 + x²))?",
            "options": [("A", "1 + x²"), ("B", "ln(1 + x²)"), ("C", "1 / (1 + x²)"), ("D", "e^(2x)")],
            "correct_option_id": "A",
            "explanation": "P(x) = 2x / (1 + x²). ∫ P(x) dx = ln(1 + x²). Integrating factor I.F. = e^(∫ P dx) = e^(ln(1 + x²)) = 1 + x².",
            "difficulty": "Easy"
        },
        {
            "id": "q-m9-m03", "test_id": "mock-jee-09", "question_number": 13, "subject": "Mathematics",
            "topic": "Integral Calculus & Differential Equations", "concept_id": "c-m-byparts",
            "statement": "Evaluate ∫ e^(2x) · sin(3x) dx.",
            "options": [
                ("A", "(e^(2x) / 13) [ 2 sin(3x) - 3 cos(3x) ] + C"),
                ("B", "(e^(2x) / 13) [ 3 sin(2x) - 2 cos(3x) ] + C"),
                ("C", "(e^(2x) / 5) [ sin(3x) - cos(3x) ] + C"),
                ("D", "(e^(2x) / 9) [ 2 sin(3x) + 3 cos(3x) ] + C")
            ],
            "correct_option_id": "A",
            "explanation": "Standard integral ∫ e^(ax) sin(bx) dx = (e^(ax) / (a² + b²)) * [a sin(bx) - b cos(bx)]. With a = 2, b = 3: a² + b² = 13 => (e^(2x) / 13) * [2 sin(3x) - 3 cos(3x)] + C.",
            "difficulty": "Medium"
        },
        {
            "id": "q-m9-m04", "test_id": "mock-jee-09", "question_number": 14, "subject": "Mathematics",
            "topic": "Vectors & 3D Geometry", "concept_id": "c-m-coplan",
            "statement": "If the vectors a = 2i - j + k, b = i + 2j - 3k, and c = 3i + λj + 5k are coplanar, what is the value of the scalar parameter λ?",
            "options": [("A", "λ = -4"), ("B", "λ = 2"), ("C", "λ = -2"), ("D", "λ = 6")],
            "correct_option_id": "A",
            "explanation": "Coplanar condition: Scalar triple product [a b c] = 0. Det |[2, -1, 1], [1, 2, -3], [3, λ, 5]| = 2(10 + 3λ) - (-1)(5 + 9) + 1(λ - 6) = 20 + 6λ + 14 + λ - 6 = 7λ + 28 = 0 => 7λ = -28 => λ = -4.",
            "difficulty": "Easy"
        },
        {
            "id": "q-m9-m05", "test_id": "mock-jee-09", "question_number": 15, "subject": "Mathematics",
            "topic": "Coordinate Geometry & Conic Sections", "concept_id": "c-m-parab",
            "statement": "The line y = mx + c touches the parabola y² = 4ax. What is the necessary and sufficient condition relating c, a, and m?",
            "options": [("A", "c = a / m"), ("B", "c = -a m²"), ("C", "c = a m"), ("D", "c = a / m²")],
            "correct_option_id": "A",
            "explanation": "For tangency to y² = 4ax, substitute y = mx + c => (mx + c)² = 4ax => m²x² + 2(mc - 2a)x + c² = 0. Setting discriminant Δ = 0 yields 4(mc - 2a)² - 4m²c² = 0 => -16amc + 16a² = 0 => mc = a => c = a / m.",
            "difficulty": "Easy"
        }
    ]

    alias_ids = [
        "q-p1", "q-p2", "q-p3", "q-p4", "q-p5",
        "q-c1", "q-c2", "q-c3", "q-c4", "q-c5",
        "q-m1", "q-m2", "q-m3", "q-m4", "q-m5"
    ]

    for idx, q_dict in enumerate(questions_mock_09):
        q_copy = dict(q_dict)
        opts = list(q_copy.pop("options", []))

        # 1. Seed as mock-jee-09 question
        if not db.query(QuestionModel).filter_by(id=q_copy["id"]).first():
            q_obj = QuestionModel(**q_copy)
            db.add(q_obj)
            db.flush()
            for opt_key, opt_text in opts:
                db.add(QuestionOptionModel(
                    id=f"{q_obj.id}-{opt_key}",
                    question_id=q_obj.id,
                    option_key=opt_key,
                    text=opt_text
                ))

        # 2. Also seed as test-jee-09 question with frontend alias ID
        alias_id = alias_ids[idx]
        if not db.query(QuestionModel).filter_by(id=alias_id).first():
            q_alias = dict(q_copy)
            q_alias["id"] = alias_id
            q_alias["test_id"] = "test-jee-09"
            q_alias_obj = QuestionModel(**q_alias)
            db.add(q_alias_obj)
            db.flush()
            for opt_key, opt_text in opts:
                db.add(QuestionOptionModel(
                    id=f"{q_alias_obj.id}-{opt_key}",
                    question_id=q_alias_obj.id,
                    option_key=opt_key,
                    text=opt_text
                ))
    db.commit()

    # 6. Seed Baseline Benchmark Attempts (Mocks #1 through #8)
    benchmark_attempts = [
        {"id": "mock-1-benchmark", "title": "JEE Main Mock #1", "date": "2026-08-20", "score": 92.0, "total": 300, "acc": 48.0, "time": 10800, "p_score": 32, "c_score": 35, "m_score": 25},
        {"id": "mock-2-benchmark", "title": "JEE Main Mock #2", "date": "2026-08-27", "score": 98.0, "total": 300, "acc": 51.0, "time": 10800, "p_score": 36, "c_score": 38, "m_score": 24},
        {"id": "mock-3-benchmark", "title": "JEE Main Mock #3", "date": "2026-09-03", "score": 105.0, "total": 300, "acc": 53.0, "time": 10800, "p_score": 40, "c_score": 42, "m_score": 23},
        {"id": "mock-4-benchmark", "title": "JEE Main Mock #4", "date": "2026-09-10", "score": 102.0, "total": 300, "acc": 52.0, "time": 10800, "p_score": 38, "c_score": 40, "m_score": 24},
        {"id": "mock-5-benchmark", "title": "JEE Main Mock #5", "date": "2026-09-17", "score": 115.0, "total": 300, "acc": 56.0, "time": 10800, "p_score": 45, "c_score": 44, "m_score": 26},
        {"id": "mock-6-benchmark", "title": "JEE Main Mock #6", "date": "2026-09-24", "score": 122.0, "total": 300, "acc": 59.0, "time": 10800, "p_score": 48, "c_score": 46, "m_score": 28},
        {"id": "mock-7-benchmark", "title": "JEE Main Mock #7", "date": "2026-10-01", "score": 118.0, "total": 300, "acc": 58.0, "time": 10800, "p_score": 46, "c_score": 45, "m_score": 27},
        {"id": "mock-8-baseline", "title": "JEE Main Mock #8 (Benchmark Baseline)", "date": "2026-10-08", "score": 128.0, "total": 300, "acc": 61.0, "time": 10800, "p_score": 52, "c_score": 48, "m_score": 28}
    ]

    for b in benchmark_attempts:
        if not db.query(TestAttemptModel).filter_by(id=b["id"]).first():
            db.add(TestAttemptModel(
                id=b["id"],
                student_id="student-aarav-01",
                test_id="mock-jee-09",
                test_title=b["title"],
                date=b["date"],
                start_time=datetime.utcnow(),
                submission_time=datetime.utcnow(),
                time_spent_seconds=b["time"],
                score=b["score"],
                total_marks=b["total"],
                correct_count=int(b["score"] // 4) + 6,
                incorrect_count=24,
                unattempted_count=20,
                accuracy=b["acc"],
                percentile=88.4,
                status="completed",
                marking_scheme={"correct": 4.0, "incorrect": -1.0, "unattempted": 0.0},
                subject_breakdown={
                    "Physics": {"score": b["p_score"], "accuracy": 64.0, "correct": 14, "incorrect": 8, "unattempted": 8, "avgTime": 110},
                    "Chemistry": {"score": b["c_score"], "accuracy": 66.0, "correct": 13, "incorrect": 7, "unattempted": 10, "avgTime": 95},
                    "Mathematics": {"score": b["m_score"], "accuracy": 42.0, "correct": 8, "incorrect": 11, "unattempted": 11, "avgTime": 155}
                },
                topic_breakdown=[
                    {"topic": "Rotational Dynamics & Moment of Inertia", "subject": "Physics", "accuracy": 38.0, "correct": 3, "total": 8, "avgTime": 145},
                    {"topic": "Integral Calculus & Differential Equations", "subject": "Mathematics", "accuracy": 34.0, "correct": 3, "total": 9, "avgTime": 160},
                    {"topic": "Chemical Thermodynamics", "subject": "Chemistry", "accuracy": 42.0, "correct": 3, "total": 7, "avgTime": 110},
                    {"topic": "Vectors & 3D Geometry", "subject": "Mathematics", "accuracy": 45.0, "correct": 4, "total": 9, "avgTime": 135},
                    {"topic": "Electromagnetic Induction & AC", "subject": "Physics", "accuracy": 48.0, "correct": 4, "total": 8, "avgTime": 125}
                ],
                observations=["Baseline benchmark data synchronized from Stage 2."]
            ))
    db.commit()

    # 7. Seed Initial Study Tasks
    initial_tasks = [
        {
            "id": "task-init-1", "student_id": "student-aarav-01", "day": "Mon", "subject": "Physics",
            "topic": "Rotational Dynamics & Moment of Inertia",
            "title": "Parallel axis theorem derivations & 15 moment of inertia drills",
            "duration_minutes": 60, "task_type": "Concept Revision", "priority": "High", "completed": True,
            "reason": "38% accuracy across 8 recent attempts; high negative marks from sign errors",
            "is_auto_recommended": True
        },
        {
            "id": "task-init-2", "student_id": "student-aarav-01", "day": "Tue", "subject": "Mathematics",
            "topic": "Integral Calculus & Differential Equations",
            "title": "Definite integrals: Master King's property & symmetry substitution",
            "duration_minutes": 75, "task_type": "Timed Practice", "priority": "High", "completed": False,
            "reason": "Average solving time 160s/q with only 34% accuracy",
            "is_auto_recommended": True
        },
        {
            "id": "task-init-3", "student_id": "student-aarav-01", "day": "Wed", "subject": "Chemistry",
            "topic": "Chemical Thermodynamics",
            "title": "Gibbs free energy spontaneity criteria & Hess's law calculations",
            "duration_minutes": 45, "task_type": "Formula Sheet", "priority": "High", "completed": False,
            "reason": "Repeated sign confusion between ΔH and TΔS in spontaneous reaction problems",
            "is_auto_recommended": True
        },
        {
            "id": "task-init-4", "student_id": "student-aarav-01", "day": "Thu", "subject": "Mathematics",
            "topic": "Vectors & 3D Geometry",
            "title": "Scalar triple product and shortest distance formula practice",
            "duration_minutes": 60, "task_type": "Timed Practice", "priority": "Medium", "completed": False,
            "reason": "45% accuracy; high calculation drag on 3D plane equations",
            "is_auto_recommended": True
        },
        {
            "id": "task-init-5", "student_id": "student-aarav-01", "day": "Fri", "subject": "Physics",
            "topic": "Electromagnetic Induction & AC",
            "title": "LCR circuit resonance & Faraday's flux change drills",
            "duration_minutes": 50, "task_type": "Concept Revision", "priority": "Medium", "completed": False,
            "reason": "48% accuracy; frequent mistakes on power factor calculations",
            "is_auto_recommended": True
        }
    ]

    for t in initial_tasks:
        if not db.query(StudyTaskModel).filter_by(id=t["id"]).first():
            db.add(StudyTaskModel(**t))
    db.commit()
