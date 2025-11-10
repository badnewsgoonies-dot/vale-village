import { useCallback } from 'react';
import { useGame } from '@/context/GameContext';
import { useEquipmentStore } from '../slices/equipmentSlice';
import { EquipmentService } from '@/core/services/EquipmentService';
import type { Equipment, EquipmentSlot } from '@/types/Equipment';

/**
 * Hook for equipment operations
 * Integrates services with React state
 * Can be used alongside or instead of GameProvider actions
 */
export const useEquipment = () => {
  const { state, actions } = useGame();
  const { selectedUnitId, selectUnit, setHoveredItem } = useEquipmentStore();
  
  const selectedUnit = state.playerData.unitsCollected.find(u => u.id === selectedUnitId) || null;
  
  const equipItem = useCallback((unitId: string, slot: EquipmentSlot, item: Equipment) => {
    const unit = state.playerData.unitsCollected.find(u => u.id === unitId);
    if (!unit) {
      return { success: false, error: `Unit ${unitId} not found` };
    }
    
    // Use service to validate
    const result = EquipmentService.equipItem(unit, slot, item);
    if (!result.ok) {
      return { success: false, error: result.error };
    }
    
    // Use GameProvider action to update state (for now, until full migration)
    actions.equipItem(unitId, slot, item);
    
    return { success: true };
  }, [state.playerData, actions]);
  
  const unequipItem = useCallback((unitId: string, slot: EquipmentSlot) => {
    const unit = state.playerData.unitsCollected.find(u => u.id === unitId);
    if (!unit) {
      return { success: false, error: `Unit ${unitId} not found` };
    }
    
    const result = EquipmentService.unequipItem(unit, slot);
    if (!result.ok) {
      return { success: false, error: result.error };
    }
    
    // Use GameProvider action to update state
    actions.unequipItem(unitId, slot);
    
    return { success: true, item: result.value.item };
  }, [state.playerData, actions]);
  
  return {
    selectedUnit,
    selectUnit,
    setHoveredItem,
    equipItem,
    unequipItem,
    // Also expose service methods for direct use
    calculateEquippedStats: EquipmentService.calculateEquippedStats,
    getEquippedAbilities: EquipmentService.getEquippedAbilities,
  };
};

