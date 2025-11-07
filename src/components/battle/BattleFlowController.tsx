import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { PreBattleTeamSelection } from './PreBattleTeamSelection';
import { PreBattleDjinnSelection } from './PreBattleDjinnSelection';
import './BattleFlowController.css';

/**
 * BattleFlowController
 *
 * Orchestrates the complete battle flow:
 * 1. Team Selection → Pick units for battle
 * 2. Djinn Selection → Pick Djinn for bonuses
 * 3. Battle Initiation → Start the actual battle
 *
 * This component is invoked from DialogueScreen when an NPC triggers a battle,
 * ensuring players can strategize before combat.
 */

interface BattleFlowControllerProps {
  enemyUnitIds: string[]; // Enemy units to fight
  onBattleStart?: () => void; // Optional callback when battle starts
  npcId?: string; // NPC that triggered the battle (for post-battle cutscene)
}

type FlowPhase = 'teamSelection' | 'djinnSelection' | 'transition';

export const BattleFlowController: React.FC<BattleFlowControllerProps> = ({
  enemyUnitIds,
  onBattleStart,
  npcId,
}) => {
  const { state, actions } = useGame();
  const [phase, setPhase] = useState<FlowPhase>('teamSelection');
  const [selectedPartyIds, setSelectedPartyIds] = useState<string[]>([]);
  const [_selectedDjinnIds, _setSelectedDjinnIds] = useState<string[]>([]);

  // Handle team selection confirmation
  const handleTeamConfirmed = (unitIds: string[]) => {
    setSelectedPartyIds(unitIds);
    // Apply the party selection immediately
    actions.setActiveParty(unitIds);
    // Move to Djinn selection
    setPhase('djinnSelection');
  };

  // Handle going back from Djinn selection to team selection
  const handleBackToTeamSelection = () => {
    setPhase('teamSelection');
  };

  // Handle Djinn selection confirmation and start battle
  const handleDjinnConfirmed = (djinnIds: string[]) => {
    _setSelectedDjinnIds(djinnIds);

    // Apply Djinn selection
    // First unequip all current Djinn
    state.playerData.equippedDjinnIds.forEach(id => {
      actions.unequipDjinn(id);
    });
    // Then equip the selected Djinn
    djinnIds.forEach(id => {
      actions.equipDjinn(id);
    });

    // Show transition screen briefly
    setPhase('transition');

    // Call optional callback
    onBattleStart?.();

    // Start the battle after a brief delay
    setTimeout(() => {
      actions.startBattle(enemyUnitIds, npcId);
    }, 1000);
  };

  // Handle cancel (go back to overworld/dialogue)
  const handleCancel = () => {
    actions.goBack();
  };

  // Render current phase
  switch (phase) {
    case 'teamSelection':
      return (
        <PreBattleTeamSelection
          onConfirm={handleTeamConfirmed}
          onCancel={handleCancel}
        />
      );

    case 'djinnSelection':
      return (
        <PreBattleDjinnSelection
          selectedPartyIds={selectedPartyIds}
          onConfirm={handleDjinnConfirmed}
          onBack={handleBackToTeamSelection}
        />
      );

    case 'transition':
      return (
        <div className="battle-transition">
          <div className="transition-content">
            <h2>Battle Starting...</h2>
            <div className="transition-spinner"></div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
