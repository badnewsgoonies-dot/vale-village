import React, { useEffect, useState } from 'react';
import './DefeatOverlay.css';

interface DefeatOverlayProps {
  onComplete: () => void;
  duration?: number;
}

export const DefeatOverlay: React.FC<DefeatOverlayProps> = ({
  onComplete,
  duration = 2000
}) => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActive(false);
      onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!active) return null;

  return (
    <div className="defeat-overlay">
      <div className="defeat-dim" />
      <div className="defeat-text">
        <h1 className="defeat-title">DEFEAT...</h1>
        <p className="defeat-subtitle">The battle is lost</p>
      </div>
    </div>
  );
};
