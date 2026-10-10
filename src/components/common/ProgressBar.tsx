import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  height?: number;
  color?: string;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  height = 7,
  color = 'var(--accent-blue)',
  label,
  showPercentage = false
}) => {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div style={{ width: '100%' }}>
      {(label || showPercentage) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>
          {label && <span>{label}</span>}
          {showPercentage && <span style={{ fontWeight: 600 }}>{clamped}%</span>}
        </div>
      )}
      <div className="progress-bar-bg" style={{ height }}>
        <div
          className="progress-bar-fill"
          style={{
            width: `${clamped}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
};
