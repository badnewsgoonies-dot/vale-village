/**
 * Narrator Character Definition
 *
 * The Narrator provides story context and sets the scene for battles,
 * chapters, and major events. Unlike NPC dialogues which are conversational,
 * the Narrator provides exposition and atmosphere.
 */

export const NARRATOR = {
  id: 'narrator',
  name: '', // No name displayed for narrator
  portrait: undefined, // No portrait for pure narration
  voice: 'narrator' as const,
};

/**
 * Different narrator styles for different contexts
 */
export const NARRATOR_STYLES = {
  // Epic, grand narration for chapter openings
  EPIC: {
    ...NARRATOR,
    name: '',
    voice: 'epic' as const,
  },

  // Battle context - setting the scene before fights
  BATTLE: {
    ...NARRATOR,
    name: 'Battle Narrator',
    voice: 'battle' as const,
  },

  // Tutorial guidance - helpful and instructive
  TUTORIAL: {
    ...NARRATOR,
    name: 'Guide',
    voice: 'tutorial' as const,
  },
} as const;
