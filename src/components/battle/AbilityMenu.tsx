import React from 'react';
import type { Unit } from '@/types/Unit';
import type { Ability } from '@/types/Ability';

interface AbilityMenuProps {
  unit: Unit;
  onSelectAbility: (ability: Ability) => void;
  onBack: () => void;
}

export const AbilityMenu: React.FC<AbilityMenuProps> = ({
  unit,
  onSelectAbility,
  onBack
}) => {
  return (
    <div className="action-menu ability-menu">
      <div className="menu-header">
        <button onClick={onBack} className="back-button">← Back</button>
        <h3 className="menu-title">Select Psynergy</h3>
      </div>
      <div className="ability-list">
        {unit.getAvailableAbilities().map(ability => {
          const canUse = unit.canUseAbility(ability.id);
          return (
            <button
              key={ability.id}
              onClick={() => canUse && onSelectAbility(ability)}
              disabled={!canUse}
              className={`ability-button ${!canUse ? 'disabled' : ''}`}
            >
              <span className="ability-name">{ability.name}</span>
              <span className="pp-cost">{ability.ppCost} PP</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
