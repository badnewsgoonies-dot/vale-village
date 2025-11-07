import React, { useMemo } from 'react';
import { useGame } from '@/context/GameContext';
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
  const { state } = useGame();

  // Force re-render when unit level changes or Djinn are equipped
  // This ensures abilities update when learned mid-battle
  const availableAbilities = useMemo(() => {
    return unit.getAvailableAbilities();
  }, [
    unit.id,
    unit.level,
    state.playerData.equippedDjinnIds.length,
    state.playerData.equippedDjinnIds.join(','), // Track actual Djinn equipped
  ]);

  return (
    <div className="action-menu ability-menu">
      <div className="menu-header">
        <button onClick={onBack} className="back-button">← Back</button>
        <h3 className="menu-title">Select Psynergy</h3>
      </div>
      <div className="ability-list">
        {availableAbilities.map(ability => {
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
