import { describe, test, expect } from 'vitest';
import {
  MapSchema,
  TileSchema,
  NPCSchema,
  MapTriggerSchema,
  PositionSchema,
} from '@/data/schemas/mapSchema';

describe('PositionSchema', () => {
  test('should accept valid position', () => {
    const position = { x: 10, y: 5 };
    expect(PositionSchema.safeParse(position).success).toBe(true);
  });

  test('should accept zero position', () => {
    const position = { x: 0, y: 0 };
    expect(PositionSchema.safeParse(position).success).toBe(true);
  });

  test('should reject negative x', () => {
    const invalid = { x: -1, y: 5 };
    expect(PositionSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject negative y', () => {
    const invalid = { x: 10, y: -1 };
    expect(PositionSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject non-integer coordinates', () => {
    const invalid = { x: 10.5, y: 5 };
    expect(PositionSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('TileSchema', () => {
  test('should accept grass tile', () => {
    const tile = {
      type: 'grass' as const,
      walkable: true,
    };
    expect(TileSchema.safeParse(tile).success).toBe(true);
  });

  test('should accept all valid tile types', () => {
    const types = ['grass', 'path', 'water', 'wall', 'door', 'npc', 'trigger'] as const;
    for (const type of types) {
      const tile = { type, walkable: type !== 'wall' && type !== 'water' };
      expect(TileSchema.safeParse(tile).success).toBe(true);
    }
  });

  test('should accept tile with spriteId', () => {
    const tile = {
      type: 'grass' as const,
      walkable: true,
      spriteId: 'grass-01',
    };
    expect(TileSchema.safeParse(tile).success).toBe(true);
  });

  test('should accept tile with triggerId', () => {
    const tile = {
      type: 'trigger' as const,
      walkable: true,
      triggerId: 'battle-trigger-1',
    };
    expect(TileSchema.safeParse(tile).success).toBe(true);
  });

  test('should reject invalid tile type', () => {
    const invalid = {
      type: 'lava',
      walkable: false,
    };
    expect(TileSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('NPCSchema', () => {
  test('should accept valid NPC', () => {
    const npc = {
      id: 'npc-merchant',
      name: 'Merchant',
      position: { x: 10, y: 5 },
      spriteId: 'merchant-01',
    };
    expect(NPCSchema.safeParse(npc).success).toBe(true);
  });

  test('should accept NPC with empty id (schema does not enforce min length)', () => {
    const withEmptyId = {
      id: '',
      name: 'Merchant',
      position: { x: 10, y: 5 },
      spriteId: 'merchant-01',
    };
    expect(NPCSchema.safeParse(withEmptyId).success).toBe(true);
  });

  test('should accept NPC with empty name (schema does not enforce min length)', () => {
    const withEmptyName = {
      id: 'npc-merchant',
      name: '',
      position: { x: 10, y: 5 },
      spriteId: 'merchant-01',
    };
    expect(NPCSchema.safeParse(withEmptyName).success).toBe(true);
  });
});

describe('MapTriggerSchema', () => {
  test('should accept battle trigger', () => {
    const trigger = {
      id: 'battle-1',
      position: { x: 15, y: 10 },
      type: 'battle' as const,
      data: { encounterId: 'goblin-pack' },
    };
    expect(MapTriggerSchema.safeParse(trigger).success).toBe(true);
  });

  test('should accept all valid trigger types', () => {
    const types = ['battle', 'npc', 'transition', 'story', 'shop', 'tower'] as const;
    for (const type of types) {
      const trigger = {
        id: `trigger-${type}`,
        position: { x: 5, y: 5 },
        type,
        data: {},
      };
      expect(MapTriggerSchema.safeParse(trigger).success).toBe(true);
    }
  });

  test('should accept trigger with complex data', () => {
    const trigger = {
      id: 'story-trigger-1',
      position: { x: 20, y: 15 },
      type: 'story' as const,
      data: {
        dialogueId: 'chapter-1-intro',
        requiredFlags: ['tutorial_complete'],
        setsFlag: 'chapter_1_started',
      },
    };
    expect(MapTriggerSchema.safeParse(trigger).success).toBe(true);
  });

  test('should reject invalid trigger type', () => {
    const invalid = {
      id: 'trigger-1',
      position: { x: 5, y: 5 },
      type: 'chest',
      data: {},
    };
    expect(MapTriggerSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('MapSchema', () => {
  const minimalMap = {
    id: 'test-map',
    name: 'Test Map',
    width: 20,
    height: 15,
    tiles: [
      [
        { type: 'grass' as const, walkable: true },
        { type: 'path' as const, walkable: true },
      ],
    ],
    npcs: [],
    triggers: [],
    spawnPoint: { x: 0, y: 0 },
  };

  test('should accept minimal valid map', () => {
    expect(MapSchema.safeParse(minimalMap).success).toBe(true);
  });

  test('should accept empty id (schema does not enforce min length)', () => {
    const withEmptyId = { ...minimalMap, id: '' };
    expect(MapSchema.safeParse(withEmptyId).success).toBe(true);
  });

  test('should accept empty name (schema does not enforce min length)', () => {
    const withEmptyName = { ...minimalMap, name: '' };
    expect(MapSchema.safeParse(withEmptyName).success).toBe(true);
  });

  test('should reject zero width', () => {
    const invalid = { ...minimalMap, width: 0 };
    expect(MapSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject negative width', () => {
    const invalid = { ...minimalMap, width: -10 };
    expect(MapSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject zero height', () => {
    const invalid = { ...minimalMap, height: 0 };
    expect(MapSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject negative height', () => {
    const invalid = { ...minimalMap, height: -5 };
    expect(MapSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject empty tiles array', () => {
    const invalid = { ...minimalMap, tiles: [] };
    const result = MapSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least one row');
    }
  });

  test('should accept map with NPCs', () => {
    const withNPCs = {
      ...minimalMap,
      npcs: [
        {
          id: 'npc-1',
          name: 'Guard',
          position: { x: 5, y: 5 },
          spriteId: 'guard-01',
        },
      ],
    };
    expect(MapSchema.safeParse(withNPCs).success).toBe(true);
  });

  test('should accept map with triggers', () => {
    const withTriggers = {
      ...minimalMap,
      triggers: [
        {
          id: 'trigger-1',
          position: { x: 10, y: 10 },
          type: 'battle' as const,
          data: { encounterId: 'wild-encounter' },
        },
      ],
    };
    expect(MapSchema.safeParse(withTriggers).success).toBe(true);
  });

  test('should accept map with encounterRate', () => {
    const withEncounters = {
      ...minimalMap,
      encounterRate: 0.1,
      encounterPool: ['goblin', 'wolf', 'slime'],
    };
    expect(MapSchema.safeParse(withEncounters).success).toBe(true);
  });

  test('should reject encounterRate < 0', () => {
    const invalid = {
      ...minimalMap,
      encounterRate: -0.1,
    };
    expect(MapSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject encounterRate > 1', () => {
    const invalid = {
      ...minimalMap,
      encounterRate: 1.5,
    };
    expect(MapSchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept encounterRate = 0 (no encounters)', () => {
    const valid = {
      ...minimalMap,
      encounterRate: 0,
    };
    expect(MapSchema.safeParse(valid).success).toBe(true);
  });

  test('should accept encounterRate = 1 (always encounter)', () => {
    const valid = {
      ...minimalMap,
      encounterRate: 1,
    };
    expect(MapSchema.safeParse(valid).success).toBe(true);
  });

  test('should accept complete map with all features', () => {
    const completeMap = {
      id: 'town-square',
      name: 'Town Square',
      width: 30,
      height: 25,
      tiles: [
        [
          { type: 'grass' as const, walkable: true, spriteId: 'grass-01' },
          { type: 'path' as const, walkable: true, spriteId: 'path-01' },
          { type: 'wall' as const, walkable: false, spriteId: 'wall-01' },
        ],
        [
          { type: 'door' as const, walkable: true, spriteId: 'door-01' },
          { type: 'trigger' as const, walkable: true, triggerId: 'shop-trigger' },
          { type: 'npc' as const, walkable: false, spriteId: 'npc-01' },
        ],
      ],
      npcs: [
        {
          id: 'merchant-1',
          name: 'Merchant',
          position: { x: 15, y: 12 },
          spriteId: 'merchant-01',
        },
      ],
      triggers: [
        {
          id: 'shop-trigger',
          position: { x: 10, y: 10 },
          type: 'shop' as const,
          data: { shopId: 'general-store' },
        },
      ],
      spawnPoint: { x: 5, y: 5 },
      encounterRate: 0.05,
      encounterPool: ['slime', 'goblin'],
    };
    expect(MapSchema.safeParse(completeMap).success).toBe(true);
  });
});
