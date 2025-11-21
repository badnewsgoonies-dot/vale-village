/**
 * Mana Circles Bar Component
 * PR-MANA-QUEUE: Displays team mana pool with filled/empty circles
 */

import * as React from 'react';

interface ManaCirclesBarProps {
  remainingMana: number;
  maxMana: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ManaCirclesBar({ remainingMana, maxMana, className, style }: ManaCirclesBarProps) {
  const circles = Array.from({ length: maxMana }, (_, i) => i < remainingMana);

  return (
    <div
      className={`mana-circles-bar ${className || ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: 'monospace',
        fontSize: '1rem',
        ...style,
      }}
      role="status"
      aria-label={`Mana: ${remainingMana} of ${maxMana} circles available`}
    >
      <span style={{ fontWeight: 'bold', color: '#4CAF50' }}>MANA:</span>
      <div
        style={{
          display: 'flex',
          gap: '0.25rem',
          alignItems: 'center',
        }}
        aria-hidden="true"
      >
        {circles.map((filled, index) => (
          <span
            key={index}
            style={{
              display: 'inline-block',
              width: '1rem',
              height: '1rem',
              borderRadius: '50%',
              backgroundColor: filled ? '#4CAF50' : '#666',
              border: '1px solid #333',
            }}
            title={filled ? 'Available' : 'Spent'}
          >
            {filled ? '●' : '○'}
          </span>
        ))}
      </div>
      <span style={{ color: '#e0e0e0' }}>
        {remainingMana}/{maxMana}
      </span>
    </div>
  );
}

