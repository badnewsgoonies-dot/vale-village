/**
 * Story state slice for Zustand
 * Manages story progression and flags
 */

import type { StateCreator } from 'zustand';
import type { BattleEvent } from '../../core/services/types';
import type { StoryState } from '../../core/models/story';
import { createStoryState, setFlag } from '../../core/models/story';
import { processEncounterCompletion, advanceChapter, encounterIdToFlagKey, processStoryFlagForDjinn, processStoryFlagForUnit } from '../../core/services/StoryService';
import type { BattleSlice } from './battleSlice';
import type { TeamSlice } from './teamSlice';
import type { SaveSlice } from './saveSlice';

export interface StorySlice {
  story: StoryState;
  showCredits: boolean;
  setShowCredits: (show: boolean) => void;
  setStoryFlag: (key: string, value: boolean | number) => void;
  getStoryFlag: (key: string) => boolean | number | undefined;
  setStoryState: (story: StoryState) => void;
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

  setStoryState: (storyState) => {
    _set({ story: storyState });
  },

  setStoryFlag: (key, value) => {
    const story = get().story;
    const team = get().team;
    
    // Process story flag (includes Djinn granting)
    if (team) {
      const result = processStoryFlagForDjinn(story, team, key, value);
      
      // Update story state
      _set({ story: result.story });
      
      // Update team if Djinn was granted
      if (result.djinnGranted) {
        get().updateTeam(result.team);
        console.log(`🎉 Djinn ${result.djinnGranted} granted from story flag: ${key}`);
      }
    } else {
      // No team available, just update story
    const updatedStory = setFlag(story, key, value);
    _set({ story: updatedStory });
    }
  },

  getStoryFlag: (key) => {
    return get().story.flags[key];
  },

  onBattleEvents: (events) => {
    let st = get().story;
    const team = get().team;

    for (const e of events) {
      if (e.type === 'encounter-finished' && e.outcome === 'PLAYER_VICTORY') {
        st = processEncounterCompletion(st, e.encounterId);
        // Convert encounter ID to flag key for chapter advancement
        const flagKey = encounterIdToFlagKey(e.encounterId);

        // Process story flag for Djinn (if team available)
        if (team) {
          const djinnResult = processStoryFlagForDjinn(st, team, flagKey, true);
          st = djinnResult.story;

          // Update team if Djinn was granted
          if (djinnResult.djinnGranted) {
            get().updateTeam(djinnResult.team);
            console.log(`🎉 Djinn ${djinnResult.djinnGranted} granted from encounter: ${e.encounterId}`);
          }
        }

        // Process story flag for Unit recruitment (story joins)
        // For house encounters, use the house ID directly (e.g., 'house-02') instead of flagKey
        // because STORY_FLAG_TO_UNIT uses house-XX keys
        const storyJoinFlagKey = e.encounterId.startsWith('house-') ? e.encounterId : flagKey;
        const avgLevel = team ? Math.max(1, Math.floor(team.units.reduce((sum, u) => sum + u.level, 0) / team.units.length)) : 1;
        const unitResult = processStoryFlagForUnit(st, storyJoinFlagKey, true, avgLevel);
        st = unitResult.story;

        // Add recruited unit to roster if applicable
        if (unitResult.recruitedUnit) {
          get().addUnitToRoster(unitResult.recruitedUnit);
          console.log(`🎉 Unit ${unitResult.recruitedUnit.name} recruited from story join: ${e.encounterId}`);
        }

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

