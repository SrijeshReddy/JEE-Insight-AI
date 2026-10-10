import React, { useState } from 'react';
import {
  GraduationCap,
  ArrowRight,
  BarChart2,
  BrainCircuit,
  Target,
  Compass,
  CheckCircle2,
  Layers,
  Sparkles,
  TrendingUp,
  FileText,
  Clock,
  ShieldCheck,
  ChevronRight,
  Calculator,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { NavPage } from '../components/layout/Sidebar';
import { Modal } from '../components/common/Modal';

interface LandingPageProps {
  onNavigate: (page: NavPage) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [authName, setAuthName] = useState('Aarav Sharma');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: 'var(--text-primary)' }}>
      {/* Top Notification / Banner */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid var(--border-default)',
          padding: '8px 24px',
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}
      >
        <span style={{ fontWeight: 600, color: 'var(--accent-blue)', marginRight: '6px' }}>
          PROTOTYPE PREVIEW:
        </span>
        Frontend simulation of JEE InsightAI architecture. Live demonstration mode enabled with verified sample data.
      </div>

      {/* Main Public Header */}
      <header
        style={{
          borderBottom: '1px solid var(--border-default)',
          position: 'sticky',
          top: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          zIndex: 40
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Logo */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={() => onNavigate('overview')}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <GraduationCap size={20} />
            </div>
            <div>
              <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                JEE Insight<span style={{ color: 'var(--accent-blue)' }}>AI</span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="landing-nav">
            <button
              onClick={() => scrollToSection('features')}
              style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '14px' }}
              className="btn-subtle"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '14px' }}
              className="btn-subtle"
            >
              How It Works
            </button>
            <button
              onClick={() => onNavigate('analytics')}
              style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '14px' }}
              className="btn-subtle"
            >
              Analytics
            </button>
            <button
              onClick={() => onNavigate('ai-coach')}
              style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '14px' }}
              className="btn-subtle"
            >
              AI Coach
            </button>
          </nav>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setShowSignInModal(true)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '7px 14px' }}
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate('overview')}
              className="btn btn-primary btn-sm"
              style={{ padding: '7px 16px', gap: '6px' }}
            >
              <span>Explore Demo</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '72px 24px 60px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '999px', backgroundColor: 'var(--accent-blue-light)', border: '1px solid var(--accent-blue-border)', color: 'var(--accent-blue)', fontSize: '12px', fontWeight: 600, marginBottom: '20px' }}>
          <Sparkles size={14} />
          Adaptive Examination & Performance Intelligence
        </div>

        <h1
          style={{
            fontSize: '44px',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            maxWidth: '820px',
            margin: '0 auto 20px'
          }}
        >
          Your JEE Preparation, <span style={{ color: 'var(--accent-blue)' }}>Backed by Data.</span>
        </h1>

        <p
          style={{
            fontSize: '17px',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 36px'
          }}
        >
          Go beyond mock-test scores. Understand your weaknesses, discover your next priorities, and track your improvement with personalized performance intelligence.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '48px' }}>
          <button
            onClick={() => onNavigate('overview')}
            className="btn btn-primary btn-lg"
            style={{ padding: '12px 24px', fontSize: '15px', gap: '8px' }}
          >
            <span>Explore the Dashboard</span>
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="btn btn-secondary btn-lg"
            style={{ padding: '12px 22px', fontSize: '15px' }}
          >
            See How It Works
          </button>
        </div>

        {/* Dashboard Preview Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-default)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            textAlign: 'left',
            maxWidth: '1020px',
            margin: '0 auto'
          }}
        >
          {/* Mock Window Top Bar */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface-subtle)',
              borderBottom: '1px solid var(--border-default)',
              padding: '10px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: 'var(--text-muted)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '5px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              </div>
              <span style={{ fontWeight: 500, color: 'var(--text-secondary)', marginLeft: '6px' }}>
                JEE InsightAI — Aspirant Analytics Terminal
              </span>
            </div>
            <span className="badge badge-blue">Mock #8 Diagnostic Active</span>
          </div>

          {/* Realistic Dashboard Preview UI */}
          <div style={{ padding: '24px', backgroundColor: 'var(--bg-app)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div className="stat-card" style={{ padding: '14px 16px' }}>
                <div className="stat-label">Latest Mock Score</div>
                <div className="stat-value" style={{ fontSize: '22px' }}>112 <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>/ 300</span></div>
                <div className="stat-meta" style={{ color: 'var(--success)' }}>+8 vs Mock #7</div>
              </div>
              <div className="stat-card" style={{ padding: '14px 16px' }}>
                <div className="stat-label">Accuracy</div>
                <div className="stat-value" style={{ fontSize: '22px' }}>64%</div>
                <div className="stat-meta">33 Correct / 20 Incorrect</div>
              </div>
              <div className="stat-card" style={{ padding: '14px 16px' }}>
                <div className="stat-label">High Priority Constraint</div>
                <div className="stat-value" style={{ fontSize: '20px', color: '#b45309' }}>Integration</div>
                <div className="stat-meta">38% Accuracy • 228s avg</div>
              </div>
              <div className="stat-card" style={{ padding: '14px 16px' }}>
                <div className="stat-label">Recommended Move</div>
                <div className="stat-value" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--accent-blue)' }}>Calculus Review</div>
                <div className="stat-meta">King's Property drills</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }} className="preview-grid">
              <div className="card" style={{ padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Score Trajectory (Mocks #1 to #8)</div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target: 210/300</span>
                </div>
                <div style={{ height: '140px', display: 'flex', alignItems: 'flex-end', gap: '12px', paddingBottom: '10px', borderBottom: '1px solid var(--border-default)' }}>
                  {[
                    { m: '#1', s: 88 },
                    { m: '#2', s: 94 },
                    { m: '#3', s: 91 },
                    { m: '#4', s: 102 },
                    { m: '#5', s: 105 },
                    { m: '#6', s: 110 },
                    { m: '#7', s: 104 },
                    { m: '#8', s: 112 }
                  ].map((item, idx) => (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.s}</span>
                      <div
                        style={{
                          width: '100%',
                          height: `${(item.s / 150) * 100}px`,
                          backgroundColor: idx === 7 ? 'var(--accent-blue)' : '#cbd5e1',
                          borderRadius: '4px 4px 0 0'
                        }}
                      />
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.m}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: '18px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>Subject Balance</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Physics</span>
                      <strong>72% (52m)</strong>
                    </div>
                    <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}>
                      <div style={{ width: '72%', height: '100%', backgroundColor: '#2563eb', borderRadius: '4px' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Chemistry</span>
                      <strong>68% (44m)</strong>
                    </div>
                    <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}>
                      <div style={{ width: '68%', height: '100%', backgroundColor: '#0f766e', borderRadius: '4px' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Mathematics</span>
                      <strong style={{ color: '#b45309' }}>51% (16m)</strong>
                    </div>
                    <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}>
                      <div style={{ width: '51%', height: '100%', backgroundColor: '#d97706', borderRadius: '4px' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Explanation: 3 Core Pillars */}
      <section style={{ backgroundColor: 'var(--bg-app)', padding: '72px 24px', borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '12px' }}>
              The Three Pillars of Preparation Intelligence
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
              Standard test series show your percentile. JEE InsightAI isolates your cognitive bottlenecks and models your fastest path to rank growth.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Pillar 1: Understand */}
            <div className="card" style={{ padding: '28px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--accent-blue-light)',
                  color: 'var(--accent-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px'
                }}
              >
                <BarChart2 size={22} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>1. Understand</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '14px', marginBottom: '16px' }}>
                Analyze mock tests, accuracy, solving time, topic weaknesses, and historical trends with forensic question-level breakdowns.
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={15} color="var(--accent-blue)" /> Detailed accuracy vs solving time matrix
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={15} color="var(--accent-blue)" /> Blind guessing & negative marking detection
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={15} color="var(--accent-blue)" /> Multi-test consistency indexing
                </li>
              </ul>
            </div>

            {/* Pillar 2: Improve */}
            <div className="card" style={{ padding: '28px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--accent-teal-light)',
                  color: 'var(--accent-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px'
                }}
              >
                <Target size={22} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>2. Improve</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '14px', marginBottom: '16px' }}>
                Turn performance insights into personalized study priorities and practical daily revision plans that maximize marks per hour invested.
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={15} color="var(--accent-teal)" /> Evidence-backed weak concept ranking
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={15} color="var(--accent-teal)" /> Adaptive daily study planner
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={15} color="var(--accent-teal)" /> Pedagogical AI Coach guidance
                </li>
              </ul>
            </div>

            {/* Pillar 3: Measure */}
            <div className="card" style={{ padding: '28px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: '#fffbeb',
                  color: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px'
                }}
              >
                <TrendingUp size={22} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>3. Measure</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '14px', marginBottom: '16px' }}>
                Compare later attempts to understand concrete changes in scores, topic performance, and time management across the preparation journey.
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={15} color="#b45309" /> Longitudinal test comparison tool
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={15} color="#b45309" /> Interactive score simulator scenarios
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={15} color="#b45309" /> Transparent demonstration models
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Overview */}
      <section id="features" style={{ padding: '72px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '12px' }}>
            Comprehensive Feature Architecture
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Engineered specifically for the demands of JEE Main & JEE Advanced preparation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {[
            {
              title: 'Mock-Test Analysis',
              desc: 'CBT examination engine with automated marking (+4 / -1) and subject-by-subject accuracy profiling.',
              page: 'mock-tests' as NavPage,
              icon: FileText
            },
            {
              title: 'Weak-Concept Detection',
              desc: 'Identifies high-priority syllabus gaps using transparent performance criteria and time metrics.',
              page: 'weak-concepts' as NavPage,
              icon: AlertCircle
            },
            {
              title: 'Performance Analytics',
              desc: 'Multi-dimensional interactive analytics workspace with difficulty filtering and time allocation curves.',
              page: 'analytics' as NavPage,
              icon: BarChart2
            },
            {
              title: 'Personalized Study Planning',
              desc: 'Actionable weekly schedule with priority badges, task durations, and dynamic completion tracking.',
              page: 'study-planner' as NavPage,
              icon: Compass
            },
            {
              title: 'Score Simulation',
              desc: 'What-if calculation engine showing how targeted accuracy gains and negative reduction lift test score.',
              page: 'score-simulator' as NavPage,
              icon: Calculator
            },
            {
              title: 'AI Coaching Interface',
              desc: 'Conversational performance tutoring demonstrating pedagogical feedback and test autopsy advice.',
              page: 'ai-coach' as NavPage,
              icon: BrainCircuit
            },
            {
              title: 'Progress History',
              desc: 'Filterable benchmark repository with side-by-side test comparisons and delta calculations.',
              page: 'history' as NavPage,
              icon: TrendingUp
            }
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="card"
                style={{ padding: '22px', cursor: 'pointer', transition: 'transform 0.15s ease, border-color 0.15s ease' }}
                onClick={() => onNavigate(feat.page)}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-blue)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
              >
                <div style={{ color: 'var(--accent-blue)', marginBottom: '14px' }}>
                  <Icon size={22} />
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>{feat.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5, marginBottom: '14px' }}>
                  {feat.desc}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: 'var(--accent-blue)' }}>
                  <span>Explore component</span>
                  <ChevronRight size={13} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works (6-step clean sequence) */}
      <section
        id="how-it-works"
        style={{
          backgroundColor: 'var(--bg-app)',
          padding: '72px 24px',
          borderTop: '1px solid var(--border-default)',
          borderBottom: '1px solid var(--border-default)'
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '12px' }}>
              How JEE InsightAI Works
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              A disciplined, continuous improvement cycle built around empirical evidence.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              {
                step: '1',
                title: 'Take a mock test',
                desc: 'Complete a full-length CBT mock test or focused chapter sectional with realistic timing and scoring rules.'
              },
              {
                step: '2',
                title: 'Analyze your results',
                desc: 'Review forensic observations: accuracy, solving time distribution, and negative mark penalties.'
              },
              {
                step: '3',
                title: 'Identify priority concepts',
                desc: 'Inspect weak concepts ranked by urgency and reason, rather than looking at aggregate scores alone.'
              },
              {
                step: '4',
                title: 'Follow your study plan',
                desc: 'Execute daily and weekly objectives tailored directly to recover your highest-leverage missed marks.'
              },
              {
                step: '5',
                title: 'Explore hypothetical improvement scenarios',
                desc: 'Simulate how reducing negative marks and improving topic accuracy shifts your predicted score band.'
              },
              {
                step: '6',
                title: 'Take another mock and compare progress',
                desc: 'Re-test under identical conditions and evaluate comparative score, accuracy, and time deltas.'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '18px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '15px',
                    flexShrink: 0
                  }}
                >
                  {item.step}
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section style={{ padding: '80px 24px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '14px' }}>
          Experience the Platform Prototype
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6, marginBottom: '32px' }}>
          Explore the full interactive prototype with real test simulation, performance analytics, weak-concept ranking, and study planning.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate('overview')}
            className="btn btn-primary btn-lg"
            style={{ padding: '12px 28px', fontSize: '15px', gap: '8px' }}
          >
            <span>Explore Demo Dashboard</span>
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => onNavigate('mock-tests')}
            className="btn btn-secondary btn-lg"
            style={{ padding: '12px 24px', fontSize: '15px' }}
          >
            Take Demo Mock Test
          </button>
        </div>
      </section>

      {/* Public Footer */}
      <footer style={{ borderTop: '1px solid var(--border-default)', padding: '36px 24px', backgroundColor: 'var(--bg-app)' }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            alignItems: 'center',
            textAlign: 'center',
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={16} color="var(--accent-blue)" />
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              JEE InsightAI — An AI-Powered Adaptive Examination & Performance Intelligence Platform
            </span>
          </div>
          <p style={{ maxWidth: '640px', lineHeight: 1.5 }}>
            Prototype Preview Mode. Built with React, TypeScript, and modern responsive design. All demonstration metrics and scenario predictions are illustrative and designed for future integration with Python/ML analytics services.
          </p>
        </div>
      </footer>

      {/* Sign In Demo Modal */}
      <Modal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        title="Prototype Sign In"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="demo-banner">
            <UserCheck size={16} />
            <span>Prototype preview allows immediate exploration without creating real student accounts.</span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
              Student Display Name
            </label>
            <input
              type="text"
              value={authName}
              onChange={e => setAuthName(e.target.value)}
              className="input-control"
              placeholder="e.g. Aarav Sharma"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
              Target Examination
            </label>
            <select className="select-control" style={{ width: '100%' }}>
              <option>JEE Main 2027 (April Session)</option>
              <option>JEE Main 2027 (January Session)</option>
              <option>JEE Advanced 2027</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={() => setShowSignInModal(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowSignInModal(false);
                onNavigate('overview');
              }}
              className="btn btn-primary"
            >
              Enter Dashboard as {authName}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
