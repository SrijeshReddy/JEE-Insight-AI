import { ChatMessage } from '../types';
import { INITIAL_AI_CHAT_MESSAGES, AI_KNOWLEDGE_BASE } from '../data/demoData';
import { mockTestService } from './mockTestService';
import { apiClient } from './apiClient';

const CHAT_STORAGE_KEY = 'jee_insight_chat_history';

export interface IAICoachService {
  getMessages(): Promise<ChatMessage[]>;
  sendMessage(userText: string, contextTopic?: string): Promise<{ userMsg: ChatMessage; coachMsg: ChatMessage }>;
  clearChat(): Promise<ChatMessage[]>;
}

class LocalAICoachService implements IAICoachService {
  private getStored(): ChatMessage[] {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(INITIAL_AI_CHAT_MESSAGES));
      return [...INITIAL_AI_CHAT_MESSAGES];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [...INITIAL_AI_CHAT_MESSAGES];
    }
  }

  private save(messages: ChatMessage[]): void {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }

  async getMessages(): Promise<ChatMessage[]> {
    return this.getStored();
  }

  async sendMessage(userText: string, contextTopic?: string): Promise<{ userMsg: ChatMessage; coachMsg: ChatMessage }> {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'student',
      text: userText,
      timestamp: timeStr,
      contextTopic
    };

    // Retrieve latest attempt context if exists
    const latestAttempt = await mockTestService.getLatestAttempt();
    const currentScore = latestAttempt ? latestAttempt.score : 112;
    const currentAccuracy = latestAttempt ? latestAttempt.accuracy : 64;

    const q = userText.toLowerCase();
    let reply = '';
    let suggestions: string[] = [
      'Explain my mistakes in Mock 8',
      'Help me understand Integration',
      'Create a seven-day revision plan'
    ];
    let actionLinks: ChatMessage['actionLinks'] = [];

    if (q.includes('score') || q.includes('why') || q.includes('change') || q.includes('trajectory')) {
      reply = `Here is the data breakdown of your recent performance:

1. **Current Benchmark**: Your latest recorded score is **${currentScore}/300** with **${currentAccuracy}%** accuracy.
2. **Physics**: Demonstrates solid stability (~52 marks), led by strong accuracy in Kinematics and Current Electricity.
3. **Chemistry**: Solid consistency (~44 marks), with rapid pacing (~98s/question).
4. **Mathematics**: The primary bottleneck (~16 marks, 51% accuracy). High negative marking penalties (-12 marks penalty) drag your aggregate score.
5. **Key Leverage**: Eliminating hasty guesses in Mathematics alone would immediately lift your score by +10 to +14 marks without solving a single extra problem!`;
      suggestions = ['How to avoid negative marks in Maths?', 'Breakdown Integration mistakes', 'Create a 7-day study plan'];
      actionLinks = [
        { label: 'View Performance Analytics', page: 'analytics' },
        { label: 'Simulate Score Scenarios', page: 'score-simulator' }
      ];
    } else if (q.includes('integration') || q.includes('integral') || q.includes('calculus') || q.includes("king's")) {
      reply = `Let us address your Integration performance (38% accuracy, 228s avg solving time):

• **Root Cause Detected**: In your mock responses, errors were concentrated in two areas:
  1. Forgetting to apply King's Property (∫₀ᵃ f(x)dx = ∫₀ᵃ f(a-x)dx) before expanding complex fractional integrands.
  2. Sign mistakes during trigonometric half-angle substitutions.

• **Concrete 3-Step Fix**:
  1. **Triage First (10 seconds)**: Before writing, inspect whether f(a-x) simplifies the denominator. If denominator remains invariant (e.g., sin⁴x + cos⁴x), King's property yields the solution in 3 lines.
  2. **Boundary Checks**: Always evaluate limits at each substitution step rather than back-substituting x at the end.
  3. **Targeted Practice**: Complete 15 curated property integrals today.`;
      suggestions = ['Add Integration tasks to Study Planner', 'Practice Chapter Sprint', 'Time management for Calculus'];
      actionLinks = [
        { label: 'Inspect Integration in Weak Concepts', page: 'weak-concepts', context: 'Integration' },
        { label: 'Open Study Planner', page: 'study-planner' }
      ];
    } else if (q.includes('mistake') || q.includes('mock 8') || q.includes('error') || q.includes('wrong') || q.includes('negative')) {
      reply = `Analysis of your incorrect responses in your mock diagnostic:

• **Negative Marking Penalty**: 20 incorrect answers (resulting in -20 negative marks penalty).
• **Mathematics (12 negatives)**:
  - 4 questions in Indefinite Integration attempted with incomplete substitutions.
  - 3 questions in Probability where conditional independence was mistakenly assumed.
  - 2 numericals with calculation rounding errors in Conic Sections.
• **Chemistry (4 negatives)**:
  - 2 questions on Carbocation rearrangement stability order (hydride vs methyl shift).
• **Physics (4 negatives)**:
  - 2 questions on rolling motion where torque was taken about a non-inertial axis.

Recommendation: If you omit uncertain guesses in Mathematics where confidence is below 70%, your baseline score jumps immediately from ${currentScore} to ~${currentScore + 12}.`;
      suggestions = ['How to build selective skipping discipline', 'Explain Carbocation rearrangements', 'Review Study Plan'];
      actionLinks = [
        { label: 'Review Diagnostic Results', page: 'results' },
        { label: 'Open Weak Concepts Matrix', page: 'weak-concepts' }
      ];
    } else if (q.includes('plan') || q.includes('seven') || q.includes('schedule') || q.includes('week') || q.includes('revision')) {
      reply = `Here is a high-leverage 7-Day Precision Revision Plan tailored to your ${currentScore}/300 baseline:

• **Mon-Tue (Calculus Recovery)**:
  - 90 mins daily on Definite Integration standard properties.
  - 30 mins timed drill (10 questions, strict 2.5 min cap).

• **Wed-Thu (Organic & Probability)**:
  - Revisit SN1/SN2 solvent polarity tables and carbocation shifts.
  - Bayes Theorem tree diagrams and partitioning problems.

• **Fri (Speed & Formula Sprint)**:
  - Rotational motion conservation laws.
  - Conic sections parametric equations memorization.

• **Sat-Sun (Simulation & Review)**:
  - Saturday: 60-min Mathematics Sectional test.
  - Sunday: Full analysis and error classification into 'Concept Gap' vs 'Silly Error'.`;
      suggestions = ['Apply this plan to my Study Planner', 'Simulate score with this plan', 'Ask about Physics strategy'];
      actionLinks = [
        { label: 'View Study Planner', page: 'study-planner' }
      ];
    } else if (q.includes('time') || q.includes('speed') || q.includes('strategy') || q.includes('manage')) {
      reply = `Recommended JEE Main Time Management Architecture (180 minutes):

1. **Round 1 — The Sweep (0 to 60 mins)**:
   - Chemistry: 35 mins (target 18-20 questions).
   - Physics: 25 mins (target 10-12 direct formula questions).
   - Rule: Skip any question requiring more than 2 minutes of calculation.

2. **Round 2 — Deep Work (60 to 140 mins)**:
   - Mathematics: 45 mins (focus on high-confidence algebra, matrices, vectors).
   - Physics Mechanics & Electrodynamics: 35 mins.

3. **Round 3 — Review & Calculated Attempts (140 to 180 mins)**:
   - Return to flagged questions in Calculus and Organic Chemistry.
   - Strictly avoid wild guesses in the final 10 minutes.

This disciplined 3-round approach typically recovers 15-20 marks lost to rushed end-of-test errors.`;
      suggestions = ['How does simulator evaluate speed?', 'Review weak concepts', 'Start Mock Test'];
      actionLinks = [
        { label: 'Launch Mock Test', page: 'mock-tests' }
      ];
    } else if (q.includes('kinematic') || q.includes('physics')) {
      reply = `In Kinematics, your demonstration performance is 78% accurate across 50 attempts (102s avg time).

Key Tips for JEE Advanced & Main:
1. When dealing with projectile motion on an inclined plane, always decompose acceleration along the incline (g sin θ) and perpendicular to the incline (g cos θ).
2. For relative velocity in 2D (such as rain-man or river-boat problems), draw vector velocity triangles first before setting up component equations.
3. Keep this topic fresh by solving 5 high-difficulty mixed questions weekly.`;
      suggestions = ['Test me on Kinematics', 'Review Rotational Motion', 'View Study Plan'];
      actionLinks = [
        { label: 'Take Physics Sectional', page: 'mock-tests' }
      ];
    } else {
      reply = `I understand your question regarding "${userText}".

Evaluating this against your active profile:
• **Latest Score**: ${currentScore}/300
• **Primary Bottleneck**: Mathematics accuracy (51%) and negative marking (-12 marks penalty in Maths alone).
• **Actionable Advice**: Dedicate your next study session to Definite Integration standard substitution rules and avoid unverified guesses on difficult multiple-choice questions.

Would you like to review related concept diagnostics or add a focused drill to your Study Planner?`;
      actionLinks = [
        { label: 'Inspect Weak Concepts', page: 'weak-concepts' },
        { label: 'Open Study Planner', page: 'study-planner' }
      ];
    }

    const coachMsg: ChatMessage = {
      id: `msg-coach-${Date.now() + 1}`,
      sender: 'coach',
      text: reply,
      timestamp: timeStr,
      contextTopic,
      actionSuggestions: suggestions,
      actionLinks
    };

    const current = this.getStored();
    const updated = [...current, userMsg, coachMsg];
    this.save(updated);

    return { userMsg, coachMsg };
  }

  async clearChat(): Promise<ChatMessage[]> {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(INITIAL_AI_CHAT_MESSAGES));
    return [...INITIAL_AI_CHAT_MESSAGES];
  }
}

class HybridAICoachService implements IAICoachService {
  private localService = new LocalAICoachService();

  async getMessages(): Promise<ChatMessage[]> {
    return this.localService.getMessages();
  }

  async sendMessage(userText: string, contextTopic?: string): Promise<{ userMsg: ChatMessage; coachMsg: ChatMessage }> {
    try {
      if (await apiClient.isBackendAvailable()) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMsg: ChatMessage = {
          id: `msg-user-${Date.now()}`,
          sender: 'student',
          text: userText,
          timestamp: timeStr,
          contextTopic
        };

        const res = await apiClient.sendCoachChat(userText, contextTopic);
        if (res && res.reply) {
          const coachMsg: ChatMessage = {
            id: `msg-coach-${Date.now() + 1}`,
            sender: 'coach',
            text: res.reply,
            timestamp: timeStr,
            contextTopic,
            actionSuggestions: res.actionSuggestions || [],
            actionLinks: res.actionLinks || []
          };

          const raw = localStorage.getItem(CHAT_STORAGE_KEY);
          const current: ChatMessage[] = raw ? JSON.parse(raw) : [...INITIAL_AI_CHAT_MESSAGES];
          const updated = [...current, userMsg, coachMsg];
          localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updated));

          return { userMsg, coachMsg };
        }
      }
    } catch (err) {
      console.warn('Backend coach chat failed, using local rule-based response:', err);
    }
    return this.localService.sendMessage(userText, contextTopic);
  }

  async clearChat(): Promise<ChatMessage[]> {
    return this.localService.clearChat();
  }
}

export const aiCoachService: IAICoachService = new HybridAICoachService();
