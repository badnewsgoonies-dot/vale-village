import { describe, test, expect } from 'vitest';
import {
  BattleStateSchema,
  BattleResultSchema,
  BattleStatusSchema,
  QueuedActionSchema,
  BattlePhaseSchema,
} from '@/data/schemas/BattleStateSchema';

describe('BattleResultSchema', () => {
  test('should accept valid results', () => {
    expect(BattleResultSchema.safeParse('PLAYER_VICTORY').success).toBe(true);
    expect(BattleResultSchema.safeParse('PLAYER_DEFEAT').success).toBe(true);
  });

  test('should reject invalid results', () => {
    expect(BattleResultSchema.safeParse('ENEMY_VICTORY').success).toBe(false);
    expect(BattleResultSchema.safeParse('DRAW').success).toBe(false);
  });
});

describe('BattleStatusSchema', () => {
  test('should accept ongoing status', () => {
    expect(BattleStatusSchema.safeParse('ongoing').success).toBe(true);
  });

  test('should accept result statuses', () => {
    expect(BattleStatusSchema.safeParse('PLAYER_VICTORY').success).toBe(true);
    expect(BattleStatusSchema.safeParse('PLAYER_DEFEAT').success).toBe(true);
  });

  test('should reject invalid statuses', () => {
    expect(BattleStatusSchema.safeParse('pending').success).toBe(false);
  });
});

describe('QueuedActionSchema', () => {
  test('should accept valid queued action', () => {
    const action = {
      unitId: 'unit-1',
      abilityId: 'strike',
      targetIds: ['enemy-1'],
      manaCost: 0,
    };
    expect(QueuedActionSchema.safeParse(action).success).toBe(true);
  });

  test('should accept action with null abilityId (auto-attack)', () => {
    const action = {
      unitId: 'unit-1',
      abilityId: null,
      targetIds: ['enemy-1'],
      manaCost: 0,
    };
    expect(QueuedActionSchema.safeParse(action).success).toBe(true);
  });

  test('should accept action with multiple targets', () => {
    const action = {
      unitId: 'unit-1',
      abilityId: 'fireball',
      targetIds: ['enemy-1', 'enemy-2'],
      manaCost: 2,
    };
    expect(QueuedActionSchema.safeParse(action).success).toBe(true);
  });

  test('should reject empty unitId', () => {
    const invalid = {
      unitId: '',
      abilityId: 'strike',
      targetIds: ['enemy-1'],
      manaCost: 0,
    };
    expect(QueuedActionSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject negative manaCost', () => {
    const invalid = {
      unitId: 'unit-1',
      abilityId: 'strike',
      targetIds: ['enemy-1'],
      manaCost: -1,
    };
    expect(QueuedActionSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject manaCost > 10', () => {
    const invalid = {
      unitId: 'unit-1',
      abilityId: 'ultimate',
      targetIds: ['enemy-1'],
      manaCost: 11,
    };
    expect(QueuedActionSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('BattlePhaseSchema', () => {
  test('should accept all valid phases', () => {
    const phases = ['planning', 'executing', 'victory', 'defeat'];
    for (const phase of phases) {
      expect(BattlePhaseSchema.safeParse(phase).success).toBe(true);
    }
  });

  test('should reject invalid phases', () => {
    expect(BattlePhaseSchema.safeParse('idle').success).toBe(false);
    expect(BattlePhaseSchema.safeParse('combat').success).toBe(false);
  });
});

describe('BattleStateSchema', () => {
  const minimalUnit = {
    id: 'unit-1',
    name: 'Test Unit',
    element: 'Venus' as const,
    role: 'Balanced Warrior' as const,
    baseStats: { hp: 100, pp: 20, atk: 15, def: 10, mag: 5, spd: 8 },
    growthRates: { hp: 10, pp: 2, atk: 3, def: 2, mag: 1, spd: 1 },
    description: 'Test',
    manaContribution: 1,
    level: 1,
    xp: 0,
    currentHp: 100,
    equipment: { weapon: null, armor: null, helm: null, boots: null, accessory: null },
    storeUnlocked: false,
    djinn: [],
    djinnStates: {},
    abilities: [],
    unlockedAbilityIds: [],
    statusEffects: [],
    actionsTaken: 0,
    battleStats: { damageDealt: 0, damageTaken: 0 },
  };

  const minimalEnemy = {
    ...minimalUnit,
    id: 'enemy-1',
    name: 'Test Enemy',
  };

  const minimalBattleState = {
    playerTeam: {
      equippedDjinn: [],
      djinnTrackers: {},
      units: [minimalUnit],
      collectedDjinn: [],
      currentTurn: 0,
      activationsThisTurn: {},
      djinnStates: {},
    },
    enemies: [minimalEnemy],
    currentTurn: 0,
    roundNumber: 1,
    phase: 'planning' as const,
    turnOrder: ['unit-1', 'enemy-1'],
    currentActorIndex: 0,
    status: 'ongoing' as const,
    log: [],
    currentQueueIndex: 0,
    queuedActions: [null],
    queuedDjinn: [],
    remainingMana: 0,
    maxMana: 1,
    executionIndex: 0,
    djinnRecoveryTimers: {},
  };

  test('should accept minimal valid battle state', () => {
    expect(BattleStateSchema.safeParse(minimalBattleState).success).toBe(true);
  });

  test('should accept battle with multiple units', () => {
    const unit2 = { ...minimalUnit, id: 'unit-2', name: 'Unit 2' };
    const multiUnit = {
      ...minimalBattleState,
      playerTeam: {
        ...minimalBattleState.playerTeam,
        units: [minimalUnit, unit2],
      },
      turnOrder: ['unit-1', 'unit-2', 'enemy-1'],
      queuedActions: [null, null],
      maxMana: 2,
    };
    expect(BattleStateSchema.safeParse(multiUnit).success).toBe(true);
  });

  test('should accept battle with multiple enemies', () => {
    const enemy2 = { ...minimalEnemy, id: 'enemy-2', name: 'Enemy 2' };
    const multiEnemy = {
      ...minimalBattleState,
      enemies: [minimalEnemy, enemy2],
      turnOrder: ['unit-1', 'enemy-1', 'enemy-2'],
    };
    expect(BattleStateSchema.safeParse(multiEnemy).success).toBe(true);
  });

  test('should reject battle with no enemies', () => {
    const invalid = {
      ...minimalBattleState,
      enemies: [],
    };
    expect(BattleStateSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject negative roundNumber', () => {
    const invalid = {
      ...minimalBattleState,
      roundNumber: 0,
    };
    expect(BattleStateSchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept roundNumber = 1 (min)', () => {
    const valid = {
      ...minimalBattleState,
      roundNumber: 1,
    };
    expect(BattleStateSchema.safeParse(valid).success).toBe(true);
  });

  test('should reject negative currentActorIndex', () => {
    const invalid = {
      ...minimalBattleState,
      currentActorIndex: -1,
    };
    expect(BattleStateSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject unknown actor ID in turnOrder', () => {
    const invalid = {
      ...minimalBattleState,
      turnOrder: ['unit-1', 'unknown-unit'],
    };
    const result = BattleStateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Unknown actor id');
    }
  });

  test('should accept valid queued actions', () => {
    const withActions = {
      ...minimalBattleState,
      queuedActions: [
        {
          unitId: 'unit-1',
          abilityId: 'strike',
          targetIds: ['enemy-1'],
          manaCost: 0,
        },
      ],
    };
    expect(BattleStateSchema.safeParse(withActions).success).toBe(true);
  });

  test('should reject queuedActions with wrong length', () => {
    const invalid = {
      ...minimalBattleState,
      queuedActions: [null, null], // Team has 1 unit, but 2 actions
    };
    const result = BattleStateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('must match team size');
    }
  });

  test('should reject queued action with invalid unitId', () => {
    const invalid = {
      ...minimalBattleState,
      queuedActions: [
        {
          unitId: 'enemy-1', // Enemy ID, not player unit
          abilityId: 'strike',
          targetIds: ['unit-1'],
          manaCost: 0,
        },
      ],
    };
    const result = BattleStateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('unknown unit');
    }
  });

  test('should reject currentQueueIndex exceeding team size', () => {
    const invalid = {
      ...minimalBattleState,
      currentQueueIndex: 1, // Team size is 1, so max index is 0
    };
    const result = BattleStateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('exceeds team size');
    }
  });

  test('should reject remainingMana > maxMana', () => {
    const invalid = {
      ...minimalBattleState,
      remainingMana: 5,
      maxMana: 3,
    };
    const result = BattleStateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('exceeds maxMana');
    }
  });

  test('should accept remainingMana = maxMana', () => {
    const valid = {
      ...minimalBattleState,
      remainingMana: 3,
      maxMana: 3,
    };
    expect(BattleStateSchema.safeParse(valid).success).toBe(true);
  });

  test('should accept battle with djinn equipped', () => {
    const withDjinn = {
      ...minimalBattleState,
      playerTeam: {
        ...minimalBattleState.playerTeam,
        equippedDjinn: ['flint', 'granite'],
        djinnTrackers: {
          flint: { djinnId: 'flint', state: 'Set' as const, lastActivatedTurn: 0 },
          granite: { djinnId: 'granite', state: 'Set' as const, lastActivatedTurn: 0 },
        },
      },
    };
    expect(BattleStateSchema.safeParse(withDjinn).success).toBe(true);
  });

  test('should accept battle with djinnRecoveryTimers', () => {
    const withTimers = {
      ...minimalBattleState,
      djinnRecoveryTimers: {
        flint: 2,
        granite: 1,
      },
    };
    expect(BattleStateSchema.safeParse(withTimers).success).toBe(true);
  });

  test('should accept battle in victory phase', () => {
    const victory = {
      ...minimalBattleState,
      phase: 'victory' as const,
      status: 'PLAYER_VICTORY' as const,
    };
    expect(BattleStateSchema.safeParse(victory).success).toBe(true);
  });

  test('should accept battle in defeat phase', () => {
    const defeat = {
      ...minimalBattleState,
      phase: 'defeat' as const,
      status: 'PLAYER_DEFEAT' as const,
    };
    expect(BattleStateSchema.safeParse(defeat).success).toBe(true);
  });

  test('should accept battle with optional meta field', () => {
    const withMeta = {
      ...minimalBattleState,
      meta: {
        encounterId: 'house-1-battle',
        difficulty: 'boss' as const,
      },
    };
    expect(BattleStateSchema.safeParse(withMeta).success).toBe(true);
  });

  test('should accept battle with encounterId', () => {
    const withEncounter = {
      ...minimalBattleState,
      encounterId: 'house-1-battle',
    };
    expect(BattleStateSchema.safeParse(withEncounter).success).toBe(true);
  });
});
