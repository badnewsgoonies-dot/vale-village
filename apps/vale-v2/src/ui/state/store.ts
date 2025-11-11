/**
 * Zustand store combining all slices
 * Provides unified state management for the UI
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createBattleSlice, type BattleSlice } from './battleSlice';
import { createQueueBattleSlice, type QueueBattleSlice } from './queueBattleSlice';
import { createTeamSlice, type TeamSlice } from './teamSlice';
import { createSaveSlice, type SaveSlice } from './saveSlice';
import { createStorySlice, type StorySlice } from './storySlice';
import { createInventorySlice, type InventorySlice } from './inventorySlice';
import { createRewardsSlice, type RewardsSlice } from './rewardsSlice';

export type Store = BattleSlice & QueueBattleSlice & TeamSlice & SaveSlice & StorySlice & InventorySlice & RewardsSlice;

// Store factory function to combine all slices
const storeFactory = (set: any, get: any, api: any) => ({
  ...createTeamSlice(set, get, api),
  ...createBattleSlice(set, get, api),
  ...createQueueBattleSlice(set, get, api),
  ...createSaveSlice(set, get, api),
  ...createStorySlice(set, get, api),
  ...createInventorySlice(set, get, api),
  ...createRewardsSlice(set, get, api),
});

// Only enable devtools in development to prevent state manipulation in production
export const useStore = import.meta.env.DEV
  ? create<Store>()(devtools(storeFactory, { name: 'vale-v2' }))
  : create<Store>()(storeFactory);

