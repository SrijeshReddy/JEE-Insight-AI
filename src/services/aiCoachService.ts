import { ChatMessage } from '../types';
import { INITIAL_AI_CHAT_MESSAGES, AI_KNOWLEDGE_BASE } from '../data/demoData';

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

    // Rule-based demonstration responder simulating pedagogical AI coach
    const q = userText.toLowerCase();
    let reply = '';
    let suggestions: string[] = [
      'Explain my mistakes in Mock 8',
      'Help me understand Integration',
      'Create a seven-day revision plan'
    ];

    if (q.includes('score') || q.includes('why') || q.includes('change')) {
      reply = AI_KNOWLEDGE_BASE.score_change.reply;
      suggestions = AI_KNOWLEDGE_BASE.score_change.suggestions || suggestions;
    } else if (q.includes('integration') || q.includes('integral') || q.includes('calculus')) {
      reply = AI_KNOWLEDGE_BASE.integration.reply;
      suggestions = AI_KNOWLEDGE_BASE.integration.suggestions || suggestions;
    } else if (q.includes('mistake') || q.includes('mock 8') || q.includes('error') || q.includes('wrong')) {
      reply = AI_KNOWLEDGE_BASE.mistakes_mock8.reply;
      suggestions = AI_KNOWLEDGE_BASE.mistakes_mock8.suggestions || suggestions;
    } else if (q.includes('plan') || q.includes('seven') || q.includes('schedule') || q.includes('week') || q.includes('revision')) {
      reply = AI_KNOWLEDGE_BASE.seven_day_plan.reply;
      suggestions = AI_KNOWLEDGE_BASE.seven_day_plan.suggestions || suggestions;
    } else if (q.includes('time') || q.includes('speed') || q.includes('strategy') || q.includes('manage')) {
      reply = AI_KNOWLEDGE_BASE.time_management.reply;
      suggestions = AI_KNOWLEDGE_BASE.time_management.suggestions || suggestions;
    } else if (q.includes('kinematic') || q.includes('physics')) {
      reply = `In Kinematics, your demonstration performance is 78% accurate across 50 attempts (102s avg time).

Key Tips for JEE Advanced & Main:
1. When dealing with projectile motion on an inclined plane, always decompose acceleration along the incline (g sin θ) and perpendicular to the incline (g cos θ).
2. For relative velocity in 2D (such as rain-man or river-boat problems), draw vector velocity triangles first before setting up component equations.
3. Keep this topic fresh by solving 5 high-difficulty mixed questions weekly.`;
      suggestions: ['Test me on Kinematics', 'Review Rotational Motion', 'View Study Plan'];
    } else {
      reply = `I understand you are asking about: "${userText}".

In this prototype demonstration mode, I evaluate your question against your centralized profile:
• **Current Mock Score**: 112/300 (Mock #8)
• **Primary Bottleneck**: Mathematics accuracy (51%) and negative marking (-12 marks penalty in Maths alone).
• **Actionable Advice**: Focus your next 48 hours on Definite Integration standard substitution rules and avoid unverified guesses in multi-choice questions.

Would you like to explore a detailed drill or simulate how improving this topic impacts your score?`;
    }

    const coachMsg: ChatMessage = {
      id: `msg-coach-${Date.now() + 1}`,
      sender: 'coach',
      text: reply,
      timestamp: timeStr,
      contextTopic,
      actionSuggestions: suggestions
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

export const aiCoachService: IAICoachService = new LocalAICoachService();
