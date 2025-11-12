/**
 * Team state slice for Zustand
 * Manages player team composition and Djinn
 */

import type { StateCreator } from 'zustand';
import type { Team } from '../../core/models/Team';
import type { Unit } from '../../core/models/Unit';
import { updateTeam } from '../../core/models/Team';

export interface TeamSlice {
  team: Team | null;
  setTeam: (team: Team) => void;
  updateTeam: (updates: Partial<Team>) => void;
  updateTeamUnits: (units: readonly Unit[]) => void;
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
});
