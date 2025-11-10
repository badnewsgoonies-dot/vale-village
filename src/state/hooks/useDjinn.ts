import { useCallback } from 'react';
import { useGame } from '@/context/GameContext';
import { useDjinnStore } from '../slices/djinnSlice';
import { DjinnService } from '@/core/services/DjinnService';
import type { Djinn } from '@/types/Djinn';

/**
 * Hook for djinn operations
 */
export const useDjinn = () => {
  const { state, actions } = useGame();
  const djinnStore = useDjinnStore();
  
  const equipDjinn = useCallback((djinnId: string) => {
    const result = djinnStore.equipDjinn(
      state.playerData.djinnCollected,
      state.playerData.equippedDjinnIds,
      djinnId
    );
    
    if (result.success && result.newEquippedIds) {
      // Use GameProvider action to update state (for now)
      // TODO: Migrate to Zustand store fully
      actions.equipDjinn(djinnId);
      return { success: true };
    }
    
    return { success: false, error: result.error };
  }, [state.playerData, actions, djinnStore]);
  
  const unequipDjinn = useCallback((djinnId: string) => {
    const result = djinnStore.unequipDjinn(
      state.playerData.equippedDjinnIds,
      djinnId
    );
    
    if (result.success && result.newEquippedIds) {
      actions.unequipDjinn(djinnId);
      return { success: true };
    }
    
    return { success: false, error: result.error };
  }, [state.playerData, actions, djinnStore]);
  
  const giveDjinn = useCallback((djinn: Djinn) => {
    const result = djinnStore.giveDjinn(
      state.playerData.djinnCollected,
      djinn
    );
    
    if (result.success && result.newCollection) {
      actions.giveDjinn(djinn.id);
      return { success: true };
    }
    
    return { success: false, error: result.error };
  }, [state.playerData, actions, djinnStore]);
  
  const calculateSynergy = useCallback(() => {
    return djinnStore.calculateSynergy(
      state.playerData.djinnCollected,
      state.playerData.equippedDjinnIds
    );
  }, [state.playerData, djinnStore]);
  
  return {
    equipDjinn,
    unequipDjinn,
    giveDjinn,
    calculateSynergy,
    djinnCollected: state.playerData.djinnCollected,
    equippedDjinnIds: state.playerData.equippedDjinnIds,
  };
};


