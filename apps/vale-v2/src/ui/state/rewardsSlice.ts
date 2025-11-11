/**
 * Rewards state slice for Zustand
 * Manages post-battle rewards and reward screen visibility
 */

import type { StateCreator } from 'zustand';
import type { BattleState } from '../../core/models/BattleState';
import type { RewardDistribution } from '../../core/models/Rewards';
import type { Team } from '../../core/models/Team';
import type { PRNG } from '../../core/random/prng';
import { processVictory as rewardsServiceProcessVictory } from '../../core/services/RewardsService';
import type { InventorySlice } from './inventorySlice';
import type { BattleSlice } from './battleSlice';
import type { TeamSlice } from './teamSlice';

export interface RewardsSlice {
  lastBattleRewards: RewardDistribution | null;
  showRewards: boolean;
  
  processVictory: (battle: BattleState, rng: PRNG) => void;
  claimRewards: () => void;
  setShowRewards: (visible: boolean) => void;
}

export const createRewardsSlice: StateCreator<
  RewardsSlice & InventorySlice & BattleSlice & TeamSlice,
  [['zustand/devtools', never]],
  [],
  RewardsSlice
> = (set, get) => ({
  lastBattleRewards: null,
  showRewards: false,

  processVictory: (battle, rng) => {
    // Call service to process victory
    const result = rewardsServiceProcessVictory(battle, rng);

    // Update team state with XP gains
    const { updateTeam } = get();
    updateTeam({ units: result.updatedTeam.units });

    // Store distribution for display
    set({ lastBattleRewards: result.distribution });
  },

  claimRewards: () => {
    const { lastBattleRewards } = get();
    if (!lastBattleRewards) return;

    // Apply rewards to inventory
    const { addGold, addEquipment } = get();
    addGold(lastBattleRewards.goldEarned);
    addEquipment([...lastBattleRewards.rewards.equipmentDrops]);

    // Clear rewards and hide screen
    set({ lastBattleRewards: null, showRewards: false });
  },

  setShowRewards: (visible) => {
    set({ showRewards: visible });
  },
});

