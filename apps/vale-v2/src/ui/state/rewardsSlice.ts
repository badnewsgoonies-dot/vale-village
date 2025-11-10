/**
 * Rewards state slice for Zustand
 * Manages post-battle rewards and reward screen visibility
 */

import type { StateCreator } from 'zustand';
import type { BattleState } from '../../core/models/BattleState';
import type { RewardDistribution } from '../../core/models/Rewards';
import type { Team } from '../../core/models/Team';
import type { PRNG } from '../../core/random/prng';
import { isUnitKO } from '../../core/models/Unit';
import {
  calculateBattleRewards,
  calculateEquipmentDrops,
  distributeRewards,
} from '../../core/algorithms/rewards';
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
    // Calculate rewards
    const enemies = battle.enemies;
    const survivors = battle.playerTeam.units.filter(u => !isUnitKO(u));
    const allSurvived = survivors.length === battle.playerTeam.units.length;
    
    // Calculate base rewards
    const rewards = calculateBattleRewards(enemies, allSurvived, survivors.length, rng);
    
    // Calculate equipment drops (already included in rewards, but we need to ensure it's there)
    const equipmentDrops = calculateEquipmentDrops(enemies, rng);
    const rewardsWithDrops = { ...rewards, equipmentDrops };
    
    // Distribute rewards to team
    const distribution = distributeRewards(battle.playerTeam, rewardsWithDrops);
    
    // Update team state with XP gains
    const { updateTeam } = get() as any as { updateTeam: (updates: Partial<Team>) => void };
    if (updateTeam) {
      updateTeam({ units: distribution.updatedTeam.units });
    }
    
    // Store distribution (without updatedTeam for serialization)
    const { updatedTeam, ...distributionWithoutTeam } = distribution;
    set({ lastBattleRewards: distributionWithoutTeam });
  },

  claimRewards: () => {
    const { lastBattleRewards } = get();
    if (!lastBattleRewards) return;

    // Apply rewards to inventory
    const { addGold, addEquipment } = get() as any as InventorySlice;
    addGold(lastBattleRewards.goldEarned);
    addEquipment([...lastBattleRewards.rewards.equipmentDrops]);

    // Clear rewards and hide screen
    set({ lastBattleRewards: null, showRewards: false });
  },

  setShowRewards: (visible) => {
    set({ showRewards: visible });
  },
});

