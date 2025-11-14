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
      newUnits[partyIndex] = newUnit;

      while (newUnits.length < 4) {
        const placeholderKey = Object.keys(UNIT_DEFINITIONS)[0];
        const placeholderDef = UNIT_DEFINITIONS[placeholderKey];
        if (!placeholderDef) break;
        newUnits.push(createUnit(placeholderDef, 1, 0));
      }

      const finalUnits = newUnits.slice(0, 4) as typeof state.team.units;

      return {
        team: updateTeam(state.team, {
          units: finalUnits,
        }),
      };
    }),
});
