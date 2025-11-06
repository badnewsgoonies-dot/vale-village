import React from 'react';
import './StatBar.css';

interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
  change?: number;
  className?: string;
}

export const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  maxValue,
  change,
  className = ''
}) => {
  const changeClass = change !== undefined
    ? change > 0
      ? 'stat-increase'
      : change < 0
        ? 'stat-decrease'
        : ''
    : '';

  return (
    <div className={`stat-bar ${className}`}>
      <span className="stat-label">{label}:</span>
      <span className={`stat-value ${changeClass}`}>
        {value}
        {maxValue && ` / ${maxValue}`}
        {change !== undefined && change !== 0 && ` (${change > 0 ? '+' : ''}${change})`}
      </span>
    </div>
  );
};
