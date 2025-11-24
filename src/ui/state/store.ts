/**
 * Zustand store combining all slices
 * Provides unified state management for the UI
 */

import { create } from 'zustand';
import type { GetState, SetState, StoreApi } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createBattleSlice, type BattleSlice } from './battleSlice';
import { createQueueBattleSlice, type QueueBattleSlice } from './queueBattleSlice';
import { createTeamSlice, type TeamSlice } from './teamSlice';
import { createSaveSlice, type SaveSlice } from './saveSlice';
import { createStorySlice, type StorySlice } from './storySlice';
import { createInventorySlice, type InventorySlice } from './inventorySlice';
import { createRewardsSlice, type RewardsSlice } from './rewardsSlice';
import { createGameFlowSlice, type GameFlowSlice } from './gameFlowSlice';
import { createOverworldSlice, type OverworldStore } from './overworldSlice';
import { createDialogueSlice, type DialogueSlice } from './dialogueSlice';
import { createDevModeSlice, type DevModeSlice } from './devModeSlice';
import { createTowerSlice, type TowerSlice } from './towerSlice';

export type Store = BattleSlice &
  QueueBattleSlice &
  TeamSlice &
  SaveSlice &
  StorySlice &
  InventorySlice &
  RewardsSlice &
  GameFlowSlice &
  OverworldStore &
  DialogueSlice &
  DevModeSlice &
  TowerSlice;

// Store factory function to combine all slices
const storeFactory = (set: SetState<Store>, get: GetState<Store>, api: StoreApi<Store>) => ({
  ...createTeamSlice(set, get, api),
  ...createBattleSlice(set, get, api),
  ...createQueueBattleSlice(set, get, api),
  ...createSaveSlice(set, get, api),
  ...createStorySlice(set, get, api),
  ...createInventorySlice(set, get, api),
  ...createRewardsSlice(set, get, api),
  ...createGameFlowSlice(set, get, api),
  ...createOverworldSlice(set, get, api),
  ...createDialogueSlice(set, get, api),
  ...createDevModeSlice(set, get, api),
  ...createTowerSlice(set, get, api),
});

export function createStore() {
  return create<Store>()(storeFactory);
}

// Only enable devtools in development to prevent state manipulation in production
export const useStore = import.meta.env.DEV
  ? create<Store>()(devtools(storeFactory, { name: 'vale-v2' }))
  : createStore();

// Export store instance for direct access (used in App.tsx for handleRewardsContinue)
export const store = useStore;
