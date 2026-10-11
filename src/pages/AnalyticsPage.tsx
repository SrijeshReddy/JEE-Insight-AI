import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Filter,
  Clock,
  PieChart,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';
import { Subject } from '../types';
import { analyticsService, AnalyticsData } from '../services/analyticsService';
import { ScoreTrendChart, DataPoint } from '../components/common/ScoreTrendChart';
import { ProgressBar } from '../components/common/ProgressBar';

export const AnalyticsPage: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<'All' | Subject>('All');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    analyticsService.getAnalytics({ subject: selectedSubject }).then(data => {
      setAnalyticsData(data);
    });
  }, [selectedSubject]);

  if (!analyticsData) {
    return <div className="page-container">Loading analytics engine...</div>;
  }

  const chartData: DataPoint[] = analyticsData.scoreProgression.map(p => ({
    label: p.mockName,
    value: p.score,
    subLabel: `${p.date} • ${p.accuracy}% accuracy`,
    accuracy: p.accuracy
  }));

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Performance Analytics Workspace
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Interactive multi-dimensional evaluation across subjects, topics, difficulty tiers, and solving velocity.
        </p>
      </div>

      {/* Subject Filter Bar */}
      <div
        className="card"
        style={{
          padding: '12px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={15} color="var(--text-muted)" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Subject Scope:
          </span>
          {(['All', 'Physics', 'Chemistry', 'Mathematics'] as const).map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`btn btn-sm ${selectedSubject === sub ? 'btn-primary' : 'btn-secondary'}`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Showing benchmarks across <strong>8 Mock Tests</strong>
        </div>
      </div>

      {/* Score Progression Line Chart */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">
            <TrendingUp size={16} color="var(--accent-blue)" />
            <span>Score Progression: {selectedSubject === 'All' ? 'Aggregate Examination (/300)' : `${selectedSubject} Scaled (/100)`}</span>
          </h3>
          <span className="badge badge-default">Hover points for exact scores</span>
        </div>
        <div className="card-body">
          <ScoreTrendChart
            data={chartData}
            maxScore={selectedSubject === 'All' ? 300 : 100}
            targetScore={selectedSubject === 'All' ? 210 : 70}
            height={260}
          />
        </div>
      </div>

      {/* Two Column Section: Difficulty Breakdown & Outcome Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }} className="analytics-grid-two">
        {/* Difficulty-Wise Performance */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Layers size={16} color="var(--accent-teal)" />
              <span>Difficulty-Tier Performance</span>
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Accuracy & Conversion</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {analyticsData.difficultyBreakdown.map(diff => {
              let color = 'var(--success)';
              if (diff.difficulty === 'Moderate') color = 'var(--warning)';
              if (diff.difficulty === 'Challenging') color = 'var(--danger)';

              return (
                <div key={diff.difficulty}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600 }}>{diff.difficulty}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        ({diff.attempted}% attempted)
                      </span>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '13px', color }}>
                      {diff.accuracy}% Accuracy
                    </span>
                  </div>
                  <ProgressBar value={diff.accuracy} color={color} height={7} />
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
              <strong>Tier Diagnostic:</strong> While Easy questions maintain high conversion (82%), Challenging questions drop to 34% accuracy with 45% attempt rate, incurring severe negative penalties.
            </div>
          </div>
        </div>

        {/* Question Outcome Distribution (Correct vs Incorrect vs Unattempted) */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Activity size={16} color="var(--accent-blue)" />
              <span>Question Outcome Distribution (Mock #8)</span>
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>75 Questions Total</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Visual Multi-Color Bar */}
            <div style={{ height: '14px', borderRadius: '7px', display: 'flex', overflow: 'hidden', width: '100%', marginBottom: '6px' }}>
              <div style={{ width: '44%', backgroundColor: '#16a34a' }} title="Correct: 44%" />
              <div style={{ width: '27%', backgroundColor: '#dc2626' }} title="Incorrect: 27%" />
              <div style={{ width: '29%', backgroundColor: '#94a3b8' }} title="Unattempted: 29%" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {analyticsData.outcomeDistribution.map(out => (
                <div
                  key={out.status}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-surface-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: out.color }} />
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{out.status}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ fontSize: '13px' }}>{out.count} Questions</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>({out.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
              * Reducing the 27% incorrect attempt rate through disciplined triage is the highest-ROI lever for this student profile.
            </p>
          </div>
        </div>
      </div>

      {/* Topic Accuracy Ranking Table & Solving Velocity */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }} className="analytics-grid-two">
        {/* Topic-Level Accuracy Ranking */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <BarChart3 size={16} color="var(--accent-primary)" />
              <span>Topic-Level Accuracy Ranking ({selectedSubject})</span>
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ascending by Accuracy</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Topic</th>
                    <th>Subject</th>
                    <th>Accuracy</th>
                    <th>Attempts</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.topicRankings.map((top, idx) => (
                    <tr key={idx}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{top.topic}</div>
                      </td>
                      <td>
                        <span className="badge badge-default">{top.subject}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontWeight: 700,
                              color: top.accuracy < 50 ? 'var(--danger)' : top.accuracy < 70 ? 'var(--warning)' : 'var(--success)'
                            }}
                          >
                            {top.accuracy}%
                          </span>
                          <div style={{ width: '60px' }}>
                            <ProgressBar
                              value={top.accuracy}
                              color={top.accuracy < 50 ? '#dc2626' : top.accuracy < 70 ? '#d97706' : '#16a34a'}
                              height={5}
                            />
                          </div>
                        </div>
                      </td>
                      <td>{top.attempts}</td>
                      <td>
                        <span
                          className={`badge ${
                            top.priority === 'High' ? 'badge-danger' : top.priority === 'Medium' ? 'badge-warning' : 'badge-success'
                          }`}
                        >
                          {top.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Time Allocation per Question */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Clock size={16} color="var(--accent-blue)" />
              <span>Average Time per Question</span>
            </h3>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {analyticsData.timeAnalysis.map(t => {
              const isOvertime = t.avgSeconds > t.targetSeconds;
              return (
                <div key={t.subject} style={{ padding: '12px', borderRadius: '6px', backgroundColor: 'var(--bg-surface-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600 }}>{t.subject}</span>
                    <span style={{ fontWeight: 700, color: isOvertime ? 'var(--danger)' : 'var(--success)' }}>
                      {t.avgSeconds}s
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Target benchmark: {t.targetSeconds}s</span>
                    <span>{isOvertime ? `+${t.avgSeconds - t.targetSeconds}s over target` : 'Optimal pace'}</span>
                  </div>
                </div>
              );
            })}

            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '8px' }}>
              <strong>Pacing Insight:</strong> Mathematics questions take 195s on average (target: 160s). Spending over 3.2 minutes per problem starves other high-yield questions of time.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
