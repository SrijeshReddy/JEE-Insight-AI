/**
 * Centralized API Client for JEE InsightAI
 * Connects frontend to Python FastAPI Backend (http://127.0.0.1:8000/api/v1)
 * with robust error handling and network fallback support.
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  private baseUrl: string;
  private backendAvailable: boolean | null = null;
  private lastHealthCheck: number = 0;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  async isBackendAvailable(): Promise<boolean> {
    const now = Date.now();
    // Cache availability check for 5 seconds to prevent spamming
    if (this.backendAvailable !== null && now - this.lastHealthCheck < 5000) {
      return this.backendAvailable;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(`${this.baseUrl}/health`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      this.backendAvailable = res.ok;
      this.lastHealthCheck = now;
      return res.ok;
    } catch {
      this.backendAvailable = false;
      this.lastHealthCheck = now;
      return false;
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) || {})
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        let errorData: any;
        try {
          errorData = await response.json();
        } catch {
          errorData = { detail: response.statusText };
        }
        throw new ApiError(
          errorData.detail || `Request failed with status ${response.status}`,
          response.status,
          errorData
        );
      }

      return (await response.json()) as T;
    } catch (err: any) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(err.message || 'Network request failed', 0);
    }
  }

  // System
  async getHealth() {
    return this.request<{ status: string; database: string; version: string }>('/health');
  }

  // Mock Tests
  async getTests(params?: { type?: string; subject?: string; difficulty?: string }) {
    const query = new URLSearchParams();
    if (params?.type && params.type !== 'All') query.set('type', params.type);
    if (params?.subject && params.subject !== 'All') query.set('subject', params.subject);
    if (params?.difficulty && params.difficulty !== 'All') query.set('difficulty', params.difficulty);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<any[]>(`/tests${qs}`);
  }

  async getTest(testId: string) {
    return this.request<any>(`/tests/${encodeURIComponent(testId)}`);
  }

  async getTestQuestions(testId: string) {
    return this.request<any[]>(`/tests/${encodeURIComponent(testId)}/questions`);
  }

  // Attempts
  async startAttempt(testId: string, studentId: string = 'student-aarav-01') {
    return this.request<{ attemptId: string; testId: string; testTitle: string; status: string }>(
      '/attempts/start',
      {
        method: 'POST',
        body: JSON.stringify({ testId, studentId })
      }
    );
  }

  async recordQuestionResponse(attemptId: string, questionId: string, payload: {
    selectedOption?: string | null;
    markedForReview?: boolean;
    timeSpentSeconds?: number;
  }) {
    return this.request<any>(
      `/attempts/${encodeURIComponent(attemptId)}/response?question_id=${encodeURIComponent(questionId)}`,
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    );
  }

  async recordQuestionTelemetry(attemptId: string, questionId: string, payload: {
    visitCount: number;
    timeToFirstActionSeconds?: number | null;
    answerChangeCount: number;
    reviewToggleCount: number;
    initialOption?: string | null;
    finalOption?: string | null;
    telemetryEvents?: any[];
  }) {
    return this.request<any>(
      `/attempts/${encodeURIComponent(attemptId)}/telemetry?question_id=${encodeURIComponent(questionId)}`,
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    );
  }

  async submitAttempt(attemptId: string, payload: {
    studentId?: string;
    responses: Record<string, {
      selectedOption?: string | null;
      markedForReview?: boolean;
      timeSpentSeconds?: number;
    }>;
    telemetry?: Record<string, any>;
    timeSpentSeconds: number;
  }) {
    return this.request<any>(
      `/attempts/${encodeURIComponent(attemptId)}/submit`,
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    );
  }

  async getAttempt(attemptId: string) {
    return this.request<any>(`/attempts/${encodeURIComponent(attemptId)}`);
  }

  async listAttempts(studentId: string = 'student-aarav-01') {
    return this.request<any[]>(`/attempts?student_id=${encodeURIComponent(studentId)}`);
  }

  // Analytics & Behavioral Diagnostics
  async getDashboardAnalytics() {
    return this.request<any>('/analytics/dashboard');
  }

  async getWorkspaceAnalytics(subject?: string, mockId?: string) {
    const query = new URLSearchParams();
    if (subject && subject !== 'All') query.set('subject', subject);
    if (mockId && mockId !== 'all') query.set('mock_id', mockId);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<any>(`/analytics/workspace${qs}`);
  }

  async getDiagnostics(attemptId?: string) {
    const qs = attemptId && attemptId !== 'all' ? `?attempt_id=${encodeURIComponent(attemptId)}&mock_id=${encodeURIComponent(attemptId)}` : '';
    return this.request<any>(`/analytics/diagnostics${qs}`);
  }

  async getWeakConcepts(subject?: string, priority?: string) {
    const query = new URLSearchParams();
    if (subject && subject !== 'All') query.set('subject', subject);
    if (priority && priority !== 'All') query.set('priority', priority);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<any[]>(`/analytics/weak-concepts${qs}`);
  }

  // Study Planner Tasks
  async getTasks(studentId: string = 'student-aarav-01') {
    return this.request<any[]>(`/tasks?student_id=${encodeURIComponent(studentId)}`);
  }

  async createTask(task: any, studentId: string = 'student-aarav-01') {
    return this.request<any>(`/tasks?student_id=${encodeURIComponent(studentId)}`, {
      method: 'POST',
      body: JSON.stringify(task)
    });
  }

  async updateTask(taskId: string, updates: any) {
    return this.request<any>(`/tasks/${encodeURIComponent(taskId)}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  async deleteTask(taskId: string) {
    return this.request<any>(`/tasks/${encodeURIComponent(taskId)}`, {
      method: 'DELETE'
    });
  }

  async addTasksFromWeakTopics(weakTopics: any[], studentId: string = 'student-aarav-01') {
    return this.request<any[]>(`/tasks/from-weak-topics?student_id=${encodeURIComponent(studentId)}`, {
      method: 'POST',
      body: JSON.stringify(weakTopics)
    });
  }

  // Profile
  async getProfile() {
    return this.request<any>('/profile');
  }

  async updateProfile(updates: any) {
    return this.request<any>('/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async resetProfile() {
    return this.request<any>('/profile/reset', {
      method: 'POST'
    });
  }

  // AI Coach
  async sendCoachChat(message: string, contextTopic?: string) {
    return this.request<any>('/coach/chat', {
      method: 'POST',
      body: JSON.stringify({ message, contextTopic })
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
