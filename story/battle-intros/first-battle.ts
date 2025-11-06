/**
 * First Battle - Tutorial Battle Context
 *
 * Provides context for the player's very first battle.
 * Frames it as a training exercise to learn the combat system.
 */

import type { DialogueTree } from '@/types/Dialogue';

export const firstBattleIntro: DialogueTree = {
  npcId: 'first-battle-intro',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Elder',
      text: 'Before you can truly test your skills against other warriors, you must first understand the fundamentals of combat.',
      portrait: '/sprites/overworld/majornpcs/Elder.gif',
      nextNode: 'basics',
    },

    basics: {
      id: 'basics',
      speaker: 'Elder',
      text: 'In battle, you will command your party of Adepts. Each warrior has unique abilities - physical attacks, Psynergy spells, and special techniques.',
      portrait: '/sprites/overworld/majornpcs/Elder.gif',
      nextNode: 'elements',
    },

    elements: {
      id: 'elements',
      speaker: 'Elder',
      text: 'The four elements - Venus, Mars, Mercury, and Jupiter - each have strengths and weaknesses. A wise warrior exploits these advantages.',
      portrait: '/sprites/overworld/majornpcs/Elder.gif',
      nextNode: 'practice',
    },

    practice: {
      id: 'practice',
      speaker: 'Elder',
      text: 'Let us begin with a simple training exercise. I have conjured an elemental construct for you to battle. Defeat it to prove your readiness.',
      portrait: '/sprites/overworld/majornpcs/Elder.gif',
      nextNode: 'encourage',
    },

    encourage: {
      id: 'encourage',
      speaker: 'Elder',
      text: 'Remember: Watch your HP, manage your PP carefully, and choose your abilities wisely. May the elements guide you!',
      portrait: '/sprites/overworld/majornpcs/Elder.gif',
      action: {
        type: 'SET_FLAG',
        flag: 'tutorial_battle_complete',
        value: false,
      },
      nextNode: 'end',
    },

    end: {
      id: 'end',
      speaker: '',
      text: '',
      action: {
        type: 'END_DIALOGUE',
      },
    },
  },
};
