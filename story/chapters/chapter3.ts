/**
 * Chapter 3: The Ancient Challenge
 *
 * The player has proven themselves worthy to face the ultimate test -
 * the ancient guardians of Sol Sanctum's deepest chambers.
 */

import type { DialogueTree } from '@/types/Dialogue';

export const chapter3Intro: DialogueTree = {
  npcId: 'chapter3-intro',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: '',
      text: '═══ Chapter 3: The Ancient Challenge ═══',
      nextNode: 'recognition',
    },

    recognition: {
      id: 'recognition',
      speaker: '',
      text: 'Your victories in the tournament have proven your strength. But the true test of an Adept lies deeper - within the heart of Sol Sanctum itself.',
      nextNode: 'sanctum_history',
    },

    sanctum_history: {
      id: 'sanctum_history',
      speaker: '',
      text: 'The sanctum was built by ancient Adepts, masters of Alchemy whose power shaped the very land. Their legacy remains in the form of mystical guardians.',
      nextNode: 'trial',
    },

    trial: {
      id: 'trial',
      speaker: '',
      text: 'These guardians exist to test warriors who seek the deepest secrets of Psynergy. They are not evil - they are teachers, albeit harsh ones.',
      nextNode: 'kraden_research',
    },

    kraden_research: {
      id: 'kraden_research',
      speaker: 'Kraden',
      text: 'Fascinating! The guardians are constructs of pure elemental energy. My research suggests they adapt to test each warrior differently.',
      portrait: '/sprites/overworld/protagonists/Kraden.gif',
      nextNode: 'kraden_warning',
    },

    kraden_warning: {
      id: 'kraden_warning',
      speaker: 'Kraden',
      text: 'You have trained well, but these battles will push you to your absolute limits. Master your Psynergy, coordinate your party, and think tactically!',
      portrait: '/sprites/overworld/protagonists/Kraden.gif',
      nextNode: 'elder_blessing',
    },

    elder_blessing: {
      id: 'elder_blessing',
      speaker: 'Elder',
      text: 'Few warriors in each generation attempt this challenge. That you stand ready to face it speaks to your growth. Go forth with the blessing of Vale.',
      portrait: '/sprites/overworld/majornpcs/Elder.gif',
      nextNode: 'descent',
    },

    descent: {
      id: 'descent',
      speaker: '',
      text: 'You descend into the depths of Sol Sanctum. The air crackles with ancient power. The final trial awaits.',
      action: {
        type: 'END_DIALOGUE',
      },
    },
  },
};
