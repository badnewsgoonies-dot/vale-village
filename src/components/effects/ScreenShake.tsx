import React, { useEffect, useState } from 'react';
import './ScreenShake.css';

interface ScreenShakeProps {
  intensity?: 'light' | 'medium' | 'heavy';
  duration?: number;
  onComplete?: () => void;
}

export const ScreenShake: React.FC<ScreenShakeProps> = ({
  intensity = 'medium',
  duration = 300,
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
      className={`screen-shake screen-shake-${intensity}`}
      style={{ animationDuration: `${duration}ms` }}
    />
  );
};
