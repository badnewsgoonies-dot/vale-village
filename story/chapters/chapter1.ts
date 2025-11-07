/**
 * Chapter 1: The Adepts of Vale
 *
 * Introduction to Vale Village and the concept of Adepts training
 * together. Establishes the player as a newcomer ready to prove themselves.
 */

import type { DialogueTree } from '@/types/Dialogue';

export const chapter1Intro: DialogueTree = {
  npcId: 'chapter1-intro',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: '',
      text: '═══ Chapter 1: The Adepts of Vale ═══',
      nextNode: 'village',
    },

    village: {
      id: 'village',
      speaker: '',
      text: 'Vale Village has long been home to those blessed with the power of Psynergy. Here, young warriors learn to harness the elemental forces under the watchful eye of the Elder.',
      nextNode: 'community',
    },

    community: {
      id: 'community',
      speaker: '',
      text: 'Garet, the fiery Mars Adept. Jenna, skilled in support magic. Isaac, master of earth Psynergy. Each brings their unique strengths to the training grounds.',
      nextNode: 'arrival',
    },

    arrival: {
      id: 'arrival',
      speaker: '',
      text: 'You have arrived in Vale to train among these warriors. The path ahead is not one of grand quests, but of constant improvement through honorable combat.',
      nextNode: 'invitation',
    },

    invitation: {
      id: 'invitation',
      speaker: 'Elder',
      text: 'Welcome, young Adept. Our village may seem small, but do not underestimate the warriors here. They have been training their entire lives.',
      portrait: '/sprites/overworld/majornpcs/Elder.gif',
      nextNode: 'challenge',
    },

    challenge: {
      id: 'challenge',
      speaker: 'Elder',
      text: 'Seek out your fellow Adepts. Challenge them, learn from them, and grow stronger together. That is the way of Vale.',
      portrait: '/sprites/overworld/majornpcs/Elder.gif',
      action: {
        type: 'END_DIALOGUE',
      },
    },
  },
};
