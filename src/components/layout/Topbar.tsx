import React from 'react';
import { Menu, Play, Sparkles, Moon, Sun, Info } from 'lucide-react';
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
  const current = PAGE_TITLES[currentPage] || { title: 'JEE InsightAI', subtitle: '' };

  return (
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
            <span
              className="badge badge-default"
              style={{ fontSize: '10px', backgroundColor: 'var(--bg-surface-subtle)', color: 'var(--text-muted)' }}
              title="This prototype uses localized demonstration data and transparent rules."
            >
              Demo Preview
            </span>
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
  );
};
