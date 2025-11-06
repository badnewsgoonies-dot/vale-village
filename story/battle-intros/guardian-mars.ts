/**
 * Mars Guardian Battle Intro
 *
 * The Mars Guardian tests passion, control, and the discipline
 * required to wield flame. Fire Adepts must prove they can
 * harness their burning intensity without being consumed by it.
 */

import type { DialogueTree } from '@/types/Dialogue';

export const marsGuardianIntro: DialogueTree = {
  npcId: 'mars-guardian-intro',
  startNode: 'heat',
  nodes: {
    heat: {
      id: 'heat',
      speaker: '',
      text: 'The temperature soars. Flames erupt from braziers that haven\'t burned in centuries. A figure of living fire takes shape.',
      nextNode: 'guardian_roar',
    },

    guardian_roar: {
      id: 'guardian_roar',
      speaker: 'Mars Guardian',
      text: 'Another flame-wielder seeks glory? Let us see if your fire burns with true purpose!',
      nextNode: 'passion',
    },

    passion: {
      id: 'passion',
      speaker: 'Mars Guardian',
      text: 'Fire is passion given form - wild, consuming, unstoppable. But passion without discipline is mere destruction.',
      nextNode: 'challenge',
    },

    challenge: {
      id: 'challenge',
      speaker: 'Mars Guardian',
      text: 'Your flames must burn with intensity AND control. Show me you can wield fire without being consumed by it!',
      nextNode: 'ready',
    },

    ready: {
      id: 'ready',
      speaker: '',
      text: 'The guardian ignites in a pillar of flame. The trial of fire begins.',
      action: {
        type: 'END_DIALOGUE',
      },
    },
  },
};
