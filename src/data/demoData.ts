import {
  StudentProfile,
  TopicPerformance,
  SubjectPerformance,
  MockTestSummary,
  Question,
  StudyTask,
  HistoricalMockRecord,
  TestAttemptResult
} from '../types';

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: 'stu-demo-01',
  name: 'Aarav Sharma',
  targetExam: 'JEE Main 2027 (April Session)',
  targetScore: 210,
  dailyStudyHours: 6,
  preferredSubjects: ['Mathematics', 'Chemistry'],
  theme: 'light',
  timerMode: 'Flexible Demo',
  registeredDate: 'August 2026'
};

export const DEMO_METRICS = {
  latestMockScore: 112,
  totalMarks: 300,
  averageScore: 106,
  overallAccuracy: 64,
  completedMocksCount: 8,
  totalPracticeQuestions: 1420,
  averageTimePerQuestionSec: 142
};

export const SUBJECT_PERFORMANCES: SubjectPerformance[] = [
  {
    subject: 'Physics',
    accuracy: 72,
    score: 52,
    totalMarks: 100,
    correctCount: 14,
    incorrectCount: 4,
    unattemptedCount: 7,
    avgTimeSeconds: 125
  },
  {
    subject: 'Chemistry',
    accuracy: 68,
    score: 44,
    totalMarks: 100,
    correctCount: 12,
    incorrectCount: 4,
    unattemptedCount: 9,
    avgTimeSeconds: 98
  },
  {
    subject: 'Mathematics',
    accuracy: 51,
    score: 16,
    totalMarks: 100,
    correctCount: 7,
    incorrectCount: 12,
    unattemptedCount: 6,
    avgTimeSeconds: 195
  }
];

export const TOPIC_PERFORMANCES: TopicPerformance[] = [
  {
    id: 'top-math-01',
    subject: 'Mathematics',
    topic: 'Integration (Definite & Indefinite)',
    accuracy: 38,
    attemptCount: 34,
    totalQuestions: 48,
    avgTimeSeconds: 228,
    priority: 'High',
    trend: 'Declining',
    reason: 'Frequent algebraic sign errors and substitution traps in trigonometric integrands.',
    recommendedAction: 'Revise standard substitution forms and property integrals before solving 25 timed level-1 problems.',
    subtopics: ['Integration by Parts', 'Properties of Definite Integrals', 'Trigonometric Substitutions', 'Reduction Formulas']
  },
  {
    id: 'top-math-02',
    subject: 'Mathematics',
    topic: 'Probability & Permutations',
    accuracy: 44,
    attemptCount: 25,
    totalQuestions: 32,
    avgTimeSeconds: 198,
    priority: 'High',
    trend: 'Stable',
    reason: 'Misinterpreting conditional probability and Bayes theorem sample space partitioning.',
    recommendedAction: 'Practice tree diagram formulation and total probability theorem questions.',
    subtopics: ['Conditional Probability', 'Bayes Theorem', 'Binomial Distribution', 'Independent Events']
  },
  {
    id: 'top-chem-01',
    subject: 'Chemistry',
    topic: 'Organic Reaction Mechanisms',
    accuracy: 47,
    attemptCount: 42,
    totalQuestions: 55,
    avgTimeSeconds: 110,
    priority: 'Medium',
    trend: 'Stable',
    reason: 'Confusion between SN1 vs SN2 solvent polarity dependencies and stereochemical inversion.',
    recommendedAction: 'Create a comparative flowchart of nucleophilic substitutions and carbocation rearrangements.',
    subtopics: ['Electrophilic Aromatic Substitution', 'Nucleophilic Aliphatic Substitution', 'Aldol & Cannizzaro', 'Carbocation Stability']
  },
  {
    id: 'top-phys-01',
    subject: 'Physics',
    topic: 'Rotational Motion & Moment of Inertia',
    accuracy: 55,
    attemptCount: 38,
    totalQuestions: 45,
    avgTimeSeconds: 215,
    priority: 'Medium',
    trend: 'Improving',
    reason: 'Torque equilibrium reference axis selection errors in rolling with slipping questions.',
    recommendedAction: 'Solve 15 pure rolling conservation of energy problems without friction work assumptions.',
    subtopics: ['Angular Momentum Conservation', 'Rolling Motion on Incline', 'Parallel Axis Theorem', 'Instantaneous Axis of Rotation']
  },
  {
    id: 'top-phys-02',
    subject: 'Physics',
    topic: 'Kinematics & Projectile Motion',
    accuracy: 78,
    attemptCount: 50,
    totalQuestions: 54,
    avgTimeSeconds: 102,
    priority: 'Low',
    trend: 'Improving',
    reason: 'Strong conceptual baseline. Rare arithmetic slips on inclined plane relative motion.',
    recommendedAction: 'Maintain current velocity with 10 weekly mixed challenge questions.',
    subtopics: ['1D Uniform Acceleration', 'Projectile on Inclined Plane', 'Relative Motion in 2D']
  },
  {
    id: 'top-phys-03',
    subject: 'Physics',
    topic: 'Current Electricity & Circuit Laws',
    accuracy: 82,
    attemptCount: 45,
    totalQuestions: 48,
    avgTimeSeconds: 95,
    priority: 'Low',
    trend: 'Improving',
    reason: 'Consistently high accuracy in Kirchhoff loops and bridge network reductions.',
    recommendedAction: 'Periodic formula review and RC circuit transient quick-drills.',
    subtopics: ['Kirchhoff Laws', 'Wheatstone Bridge', 'Potentiometer & Meter Bridge', 'RC Circuits']
  },
  {
    id: 'top-chem-02',
    subject: 'Chemistry',
    topic: 'Chemical Equilibrium & Thermodynamics',
    accuracy: 65,
    attemptCount: 35,
    totalQuestions: 42,
    avgTimeSeconds: 115,
    priority: 'Medium',
    trend: 'Stable',
    reason: 'Le Chatelier principle qualitative mastery is sound; calculation errors occur in degree of dissociation (alpha).',
    recommendedAction: 'Review ICE table methods for gaseous equilibria with inert gas addition.',
    subtopics: ['Kp and Kc Relations', 'Van\'t Hoff Equation', 'Free Energy and Equilibrium', 'Ionic Solubility Product']
  },
  {
    id: 'top-math-03',
    subject: 'Mathematics',
    topic: 'Coordinate Geometry & Conic Sections',
    accuracy: 62,
    attemptCount: 40,
    totalQuestions: 50,
    avgTimeSeconds: 180,
    priority: 'Medium',
    trend: 'Improving',
    reason: 'Lengthy tangent equation calculations consuming excessive test time.',
    recommendedAction: 'Memorize parameter forms (t and theta) for parabola and hyperbola to cut solving time by 40%.',
    subtopics: ['Parabola Tangents', 'Ellipse Eccentricity', 'Hyperbola Asymptotes', 'Common Tangents']
  }
];

export const HISTORICAL_MOCKS: HistoricalMockRecord[] = [
  { id: 'mock-hist-1', mockName: 'JEE Main Mock #1 (Diagnostic)', date: '12 Aug 2026', score: 88, totalMarks: 300, accuracy: 52, timeSpentMinutes: 172, scoreDelta: 0, physicsScore: 40, chemScore: 32, mathScore: 16 },
  { id: 'mock-hist-2', mockName: 'JEE Main Mock #2', date: '22 Aug 2026', score: 94, totalMarks: 300, accuracy: 56, timeSpentMinutes: 175, scoreDelta: 6, physicsScore: 44, chemScore: 36, mathScore: 14 },
  { id: 'mock-hist-3', mockName: 'JEE Main Mock #3', date: '02 Sep 2026', score: 91, totalMarks: 300, accuracy: 54, timeSpentMinutes: 180, scoreDelta: -3, physicsScore: 42, chemScore: 35, mathScore: 14 },
  { id: 'mock-hist-4', mockName: 'JEE Main Mock #4 (Sectional)', date: '12 Sep 2026', score: 102, totalMarks: 300, accuracy: 60, timeSpentMinutes: 176, scoreDelta: 11, physicsScore: 48, chemScore: 40, mathScore: 14 },
  { id: 'mock-hist-5', mockName: 'JEE Main Mock #5', date: '21 Sep 2026', score: 105, totalMarks: 300, accuracy: 61, timeSpentMinutes: 178, scoreDelta: 3, physicsScore: 50, chemScore: 42, mathScore: 13 },
  { id: 'mock-hist-6', mockName: 'JEE Main Mock #6', date: '29 Sep 2026', score: 110, totalMarks: 300, accuracy: 63, timeSpentMinutes: 175, scoreDelta: 5, physicsScore: 54, chemScore: 41, mathScore: 15 },
  { id: 'mock-hist-7', mockName: 'JEE Main Mock #7', date: '03 Oct 2026', score: 104, totalMarks: 300, accuracy: 61, timeSpentMinutes: 179, scoreDelta: -6, physicsScore: 48, chemScore: 42, mathScore: 14 },
  { id: 'mock-hist-8', mockName: 'JEE Main Mock #8 (Latest Baseline)', date: '07 Oct 2026', score: 112, totalMarks: 300, accuracy: 64, timeSpentMinutes: 177, scoreDelta: 8, physicsScore: 52, chemScore: 44, mathScore: 16 }
];

export const MOCK_TESTS_LIBRARY: MockTestSummary[] = [
  {
    id: 'test-jee-09',
    title: 'JEE Main Mock #9 — Live Demo Examination',
    type: 'Full-Length',
    questionsCount: 15, // Compact high-yield interactive set for demonstration
    durationMinutes: 30, // Demo accelerated timer
    difficulty: 'Moderate',
    status: 'Available',
    description: 'Balanced 15-question demonstration paper covering Physics, Chemistry, and Mathematics with instant automated analysis.'
  },
  {
    id: 'test-jee-08',
    title: 'JEE Main Mock #8 (National Benchmarking)',
    type: 'Full-Length',
    questionsCount: 75,
    durationMinutes: 180,
    difficulty: 'Moderate',
    status: 'Attempted',
    lastScore: 112,
    lastAttemptDate: '07 Oct 2026',
    description: 'Official simulation paper. Basis of the current demo performance intelligence profile.'
  },
  {
    id: 'test-math-sec',
    title: 'Mathematics Sectional: Calculus & Coordinate Geometry',
    type: 'Subject',
    subject: 'Mathematics',
    questionsCount: 25,
    durationMinutes: 60,
    difficulty: 'Challenging',
    status: 'Available',
    description: 'Targeted assessment focusing on Definite Integrals, Conics, and Differential Equations.'
  },
  {
    id: 'test-phys-sec',
    title: 'Physics Sectional: Mechanics & Electrodynamics',
    type: 'Subject',
    subject: 'Physics',
    questionsCount: 25,
    durationMinutes: 60,
    difficulty: 'Moderate',
    status: 'Available',
    description: 'Comprehensive sectional testing Rotational Dynamics, Electrostatics, and AC Circuits.'
  },
  {
    id: 'test-chem-sec',
    title: 'Chemistry Sectional: Organic & Physical Principles',
    type: 'Subject',
    subject: 'Chemistry',
    questionsCount: 25,
    durationMinutes: 50,
    difficulty: 'Easy',
    status: 'Available',
    description: 'Rapid-recall and numerical problem sets covering Reaction Mechanisms and Chemical Kinetics.'
  },
  {
    id: 'test-chap-integ',
    title: 'Chapter Sprint: Definite Integration Mastery',
    type: 'Chapter',
    subject: 'Mathematics',
    questionsCount: 10,
    durationMinutes: 25,
    difficulty: 'Challenging',
    status: 'Available',
    description: 'Diagnostic question set designed to isolate property integral errors.'
  }
];

export const SAMPLE_QUESTIONS_MOCK_09: Question[] = [
  // Physics Questions (1 - 5)
  {
    id: 'q-p1',
    testId: 'test-jee-09',
    questionNumber: 1,
    subject: 'Physics',
    topic: 'Kinematics & Projectile Motion',
    statement: 'A projectile is launched from horizontal ground with speed u at an angle θ to the horizontal. If the horizontal range R is twice the maximum height H achieved (R = 2H), what is the value of tan θ?',
    options: [
      { id: 'A', text: 'tan θ = 1' },
      { id: 'B', text: 'tan θ = 2' },
      { id: 'C', text: 'tan θ = 4' },
      { id: 'D', text: 'tan θ = 1/2' }
    ],
    correctOptionId: 'B',
    explanation: 'We know R = (u² sin 2θ) / g = (2u² sin θ cos θ) / g, and H = (u² sin² θ) / (2g). Given R = 2H => (2u² sin θ cos θ)/g = 2 * (u² sin² θ)/(2g) = (u² sin² θ)/g. Simplifying gives 2 cos θ = sin θ, hence tan θ = 2.',
    difficulty: 'Easy'
  },
  {
    id: 'q-p2',
    testId: 'test-jee-09',
    questionNumber: 2,
    subject: 'Physics',
    topic: 'Rotational Motion & Moment of Inertia',
    statement: 'A uniform solid sphere of mass M and radius R rolls without slipping down an inclined plane of inclination θ. What is the linear acceleration of its center of mass along the incline?',
    options: [
      { id: 'A', text: 'a = (5/7) g sin θ' },
      { id: 'B', text: 'a = (2/3) g sin θ' },
      { id: 'C', text: 'a = (5/9) g sin θ' },
      { id: 'D', text: 'a = g sin θ' }
    ],
    correctOptionId: 'A',
    explanation: 'For pure rolling on an incline: a = (g sin θ) / (1 + I / (MR²)). For a solid sphere, I = (2/5) MR². Substituting: a = (g sin θ) / (1 + 2/5) = (g sin θ) / (7/5) = (5/7) g sin θ.',
    difficulty: 'Medium'
  },
  {
    id: 'q-p3',
    testId: 'test-jee-09',
    questionNumber: 3,
    subject: 'Physics',
    topic: 'Current Electricity & Circuit Laws',
    statement: 'Two identical electric bulbs rated (220 V, 60 W) are connected in series across a 220 V supply mains. What is the total power consumed by the combination?',
    options: [
      { id: 'A', text: '120 W' },
      { id: 'B', text: '60 W' },
      { id: 'C', text: '30 W' },
      { id: 'D', text: '15 W' }
    ],
    correctOptionId: 'C',
    explanation: 'Each bulb has resistance R = V²/P = 220²/60. When connected in series across 220V, total resistance is R_eq = 2R. The total power consumed is P_total = V² / R_eq = V² / (2R) = P / 2 = 60 / 2 = 30 W.',
    difficulty: 'Easy'
  },
  {
    id: 'q-p4',
    testId: 'test-jee-09',
    questionNumber: 4,
    subject: 'Physics',
    topic: 'Thermodynamics & Heat Transfer',
    statement: 'An ideal diatomic gas (γ = 7/5) undergoes an adiabatic expansion such that its volume becomes 32 times its initial volume. If initial temperature is T₁, the final temperature T₂ is:',
    options: [
      { id: 'A', text: 'T₂ = T₁ / 4' },
      { id: 'B', text: 'T₂ = T₁ / 8' },
      { id: 'C', text: 'T₂ = T₁ / 16' },
      { id: 'D', text: 'T₂ = T₁ / 2' }
    ],
    correctOptionId: 'A',
    explanation: 'For an adiabatic process: T₁ V₁^(γ - 1) = T₂ V₂^(γ - 1). Here γ - 1 = 7/5 - 1 = 2/5. Thus T₂ = T₁ (V₁ / V₂)^(2/5) = T₁ (1/32)^(2/5) = T₁ ((1/2)^5)^(2/5) = T₁ (1/2)² = T₁ / 4.',
    difficulty: 'Medium'
  },
  {
    id: 'q-p5',
    testId: 'test-jee-09',
    questionNumber: 5,
    subject: 'Physics',
    topic: 'Electrostatics & Potential',
    statement: 'An electric dipole of dipole moment p is placed in a uniform electric field E at an angle of 30° with the field. What is the torque experienced by the dipole?',
    options: [
      { id: 'A', text: 'τ = p E / 2' },
      { id: 'B', text: 'τ = (√3 / 2) p E' },
      { id: 'C', text: 'τ = p E' },
      { id: 'D', text: 'τ = 0' }
    ],
    correctOptionId: 'A',
    explanation: 'Torque on a dipole in electric field is τ = p × E = p E sin θ. For θ = 30°, sin 30° = 1/2. Therefore τ = p E / 2.',
    difficulty: 'Easy'
  },

  // Chemistry Questions (6 - 10)
  {
    id: 'q-c1',
    testId: 'test-jee-09',
    questionNumber: 6,
    subject: 'Chemistry',
    topic: 'Organic Reaction Mechanisms',
    statement: 'Which of the following alkyl halides reacts fastest via the SN1 substitution pathway when treated with aqueous acetone?',
    options: [
      { id: 'A', text: '(CH₃)₃C-Br (tert-butyl bromide)' },
      { id: 'B', text: '(CH₃)₂CH-Br (isopropyl bromide)' },
      { id: 'C', text: 'CH₃CH₂-Br (ethyl bromide)' },
      { id: 'D', text: 'CH₃-Br (methyl bromide)' }
    ],
    correctOptionId: 'A',
    explanation: 'The SN1 rate is determined by carbocation intermediate stability. Tert-butyl bromide generates a 3° carbocation ((CH₃)₃C⁺) stabilized by 9 hyperconjugative alpha-hydrogens, reacting much faster than secondary, primary, or methyl halides.',
    difficulty: 'Easy'
  },
  {
    id: 'q-c2',
    testId: 'test-jee-09',
    questionNumber: 7,
    subject: 'Chemistry',
    topic: 'Chemical Equilibrium & Thermodynamics',
    statement: 'For the gaseous reaction: N₂(g) + 3H₂(g) ⇌ 2NH₃(g) with ΔH < 0, which condition will favor maximum equilibrium yield of ammonia (NH₃)?',
    options: [
      { id: 'A', text: 'Low temperature and high pressure' },
      { id: 'B', text: 'High temperature and high pressure' },
      { id: 'C', text: 'Low temperature and low pressure' },
      { id: 'D', text: 'High temperature and low pressure' }
    ],
    correctOptionId: 'A',
    explanation: 'By Le Chatelier principle: (1) The forward reaction is exothermic (ΔH < 0), so lower temperature shifts equilibrium forward. (2) Forward reaction reduces moles of gas from 4 to 2, so high pressure shifts equilibrium forward toward fewer moles.',
    difficulty: 'Easy'
  },
  {
    id: 'q-c3',
    testId: 'test-jee-09',
    questionNumber: 8,
    subject: 'Chemistry',
    topic: 'Coordination Compounds',
    statement: 'According to Crystal Field Theory, what is the crystal field stabilization energy (CFSE) for a high-spin d⁶ octahedral complex in terms of Δ₀?',
    options: [
      { id: 'A', text: '-0.4 Δ₀' },
      { id: 'B', text: '-2.4 Δ₀' },
      { id: 'C', text: '-0.6 Δ₀' },
      { id: 'D', text: '-1.2 Δ₀' }
    ],
    correctOptionId: 'A',
    explanation: 'For high-spin octahedral d⁶: configuration is t₂g⁴ eg². CFSE = [4 * (-0.4) + 2 * (+0.6)] Δ₀ = [-1.6 + 1.2] Δ₀ = -0.4 Δ₀.',
    difficulty: 'Medium'
  },
  {
    id: 'q-c4',
    testId: 'test-jee-09',
    questionNumber: 9,
    subject: 'Chemistry',
    topic: 'Organic Reaction Mechanisms',
    statement: 'Benzaldehyde treated with 50% concentrated aqueous NaOH yields benzyl alcohol and sodium benzoate. This reaction is known as:',
    options: [
      { id: 'A', text: 'Cannizzaro reaction' },
      { id: 'B', text: 'Aldol condensation' },
      { id: 'C', text: 'Perkin reaction' },
      { id: 'D', text: 'Clemmensen reduction' }
    ],
    correctOptionId: 'A',
    explanation: 'Aldehydes lacking alpha-hydrogens (such as benzaldehyde or formaldehyde) undergo disproportionation (self redox) in concentrated alkaline medium to form one alcohol and one carboxylic acid salt. This is the Cannizzaro reaction.',
    difficulty: 'Easy'
  },
  {
    id: 'q-c5',
    testId: 'test-jee-09',
    questionNumber: 10,
    subject: 'Chemistry',
    topic: 'Electrochemistry',
    statement: 'How many Faradays of electricity are required to produce 1.0 mol of aluminum metal (Al) from molten Al₂O₃ by electrolysis?',
    options: [
      { id: 'A', text: '3 F' },
      { id: 'B', text: '1 F' },
      { id: 'C', text: '2 F' },
      { id: 'D', text: '6 F' }
    ],
    correctOptionId: 'A',
    explanation: 'Reduction reaction is Al³⁺ + 3e⁻ -> Al(s). To reduce 1 mole of Al³⁺ ions to metallic aluminum, 3 moles of electrons are required, which equals 3 Faradays (3 F) of charge.',
    difficulty: 'Easy'
  },

  // Mathematics Questions (11 - 15)
  {
    id: 'q-m1',
    testId: 'test-jee-09',
    questionNumber: 11,
    subject: 'Mathematics',
    topic: 'Integration (Definite & Indefinite)',
    statement: 'Evaluate the definite integral: I = ∫[0 to π/2] (sin⁴ x) / (sin⁴ x + cos⁴ x) dx.',
    options: [
      { id: 'A', text: 'π / 4' },
      { id: 'B', text: 'π / 2' },
      { id: 'C', text: 'π' },
      { id: 'D', text: '0' }
    ],
    correctOptionId: 'A',
    explanation: 'Using King\'s property ∫[0 to a] f(x) dx = ∫[0 to a] f(a - x) dx: Here a = π/2, so sin(π/2 - x) = cos x and cos(π/2 - x) = sin x. I = ∫[0 to π/2] (cos⁴ x)/(cos⁴ x + sin⁴ x) dx. Adding both: 2I = ∫[0 to π/2] 1 dx = π/2 => I = π/4.',
    difficulty: 'Easy'
  },
  {
    id: 'q-m2',
    testId: 'test-jee-09',
    questionNumber: 12,
    subject: 'Mathematics',
    topic: 'Integration (Definite & Indefinite)',
    statement: 'Evaluate: I = ∫ [ x * e^(2x) ] dx.',
    options: [
      { id: 'A', text: '(e^(2x) / 4) * (2x - 1) + C' },
      { id: 'B', text: '(e^(2x) / 2) * (x - 1) + C' },
      { id: 'C', text: '(e^(2x) / 4) * (2x + 1) + C' },
      { id: 'D', text: 'e^(2x) * (x - 1/2) + C' }
    ],
    correctOptionId: 'A',
    explanation: 'Integrating by parts ∫ u v dx = u ∫v dx - ∫ [u\' ∫v dx] dx. Let u = x, v = e^(2x). ∫v dx = e^(2x)/2. I = x * (e^(2x)/2) - ∫ 1 * (e^(2x)/2) dx = (x/2) e^(2x) - (1/4) e^(2x) + C = (e^(2x)/4) * (2x - 1) + C.',
    difficulty: 'Medium'
  },
  {
    id: 'q-m3',
    testId: 'test-jee-09',
    questionNumber: 13,
    subject: 'Mathematics',
    topic: 'Probability & Permutations',
    statement: 'A box contains 5 red balls and 3 green balls. Two balls are drawn successively without replacement. What is the probability that both balls drawn are red?',
    options: [
      { id: 'A', text: '5 / 14' },
      { id: 'B', text: '25 / 64' },
      { id: 'C', text: '15 / 56' },
      { id: 'D', text: '10 / 28' }
    ],
    correctOptionId: 'A',
    explanation: 'Total balls = 8. P(First Red) = 5/8. After one red ball is removed, 7 balls remain with 4 red balls. P(Second Red | First Red) = 4/7. Total probability = (5/8) * (4/7) = 20 / 56 = 5 / 14.',
    difficulty: 'Easy'
  },
  {
    id: 'q-m4',
    testId: 'test-jee-09',
    questionNumber: 14,
    subject: 'Mathematics',
    topic: 'Coordinate Geometry & Conic Sections',
    statement: 'What is the equation of the tangent to the parabola y² = 8x having slope m = 2?',
    options: [
      { id: 'A', text: 'y = 2x + 1' },
      { id: 'B', text: 'y = 2x + 2' },
      { id: 'C', text: 'y = 2x + 4' },
      { id: 'D', text: 'y = 2x - 1' }
    ],
    correctOptionId: 'A',
    explanation: 'For parabola y² = 4ax, 4a = 8 => a = 2. Tangent in slope form is y = mx + a/m. Here m = 2 and a = 2, so a/m = 2/2 = 1. The tangent equation is y = 2x + 1.',
    difficulty: 'Easy'
  },
  {
    id: 'q-m5',
    testId: 'test-jee-09',
    questionNumber: 15,
    subject: 'Mathematics',
    topic: 'Matrices & Determinants',
    statement: 'If A is an invertible 3 × 3 matrix such that det(A) = 4, what is the determinant of the adjoint matrix, det(adj(A))?',
    options: [
      { id: 'A', text: '16' },
      { id: 'B', text: '64' },
      { id: 'C', text: '4' },
      { id: 'D', text: '12' }
    ],
    correctOptionId: 'A',
    explanation: 'For any n × n square matrix A, det(adj(A)) = (det(A))^(n - 1). Here n = 3 and det(A) = 4. det(adj(A)) = 4^(3 - 1) = 4² = 16.',
    difficulty: 'Easy'
  }
];

export const INITIAL_STUDY_TASKS: StudyTask[] = [
  {
    id: 'task-1',
    day: 'Mon',
    subject: 'Mathematics',
    topic: 'Integration (Definite & Indefinite)',
    title: 'Review Properties 3 & 4 of Definite Integrals & solve 15 questions',
    durationMinutes: 90,
    taskType: 'Concept Revision',
    priority: 'High',
    completed: true,
    reason: 'Demonstrated 38% accuracy in latest mock.'
  },
  {
    id: 'task-2',
    day: 'Mon',
    subject: 'Physics',
    topic: 'Rotational Motion & Moment of Inertia',
    title: 'Angular Momentum Conservation & Rolling drill set',
    durationMinutes: 60,
    taskType: 'Timed Practice',
    priority: 'Medium',
    completed: true,
    reason: 'Frequent torque axis ambiguity identified in Mock 7 and 8.'
  },
  {
    id: 'task-3',
    day: 'Tue',
    subject: 'Chemistry',
    topic: 'Organic Reaction Mechanisms',
    title: 'SN1 vs SN2 comparison chart & solvent effect summary',
    durationMinutes: 60,
    taskType: 'Formula Sheet',
    priority: 'Medium',
    completed: false,
    reason: 'Average accuracy 47% across 42 historical questions.'
  },
  {
    id: 'task-4',
    day: 'Tue',
    subject: 'Mathematics',
    topic: 'Integration (Definite & Indefinite)',
    title: 'Timed practice: 20 Definite Integral questions in 45 minutes',
    durationMinutes: 45,
    taskType: 'Timed Practice',
    priority: 'High',
    completed: false,
    reason: 'Need to reduce average solving time from 228s to under 150s.'
  },
  {
    id: 'task-5',
    day: 'Wed',
    subject: 'Mathematics',
    topic: 'Probability & Permutations',
    title: 'Bayes Theorem Tree Method & Partitioning exercise',
    durationMinutes: 75,
    taskType: 'Concept Revision',
    priority: 'High',
    completed: false,
    reason: 'Bayes theorem problems had 2 incorrect attempts in Mock 8.'
  },
  {
    id: 'task-6',
    day: 'Thu',
    subject: 'Physics',
    topic: 'Kinematics & Projectile Motion',
    title: 'Review inclined plane equations & relative 2D motion',
    durationMinutes: 45,
    taskType: 'Timed Practice',
    priority: 'Low',
    completed: false,
    reason: 'Maintenance drill for strong topic (78% accuracy).'
  },
  {
    id: 'task-7',
    day: 'Fri',
    subject: 'Chemistry',
    topic: 'Chemical Equilibrium & Thermodynamics',
    title: 'Degree of dissociation (alpha) & Van\'t Hoff numericals',
    durationMinutes: 60,
    taskType: 'Timed Practice',
    priority: 'Medium',
    completed: false,
    reason: 'Calculation slips in gas volume equilibrium problems.'
  },
  {
    id: 'task-8',
    day: 'Sat',
    subject: 'Mathematics',
    topic: 'Integration (Definite & Indefinite)',
    title: 'Mixed Calculus Challenge Set (30 questions)',
    durationMinutes: 90,
    taskType: 'Timed Practice',
    priority: 'High',
    completed: false,
    reason: 'Weekly milestone before Sunday sectional mock.'
  },
  {
    id: 'task-9',
    day: 'Sun',
    subject: 'Mathematics',
    topic: 'Mock Assessment',
    title: 'Take Mathematics Sectional Mock and review error log',
    durationMinutes: 90,
    taskType: 'Mock Analysis',
    priority: 'High',
    completed: false,
    reason: 'Measure improvement against current 16/100 baseline.'
  }
];

export const INITIAL_AI_CHAT_MESSAGES = [
  {
    id: 'msg-1',
    sender: 'coach' as const,
    text: 'Hello Aarav! I am your JEE InsightAI performance mentor (Prototype Mode). I have analyzed your recent Mock #8 (Score: 112/300) and historical attempts. Mathematics accuracy (51%) and specifically Integration (38%) present the highest leverage opportunity for your score growth. How can I assist your study session today?',
    timestamp: '10:00 AM',
    actionSuggestions: [
      'Explain why my score changed',
      'Help me understand Integration',
      'Explain my mistakes in Mock 8',
      'Create a seven-day revision plan',
      'Suggest a time-management strategy'
    ]
  }
];

export const AI_KNOWLEDGE_BASE: Record<string, { reply: string; suggestions?: string[] }> = {
  score_change: {
    reply: `Here is the data breakdown of your recent score trajectory:

1. **Score Delta**: Your score moved from 104 in Mock #7 to 112 in Mock #8 (+8 marks).
2. **Physics Contribution**: Physics was your strongest pillar with +4 net marks (52/100), led by clean accuracy in Kinematics and Current Electricity.
3. **Chemistry Consistency**: Chemistry delivered 44/100 with 68% accuracy.
4. **Mathematics Drag**: Mathematics remains your critical constraint at 16/100 (51% accuracy). You attempted 19 questions but suffered 12 incorrect answers (-12 negative marks penalty).
5. **Key Takeaway**: Reducing hasty guesses in Mathematics alone would immediately lift your score by +10 to +14 marks without solving a single extra problem!`,
    suggestions: ['How to avoid negative marks in Maths?', 'Breakdown Integration mistakes', 'Create a 7-day study plan']
  },
  integration: {
    reply: `Let us address your Integration performance (38% accuracy, 228s avg solving time):

• **Root Cause Detected**: In your mock responses, errors were concentrated in two areas:
  1. Forgetting to apply King's Property (∫₀ᵃ f(x)dx = ∫₀ᵃ f(a-x)dx) before expanding complex fractional integrands.
  2. Sign mistakes during trigonometric half-angle substitutions.

• **Concrete 3-Step Fix**:
  1. **Triage First (10 seconds)**: Before writing, inspect whether f(a-x) simplifies the denominator. If denominator remains invariant (e.g., sin⁴x + cos⁴x), King's property will yield the solution in 3 lines.
  2. **Boundary Checks**: Always evaluate limits at each substitution step rather than back-substituting x at the end.
  3. **Targeted Practice**: Complete 15 curated property integrals today. Would you like me to add this to your Study Planner?`,
    suggestions: ['Add Integration tasks to Study Planner', 'Test me with a sample problem', 'Time management for Calculus']
  },
  mistakes_mock8: {
    reply: `Analysis of your incorrect responses in Mock #8:

• **Total Incorrect Answers**: 20 questions (resulting in -20 negative marks penalty).
• **Mathematics (12 negatives)**:
  - 4 questions in Indefinite Integration attempted with incomplete substitutions.
  - 3 questions in Probability where conditional independence was mistakenly assumed.
  - 2 numericals with calculation rounding errors in Conic Sections.
• **Chemistry (4 negatives)**:
  - 2 questions on Carbocation rearrangement stability order (hydride vs methyl shift).
• **Physics (4 negatives)**:
  - 2 questions on rolling motion where torque was taken about a non-inertial axis.

Recommendation: If you omit uncertain guesses in Mathematics where confidence is below 70%, your baseline score jumps from 112 to ~124.`,
    suggestions: ['How to build selective skipping discipline', 'Explain Carbocation rearrangements', 'Review Study Plan']
  },
  seven_day_plan: {
    reply: `Here is a high-leverage 7-Day Precision Revision Plan tailored to your current 112/300 baseline:

• **Mon-Tue (Calculus Recovery)**:
  - 90 mins daily on Definite Integration standard properties.
  - 30 mins timed drill (10 questions, strict 2.5 min cap).

• **Wed-Thu (Organic & Probability)**:
  - Revisit SN1/SN2 solvent polarity tables and carbocation shifts.
  - Bayes Theorem tree diagrams and partitioning problems.

• **Fri (Speed & Formula Sprint)**:
  - Rotational motion conservation laws.
  - Conic sections parametric equations memorization.

• **Sat-Sun (Simulation & Review)**:
  - Saturday: 60-min Mathematics Sectional test.
  - Sunday: Full analysis and error classification into 'Concept Gap' vs 'Silly Error'.`,
    suggestions: ['Apply this plan to my Study Planner', 'Simulate score with this plan', 'Ask about Physics strategy']
  },
  time_management: {
    reply: `Recommended JEE Main Time Management Architecture (180 minutes):

1. **Round 1 — The Sweep (0 to 60 mins)**:
   - Chemistry: 35 mins (target 18-20 questions).
   - Physics: 25 mins (target 10-12 direct formula questions).
   - Rule: Skip any question requiring more than 2 minutes of calculation.

2. **Round 2 — Deep Work (60 to 140 mins)**:
   - Mathematics: 45 mins (focus on high-confidence algebra, matrices, vectors).
   - Physics Mechanics & Electrodynamics: 35 mins.

3. **Round 3 — Review & Calculated Attempts (140 to 180 mins)**:
   - Return to flagged questions in Calculus and Organic Chemistry.
   - Strictly avoid wild guesses in the final 10 minutes.

This disciplined 3-round approach typically recovers 15-20 marks lost to rushed end-of-test errors.`,
    suggestions: ['How does simulator evaluate speed?', 'Review weak concepts', 'Start Mock Test #9']
  }
};
