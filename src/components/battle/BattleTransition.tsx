import React, { useState, useEffect } from 'react';
import './BattleTransition.css';

interface BattleTransitionProps {
  onComplete?: () => void;
}

export const BattleTransition: React.FC<BattleTransitionProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'overworld' | 'swirl' | 'fade' | 'battle'>('overworld');

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage('swirl'), 700),
      setTimeout(() => setStage('fade'), 1700),
      setTimeout(() => setStage('battle'), 1800),
      setTimeout(() => onComplete?.(), 2300)
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="battle-transition-container">
      {/* Overworld Layer */}
      <div className="transition-overworld">
        <div className="overworld-player">I</div>
      </div>

      {/* Swirl Layer */}
      {stage !== 'overworld' && (
        <div className="transition-swirl">
          <div className="swirl-layer-1"></div>
          <div className="swirl-layer-2"></div>
        </div>
      )}

      {/* Fade Layer */}
      {(stage === 'fade' || stage === 'battle') && (
        <div className="transition-fade"></div>
      )}

      {/* Battle Layer */}
      {stage === 'battle' && (
        <div className="transition-battle">
          <div className="battle-title">BATTLE START!</div>
          <div className="battle-enemies" role="img" aria-label="Three enemies appear">
            <div className="enemy-sprite">E1</div>
            <div className="enemy-sprite">E2</div>
            <div className="enemy-sprite">E3</div>
          </div>
        </div>
      )}
    </div>
  );
};
