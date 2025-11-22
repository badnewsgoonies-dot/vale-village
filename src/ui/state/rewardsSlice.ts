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
  lastBattleEncounterId: string | null; // Store encounterId for post-battle dialogue

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
  lastBattleEncounterId: null,

  processVictory: (battle) => {
    const result = rewardsServiceProcessVictory(battle);
    
    // Capture encounterId before clearing battle state
    const encounterId = battle.encounterId || battle.meta?.encounterId || null;

    const { setTeam } = get();
    setTeam(result.updatedTeam);

    // NOTE: Unit recruitment is now handled via post-battle recruitment dialogues
    // All recruitment is narrative-driven via dialogue effects (recruitUnit)

    set({
      lastBattleRewards: result.distribution,
      lastBattleEncounterId: encounterId, // Store for post-battle dialogue
      mode: 'rewards', // Set mode instead of showRewards
      showRewards: true,
    });
  },

  claimRewards: () => {
    const { lastBattleRewards } = get();
    if (!lastBattleRewards) return;

    const { addGold, addEquipment } = get();
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

    // Clear rewards but keep encounterId until handleRewardsContinue uses it
    // Don't clear lastBattleEncounterId here - handleRewardsContinue needs it
    set({ lastBattleRewards: null, showRewards: false });
    // Don't set mode here - let handleRewardsContinue handle mode transition
    // (it needs to check for recruitment dialogue first)
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
