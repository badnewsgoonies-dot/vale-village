import { describe, test, expect } from 'vitest';
import {
  DialogueSchema,
  DialogueTreeSchema,
  DialogueNodeSchema,
  DialogueChoiceSchema,
  DialogueConditionSchema,
  DialogueEffectsSchema,
} from '@/data/schemas/DialogueSchema';

describe('DialogueConditionSchema', () => {
  test('should accept valid flag condition', () => {
    const condition = {
      type: 'flag' as const,
      key: 'tutorial_complete',
      operator: 'equals' as const,
      value: true,
    };
    expect(DialogueConditionSchema.safeParse(condition).success).toBe(true);
  });

  test('should accept valid item condition', () => {
    const condition = {
      type: 'item' as const,
      key: 'iron-sword',
      operator: 'equals' as const,
      value: true,
    };
    expect(DialogueConditionSchema.safeParse(condition).success).toBe(true);
  });

  test('should accept valid level condition', () => {
    const condition = {
      type: 'level' as const,
      key: 'adept',
      operator: 'greaterThan' as const,
      value: 5,
    };
    expect(DialogueConditionSchema.safeParse(condition).success).toBe(true);
  });

  test('should accept valid gold condition', () => {
    const condition = {
      type: 'gold' as const,
      key: 'total',
      operator: 'greaterThan' as const,
      value: 1000,
    };
    expect(DialogueConditionSchema.safeParse(condition).success).toBe(true);
  });

  test('should accept condition without operator', () => {
    const condition = {
      type: 'flag' as const,
      key: 'quest_started',
      value: true,
    };
    expect(DialogueConditionSchema.safeParse(condition).success).toBe(true);
  });

  test('should accept string value', () => {
    const condition = {
      type: 'flag' as const,
      key: 'quest_stage',
      value: 'started',
    };
    expect(DialogueConditionSchema.safeParse(condition).success).toBe(true);
  });

  test('should accept number value', () => {
    const condition = {
      type: 'gold' as const,
      key: 'total',
      value: 500,
    };
    expect(DialogueConditionSchema.safeParse(condition).success).toBe(true);
  });

  test('should accept boolean value', () => {
    const condition = {
      type: 'flag' as const,
      key: 'has_djinn',
      value: false,
    };
    expect(DialogueConditionSchema.safeParse(condition).success).toBe(true);
  });
});

describe('DialogueEffectsSchema', () => {
  test('should accept empty effects', () => {
    expect(DialogueEffectsSchema.safeParse({}).success).toBe(true);
  });

  test('should accept startBattle effect', () => {
    const effects = { startBattle: 'house-1-battle' };
    expect(DialogueEffectsSchema.safeParse(effects).success).toBe(true);
  });

  test('should accept recruitUnit effect', () => {
    const effects = { recruitUnit: 'war-mage' };
    expect(DialogueEffectsSchema.safeParse(effects).success).toBe(true);
  });

  test('should accept grantDjinn effect', () => {
    const effects = { grantDjinn: 'flint' };
    expect(DialogueEffectsSchema.safeParse(effects).success).toBe(true);
  });

  test('should accept questAccepted effect', () => {
    const effects = { questAccepted: true };
    expect(DialogueEffectsSchema.safeParse(effects).success).toBe(true);
  });

  test('should accept openShop effect', () => {
    const effects = { openShop: true };
    expect(DialogueEffectsSchema.safeParse(effects).success).toBe(true);
  });

  test('should accept multiple known effects', () => {
    const effects = {
      recruitUnit: 'war-mage',
      grantDjinn: 'flint',
      questAccepted: true,
    };
    expect(DialogueEffectsSchema.safeParse(effects).success).toBe(true);
  });

  test('should accept custom story flag effects (passthrough)', () => {
    const effects = {
      first_djinn_intro_completed: true,
      tutorial_stage: 2,
      met_npc_elara: true,
    };
    expect(DialogueEffectsSchema.safeParse(effects).success).toBe(true);
  });

  test('should accept mix of known and custom effects', () => {
    const effects = {
      recruitUnit: 'war-mage',
      first_battle_completed: true,
      chapter_1_unlocked: true,
    };
    expect(DialogueEffectsSchema.safeParse(effects).success).toBe(true);
  });
});

describe('DialogueChoiceSchema', () => {
  test('should accept minimal valid choice', () => {
    const choice = {
      id: 'choice-1',
      text: 'Accept quest',
      nextNodeId: 'node-2',
    };
    expect(DialogueChoiceSchema.safeParse(choice).success).toBe(true);
  });

  test('should accept choice with condition', () => {
    const choice = {
      id: 'choice-1',
      text: 'Accept quest',
      nextNodeId: 'node-2',
      condition: {
        type: 'level' as const,
        key: 'adept',
        operator: 'greaterThan' as const,
        value: 5,
      },
    };
    expect(DialogueChoiceSchema.safeParse(choice).success).toBe(true);
  });

  test('should accept choice with effects', () => {
    const choice = {
      id: 'choice-1',
      text: 'Start battle',
      nextNodeId: 'node-2',
      effects: {
        startBattle: 'house-1-battle',
      },
    };
    expect(DialogueChoiceSchema.safeParse(choice).success).toBe(true);
  });
});

describe('DialogueNodeSchema', () => {
  test('should accept minimal valid node', () => {
    const node = {
      id: 'node-1',
      speaker: 'NPC',
      text: 'Hello, traveler!',
    };
    expect(DialogueNodeSchema.safeParse(node).success).toBe(true);
  });

  test('should accept node with choices', () => {
    const node = {
      id: 'node-1',
      speaker: 'NPC',
      text: 'Will you help me?',
      choices: [
        { id: 'yes', text: 'Yes', nextNodeId: 'node-2' },
        { id: 'no', text: 'No', nextNodeId: 'node-3' },
      ],
    };
    expect(DialogueNodeSchema.safeParse(node).success).toBe(true);
  });

  test('should accept node with nextNodeId (linear flow)', () => {
    const node = {
      id: 'node-1',
      speaker: 'NPC',
      text: 'Thank you!',
      nextNodeId: 'node-2',
    };
    expect(DialogueNodeSchema.safeParse(node).success).toBe(true);
  });

  test('should accept node with portrait', () => {
    const node = {
      id: 'node-1',
      speaker: 'Elara',
      text: 'Greetings!',
      portrait: 'elara-happy',
    };
    expect(DialogueNodeSchema.safeParse(node).success).toBe(true);
  });

  test('should accept node with condition', () => {
    const node = {
      id: 'node-1',
      speaker: 'NPC',
      text: 'You have proven yourself worthy.',
      condition: {
        type: 'flag' as const,
        key: 'quest_complete',
        value: true,
      },
    };
    expect(DialogueNodeSchema.safeParse(node).success).toBe(true);
  });

  test('should accept node with effects', () => {
    const node = {
      id: 'node-1',
      speaker: 'Recruitable Unit',
      text: 'I will join your party!',
      effects: {
        recruitUnit: 'war-mage',
      },
    };
    expect(DialogueNodeSchema.safeParse(node).success).toBe(true);
  });
});

describe('DialogueTreeSchema', () => {
  test('should accept minimal valid dialogue tree', () => {
    const tree = {
      id: 'test-dialogue',
      name: 'Test Dialogue',
      startNodeId: 'node-1',
      nodes: [
        {
          id: 'node-1',
          speaker: 'NPC',
          text: 'Hello!',
        },
      ],
    };
    expect(DialogueTreeSchema.safeParse(tree).success).toBe(true);
  });

  test('should accept tree with multiple nodes', () => {
    const tree = {
      id: 'quest-dialogue',
      name: 'Quest Dialogue',
      startNodeId: 'node-1',
      nodes: [
        {
          id: 'node-1',
          speaker: 'Quest Giver',
          text: 'I need your help!',
          choices: [
            { id: 'accept', text: 'I will help', nextNodeId: 'node-2' },
            { id: 'decline', text: 'Not now', nextNodeId: 'node-3' },
          ],
        },
        {
          id: 'node-2',
          speaker: 'Quest Giver',
          text: 'Thank you! Here is your reward.',
          effects: {
            questAccepted: true,
            grantDjinn: 'flint',
          },
        },
        {
          id: 'node-3',
          speaker: 'Quest Giver',
          text: 'Come back when you are ready.',
        },
      ],
    };
    expect(DialogueTreeSchema.safeParse(tree).success).toBe(true);
  });

  test('should accept recruitment dialogue tree', () => {
    const tree = {
      id: 'war-mage-recruitment',
      name: 'War Mage Recruitment',
      startNodeId: 'intro',
      nodes: [
        {
          id: 'intro',
          speaker: 'War Mage',
          text: 'You have defeated me in battle. I am impressed.',
          portrait: 'war-mage-respect',
          nextNodeId: 'offer',
        },
        {
          id: 'offer',
          speaker: 'War Mage',
          text: 'Will you allow me to join your cause?',
          choices: [
            { id: 'yes', text: 'Welcome aboard', nextNodeId: 'joined' },
          ],
        },
        {
          id: 'joined',
          speaker: 'War Mage',
          text: 'I will fight by your side!',
          effects: {
            recruitUnit: 'war-mage',
            grantDjinn: 'kindle',
          },
        },
      ],
    };
    expect(DialogueTreeSchema.safeParse(tree).success).toBe(true);
  });
});
