/**
 * Jupiter Guardian Battle Intro
 *
 * The Jupiter Guardian tests speed, precision, and adaptability.
 * Wind Adepts must prove they can harness the unpredictable
 * nature of air and lightning with perfect timing.
 */

import type { DialogueTree } from '@/types/Dialogue';

export const jupiterGuardianIntro: DialogueTree = {
  npcId: 'jupiter-guardian-intro',
  startNode: 'wind',
  nodes: {
    wind: {
      id: 'wind',
      speaker: '',
      text: 'A sudden gust sweeps through the chamber. Lightning crackles in the air as a swift, ethereal form materializes.',
      nextNode: 'guardian_voice',
    },

    guardian_voice: {
      id: 'guardian_voice',
      speaker: 'Jupiter Guardian',
      text: 'Swift as the wind, fierce as the storm... but do you possess the precision to strike true?',
      nextNode: 'speed',
    },

    speed: {
      id: 'speed',
      speaker: 'Jupiter Guardian',
      text: 'Speed without purpose is merely chaos. Lightning without aim is wasted energy.',
      nextNode: 'challenge',
    },

    challenge: {
      id: 'challenge',
      speaker: 'Jupiter Guardian',
      text: 'Prove to me that you can match the tempest\'s fury with the archer\'s precision. Adapt or fall!',
      nextNode: 'ready',
    },

    ready: {
      id: 'ready',
      speaker: '',
      text: 'The guardian vanishes in a flash of lightning. The trial of wind begins.',
      action: {
        type: 'END_DIALOGUE',
      },
    },
  },
};
