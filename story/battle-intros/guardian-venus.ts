/**
 * Venus Guardian Battle Intro
 *
 * The Venus Guardian tests strength, resolve, and unwavering determination.
 * Earth Adepts must prove they have the fortitude to stand unmoved
 * against any challenge.
 */

import type { DialogueTree } from '@/types/Dialogue';

export const venusGuardianIntro: DialogueTree = {
  npcId: 'venus-guardian-intro',
  startNode: 'rumble',
  nodes: {
    rumble: {
      id: 'rumble',
      speaker: '',
      text: 'The ground trembles beneath your feet. Stone pillars rise from the floor as an ancient presence awakens.',
      nextNode: 'guardian_voice',
    },

    guardian_voice: {
      id: 'guardian_voice',
      speaker: 'Venus Guardian',
      text: 'You dare enter this sanctum, child of earth?',
      nextNode: 'test_strength',
    },

    test_strength: {
      id: 'test_strength',
      speaker: 'Venus Guardian',
      text: 'Strength alone means nothing without the resolve to use it. Power without purpose is merely destruction.',
      nextNode: 'challenge',
    },

    challenge: {
      id: 'challenge',
      speaker: 'Venus Guardian',
      text: 'Prove to me that your foundation is unshakeable. Show me the determination that makes mountains immovable!',
      nextNode: 'ready',
    },

    ready: {
      id: 'ready',
      speaker: '',
      text: 'The guardian slams its massive fists together, creating a thunderous crack. The trial of earth begins.',
      action: {
        type: 'END_DIALOGUE',
      },
    },
  },
};
