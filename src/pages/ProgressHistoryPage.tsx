import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Clock,
  Sparkles,
  Columns,
  Eye,
  CheckSquare,
  Square,
  AlertCircle
} from 'lucide-react';
import { HistoricalMockRecord } from '../types';
import { historyService } from '../services/historyService';
import { Modal } from '../components/common/Modal';
import { ProgressBar } from '../components/common/ProgressBar';
import { NavPage } from '../components/layout/Sidebar';

interface ProgressHistoryPageProps {
  onNavigate: (page: NavPage, topicContext?: string) => void;
}

export const ProgressHistoryPage: React.FC<ProgressHistoryPageProps> = ({ onNavigate }) => {
  const [historyList, setHistoryList] = useState<HistoricalMockRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMocksForCompare, setSelectedMocksForCompare] = useState<string[]>([]);
  const [compareResult, setCompareResult] = useState<any | null>(null);

  useEffect(() => {
    historyService.getAllHistory().then(list => setHistoryList(list));
  }, []);

  const handleToggleSelect = (mockId: string) => {
    setSelectedMocksForCompare(prev => {
      if (prev.includes(mockId)) {
        return prev.filter(id => id !== mockId);
      }
      if (prev.length >= 2) {
        // Keep the second one and add the new one
        return [prev[1], mockId];
      }
      return [...prev, mockId];
    });
  };

  const handleTriggerCompare = async () => {
    if (selectedMocksForCompare.length !== 2) return;
    const res = await historyService.compareTwoMocks(selectedMocksForCompare[0], selectedMocksForCompare[1]);
    setCompareResult(res);
  };

  const filteredHistory = historyList.filter(m =>
    m.mockName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      {/* Page Header */}
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
            Progress History & Benchmark Comparison
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Longitudinal log of all completed mock assessments with dual-test delta comparison tool.
          </p>
        </div>

        {selectedMocksForCompare.length === 2 && (
          <button
            onClick={handleTriggerCompare}
            className="btn btn-primary"
            style={{ gap: '6px' }}
          >
            <Columns size={15} />
            <span>Compare Selected Mocks (2 Selected)</span>
          </button>
        )}
      </div>

      {/* Demo Banner */}
      <div className="demo-banner" style={{ marginBottom: '24px' }}>
        <Sparkles size={15} color="var(--accent-blue)" />
        <span>
          <strong>Dual-Test Comparison Tool:</strong> Select checkboxes next to any two examinations to launch a forensic side-by-side comparison of scores, subject deltas, and time management.
        </span>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: '14px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search mock name or date..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-control"
              style={{ paddingLeft: '32px' }}
            />
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Select <strong>2 tests</strong> to enable comparison ({selectedMocksForCompare.length} selected)
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-body" style={{ padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '40px', textAlign: 'center' }}>Compare</th>
                  <th>Mock Examination</th>
                  <th>Date</th>
                  <th>Score (/300)</th>
                  <th>Accuracy</th>
                  <th>Time Spent</th>
                  <th>Progression Delta</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map(m => {
                  const isChecked = selectedMocksForCompare.includes(m.id);

                  return (
                    <tr key={m.id} style={{ backgroundColor: isChecked ? 'var(--accent-blue-light)' : 'transparent' }}>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => handleToggleSelect(m.id)}
                          style={{ color: isChecked ? 'var(--accent-blue)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Select to compare"
                        >
                          {isChecked ? <CheckSquare size={18} /> : <Square size={18} />}
                        </button>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.mockName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          Phys: {m.physicsScore} • Chem: {m.chemScore} • Math: {m.mathScore}
                        </div>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{m.date}</td>
                      <td>
                        <strong style={{ fontSize: '14px', color: 'var(--accent-primary)' }}>{m.score}</strong>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}> / 300</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{m.accuracy}%</span>
                      </td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                          <Clock size={12} color="var(--text-muted)" /> {m.timeSpentMinutes} mins
                        </span>
                      </td>
                      <td>
                        {m.scoreDelta === 0 ? (
                          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>— Baseline</span>
                        ) : (
                          <span
                            style={{
                              fontWeight: 600,
                              fontSize: '12px',
                              color: m.scoreDelta > 0 ? 'var(--success)' : 'var(--danger)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px'
                            }}
                          >
                            {m.scoreDelta > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                            {m.scoreDelta > 0 ? `+${m.scoreDelta}` : m.scoreDelta} pts
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => onNavigate('results')}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px', fontSize: '11px', gap: '4px' }}
                        >
                          <Eye size={12} />
                          <span>View Results</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      <Modal
        isOpen={compareResult !== null}
        onClose={() => setCompareResult(null)}
        title="Side-by-Side Mock Performance Comparison"
        maxWidth="740px"
      >
        {compareResult && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header Comparison Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--border-default)', backgroundColor: 'var(--bg-app)' }}>
                <span className="badge badge-default" style={{ marginBottom: '6px' }}>Benchmark 1</span>
                <h4 style={{ fontSize: '15px', fontWeight: 700 }}>{compareResult.mock1.mockName}</h4>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{compareResult.mock1.date}</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>
                  {compareResult.mock1.score} <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>/ 300</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Accuracy: {compareResult.mock1.accuracy}% • Time: {compareResult.mock1.timeSpentMinutes} mins
                </div>
              </div>

              <div style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--accent-blue-border)', backgroundColor: 'var(--accent-blue-light)' }}>
                <span className="badge badge-blue" style={{ marginBottom: '6px' }}>Benchmark 2</span>
                <h4 style={{ fontSize: '15px', fontWeight: 700 }}>{compareResult.mock2.mockName}</h4>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{compareResult.mock2.date}</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-blue)', marginTop: '8px' }}>
                  {compareResult.mock2.score} <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>/ 300</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Accuracy: {compareResult.mock2.accuracy}% • Time: {compareResult.mock2.timeSpentMinutes} mins
                </div>
              </div>
            </div>

            {/* Delta Metrics Table */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Differential Analysis:</h4>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>{compareResult.mock1.mockName.replace('JEE Main ', '')}</th>
                    <th>{compareResult.mock2.mockName.replace('JEE Main ', '')}</th>
                    <th>Net Difference</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Overall Score</strong></td>
                    <td>{compareResult.mock1.score}</td>
                    <td>{compareResult.mock2.score}</td>
                    <td>
                      <strong style={{ color: compareResult.scoreDelta >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {compareResult.scoreDelta >= 0 ? `+${compareResult.scoreDelta}` : compareResult.scoreDelta} marks
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Overall Accuracy</strong></td>
                    <td>{compareResult.mock1.accuracy}%</td>
                    <td>{compareResult.mock2.accuracy}%</td>
                    <td style={{ color: compareResult.accuracyDelta >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                      {compareResult.accuracyDelta >= 0 ? `+${compareResult.accuracyDelta}%` : `${compareResult.accuracyDelta}%`}
                    </td>
                  </tr>
                  <tr>
                    <td>Physics Scaled</td>
                    <td>{compareResult.mock1.physicsScore}</td>
                    <td>{compareResult.mock2.physicsScore}</td>
                    <td style={{ color: compareResult.physicsDelta >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {compareResult.physicsDelta >= 0 ? `+${compareResult.physicsDelta}` : compareResult.physicsDelta}
                    </td>
                  </tr>
                  <tr>
                    <td>Chemistry Scaled</td>
                    <td>{compareResult.mock1.chemScore}</td>
                    <td>{compareResult.mock2.chemScore}</td>
                    <td style={{ color: compareResult.chemDelta >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {compareResult.chemDelta >= 0 ? `+${compareResult.chemDelta}` : compareResult.chemDelta}
                    </td>
                  </tr>
                  <tr>
                    <td>Mathematics Scaled</td>
                    <td>{compareResult.mock1.mathScore}</td>
                    <td>{compareResult.mock2.mathScore}</td>
                    <td style={{ color: compareResult.mathDelta >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {compareResult.mathDelta >= 0 ? `+${compareResult.mathDelta}` : compareResult.mathDelta}
                    </td>
                  </tr>
                  <tr>
                    <td>Total Duration</td>
                    <td>{compareResult.mock1.timeSpentMinutes} mins</td>
                    <td>{compareResult.mock2.timeSpentMinutes} mins</td>
                    <td>{compareResult.timeDelta >= 0 ? `+${compareResult.timeDelta}m` : `${compareResult.timeDelta}m`}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Observations Box */}
            <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '6px' }}>
              <h5 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Diagnostic Observations:</h5>
              {compareResult.observations.map((obs: string, i: number) => (
                <div key={i} style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '4px' }}>
                  • {obs}
                </div>
              ))}
            </div>

            {/* Close Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setCompareResult(null)}
                className="btn btn-primary"
              >
                Close Comparison
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
