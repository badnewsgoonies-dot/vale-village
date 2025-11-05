import React, { useEffect, useState } from 'react';
import './HitFlash.css';

interface HitFlashProps {
  type?: 'damage' | 'heal' | 'critical' | 'miss';
  duration?: number;
  onComplete?: () => void;
}

export const HitFlash: React.FC<HitFlashProps> = ({
  type = 'damage',
  duration = 200,
  onComplete
}) => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActive(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!active) return null;

  return (
    <div 
      className={`hit-flash hit-flash-${type}`}
      style={{ animationDuration: `${duration}ms` }}
    />
  );
};
