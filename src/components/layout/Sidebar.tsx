import React from 'react';
import {
  LayoutDashboard,
  FileCheck2,
  BarChart3,
  AlertCircle,
  CalendarCheck,
  Calculator,
  Bot,
  History,
  Settings,
  Globe,
  Sparkles,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export type NavPage =
  | 'landing'
  | 'overview'
  | 'mock-tests'
  | 'results'
  | 'analytics'
  | 'weak-concepts'
  | 'study-planner'
  | 'score-simulator'
  | 'ai-coach'
  | 'history'
  | 'settings';

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  studentName?: string;
  targetExam?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onCloseMobile,
  studentName = 'Aarav Sharma',
  targetExam = 'JEE Main 2027'
}) => {
  const navItems = [
    { id: 'overview' as NavPage, label: 'Overview', icon: LayoutDashboard },
    { id: 'mock-tests' as NavPage, label: 'Mock Tests', icon: FileCheck2 },
    { id: 'analytics' as NavPage, label: 'Performance Analytics', icon: BarChart3 },
    { id: 'weak-concepts' as NavPage, label: 'Weak Concepts', icon: AlertCircle },
    { id: 'study-planner' as NavPage, label: 'Study Planner', icon: CalendarCheck },
    { id: 'score-simulator' as NavPage, label: 'Score Simulator', icon: Calculator },
    { id: 'ai-coach' as NavPage, label: 'AI Coach', icon: Bot, badge: 'Demo' },
    { id: 'history' as NavPage, label: 'Progress History', icon: History },
    { id: 'settings' as NavPage, label: 'Profile & Settings', icon: Settings }
  ];

  const handleItemClick = (page: NavPage) => {
    onNavigate(page);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            zIndex: 35
          }}
        />
      )}

      <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div
          style={{
            padding: '18px 20px',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer' }}
              onClick={() => handleItemClick('overview')}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--accent-primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <GraduationCap size={18} />
              </div>
              <div>
                <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                  JEE Insight<span style={{ color: 'var(--accent-blue)' }}>AI</span>
                </span>
              </div>
            </div>
            <span className="badge badge-default" style={{ fontSize: '10px', padding: '2px 6px' }}>
              Preview
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.3 }}>
            Understand. Improve. Measure.
          </p>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '14px 12px', overflowY: 'auto' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 8px 8px' }}>
            Platform Navigation
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: isActive ? 'var(--accent-blue-light)' : 'transparent',
                    color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '13px',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-surface-subtle)';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: '10px',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        backgroundColor: isActive ? 'var(--accent-blue)' : 'var(--bg-surface-subtle)',
                        color: isActive ? '#fff' : 'var(--text-muted)'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Switch to Public Site */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => handleItemClick('landing')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                color: 'var(--text-muted)',
                fontSize: '12px',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface-subtle)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Globe size={15} />
                <span>Public Landing Page</span>
              </div>
              <ChevronRight size={14} />
            </button>
          </div>
        </nav>

        {/* Student Profile Footer */}
        <div
          style={{
            padding: '12px 14px',
            borderTop: '1px solid var(--border-default)',
            backgroundColor: 'var(--bg-surface-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={() => handleItemClick('settings')}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 600
              }}
            >
              {studentName.charAt(0)}
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {studentName}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {targetExam}
              </div>
            </div>
          </div>
          <button
            onClick={() => handleItemClick('settings')}
            style={{ color: 'var(--text-muted)', padding: '4px' }}
            title="Account Settings"
          >
            <Settings size={15} />
          </button>
        </div>
      </aside>
    </>
  );
};
