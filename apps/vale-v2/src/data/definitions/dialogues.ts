import type { DialogueTree } from '@/core/models/dialogue';
import { VS1_SCENE_PRE, VS1_SCENE_POST, VS1_ENCOUNTER_ID } from '../../story/vs1Constants';
import { RECRUITMENT_DIALOGUES } from './recruitmentDialogues';
import { HOUSE_ENEMY_DIALOGUES } from './houseEnemyDialogues';

export const VS1_PRE_SCENE: DialogueTree = {
  id: VS1_SCENE_PRE,
  name: "VS1: Garet's Challenge",
  startNodeId: 'intro',
  nodes: [
    {
      id: 'intro',
      speaker: 'Isaac',
      text: 'Garet... I need to prove myself.',
      portrait: 'isaac',
      nextNodeId: 'challenge',
    },
    {
      id: 'challenge',
      speaker: 'Garet',
      text: "Show me what you've got, Isaac! Let's see if you're ready.",
      portrait: 'garet',
      effects: { startBattle: VS1_ENCOUNTER_ID },
    },
  ],
};

export const VS1_POST_SCENE: DialogueTree = {
  id: VS1_SCENE_POST,
  name: 'VS1: Garet Joins',
  startNodeId: 'victory',
  nodes: [
    {
      id: 'victory',
      speaker: 'Isaac',
      text: 'You fought well, Garet.',
      portrait: 'isaac',
      nextNodeId: 'garet-response',
    },
    {
      id: 'garet-response',
      speaker: 'Garet',
      text: "You've got what it takes. I'm joining your team!",
      portrait: 'garet',
      nextNodeId: 'forge',
    },
    {
      id: 'forge',
      speaker: 'Garet',
      text: "And take this Forge Djinn - it'll help us both in battle.",
      portrait: 'garet',
    },
  ],
};

// First Djinn Intro - Flint explains the global Djinn pool
export const DJINN_INTRO_DIALOGUE: DialogueTree = {
  id: 'tutorial:djinn-intro',
  name: 'Djinn Tutorial: Flint\'s Guidance',
  startNodeId: 'flint-appears',
  nodes: [
    {
      id: 'flint-appears',
      speaker: 'Flint',
      text: "Hey Isaac! I\'m Flint, your first Djinn. Mind if I explain how my power works?",
      portrait: 'djinn-venus',
      nextNodeId: 'djinn-explain-pool',
    },
    {
      id: 'djinn-explain-pool',
      speaker: 'Flint',
      text: 'Djinn travel as a shared pool for your whole party. You can Set up to three of us at once.',
      portrait: 'djinn-venus',
      nextNodeId: 'djinn-explain-team',
    },
    {
      id: 'djinn-explain-team',
      speaker: 'Flint',
      text: 'When we\'re Set, we empower every Adept in your active team with new abilities and stat boosts.',
      portrait: 'djinn-venus',
      nextNodeId: 'djinn-prebattle-reminder',
    },
    {
      id: 'djinn-prebattle-reminder',
      speaker: 'Flint',
      text: 'Before big fights, you\'ll see a Djinn panel during battle prep. That\'s where you pick which three of us travel into combat.',
      portrait: 'djinn-venus',
      nextNodeId: 'djinn-outro',
    },
    {
      id: 'djinn-outro',
      speaker: 'Flint',
      text: "That\'s all you need for now. I\'ll handle the rest—just remember to keep an eye on those three slots!",
      portrait: 'djinn-venus',
      effects: {
        // Use story flag for tutorial completion; Djinn is already present from the starting team setup
        first_djinn_intro_completed: true,
      },
    },
  ],
};

export const ELDER_DIALOGUE: DialogueTree = {
  id: 'elder-vale',
  name: 'Elder of Vale',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Elder Vale',
      text: 'Welcome, young warrior. I sense great power within you.',
      portrait: 'elder',
      nextNodeId: 'ask-quest',
    },
    {
      id: 'ask-quest',
      speaker: 'Elder Vale',
      text: 'The forest to the east has been plagued by bandits. Can you help us?',
      portrait: 'elder',
      choices: [
        { id: 'accept', text: 'I will help the village.', nextNodeId: 'quest-accepted', effects: { questAccepted: true } },
        { id: 'decline', text: 'I am not ready yet.', nextNodeId: 'quest-declined' },
      ],
    },
    {
      id: 'quest-accepted',
      speaker: 'Elder Vale',
      text: 'Thank you! May the stars guide you.',
      portrait: 'elder',
    },
    {
      id: 'quest-declined',
      speaker: 'Elder Vale',
      text: 'I understand. Come back when you are ready.',
      portrait: 'elder',
    },
  ],
};

export const SHOPKEEPER_DIALOGUE: DialogueTree = {
  id: 'shopkeeper-weapons',
  name: 'Weapon Shop Owner',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Shopkeeper',
      text: 'Welcome to my shop! Looking for a new weapon?',
      portrait: 'shopkeeper',
      choices: [
        { id: 'buy', text: 'Show me your wares.', nextNodeId: 'show-shop' },
        { id: 'leave', text: 'Just browsing.', nextNodeId: 'farewell' },
      ],
    },
    {
      id: 'show-shop',
      speaker: 'Shopkeeper',
      text: 'Here are my finest weapons!',
      portrait: 'shopkeeper',
      effects: { openShop: true },
    },
    {
      id: 'farewell',
      speaker: 'Shopkeeper',
      text: 'Come back anytime!',
      portrait: 'shopkeeper',
    },
  ],
};

export const DIALOGUES: Record<string, DialogueTree> = {
  // VS1 Demo
  [VS1_SCENE_PRE]: VS1_PRE_SCENE,
  [VS1_SCENE_POST]: VS1_POST_SCENE,
  // Tutorials
  'tutorial:djinn-intro': DJINN_INTRO_DIALOGUE,
  // Existing dialogues
  'elder-vale': ELDER_DIALOGUE,
  'shopkeeper-weapons': SHOPKEEPER_DIALOGUE,
  // Recruitment dialogues (Houses 1-20)
  ...RECRUITMENT_DIALOGUES,
  // Overworld house defenders (Houses 1-20)
  ...HOUSE_ENEMY_DIALOGUES,
};
