/**
 * Inventory state slice for Zustand
 * Manages player's gold and equipment inventory
 */

import type { StateCreator } from 'zustand';
import type { Equipment } from '../../core/models/Equipment';

export interface InventorySlice {
  gold: number;
  equipment: Equipment[];
  
  addGold: (amount: number) => void;
  addEquipment: (items: Equipment[]) => void;
  removeEquipment: (itemId: string) => void;
}

export const createInventorySlice: StateCreator<
  InventorySlice,
  [['zustand/devtools', never]],
  [],
  InventorySlice
> = (set) => ({
  gold: 0,
  equipment: [],

  addGold: (amount) => {
    set((state) => ({ gold: state.gold + amount }));
  },

  addEquipment: (items) => {
    // Deep clone equipment to avoid reference sharing issues with duplicates
    set((state) => ({ 
      equipment: [...state.equipment, ...items.map(item => ({ ...item }))] 
    }));
  },

  removeEquipment: (itemId) => {
    set((state) => {
      // Find first occurrence and remove only that one (preserves duplicates)
      const index = state.equipment.findIndex(e => e.id === itemId);
      if (index === -1) {
        return state; // Item not found, no change
      }
      const newEquipment = [...state.equipment];
      newEquipment.splice(index, 1);
      return { equipment: newEquipment };
    });
  },
});

