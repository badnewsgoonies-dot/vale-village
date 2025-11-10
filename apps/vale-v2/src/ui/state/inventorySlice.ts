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
    set((state) => ({ equipment: [...state.equipment, ...items] }));
  },

  removeEquipment: (itemId) => {
    set((state) => ({ 
      equipment: state.equipment.filter(e => e.id !== itemId) 
    }));
  },
});

