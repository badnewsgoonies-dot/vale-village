/**
 * Story Model
 * Tracks chapter progression and story flags
 */

/**
 * Story flag ID
 */
export type FlagId = string;

/**
 * Story state
 * Tracks current chapter and flags
 */
export interface StoryState {
  /** Current chapter number */
  chapter: number;
  
  /** Story flags (booleans and counters) */
  flags: Record<FlagId, boolean | number>;
}

/**
 * Create initial story state
 */
export function createStoryState(chapter: number = 1): StoryState {
  return {
    chapter,
    flags: {},
  };
}

/**
 * Set a story flag
 */
export function setFlag(state: StoryState, flag: FlagId, value: boolean | number = true): StoryState {
  return {
    ...state,
    flags: {
      ...state.flags,
      [flag]: value,
    },
  };
}

/**
 * Get a story flag value
 */
export function getFlag(state: StoryState, flag: FlagId): boolean | number | undefined {
  return state.flags[flag];
}

/**
 * Check if a flag is set (truthy)
 */
export function hasFlag(state: StoryState, flag: FlagId): boolean {
  return Boolean(state.flags[flag]);
}

/**
 * Increment a numeric flag
 */
export function incrementFlag(state: StoryState, flag: FlagId, amount: number = 1): StoryState {
  const current = typeof state.flags[flag] === 'number' ? state.flags[flag] as number : 0;
  return setFlag(state, flag, current + amount);
}

