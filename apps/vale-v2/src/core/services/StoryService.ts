/**
 * Story Service
 * Pure functions for story progression and gating
 */

import type { StoryState, FlagId } from '../models/story';
import type { Result } from '../utils/result';
import { setFlag, hasFlag } from '../models/story';

/**
 * Check if a requirement is met
 */
export function canAccess(state: StoryState, requirement: FlagId | FlagId[]): boolean {
  if (Array.isArray(requirement)) {
    // All flags must be set
    return requirement.every(flag => hasFlag(state, flag));
  }
  return hasFlag(state, requirement);
}

/**
 * Advance to next chapter
 */
export function advanceChapter(
  state: StoryState,
  completedKey: string
): Result<StoryState, string> {
  // Chapter 1 -> Chapter 2: Beat Chapter 1 boss
  // Accept both 'boss:ch1' (from flag) and 'c1_boss' (from encounter ID)
  if ((completedKey === 'boss:ch1' || completedKey === 'c1_boss') && state.chapter === 1) {
    // Ensure flag is set
    const newState = setFlag(state, 'boss:ch1', true);
    return {
      ok: true,
      value: {
        ...newState,
        chapter: 2,
      },
    };
  }
  
  // Chapter 2 -> Chapter 3: Beat Chapter 2 boss
  if ((completedKey === 'boss:ch2' || completedKey === 'c2_boss') && state.chapter === 2) {
    const newState = setFlag(state, 'boss:ch2', true);
    return {
      ok: true,
      value: {
        ...newState,
        chapter: 3,
      },
    };
  }
  
  // Chapter 3 -> Credits: Beat Chapter 3 boss
  if ((completedKey === 'boss:ch3' || completedKey === 'c3_boss') && state.chapter === 3) {
    const newState = setFlag(state, 'boss:ch3', true);
    return {
      ok: true,
      value: {
        ...newState,
        chapter: 4, // Credits chapter
      },
    };
  }
  
  return {
    ok: false,
    error: `No chapter transition available for ${completedKey} at chapter ${state.chapter}`,
  };
}

/**
 * Process encounter completion
 * Sets flags based on encounter ID
 */
export function processEncounterCompletion(
  state: StoryState,
  encounterId: string
): StoryState {
  let newState = state;
  
  // Map encounter IDs to flags
  if (encounterId === 'c1_boss' || encounterId === 'boss:ch1') {
    newState = setFlag(newState, 'boss:ch1', true);
  } else if (encounterId === 'c1_mini_boss' || encounterId === 'c1_miniboss') {
    newState = setFlag(newState, 'miniboss:ch1', true);
  } else if (encounterId.startsWith('c1_normal_')) {
    // Track normal encounters
    const encounterNum = encounterId.replace('c1_normal_', '');
    newState = setFlag(newState, `encounter:ch1:${encounterNum}`, true);
  }
  
  return newState;
}

