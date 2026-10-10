import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Search,
  Filter,
  ArrowUpDown,
  TrendingDown,
  TrendingUp,
  Minus,
  Sparkles,
  BookOpen,
  CalendarCheck,
  Bot,
  ChevronRight,
  Info
} from 'lucide-react';
import { TopicPerformance, Subject, Priority } from '../types';
import { weakConceptsService } from '../services/weakConceptsService';
import { studyPlannerService } from '../services/studyPlannerService';
import { Modal } from '../components/common/Modal';
import { ProgressBar } from '../components/common/ProgressBar';
import { NavPage } from '../components/layout/Sidebar';

interface WeakConceptsPageProps {
  onNavigate: (page: NavPage, topicContext?: string) => void;
}

export const WeakConceptsPage: React.FC<WeakConceptsPageProps> = ({ onNavigate }) => {
  const [topics, setTopics] = useState<TopicPerformance[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'accuracy-asc' | 'accuracy-desc' | 'attempts-desc' | 'time-desc' | 'priority'>('priority');

  // Selected Topic for Detail Drawer/Modal
  const [activeTopic, setActiveTopic] = useState<TopicPerformance | null>(null);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const loadTopics = () => {
    weakConceptsService
      .getTopics({
        subject: selectedSubject,
        priority: selectedPriority,
        search: searchQuery,
        sortBy
      })
      .then(data => setTopics(data));
  };

  useEffect(() => {
    loadTopics();
  }, [selectedSubject, selectedPriority, searchQuery, sortBy]);

  const handleAddTopicToPlanner = async (topic: TopicPerformance) => {
    await studyPlannerService.addTask({
      day: 'Tue',
      subject: topic.subject,
      topic: topic.topic,
      title: `Dedicated revision & 20 problem practice on ${topic.topic}`,
      durationMinutes: 60,
      taskType: 'Concept Revision',
      priority: topic.priority,
      reason: topic.reason
    });
    setAddedNotice(`"${topic.topic}" added to your Study Planner!`);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  return (
    <div className="page-container">
      {/* Title Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Weak Concepts Priority Matrix
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Evidence-based diagnosis isolating conceptual bottlenecks by accuracy, solving time, and penalty frequency.
        </p>
      </div>

      {/* Demo Banner */}
      <div className="demo-banner" style={{ marginBottom: '24px' }}>
        <Sparkles size={15} color="var(--accent-blue)" />
        <span>
          <strong>Demonstration Priority Engine:</strong> Topics are classified into Priority tiers using transparent empirical rules (Accuracy &lt; 50% with high attempt volume = High Priority). Click any row to inspect subtopic diagnostics or add tasks to your study planner.
        </span>
      </div>

      {addedNotice && (
        <div
          className="demo-banner"
          style={{
            backgroundColor: 'var(--success-bg)',
            borderColor: 'var(--success-border)',
            color: 'var(--success)',
            marginBottom: '16px'
          }}
        >
          {addedNotice}
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search topic or subtopic..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-control"
              style={{ paddingLeft: '32px' }}
            />
          </div>

          {/* Subject Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Subject:</span>
            {['All', 'Physics', 'Chemistry', 'Mathematics'].map(s => (
              <button
                key={s}
                onClick={() => setSelectedSubject(s)}
                className={`btn btn-sm ${selectedSubject === s ? 'btn-primary' : 'btn-secondary'}`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Priority Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Priority:</span>
            <select
              value={selectedPriority}
              onChange={e => setSelectedPriority(e.target.value)}
              className="select-control"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="select-control"
            >
              <option value="priority">Priority Tier</option>
              <option value="accuracy-asc">Lowest Accuracy First</option>
              <option value="accuracy-desc">Highest Accuracy First</option>
              <option value="attempts-desc">Most Attempts</option>
              <option value="time-desc">Longest Solving Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Topic Analysis Table */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-body" style={{ padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Topic Name</th>
                  <th>Subject</th>
                  <th>Accuracy</th>
                  <th>Attempts</th>
                  <th>Avg Time</th>
                  <th>Trend</th>
                  <th>Priority</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {topics.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      No topics match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  topics.map(t => {
                    const isHigh = t.priority === 'High';
                    const isMed = t.priority === 'Medium';

                    return (
                      <tr
                        key={t.id}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setActiveTopic(t)}
                      >
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.topic}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {t.subtopics.slice(0, 3).join(', ')}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-default">{t.subject}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                fontWeight: 700,
                                width: '32px',
                                color: t.accuracy < 50 ? 'var(--danger)' : t.accuracy < 70 ? 'var(--warning)' : 'var(--success)'
                              }}
                            >
                              {t.accuracy}%
                            </span>
                            <div style={{ width: '60px' }}>
                              <ProgressBar
                                value={t.accuracy}
                                color={t.accuracy < 50 ? '#dc2626' : t.accuracy < 70 ? '#d97706' : '#16a34a'}
                                height={5}
                              />
                            </div>
                          </div>
                        </td>
                        <td>{t.attemptCount}</td>
                        <td>{t.avgTimeSeconds}s</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                            {t.trend === 'Declining' && <TrendingDown size={14} color="var(--danger)" />}
                            {t.trend === 'Improving' && <TrendingUp size={14} color="var(--success)" />}
                            {t.trend === 'Stable' && <Minus size={14} color="var(--text-muted)" />}
                            <span>{t.trend}</span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              isHigh ? 'badge-danger' : isMed ? 'badge-warning' : 'badge-success'
                            }`}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td onClick={e => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => setActiveTopic(t)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                            >
                              Inspect
                            </button>
                            <button
                              onClick={() => handleAddTopicToPlanner(t)}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                              title="Add to Study Plan"
                            >
                              + Plan
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Topic Detail Inspection Modal */}
      <Modal
        isOpen={activeTopic !== null}
        onClose={() => setActiveTopic(null)}
        title={activeTopic ? `Diagnostic: ${activeTopic.topic}` : 'Topic Details'}
        maxWidth="640px"
      >
        {activeTopic && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Header info */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border-default)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-default">{activeTopic.subject}</span>
                <span
                  className={`badge ${
                    activeTopic.priority === 'High' ? 'badge-danger' : activeTopic.priority === 'Medium' ? 'badge-warning' : 'badge-success'
                  }`}
                >
                  {activeTopic.priority} Priority
                </span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>
                Accuracy: <strong style={{ color: activeTopic.accuracy < 50 ? 'var(--danger)' : 'var(--success)' }}>{activeTopic.accuracy}%</strong> ({activeTopic.attemptCount} attempts)
              </div>
            </div>

            {/* Why prioritized */}
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Observed Conceptual Bottleneck
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, backgroundColor: 'var(--bg-surface-subtle)', padding: '12px', borderRadius: '6px' }}>
                {activeTopic.reason}
              </p>
            </div>

            {/* Recommended Action */}
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Actionable Remediation Prescription
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, backgroundColor: 'var(--accent-blue-light)', border: '1px solid var(--accent-blue-border)', padding: '12px', borderRadius: '6px' }}>
                {activeTopic.recommendedAction}
              </p>
            </div>

            {/* Subtopics Checklist */}
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Core Subtopics in Scope:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {activeTopic.subtopics.map((st, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', padding: '6px 10px', backgroundColor: 'var(--bg-app)', borderRadius: '4px' }}>
                    <span style={{ color: 'var(--accent-blue)' }}>•</span>
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-default)' }}>
              <button
                onClick={() => {
                  setActiveTopic(null);
                  onNavigate('ai-coach', activeTopic.topic);
                }}
                className="btn btn-secondary"
                style={{ gap: '6px' }}
              >
                <Bot size={15} />
                <span>Discuss with AI Coach</span>
              </button>
              <button
                onClick={() => {
                  handleAddTopicToPlanner(activeTopic);
                  setActiveTopic(null);
                }}
                className="btn btn-primary"
                style={{ gap: '6px' }}
              >
                <CalendarCheck size={15} />
                <span>Add to Study Planner</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
