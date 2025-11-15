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
  setTeam: (team: Team) => void;
  updateTeam: (updates: Partial<Team>) => void;
  updateTeamUnits: (units: readonly Unit[]) => void;
  swapPartyMember: (partyIndex: number, newUnitId: string) => void;
}

export const createTeamSlice: StateCreator<
  TeamSlice,
  [['zustand/devtools', never]],
  [],
  TeamSlice
> = (set) => ({
  team: null,

  setTeam: (team) => set({ team }),

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
      return {
        team: updateTeam(state.team, { units }),
      };
    }),

  swapPartyMember: (partyIndex: number, newUnitId: string) =>
    set((state) => {
      if (!state.team) return state;

      const unitDef = UNIT_DEFINITIONS[newUnitId];
      if (!unitDef) {
        console.error(`Unit definition not found: ${newUnitId}`);
        return state;
      }

      const oldUnit = state.team.units[partyIndex];

      const newUnit = oldUnit
        ? createUnit(unitDef, oldUnit.level, oldUnit.xp)
        : createUnit(unitDef, 1, 0);

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

      return {
        team: updateTeam(state.team, {
          units: finalUnits,
        }),
      };
    }),
});
