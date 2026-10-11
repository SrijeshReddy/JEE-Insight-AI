import { Subject, TestAttemptResult } from '../types';
import { HISTORICAL_MOCKS, SUBJECT_PERFORMANCES, TOPIC_PERFORMANCES } from '../data/demoData';
import { apiClient } from './apiClient';

const ATTEMPTS_STORAGE_KEY = 'jee_insight_test_attempts';

export interface AnalyticsFilterParams {
  subject?: 'All' | Subject;
  mockId?: string; // 'all' or mock ID
}

export interface AnalyticsData {
  scoreProgression: { mockName: string; score: number; accuracy: number; date: string }[];
  subjectAccuracy: { subject: Subject; accuracy: number; score: number; totalMarks: number }[];
  topicRankings: { topic: string; subject: Subject; accuracy: number; attempts: number; priority: string }[];
  difficultyBreakdown: { difficulty: string; accuracy: number; attempted: number; total: number }[];
  outcomeDistribution: { status: string; count: number; percentage: number; color: string }[];
  timeAnalysis: { subject: Subject; avgSeconds: number; targetSeconds: number }[];
  strongestTopics: { topic: string; subject: Subject; accuracy: number }[];
  weakestTopics: { topic: string; subject: Subject; accuracy: number; priority: string }[];
  errorPatternStats: {
    negativeMarksLost: number;
    unattemptedMarksLost: number;
    avoidableGuessCount: number;
  };
}

export interface IAnalyticsService {
  getAnalytics(params?: AnalyticsFilterParams): Promise<AnalyticsData>;
}

class LocalAnalyticsService implements IAnalyticsService {
  async getAnalytics(params?: AnalyticsFilterParams): Promise<AnalyticsData> {
    const subjectFilter = params?.subject || 'All';

    // 1. Gather all history (base + session attempts)
    const stored = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
    const sessionAttempts: TestAttemptResult[] = stored ? JSON.parse(stored) : [];

    const allHistory = [...HISTORICAL_MOCKS];
    sessionAttempts.forEach(att => {
      allHistory.push({
        id: att.id,
        mockName: att.testTitle.replace('JEE Main ', ''),
        date: att.date,
        score: att.score,
        totalMarks: att.totalMarks,
        accuracy: att.accuracy,
        timeSpentMinutes: Math.max(1, Math.round(att.timeSpentSeconds / 60)),
        scoreDelta: att.comparisonWithPrevious?.scoreDelta || 0,
        physicsScore: att.subjectBreakdown.Physics.score,
        chemScore: att.subjectBreakdown.Chemistry.score,
        mathScore: att.subjectBreakdown.Mathematics.score
      });
    });

    // 2. Score progression
    const scoreProgression = allHistory.map(m => {
      let scoreVal = m.score;
      if (subjectFilter === 'Physics') scoreVal = m.physicsScore;
      else if (subjectFilter === 'Chemistry') scoreVal = m.chemScore;
      else if (subjectFilter === 'Mathematics') scoreVal = m.mathScore;

      return {
        mockName: m.mockName.replace('JEE Main ', '').replace(' (Diagnostic)', '').replace(' (Sectional)', '').replace(' (Latest Baseline)', ''),
        score: scoreVal,
        accuracy: m.accuracy,
        date: m.date
      };
    });

    // 3. Subject accuracy & scores
    let subjectAccuracy = SUBJECT_PERFORMANCES.map(s => {
      // If there are session attempts, factor them in
      if (sessionAttempts.length > 0) {
        const latest = sessionAttempts[0];
        const subData = latest.subjectBreakdown[s.subject];
        if (subData && (subData.correct + subData.incorrect > 0)) {
          return {
            subject: s.subject,
            accuracy: Math.round((s.accuracy + subData.accuracy) / 2),
            score: Math.round((s.score + subData.score) / 2),
            totalMarks: s.totalMarks
          };
        }
      }
      return {
        subject: s.subject,
        accuracy: s.accuracy,
        score: s.score,
        totalMarks: s.totalMarks
      };
    });

    if (subjectFilter !== 'All') {
      subjectAccuracy = subjectAccuracy.filter(s => s.subject === subjectFilter);
    }

    // 4. Topic rankings
    const topicMap = new Map<string, { topic: string; subject: Subject; accuracy: number; attempts: number; priority: string }>();
    TOPIC_PERFORMANCES.forEach(t => {
      topicMap.set(t.topic, {
        topic: t.topic,
        subject: t.subject,
        accuracy: t.accuracy,
        attempts: t.attemptCount,
        priority: t.priority
      });
    });

    // Update with session attempts
    sessionAttempts.forEach(att => {
      att.topicBreakdown.forEach(tb => {
        const existing = topicMap.get(tb.topic);
        if (existing) {
          const totalAttempts = existing.attempts + tb.total;
          const blendedAcc = Math.round(((existing.accuracy * existing.attempts) + (tb.accuracy * tb.total)) / totalAttempts);
          existing.accuracy = blendedAcc;
          existing.attempts = totalAttempts;
          existing.priority = blendedAcc < 50 ? 'High' : blendedAcc < 70 ? 'Medium' : 'Low';
        } else {
          topicMap.set(tb.topic, {
            topic: tb.topic,
            subject: tb.subject,
            accuracy: tb.accuracy,
            attempts: tb.total,
            priority: tb.accuracy < 50 ? 'High' : tb.accuracy < 70 ? 'Medium' : 'Low'
          });
        }
      });
    });

    let topicRankings = Array.from(topicMap.values());
    if (subjectFilter !== 'All') {
      topicRankings = topicRankings.filter(t => t.subject === subjectFilter);
    }
    topicRankings.sort((a, b) => a.accuracy - b.accuracy);

    const strongestTopics = topicRankings.filter(t => t.accuracy >= 70).slice(-3).reverse();
    const weakestTopics = topicRankings.filter(t => t.accuracy < 60).slice(0, 3);

    // 5. Difficulty breakdown
    let difficultyBreakdown = [
      { difficulty: 'Easy', accuracy: 82, attempted: 92, total: 100 },
      { difficulty: 'Moderate', accuracy: 63, attempted: 74, total: 100 },
      { difficulty: 'Challenging', accuracy: 34, attempted: 45, total: 100 }
    ];

    if (subjectFilter === 'Mathematics') {
      difficultyBreakdown = [
        { difficulty: 'Easy', accuracy: 72, attempted: 80, total: 100 },
        { difficulty: 'Moderate', accuracy: 48, attempted: 60, total: 100 },
        { difficulty: 'Challenging', accuracy: 22, attempted: 35, total: 100 }
      ];
    } else if (subjectFilter === 'Physics') {
      difficultyBreakdown = [
        { difficulty: 'Easy', accuracy: 88, attempted: 95, total: 100 },
        { difficulty: 'Moderate', accuracy: 70, attempted: 82, total: 100 },
        { difficulty: 'Challenging', accuracy: 42, attempted: 50, total: 100 }
      ];
    } else if (subjectFilter === 'Chemistry') {
      difficultyBreakdown = [
        { difficulty: 'Easy', accuracy: 84, attempted: 90, total: 100 },
        { difficulty: 'Moderate', accuracy: 68, attempted: 75, total: 100 },
        { difficulty: 'Challenging', accuracy: 40, attempted: 48, total: 100 }
      ];
    }

    // 6. Outcome Distribution & Error patterns
    let correctCount = 33;
    let incorrectCount = 20;
    let unattemptedCount = 22;

    if (sessionAttempts.length > 0) {
      const latest = sessionAttempts[0];
      correctCount = latest.correctCount;
      incorrectCount = latest.incorrectCount;
      unattemptedCount = latest.unattemptedCount;
    }

    const totalQuestions = correctCount + incorrectCount + unattemptedCount;
    const outcomeDistribution = [
      { status: 'Correct (+4 marks)', count: correctCount, percentage: Math.round((correctCount / totalQuestions) * 100), color: '#16a34a' },
      { status: 'Incorrect (-1 penalty)', count: incorrectCount, percentage: Math.round((incorrectCount / totalQuestions) * 100), color: '#dc2626' },
      { status: 'Unattempted (0 marks)', count: unattemptedCount, percentage: Math.round((unattemptedCount / totalQuestions) * 100), color: '#94a3b8' }
    ];

    // 7. Time analysis
    const timeBase: { subject: Subject; avgSeconds: number; targetSeconds: number }[] = [
      { subject: 'Physics', avgSeconds: 125, targetSeconds: 130 },
      { subject: 'Chemistry', avgSeconds: 98, targetSeconds: 100 },
      { subject: 'Mathematics', avgSeconds: 195, targetSeconds: 160 }
    ];
    const timeAnalysis = timeBase.filter(t => subjectFilter === 'All' || t.subject === subjectFilter);

    return {
      scoreProgression,
      subjectAccuracy,
      topicRankings,
      difficultyBreakdown,
      outcomeDistribution,
      timeAnalysis,
      strongestTopics,
      weakestTopics,
      errorPatternStats: {
        negativeMarksLost: incorrectCount * 1,
        unattemptedMarksLost: unattemptedCount * 4,
        avoidableGuessCount: Math.round(incorrectCount * 0.6)
      }
    };
  }
}

class HybridAnalyticsService implements IAnalyticsService {
  private localService = new LocalAnalyticsService();

  async getAnalytics(params?: AnalyticsFilterParams): Promise<AnalyticsData> {
    try {
      if (await apiClient.isBackendAvailable()) {
        const workspaceData = await apiClient.getWorkspaceAnalytics(params?.subject, params?.mockId);
        if (workspaceData && workspaceData.scoreProgression && workspaceData.scoreProgression.length > 0) {
          return {
            scoreProgression: workspaceData.scoreProgression,
            subjectAccuracy: workspaceData.subjectAccuracy,
            topicRankings: workspaceData.topicRankings,
            difficultyBreakdown: workspaceData.difficultyBreakdown,
            outcomeDistribution: workspaceData.outcomeDistribution,
            timeAnalysis: workspaceData.timeAnalysis,
            strongestTopics: workspaceData.strongestTopics,
            weakestTopics: workspaceData.weakestTopics,
            errorPatternStats: workspaceData.errorPatternStats || {
              negativeMarksLost: 16,
              unattemptedMarksLost: 48,
              avoidableGuessCount: 8
            }
          };
        }
      }
    } catch (err) {
      console.warn('Backend analytics failed, using local analytics:', err);
    }
    return this.localService.getAnalytics(params);
  }
}

export const analyticsService: IAnalyticsService = new HybridAnalyticsService();
