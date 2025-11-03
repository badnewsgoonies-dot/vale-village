import React from 'react';
import { BattleUnit } from '@/sprites';
import type { Unit } from '@/types/Unit';
import type { AnimationState } from '@/sprites/types';

interface UnitRowProps {
  units: Unit[];
  currentActor: Unit | null;
  onUnitClick?: (unit: Unit) => void;
  isEnemy: boolean;
}

export const UnitRow: React.FC<UnitRowProps> = ({
  units,
  currentActor,
  onUnitClick,
  isEnemy
}) => {
  return (
    <div className={isEnemy ? 'enemy-row' : 'party-row'}>
      {units.map(unit => {
        const stats = unit.calculateStats();
        const hpPercent = (unit.currentHp / stats.hp) * 100;
        const isActive = currentActor?.id === unit.id;
        const isKO = unit.currentHp <= 0;

        // Determine animation based on state
        let animation: AnimationState = 'Front';
        if (isKO) {
          animation = 'DownedFront';
        } else if (isActive) {
          animation = 'Attack1';
        }

        return (
          <div
            key={unit.id}
            className={`${isEnemy ? 'enemy' : 'hero'} ${isActive ? 'active' : ''} ${isKO ? 'ko' : ''}`}
            onClick={() => !isKO && onUnitClick?.(unit)}
            style={{ cursor: onUnitClick && !isKO ? 'pointer' : 'default' }}
          >
            <BattleUnit unit={unit} animation={animation} />
            {!isEnemy && (
              <div className="hp-bar-mini">
                <div
                  className="hp-fill"
                  style={{ width: `${Math.max(0, Math.min(100, hpPercent))}%` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
