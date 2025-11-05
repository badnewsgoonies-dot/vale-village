import React from 'react';
import { BattleUnit } from '@/sprites';
import type { Unit } from '@/types/Unit';

interface PartyPortraitsProps {
  units: Unit[];
  currentActor: Unit | null;
}

export const PartyPortraits: React.FC<PartyPortraitsProps> = ({
  units,
  currentActor
}) => {
  return (
    <div className="portraits">
      {units.map(unit => {
        const isActive = currentActor?.id === unit.id;
        const isKO = unit.currentHp <= 0;

        return (
          <div
            key={unit.id}
            className={`portrait ${isActive ? 'active' : ''} ${isKO ? 'ko' : ''}`}
          >
            <BattleUnit unit={unit} animation="Front" />
            <span className="char-name">{unit.name}</span>
          </div>
        );
      })}
    </div>
  );
};
