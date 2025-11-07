/**
 * Mercury Guardian Battle Intro
 *
 * The Mercury Guardian tests wisdom, control, and the balance
 * between healing and harm. This spirit judges whether the Adept
 * can wield water's power responsibly.
 */

import type { DialogueTree } from '@/types/Dialogue';

export const mercuryGuardianIntro: DialogueTree = {
  npcId: 'mercury-guardian-intro',
  startNode: 'entrance',
  nodes: {
    entrance: {
      id: 'entrance',
      speaker: '',
      text: 'The chamber fills with a deep chill. Frost patterns spread across the ancient stone walls as a shimmering figure materializes.',
      nextNode: 'guardian_appears',
    },

    guardian_appears: {
      id: 'guardian_appears',
      speaker: 'Mercury Guardian',
      text: 'So... another mortal seeks to prove their mastery of water\'s gift.',
      nextNode: 'test',
    },

    test: {
      id: 'test',
      speaker: 'Mercury Guardian',
      text: 'Mercury Psynergy is not merely the power to freeze and flow - it is the wisdom to know when to heal and when to harm.',
      nextNode: 'challenge',
    },

    challenge: {
      id: 'challenge',
      speaker: 'Mercury Guardian',
      text: 'Show me you understand this balance. Face me not with brute force, but with wisdom and control.',
      nextNode: 'ready',
    },

    ready: {
      id: 'ready',
      speaker: '',
      text: 'The guardian raises its crystalline staff. The trial begins.',
      action: {
        type: 'END_DIALOGUE',
      },
    },
  },
};
