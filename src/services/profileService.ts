import { StudentProfile } from '../types';
import { INITIAL_STUDENT_PROFILE } from '../data/demoData';
import { apiClient } from './apiClient';

const STORAGE_KEY = 'jee_insight_student_profile';

export interface IProfileService {
  getProfile(): Promise<StudentProfile>;
  updateProfile(profile: Partial<StudentProfile>): Promise<StudentProfile>;
  resetProfile(): Promise<StudentProfile>;
}

class LocalProfileService implements IProfileService {
  async getProfile(): Promise<StudentProfile> {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENT_PROFILE));
      return { ...INITIAL_STUDENT_PROFILE };
    }
    try {
      return JSON.parse(raw);
    } catch {
      return { ...INITIAL_STUDENT_PROFILE };
    }
  }

  async updateProfile(updates: Partial<StudentProfile>): Promise<StudentProfile> {
    const current = await this.getProfile();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  async resetProfile(): Promise<StudentProfile> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENT_PROFILE));
    return { ...INITIAL_STUDENT_PROFILE };
  }
}

class HybridProfileService implements IProfileService {
  private localService = new LocalProfileService();

  async getProfile(): Promise<StudentProfile> {
    try {
      if (await apiClient.isBackendAvailable()) {
        const res = await apiClient.getProfile();
        if (res) {
          const profile: StudentProfile = {
            id: res.id,
            name: res.name,
            targetExam: res.target_exam || res.targetExam,
            targetScore: res.target_score || res.targetScore,
            dailyStudyHours: res.daily_study_hours || res.dailyStudyHours,
            preferredSubjects: res.preferred_subjects || res.preferredSubjects || ['Physics', 'Chemistry', 'Mathematics'],
            theme: res.theme || 'light',
            timerMode: res.timer_mode || res.timerMode || 'Flexible Demo',
            registeredDate: res.registered_date || res.registeredDate || 'August 2026'
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
          return profile;
        }
      }
    } catch (err) {
      console.warn('Backend getProfile failed, using local profile:', err);
    }
    return this.localService.getProfile();
  }

  async updateProfile(updates: Partial<StudentProfile>): Promise<StudentProfile> {
    try {
      if (await apiClient.isBackendAvailable()) {
        const backendUpdates: any = {};
        if (updates.name !== undefined) backendUpdates.name = updates.name;
        if (updates.targetExam !== undefined) backendUpdates.target_exam = updates.targetExam;
        if (updates.targetScore !== undefined) backendUpdates.target_score = updates.targetScore;
        if (updates.dailyStudyHours !== undefined) backendUpdates.daily_study_hours = updates.dailyStudyHours;
        if (updates.preferredSubjects !== undefined) backendUpdates.preferred_subjects = updates.preferredSubjects;
        if (updates.theme !== undefined) backendUpdates.theme = updates.theme;
        if (updates.timerMode !== undefined) backendUpdates.timer_mode = updates.timerMode;

        const res = await apiClient.updateProfile(backendUpdates);
        if (res) {
          const profile: StudentProfile = {
            id: res.id,
            name: res.name,
            targetExam: res.target_exam || res.targetExam,
            targetScore: res.target_score || res.targetScore,
            dailyStudyHours: res.daily_study_hours || res.dailyStudyHours,
            preferredSubjects: res.preferred_subjects || res.preferredSubjects || ['Physics', 'Chemistry', 'Mathematics'],
            theme: res.theme || 'light',
            timerMode: res.timer_mode || res.timerMode || 'Flexible Demo',
            registeredDate: res.registered_date || res.registeredDate || 'August 2026'
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
          return profile;
        }
      }
    } catch (err) {
      console.warn('Backend updateProfile failed, using local:', err);
    }
    return this.localService.updateProfile(updates);
  }

  async resetProfile(): Promise<StudentProfile> {
    try {
      if (await apiClient.isBackendAvailable()) {
        await apiClient.resetProfile();
      }
    } catch {
      // fallback
    }
    return this.localService.resetProfile();
  }
}

export const profileService: IProfileService = new HybridProfileService();
