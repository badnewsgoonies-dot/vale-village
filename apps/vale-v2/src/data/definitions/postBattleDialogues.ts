import type { DialogueTree } from '../schemas/DialogueSchema';

/**
 * Post-battle dialogues that play after liberation encounters.
 * These are separate from pre-battle dialogues to allow clean state transitions:
 * pre-battle dialogue → battle → rewards → post-battle dialogue → recruitment
 */

export const HOUSE_01_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-01-post-battle',
  name: 'House 1 Liberation Complete',
  startNodeId: 'wolf-freed',
  nodes: [
    {
      id: 'wolf-freed',
      speaker: 'Isaac',
      text: "The wolf... it's free! The shadow has lifted.",
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_02_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-02-post-battle',
  name: 'House 2 Liberation Complete',
  startNodeId: 'bear-freed',
  nodes: [
    {
      id: 'bear-freed',
      speaker: 'Isaac',
      text: "Another creature saved. We're making progress.",
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_03_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-03-post-battle',
  name: 'House 3 Liberation Complete',
  startNodeId: 'hawk-freed',
  nodes: [
    {
      id: 'hawk-freed',
      speaker: 'Isaac',
      text: 'The hawk is free! Its strength is returning.',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_04_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-04-post-battle',
  name: 'House 4 Liberation Complete',
  startNodeId: 'lion-freed',
  nodes: [
    {
      id: 'lion-freed',
      speaker: 'Isaac',
      text: 'A mighty lion, restored. The darkness is weakening.',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_05_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-05-post-battle',
  name: 'House 5 Liberation Complete',
  startNodeId: 'dragon-freed',
  nodes: [
    {
      id: 'dragon-freed',
      speaker: 'Isaac',
      text: 'The dragon is free! All five houses have been liberated.',
      portrait: 'isaac',
    },
  ],
};

/**
 * Maps encounter IDs to their post-battle dialogue IDs.
 * Checked by App.tsx after battle completion to trigger celebration dialogues.
 */
export const ENCOUNTER_TO_POST_BATTLE_DIALOGUE: Record<string, string> = {
  'house-01': 'house-01-post-battle',
  'house-02': 'house-02-post-battle',
  'house-03': 'house-03-post-battle',
  'house-04': 'house-04-post-battle',
  'house-05': 'house-05-post-battle',
};
