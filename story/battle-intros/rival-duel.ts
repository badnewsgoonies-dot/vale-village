/**
 * Rival Duel Battle Intro
 *
 * Used for competitive matches against specific rival Adepts.
 * More personal than tournament matches, these are grudge matches
 * or proving grounds between recurring opponents.
 */

import type { DialogueTree } from '@/types/Dialogue';

export const rivalDuelIntro: DialogueTree = {
  npcId: 'rival-duel-intro',
  startNode: 'challenge',
  nodes: {
    challenge: {
      id: 'challenge',
      speaker: '',
      text: 'Your rival steps forward, eyes burning with determination. This isn\'t just another sparring match - this is personal.',
      nextNode: 'rival_words',
    },

    rival_words: {
      id: 'rival_words',
      speaker: 'Garet',
      text: 'Isaac! I\'ve been training every day since our last match. This time, I won\'t hold back!',
      nextNode: 'intensity',
    },

    intensity: {
      id: 'intensity',
      speaker: '',
      text: 'The air crackles with Psynergy as both fighters prepare. Friendly rivalry pushes Adepts to exceed their limits.',
      nextNode: 'begin',
    },

    begin: {
      id: 'begin',
      speaker: '',
      text: 'Let the duel begin!',
      action: {
        type: 'END_DIALOGUE',
      },
    },
  },
};
