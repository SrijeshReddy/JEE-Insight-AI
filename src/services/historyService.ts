import { HistoricalMockRecord, TestAttemptResult } from '../types';
import { HISTORICAL_MOCKS } from '../data/demoData';
import { apiClient } from './apiClient';

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
    // Start with historical benchmarks
    const list: HistoricalMockRecord[] = [...HISTORICAL_MOCKS];

    // Check if new session attempts exist in localStorage
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
            percentile: att.percentile,
            timeSpentMinutes: Math.max(1, Math.round(att.timeSpentSeconds / 60)),
            scoreDelta: att.comparisonWithPrevious?.scoreDelta || 0,
            physicsScore: att.subjectBreakdown.Physics.score,
            chemScore: att.subjectBreakdown.Chemistry.score,
            mathScore: att.subjectBreakdown.Mathematics.score,
            attemptId: att.id
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
      observations.push(`Net score improved by +${scoreDelta} marks from ${mock1.score} to ${mock2.score}.`);
    } else if (scoreDelta < 0) {
      observations.push(`Score declined by ${Math.abs(scoreDelta)} marks, predominantly impacted by subject variance.`);
    } else {
      observations.push(`Scores remained equal between attempts at ${mock1.score} marks.`);
    }

    if (accuracyDelta > 0) {
      observations.push(`Accuracy elevated by +${accuracyDelta}% (${mock1.accuracy}% -> ${mock2.accuracy}%), demonstrating disciplined question selection.`);
    } else if (accuracyDelta < 0) {
      observations.push(`Accuracy contracted by ${accuracyDelta}% due to higher unverified attempt volume.`);
    }

    if (mathDelta > 0) {
      observations.push(`Mathematics showed a positive gain of +${mathDelta} marks.`);
    } else if (mathDelta < 0) {
      observations.push(`Mathematics saw a contraction of ${mathDelta} marks, reaffirming it as the primary revision focus.`);
    }

    if (physicsDelta !== 0) {
      observations.push(`Physics performance delta: ${physicsDelta > 0 ? `+${physicsDelta}` : physicsDelta} marks.`);
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

class HybridHistoryService implements IHistoryService {
  private localService = new LocalHistoryService();

  async getAllHistory(): Promise<HistoricalMockRecord[]> {
    try {
      if (await apiClient.isBackendAvailable()) {
        const attempts = await apiClient.listAttempts();
        if (attempts && attempts.length > 0) {
          const list: HistoricalMockRecord[] = attempts.map((att: any, idx: number) => ({
            id: att.id,
            mockName: att.testTitle,
            date: att.date,
            score: att.score,
            totalMarks: att.totalMarks,
            accuracy: att.accuracy,
            percentile: att.percentile,
            timeSpentMinutes: Math.max(1, Math.round(att.timeSpentSeconds / 60)),
            scoreDelta: idx > 0 ? att.score - attempts[idx - 1].score : 0,
            physicsScore: att.subjectBreakdown?.Physics?.score || 0,
            chemScore: att.subjectBreakdown?.Chemistry?.score || 0,
            mathScore: att.subjectBreakdown?.Mathematics?.score || 0,
            attemptId: att.id
          }));
          return list;
        }
      }
    } catch (err) {
      console.warn('Backend history retrieval failed, using local history:', err);
    }
    return this.localService.getAllHistory();
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
    if (scoreDelta > 0) observations.push(`Net score increased by +${scoreDelta} marks.`);
    else if (scoreDelta < 0) observations.push(`Net score decreased by ${scoreDelta} marks.`);
    else observations.push('Net score remained unchanged.');

    if (physicsDelta > 0) observations.push(`Physics improved by +${physicsDelta} marks.`);
    if (chemDelta > 0) observations.push(`Chemistry improved by +${chemDelta} marks.`);
    if (mathDelta > 0) observations.push(`Mathematics improved by +${mathDelta} marks.`);

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

export const historyService: IHistoryService = new HybridHistoryService();
