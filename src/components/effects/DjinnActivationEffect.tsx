import React, { useState, useEffect } from 'react';
import type { Djinn } from '@/types/Djinn';
import './DjinnActivationEffect.css';

interface DjinnActivationEffectProps {
  djinn: Djinn;
  onComplete: () => void;
}

export const DjinnActivationEffect: React.FC<DjinnActivationEffectProps> = ({ djinn, onComplete }) => {
  const [stage, setStage] = useState<'grow' | 'glow' | 'explode' | 'complete'>('grow');

  useEffect(() => {
    // Timing: 1.5 seconds total
    const timers = [
      setTimeout(() => setStage('glow'), 400),     // 0-400ms: grow
      setTimeout(() => setStage('explode'), 900),  // 400-900ms: glow
      setTimeout(() => setStage('complete'), 1500), // 900-1500ms: explode
      setTimeout(() => onComplete(), 1600),         // Cleanup
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const elementClass = djinn.element.toLowerCase();
  const djinnSpritePath = `/sprites/battle/djinn/${djinn.element}_Djinn_Front.gif`;

  return (
    <div className="djinn-activation-overlay">
      <div className={`djinn-activation ${stage}`}>
        {/* Djinn sprite with animations */}
        <div className="djinn-sprite-container">
          <img 
            src={djinnSpritePath} 
            alt={djinn.name}
            className="djinn-sprite"
            onError={(e) => {
              e.currentTarget.src = '/sprites/battle/djinn/Venus_Djinn_Front.gif';
            }}
          />
        </div>

        {/* Element-colored flash */}
        {stage === 'explode' && (
          <div className={`element-flash ${elementClass}`} />
        )}

        {/* Particles */}
        {stage === 'explode' && (
          <div className="particles">
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i} 
                className={`particle ${elementClass}`}
                style={{
                  '--angle': `${(i * 30)}deg`,
                  '--delay': `${i * 0.05}s`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}

        {/* Djinn name text */}
        <div className="djinn-name-display">
          {djinn.name}
        </div>
      </div>
    </div>
  );
};
