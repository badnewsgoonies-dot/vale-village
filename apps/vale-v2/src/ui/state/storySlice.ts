/**
 * Story state slice for Zustand
 * Manages story progression and flags
 */

import type { StateCreator } from 'zustand';
import type { BattleEvent } from '../../core/services/types';
import type { StoryState } from '../../core/models/story';
import { createStoryState } from '../../core/models/story';
import { processEncounterCompletion, advanceChapter, encounterIdToFlagKey } from '../../core/services/StoryService';
import type { BattleSlice } from './battleSlice';
import type { TeamSlice } from './teamSlice';
import type { SaveSlice } from './saveSlice';

export interface StorySlice {
  story: StoryState;
  showCredits: boolean;
  setShowCredits: (show: boolean) => void;
  onBattleEvents: (events: readonly BattleEvent[]) => void;
}

export const createStorySlice: StateCreator<
  StorySlice & BattleSlice & TeamSlice & SaveSlice,
  [['zustand/devtools', never]],
  [],
  StorySlice
> = (_set, get) => ({
  story: createStoryState(1),
  showCredits: false,
  
  setShowCredits: (show) => _set({ showCredits: show }),

  onBattleEvents: (events) => {
    let st = get().story;

    for (const e of events) {
      if (e.type === 'encounter-finished' && e.outcome === 'PLAYER_VICTORY') {
        st = processEncounterCompletion(st, e.encounterId);
        // Convert encounter ID to flag key for chapter advancement
        const flagKey = encounterIdToFlagKey(e.encounterId);
        const adv = advanceChapter(st, flagKey);
        if (adv.ok) {
          st = adv.value;
        }
        
        // Trigger credits screen when Chapter 3 boss is defeated
        if (flagKey === 'boss:ch3' && st.chapter === 4) {
          _set({ story: st, showCredits: true });
          return; // Early return to avoid double set
        }
      }
    }

    _set({ story: st });
  },
});

