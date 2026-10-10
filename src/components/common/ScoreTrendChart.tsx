import React, { useState } from 'react';

export interface DataPoint {
  label: string;
  value: number;
  subLabel?: string;
  accuracy?: number;
}

interface ScoreTrendChartProps {
  data: DataPoint[];
  height?: number;
  targetScore?: number;
  maxScore?: number;
}

export const ScoreTrendChart: React.FC<ScoreTrendChartProps> = ({
  data,
  height = 240,
  targetScore = 210,
  maxScore = 300
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data available</div>;
  }

  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 40;
  const width = 680;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const minVal = 0;
  const maxVal = maxScore;

  const getX = (index: number) => {
    if (data.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    return paddingTop + chartHeight - ((clamped - minVal) / (maxVal - minVal)) * chartHeight;
  };

  const pointsString = data
    .map((d, i) => `${getX(i)},${getY(d.value)}`)
    .join(' ');

  // Area under line
  const areaString = `${getX(0)},${paddingTop + chartHeight} ${pointsString} ${getX(data.length - 1)},${paddingTop + chartHeight}`;

  const yTicks = [0, 75, 150, 225, 300];

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block', minWidth: '460px' }}
      >
        <defs>
          <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Y Grid lines and labels */}
        {yTicks.map(tick => {
          const y = getY(tick);
          return (
            <g key={tick}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="var(--border-default)"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="var(--text-muted)"
                fontFamily="var(--font-sans)"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Target score line */}
        {targetScore && targetScore <= maxScore && (
          <g>
            <line
              x1={paddingLeft}
              y1={getY(targetScore)}
              x2={width - paddingRight}
              y2={getY(targetScore)}
              stroke="#b45309"
              strokeDasharray="4 4"
              strokeWidth="1.2"
              opacity="0.8"
            />
            <text
              x={width - paddingRight}
              y={getY(targetScore) - 6}
              textAnchor="end"
              fontSize="10"
              fontWeight="600"
              fill="#b45309"
            >
              Target ({targetScore})
            </text>
          </g>
        )}

        {/* Area fill */}
        <polygon points={areaString} fill="url(#scoreAreaGradient)" />

        {/* The line */}
        <polyline
          fill="none"
          stroke="#2563eb"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={pointsString}
        />

        {/* Points and X Labels */}
        {data.map((d, i) => {
          const cx = getX(i);
          const cy = getY(d.value);
          const isHovered = hoveredIndex === i;

          return (
            <g key={i}>
              {/* Vertical guideline on hover */}
              {isHovered && (
                <line
                  x1={cx}
                  y1={paddingTop}
                  x2={cx}
                  y2={paddingTop + chartHeight}
                  stroke="var(--accent-blue)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              )}

              {/* Point circle */}
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 6 : 4}
                fill={isHovered ? '#1e3a8a' : '#2563eb'}
                stroke="#ffffff"
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />

              {/* X Axis Label */}
              <text
                x={cx}
                y={paddingTop + chartHeight + 18}
                textAnchor="middle"
                fontSize="11"
                fill={isHovered ? 'var(--text-primary)' : 'var(--text-muted)'}
                fontWeight={isHovered ? 600 : 400}
                fontFamily="var(--font-sans)"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {hoveredIndex !== null && data[hoveredIndex] && (
        <div
          style={{
            position: 'absolute',
            left: `${(getX(hoveredIndex) / width) * 100}%`,
            top: `${(getY(data[hoveredIndex].value) / height) * 100}%`,
            transform: 'translate(-50%, -115%)',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: 'var(--shadow-md)',
            zIndex: 10
          }}
        >
          <div style={{ fontWeight: 600 }}>{data[hoveredIndex].label}</div>
          <div>Score: <strong>{data[hoveredIndex].value}/300</strong></div>
          {data[hoveredIndex].accuracy !== undefined && (
            <div>Accuracy: {data[hoveredIndex].accuracy}%</div>
          )}
          {data[hoveredIndex].subLabel && (
            <div style={{ color: '#94a3b8', fontSize: '10px' }}>{data[hoveredIndex].subLabel}</div>
          )}
        </div>
      )}
    </div>
  );
};
