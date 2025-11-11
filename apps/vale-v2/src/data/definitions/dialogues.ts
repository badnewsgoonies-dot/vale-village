import type { DialogueTree } from '@/core/models/dialogue';

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
  'elder-vale': ELDER_DIALOGUE,
  'shopkeeper-weapons': SHOPKEEPER_DIALOGUE,
};
