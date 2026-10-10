import React, { useState, useEffect } from 'react';
import {
  Play,
  Clock,
  HelpCircle,
  Filter,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  BarChart,
  BookOpen,
  Send
} from 'lucide-react';
import { MockTestSummary, Question, QuestionResponse, Difficulty, TestType } from '../types';
import { mockTestService } from '../services/mockTestService';
import { Modal } from '../components/common/Modal';
import { NavPage } from '../components/layout/Sidebar';

interface MockTestsPageProps {
  onNavigate: (page: NavPage) => void;
  onTestSubmitted?: (attemptId: string) => void;
}

export const MockTestsPage: React.FC<MockTestsPageProps> = ({
  onNavigate,
  onTestSubmitted
}) => {
  const [tests, setTests] = useState<MockTestSummary[]>([]);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Active Test State
  const [activeTest, setActiveTest] = useState<MockTestSummary | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [responses, setResponses] = useState<Record<string, QuestionResponse>>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(1800); // 30 mins demo
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0]));
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    mockTestService.getAllTests().then(data => setTests(data));
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!activeTest || !isTimerRunning) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTest, isTimerRunning]);

  const handleStartTest = async (test: MockTestSummary) => {
    const qs = await mockTestService.getTestQuestions(test.id);
    setQuestions(qs);
    setActiveTest(test);
    setCurrentIndex(0);
    setVisitedQuestions(new Set([0]));
    setTimerSeconds(test.durationMinutes * 60);
    setIsTimerRunning(true);

    // Initialize empty responses
    const initialResp: Record<string, QuestionResponse> = {};
    qs.forEach(q => {
      initialResp[q.id] = {
        selectedOption: null,
        markedForReview: false,
        timeSpentSeconds: 0
      };
    });
    setResponses(initialResp);
  };

  const handleSelectOption = (optionId: string) => {
    if (!questions[currentIndex]) return;
    const qId = questions[currentIndex].id;
    setResponses(prev => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        selectedOption: optionId
      }
    }));
  };

  const handleClearResponse = () => {
    if (!questions[currentIndex]) return;
    const qId = questions[currentIndex].id;
    setResponses(prev => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        selectedOption: null
      }
    }));
  };

  const handleToggleMarkForReview = () => {
    if (!questions[currentIndex]) return;
    const qId = questions[currentIndex].id;
    setResponses(prev => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        markedForReview: !prev[qId]?.markedForReview
      }
    }));
  };

  const handleNavigateQuestion = (targetIndex: number) => {
    if (targetIndex >= 0 && targetIndex < questions.length) {
      setCurrentIndex(targetIndex);
      setVisitedQuestions(prev => new Set(prev).add(targetIndex));
    }
  };

  const handleSubmitTest = async () => {
    if (!activeTest) return;
    setIsSubmitting(true);
    const timeSpent = activeTest.durationMinutes * 60 - timerSeconds;
    const result = await mockTestService.submitTest(activeTest.id, responses, Math.max(30, timeSpent));
    setIsSubmitting(false);
    setShowSubmitModal(false);
    setActiveTest(null);

    if (onTestSubmitted) {
      onTestSubmitted(result.id);
    }
    onNavigate('results');
  };

  // Filtered Tests Library
  const filteredTests = tests.filter(t => {
    if (selectedType !== 'All' && t.type !== selectedType) return false;
    if (selectedDifficulty !== 'All' && t.difficulty !== selectedDifficulty) return false;
    return true;
  });

  // Calculate palette status
  const getQuestionStatus = (index: number) => {
    const q = questions[index];
    if (!q) return 'not-visited';
    const resp = responses[q.id];
    const isVisited = visitedQuestions.has(index);

    if (resp?.markedForReview && resp?.selectedOption) return 'answered-marked';
    if (resp?.markedForReview) return 'marked';
    if (resp?.selectedOption) return 'answered';
    if (isVisited) return 'not-answered';
    return 'not-visited';
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Counts for active test summary
  const answeredCount = Object.values(responses).filter(r => r.selectedOption !== null).length;
  const markedCount = Object.values(responses).filter(r => r.markedForReview).length;
  const notAnsweredCount = questions.length - answeredCount;

  // Render Full Screen / Modal Test Taking Interface if active
  if (activeTest) {
    const currentQ = questions[currentIndex];
    const currentResp = currentQ ? responses[currentQ.id] : null;

    return (
      <div style={{ backgroundColor: 'var(--bg-app)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Test Header */}
        <header
          style={{
            height: '56px',
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-default)',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 30
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>{activeTest.title}</span>
            <span className="badge badge-default" style={{ fontSize: '11px' }}>
              Section: {currentQ?.subject || 'All Subjects'}
            </span>
            <span className="badge badge-blue" style={{ fontSize: '10px' }}>
              Standard Marking (+4, -1)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Live Timer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                backgroundColor: timerSeconds < 300 ? 'var(--danger-bg)' : 'var(--bg-surface-subtle)',
                border: `1px solid ${timerSeconds < 300 ? 'var(--danger-border)' : 'var(--border-default)'}`,
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                fontSize: '15px',
                color: timerSeconds < 300 ? 'var(--danger)' : 'var(--text-primary)'
              }}
            >
              <Clock size={16} />
              <span>{formatTimer(timerSeconds)}</span>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="btn btn-primary btn-sm"
              style={{ padding: '7px 16px', gap: '6px' }}
            >
              <Send size={14} />
              <span>Submit Test</span>
            </button>
          </div>
        </header>

        {/* Main Test Screen Body */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 320px', minHeight: 0 }} className="test-interface-grid">
          {/* Left: Question Area */}
          <div style={{ padding: '24px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {currentQ && (
              <>
                {/* Question Info Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '14px',
                    borderBottom: '1px solid var(--border-default)',
                    marginBottom: '20px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Question {currentIndex + 1} of {questions.length}
                    </span>
                    <span className="badge badge-default">{currentQ.subject}</span>
                    <span className="badge badge-blue">{currentQ.topic}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Marks: <strong style={{ color: 'var(--success)' }}>+4</strong> / <strong style={{ color: 'var(--danger)' }}>-1</strong>
                  </div>
                </div>

                {/* Question Statement */}
                <div
                  style={{
                    fontSize: '15px',
                    lineHeight: 1.6,
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-surface)',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-default)',
                    marginBottom: '24px'
                  }}
                >
                  {currentQ.statement}
                </div>

                {/* Multiple Choice Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                  {currentQ.options.map(opt => {
                    const isSelected = currentResp?.selectedOption === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          padding: '14px 18px',
                          borderRadius: '8px',
                          border: `1px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-default)'}`,
                          backgroundColor: isSelected ? 'var(--accent-blue-light)' : 'var(--bg-surface)',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: `2px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-strong)'}`,
                            backgroundColor: isSelected ? 'var(--accent-blue)' : 'transparent',
                            color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 700,
                            flexShrink: 0
                          }}
                        >
                          {opt.id}
                        </div>
                        <span style={{ fontSize: '14px', color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isSelected ? 500 : 400 }}>
                          {opt.text}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Navigation & Action Buttons */}
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '20px',
                    borderTop: '1px solid var(--border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={handleToggleMarkForReview}
                      className={`btn ${currentResp?.markedForReview ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{ gap: '6px' }}
                    >
                      <Bookmark size={14} />
                      <span>{currentResp?.markedForReview ? 'Marked for Review' : 'Mark for Review'}</span>
                    </button>
                    {currentResp?.selectedOption && (
                      <button
                        onClick={handleClearResponse}
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--danger)', gap: '6px' }}
                      >
                        <RotateCcw size={13} />
                        <span>Clear Response</span>
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleNavigateQuestion(currentIndex - 1)}
                      disabled={currentIndex === 0}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '6px', opacity: currentIndex === 0 ? 0.5 : 1 }}
                    >
                      <ChevronLeft size={15} />
                      <span>Previous</span>
                    </button>
                    <button
                      onClick={() => handleNavigateQuestion(currentIndex + 1)}
                      disabled={currentIndex === questions.length - 1}
                      className="btn btn-primary btn-sm"
                      style={{ gap: '6px' }}
                    >
                      <span>Save & Next</span>
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right: Question Palette & Overview Sidebar */}
          <aside
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderLeft: '1px solid var(--border-default)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              overflowY: 'auto'
            }}
          >
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>Question Palette</h4>
              {/* Legend */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#16a34a' }} />
                  <span>Answered ({answeredCount})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#dc2626' }} />
                  <span>Not Answered</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#7c3aed' }} />
                  <span>Review ({markedCount})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#94a3b8' }} />
                  <span>Not Visited</span>
                </div>
              </div>

              {/* Palette Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                {questions.map((q, idx) => {
                  const status = getQuestionStatus(idx);
                  const isCurrent = idx === currentIndex;

                  let bgColor = '#cbd5e1'; // not visited
                  let textColor = '#334155';

                  if (status === 'answered') {
                    bgColor = '#16a34a';
                    textColor = '#ffffff';
                  } else if (status === 'not-answered') {
                    bgColor = '#dc2626';
                    textColor = '#ffffff';
                  } else if (status === 'marked' || status === 'answered-marked') {
                    bgColor = '#7c3aed';
                    textColor = '#ffffff';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => handleNavigateQuestion(idx)}
                      style={{
                        height: '38px',
                        borderRadius: '6px',
                        backgroundColor: bgColor,
                        color: textColor,
                        fontWeight: 600,
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        outline: isCurrent ? '2px solid var(--accent-blue)' : 'none',
                        outlineOffset: '2px',
                        transition: 'transform var(--transition-fast)'
                      }}
                      title={`Question ${idx + 1} (${status})`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Test Summary Box */}
            <div
              style={{
                marginTop: 'auto',
                padding: '14px',
                backgroundColor: 'var(--bg-surface-subtle)',
                borderRadius: '8px',
                border: '1px solid var(--border-default)',
                fontSize: '12px'
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '6px' }}>Section Breakdown:</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                <span>Physics (Q1 - Q5)</span>
                <span>5 Questions</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                <span>Chemistry (Q6 - Q10)</span>
                <span>5 Questions</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Mathematics (Q11 - Q15)</span>
                <span>5 Questions</span>
              </div>
            </div>
          </aside>
        </div>

        {/* Submit Confirmation Modal */}
        <Modal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          title="Submit Mock Examination"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Are you sure you want to finish and submit your mock examination? Once submitted, your automated performance diagnostic will be generated.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                backgroundColor: 'var(--bg-surface-subtle)',
                padding: '14px',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Answered</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--success)' }}>{answeredCount}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Unanswered</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--danger)' }}>{notAnsweredCount}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Marked Review</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#7c3aed' }}>{markedCount}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Return to Test
              </button>
              <button
                onClick={handleSubmitTest}
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Calculating Diagnostics...' : 'Yes, Submit Test'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // Standard Test Library View
  return (
    <div className="page-container">
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Mock Tests & Sectional Assessments
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Take simulated CBT tests to generate empirical performance intelligence and diagnose topic mastery.
        </p>
      </div>

      {/* Demo Banner */}
      <div className="demo-banner" style={{ marginBottom: '24px' }}>
        <Sparkles size={15} color="var(--accent-blue)" />
        <span>
          <strong>Interactive Test Engine:</strong> Launch <em>JEE Main Mock #9</em> to test the complete live question palette, countdown timer, question-to-question navigation, and instant forensic scoring calculation.
        </span>
      </div>

      {/* Filter Bar */}
      <div
        className="card"
        style={{
          padding: '14px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={14} /> Filter Type:
          </span>
          {['All', 'Full-Length', 'Subject', 'Chapter'].map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`btn btn-sm ${selectedType === t ? 'btn-primary' : 'btn-secondary'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
            Difficulty:
          </span>
          <select
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value)}
            className="select-control"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Challenging">Challenging</option>
          </select>
        </div>
      </div>

      {/* Test Library Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredTests.map(test => {
          const isInteractiveDemo = test.id === 'test-jee-09';

          return (
            <div
              key={test.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '22px',
                border: isInteractiveDemo ? '1.5px solid var(--accent-blue)' : '1px solid var(--border-default)',
                position: 'relative'
              }}
            >
              {isInteractiveDemo && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '16px',
                    backgroundColor: 'var(--accent-blue)',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  Featured Interactive Simulation
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span className="badge badge-default">{test.type}</span>
                  <span
                    className={`badge ${
                      test.difficulty === 'Challenging' ? 'badge-danger' : test.difficulty === 'Moderate' ? 'badge-warning' : 'badge-success'
                    }`}
                  >
                    {test.difficulty}
                  </span>
                  {test.lastScore !== undefined && (
                    <span className="badge badge-blue">
                      Attempted ({test.lastScore}/300)
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.3 }}>
                  {test.title}
                </h3>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {test.description}
                </p>
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    marginBottom: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <HelpCircle size={14} color="var(--text-muted)" />
                    <span>{test.questionsCount} Questions</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="var(--text-muted)" />
                    <span>{test.durationMinutes} Minutes</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleStartTest(test)}
                    className="btn btn-primary"
                    style={{ flex: 1, gap: '6px' }}
                  >
                    <Play size={14} fill="currentColor" />
                    <span>{test.status === 'Attempted' ? 'Re-attempt Test' : 'Start Test'}</span>
                  </button>
                  {test.status === 'Attempted' && (
                    <button
                      onClick={() => onNavigate('results')}
                      className="btn btn-secondary"
                      style={{ padding: '8px 12px' }}
                      title="Review previous diagnostic results"
                    >
                      <BarChart size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
