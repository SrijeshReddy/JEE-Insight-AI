import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  icon?: React.ReactNode;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  trend,
  icon,
  badge
}) => {
  return (
    <div className="stat-card">
      <div className="stat-label">
        <span>{label}</span>
        {icon && <span style={{ color: 'var(--text-muted)' }}>{icon}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div className="stat-value">{value}</div>
        {badge && <span className="badge badge-default">{badge}</span>}
      </div>
      {(subValue || trend) && (
        <div className="stat-meta">
          {trend && (
            <span
              style={{
                fontWeight: 600,
                color: trend.isNeutral ? 'var(--text-muted)' : trend.isPositive ? 'var(--success)' : 'var(--danger)'
              }}
            >
              {trend.value}
            </span>
          )}
          {subValue && <span>{subValue}</span>}
        </div>
      )}
    </div>
  );
};
