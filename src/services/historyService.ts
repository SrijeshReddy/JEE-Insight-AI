import { HistoricalMockRecord, TestAttemptResult } from '../types';
import { HISTORICAL_MOCKS } from '../data/demoData';

const ATTEMPTS_STORAGE_KEY = 'jee_insight_test_attempts';

export interface IHistoryService {
  getAllHistory(): Promise<HistoricalMockRecord[]>;
  compareTwoMocks(mockId1: string, mockId2: string): Promise<{
    mock1: HistoricalMockRecord;
    mock2: HistoricalMockRecord;
    scoreDelta: number;
    accuracyDelta: number;
    physicsDelta: number;
    chemDelta: number;
    mathDelta: number;
    timeDelta: number;
    observations: string[];
  } | null>;
}

class LocalHistoryService implements IHistoryService {
  async getAllHistory(): Promise<HistoricalMockRecord[]> {
    const list = [...HISTORICAL_MOCKS];

    // Check if new attempts exist in localStorage
    const stored = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
    if (stored) {
      try {
        const attempts: TestAttemptResult[] = JSON.parse(stored);
        attempts.forEach(att => {
          list.push({
            id: att.id,
            mockName: `${att.testTitle} (Session Attempt)`,
            date: att.date,
            score: att.score,
            totalMarks: att.totalMarks,
            accuracy: att.accuracy,
            timeSpentMinutes: Math.round(att.timeSpentSeconds / 60),
            scoreDelta: att.comparisonWithPrevious?.scoreDelta || 0,
            physicsScore: att.subjectBreakdown.Physics.score,
            chemScore: att.subjectBreakdown.Chemistry.score,
            mathScore: att.subjectBreakdown.Mathematics.score
          });
        });
      } catch {
        // ignore JSON parse error
      }
    }

    return list;
  }

  async compareTwoMocks(mockId1: string, mockId2: string) {
    const all = await this.getAllHistory();
    const mock1 = all.find(m => m.id === mockId1);
    const mock2 = all.find(m => m.id === mockId2);

    if (!mock1 || !mock2) return null;

    const scoreDelta = mock2.score - mock1.score;
    const accuracyDelta = mock2.accuracy - mock1.accuracy;
    const physicsDelta = mock2.physicsScore - mock1.physicsScore;
    const chemDelta = mock2.chemScore - mock1.chemScore;
    const mathDelta = mock2.mathScore - mock1.mathScore;
    const timeDelta = mock2.timeSpentMinutes - mock1.timeSpentMinutes;

    const observations: string[] = [];
    if (scoreDelta > 0) {
      observations.push(`Net score improved by ${scoreDelta} marks from ${mock1.score} to ${mock2.score}.`);
    } else if (scoreDelta < 0) {
      observations.push(`Score declined by ${Math.abs(scoreDelta)} marks, predominantly impacted by subject variance.`);
    } else {
      observations.push(`Scores remained equal between attempts at ${mock1.score} marks.`);
    }

    if (mathDelta > 0) {
      observations.push(`Mathematics showed a positive gain of +${mathDelta} marks.`);
    } else if (mathDelta < 0) {
      observations.push(`Mathematics saw a contraction of ${mathDelta} marks, reaffirming it as the primary revision focus.`);
    }

    observations.push(
      `Note: Score variations between mock attempts reflect sample testing conditions and concept distribution, not verified causal guarantees of future performance.`
    );

    return {
      mock1,
      mock2,
      scoreDelta,
      accuracyDelta,
      physicsDelta,
      chemDelta,
      mathDelta,
      timeDelta,
      observations
    };
  }
}

export const historyService: IHistoryService = new LocalHistoryService();
