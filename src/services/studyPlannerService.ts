import { StudyTask, Subject } from '../types';
import { INITIAL_STUDY_TASKS } from '../data/demoData';
import { apiClient } from './apiClient';

const TASKS_STORAGE_KEY = 'jee_insight_study_tasks';

export interface IStudyPlannerService {
  getTasks(): Promise<StudyTask[]>;
  toggleTask(taskId: string): Promise<StudyTask[]>;
  addTask(task: Omit<StudyTask, 'id' | 'completed'>): Promise<StudyTask[]>;
  updateTask(taskId: string, updates: Partial<StudyTask>): Promise<StudyTask[]>;
  deleteTask(taskId: string): Promise<StudyTask[]>;
  resetTasks(): Promise<StudyTask[]>;
  addTasksFromWeakTopics?(topics: Array<{ topic: string; subject: Subject; priority?: string; reason?: string }>): Promise<StudyTask[]>;
}

class LocalStudyPlannerService implements IStudyPlannerService {
  private getStored(): StudyTask[] {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(INITIAL_STUDY_TASKS));
      return [...INITIAL_STUDY_TASKS];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [...INITIAL_STUDY_TASKS];
    }
  }

  private save(tasks: StudyTask[]): void {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }

  async getTasks(): Promise<StudyTask[]> {
    return this.getStored();
  }

  async toggleTask(taskId: string): Promise<StudyTask[]> {
    const list = this.getStored();
    const index = list.findIndex(t => t.id === taskId);
    if (index !== -1) {
      list[index].completed = !list[index].completed;
      this.save(list);
    }
    return list;
  }

  async addTask(data: Omit<StudyTask, 'id' | 'completed'>): Promise<StudyTask[]> {
    const list = this.getStored();
    const newTask: StudyTask = {
      ...data,
      id: `task-${Date.now()}`,
      completed: false
    };
    list.unshift(newTask);
    this.save(list);
    return list;
  }

  async updateTask(taskId: string, updates: Partial<StudyTask>): Promise<StudyTask[]> {
    const list = this.getStored();
    const index = list.findIndex(t => t.id === taskId);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      this.save(list);
    }
    return list;
  }

  async deleteTask(taskId: string): Promise<StudyTask[]> {
    const list = this.getStored().filter(t => t.id !== taskId);
    this.save(list);
    return list;
  }

  async resetTasks(): Promise<StudyTask[]> {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(INITIAL_STUDY_TASKS));
    return [...INITIAL_STUDY_TASKS];
  }
}

class HybridStudyPlannerService implements IStudyPlannerService {
  private localService = new LocalStudyPlannerService();

  async getTasks(): Promise<StudyTask[]> {
    try {
      if (await apiClient.isBackendAvailable()) {
        const tasks = await apiClient.getTasks();
        if (tasks && tasks.length > 0) {
          const mapped = tasks.map((t: any) => ({
            id: t.id,
            day: t.day,
            subject: t.subject,
            topic: t.topic,
            title: t.title,
            durationMinutes: t.durationMinutes,
            taskType: t.taskType,
            priority: t.priority,
            completed: t.completed,
            reason: t.reason,
            isAutoRecommended: t.isAutoRecommended
          }));
          // Sync with local storage
          localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(mapped));
          return mapped;
        }
      }
    } catch (err) {
      console.warn('Backend getTasks failed, using local storage:', err);
    }
    return this.localService.getTasks();
  }

  async toggleTask(taskId: string): Promise<StudyTask[]> {
    try {
      if (await apiClient.isBackendAvailable()) {
        const currentTasks = await this.getTasks();
        const target = currentTasks.find(t => t.id === taskId);
        if (target) {
          await apiClient.updateTask(taskId, { completed: !target.completed });
          return this.getTasks();
        }
      }
    } catch (err) {
      console.warn(`Backend toggleTask(${taskId}) failed, using local:`, err);
    }
    return this.localService.toggleTask(taskId);
  }

  async addTask(data: Omit<StudyTask, 'id' | 'completed'>): Promise<StudyTask[]> {
    try {
      if (await apiClient.isBackendAvailable()) {
        await apiClient.createTask(data);
        return this.getTasks();
      }
    } catch (err) {
      console.warn('Backend addTask failed, using local:', err);
    }
    return this.localService.addTask(data);
  }

  async updateTask(taskId: string, updates: Partial<StudyTask>): Promise<StudyTask[]> {
    try {
      if (await apiClient.isBackendAvailable()) {
        await apiClient.updateTask(taskId, updates);
        return this.getTasks();
      }
    } catch (err) {
      console.warn(`Backend updateTask(${taskId}) failed, using local:`, err);
    }
    return this.localService.updateTask(taskId, updates);
  }

  async deleteTask(taskId: string): Promise<StudyTask[]> {
    try {
      if (await apiClient.isBackendAvailable()) {
        await apiClient.deleteTask(taskId);
        return this.getTasks();
      }
    } catch (err) {
      console.warn(`Backend deleteTask(${taskId}) failed, using local:`, err);
    }
    return this.localService.deleteTask(taskId);
  }

  async resetTasks(): Promise<StudyTask[]> {
    return this.localService.resetTasks();
  }

  async addTasksFromWeakTopics(topics: Array<{ topic: string; subject: Subject; priority?: string; reason?: string }>): Promise<StudyTask[]> {
    try {
      if (await apiClient.isBackendAvailable()) {
        await apiClient.addTasksFromWeakTopics(topics);
        return this.getTasks();
      }
    } catch (err) {
      console.warn('Backend addTasksFromWeakTopics failed, using local:', err);
    }
    const current = await this.localService.getTasks();
    const days: Array<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'> = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let i = 0; i < topics.length; i++) {
      const t = topics[i];
      if (!current.some(c => c.topic.toLowerCase() === t.topic.toLowerCase() && !c.completed)) {
        await this.localService.addTask({
          day: days[(i + 1) % 7],
          subject: t.subject,
          topic: t.topic,
          title: `Drill on ${t.topic}`,
          durationMinutes: 60,
          taskType: 'Timed Practice',
          priority: (t.priority as any) || 'High',
          reason: t.reason || 'Auto-recommended from weak concept diagnostics',
          isAutoRecommended: true
        });
      }
    }
    return this.localService.getTasks();
  }
}

export const studyPlannerService: IStudyPlannerService = new HybridStudyPlannerService();
