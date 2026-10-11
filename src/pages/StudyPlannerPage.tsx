import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Plus,
  CheckCircle2,
  Clock,
  Filter,
  Sparkles,
  BookOpen,
  Calendar,
  Trash2,
  Edit2,
  TrendingUp,
  AlertCircle,
  Zap,
  ListTodo
} from 'lucide-react';
import { StudyTask, Subject, Priority } from '../types';
import { studyPlannerService } from '../services/studyPlannerService';
import { weakConceptsService } from '../services/weakConceptsService';
import { ProgressBar } from '../components/common/ProgressBar';
import { Modal } from '../components/common/Modal';

export const StudyPlannerPage: React.FC = () => {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<StudyTask | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // New / Edit task form state
  const [formSubject, setFormSubject] = useState<Subject>('Mathematics');
  const [formTopic, setFormTopic] = useState<string>('Integration (Definite & Indefinite)');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDay, setFormDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'>('Mon');
  const [formDuration, setFormDuration] = useState<number>(60);
  const [formType, setFormType] = useState<StudyTask['taskType']>('Concept Revision');
  const [formPriority, setFormPriority] = useState<Priority>('High');

  const loadTasks = async () => {
    const list = await studyPlannerService.getTasks();
    setTasks(list);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleToggle = async (taskId: string) => {
    const updated = await studyPlannerService.toggleTask(taskId);
    setTasks([...updated]);
  };

  const handleDelete = async (taskId: string) => {
    const updated = await studyPlannerService.deleteTask(taskId);
    setTasks([...updated]);
  };

  const handleOpenEdit = (task: StudyTask) => {
    setEditingTask(task);
    setFormSubject(task.subject);
    setFormTopic(task.topic);
    setFormTitle(task.title);
    setFormDay(task.day);
    setFormDuration(task.durationMinutes);
    setFormType(task.taskType);
    setFormPriority(task.priority);
    setShowAddModal(true);
  };

  const handleOpenAdd = () => {
    setEditingTask(null);
    setFormSubject('Mathematics');
    setFormTopic('Integration (Definite & Indefinite)');
    setFormTitle('');
    setFormDay('Mon');
    setFormDuration(60);
    setFormType('Concept Revision');
    setFormPriority('High');
    setShowAddModal(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingTask) {
      const updated = await studyPlannerService.updateTask(editingTask.id, {
        subject: formSubject,
        topic: formTopic,
        title: formTitle.trim(),
        day: formDay,
        durationMinutes: Number(formDuration),
        taskType: formType,
        priority: formPriority
      });
      setTasks([...updated]);
      setNotice('Task updated successfully.');
    } else {
      const updated = await studyPlannerService.addTask({
        day: formDay,
        subject: formSubject,
        topic: formTopic,
        title: formTitle.trim(),
        durationMinutes: Number(formDuration),
        taskType: formType,
        priority: formPriority,
        reason: 'User created scheduled objective.'
      });
      setTasks([...updated]);
      setNotice('New study objective added.');
    }

    setShowAddModal(false);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleAutoGenerateFromWeakTopics = async () => {
    const weak = await weakConceptsService.getTopics({ priority: 'High' });
    if (weak.length === 0) return;

    const days: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri')[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    for (let i = 0; i < Math.min(3, weak.length); i++) {
      const t = weak[i];
      await studyPlannerService.addTask({
        day: days[i % days.length],
        subject: t.subject,
        topic: t.topic,
        title: `Auto-Planned: Focused drill & error autopsy on ${t.topic} (${t.accuracy}% acc)`,
        durationMinutes: 75,
        taskType: 'Concept Revision',
        priority: 'High',
        reason: t.reason
      });
    }

    const refreshed = await studyPlannerService.getTasks();
    setTasks([...refreshed]);
    setNotice(`Auto-generated 3 high-priority objectives from your diagnostic weaknesses!`);
    setTimeout(() => setNotice(null), 4000);
  };

  // Calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const weeklyCompletionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalPlannedMinutes = tasks.reduce((sum, t) => sum + t.durationMinutes, 0);
  const completedMinutes = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.durationMinutes, 0);

  // Filtered tasks
  const displayedTasks = tasks.filter(t => {
    if (selectedDay !== 'All' && t.day !== selectedDay) return false;
    if (selectedSubject !== 'All' && t.subject !== selectedSubject) return false;
    if (selectedPriority !== 'All' && t.priority !== selectedPriority) return false;
    if (filterStatus === 'Pending' && t.completed) return false;
    if (filterStatus === 'Completed' && !t.completed) return false;
    return true;
  });

  const daysList = ['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Adaptive Study Planner
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Structured daily and weekly revision objectives targeting high-yield score gaps.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleAutoGenerateFromWeakTopics}
            className="btn btn-secondary"
            style={{ gap: '6px' }}
          >
            <Zap size={15} color="var(--accent-blue)" />
            <span>Auto-Plan From Weak Topics</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="btn btn-primary"
            style={{ gap: '6px' }}
          >
            <Plus size={15} />
            <span>Add Custom Objective</span>
          </button>
        </div>
      </div>

      {notice && (
        <div
          className="demo-banner"
          style={{
            backgroundColor: 'var(--success-bg)',
            borderColor: 'var(--success-border)',
            color: 'var(--success)',
            marginBottom: '16px'
          }}
        >
          {notice}
        </div>
      )}

      {/* Weekly Progress Overview Card */}
      <div
        className="card"
        style={{
          padding: '20px 24px',
          marginBottom: '24px',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'center' }} className="planner-overview-grid">
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Weekly Objective Completion
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              {weeklyCompletionPercent}%
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              <strong>{completedTasks}</strong> of <strong>{totalTasks}</strong> tasks completed ({Math.round(completedMinutes / 60)}h / {Math.round(totalPlannedMinutes / 60)}h)
            </div>
          </div>

          <div>
            <ProgressBar value={weeklyCompletionPercent} height={10} color="var(--accent-blue)" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
              <span>Target: 6 hours daily study pace</span>
              <span>Calculus & Mechanics prioritization active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Day Selector Toolbar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Day Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginRight: '4px' }}>
              Day:
            </span>
            {daysList.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`btn btn-sm ${selectedDay === d ? 'btn-primary' : 'btn-secondary'}`}
                style={{ minWidth: '42px' }}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Subject Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Subject:</span>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="select-control"
            >
              <option value="All">All Subjects</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
            </select>
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
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
            {(['All', 'Pending', 'Completed'] as const).map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">
            <CalendarCheck size={16} color="var(--accent-blue)" />
            <span>Scheduled Tasks ({displayedTasks.length})</span>
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Click checkbox to mark complete
          </span>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {displayedTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
              No study tasks found for this day or filter. Click "Add Custom Objective" or "Auto-Plan From Weak Topics".
            </div>
          ) : (
            displayedTasks.map(task => {
              return (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: '8px',
                    border: `1px solid ${task.completed ? 'var(--border-subtle)' : 'var(--border-default)'}`,
                    backgroundColor: task.completed ? 'var(--bg-surface-subtle)' : 'var(--bg-surface)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggle(task.id)}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                        accentColor: 'var(--accent-blue)'
                      }}
                      id={`chk-${task.id}`}
                    />

                    <div>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: task.completed ? 'line-through' : 'none'
                        }}
                      >
                        {task.title}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '12px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                        <span className="badge badge-default" style={{ fontSize: '10px' }}>{task.day}</span>
                        <span>•</span>
                        <span>{task.subject}</span>
                        <span>•</span>
                        <span>{task.topic}</span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {task.durationMinutes} mins
                        </span>
                        <span>•</span>
                        <span className="badge badge-default" style={{ fontSize: '10px' }}>{task.taskType}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      className={`badge ${
                        task.priority === 'High' ? 'badge-danger' : task.priority === 'Medium' ? 'badge-warning' : 'badge-default'
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                    <button
                      onClick={() => handleOpenEdit(task)}
                      className="btn btn-subtle btn-sm"
                      style={{ padding: '6px', color: 'var(--text-muted)' }}
                      title="Edit Task"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="btn btn-subtle btn-sm"
                      style={{ padding: '6px', color: 'var(--text-muted)' }}
                      title="Delete Task"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add / Edit Task Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingTask ? 'Edit Study Objective' : 'Add New Study Objective'}
      >
        <form onSubmit={handleSaveTask} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
              Task Title / Description
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Solve 20 timed definite integral problems"
              value={formTitle}
              onChange={e => setFormTitle(e.target.value)}
              className="input-control"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
                Subject
              </label>
              <select
                value={formSubject}
                onChange={e => setFormSubject(e.target.value as Subject)}
                className="select-control"
                style={{ width: '100%' }}
              >
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
                Day of Week
              </label>
              <select
                value={formDay}
                onChange={e => setFormDay(e.target.value as any)}
                className="select-control"
                style={{ width: '100%' }}
              >
                <option value="Mon">Monday</option>
                <option value="Tue">Tuesday</option>
                <option value="Wed">Wednesday</option>
                <option value="Thu">Thursday</option>
                <option value="Fri">Friday</option>
                <option value="Sat">Saturday</option>
                <option value="Sun">Sunday</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
              Topic Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Integration (Definite & Indefinite)"
              value={formTopic}
              onChange={e => setFormTopic(e.target.value)}
              className="input-control"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
                Duration (minutes)
              </label>
              <input
                type="number"
                min="15"
                max="240"
                step="15"
                value={formDuration}
                onChange={e => setFormDuration(Number(e.target.value))}
                className="input-control"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
                Priority
              </label>
              <select
                value={formPriority}
                onChange={e => setFormPriority(e.target.value as Priority)}
                className="select-control"
                style={{ width: '100%' }}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
              Task Type
            </label>
            <select
              value={formType}
              onChange={e => setFormType(e.target.value as any)}
              className="select-control"
              style={{ width: '100%' }}
            >
              <option value="Concept Revision">Concept Revision</option>
              <option value="Timed Practice">Timed Practice</option>
              <option value="Formula Sheet">Formula Sheet</option>
              <option value="Mock Analysis">Mock Analysis</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingTask ? 'Save Changes' : 'Add Objective'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
