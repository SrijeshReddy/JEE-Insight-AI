import { TopicPerformance, Question, Priority } from '../types';
import { TOPIC_PERFORMANCES, SAMPLE_QUESTIONS_MOCK_09, SAMPLE_QUESTIONS_MATH_SEC } from '../data/demoData';
import { apiClient } from './apiClient';

const ATTEMPTS_STORAGE_KEY = 'jee_insight_test_attempts';

export interface IWeakConceptsService {
  getTopics(params?: {
    subject?: string;
    priority?: string;
    search?: string;
    sortBy?: 'accuracy-asc' | 'accuracy-desc' | 'attempts-desc' | 'time-desc' | 'priority';
  }): Promise<TopicPerformance[]>;
  getTopicById(id: string): Promise<TopicPerformance | null>;
  getSampleQuestionsForTopic(topic: string): Promise<Question[]>;
}

class LocalWeakConceptsService implements IWeakConceptsService {
  async getTopics(params?: {
    subject?: string;
    priority?: string;
    search?: string;
    sortBy?: 'accuracy-asc' | 'accuracy-desc' | 'attempts-desc' | 'time-desc' | 'priority';
  }): Promise<TopicPerformance[]> {
    const list = [...TOPIC_PERFORMANCES];

    // Check if user submitted attempts exist in localStorage
    const stored = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
    if (stored) {
      try {
        const attempts = JSON.parse(stored);
        attempts.forEach((att: any) => {
          att.topicBreakdown?.forEach((tb: any) => {
            const match = list.find(t => t.topic.toLowerCase() === tb.topic.toLowerCase());
            if (match) {
              const combinedAttempts = match.attemptCount + tb.total;
              const combinedAcc = Math.round(((match.accuracy * match.attemptCount) + (tb.accuracy * tb.total)) / combinedAttempts);
              match.accuracy = combinedAcc;
              match.attemptCount = combinedAttempts;
              match.priority = combinedAcc < 50 ? 'High' : combinedAcc < 70 ? 'Medium' : 'Low';
              match.trend = tb.accuracy > match.accuracy ? 'Improving' : tb.accuracy < match.accuracy ? 'Declining' : 'Stable';
            }
          });
        });
      } catch {
        // ignore
      }
    }

    let result = list;

    if (params?.subject && params.subject !== 'All') {
      result = result.filter(t => t.subject === params.subject);
    }

    if (params?.priority && params.priority !== 'All') {
      result = result.filter(t => t.priority === params.priority);
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        t => t.topic.toLowerCase().includes(q) || t.subtopics.some(s => s.toLowerCase().includes(q))
      );
    }

    const priorityWeight: Record<Priority, number> = { High: 3, Medium: 2, Low: 1 };

    switch (params?.sortBy) {
      case 'accuracy-asc':
        result.sort((a, b) => a.accuracy - b.accuracy);
        break;
      case 'accuracy-desc':
        result.sort((a, b) => b.accuracy - a.accuracy);
        break;
      case 'attempts-desc':
        result.sort((a, b) => b.attemptCount - a.attemptCount);
        break;
      case 'time-desc':
        result.sort((a, b) => b.avgTimeSeconds - a.avgTimeSeconds);
        break;
      case 'priority':
      default:
        result.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority] || a.accuracy - b.accuracy);
        break;
    }

    return result;
  }

  async getTopicById(id: string): Promise<TopicPerformance | null> {
    const list = await this.getTopics();
    const item = list.find(t => t.id === id);
    return item ? { ...item } : null;
  }

  async getSampleQuestionsForTopic(topic: string): Promise<Question[]> {
    const allPool = [...SAMPLE_QUESTIONS_MOCK_09, ...SAMPLE_QUESTIONS_MATH_SEC];
    const matched = allPool.filter(q => q.topic.toLowerCase().includes(topic.toLowerCase()) || topic.toLowerCase().includes(q.topic.toLowerCase()));
    if (matched.length > 0) return matched.slice(0, 3);
    // Fallback to questions with same subject
    return allPool.slice(0, 2);
  }
}

class HybridWeakConceptsService implements IWeakConceptsService {
  private localService = new LocalWeakConceptsService();

  async getTopics(params?: {
    subject?: string;
    priority?: string;
    search?: string;
    sortBy?: 'accuracy-asc' | 'accuracy-desc' | 'attempts-desc' | 'time-desc' | 'priority';
  }): Promise<TopicPerformance[]> {
    try {
      if (await apiClient.isBackendAvailable()) {
        const topics = await apiClient.getWeakConcepts(params?.subject, params?.priority);
        if (topics && topics.length > 0) {
          let list: TopicPerformance[] = topics.map((t: any) => ({
            id: t.id,
            subject: t.subject,
            topic: t.topic,
            accuracy: t.accuracy,
            attemptCount: t.attemptCount,
            totalQuestions: t.totalQuestions,
            avgTimeSeconds: t.avgTimeSeconds,
            priority: t.priority as Priority,
            trend: t.trend as any,
            reason: t.reason,
            recommendedAction: t.recommendedAction,
            subtopics: t.subtopics || []
          }));

          if (params?.search && params.search.trim()) {
            const q = params.search.toLowerCase().trim();
            list = list.filter(t => t.topic.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q));
          }

          if (params?.sortBy) {
            switch (params.sortBy) {
              case 'accuracy-asc':
                list.sort((a, b) => a.accuracy - b.accuracy);
                break;
              case 'accuracy-desc':
                list.sort((a, b) => b.accuracy - a.accuracy);
                break;
              case 'attempts-desc':
                list.sort((a, b) => b.attemptCount - a.attemptCount);
                break;
              case 'time-desc':
                list.sort((a, b) => b.avgTimeSeconds - a.avgTimeSeconds);
                break;
              case 'priority':
                const order: Record<string, number> = { High: 1, Medium: 2, Low: 3 };
                list.sort((a, b) => (order[a.priority] || 4) - (order[b.priority] || 4));
                break;
            }
          }
          return list;
        }
      }
    } catch (err) {
      console.warn('Backend weak concepts failed, using local:', err);
    }
    return this.localService.getTopics(params);
  }

  async getTopicById(id: string): Promise<TopicPerformance | null> {
    const list = await this.getTopics();
    const item = list.find(t => t.id === id);
    return item ? { ...item } : null;
  }

  async getSampleQuestionsForTopic(topic: string): Promise<Question[]> {
    return this.localService.getSampleQuestionsForTopic(topic);
  }
}

export const weakConceptsService: IWeakConceptsService = new HybridWeakConceptsService();
