/**
 * VictoryOverlay Component
 * Displays victory fanfare animation after battle win
 */

import { useEffect, useState } from 'react';
import './VictoryOverlay.css';

interface VictoryOverlayProps {
  onComplete: () => void;
  duration?: number; // Default 2000ms
}

export function VictoryOverlay({ onComplete, duration = 2000 }: VictoryOverlayProps) {
  const [stage, setStage] = useState<'fanfare' | 'sparkles' | 'complete'>('fanfare');

  useEffect(() => {
    const fanfareTimer = setTimeout(() => {
      setStage('sparkles');
    }, 800);

    const completeTimer = setTimeout(() => {
      setStage('complete');
      onComplete();
    }, duration);

    return () => {
      clearTimeout(fanfareTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  if (stage === 'complete') return null;

  return (
    <div className="victory-overlay">
      <div className="victory-flash" />
      <div className="victory-text">
        <h1 className="victory-title">VICTORY!</h1>
        <div className="victory-stars">
          <span className="star star-1">⭐</span>
          <span className="star star-2">⭐</span>
          <span className="star star-3">⭐</span>
        </div>
      </div>
      {stage === 'sparkles' && (
        <div className="victory-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

