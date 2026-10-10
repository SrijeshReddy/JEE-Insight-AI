import { Subject } from '../types';
import { HISTORICAL_MOCKS, SUBJECT_PERFORMANCES, TOPIC_PERFORMANCES } from '../data/demoData';

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
}

export interface IAnalyticsService {
  getAnalytics(params?: AnalyticsFilterParams): Promise<AnalyticsData>;
}

class LocalAnalyticsService implements IAnalyticsService {
  async getAnalytics(params?: AnalyticsFilterParams): Promise<AnalyticsData> {
    const subjectFilter = params?.subject || 'All';

    // Filtered Score progression
    const scoreProgression = HISTORICAL_MOCKS.map(m => {
      let scoreVal = m.score;
      if (subjectFilter === 'Physics') scoreVal = m.physicsScore;
      else if (subjectFilter === 'Chemistry') scoreVal = m.chemScore;
      else if (subjectFilter === 'Mathematics') scoreVal = m.mathScore;

      return {
        mockName: m.mockName.replace('JEE Main ', ''),
        score: scoreVal,
        accuracy: m.accuracy,
        date: m.date
      };
    });

    // Subject accuracy
    let subjectAccuracy = SUBJECT_PERFORMANCES.map(s => ({
      subject: s.subject,
      accuracy: s.accuracy,
      score: s.score,
      totalMarks: s.totalMarks
    }));

    if (subjectFilter !== 'All') {
      subjectAccuracy = subjectAccuracy.filter(s => s.subject === subjectFilter);
    }

    // Topic rankings
    let topicRankings = TOPIC_PERFORMANCES.map(t => ({
      topic: t.topic,
      subject: t.subject,
      accuracy: t.accuracy,
      attempts: t.attemptCount,
      priority: t.priority
    }));

    if (subjectFilter !== 'All') {
      topicRankings = topicRankings.filter(t => t.subject === subjectFilter);
    }
    topicRankings.sort((a, b) => a.accuracy - b.accuracy);

    // Difficulty breakdown (sample distribution across mock benchmarks)
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
    }

    // Correct vs Incorrect vs Unattempted
    const outcomeDistribution = [
      { status: 'Correct (+4 marks)', count: 33, percentage: 44, color: '#16a34a' },
      { status: 'Incorrect (-1 penalty)', count: 20, percentage: 27, color: '#dc2626' },
      { status: 'Unattempted (0 marks)', count: 22, percentage: 29, color: '#94a3b8' }
    ];

    // Time per question
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
      timeAnalysis
    };
  }
}

export const analyticsService: IAnalyticsService = new LocalAnalyticsService();
