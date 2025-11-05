import React, { useEffect, useState } from 'react';
import './DamageNumber.css';

interface DamageNumberProps {
  value: number;
  type: 'damage' | 'heal' | 'critical';
  position: { x: number; y: number };
  onComplete?: () => void;
}

export const DamageNumber: React.FC<DamageNumberProps> = ({ value, type, position, onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Animation duration: 1.2 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 1200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  const displayValue = Math.abs(Math.round(value));
  const prefix = type === 'heal' ? '+' : '';

  return (
    <div
      className={`damage-number damage-number-${type}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      role="status"
      aria-live="polite"
      aria-label={`${type === 'heal' ? 'Healed' : 'Damaged'} ${displayValue}`}
    >
      {prefix}{displayValue}
    </div>
  );
};
