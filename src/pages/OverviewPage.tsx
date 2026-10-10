import React, { useEffect, useState } from 'react';
import {
  Play,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Calendar,
  Compass,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Flame,
  FileCheck2
} from 'lucide-react';
import { NavPage } from '../components/layout/Sidebar';
import { StatCard } from '../components/common/StatCard';
import { ScoreTrendChart, DataPoint } from '../components/common/ScoreTrendChart';
import { ProgressBar } from '../components/common/ProgressBar';
import { DEMO_METRICS, SUBJECT_PERFORMANCES, TOPIC_PERFORMANCES, HISTORICAL_MOCKS } from '../data/demoData';
import { mockTestService } from '../services/mockTestService';
import { studyPlannerService } from '../services/studyPlannerService';
import { TestAttemptResult, StudyTask } from '../types';

interface OverviewPageProps {
  onNavigate: (page: NavPage, topicContext?: string) => void;
  studentName?: string;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigate,
  studentName = 'Aarav'
}) => {
  const [latestAttempt, setLatestAttempt] = useState<TestAttemptResult | null>(null);
  const [recentTasks, setRecentTasks] = useState<StudyTask[]>([]);

  useEffect(() => {
    mockTestService.getLatestAttempt().then(att => setLatestAttempt(att));
    studyPlannerService.getTasks().then(tasks => setRecentTasks(tasks.slice(0, 4)));
  }, []);

  const chartData: DataPoint[] = HISTORICAL_MOCKS.map(m => ({
    label: m.mockName.replace('JEE Main ', '').replace(' (Diagnostic)', '').replace(' (Sectional)', '').replace(' (Latest Baseline)', ''),
    value: m.score,
    subLabel: `${m.date} • ${m.accuracy}% accuracy`,
    accuracy: m.accuracy
  }));

  // If student submitted a test in this session, append to chart
  if (latestAttempt) {
    chartData.push({
      label: 'Session Attempt',
      value: latestAttempt.score,
      subLabel: `Today • ${latestAttempt.accuracy}% accuracy`,
      accuracy: latestAttempt.accuracy
    });
  }

  const latestScore = latestAttempt ? latestAttempt.score : DEMO_METRICS.latestMockScore;
  const completedMocks = latestAttempt ? DEMO_METRICS.completedMocksCount + 1 : DEMO_METRICS.completedMocksCount;

  return (
    <div className="page-container">
      {/* Welcome & Primary Actions */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Welcome back, {studentName}
            </h2>
            <span className="badge badge-default" style={{ fontSize: '11px' }}>
              Aspirant
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Your preparation, explained through data.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onNavigate('mock-tests')}
            className="btn btn-primary"
            style={{ gap: '6px' }}
          >
            <Play size={14} fill="currentColor" />
            <span>Start Mock Test</span>
          </button>
          <button
            onClick={() => onNavigate('analytics')}
            className="btn btn-secondary"
            style={{ gap: '6px' }}
          >
            <BarChart3 size={14} />
            <span>View Performance</span>
          </button>
        </div>
      </div>

      {/* Demonstration Data Banner */}
      <div className="demo-banner" style={{ marginBottom: '24px' }}>
        <Sparkles size={15} color="var(--accent-blue)" />
        <span>
          <strong>Prototype Mode:</strong> The metrics below reflect your sample demonstration baseline (Mock #8 Benchmark). Taking a mock test in this session will update your live score calculations.
        </span>
      </div>

      {/* Metric Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <StatCard
          label="Latest Mock Score"
          value={`${latestScore}/300`}
          trend={{ value: latestAttempt ? `Session Attempt: ${latestAttempt.score}` : '+8 vs Mock #7', isPositive: true }}
          subValue="Target: 210/300"
          icon={<Flame size={16} />}
        />
        <StatCard
          label="Average Score"
          value={`${DEMO_METRICS.averageScore}/300`}
          trend={{ value: 'Across 8 mocks', isNeutral: true }}
          subValue="Consistency Index: 88%"
          icon={<BarChart3 size={16} />}
        />
        <StatCard
          label="Overall Accuracy"
          value={`${DEMO_METRICS.overallAccuracy}%`}
          trend={{ value: '+3% this month', isPositive: true }}
          subValue="33 Correct / 20 Incorrect"
          icon={<TrendingUp size={16} />}
        />
        <StatCard
          label="Completed Mock Tests"
          value={completedMocks}
          trend={{ value: '1 pending this week', isNeutral: true }}
          subValue="Total 600+ questions attempted"
          icon={<FileCheck2 size={16} />}
        />
      </div>

      {/* Next Best Move Recommendation Box */}
      <div
        className="card"
        style={{
          padding: '20px 24px',
          marginBottom: '24px',
          backgroundColor: '#f8fafc',
          borderLeft: '4px solid var(--accent-blue)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ maxWidth: '820px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-blue">Next Best Move</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Demonstration Intelligence Recommendation</span>
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Prioritize Integration revision, then complete a timed practice set.
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              The sample performance profile indicates that both accuracy (38%) and solving time (228 seconds/question) need attention. King's Property and algebraic substitution traps accounted for 6 missed marks in your latest mock.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignSelf: 'center' }}>
            <button
              onClick={() => onNavigate('study-planner')}
              className="btn btn-secondary btn-sm"
            >
              View Study Plan
            </button>
            <button
              onClick={() => onNavigate('mock-tests')}
              className="btn btn-primary btn-sm"
            >
              Practice Topic
            </button>
            <button
              onClick={() => onNavigate('ai-coach', 'Integration')}
              className="btn btn-subtle btn-sm"
              style={{ color: 'var(--accent-blue)', gap: '4px' }}
            >
              <Bot size={14} />
              <span>Ask AI Coach</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Score Trend Chart & Subject Performance */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '20px',
          marginBottom: '24px'
        }}
        className="overview-charts-grid"
      >
        {/* Score Trend Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <TrendingUp size={16} color="var(--accent-blue)" />
              <span>Score Progression Trajectory</span>
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              8 Demonstration Benchmarks
            </span>
          </div>
          <div className="card-body">
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Interactive score progression showing scores from 8 demonstration mock tests. Hover over points to view exact scores and accuracy.
            </p>
            <ScoreTrendChart data={chartData} targetScore={210} />
          </div>
        </div>

        {/* Subject Performance Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <BarChart3 size={16} color="var(--accent-teal)" />
              <span>Subject Performance</span>
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Mock #8</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {SUBJECT_PERFORMANCES.map(subj => {
              let barColor = '#2563eb';
              if (subj.subject === 'Chemistry') barColor = '#0f766e';
              if (subj.subject === 'Mathematics') barColor = '#d97706';

              return (
                <div key={subj.subject}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '13px' }}>{subj.subject}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                        ({subj.correctCount}C / {subj.incorrectCount}I / {subj.unattemptedCount}U)
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>{subj.score}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/100</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, marginLeft: '6px', color: barColor }}>
                        ({subj.accuracy}%)
                      </span>
                    </div>
                  </div>
                  <ProgressBar value={subj.accuracy} color={barColor} height={8} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>Avg speed: {subj.avgTimeSeconds}s/q</span>
                    <span>{subj.accuracy < 60 ? 'Needs Attention' : 'On Track'}</span>
                  </div>
                </div>
              );
            })}

            <div
              style={{
                marginTop: '6px',
                padding: '10px 12px',
                backgroundColor: 'var(--bg-surface-subtle)',
                borderRadius: '6px',
                fontSize: '11px',
                color: 'var(--text-secondary)'
              }}
            >
              <strong>Diagnostic Note:</strong> Mathematics accounts for 12 of your 20 incorrect answers. Elevating math accuracy to match Chemistry would yield +28 marks immediately.
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Focus Topics Row */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">
            <AlertCircle size={16} color="#b45309" />
            <span>Recommended Focus Areas (Priority Topics)</span>
          </h3>
          <button
            onClick={() => onNavigate('weak-concepts')}
            className="btn btn-subtle btn-sm"
            style={{ color: 'var(--accent-blue)', gap: '4px' }}
          >
            <span>View All Topics</span>
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Subject</th>
                  <th>Accuracy</th>
                  <th>Priority</th>
                  <th>Diagnostic Observation</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {TOPIC_PERFORMANCES.slice(0, 4).map(topic => (
                  <tr key={topic.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{topic.topic}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {topic.attemptCount} attempts • {topic.avgTimeSeconds}s avg time
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-default">{topic.subject}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, width: '32px' }}>{topic.accuracy}%</span>
                        <div style={{ width: '60px' }}>
                          <ProgressBar
                            value={topic.accuracy}
                            color={topic.accuracy < 50 ? '#dc2626' : topic.accuracy < 70 ? '#d97706' : '#16a34a'}
                            height={5}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          topic.priority === 'High' ? 'badge-danger' : topic.priority === 'Medium' ? 'badge-warning' : 'badge-success'
                        }`}
                      >
                        {topic.priority} Priority
                      </span>
                    </td>
                    <td style={{ maxWidth: '320px', fontSize: '12px' }}>
                      {topic.reason}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => onNavigate('study-planner')}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                        >
                          Plan Study
                        </button>
                        <button
                          onClick={() => onNavigate('ai-coach', topic.topic)}
                          className="btn btn-subtle btn-sm"
                          style={{ padding: '4px 6px', color: 'var(--accent-blue)' }}
                          title="Ask AI Coach about this topic"
                        >
                          <Bot size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Activity: Completed Mock Tests and Study Tasks */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px'
        }}
        className="overview-recent-grid"
      >
        {/* Recent Mock Tests */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Calendar size={15} color="var(--text-muted)" />
              <span>Recent Mock Tests</span>
            </h3>
            <button
              onClick={() => onNavigate('history')}
              className="btn btn-subtle btn-sm"
              style={{ color: 'var(--accent-blue)', fontSize: '12px' }}
            >
              History
            </button>
          </div>
          <div className="card-body" style={{ padding: '12px 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {HISTORICAL_MOCKS.slice(-3).reverse().map(m => (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{m.mockName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {m.date} • {m.timeSpentMinutes} mins • {m.accuracy}% accuracy
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent-primary)' }}>
                      {m.score}/300
                    </div>
                    {m.scoreDelta !== 0 && (
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: m.scoreDelta > 0 ? 'var(--success)' : 'var(--danger)'
                        }}
                      >
                        {m.scoreDelta > 0 ? `+${m.scoreDelta}` : m.scoreDelta} pts
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current Study Tasks */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Compass size={15} color="var(--text-muted)" />
              <span>Pending Study Tasks</span>
            </h3>
            <button
              onClick={() => onNavigate('study-planner')}
              className="btn btn-subtle btn-sm"
              style={{ color: 'var(--accent-blue)', fontSize: '12px' }}
            >
              Full Planner
            </button>
          </div>
          <div className="card-body" style={{ padding: '12px 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recentTasks.map(t => (
                <div
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: t.completed ? 'var(--bg-surface-subtle)' : 'var(--bg-surface)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        color: t.completed ? 'var(--success)' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          textDecoration: t.completed ? 'line-through' : 'none',
                          color: t.completed ? 'var(--text-muted)' : 'var(--text-primary)'
                        }}
                      >
                        {t.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {t.day} • {t.durationMinutes} mins • {t.subject}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      t.priority === 'High' ? 'badge-danger' : t.priority === 'Medium' ? 'badge-warning' : 'badge-default'
                    }`}
                    style={{ fontSize: '10px' }}
                  >
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
