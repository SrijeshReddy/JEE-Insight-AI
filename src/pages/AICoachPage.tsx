import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  RotateCcw,
  User,
  Clock,
  BookOpen,
  ArrowRight,
  Lightbulb,
  MessageSquare,
  Compass,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { ChatMessage } from '../types';
import { aiCoachService } from '../services/aiCoachService';
import { NavPage } from '../components/layout/Sidebar';

interface AICoachPageProps {
  onNavigate: (page: NavPage, topicContext?: string) => void;
  initialTopicContext?: string;
}

export const AICoachPage: React.FC<AICoachPageProps> = ({
  onNavigate,
  initialTopicContext
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [topicContext, setTopicContext] = useState<string | undefined>(initialTopicContext);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const promptChips = [
    'Explain why my score changed',
    'Help me understand Integration',
    'Explain my mistakes in Mock 8',
    'Create a seven-day revision plan',
    'Give me practice questions on Kinematics',
    'Suggest a time-management strategy'
  ];

  const loadMessages = async () => {
    const list = await aiCoachService.getMessages();
    setMessages(list);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputVal.trim();
    if (!text) return;

    setInputVal('');
    setIsTyping(true);

    // Add user message optimistically
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender: 'student',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextTopic: topicContext
    };
    setMessages(prev => [...prev, tempUserMsg]);

    // Simulate realistic pedagogical reasoning delay (600ms)
    setTimeout(async () => {
      const { coachMsg } = await aiCoachService.sendMessage(text, topicContext);
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== tempUserMsg.id);
        return [...filtered, tempUserMsg, coachMsg];
      });
      setIsTyping(false);
    }, 600);
  };

  const handleClear = async () => {
    const fresh = await aiCoachService.clearChat();
    setMessages(fresh);
    setTopicContext(undefined);
  };

  return (
    <div className="page-container" style={{ maxWidth: '1000px' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '20px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              AI Performance Coach
            </h2>
            <span className="badge badge-blue">Demonstration Tutor</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Pedagogical feedback, error diagnosis, and study strategy guidance tailored to your mock data.
          </p>
        </div>

        <button
          onClick={handleClear}
          className="btn btn-secondary btn-sm"
          style={{ gap: '6px' }}
        >
          <RotateCcw size={14} />
          <span>Reset Conversation</span>
        </button>
      </div>

      {/* Topic Context Pill (if active) */}
      {topicContext && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 14px',
            backgroundColor: 'var(--accent-blue-light)',
            border: '1px solid var(--accent-blue-border)',
            borderRadius: '6px',
            fontSize: '12px',
            color: 'var(--accent-blue)',
            marginBottom: '16px'
          }}
        >
          <span>Active Context: <strong>{topicContext}</strong></span>
          <button
            onClick={() => setTopicContext(undefined)}
            style={{ color: 'var(--text-muted)', fontSize: '11px', textDecoration: 'underline' }}
          >
            Clear Context
          </button>
        </div>
      )}

      {/* Chat Container */}
      <div
        className="card"
        style={{
          height: '520px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          marginBottom: '16px'
        }}
      >
        {/* Messages Scroll Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          {messages.map(msg => {
            const isCoach = msg.sender === 'coach';

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  flexDirection: isCoach ? 'row' : 'row-reverse'
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: isCoach ? 'var(--accent-primary)' : '#e2e8f0',
                    color: isCoach ? '#ffffff' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {isCoach ? <Bot size={18} /> : <User size={18} />}
                </div>

                {/* Message Bubble */}
                <div style={{ maxWidth: '82%' }}>
                  <div
                    style={{
                      padding: '14px 18px',
                      borderRadius: '8px',
                      backgroundColor: isCoach ? 'var(--bg-surface)' : 'var(--accent-blue)',
                      color: isCoach ? 'var(--text-primary)' : '#ffffff',
                      border: isCoach ? '1px solid var(--border-default)' : 'none',
                      fontSize: '13px',
                      lineHeight: 1.6,
                      boxShadow: 'var(--shadow-xs)'
                    }}
                  >
                    <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>

                    {/* Interactive Action Links inside coach message */}
                    {isCoach && msg.actionLinks && msg.actionLinks.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-default)' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
                          Recommended Actions:
                        </span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {msg.actionLinks.map((link, idx) => (
                            <button
                              key={idx}
                              onClick={() => onNavigate(link.page, link.context)}
                              className="btn btn-secondary btn-sm"
                              style={{
                                fontSize: '11px',
                                padding: '4px 10px',
                                gap: '4px',
                                color: 'var(--accent-blue)',
                                borderColor: 'var(--accent-blue-border)',
                                backgroundColor: 'var(--accent-blue-light)'
                              }}
                            >
                              <span>{link.label}</span>
                              <ExternalLink size={12} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      marginTop: '4px',
                      justifyContent: isCoach ? 'flex-start' : 'flex-end'
                    }}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.contextTopic && <span>• Context: {msg.contextTopic}</span>}
                  </div>

                  {/* Suggestion follow-up prompt buttons */}
                  {isCoach && msg.actionSuggestions && msg.actionSuggestions.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {msg.actionSuggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          className="btn btn-secondary btn-sm"
                          style={{
                            fontSize: '11px',
                            padding: '3px 8px',
                            backgroundColor: 'var(--bg-surface-subtle)',
                            borderColor: 'var(--border-default)'
                          }}
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bot size={18} />
              </div>
              <div
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-default)',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Analyzing student mock diagnostics & performance patterns...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--border-default)',
            backgroundColor: 'var(--bg-surface)'
          }}
        >
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            style={{ display: 'flex', gap: '10px' }}
          >
            <input
              type="text"
              placeholder="Ask AI Coach (e.g., 'How to improve Integration?' or 'Analyze my Mock 8 mistakes')..."
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              className="input-control"
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="btn btn-primary"
              style={{ padding: '8px 18px', gap: '6px' }}
            >
              <span>Send</span>
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Lightbulb size={14} />
          <span>Recommended Discussion Prompts:</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
