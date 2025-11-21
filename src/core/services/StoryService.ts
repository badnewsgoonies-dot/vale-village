/**
 * Story Service
 * Pure functions for story progression and gating
 */

import type { StoryState, FlagId } from '../models/story';
import type { Result } from '../utils/result';
import type { Team } from '../models/Team';
import type { Unit } from '../models/Unit';
import { setFlag, hasFlag } from '../models/story';
import { collectDjinn } from './DjinnService';
import { createUnit } from '../models/Unit';
import { STORY_FLAG_TO_DJINN, STORY_FLAG_TO_UNIT } from '../../data/definitions/storyFlags';
import { UNIT_DEFINITIONS } from '../../data/definitions/units';

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
  // House-based encounters (Chapter 1: Liberation of Vale)
  if (encounterId === 'house-20') return 'boss:ch1'; // Final boss
  if (encounterId.startsWith('house-')) {
    const match = encounterId.match(/^house-(\d+)$/);
    if (match) {
      const houseNum = parseInt(match[1]!, 10);
      return `encounter:ch1:${houseNum}`;
    }
  }
  
  // Legacy boss encounters
  if (encounterId === 'c1_boss') return 'boss:ch1';
  if (encounterId === 'c2_boss') return 'boss:ch2';
  if (encounterId === 'c3_boss') return 'boss:ch3';
  
  // Legacy mini-boss encounters
  if (encounterId === 'c1_mini_boss' || encounterId === 'c1_miniboss') return 'miniboss:ch1';
  if (encounterId === 'c2_mini_boss' || encounterId === 'c2_miniboss') return 'miniboss:ch2';
  if (encounterId === 'c3_mini_boss' || encounterId === 'c3_miniboss') return 'miniboss:ch3';
  
  // Legacy normal encounters (track by chapter and number)
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
 * For house encounters, sets both the encounter flag and the house flag
 */
export function processEncounterCompletion(
  state: StoryState,
  encounterId: string
): StoryState {
  const flagKey = encounterIdToFlagKey(encounterId);
  let updatedState = setFlag(state, flagKey, true);
  
  // For house encounters, also set the house flag directly (e.g., 'house-02')
  // This is needed for:
  // 1. House unlocking (isHouseUnlocked checks house-XX flags)
  // 2. Story joins (STORY_FLAG_TO_UNIT uses house-XX keys)
  if (encounterId.startsWith('house-')) {
    updatedState = setFlag(updatedState, encounterId, true);
  }
  
  return updatedState;
}

/**
 * Check if a house encounter is unlocked
 * House 1 is always unlocked
 * House N is unlocked if House N-1 is defeated
 * 
 * @param story - Current story state
 * @param houseId - House encounter ID (e.g., 'house-03')
 * @returns true if house is unlocked, false otherwise
 */
export function isHouseUnlocked(story: StoryState, houseId: string): boolean {
  // House 1 always unlocked
  if (houseId === 'house-01') return true;

  // Extract house number from ID (e.g., 'house-03' → 3)
  const match = houseId.match(/^house-(\d+)$/);
  if (!match) return false;

  const [, houseNumRaw] = match;
  if (!houseNumRaw) return false;
  const houseNum = parseInt(houseNumRaw, 10);

  // House N unlocked if House N-1 defeated
  const prevHouseId = `house-${String(houseNum - 1).padStart(2, '0')}`;
  return story.flags[prevHouseId] === true;
}

/**
 * Process story flag and grant Djinn if applicable
 * Pure function - no side effects
 * 
 * @param story - Current story state
 * @param team - Current team state
 * @param flagId - Story flag being set
 * @param flagValue - Value being set (only grants Djinn if true)
 * @returns Updated story and team (team unchanged if no Djinn granted)
 */
export function processStoryFlagForDjinn(
  story: StoryState,
  team: Team,
  flagId: string,
  flagValue: boolean | number
): { story: StoryState; team: Team; djinnGranted: string | null } {
  // Update story flag first
  const updatedStory = setFlag(story, flagId, flagValue);
  
  // Only grant Djinn if flag is being set to true
  if (flagValue !== true) {
    return { story: updatedStory, team, djinnGranted: null };
  }
  
  // Check if this flag grants a Djinn
  const djinnId = STORY_FLAG_TO_DJINN[flagId];
  if (!djinnId) {
    return { story: updatedStory, team, djinnGranted: null };
  }
  
  // Try to collect Djinn (pure function)
  const collectResult = collectDjinn(team, djinnId);
  if (collectResult.ok) {
    return { story: updatedStory, team: collectResult.value, djinnGranted: djinnId };
  }
  
  // Already collected or error - return unchanged team
  // This is safe - collectDjinn returns error if already collected, which we ignore
  return { story: updatedStory, team, djinnGranted: null };
}

/**
 * Process story flag and recruit unit if applicable
 * Pure function - no side effects
 *
 * @param story - Current story state
 * @param flagId - Story flag being set
 * @param flagValue - Value being set (only recruits unit if true)
 * @param currentLevel - Current party level (for unit creation)
 * @returns Updated story and recruited unit (null if no unit recruited)
 */
export function processStoryFlagForUnit(
  story: StoryState,
  flagId: string,
  flagValue: boolean | number,
  currentLevel: number = 1
): { story: StoryState; recruitedUnit: Unit | null } {
  // Update story flag first
  const updatedStory = setFlag(story, flagId, flagValue);

  // Only recruit unit if flag is being set to true
  if (flagValue !== true) {
    return { story: updatedStory, recruitedUnit: null };
  }

  // Check if this flag recruits a unit
  const unitId = STORY_FLAG_TO_UNIT[flagId];
  if (!unitId) {
    return { story: updatedStory, recruitedUnit: null };
  }

  // Get unit definition
  const unitDef = UNIT_DEFINITIONS[unitId];
  if (!unitDef) {
    console.error(`Unit definition ${unitId} not found`);
    return { story: updatedStory, recruitedUnit: null };
  }

  // Create unit at current party level (level 1 for Houses 2-3)
  const recruitedUnit = createUnit(unitDef, currentLevel, 0);

  return { story: updatedStory, recruitedUnit };
}

