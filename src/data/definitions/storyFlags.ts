/**
 * Story Flag Definitions
 * Maps story flags to Djinn acquisition and Unit recruitment
 *
 * Story flags are set when:
 * - Completing encounters (via processEncounterCompletion)
 * - Dialogue choices (via processDialogueEffects)
 * - Manual story progression (via setStoryFlag)
 */

/**
 * Mapping of story flag IDs to Unit IDs (Story Joins)
 * When a flag is set to `true`, the corresponding Unit is recruited
 *
 * Story joins are automatic recruitments that occur after battle completion
 * (separate from battle reward recruits which use encounter.reward.unlockUnit)
 */
export const STORY_FLAG_TO_UNIT: Record<string, string> = {
  // Houses 1-20 Progression: Story Joins
  'house-02': 'mystic',   // Mystic joins after House 2
  'house-03': 'ranger',   // Ranger joins after House 3
};

/**
 * Mapping of story flag IDs to Djinn IDs
 * When a flag is set to `true`, the corresponding Djinn is granted
 */
export const STORY_FLAG_TO_DJINN: Record<string, string> = {
  // Chapter 1 Djinn
  'house:liberated:02': 'flint',      // First liberated house grants Flint (Venus T1)
  'boss:ch1': 'granite',               // Chapter 1 boss grants Granite (Venus T2)
  
  // Chapter 2 Djinn
  'house:liberated:04': 'forge',      // Second liberated house grants Forge (Mars T1)
  'miniboss:ch2': 'corona',           // Chapter 2 miniboss grants Corona (Mars T2)
  
  // Chapter 3 Djinn
  'boss:ch2': 'bane',                 // Chapter 2 boss grants Bane (Venus T3)
  'house:liberated:06': 'fury',       // Third liberated house grants Fury (Mars T3)
  
  // Mercury Djinn (water/ice)
  'encounter:ch1:special': 'fizz',   // Special encounter grants Fizz (Mercury T1)
  'miniboss:ch1': 'tonic',            // Chapter 1 miniboss grants Tonic (Mercury T2)
  'encounter:ch2:special': 'crystal', // Special encounter grants Crystal (Mercury T3)
  
  // Jupiter Djinn (wind/storm)
  'encounter:ch1:wind': 'breeze',     // Wind encounter grants Breeze (Jupiter T1)
  'miniboss:ch3': 'squall',           // Chapter 3 miniboss grants Squall (Jupiter T2)
  'boss:ch3': 'storm',                // Chapter 3 boss grants Storm (Jupiter T3)
};

/**
 * Djinn Acquisition Timeline
 * Documents when each Djinn is acquired in the story
 */
export const DJINN_ACQUISITION_TIMELINE: Array<{
  flagId: string;
  djinnId: string;
  description: string;
  chapter: number;
}> = [
  {
    flagId: 'house:liberated:02',
    djinnId: 'flint',
    description: 'First liberated house - grants Flint (Venus T1)',
    chapter: 1,
  },
  {
    flagId: 'encounter:ch1:wind',
    djinnId: 'breeze',
    description: 'Wind encounter - grants Breeze (Jupiter T1)',
    chapter: 1,
  },
  {
    flagId: 'encounter:ch1:special',
    djinnId: 'fizz',
    description: 'Special encounter - grants Fizz (Mercury T1)',
    chapter: 1,
  },
  {
    flagId: 'miniboss:ch1',
    djinnId: 'tonic',
    description: 'Chapter 1 miniboss - grants Tonic (Mercury T2)',
    chapter: 1,
  },
  {
    flagId: 'boss:ch1',
    djinnId: 'granite',
    description: 'Chapter 1 boss - grants Granite (Venus T2)',
    chapter: 1,
  },
  {
    flagId: 'house:liberated:04',
    djinnId: 'forge',
    description: 'Second liberated house - grants Forge (Mars T1)',
    chapter: 2,
  },
  {
    flagId: 'miniboss:ch2',
    djinnId: 'corona',
    description: 'Chapter 2 miniboss - grants Corona (Mars T2)',
    chapter: 2,
  },
  {
    flagId: 'encounter:ch2:special',
    djinnId: 'crystal',
    description: 'Special encounter - grants Crystal (Mercury T3)',
    chapter: 2,
  },
  {
    flagId: 'boss:ch2',
    djinnId: 'bane',
    description: 'Chapter 2 boss - grants Bane (Venus T3)',
    chapter: 2,
  },
  {
    flagId: 'house:liberated:06',
    djinnId: 'fury',
    description: 'Third liberated house - grants Fury (Mars T3)',
    chapter: 3,
  },
  {
    flagId: 'miniboss:ch3',
    djinnId: 'squall',
    description: 'Chapter 3 miniboss - grants Squall (Jupiter T2)',
    chapter: 3,
  },
  {
    flagId: 'boss:ch3',
    djinnId: 'storm',
    description: 'Chapter 3 boss - grants Storm (Jupiter T3)',
    chapter: 3,
  },
];

