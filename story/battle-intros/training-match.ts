/**
 * Training Match - Sparring with Fellow Warriors
 *
 * Context for friendly training battles with other Adepts.
 * Emphasizes improvement and learning through combat.
 */

import type { DialogueTree } from '@/types/Dialogue';

export const trainingMatchIntro: DialogueTree = {
  npcId: 'training-match-intro',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: '',
      text: 'The morning sun rises over Vale Village. In the training grounds near Sol Sanctum, warriors gather to test their skills against one another.',
      nextNode: 'purpose',
    },

    purpose: {
      id: 'purpose',
      speaker: '',
      text: 'This is no battle of life and death - it is a sacred tradition. Through friendly combat, Adepts push each other to grow stronger, faster, and wiser.',
      nextNode: 'honor',
    },

    honor: {
      id: 'honor',
      speaker: '',
      text: 'There is honor in both victory and defeat. The true measure of a warrior is not whether they win, but how they improve from each encounter.',
      nextNode: 'ready',
    },

    ready: {
      id: 'ready',
      speaker: '',
      text: 'Your opponent awaits. Step into the arena and show them the strength of your Psynergy!',
      action: {
        type: 'END_DIALOGUE',
      },
    },
  },
};
