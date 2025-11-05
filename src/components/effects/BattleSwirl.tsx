import React, { useEffect, useState } from 'react';
import './BattleSwirl.css';

interface BattleSwirlProps {
  onComplete: () => void;
  duration?: number;
}

export const BattleSwirl: React.FC<BattleSwirlProps> = ({
  onComplete,
  duration = 1000
}) => {
  const [stage, setStage] = useState<'swirl' | 'fade' | 'complete'>('swirl');

  useEffect(() => {
    // Swirl animation: 0-800ms
    const swirlTimer = setTimeout(() => {
      setStage('fade');
    }, 800);

    // Fade to black: 800-1000ms
    const fadeTimer = setTimeout(() => {
      setStage('complete');
      onComplete();
    }, duration);

    return () => {
      clearTimeout(swirlTimer);
      clearTimeout(fadeTimer);
    };
  }, [duration, onComplete]);

  if (stage === 'complete') return null;

  return (
    <div className="battle-swirl-overlay">
      {stage === 'swirl' && (
        <div className="battle-swirl">
          <div className="swirl-circle swirl-1" />
          <div className="swirl-circle swirl-2" />
          <div className="swirl-circle swirl-3" />
          <div className="swirl-circle swirl-4" />
        </div>
      )}
      {stage === 'fade' && <div className="battle-fade" />}
    </div>
  );
};
