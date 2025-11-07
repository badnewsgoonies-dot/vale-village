/**
 * Tournament Battle - Competitive Arena Combat
 *
 * Context for tournament-style battles where Adepts compete
 * for glory and recognition.
 */

import type { DialogueTree } from '@/types/Dialogue';

export const tournamentIntro: DialogueTree = {
  npcId: 'tournament-intro',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: '',
      text: 'The Tournament of Elements - a prestigious competition held at Sol Sanctum where the greatest Adepts of Vale demonstrate their mastery.',
      nextNode: 'crowd',
    },

    crowd: {
      id: 'crowd',
      speaker: '',
      text: 'Villagers gather to watch as warriors clash in spectacular displays of Psynergy. Each match is a test of skill, strategy, and elemental prowess.',
      nextNode: 'stakes',
    },

    stakes: {
      id: 'stakes',
      speaker: '',
      text: 'Victory brings not gold or treasure, but something far more valuable - recognition as a true master of the ancient art of Alchemy.',
      nextNode: 'announcement',
    },

    announcement: {
      id: 'announcement',
      speaker: 'Elder',
      text: 'Combatants, take your positions! Remember - this is a tournament of honor. Fight with courage, respect your opponent, and show us the true power of an Adept!',
      portrait: '/sprites/overworld/majornpcs/Elder.gif',
      nextNode: 'begin',
    },

    begin: {
      id: 'begin',
      speaker: '',
      text: 'The arena falls silent. The battle is about to begin!',
      action: {
        type: 'END_DIALOGUE',
      },
    },
  },
};
