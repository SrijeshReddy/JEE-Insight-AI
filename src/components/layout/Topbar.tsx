import React, { useState } from 'react';
import { Menu, Play, Moon, Sun, Info, X, Database, Cpu, Brain, CheckCircle2 } from 'lucide-react';
import { NavPage } from './Sidebar';

interface TopbarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  onToggleMobileSidebar: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

const PAGE_TITLES: Record<NavPage, { title: string; subtitle: string }> = {
  landing: { title: 'JEE InsightAI', subtitle: 'Public Platform Overview' },
  overview: { title: 'Overview Dashboard', subtitle: 'Performance Intelligence & Preparation Trajectory' },
  'mock-tests': { title: 'Mock Tests Library', subtitle: 'Simulate, Practice & Benchmark' },
  results: { title: 'Diagnostic Examination Results', subtitle: 'Test Breakdown & Forensic Performance Insights' },
  analytics: { title: 'Performance Analytics', subtitle: 'Subject, Topic, and Difficulty Diagnostics' },
  'weak-concepts': { title: 'Weak Concepts Priority Matrix', subtitle: 'Evidence-Based Priority Focus Areas' },
  'study-planner': { title: 'Adaptive Study Planner', subtitle: 'Personalized Daily & Weekly Action Items' },
  'score-simulator': { title: 'Scenario Score Simulator', subtitle: 'Interactive What-If Scenario Exploration' },
  'ai-coach': { title: 'AI Performance Coach', subtitle: 'Interactive Pedagogical Guidance (Prototype Preview)' },
  history: { title: 'Progress History & Comparison', subtitle: 'Longitudinal Benchmark Tracking' },
  settings: { title: 'Profile & Settings', subtitle: 'Student Configuration & Study Parameters' }
};

export const Topbar: React.FC<TopbarProps> = ({
  currentPage,
  onNavigate,
  onToggleMobileSidebar,
  isDarkTheme,
  onToggleTheme
}) => {
  const [showTransparencyModal, setShowTransparencyModal] = useState<boolean>(false);
  const current = PAGE_TITLES[currentPage] || { title: 'JEE InsightAI', subtitle: '' };

  return (
    <>
      <header className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onToggleMobileSidebar}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '6px',
              color: 'var(--text-secondary)'
            }}
            className="mobile-only-btn"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {current.title}
              </h1>
              <button
                type="button"
                onClick={() => setShowTransparencyModal(true)}
                className="badge badge-default"
                style={{
                  fontSize: '10px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  border: '1px solid var(--border-default)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px'
                }}
                title="Click to view Stage 2 Architecture & Transparency details"
              >
                <Info size={11} color="var(--accent-blue)" />
                <span>Architecture & Demo Details</span>
              </button>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.2, marginTop: '1px' }}>
              {current.subtitle}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {currentPage !== 'mock-tests' && currentPage !== 'results' && (
            <button
              onClick={() => onNavigate('mock-tests')}
              className="btn btn-primary btn-sm"
              style={{ gap: '5px' }}
            >
              <Play size={13} fill="currentColor" />
              <span>Take Mock Test</span>
            </button>
          )}

          <button
            onClick={onToggleTheme}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 8px', color: 'var(--text-secondary)' }}
            title={isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme"
          >
            {isDarkTheme ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </header>

      {/* Platform Architecture & Transparency Modal */}
      {showTransparencyModal && (
        <div className="modal-backdrop" onClick={() => setShowTransparencyModal(false)}>
          <div
            className="modal-container"
            style={{ maxWidth: '640px' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--accent-blue-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Cpu size={18} color="var(--accent-blue)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>
                    Platform Architecture & Transparency
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                    JEE InsightAI Stage 2 — Frontend Functional Specification
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTransparencyModal(false)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px 6px' }}
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px', lineHeight: 1.5 }}>
              <div
                style={{
                  padding: '14px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-default)'
                }}
              >
                <h4 style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 6px 0' }}>
                  <Database size={15} color="var(--accent-blue)" />
                  <span>State Management & Browser Storage</span>
                </h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                  This application executes as a fully functional, self-contained single-page application.
                  All submitted mock examinations, newly generated study tasks, simulator configurations, and profile preferences
                  are persisted locally in browser storage via centralized service contracts (<code>src/services/*</code>).
                </p>
              </div>

              <div
                style={{
                  padding: '14px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-default)'
                }}
              >
                <h4 style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 6px 0' }}>
                  <Brain size={15} color="var(--accent-teal)" />
                  <span>Transparent Intelligence & Heuristic Rules</span>
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>
                    <strong>Scoring Engine:</strong> Calculates authentic scores (+4 for correct, -1 for incorrect, 0 for unattempted) directly from user selections.
                  </li>
                  <li>
                    <strong>Weak Concepts:</strong> Prioritized using deterministic thresholds (topics with &le; 55% accuracy across &ge; 5 attempts).
                  </li>
                  <li>
                    <strong>Score Simulator:</strong> Powered by transparent linear arithmetic, clearly disclaimed from machine-learning regression.
                  </li>
                  <li>
                    <strong>AI Coach:</strong> Interactive conversational dialogue matching pedagogical intent with dynamic action shortcuts.
                  </li>
                </ul>
              </div>

              <div
                style={{
                  padding: '14px',
                  backgroundColor: 'var(--success-bg)',
                  borderRadius: '8px',
                  border: '1px solid var(--success-border)'
                }}
              >
                <h4 style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 6px 0', color: 'var(--success)' }}>
                  <CheckCircle2 size={15} />
                  <span>Stage 3 Backend & Model Readiness</span>
                </h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                  Service layers in <code>src/services/</code> have been designed with asynchronous, decoupled interfaces
                  to seamlessly swap local browser storage for FastAPI REST endpoints and PostgreSQL/SQLite persistence in Stage 3.
                </p>
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowTransparencyModal(false)}
                className="btn btn-primary btn-sm"
              >
                Understood, Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
