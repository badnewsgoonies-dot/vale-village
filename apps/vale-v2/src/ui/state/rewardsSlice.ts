/**
 * Rewards state slice for Zustand
 * Manages post-battle rewards and reward screen visibility
 */

import type { StateCreator } from 'zustand';
import type { BattleState } from '../../core/models/BattleState';
import type { RewardDistribution } from '../../core/models/Rewards';
import { processVictory as rewardsServiceProcessVictory } from '../../core/services/RewardsService';
import type { InventorySlice } from './inventorySlice';
import type { BattleSlice } from './battleSlice';
import type { TeamSlice } from './teamSlice';
import type { GameFlowSlice } from './gameFlowSlice';
import type { Equipment } from '../../data/schemas/EquipmentSchema';

export interface RewardsSlice {
  lastBattleRewards: RewardDistribution | null;
  showRewards: boolean;

  processVictory: (battle: BattleState) => void;
  claimRewards: () => void;
  setShowRewards: (visible: boolean) => void;
  selectEquipmentChoice: (equipment: Equipment) => void;
}

export const createRewardsSlice: StateCreator<
  RewardsSlice & InventorySlice & BattleSlice & TeamSlice & GameFlowSlice,
  [['zustand/devtools', never]],
  [],
  RewardsSlice
> = (set, get) => ({
  lastBattleRewards: null,
  showRewards: false,

  processVictory: (battle) => {
    const result = rewardsServiceProcessVictory(battle);

    const { setTeam, addUnitToRoster } = get();
    setTeam(result.updatedTeam);

    // Handle unit recruitment
    if (result.recruitedUnit) {
      addUnitToRoster(result.recruitedUnit);
      console.log(`🎉 Recruited ${result.recruitedUnit.name}!`);
    }

    set({ 
      lastBattleRewards: {
        ...result.distribution,
        recruitedUnit: result.recruitedUnit,
      },
      mode: 'rewards', // Set mode instead of showRewards
    });
  },

  claimRewards: () => {
    const { lastBattleRewards } = get();
    if (!lastBattleRewards) return;

    const { addGold, addEquipment, setMode } = get();
    addGold(lastBattleRewards.goldEarned);

    const equipmentToAdd: Equipment[] = [];
    if (lastBattleRewards.fixedEquipment) {
      equipmentToAdd.push(lastBattleRewards.fixedEquipment);
    }
    if (lastBattleRewards.choiceSelected) {
      equipmentToAdd.push(lastBattleRewards.choiceSelected);
    }

    if (equipmentToAdd.length > 0) {
      addEquipment(equipmentToAdd);
    }

    set({ lastBattleRewards: null });
    setMode('overworld'); // Return to overworld after claiming rewards
  },

  setShowRewards: (visible) => {
    set({ showRewards: visible });
  },

  selectEquipmentChoice: (equipment) => {
    set((state) => {
      if (!state.lastBattleRewards?.equipmentChoice) return state;
      return {
        lastBattleRewards: {
          ...state.lastBattleRewards,
          choiceSelected: equipment,
          equipmentChoice: undefined,
        },
      };
    });
  },
});
