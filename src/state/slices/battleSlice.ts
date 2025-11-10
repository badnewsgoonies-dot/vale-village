import { create } from 'zustand';
import { BattleService } from '@/core/services/BattleService';
import type { BattleState } from '@/types/Battle';
import type { Team } from '@/types/Team';
import type { Unit } from '@/types/Unit';

/**
 * Battle slice - manages battle-related state
 */
interface BattleSliceState {
  // Actions
  initializeBattle: (
    playerTeam: Team,
    enemies: Unit[]
  ) => { success: boolean; battleState?: BattleState; error?: string };
}

export const useBattleStore = create<BattleSliceState>(() => ({
  initializeBattle: (playerTeam, enemies) => {
    const result = BattleService.initializeBattle(playerTeam, enemies);
    if (result.ok) {
      return { success: true, battleState: result.value };
    } else {
      return { success: false, error: result.error };
    }
  },
}));


