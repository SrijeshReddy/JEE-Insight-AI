import { MockTestSummary, Question, QuestionResponse, TestAttemptResult, Subject } from '../types';
import { MOCK_TESTS_LIBRARY, SAMPLE_QUESTIONS_MOCK_09 } from '../data/demoData';

const ATTEMPTS_STORAGE_KEY = 'jee_insight_test_attempts';

export interface IMockTestService {
  getAllTests(): Promise<MockTestSummary[]>;
  getTestById(id: string): Promise<MockTestSummary | null>;
  getTestQuestions(testId: string): Promise<Question[]>;
  submitTest(
    testId: string,
    responses: Record<string, QuestionResponse>,
    timeSpentSeconds: number
  ): Promise<TestAttemptResult>;
  getLatestAttempt(): Promise<TestAttemptResult | null>;
  getAttemptById(attemptId: string): Promise<TestAttemptResult | null>;
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
    // For demo purposes, if testId is test-jee-09 or any test, return questions
    if (testId === 'test-jee-09' || testId.includes('test-')) {
      return [...SAMPLE_QUESTIONS_MOCK_09];
    }
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
      const qTime = resp?.timeSpentSeconds || 60;

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
        subjectStats[q.subject].unattempted += 1;
      } else if (selected === q.correctOptionId) {
        correctCount += 1;
        rawScore += 4;
        subjectStats[q.subject].correct += 1;
        subjectStats[q.subject].score += 4;
        topicMap[q.topic].correct += 1;
      } else {
        incorrectCount += 1;
        rawScore -= 1;
        subjectStats[q.subject].incorrect += 1;
        subjectStats[q.subject].score -= 1;
      }
    });

    // In JEE Main, full marks = 300 (or for this 15-question demo set, normalized / projected to 300)
    // 15 questions * 4 = 60 raw max. Scaled to 300 scale: (rawScore / 60) * 300 = rawScore * 5
    const scaledScore = Math.max(0, Math.round(rawScore * 5));
    const accuracy = (correctCount + incorrectCount > 0)
      ? Math.round((correctCount / (correctCount + incorrectCount)) * 100)
      : 0;

    const subjectBreakdown = {
      Physics: {
        score: Math.max(0, subjectStats.Physics.score * 5),
        accuracy: (subjectStats.Physics.correct + subjectStats.Physics.incorrect > 0)
          ? Math.round((subjectStats.Physics.correct / (subjectStats.Physics.correct + subjectStats.Physics.incorrect)) * 100)
          : 0,
        correct: subjectStats.Physics.correct,
        incorrect: subjectStats.Physics.incorrect,
        unattempted: subjectStats.Physics.unattempted,
        avgTime: subjectStats.Physics.totalQuestions > 0 ? Math.round(subjectStats.Physics.totalTime / subjectStats.Physics.totalQuestions) : 0
      },
      Chemistry: {
        score: Math.max(0, subjectStats.Chemistry.score * 5),
        accuracy: (subjectStats.Chemistry.correct + subjectStats.Chemistry.incorrect > 0)
          ? Math.round((subjectStats.Chemistry.correct / (subjectStats.Chemistry.correct + subjectStats.Chemistry.incorrect)) * 100)
          : 0,
        correct: subjectStats.Chemistry.correct,
        incorrect: subjectStats.Chemistry.incorrect,
        unattempted: subjectStats.Chemistry.unattempted,
        avgTime: subjectStats.Chemistry.totalQuestions > 0 ? Math.round(subjectStats.Chemistry.totalTime / subjectStats.Chemistry.totalQuestions) : 0
      },
      Mathematics: {
        score: Math.max(0, subjectStats.Mathematics.score * 5),
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
    if (subjectBreakdown.Mathematics.accuracy < subjectBreakdown.Physics.accuracy) {
      observations.push(
        `Mathematics accuracy (${subjectBreakdown.Mathematics.accuracy}%) is lower than Physics (${subjectBreakdown.Physics.accuracy}%) in this attempt, indicating conceptual hesitation or algebraic speed traps.`
      );
    }
    if (incorrectCount > 3) {
      observations.push(
        `Negative marking penalty: ${incorrectCount} incorrect answers resulted in a loss of ${incorrectCount} raw marks (-${incorrectCount * 5} scaled marks). Exercising selective skipping on uncertain questions will instantly stabilize your score.`
      );
    }
    if (subjectBreakdown.Chemistry.avgTime < subjectBreakdown.Physics.avgTime) {
      observations.push(
        `Pacing observation: Chemistry solving pace was rapid (${subjectBreakdown.Chemistry.avgTime}s/question), freeing time for calculation-intensive mechanics and calculus.`
      );
    }
    if (observations.length === 0) {
      observations.push('Balanced performance across tested subjects with steady pace and positive accuracy ratio.');
    }

    const result: TestAttemptResult = {
      id: `attempt-${Date.now()}`,
      testId,
      testTitle,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      timeSpentSeconds,
      score: scaledScore,
      totalMarks: 300,
      correctCount,
      incorrectCount,
      unattemptedCount,
      accuracy,
      responses,
      subjectBreakdown,
      topicBreakdown,
      observations,
      comparisonWithPrevious: {
        prevTestTitle: 'JEE Main Mock #8',
        scoreDelta: scaledScore - 112,
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
}

export const mockTestService: IMockTestService = new LocalMockTestService();
