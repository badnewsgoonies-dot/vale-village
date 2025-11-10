import { useCallback } from 'react';
import { useGame } from '@/context/GameContext';
import { useBattleStore } from '../slices/battleSlice';
import { BattleService } from '@/core/services/BattleService';
import type { Team } from '@/types/Team';
import type { Unit } from '@/types/Unit';

/**
 * Hook for battle operations
 */
export const useBattle = () => {
  const { state, actions } = useGame();
  const battleStore = useBattleStore();
  
  const initializeBattle = useCallback((playerTeam: Team, enemies: Unit[]) => {
    const result = battleStore.initializeBattle(playerTeam, enemies);
    
    if (result.success && result.battleState) {
      // Use GameProvider action to start battle (for now)
      // TODO: Migrate battle state to Zustand store fully
      // For now, we'll use the existing startBattle action
      return { success: true, battleState: result.battleState };
    }
    
    return { success: false, error: result.error };
  }, [battleStore]);
  
  return {
    initializeBattle,
    currentBattle: state.currentBattle,
  };
};


