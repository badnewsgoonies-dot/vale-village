import { useCallback } from 'react';
import { useGameStore } from '../store';
import { PartyService } from '@/core/services/PartyService';
import type { UnitDefinition } from '@/types/Unit';

/**
 * Hook for party operations
 */
export const useParty = () => {
  const { state, updatePlayerData } = useGameStore();
  
  const setActiveParty = useCallback((unitIds: string[]) => {
    const result = PartyService.setActiveParty(state.playerData.unitsCollected, unitIds);
    if (!result.ok) {
      return { success: false, error: result.error };
    }
    
    updatePlayerData((prev) => ({
      ...prev,
      activePartyIds: result.value,
    }));
    
    return { success: true };
  }, [state.playerData.unitsCollected, updatePlayerData]);
  
  const recruitUnit = useCallback((unitDefinition: UnitDefinition, level: number = 1) => {
    const result = PartyService.recruitUnit(state.playerData.unitsCollected, unitDefinition, level);
    if (!result.ok) {
      return { success: false, error: result.error };
    }
    
    updatePlayerData((prev) => ({
      ...prev,
      unitsCollected: [...prev.unitsCollected, result.value],
      recruitmentFlags: {
        ...prev.recruitmentFlags,
        [unitDefinition.id]: true,
      },
    }));
    
    return { success: true, unit: result.value };
  }, [state.playerData.unitsCollected, updatePlayerData]);
  
  const getActiveParty = useCallback(() => {
    return PartyService.getActiveParty(state.playerData.unitsCollected, state.playerData.activePartyIds);
  }, [state.playerData]);
  
  const getBenchedUnits = useCallback(() => {
    return PartyService.getBenchedUnits(state.playerData.unitsCollected, state.playerData.activePartyIds);
  }, [state.playerData]);
  
  return {
    setActiveParty,
    recruitUnit,
    getActiveParty,
    getBenchedUnits,
    unitsCollected: state.playerData.unitsCollected,
    activePartyIds: state.playerData.activePartyIds,
  };
};


