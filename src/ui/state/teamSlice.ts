/**
 * Team state slice for Zustand
 * Manages player team composition and Djinn
 */

import type { StateCreator } from 'zustand';
import type { Team } from '../../core/models/Team';
import type { Unit } from '../../core/models/Unit';
import { updateTeam } from '../../core/models/Team';
import { UNIT_DEFINITIONS } from '../../data/definitions/units';
import { createUnit } from '../../core/models/Unit';

export interface TeamSlice {
  team: Team | null;
  roster: Unit[];  // All recruited units (bench + active party, up to 10)
  setTeam: (team: Team) => void;
  setRoster: (units: Unit[]) => void;
  addUnitToRoster: (unit: Unit) => void;
  getUnitFromRoster: (unitId: string) => Unit | undefined;
  updateTeam: (updates: Partial<Team>) => void;
  updateTeamUnits: (units: readonly Unit[]) => void;
  swapPartyMember: (partyIndex: number, unitId: string) => void;
}

export const createTeamSlice: StateCreator<
  TeamSlice,
  [['zustand/devtools', never]],
  [],
  TeamSlice
> = (set, get) => ({
  team: null,
  roster: [],  // Empty roster initially

  setTeam: (team) => {
    set((state) => {
      // Ensure roster contains all team units (add/update as needed)
      const updatedRoster = [...state.roster];
      team.units.forEach(unit => {
        const existingIndex = updatedRoster.findIndex(u => u.id === unit.id);
        if (existingIndex >= 0) {
          // Update existing unit in roster
          updatedRoster[existingIndex] = unit;
        } else {
          // Add new unit to roster (if not at max)
          if (updatedRoster.length < 10) {
            updatedRoster.push(unit);
          }
        }
      });
      
      return {
        team,
        roster: updatedRoster,
      };
    });
  },
  
  setRoster: (units) => set({ roster: units }),
  
  addUnitToRoster: (unit) =>
    set((state) => {
      // Check if unit already exists
      if (state.roster.some(u => u.id === unit.id)) {
        // Update existing unit
        return {
          roster: state.roster.map(u => u.id === unit.id ? unit : u),
        };
      }
      // Add new unit (max 10)
      if (state.roster.length >= 10) {
        console.warn('Roster full (10 units max), cannot add unit');
        return state;
      }
      return {
        roster: [...state.roster, unit],
      };
    }),
  
  getUnitFromRoster: (unitId) => {
    return get().roster.find(u => u.id === unitId);
  },

  updateTeam: (updates) =>
    set((state) => {
      if (!state.team) return state;
      return {
        team: {
          ...state.team,
          ...updates,
        },
      };
    }),
  updateTeamUnits: (units) =>
    set((state) => {
      if (!state.team) return state;
      
      const updatedTeam = updateTeam(state.team, { units });
      
      // Sync roster with updated units (prevents stale data)
      const updatedRoster = [...state.roster];
      units.forEach(unit => {
        const existingIndex = updatedRoster.findIndex(u => u.id === unit.id);
        if (existingIndex >= 0) {
          // Update existing unit in roster
          updatedRoster[existingIndex] = unit;
        } else {
          // Add new unit to roster (if not at max)
          // This handles edge cases where a unit is added directly
          if (updatedRoster.length < 10) {
            updatedRoster.push(unit);
          }
        }
      });
      
      return {
        team: updatedTeam,
        roster: updatedRoster,
      };
    }),

  swapPartyMember: (partyIndex: number, unitId: string) =>
    set((state) => {
      if (!state.team) return state;

      // Get unit from roster (preferred) or create from definition (fallback)
      let newUnit = state.roster.find(u => u.id === unitId);
      
      if (!newUnit) {
        // Fallback: create from definition (for backward compatibility)
        const unitDef = UNIT_DEFINITIONS[unitId];
        if (!unitDef) {
          console.error(`Unit ${unitId} not found in roster or definitions`);
          return state;
        }
        
        const oldUnit = state.team.units[partyIndex];
        newUnit = oldUnit
          ? createUnit(unitDef, oldUnit.level, oldUnit.xp)
          : createUnit(unitDef, 1, 0);
        
        // Add to roster if not already there (will be handled by setTeam below)
        // Note: setTeam() will ensure roster contains all team units
      }

      const newUnits = [...state.team.units];

      // Handle append vs replace for variable team sizes
      if (partyIndex >= newUnits.length) {
        // Append if index is beyond current team size
        newUnits.push(newUnit);
      } else {
        // Replace existing unit
        newUnits[partyIndex] = newUnit;
      }

      // No padding, no slice - allow 1-4 units naturally
      const finalUnits = newUnits as typeof state.team.units;

      const updatedTeam = updateTeam(state.team, {
        units: finalUnits,
      });
      
      // Ensure roster contains all team units (add/update as needed)
      const updatedRoster = [...state.roster];
      updatedTeam.units.forEach(unit => {
        const existingIndex = updatedRoster.findIndex(u => u.id === unit.id);
        if (existingIndex >= 0) {
          // Update existing unit in roster
          updatedRoster[existingIndex] = unit;
        } else {
          // Add new unit to roster (if not at max)
          if (updatedRoster.length < 10) {
            updatedRoster.push(unit);
          }
        }
      });

      return {
        team: updatedTeam,
        roster: updatedRoster,
      };
    }),
});
