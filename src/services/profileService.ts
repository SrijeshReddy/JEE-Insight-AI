import { StudentProfile } from '../types';
import { INITIAL_STUDENT_PROFILE } from '../data/demoData';

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

export const profileService: IProfileService = new LocalProfileService();
