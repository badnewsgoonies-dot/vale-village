import { create } from 'zustand';
import { PartyService } from '@/core/services/PartyService';
import type { Unit } from '@/types/Unit';
import type { UnitDefinition } from '@/types/Unit';

/**
 * Party slice - manages party-related state
 */
interface PartyState {
  // Actions
  setActiveParty: (unitsCollected: Unit[], unitIds: string[]) => { success: boolean; error?: string };
  recruitUnit: (unitsCollected: Unit[], unitDefinition: UnitDefinition, level?: number) => { success: boolean; unit?: Unit; error?: string };
}

export const usePartyStore = create<PartyState>(() => ({
  setActiveParty: (unitsCollected, unitIds) => {
    const result = PartyService.setActiveParty(unitsCollected, unitIds);
    if (result.ok) {
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  },
  
  recruitUnit: (unitsCollected, unitDefinition, level = 1) => {
    const result = PartyService.recruitUnit(unitsCollected, unitDefinition, level);
    if (result.ok) {
      return { success: true, unit: result.value };
    } else {
      return { success: false, error: result.error };
    }
  },
}));


