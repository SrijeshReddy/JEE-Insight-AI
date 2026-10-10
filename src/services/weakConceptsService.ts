import { TopicPerformance, Subject, Priority } from '../types';
import { TOPIC_PERFORMANCES } from '../data/demoData';

export interface IWeakConceptsService {
  getTopics(params?: {
    subject?: string;
    priority?: string;
    search?: string;
    sortBy?: 'accuracy-asc' | 'accuracy-desc' | 'attempts-desc' | 'time-desc' | 'priority';
  }): Promise<TopicPerformance[]>;
  getTopicById(id: string): Promise<TopicPerformance | null>;
}

class LocalWeakConceptsService implements IWeakConceptsService {
  async getTopics(params?: {
    subject?: string;
    priority?: string;
    search?: string;
    sortBy?: 'accuracy-asc' | 'accuracy-desc' | 'attempts-desc' | 'time-desc' | 'priority';
  }): Promise<TopicPerformance[]> {
    let result = [...TOPIC_PERFORMANCES];

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
    const item = TOPIC_PERFORMANCES.find(t => t.id === id);
    return item ? { ...item } : null;
  }
}

export const weakConceptsService: IWeakConceptsService = new LocalWeakConceptsService();
