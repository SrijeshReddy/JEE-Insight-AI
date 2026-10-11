import { MockTestSummary, Question, QuestionResponse, TestAttemptResult, Subject } from '../types';
import { apiClient } from './apiClient';
import {
  MOCK_TESTS_LIBRARY,
  SAMPLE_QUESTIONS_MOCK_09,
  SAMPLE_QUESTIONS_MATH_SEC,
  SAMPLE_QUESTIONS_CHAP_INTEG
} from '../data/demoData';

const ATTEMPTS_STORAGE_KEY = 'jee_insight_test_attempts';
const DRAFT_STORAGE_KEY = 'jee_insight_active_test_draft';

export interface IMockTestService {
  getAllTests(): Promise<MockTestSummary[]>;
  getTestById(id: string): Promise<MockTestSummary | null>;
  getTestQuestions(testId: string): Promise<Question[]>;
  submitTest(
    testId: string,
    responses: Record<string, QuestionResponse>,
    timeSpentSeconds: number,
    telemetry?: Record<string, any>
  ): Promise<TestAttemptResult>;
  getLatestAttempt(): Promise<TestAttemptResult | null>;
  getAttemptById(attemptId: string): Promise<TestAttemptResult | null>;
  getAllAttempts(): Promise<TestAttemptResult[]>;
  saveDraft(testId: string, responses: Record<string, QuestionResponse>, timerSeconds: number, currentIndex: number): void;
  getDraft(testId: string): { responses: Record<string, QuestionResponse>; timerSeconds: number; currentIndex: number } | null;
  clearDraft(testId: string): void;
}

class LocalMockTestService implements IMockTestService {
  async getAllTests(): Promise<MockTestSummary[]> {
    return [...MOCK_TESTS_LIBRARY];
  }

  async getTestById(id: string): Promise<MockTestSummary | null> {
    const test = MOCK_TESTS_LIBRARY.find(t => t.id === id);
    return test ? { ...test } : null;
  }

  async getTestQuestions(testId: string): Promise<Question[]> {
    if (testId === 'test-math-sec') {
      return [...SAMPLE_QUESTIONS_MATH_SEC];
    }
    if (testId === 'test-chap-integ') {
      return [...SAMPLE_QUESTIONS_CHAP_INTEG];
    }
    if (testId === 'test-phys-sec') {
      // 10 Physics questions
      const base = SAMPLE_QUESTIONS_MOCK_09.filter(q => q.subject === 'Physics');
      const extra: Question[] = [
        {
          id: 'q-p-extra-1',
          testId: 'test-phys-sec',
          questionNumber: 6,
          subject: 'Physics',
          topic: 'Simple Harmonic Motion & Waves',
          statement: 'A particle executes SHM with amplitude A. At what displacement from the mean position is its kinetic energy equal to its potential energy?',
          options: [
            { id: 'A', text: 'x = A / √2' },
            { id: 'B', text: 'x = A / 2' },
            { id: 'C', text: 'x = A / 4' },
            { id: 'D', text: 'x = (√3 / 2) A' }
          ],
          correctOptionId: 'A',
          explanation: 'KE = (1/2) k (A² - x²) and PE = (1/2) k x². For KE = PE: (1/2) k (A² - x²) = (1/2) k x² => A² - x² = x² => 2x² = A² => x = A / √2.',
          difficulty: 'Easy'
        },
        {
          id: 'q-p-extra-2',
          testId: 'test-phys-sec',
          questionNumber: 7,
          subject: 'Physics',
          topic: 'Electromagnetic Induction & AC',
          statement: 'A circular coil of 100 turns and radius 10 cm rotates in a uniform magnetic field of 0.5 T with an angular speed of 60 rad/s. What is the maximum induced EMF?',
          options: [
            { id: 'A', text: '30π V (~94.2 V)' },
            { id: 'B', text: '15π V' },
            { id: 'C', text: '60 V' },
            { id: 'D', text: '30 V' }
          ],
          correctOptionId: 'A',
          explanation: 'Peak EMF ε₀ = N B A ω. Here N = 100, B = 0.5 T, A = π r² = π (0.1)² = 0.01π m², ω = 60 rad/s. ε₀ = 100 * 0.5 * 0.01π * 60 = 30π V ≈ 94.2 V.',
          difficulty: 'Medium'
        },
        {
          id: 'q-p-extra-3',
          testId: 'test-phys-sec',
          questionNumber: 8,
          subject: 'Physics',
          topic: 'Optics & Wave Motion',
          statement: 'In Young\'s double slit experiment, if the separation between the slits is halved and the distance to the screen is doubled, the fringe width becomes:',
          options: [
            { id: 'A', text: '4 times original' },
            { id: 'B', text: '2 times original' },
            { id: 'C', text: 'Halved' },
            { id: 'D', text: 'Unchanged' }
          ],
          correctOptionId: 'A',
          explanation: 'Fringe width β = (λ D) / d. If D\' = 2D and d\' = d/2, then β\' = (λ * 2D) / (d / 2) = 4 (λ D / d) = 4β.',
          difficulty: 'Easy'
        },
        {
          id: 'q-p-extra-4',
          testId: 'test-phys-sec',
          questionNumber: 9,
          subject: 'Physics',
          topic: 'Kinematics & Projectile Motion',
          statement: 'A car travelling at 72 km/h applies brakes producing a constant retardation of 4 m/s². How far does it travel before coming to rest?',
          options: [
            { id: 'A', text: '50 m' },
            { id: 'B', text: '40 m' },
            { id: 'C', text: '25 m' },
            { id: 'D', text: '100 m' }
          ],
          correctOptionId: 'A',
          explanation: 'Initial velocity u = 72 * (5/18) = 20 m/s. Final velocity v = 0. Using v² = u² - 2as: 0 = 20² - 2(4)s => 8s = 400 => s = 50 m.',
          difficulty: 'Easy'
        },
        {
          id: 'q-p-extra-5',
          testId: 'test-phys-sec',
          questionNumber: 10,
          subject: 'Physics',
          topic: 'Rotational Motion & Moment of Inertia',
          statement: 'What is the radius of gyration of a thin uniform circular disc of radius R about its diameter as an axis?',
          options: [
            { id: 'A', text: 'R / 2' },
            { id: 'B', text: 'R / √2' },
            { id: 'C', text: 'R / 4' },
            { id: 'D', text: 'R' }
          ],
          correctOptionId: 'A',
          explanation: 'Moment of inertia of a disc about its diameter is I = (1/4) M R². Since I = M k², k² = (1/4) R² => k = R / 2.',
          difficulty: 'Easy'
        }
      ];
      return [...base, ...extra].map((q, idx) => ({ ...q, testId: 'test-phys-sec', questionNumber: idx + 1 }));
    }
    if (testId === 'test-chem-sec') {
      // 10 Chemistry questions
      const base = SAMPLE_QUESTIONS_MOCK_09.filter(q => q.subject === 'Chemistry');
      const extra: Question[] = [
        {
          id: 'q-c-extra-1',
          testId: 'test-chem-sec',
          questionNumber: 6,
          subject: 'Chemistry',
          topic: 'Chemical Kinetics',
          statement: 'For a first-order reaction with rate constant k = 0.0693 min⁻¹, what is the half-life t₁/₂?',
          options: [
            { id: 'A', text: '10 min' },
            { id: 'B', text: '100 min' },
            { id: 'C', text: '6.93 min' },
            { id: 'D', text: '1 min' }
          ],
          correctOptionId: 'A',
          explanation: 'For a first order reaction, t₁/₂ = 0.693 / k = 0.693 / 0.0693 = 10 minutes.',
          difficulty: 'Easy'
        },
        {
          id: 'q-c-extra-2',
          testId: 'test-chem-sec',
          questionNumber: 7,
          subject: 'Chemistry',
          topic: 'Organic Reaction Mechanisms',
          statement: 'When phenol is treated with chloroform and aqueous NaOH, salicylaldehyde is formed. What is the reactive intermediate in this Reimer-Tiemann reaction?',
          options: [
            { id: 'A', text: ':CCl₂ (Dichlorocarbene)' },
            { id: 'B', text: '·CCl₃ (Trichloromethyl radical)' },
            { id: 'C', text: 'CCl₃⁺ (Trichloromethyl cation)' },
            { id: 'D', text: 'CHCl₂⁺' }
          ],
          correctOptionId: 'A',
          explanation: 'In the Reimer-Tiemann reaction, hydroxide abstracts a proton from CHCl₃ to generate the electrophilic neutral intermediate dichlorocarbene (:CCl₂).',
          difficulty: 'Easy'
        },
        {
          id: 'q-c-extra-3',
          testId: 'test-chem-sec',
          questionNumber: 8,
          subject: 'Chemistry',
          topic: 'Chemical Equilibrium & Thermodynamics',
          statement: 'For an endothermic reaction (ΔH > 0), how does the equilibrium constant K change when temperature is increased?',
          options: [
            { id: 'A', text: 'K increases' },
            { id: 'B', text: 'K decreases' },
            { id: 'C', text: 'K remains constant' },
            { id: 'D', text: 'K becomes zero' }
          ],
          correctOptionId: 'A',
          explanation: 'By the Van\'t Hoff equation: ln(K₂/K₁) = (ΔH/R) (1/T₁ - 1/T₂). When ΔH > 0 and T₂ > T₁, K₂ > K₁. Hence K increases with temperature for endothermic reactions.',
          difficulty: 'Easy'
        },
        {
          id: 'q-c-extra-4',
          testId: 'test-chem-sec',
          questionNumber: 9,
          subject: 'Chemistry',
          topic: 'Electrochemistry',
          statement: 'What is the standard cell potential E°_cell for the Daniell cell Zn | Zn²⁺(1M) || Cu²⁺(1M) | Cu given E°(Zn²⁺/Zn) = -0.76 V and E°(Cu²⁺/Cu) = +0.34 V?',
          options: [
            { id: 'A', text: '+1.10 V' },
            { id: 'B', text: '-1.10 V' },
            { id: 'C', text: '+0.42 V' },
            { id: 'D', text: '+0.76 V' }
          ],
          correctOptionId: 'A',
          explanation: 'E°_cell = E°_cathode - E°_anode = E°(Cu²⁺/Cu) - E°(Zn²⁺/Zn) = 0.34 - (-0.76) = +1.10 V.',
          difficulty: 'Easy'
        },
        {
          id: 'q-c-extra-5',
          testId: 'test-chem-sec',
          questionNumber: 10,
          subject: 'Chemistry',
          topic: 'Coordination Compounds',
          statement: 'Which of the following complex ions is diamagnetic (all paired electrons)?',
          options: [
            { id: 'A', text: '[Ni(CN)₄]²⁻ (Square planar, strong field)' },
            { id: 'B', text: '[NiCl₄]²⁻ (Tetrahedral, weak field)' },
            { id: 'C', text: '[Fe(H₂O)₆]²⁺' },
            { id: 'D', text: '[CoF₆]³⁻' }
          ],
          correctOptionId: 'A',
          explanation: 'In [Ni(CN)₄]²⁻, Ni²⁺ is d⁸. CN⁻ is a strong field ligand causing pairing to form a square planar complex (dsp²). All 8 d-electrons are paired, making it diamagnetic.',
          difficulty: 'Medium'
        }
      ];
      return [...base, ...extra].map((q, idx) => ({ ...q, testId: 'test-chem-sec', questionNumber: idx + 1 }));
    }

    // Default to Mock #9 questions
    return [...SAMPLE_QUESTIONS_MOCK_09];
  }

  async submitTest(
    testId: string,
    responses: Record<string, QuestionResponse>,
    timeSpentSeconds: number
  ): Promise<TestAttemptResult> {
    const questions = await this.getTestQuestions(testId);
    const test = await this.getTestById(testId);
    const testTitle = test ? test.title : 'JEE Main Practice Examination';
    const markingScheme = test?.markingScheme || { correct: 4, incorrect: -1, unattempted: 0 };

    let rawScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    const subjectStats: Record<Subject, {
      score: number;
      correct: number;
      incorrect: number;
      unattempted: number;
      totalTime: number;
      totalQuestions: number;
    }> = {
      Physics: { score: 0, correct: 0, incorrect: 0, unattempted: 0, totalTime: 0, totalQuestions: 0 },
      Chemistry: { score: 0, correct: 0, incorrect: 0, unattempted: 0, totalTime: 0, totalQuestions: 0 },
      Mathematics: { score: 0, correct: 0, incorrect: 0, unattempted: 0, totalTime: 0, totalQuestions: 0 }
    };

    const topicMap: Record<string, {
      topic: string;
      subject: Subject;
      correct: number;
      total: number;
      totalTime: number;
    }> = {};

    questions.forEach(q => {
      const resp = responses[q.id];
      const selected = resp?.selectedOption;
      const qTime = resp?.timeSpentSeconds || Math.round(timeSpentSeconds / questions.length);

      subjectStats[q.subject].totalQuestions += 1;
      subjectStats[q.subject].totalTime += qTime;

      if (!topicMap[q.topic]) {
        topicMap[q.topic] = {
          topic: q.topic,
          subject: q.subject,
          correct: 0,
          total: 0,
          totalTime: 0
        };
      }
      topicMap[q.topic].total += 1;
      topicMap[q.topic].totalTime += qTime;

      if (!selected) {
        unattemptedCount += 1;
        rawScore += markingScheme.unattempted;
        subjectStats[q.subject].unattempted += 1;
      } else if (selected === q.correctOptionId) {
        correctCount += 1;
        rawScore += markingScheme.correct;
        subjectStats[q.subject].correct += 1;
        subjectStats[q.subject].score += markingScheme.correct;
        topicMap[q.topic].correct += 1;
      } else {
        incorrectCount += 1;
        rawScore += markingScheme.incorrect;
        subjectStats[q.subject].incorrect += 1;
        subjectStats[q.subject].score += markingScheme.incorrect;
      }
    });

    const totalMarks = questions.length * markingScheme.correct;
    const attemptedCount = correctCount + incorrectCount;
    const accuracy = attemptedCount > 0
      ? Math.round((correctCount / attemptedCount) * 100)
      : 0;

    // Heuristic percentile estimate:
    // In JEE Main, 90 percentile is ~100/300 marks (~33%). Scale percentage to realistic percentile bracket:
    const scorePct = totalMarks > 0 ? (rawScore / totalMarks) * 100 : 0;
    let percentile = 75.0;
    if (scorePct >= 80) percentile = 99.5;
    else if (scorePct >= 65) percentile = 98.2;
    else if (scorePct >= 50) percentile = 95.4;
    else if (scorePct >= 40) percentile = 92.1;
    else if (scorePct >= 30) percentile = 87.5;
    else if (scorePct >= 20) percentile = 79.0;
    else percentile = Math.max(50.0, Math.round((scorePct * 2.5) * 10) / 10);

    const subjectBreakdown = {
      Physics: {
        score: subjectStats.Physics.score,
        accuracy: (subjectStats.Physics.correct + subjectStats.Physics.incorrect > 0)
          ? Math.round((subjectStats.Physics.correct / (subjectStats.Physics.correct + subjectStats.Physics.incorrect)) * 100)
          : 0,
        correct: subjectStats.Physics.correct,
        incorrect: subjectStats.Physics.incorrect,
        unattempted: subjectStats.Physics.unattempted,
        avgTime: subjectStats.Physics.totalQuestions > 0 ? Math.round(subjectStats.Physics.totalTime / subjectStats.Physics.totalQuestions) : 0
      },
      Chemistry: {
        score: subjectStats.Chemistry.score,
        accuracy: (subjectStats.Chemistry.correct + subjectStats.Chemistry.incorrect > 0)
          ? Math.round((subjectStats.Chemistry.correct / (subjectStats.Chemistry.correct + subjectStats.Chemistry.incorrect)) * 100)
          : 0,
        correct: subjectStats.Chemistry.correct,
        incorrect: subjectStats.Chemistry.incorrect,
        unattempted: subjectStats.Chemistry.unattempted,
        avgTime: subjectStats.Chemistry.totalQuestions > 0 ? Math.round(subjectStats.Chemistry.totalTime / subjectStats.Chemistry.totalQuestions) : 0
      },
      Mathematics: {
        score: subjectStats.Mathematics.score,
        accuracy: (subjectStats.Mathematics.correct + subjectStats.Mathematics.incorrect > 0)
          ? Math.round((subjectStats.Mathematics.correct / (subjectStats.Mathematics.correct + subjectStats.Mathematics.incorrect)) * 100)
          : 0,
        correct: subjectStats.Mathematics.correct,
        incorrect: subjectStats.Mathematics.incorrect,
        unattempted: subjectStats.Mathematics.unattempted,
        avgTime: subjectStats.Mathematics.totalQuestions > 0 ? Math.round(subjectStats.Mathematics.totalTime / subjectStats.Mathematics.totalQuestions) : 0
      }
    };

    const topicBreakdown = Object.values(topicMap).map(t => ({
      topic: t.topic,
      subject: t.subject,
      correct: t.correct,
      total: t.total,
      accuracy: Math.round((t.correct / t.total) * 100),
      avgTime: Math.round(t.totalTime / t.total)
    }));

    // Data-driven observations
    const observations: string[] = [];
    if (attemptedCount > 0) {
      observations.push(
        `Scored ${rawScore} out of ${totalMarks} maximum marks (${accuracy}% accuracy across ${attemptedCount} attempted questions).`
      );
    }
    if (incorrectCount > 0) {
      const penaltyMarks = Math.abs(incorrectCount * markingScheme.incorrect);
      observations.push(
        `Negative penalty loss: ${incorrectCount} incorrect responses cost ${penaltyMarks} penalty mark(s). Omitting uncertain guesses would have elevated your net score.`
      );
    }
    if (unattemptedCount > 0) {
      observations.push(
        `${unattemptedCount} question(s) remained unattempted, preserving negative mark penalties.`
      );
    }
    if (subjectBreakdown.Mathematics.accuracy < subjectBreakdown.Physics.accuracy && subjectStats.Mathematics.totalQuestions > 0) {
      observations.push(
        `Mathematics accuracy (${subjectBreakdown.Mathematics.accuracy}%) trailed Physics (${subjectBreakdown.Physics.accuracy}%), indicating focused Calculus and Algebra revision is warranted.`
      );
    }

    const result: TestAttemptResult = {
      id: `attempt-${Date.now()}`,
      testId,
      testTitle,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      timeSpentSeconds,
      score: rawScore,
      totalMarks,
      correctCount,
      incorrectCount,
      unattemptedCount,
      accuracy,
      percentile,
      markingScheme,
      responses,
      subjectBreakdown,
      topicBreakdown,
      observations,
      comparisonWithPrevious: {
        prevTestTitle: 'JEE Main Mock #8 Baseline',
        scoreDelta: rawScore - (testId.includes('sec') ? 16 : 112),
        accuracyDelta: accuracy - 64,
        mathDelta: subjectBreakdown.Mathematics.score - 16,
        physicsDelta: subjectBreakdown.Physics.score - 52,
        chemDelta: subjectBreakdown.Chemistry.score - 44
      }
    };

    // Save attempt to local history
    const stored = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
    const list: TestAttemptResult[] = stored ? JSON.parse(stored) : [];
    list.unshift(result);
    localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(list));

    // Clear active test draft
    this.clearDraft(testId);

    return result;
  }

  async getLatestAttempt(): Promise<TestAttemptResult | null> {
    const stored = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
    if (!stored) return null;
    try {
      const list: TestAttemptResult[] = JSON.parse(stored);
      return list[0] || null;
    } catch {
      return null;
    }
  }

  async getAttemptById(attemptId: string): Promise<TestAttemptResult | null> {
    const stored = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
    if (!stored) return null;
    try {
      const list: TestAttemptResult[] = JSON.parse(stored);
      return list.find(a => a.id === attemptId) || null;
    } catch {
      return null;
    }
  }

  async getAllAttempts(): Promise<TestAttemptResult[]> {
    const stored = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  saveDraft(testId: string, responses: Record<string, QuestionResponse>, timerSeconds: number, currentIndex: number): void {
    try {
      localStorage.setItem(
        `${DRAFT_STORAGE_KEY}_${testId}`,
        JSON.stringify({ responses, timerSeconds, currentIndex, timestamp: Date.now() })
      );
    } catch {
      // ignore
    }
  }

  getDraft(testId: string): { responses: Record<string, QuestionResponse>; timerSeconds: number; currentIndex: number } | null {
    try {
      const raw = localStorage.getItem(`${DRAFT_STORAGE_KEY}_${testId}`);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  clearDraft(testId: string): void {
    try {
      localStorage.removeItem(`${DRAFT_STORAGE_KEY}_${testId}`);
    } catch {
      // ignore
    }
  }
}

class HybridMockTestService implements IMockTestService {
  private localService = new LocalMockTestService();

  async getAllTests(): Promise<MockTestSummary[]> {
    try {
      if (await apiClient.isBackendAvailable()) {
        const tests = await apiClient.getTests();
        if (tests && tests.length > 0) {
          return tests.map((t: any) => ({
            id: t.id,
            title: t.title,
            type: t.type,
            subject: t.subject,
            questionsCount: t.questionsCount,
            durationMinutes: t.durationMinutes,
            maxMarks: t.maxMarks,
            difficulty: t.difficulty,
            status: t.status,
            description: t.description,
            markingScheme: t.markingScheme || { correct: 4, incorrect: -1, unattempted: 0 }
          }));
        }
      }
    } catch (err) {
      console.warn('Backend getTests failed, using local tests:', err);
    }
    return this.localService.getAllTests();
  }

  async getTestById(id: string): Promise<MockTestSummary | null> {
    try {
      if (await apiClient.isBackendAvailable()) {
        const t = await apiClient.getTest(id);
        if (t) {
          return {
            id: t.id,
            title: t.title,
            type: t.type,
            subject: t.subject,
            questionsCount: t.questionsCount,
            durationMinutes: t.durationMinutes,
            maxMarks: t.maxMarks,
            difficulty: t.difficulty,
            status: t.status,
            description: t.description,
            markingScheme: t.markingScheme || { correct: 4, incorrect: -1, unattempted: 0 }
          };
        }
      }
    } catch (err) {
      console.warn(`Backend getTestById(${id}) failed, using local fallback:`, err);
    }
    return this.localService.getTestById(id);
  }

  async getTestQuestions(testId: string): Promise<Question[]> {
    try {
      if (await apiClient.isBackendAvailable()) {
        const qs = await apiClient.getTestQuestions(testId);
        if (qs && qs.length > 0) {
          return qs.map((q: any) => ({
            id: q.id,
            testId: q.testId,
            questionNumber: q.questionNumber,
            subject: q.subject,
            topic: q.topic,
            statement: q.statement,
            options: q.options,
            correctOptionId: q.correctOptionId,
            explanation: q.explanation,
            difficulty: q.difficulty,
            positiveMarks: q.positiveMarks,
            negativeMarks: q.negativeMarks,
            commonMisconception: q.commonMisconception,
            rememberRule: q.rememberRule
          }));
        }
      }
    } catch (err) {
      console.warn(`Backend getTestQuestions(${testId}) failed, using local fallback:`, err);
    }
    return this.localService.getTestQuestions(testId);
  }

  async submitTest(
    testId: string,
    responses: Record<string, QuestionResponse>,
    timeSpentSeconds: number,
    telemetry?: Record<string, any>
  ): Promise<TestAttemptResult> {
    try {
      if (await apiClient.isBackendAvailable()) {
        // Start or register attempt
        const startRes = await apiClient.startAttempt(testId);
        const attemptId = startRes.attemptId;

        // Authoritative submission payload
        const submitPayload = {
          studentId: 'student-aarav-01',
          timeSpentSeconds,
          responses: Object.fromEntries(
            Object.entries(responses).map(([k, v]) => [
              k,
              {
                selectedOption: v.selectedOption,
                markedForReview: v.markedForReview,
                timeSpentSeconds: v.timeSpentSeconds || 0
              }
            ])
          ),
          telemetry: telemetry || {}
        };

        const backendResult = await apiClient.submitAttempt(attemptId, submitPayload);
        if (backendResult) {
          const attemptResult: TestAttemptResult = {
            id: backendResult.id,
            testId: backendResult.testId,
            testTitle: backendResult.testTitle,
            date: backendResult.date,
            timeSpentSeconds: backendResult.timeSpentSeconds,
            score: backendResult.score,
            totalMarks: backendResult.totalMarks,
            correctCount: backendResult.correctCount,
            incorrectCount: backendResult.incorrectCount,
            unattemptedCount: backendResult.unattemptedCount,
            accuracy: backendResult.accuracy,
            percentile: backendResult.percentile || 85.0,
            markingScheme: backendResult.markingScheme,
            responses: responses,
            subjectBreakdown: backendResult.subjectBreakdown,
            topicBreakdown: backendResult.topicBreakdown,
            observations: backendResult.observations || []
          };

          // Save to local storage for local persistence
          const stored = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
          const list: TestAttemptResult[] = stored ? JSON.parse(stored) : [];
          list.unshift(attemptResult);
          localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(list));

          return attemptResult;
        }
      }
    } catch (err) {
      console.warn('Backend test submission failed, using local evaluation:', err);
    }

    return this.localService.submitTest(testId, responses, timeSpentSeconds);
  }

  async getLatestAttempt(): Promise<TestAttemptResult | null> {
    try {
      if (await apiClient.isBackendAvailable()) {
        const attempts = await apiClient.listAttempts();
        if (attempts && attempts.length > 0) {
          const latest = attempts[0];
          return {
            id: latest.id,
            testId: latest.testId,
            testTitle: latest.testTitle,
            date: latest.date,
            timeSpentSeconds: latest.timeSpentSeconds,
            score: latest.score,
            totalMarks: latest.totalMarks,
            correctCount: latest.correctCount,
            incorrectCount: latest.incorrectCount,
            unattemptedCount: latest.unattemptedCount,
            accuracy: latest.accuracy,
            percentile: latest.percentile || 85.0,
            markingScheme: latest.markingScheme,
            responses: latest.responses || {},
            subjectBreakdown: latest.subjectBreakdown,
            topicBreakdown: latest.topicBreakdown,
            observations: latest.observations || []
          };
        }
      }
    } catch {
      // fallback
    }
    return this.localService.getLatestAttempt();
  }

  async getAttemptById(attemptId: string): Promise<TestAttemptResult | null> {
    try {
      if (await apiClient.isBackendAvailable()) {
        const a = await apiClient.getAttempt(attemptId);
        if (a) {
          return {
            id: a.id,
            testId: a.testId,
            testTitle: a.testTitle,
            date: a.date,
            timeSpentSeconds: a.timeSpentSeconds,
            score: a.score,
            totalMarks: a.totalMarks,
            correctCount: a.correctCount,
            incorrectCount: a.incorrectCount,
            unattemptedCount: a.unattemptedCount,
            accuracy: a.accuracy,
            percentile: a.percentile || 85.0,
            markingScheme: a.markingScheme,
            responses: a.responses || {},
            subjectBreakdown: a.subjectBreakdown,
            topicBreakdown: a.topicBreakdown,
            observations: a.observations || []
          };
        }
      }
    } catch {
      // fallback
    }
    return this.localService.getAttemptById(attemptId);
  }

  async getAllAttempts(): Promise<TestAttemptResult[]> {
    try {
      if (await apiClient.isBackendAvailable()) {
        const attempts = await apiClient.listAttempts();
        if (attempts && attempts.length > 0) {
          return attempts.map((a: any) => ({
            id: a.id,
            testId: a.testId,
            testTitle: a.testTitle,
            date: a.date,
            timeSpentSeconds: a.timeSpentSeconds,
            score: a.score,
            totalMarks: a.totalMarks,
            correctCount: a.correctCount,
            incorrectCount: a.incorrectCount,
            unattemptedCount: a.unattemptedCount,
            accuracy: a.accuracy,
            percentile: a.percentile || 85.0,
            markingScheme: a.markingScheme,
            responses: a.responses || {},
            subjectBreakdown: a.subjectBreakdown,
            topicBreakdown: a.topicBreakdown,
            observations: a.observations || []
          }));
        }
      }
    } catch {
      // fallback
    }
    return this.localService.getAllAttempts();
  }

  saveDraft(testId: string, responses: Record<string, QuestionResponse>, timerSeconds: number, currentIndex: number): void {
    this.localService.saveDraft(testId, responses, timerSeconds, currentIndex);
  }

  getDraft(testId: string): { responses: Record<string, QuestionResponse>; timerSeconds: number; currentIndex: number } | null {
    return this.localService.getDraft(testId);
  }

  clearDraft(testId: string): void {
    this.localService.clearDraft(testId);
  }
}

export const mockTestService: IMockTestService = new HybridMockTestService();
