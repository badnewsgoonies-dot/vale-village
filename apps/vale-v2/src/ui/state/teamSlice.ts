/**
 * Team state slice for Zustand
 * Manages player team composition and Djinn
 */

import type { StateCreator } from 'zustand';
import type { Team } from '../../core/models/Team';
<<<<<<< Updated upstream
import type { Unit } from '../../core/models/Unit';
import { updateTeam } from '../../core/models/Team';
=======
import { updateTeam } from '../../core/models/Team';
import { UNIT_DEFINITIONS } from '../../data/definitions/units';
import { createUnit } from '../../core/models/Unit';
>>>>>>> Stashed changes

export interface TeamSlice {
  team: Team | null;
  setTeam: (team: Team) => void;
  updateTeam: (updates: Partial<Team>) => void;
<<<<<<< Updated upstream
  updateTeamUnits: (units: readonly Unit[]) => void;
=======
  swapPartyMember: (partyIndex: number, newUnitId: string) => void;
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======

  swapPartyMember: (partyIndex: number, newUnitId: string) => {
    set((state) => {
      if (!state.team) return state;

      const unitDef = UNIT_DEFINITIONS[newUnitId];
      if (!unitDef) {
        console.error(`Unit definition not found: ${newUnitId}`);
        return state;
      }

      // Get the unit being replaced (if any)
      const oldUnit = state.team.units[partyIndex];
      
      // Create new unit at level 1 (or preserve level if swapping with existing unit)
      const newUnit = oldUnit
        ? createUnit(unitDef, oldUnit.level, oldUnit.xp)
        : createUnit(unitDef, 1, 0);

      // Create new units array
      const newUnits = [...state.team.units];
      newUnits[partyIndex] = newUnit;

      // Ensure exactly 4 units
      while (newUnits.length < 4) {
        // If we need to pad, create a placeholder unit (this shouldn't happen in normal flow)
        const placeholderDef = UNIT_DEFINITIONS[Object.keys(UNIT_DEFINITIONS)[0]];
        if (placeholderDef) {
          newUnits.push(createUnit(placeholderDef, 1, 0));
        } else {
          break;
        }
      }

      const finalUnits = newUnits.slice(0, 4) as [typeof newUnits[0], typeof newUnits[1], typeof newUnits[2], typeof newUnits[3]];

      return {
        team: updateTeam(state.team, {
          units: finalUnits,
        }),
      };
    });
  },
});
>>>>>>> Stashed changes

  updateTeamUnits: (units) =>
    set((state) => {
      if (!state.team) return state;
      return {
        team: updateTeam(state.team, { units }),
      };
    }),
});
