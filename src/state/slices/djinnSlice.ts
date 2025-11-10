import { create } from 'zustand';
import { DjinnService } from '@/core/services/DjinnService';
import type { Djinn } from '@/types/Djinn';

/**
 * Djinn slice - manages djinn-related state
 */
interface DjinnState {
  // Actions
  equipDjinn: (
    djinnCollected: Djinn[],
    equippedDjinnIds: string[],
    djinnId: string
  ) => { success: boolean; newEquippedIds?: string[]; error?: string };
  
  unequipDjinn: (
    equippedDjinnIds: string[],
    djinnId: string
  ) => { success: boolean; newEquippedIds?: string[]; error?: string };
  
  giveDjinn: (
    djinnCollected: Djinn[],
    djinn: Djinn
  ) => { success: boolean; newCollection?: Djinn[]; error?: string };
  
  calculateSynergy: (
    djinnCollected: Djinn[],
    equippedDjinnIds: string[]
  ) => ReturnType<typeof DjinnService.calculateSynergy>;
}

export const useDjinnStore = create<DjinnState>(() => ({
  equipDjinn: (djinnCollected, equippedDjinnIds, djinnId) => {
    const result = DjinnService.equipDjinn(djinnCollected, equippedDjinnIds, djinnId);
    if (result.ok) {
      return { success: true, newEquippedIds: result.value };
    } else {
      return { success: false, error: result.error };
    }
  },
  
  unequipDjinn: (equippedDjinnIds, djinnId) => {
    const result = DjinnService.unequipDjinn(equippedDjinnIds, djinnId);
    if (result.ok) {
      return { success: true, newEquippedIds: result.value };
    } else {
      return { success: false, error: result.error };
    }
  },
  
  giveDjinn: (djinnCollected, djinn) => {
    const result = DjinnService.giveDjinn(djinnCollected, djinn);
    if (result.ok) {
      return { success: true, newCollection: result.value };
    } else {
      return { success: false, error: result.error };
    }
  },
  
  calculateSynergy: (djinnCollected, equippedDjinnIds) => {
    return DjinnService.calculateSynergy(djinnCollected, equippedDjinnIds);
  },
}));


