import React from 'react';
import './ManaCircles.css';

interface ManaCirclesProps {
  total: number;
  remaining: number;
}

export const ManaCircles: React.FC<ManaCirclesProps> = ({ total, remaining }) => {
  const circles = [];

  for (let i = 0; i < total; i++) {
    const isFilled = i < remaining;
    circles.push(
      <span
        key={i}
        className={`mana-circle ${isFilled ? 'filled' : 'empty'}`}
      >
        ●
      </span>
    );
  }

  return (
    <div className="mana-circles-container">
      <span className="mana-label">MANA:</span>
      <div className="mana-circles">
        {circles}
      </div>
      <span className="mana-count">{remaining}/{total}</span>
    </div>
  );
};
