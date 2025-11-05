import React, { useState, useEffect } from 'react';
import type { Unit } from '@/types/Unit';
import './RecruitmentCelebration.css';

interface RecruitmentCelebrationProps {
  unit: Unit;
  onComplete: () => void;
}

export const RecruitmentCelebration: React.FC<RecruitmentCelebrationProps> = ({ unit, onComplete }) => {
  const [stage, setStage] = useState<'enter' | 'sparkle' | 'complete'>('enter');

  useEffect(() => {
    // Timing: ~2.5 seconds total
    const timers = [
      setTimeout(() => setStage('sparkle'), 500),  // 0-500ms: unit enters
      setTimeout(() => setStage('complete'), 2000), // 500-2000ms: sparkles
      setTimeout(() => onComplete(), 2500),         // Cleanup
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="recruitment-overlay">
      <div className="recruitment-container">
        {/* Unit sprite */}
        <div className={`recruitment-unit ${stage}`}>
          <img
            src={`/sprites/overworld/protagonists/${unit.name}.gif`}
            alt={unit.name}
            className="unit-sprite"
            onError={(e) => {
              e.currentTarget.src = '/sprites/overworld/protagonists/Isaac.gif';
            }}
          />
        </div>

        {/* Sparkle particles */}
        {(stage === 'sparkle' || stage === 'complete') && (
          <div className="sparkles">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="sparkle"
                style={{
                  '--angle': `${(i * 18)}deg`,
                  '--distance': `${80 + Math.random() * 40}px`,
                  '--delay': `${i * 0.05}s`,
                  '--duration': `${1 + Math.random() * 0.5}s`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}

        {/* Celebration text */}
        {stage !== 'enter' && (
          <div className="recruitment-text">
            <div className="unit-name">{unit.name}</div>
            <div className="joined-message">joined your party!</div>
          </div>
        )}

        {/* Character element/class info */}
        {stage !== 'enter' && (
          <div className="unit-info">
            <div className="element-badge">{unit.element}</div>
            <div className="unit-stats">
              <span>Lv {unit.level}</span>
              <span className="separator">•</span>
              <span>{unit.role}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
