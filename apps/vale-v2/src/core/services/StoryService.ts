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
 * Accepts either encounter ID (e.g., 'c1_boss') or flag key (e.g., 'boss:ch1')
 */
export function advanceChapter(
  state: StoryState,
  completedKey: string
): Result<StoryState, string> {
  // Normalize to flag key
  const flagKey = encounterIdToFlagKey(completedKey);
  
  // Chapter 1 -> Chapter 2: Beat Chapter 1 boss
  if (flagKey === 'boss:ch1' && state.chapter === 1) {
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
  if (flagKey === 'boss:ch2' && state.chapter === 2) {
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
  if (flagKey === 'boss:ch3' && state.chapter === 3) {
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
    error: `No chapter transition available for ${completedKey} (${flagKey}) at chapter ${state.chapter}`,
  };
}

/**
 * Map encounter ID to flag key
 * Centralized mapping for encounter IDs to story flag keys
 */
export function encounterIdToFlagKey(encounterId: string): string {
  // Boss encounters
  if (encounterId === 'c1_boss') return 'boss:ch1';
  if (encounterId === 'c2_boss') return 'boss:ch2';
  if (encounterId === 'c3_boss') return 'boss:ch3';
  
  // Mini-boss encounters
  if (encounterId === 'c1_mini_boss' || encounterId === 'c1_miniboss') return 'miniboss:ch1';
  if (encounterId === 'c2_mini_boss' || encounterId === 'c2_miniboss') return 'miniboss:ch2';
  if (encounterId === 'c3_mini_boss' || encounterId === 'c3_miniboss') return 'miniboss:ch3';
  
  // Normal encounters (track by chapter and number)
  if (encounterId.startsWith('c1_normal_')) {
    const encounterNum = encounterId.replace('c1_normal_', '');
    return `encounter:ch1:${encounterNum}`;
  }
  if (encounterId.startsWith('c2_normal_')) {
    const encounterNum = encounterId.replace('c2_normal_', '');
    return `encounter:ch2:${encounterNum}`;
  }
  if (encounterId.startsWith('c3_normal_')) {
    const encounterNum = encounterId.replace('c3_normal_', '');
    return `encounter:ch3:${encounterNum}`;
  }
  
  // If already a flag key, return as-is
  if (encounterId.startsWith('boss:') || encounterId.startsWith('miniboss:') || encounterId.startsWith('encounter:')) {
    return encounterId;
  }
  
  // Fallback: use encounter ID as flag key
  return encounterId;
}

/**
 * Process encounter completion
 * Sets flags based on encounter ID
 */
export function processEncounterCompletion(
  state: StoryState,
  encounterId: string
): StoryState {
  const flagKey = encounterIdToFlagKey(encounterId);
  return setFlag(state, flagKey, true);
}

