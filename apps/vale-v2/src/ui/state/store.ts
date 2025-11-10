/**
 * Zustand store combining all slices
 * Provides unified state management for the UI
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createBattleSlice, type BattleSlice } from './battleSlice';
import { createTeamSlice, type TeamSlice } from './teamSlice';
import { createSaveSlice, type SaveSlice } from './saveSlice';
import { createStorySlice, type StorySlice } from './storySlice';

type Store = BattleSlice & TeamSlice & SaveSlice & StorySlice;

export const useStore = create<Store>()(
  devtools(
    (set, get, api) => ({
      ...createTeamSlice(set, get, api),
      ...createBattleSlice(set, get, api),
      ...createSaveSlice(set, get, api),
      ...createStorySlice(set, get, api),
    }),
    { name: 'vale-v2' }
  )
);

