import React, { useState, useEffect } from 'react';
import type { Unit } from '@/types/Unit';
import './LevelUpEffect.css';

interface LevelUpEffectProps {
  unit: Unit;
  newLevel: number;
  newAbilities?: string[];
  onComplete: () => void;
}

export const LevelUpEffect: React.FC<LevelUpEffectProps> = ({ 
  unit, 
  newLevel, 
  newAbilities = [],
  onComplete 
}) => {
  const [stage, setStage] = useState<'flash' | 'text' | 'abilities' | 'complete'>('flash');

  useEffect(() => {
    // Timing: ~2 seconds total
    const timers = [
      setTimeout(() => setStage('text'), 300),      // 0-300ms: flash
      setTimeout(() => setStage('abilities'), 1000), // 300-1000ms: show "LEVEL UP!"
      setTimeout(() => setStage('complete'), 2000),  // 1000-2000ms: show new abilities
      setTimeout(() => onComplete(), 2100),          // Cleanup
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="level-up-overlay">
      <div className="level-up-container">
        {/* Golden flash */}
        {(stage === 'flash' || stage === 'text') && (
          <div className="level-up-flash" />
        )}

        {/* Unit portrait */}
        {stage !== 'flash' && (
          <div className="level-up-unit">
            <img
              src={`/sprites/overworld/protagonists/${unit.name}.gif`}
              alt={unit.name}
              className="unit-portrait"
              onError={(e) => {
                e.currentTarget.src = '/sprites/overworld/protagonists/Isaac.gif';
              }}
            />
          </div>
        )}

        {/* LEVEL UP text */}
        {(stage === 'text' || stage === 'abilities' || stage === 'complete') && (
          <div className="level-up-text">
            LEVEL UP!
          </div>
        )}

        {/* New level display */}
        {(stage === 'text' || stage === 'abilities' || stage === 'complete') && (
          <div className="level-number">
            {unit.name} reached Level {newLevel}!
          </div>
        )}

        {/* New abilities */}
        {(stage === 'abilities' || stage === 'complete') && newAbilities.length > 0 && (
          <div className="new-abilities">
            <div className="abilities-title">New Abilities:</div>
            <ul className="abilities-list">
              {newAbilities.map((ability, index) => (
                <li key={index} className="ability-item">
                  ★ {ability}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
