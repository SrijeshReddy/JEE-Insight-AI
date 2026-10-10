import { StudyTask } from '../types';
import { INITIAL_STUDY_TASKS } from '../data/demoData';

const TASKS_STORAGE_KEY = 'jee_insight_study_tasks';

export interface IStudyPlannerService {
  getTasks(): Promise<StudyTask[]>;
  toggleTask(taskId: string): Promise<StudyTask[]>;
  addTask(task: Omit<StudyTask, 'id' | 'completed'>): Promise<StudyTask[]>;
  updateTask(taskId: string, updates: Partial<StudyTask>): Promise<StudyTask[]>;
  deleteTask(taskId: string): Promise<StudyTask[]>;
  resetTasks(): Promise<StudyTask[]>;
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

export const studyPlannerService: IStudyPlannerService = new LocalStudyPlannerService();
