import React, { useMemo } from 'react';
import { useGame } from '@/context/GameContext';
import type { Unit } from '@/types/Unit';
import type { Ability } from '@/types/Ability';
import type { Djinn, DjinnState } from '@/types/Djinn';

interface AbilityMenuProps {
  unit: Unit;
  remainingMana: number;
  onSelectAbility: (ability: Ability) => void;
  onBack: () => void;
  equippedDjinn?: Djinn[];
  djinnStates?: Map<string, DjinnState>;
}

export const AbilityMenu: React.FC<AbilityMenuProps> = ({
  unit,
  remainingMana,
  onSelectAbility,
  onBack,
  equippedDjinn,
  djinnStates
}) => {
  const { state } = useGame();

  // Force re-render when unit level changes or Djinn are equipped
  // This ensures abilities update when learned mid-battle
  const availableAbilities = useMemo(() => {
    if (equippedDjinn && djinnStates) {
      return unit.getAvailableAbilities({ equippedDjinn, djinnStates });
    }
    return unit.getAvailableAbilities();
  }, [
    unit.id,
    unit.level,
    state.playerData.equippedDjinnIds.length,
    state.playerData.equippedDjinnIds.join(','), // Track actual Djinn equipped
    equippedDjinn,
    djinnStates
  ]);

  return (
    <div className="action-menu ability-menu">
      <div className="menu-header">
        <button onClick={onBack} className="back-button">← Back</button>
        <h3 className="menu-title">Select Psynergy</h3>
      </div>
      <div className="ability-list">
        {availableAbilities.map(ability => {
          const canUsePP = unit.canUseAbility(ability.id);
          const canAffordMana = ability.manaCost <= remainingMana;
          const canUse = canUsePP && canAffordMana;

          return (
            <button
              key={ability.id}
              onClick={() => canUse && onSelectAbility(ability)}
              disabled={!canUse}
              className={`ability-button ${!canUse ? 'disabled' : ''}`}
            >
              <span className="ability-name">{ability.name}</span>
              <span className="ability-costs">
                <span className="pp-cost">{ability.ppCost} PP</span>
                <span className={`mana-cost ${!canAffordMana ? 'insufficient' : ''}`}>
                  {ability.manaCost}○
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
