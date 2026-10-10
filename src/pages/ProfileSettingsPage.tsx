import React, { useState, useEffect } from 'react';
import {
  User,
  Settings,
  Target,
  Clock,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Moon,
  Sun
} from 'lucide-react';
import { StudentProfile, Subject } from '../types';
import { profileService } from '../services/profileService';
import { studyPlannerService } from '../services/studyPlannerService';
import { aiCoachService } from '../services/aiCoachService';

interface ProfileSettingsPageProps {
  onProfileUpdated?: (profile: StudentProfile) => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

export const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({
  onProfileUpdated,
  isDarkTheme,
  onToggleTheme
}) => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [name, setName] = useState<string>('');
  const [targetExam, setTargetExam] = useState<string>('JEE Main 2027 (April Session)');
  const [targetScore, setTargetScore] = useState<number>(210);
  const [dailyHours, setDailyHours] = useState<number>(6);
  const [preferredSubjects, setPreferredSubjects] = useState<Subject[]>(['Mathematics', 'Chemistry']);
  const [timerMode, setTimerMode] = useState<'Standard (180 min)' | 'Flexible Demo'>('Flexible Demo');

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  useEffect(() => {
    profileService.getProfile().then(p => {
      setProfile(p);
      setName(p.name);
      setTargetExam(p.targetExam);
      setTargetScore(p.targetScore);
      setDailyHours(p.dailyStudyHours);
      setPreferredSubjects(p.preferredSubjects);
      setTimerMode(p.timerMode);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await profileService.updateProfile({
      name: name.trim() || 'Aarav Sharma',
      targetExam,
      targetScore: Number(targetScore),
      dailyStudyHours: Number(dailyHours),
      preferredSubjects,
      timerMode
    });
    setProfile(updated);
    if (onProfileUpdated) onProfileUpdated(updated);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDemoData = async () => {
    if (window.confirm('Reset all demo state? This will restore initial mock history, sample tasks, and default student settings.')) {
      localStorage.clear();
      const fresh = await profileService.resetProfile();
      await studyPlannerService.resetTasks();
      await aiCoachService.clearChat();
      setProfile(fresh);
      setName(fresh.name);
      setTargetExam(fresh.targetExam);
      setTargetScore(fresh.targetScore);
      setDailyHours(fresh.dailyStudyHours);
      setPreferredSubjects(fresh.preferredSubjects);
      setTimerMode(fresh.timerMode);

      if (onProfileUpdated) onProfileUpdated(fresh);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const toggleSubject = (s: Subject) => {
    setPreferredSubjects(prev =>
      prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]
    );
  };

  if (!profile) return <div className="page-container">Loading student profile...</div>;

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      {/* Title Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Profile & Examination Settings
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Manage your demonstration aspirant identity, examination targets, and platform study parameters.
        </p>
      </div>

      {/* Demo Notice */}
      <div className="demo-banner" style={{ marginBottom: '24px' }}>
        <Sparkles size={15} color="var(--accent-blue)" />
        <span>
          <strong>Prototype Configuration:</strong> Updating these fields modifies localized browser session state. No external authentication server is required in this demonstration phase.
        </span>
      </div>

      {savedSuccess && (
        <div className="demo-banner" style={{ backgroundColor: 'var(--success-bg)', borderColor: 'var(--success-border)', color: 'var(--success)', marginBottom: '16px' }}>
          Profile preferences updated successfully!
        </div>
      )}

      {resetSuccess && (
        <div className="demo-banner" style={{ backgroundColor: 'var(--success-bg)', borderColor: 'var(--success-border)', color: 'var(--success)', marginBottom: '16px' }}>
          All demonstration state restored to default baseline.
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Student Profile Card */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <h3 className="card-title">
              <User size={16} color="var(--accent-blue)" />
              <span>Aspirant Identity</span>
            </h3>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
                  Student Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="input-control"
                  placeholder="e.g. Aarav Sharma"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
                  Target Examination Session
                </label>
                <select
                  value={targetExam}
                  onChange={e => setTargetExam(e.target.value)}
                  className="select-control"
                  style={{ width: '100%' }}
                >
                  <option>JEE Main 2027 (April Session)</option>
                  <option>JEE Main 2027 (January Session)</option>
                  <option>JEE Advanced 2027</option>
                  <option>JEE Main 2028 Foundation</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Preparation Targets Card */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <h3 className="card-title">
              <Target size={16} color="var(--accent-teal)" />
              <span>Target Benchmarks & Study Rhythm</span>
            </h3>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
                  Target Examination Score (/300)
                </label>
                <input
                  type="number"
                  min="80"
                  max="300"
                  step="5"
                  value={targetScore}
                  onChange={e => setTargetScore(Number(e.target.value))}
                  className="input-control"
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Current baseline: 112/300 (+{Math.max(0, targetScore - 112)} marks required)
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
                  Preferred Daily Study Hours
                </label>
                <input
                  type="number"
                  min="2"
                  max="14"
                  step="1"
                  value={dailyHours}
                  onChange={e => setDailyHours(Number(e.target.value))}
                  className="input-control"
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Used to calibrate weekly objective allocation in the Study Planner.
                </span>
              </div>
            </div>

            {/* Focus Subjects */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>
                Priority Revision Focus Areas
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {(['Physics', 'Chemistry', 'Mathematics'] as const).map(s => {
                  const isChecked = preferredSubjects.includes(s);
                  return (
                    <button
                      type="button"
                      key={s}
                      onClick={() => toggleSubject(s)}
                      className={`btn btn-sm ${isChecked ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {s} {isChecked ? '✓' : '+'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Test Timer Mode */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
                Mock Test Engine Timer Mode
              </label>
              <select
                value={timerMode}
                onChange={e => setTimerMode(e.target.value as any)}
                className="select-control"
                style={{ width: '100%' }}
              >
                <option value="Flexible Demo">Flexible Demo (Accelerated pacing for testing)</option>
                <option value="Standard (180 min)">Standard (180 min Strict Examination Clock)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
          <button
            type="button"
            onClick={handleResetDemoData}
            className="btn btn-secondary"
            style={{ color: 'var(--danger)', gap: '6px' }}
          >
            <RotateCcw size={14} />
            <span>Reset All Demo State to Default</span>
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ gap: '6px', padding: '10px 22px' }}
          >
            <Save size={15} />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
