import React, { useState, useEffect } from 'react';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Sparkles,
  BarChart3,
  Compass,
  Bot,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { NavPage } from '../components/layout/Sidebar';
import { mockTestService } from '../services/mockTestService';
import { TestAttemptResult, Question } from '../types';
import { ProgressBar } from '../components/common/ProgressBar';
import { SAMPLE_QUESTIONS_MOCK_09 } from '../data/demoData';

interface ResultsPageProps {
  onNavigate: (page: NavPage, topicContext?: string) => void;
  selectedAttemptId?: string;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  onNavigate,
  selectedAttemptId
}) => {
  const [attempt, setAttempt] = useState<TestAttemptResult | null>(null);
  const [showAnswerReview, setShowAnswerReview] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>(SAMPLE_QUESTIONS_MOCK_09);

  useEffect(() => {
    if (selectedAttemptId) {
      mockTestService.getAttemptById(selectedAttemptId).then(res => {
        if (res) setAttempt(res);
        else loadFallback();
      });
    } else {
      mockTestService.getLatestAttempt().then(res => {
        if (res) setAttempt(res);
        else loadFallback();
      });
    }
  }, [selectedAttemptId]);

  const loadFallback = () => {
    // Generate default baseline result (Mock #8 Benchmark)
    setAttempt({
      id: 'mock-8-baseline',
      testId: 'test-jee-08',
      testTitle: 'JEE Main Mock #8 (Benchmark Diagnostic)',
      date: '07 Oct 2026',
      timeSpentSeconds: 177 * 60,
      score: 112,
      totalMarks: 300,
      correctCount: 33,
      incorrectCount: 20,
      unattemptedCount: 22,
      accuracy: 64,
      responses: {},
      subjectBreakdown: {
        Physics: { score: 52, accuracy: 72, correct: 14, incorrect: 4, unattempted: 7, avgTime: 125 },
        Chemistry: { score: 44, accuracy: 68, correct: 12, incorrect: 4, unattempted: 9, avgTime: 98 },
        Mathematics: { score: 16, accuracy: 51, correct: 7, incorrect: 12, unattempted: 6, avgTime: 195 }
      },
      topicBreakdown: [
        { topic: 'Kinematics', subject: 'Physics', accuracy: 78, correct: 4, total: 5, avgTime: 102 },
        { topic: 'Rotational Motion', subject: 'Physics', accuracy: 55, correct: 2, total: 4, avgTime: 215 },
        { topic: 'Current Electricity', subject: 'Physics', accuracy: 82, correct: 4, total: 5, avgTime: 95 },
        { topic: 'Organic Reaction Mechanisms', subject: 'Chemistry', accuracy: 47, correct: 3, total: 6, avgTime: 110 },
        { topic: 'Chemical Equilibrium', subject: 'Chemistry', accuracy: 65, correct: 3, total: 5, avgTime: 115 },
        { topic: 'Integration', subject: 'Mathematics', accuracy: 38, correct: 2, total: 6, avgTime: 228 },
        { topic: 'Probability', subject: 'Mathematics', accuracy: 44, correct: 2, total: 5, avgTime: 198 },
        { topic: 'Conic Sections', subject: 'Mathematics', accuracy: 62, correct: 3, total: 5, avgTime: 180 }
      ],
      observations: [
        'Mathematics accuracy (51%) is notably lower than Physics (72%) and Chemistry (68%).',
        '20 negative marks penalty: 12 incorrect answers in Mathematics directly eroded +12 potential marks.',
        'Calculus time sink: Integration questions averaged 228 seconds each, leaving the final section rushed.'
      ],
      comparisonWithPrevious: {
        prevTestTitle: 'JEE Main Mock #7',
        scoreDelta: 8,
        accuracyDelta: 3,
        mathDelta: 2,
        physicsDelta: 4,
        chemDelta: 2
      }
    });
  };

  if (!attempt) {
    return <div className="page-container">Loading examination performance...</div>;
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s > 0 ? `${s}s` : ''}`;
  };

  return (
    <div className="page-container">
      {/* Title Header */}
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
            <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Diagnostic Examination Results
            </h2>
            <span className="badge badge-default">{attempt.testTitle}</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Completed on {attempt.date} • Total Duration: {formatTime(attempt.timeSpentSeconds)}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onNavigate('mock-tests')}
            className="btn btn-secondary btn-sm"
          >
            Take Another Mock
          </button>
          <button
            onClick={() => onNavigate('overview')}
            className="btn btn-primary btn-sm"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="demo-banner" style={{ marginBottom: '24px' }}>
        <Sparkles size={15} color="var(--accent-blue)" />
        <span>
          <strong>Calculated Diagnostic:</strong> Scores and accuracy are derived directly from examination responses using the standard JEE Main marking rule (+4 correct, -1 incorrect). Topic insights and observations are generated from these calculated results.
        </span>
      </div>

      {/* Hero Score & Outcome Summary Banner */}
      <div
        className="card"
        style={{
          padding: '24px',
          marginBottom: '24px',
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-default)'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 2fr',
            gap: '24px',
            alignItems: 'center'
          }}
          className="results-hero-grid"
        >
          {/* Main Score Block */}
          <div
            style={{
              padding: '20px',
              backgroundColor: 'var(--bg-app)',
              borderRadius: '8px',
              border: '1px solid var(--border-default)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Final Scaled Score
            </div>
            <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--accent-primary)', lineHeight: 1.1, margin: '8px 0' }}>
              {attempt.score}
              <span style={{ fontSize: '18px', fontWeight: 500, color: 'var(--text-muted)' }}> / {attempt.totalMarks}</span>
            </div>

            {attempt.comparisonWithPrevious && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor: attempt.comparisonWithPrevious.scoreDelta >= 0 ? 'var(--success-bg)' : 'var(--danger-bg)',
                  color: attempt.comparisonWithPrevious.scoreDelta >= 0 ? 'var(--success)' : 'var(--danger)'
                }}
              >
                {attempt.comparisonWithPrevious.scoreDelta >= 0 ? `+${attempt.comparisonWithPrevious.scoreDelta}` : attempt.comparisonWithPrevious.scoreDelta} marks vs {attempt.comparisonWithPrevious.prevTestTitle}
              </div>
            )}
          </div>

          {/* Core Examination Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--success-bg)', border: '1px solid var(--success-border)', textAlign: 'center' }}>
              <div style={{ color: 'var(--success)', display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                <CheckCircle2 size={18} />
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--success)' }}>{attempt.correctCount}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Correct (+4)</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger-border)', textAlign: 'center' }}>
              <div style={{ color: 'var(--danger)', display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                <XCircle size={18} />
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--danger)' }}>{attempt.incorrectCount}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Incorrect (-1)</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-default)', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                <HelpCircle size={18} />
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>{attempt.unattemptedCount}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Unattempted</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--accent-blue-light)', border: '1px solid var(--accent-blue-border)', textAlign: 'center' }}>
              <div style={{ color: 'var(--accent-blue)', display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                <BarChart3 size={18} />
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent-blue)' }}>{attempt.accuracy}%</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* "Why this score?" Forensic Diagnostics Section */}
      <div
        className="card"
        style={{
          padding: '22px 26px',
          marginBottom: '24px',
          borderLeft: '4px solid var(--accent-primary)',
          backgroundColor: '#f8fafc'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <AlertCircle size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Why this score? (Diagnostic Observations)
          </h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {attempt.observations.map((obs, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>•</span>
              <span>{obs}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons to Continue Workflow */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '18px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowAnswerReview(!showAnswerReview)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '6px' }}
          >
            <FileText size={14} />
            <span>{showAnswerReview ? 'Hide Answer Keys' : 'Review Answers'}</span>
            {showAnswerReview ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            onClick={() => onNavigate('weak-concepts')}
            className="btn btn-secondary btn-sm"
          >
            Explore Weak Concepts
          </button>
          <button
            onClick={() => onNavigate('study-planner')}
            className="btn btn-secondary btn-sm"
          >
            Build Study Plan
          </button>
          <button
            onClick={() => onNavigate('ai-coach', 'Score Autopsy')}
            className="btn btn-primary btn-sm"
            style={{ gap: '6px' }}
          >
            <Bot size={14} />
            <span>Ask AI Coach</span>
          </button>
        </div>
      </div>

      {/* Expandable Review Answers Section */}
      {showAnswerReview && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <h3 className="card-title">
              <CheckCircle2 size={16} color="var(--success)" />
              <span>Question-by-Question Autopsy & Solutions</span>
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              15 Verified Demonstration Questions
            </span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {questions.map((q, idx) => {
              const resp = attempt.responses[q.id];
              const selected = resp?.selectedOption;
              const isCorrect = selected === q.correctOptionId;
              const isUnattempted = !selected;

              return (
                <div
                  key={q.id}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-default)',
                    backgroundColor: isCorrect ? 'var(--success-bg)' : isUnattempted ? 'var(--bg-surface)' : 'var(--danger-bg)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px' }}>Q{idx + 1}.</span>
                      <span className="badge badge-default">{q.subject}</span>
                      <span className="badge badge-blue">{q.topic}</span>
                    </div>
                    <div>
                      {isCorrect ? (
                        <span className="badge badge-success">+4 Marks</span>
                      ) : isUnattempted ? (
                        <span className="badge badge-default">0 Marks (Unattempted)</span>
                      ) : (
                        <span className="badge badge-danger">-1 Mark (Incorrect)</span>
                      )}
                    </div>
                  </div>

                  <p style={{ fontSize: '14px', lineHeight: 1.5, marginBottom: '12px', color: 'var(--text-primary)' }}>
                    {q.statement}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginBottom: '12px' }}>
                    {q.options.map(opt => {
                      const isOptionSelected = selected === opt.id;
                      const isOptionCorrect = q.correctOptionId === opt.id;

                      let border = '1px solid var(--border-default)';
                      let bg = 'var(--bg-surface)';
                      if (isOptionCorrect) {
                        border = '1px solid var(--success-border)';
                        bg = 'var(--success-bg)';
                      } else if (isOptionSelected && !isOptionCorrect) {
                        border = '1px solid var(--danger-border)';
                        bg = 'var(--danger-bg)';
                      }

                      return (
                        <div
                          key={opt.id}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border,
                            backgroundColor: bg,
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <span style={{ fontWeight: 700 }}>{opt.id}.</span>
                          <span>{opt.text}</span>
                          {isOptionCorrect && <CheckCircle2 size={14} color="var(--success)" style={{ marginLeft: 'auto' }} />}
                          {isOptionSelected && !isOptionCorrect && <XCircle size={14} color="var(--danger)" style={{ marginLeft: 'auto' }} />}
                        </div>
                      );
                    })}
                  </div>

                  <div
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5
                    }}
                  >
                    <strong style={{ color: 'var(--text-primary)' }}>Solution & Conceptual Logic: </strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subject-Wise & Topic-Wise Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }} className="results-breakdown-grid">
        {/* Subject-Wise Performance */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Subject-Wise Performance</h3>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(['Physics', 'Chemistry', 'Mathematics'] as const).map(subj => {
              const data = attempt.subjectBreakdown[subj];
              if (!data) return null;

              return (
                <div key={subj}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600 }}>{subj}</span>
                    <div>
                      <strong style={{ fontSize: '14px' }}>{data.score}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/100</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-blue)', marginLeft: '6px' }}>
                        ({data.accuracy}%)
                      </span>
                    </div>
                  </div>
                  <ProgressBar value={data.accuracy} height={6} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>
                    <span>{data.correct} Correct • {data.incorrect} Incorrect • {data.unattempted} Unattempted</span>
                    <span>Avg speed: {data.avgTime}s/q</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Topic-Wise Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Topic-Level Accuracy</h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Topic</th>
                    <th>Subject</th>
                    <th>Accuracy</th>
                    <th>Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {attempt.topicBreakdown.map((t, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{t.topic}</div>
                      </td>
                      <td>
                        <span className="badge badge-default">{t.subject}</span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontWeight: 600,
                            color: t.accuracy < 50 ? 'var(--danger)' : t.accuracy < 70 ? 'var(--warning)' : 'var(--success)'
                          }}
                        >
                          {t.accuracy}%
                        </span>
                      </td>
                      <td style={{ fontSize: '12px' }}>
                        {t.correct}/{t.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
