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
  FileCheck2,
  Award,
  Zap,
  Target
} from 'lucide-react';
import { NavPage } from '../components/layout/Sidebar';
import { StatCard } from '../components/common/StatCard';
import { ScoreTrendChart, DataPoint } from '../components/common/ScoreTrendChart';
import { ProgressBar } from '../components/common/ProgressBar';
import { DEMO_METRICS, SUBJECT_PERFORMANCES, TOPIC_PERFORMANCES, HISTORICAL_MOCKS } from '../data/demoData';
import { mockTestService } from '../services/mockTestService';
import { studyPlannerService } from '../services/studyPlannerService';
import { analyticsService, AnalyticsData } from '../services/analyticsService';
import { weakConceptsService } from '../services/weakConceptsService';
import { TestAttemptResult, StudyTask, TopicPerformance } from '../types';

interface OverviewPageProps {
  onNavigate: (page: NavPage, topicContext?: string) => void;
  studentName?: string;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigate,
  studentName = 'Aarav'
}) => {
  const [latestAttempt, setLatestAttempt] = useState<TestAttemptResult | null>(null);
  const [allAttempts, setAllAttempts] = useState<TestAttemptResult[]>([]);
  const [recentTasks, setRecentTasks] = useState<StudyTask[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [priorityTopics, setPriorityTopics] = useState<TopicPerformance[]>([]);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    const latest = await mockTestService.getLatestAttempt();
    const attempts = await mockTestService.getAllAttempts();
    const tasks = await studyPlannerService.getTasks();
    const anData = await analyticsService.getAnalytics({ subject: 'All' });
    const topics = await weakConceptsService.getTopics({ sortBy: 'priority' });

    setLatestAttempt(latest);
    setAllAttempts(attempts);
    setRecentTasks(tasks.slice(0, 4));
    setAnalytics(anData);
    setPriorityTopics(topics);
  };

  const handleToggleTask = async (taskId: string) => {
    const updated = await studyPlannerService.toggleTask(taskId);
    setRecentTasks(updated.slice(0, 4));
  };

  // Build Score progression chart data
  const chartData: DataPoint[] = analytics
    ? analytics.scoreProgression.map(m => ({
        label: m.mockName.replace('JEE Main ', '').replace(' (Diagnostic)', '').replace(' (Sectional)', '').replace(' (Latest Baseline)', ''),
        value: m.score,
        subLabel: `${m.date} • ${m.accuracy}% accuracy`,
        accuracy: m.accuracy
      }))
    : HISTORICAL_MOCKS.map(m => ({
        label: m.mockName.replace('JEE Main ', '').replace(' (Diagnostic)', '').replace(' (Sectional)', '').replace(' (Latest Baseline)', ''),
        value: m.score,
        subLabel: `${m.date} • ${m.accuracy}% accuracy`,
        accuracy: m.accuracy
      }));

  // Calculations
  const completedMocksCount = HISTORICAL_MOCKS.length + allAttempts.length;
  const latestScore = latestAttempt ? latestAttempt.score : DEMO_METRICS.latestMockScore;
  const latestTotalMarks = latestAttempt ? latestAttempt.totalMarks : 300;

  // Average score
  const totalScoresSum = HISTORICAL_MOCKS.reduce((s, m) => s + m.score, 0) + allAttempts.reduce((s, a) => s + a.score, 0);
  const averageScore = Math.round(totalScoresSum / completedMocksCount);

  // Overall accuracy
  const totalAccSum = HISTORICAL_MOCKS.reduce((s, m) => s + m.accuracy, 0) + allAttempts.reduce((s, a) => s + a.accuracy, 0);
  const overallAccuracy = Math.round(totalAccSum / completedMocksCount);

  // High priority constraint
  const topConstraint = priorityTopics.find(t => t.priority === 'High') || priorityTopics[0];

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
              Aspirant Workspace
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Understand your performance. Improve with evidence.
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
            onClick={() => onNavigate('results')}
            className="btn btn-secondary"
            style={{ gap: '6px' }}
          >
            <BarChart3 size={14} />
            <span>Latest Results</span>
          </button>
          <button
            onClick={() => onNavigate('study-planner')}
            className="btn btn-secondary"
            style={{ gap: '6px' }}
          >
            <Compass size={14} />
            <span>Study Planner</span>
          </button>
        </div>
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
          value={`${latestScore}/${latestTotalMarks}`}
          trend={{
            value: latestAttempt
              ? `Session Test: ${latestAttempt.score}/${latestAttempt.totalMarks}`
              : '+8 vs Mock #7',
            isPositive: true
          }}
          subValue="Target: 210/300"
          icon={<Flame size={16} />}
        />
        <StatCard
          label="Average Mock Score"
          value={`${averageScore}/300`}
          trend={{ value: `Across ${completedMocksCount} mock assessments`, isNeutral: true }}
          subValue="Consistency Index: 88%"
          icon={<BarChart3 size={16} />}
        />
        <StatCard
          label="Overall Accuracy"
          value={`${overallAccuracy}%`}
          trend={{ value: '+3% this month', isPositive: true }}
          subValue="Calculated: Correct / (Correct + Incorrect)"
          icon={<TrendingUp size={16} />}
        />
        <StatCard
          label="Completed Mock Tests"
          value={completedMocksCount}
          trend={{ value: allAttempts.length > 0 ? `${allAttempts.length} in this session` : '1 scheduled this week', isNeutral: true }}
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
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Empirical Diagnostic Recommendation</span>
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {topConstraint ? `Prioritize ${topConstraint.topic} (${topConstraint.subject}) revision & practice.` : 'Review recent mock examination mistakes.'}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {topConstraint?.reason || 'Calculus and Organic Chemistry mechanisms represent your highest-leverage missed marks. Addressing these bottlenecks lifts your score band faster than broad repetition.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignSelf: 'center', flexWrap: 'wrap' }}>
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
              Practice Tests
            </button>
            <button
              onClick={() => onNavigate('ai-coach', topConstraint?.topic || 'Mock Autopsy')}
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
              {chartData.length} Completed Examinations
            </span>
          </div>
          <div className="card-body">
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Historical mock scores with target line at 210/300. Hover over data points to inspect individual test accuracy and dates.
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
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {latestAttempt ? latestAttempt.testTitle.replace('JEE Main ', '') : 'Mock #8'}
            </span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {(['Physics', 'Chemistry', 'Mathematics'] as const).map(subj => {
              const latestData = latestAttempt?.subjectBreakdown[subj];
              const baseData = SUBJECT_PERFORMANCES.find(s => s.subject === subj);

              const accuracy = latestData ? latestData.accuracy : baseData?.accuracy || 60;
              const score = latestData ? latestData.score : baseData?.score || 40;
              const correct = latestData ? latestData.correct : baseData?.correctCount || 10;
              const incorrect = latestData ? latestData.incorrect : baseData?.incorrectCount || 5;
              const unattempted = latestData ? latestData.unattempted : baseData?.unattemptedCount || 10;
              const avgTime = latestData ? latestData.avgTime : baseData?.avgTimeSeconds || 120;

              let barColor = '#2563eb';
              if (subj === 'Chemistry') barColor = '#0f766e';
              if (subj === 'Mathematics') barColor = '#d97706';

              return (
                <div key={subj}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '13px' }}>{subj}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                        ({correct}C / {incorrect}I / {unattempted}U)
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>{score}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/100</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, marginLeft: '6px', color: barColor }}>
                        ({accuracy}%)
                      </span>
                    </div>
                  </div>
                  <ProgressBar value={accuracy} color={barColor} height={8} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>{accuracy < 60 ? 'Needs Attention' : 'On Track'}</span>
                    <span style={{ color: 'var(--text-muted)' }}>Pacing: ~{avgTime}s/q</span>
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
              <strong>Diagnostic Note:</strong> Mathematics remains your highest leverage growth area. Matching Chemistry's accuracy would elevate your score by ~28 marks immediately.
            </div>
          </div>
        </div>
      </div>

      {/* Strongest vs Weakest Topics Row */}
      {analytics && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Award size={18} color="var(--success)" />
              <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Strongest Mastery Topics</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {analytics.strongestTopics.map((top, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '6px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{top.topic}</div>
                    <span className="badge badge-default" style={{ fontSize: '10px' }}>{top.subject}</span>
                  </div>
                  <strong style={{ color: 'var(--success)', fontSize: '13px' }}>{top.accuracy}%</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <AlertCircle size={18} color="var(--danger)" />
              <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Highest Urgency Weak Topics</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {analytics.weakestTopics.map((top, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '6px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{top.topic}</div>
                    <span className="badge badge-default" style={{ fontSize: '10px' }}>{top.subject}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ color: 'var(--danger)', fontSize: '13px' }}>{top.accuracy}%</strong>
                    <div style={{ fontSize: '10px', color: 'var(--danger)' }}>{top.priority} Priority</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
                {priorityTopics.slice(0, 4).map(topic => (
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
              {/* If session attempts exist, show them first */}
              {allAttempts.slice(0, 2).map(att => (
                <div
                  key={att.id}
                  onClick={() => onNavigate('results')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1.5px solid var(--accent-blue-border)',
                    backgroundColor: 'var(--accent-blue-light)',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                      {att.testTitle} <span className="badge badge-blue" style={{ fontSize: '10px' }}>Session</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {att.date} • {att.accuracy}% accuracy
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent-primary)' }}>
                      {att.score}/{att.totalMarks}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--accent-blue)', fontWeight: 600 }}>Review &rarr;</span>
                  </div>
                </div>
              ))}

              {HISTORICAL_MOCKS.slice(-3).reverse().map(m => (
                <div
                  key={m.id}
                  onClick={() => onNavigate('results')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)',
                    cursor: 'pointer'
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
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => handleToggleTask(t.id)}
                      style={{ cursor: 'pointer', accentColor: 'var(--accent-blue)' }}
                      title="Toggle completion"
                    />
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
