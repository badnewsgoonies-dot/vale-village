/**
 * Chapter 2: Tournament of Elements
 *
 * The village holds a tournament where Adepts compete to demonstrate
 * their mastery. This chapter frames battles as competitive matches.
 */

import type { DialogueTree } from '@/types/Dialogue';

export const chapter2Intro: DialogueTree = {
  npcId: 'chapter2-intro',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: '',
      text: '═══ Chapter 2: Tournament of Elements ═══',
      nextNode: 'announcement',
    },

    announcement: {
      id: 'announcement',
      speaker: '',
      text: 'Word spreads through Vale - the Elder has announced the Tournament of Elements, a grand competition to determine the village\'s most skilled warrior.',
      nextNode: 'preparation',
    },

    preparation: {
      id: 'preparation',
      speaker: '',
      text: 'Warriors sharpen their weapons, study their Psynergy, and prepare strategies. This is no mere training exercise - this is a chance to prove one\'s worth.',
      nextNode: 'reputation',
    },

    reputation: {
      id: 'reputation',
      speaker: '',
      text: 'Your recent battles have not gone unnoticed. Fellow Adepts speak of your skill with respect. You have earned your place in the tournament.',
      nextNode: 'elder_words',
    },

    elder_words: {
      id: 'elder_words',
      speaker: 'Elder',
      text: 'The Tournament of Elements is a sacred tradition. It is not about crushing your opponents, but about pushing each other to transcend your limits.',
      portrait: '/sprites/overworld/majornpcs/Elder.gif',
      nextNode: 'matches',
    },

    matches: {
      id: 'matches',
      speaker: 'Elder',
      text: 'You will face worthy opponents in a series of matches. Show them your strength, but also show them respect. May the best warrior prevail!',
      portrait: '/sprites/overworld/majornpcs/Elder.gif',
      action: {
        type: 'END_DIALOGUE',
      },
    },
  },
};
