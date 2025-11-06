/**
 * Sol Sanctum Challenge - Ancient Trial
 *
 * Context for battles within Sol Sanctum itself, where warriors
 * face mystical guardians and elemental challenges.
 */

import type { DialogueTree } from '@/types/Dialogue';

export const sanctumChallengeIntro: DialogueTree = {
  npcId: 'sanctum-challenge-intro',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: '',
      text: 'Deep within Sol Sanctum, ancient magic still flows. The walls themselves remember countless battles fought by warriors long past.',
      nextNode: 'guardians',
    },

    guardians: {
      id: 'guardians',
      speaker: '',
      text: 'Mystical guardians, created by the Alchemy of old, protect the inner chambers. They exist not to harm, but to test those who seek to prove their worth.',
      nextNode: 'tradition',
    },

    tradition: {
      id: 'tradition',
      speaker: '',
      text: 'For generations, Adepts have challenged these guardians. To defeat them is to honor the ancient warriors who built this sacred place.',
      nextNode: 'warning',
    },

    warning: {
      id: 'warning',
      speaker: 'Kraden',
      text: 'The guardians of Sol Sanctum are formidable opponents. They will test every aspect of your abilities - offense, defense, and tactical thinking.',
      portrait: '/sprites/overworld/protagonists/Kraden.gif',
      nextNode: 'encouragement',
    },

    encouragement: {
      id: 'encouragement',
      speaker: 'Kraden',
      text: 'But do not fear! This is an ancient rite of passage. Show the guardians the strength of your spirit!',
      portrait: '/sprites/overworld/protagonists/Kraden.gif',
      nextNode: 'begin',
    },

    begin: {
      id: 'begin',
      speaker: '',
      text: 'The guardian awakens. The trial begins!',
      action: {
        type: 'END_DIALOGUE',
      },
    },
  },
};
