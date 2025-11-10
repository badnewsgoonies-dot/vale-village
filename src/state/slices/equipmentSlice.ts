import { create } from 'zustand';
import { EquipmentService } from '@/core/services/EquipmentService';
import type { Unit } from '@/types/Unit';
import type { Equipment, EquipmentSlot } from '@/types/Equipment';

/**
 * Equipment slice - manages equipment-related state
 */
interface EquipmentState {
  selectedUnitId: string | null;
  hoveredItemId: string | null;
  
  // Actions
  selectUnit: (unitId: string | null) => void;
  setHoveredItem: (itemId: string | null) => void;
  equipItem: (unit: Unit, slot: EquipmentSlot, item: Equipment) => { success: boolean; error?: string };
  unequipItem: (unit: Unit, slot: EquipmentSlot) => { success: boolean; item: Equipment | null; error?: string };
}

export const useEquipmentStore = create<EquipmentState>((set) => ({
  selectedUnitId: null,
  hoveredItemId: null,
  
  selectUnit: (unitId) => set({ selectedUnitId: unitId }),
  
  setHoveredItem: (itemId) => set({ hoveredItemId: itemId }),
  
  equipItem: (unit, slot, item) => {
    const result = EquipmentService.equipItem(unit, slot, item);
    if (result.ok) {
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  },
  
  unequipItem: (unit, slot) => {
    const result = EquipmentService.unequipItem(unit, slot);
    if (result.ok) {
      return { success: true, item: result.value.item };
    } else {
      return { success: false, item: null, error: result.error };
    }
  },
}));


