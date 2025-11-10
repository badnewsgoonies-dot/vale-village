/**
 * Zustand store combining all slices
 * Provides unified state management for the UI
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createBattleSlice, type BattleSlice } from './battleSlice';
import { createTeamSlice, type TeamSlice } from './teamSlice';
import { createSaveSlice, type SaveSlice } from './saveSlice';

type Store = BattleSlice & TeamSlice & SaveSlice;

export const useStore = create<Store>()(
  devtools(
    (set, get, api) => ({
      ...createTeamSlice(set, get, api),
      ...createBattleSlice(set, get, api),
      ...createSaveSlice(set, get, api),
    }),
    { name: 'vale-v2' }
  )
);

