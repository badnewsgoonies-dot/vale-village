/**
 * Battle State Invariant Validation Tests
 * Verifies that invariant validation catches impossible states
 */

import { describe, test, expect } from 'vitest';
import {
  validateBattleState,
  BattleStateInvariantError,
} from '@/core/validation/battleStateInvariants';
import { mkBattle, mkUnit, mkEnemy, mkTeam } from '@/test/factories';
import { updateBattleState } from '@/core/models/BattleState';

describe('Battle State Invariants - Mana', () => {
  test('validates mana does not exceed max', () => {
    const state = mkBattle({});

    // Manually create invalid state
    const invalidState = {
      ...state,
      remainingMana: state.maxMana + 10,
    };

    expect(() => validateBattleState(invalidState)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(invalidState)).toThrow(/MANA_EXCEEDS_MAX/);
  });

  test('validates mana is not negative', () => {
    const state = mkBattle({});

    const invalidState = {
      ...state,
      remainingMana: -5,
    };

    expect(() => validateBattleState(invalidState)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(invalidState)).toThrow(/MANA_NEGATIVE/);
  });

  test('validates max mana is not negative', () => {
    const state = mkBattle({});

    const invalidState = {
      ...state,
      maxMana: -10,
      remainingMana: -10, // Equal to avoid MANA_EXCEEDS_MAX check
    };

    expect(() => validateBattleState(invalidState)).toThrow(BattleStateInvariantError);
    // Either MANA_NEGATIVE or MAX_MANA_NEGATIVE is acceptable
    expect(() => validateBattleState(invalidState)).toThrow(/MANA_NEGATIVE|MAX_MANA_NEGATIVE/);
  });

  test('allows valid mana state', () => {
    const state = mkBattle({});

    const validState = {
      ...state,
      maxMana: 10,
      remainingMana: 5,
    };

    expect(() => validateBattleState(validState)).not.toThrow();
  });
});

describe('Battle State Invariants - HP', () => {
  test('validates HP does not go negative', () => {
    const units = [mkUnit({ id: 'u1', currentHp: -10 })];
    const state = mkBattle({ party: units });

    expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(state)).toThrow(/HP_NEGATIVE/);
  });

  test('validates HP does not exceed max', () => {
    const units = [
      mkUnit({
        id: 'u1',
        level: 1,
        baseStats: { hp: 50, atk: 10, def: 10, spd: 10 },
        growthRates: { hp: 5, atk: 2, def: 2, spd: 1 },
        currentHp: 100, // Exceeds base HP
      }),
    ];
    const state = mkBattle({ party: units });

    expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(state)).toThrow(/HP_EXCEEDS_MAX/);
  });

  test('validates enemy HP bounds', () => {
    const enemies = [mkEnemy('slime', { id: 'e1', currentHp: -5 })];
    const state = mkBattle({ enemies });

    expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(state)).toThrow(/HP_NEGATIVE/);
  });

  test('allows valid HP state', () => {
    const units = [
      mkUnit({
        id: 'u1',
        level: 1,
        baseStats: { hp: 50, atk: 10, def: 10, spd: 10 },
        currentHp: 50,
      }),
    ];
    const state = mkBattle({ party: units });

    expect(() => validateBattleState(state)).not.toThrow();
  });
});

describe('Battle State Invariants - Queue', () => {
  test('validates queue length is 4', () => {
    const state = mkBattle({});

    const invalidState = {
      ...state,
      queuedActions: [null, null], // Only 2 slots
    };

    expect(() => validateBattleState(invalidState)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(invalidState)).toThrow(/QUEUE_LENGTH_INVALID/);
  });

  test('validates queued action references existing unit', () => {
    const state = mkBattle({});

    const invalidState = {
      ...state,
      queuedActions: [
        {
          unitId: 'non-existent-unit',
          abilityId: 'strike',
          targetIds: ['e1'],
          manaCost: 0,
        },
        null,
        null,
        null,
      ],
    };

    expect(() => validateBattleState(invalidState)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(invalidState)).toThrow(/QUEUE_INVALID_UNIT/);
  });

  test('validates queued action has non-negative mana cost', () => {
    const state = mkBattle({});
    const unitId = state.playerTeam.units[0]?.id ?? 'u1';

    const invalidState = {
      ...state,
      queuedActions: [
        {
          unitId,
          abilityId: 'strike',
          targetIds: ['e1'],
          manaCost: -5, // Invalid
        },
        null,
        null,
        null,
      ],
    };

    expect(() => validateBattleState(invalidState)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(invalidState)).toThrow(/QUEUE_NEGATIVE_COST/);
  });

  test('validates queued action targets exist', () => {
    const state = mkBattle({});
    const unitId = state.playerTeam.units[0]?.id ?? 'u1';

    const invalidState = {
      ...state,
      queuedActions: [
        {
          unitId,
          abilityId: 'strike',
          targetIds: ['non-existent-enemy'],
          manaCost: 0,
        },
        null,
        null,
        null,
      ],
    };

    expect(() => validateBattleState(invalidState)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(invalidState)).toThrow(/QUEUE_INVALID_TARGET/);
  });

  test('validates queued djinn exist in trackers', () => {
    const state = mkBattle({});

    const invalidState = {
      ...state,
      queuedDjinn: ['non-existent-djinn'],
    };

    expect(() => validateBattleState(invalidState)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(invalidState)).toThrow(/QUEUE_INVALID_DJINN/);
  });

  test('validates queued djinn are in Set state', () => {
    const state = mkBattle({});

    // Add djinn in Standby state
    state.playerTeam.djinnTrackers['flint'] = {
      djinnId: 'flint',
      element: 'Venus',
      state: 'Standby', // Not Set
      lastActivatedTurn: 0,
      assignedUnitId: 'u1',
    };

    const invalidState = {
      ...state,
      queuedDjinn: ['flint'],
    };

    expect(() => validateBattleState(invalidState)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(invalidState)).toThrow(/QUEUE_DJINN_NOT_SET/);
  });
});

describe('Battle State Invariants - Phase', () => {
  test('validates phase is a valid value', () => {
    const state = mkBattle({});

    const invalidState = {
      ...state,
      phase: 'invalid-phase' as any,
    };

    expect(() => validateBattleState(invalidState)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(invalidState)).toThrow(/PHASE_INVALID/);
  });

  test('validates planning phase has valid round number', () => {
    const state = mkBattle({});

    const invalidState = {
      ...state,
      phase: 'planning' as const,
      roundNumber: 0, // Invalid
    };

    expect(() => validateBattleState(invalidState)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(invalidState)).toThrow(/PHASE_PLANNING_INVALID_ROUND/);
  });

  test('validates executing phase has complete queue', () => {
    const state = mkBattle({});

    const invalidState = {
      ...state,
      phase: 'executing' as const,
      queuedActions: [null, null, null, null], // Incomplete
    };

    expect(() => validateBattleState(invalidState)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(invalidState)).toThrow(/PHASE_EXECUTING_INCOMPLETE_QUEUE/);
  });

  test('validates victory phase has all enemies KO', () => {
    const enemies = [mkEnemy('slime', { id: 'e1', currentHp: 30 })]; // Set HP to match slime's base HP
    const state = mkBattle({ enemies });

    const invalidState = {
      ...state,
      phase: 'victory' as const,
      status: 'PLAYER_VICTORY' as const,
    };

    expect(() => validateBattleState(invalidState)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(invalidState)).toThrow(/PHASE_VICTORY_ENEMIES_ALIVE/);
  });

  test('validates defeat phase has all players KO', () => {
    const units = [mkUnit({ id: 'u1', currentHp: 50 })]; // Still alive
    const state = mkBattle({ party: units });

    const invalidState = {
      ...state,
      phase: 'defeat' as const,
      status: 'PLAYER_DEFEAT' as const,
    };

    expect(() => validateBattleState(invalidState)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(invalidState)).toThrow(/PHASE_DEFEAT_PLAYERS_ALIVE/);
  });

  test('validates phase and status match', () => {
    const state = mkBattle({});

    const invalidState = {
      ...state,
      phase: 'victory' as const,
      status: 'ongoing' as const, // Mismatch
      enemies: [mkEnemy('slime', { id: 'e1', currentHp: 0 })], // All KO
    };

    expect(() => validateBattleState(invalidState)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(invalidState)).toThrow(/PHASE_STATUS_MISMATCH/);
  });
});

describe('Battle State Invariants - Djinn', () => {
  test('validates djinn state is valid', () => {
    const state = mkBattle({});

    state.playerTeam.djinnTrackers['flint'] = {
      djinnId: 'flint',
      element: 'Venus',
      state: 'InvalidState' as any,
      lastActivatedTurn: 0,
      assignedUnitId: 'u1',
    };

    expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(state)).toThrow(/DJINN_INVALID_STATE/);
  });

  test('validates djinn assignment references existing unit', () => {
    const state = mkBattle({});

    state.playerTeam.djinnTrackers['flint'] = {
      djinnId: 'flint',
      element: 'Venus',
      state: 'Set',
      lastActivatedTurn: 0,
      assignedUnitId: 'non-existent-unit',
    };

    expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(state)).toThrow(/DJINN_INVALID_ASSIGNMENT/);
  });

  test('validates recovery timers are non-negative', () => {
    const units = [mkUnit({ id: 'u1' })];
    const state = mkBattle({ party: units });

    state.playerTeam.djinnTrackers['flint'] = {
      djinnId: 'flint',
      element: 'Venus',
      state: 'Standby',
      lastActivatedTurn: 0,
      assignedUnitId: 'u1', // This unit now exists
    };

    const invalidState = {
      ...state,
      djinnRecoveryTimers: {
        flint: -5, // Invalid
      },
    };

    expect(() => validateBattleState(invalidState)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(invalidState)).toThrow(/DJINN_NEGATIVE_TIMER/);
  });

  test('validates recovery timer has corresponding tracker', () => {
    const state = mkBattle({});

    const invalidState = {
      ...state,
      djinnRecoveryTimers: {
        'non-existent-djinn': 2,
      },
    };

    expect(() => validateBattleState(invalidState)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(invalidState)).toThrow(/DJINN_TIMER_NO_TRACKER/);
  });

  test('validates djinn with timer is in Standby state', () => {
    const units = [mkUnit({ id: 'u1' })];
    const state = mkBattle({ party: units });

    state.playerTeam.djinnTrackers['flint'] = {
      djinnId: 'flint',
      element: 'Venus',
      state: 'Set', // Not Standby
      lastActivatedTurn: 0,
      assignedUnitId: 'u1', // This unit now exists
    };

    const invalidState = {
      ...state,
      djinnRecoveryTimers: {
        flint: 2, // Has timer but not in Standby
      },
    };

    expect(() => validateBattleState(invalidState)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(invalidState)).toThrow(/DJINN_TIMER_STATE_MISMATCH/);
  });
});

describe('Battle State Invariants - Unit Index', () => {
  test('validates index contains all player units', () => {
    const units = [mkUnit({ id: 'u1' })];
    const team = mkTeam(units);
    const state = mkBattle({ party: units });

    // Remove from index
    state.unitById.delete('u1');

    expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(state)).toThrow(/INDEX_MISSING_PLAYER/);
  });

  test('validates index contains all enemies', () => {
    const enemies = [mkEnemy('slime', { id: 'e1' })];
    const state = mkBattle({ enemies });

    // Remove from index
    state.unitById.delete('e1');

    expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(state)).toThrow(/INDEX_MISSING_ENEMY/);
  });

  test('validates index does not contain extra units', () => {
    const state = mkBattle({});

    // Add extra entry
    const extraUnit = mkUnit({ id: 'extra' });
    state.unitById.set('extra', { unit: extraUnit, isPlayer: true });

    expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
    expect(() => validateBattleState(state)).toThrow(/INDEX_SIZE_MISMATCH/);
  });
});

describe('Battle State Invariants - Integration with updateBattleState', () => {
  test.skip('updateBattleState validates in dev mode', () => {
    // This test only runs in dev mode (NODE_ENV !== 'production')
    // Skip because NODE_ENV may vary in test environment
    const state = mkBattle({});

    // Try to create invalid state via update
    expect(() =>
      updateBattleState(state, {
        remainingMana: state.maxMana + 100,
      })
    ).toThrow(/MANA_EXCEEDS_MAX/);
  });

  test('updateBattleState allows valid updates', () => {
    const state = mkBattle({});

    const updated = updateBattleState(state, {
      remainingMana: state.maxMana - 5,
    });

    expect(updated.remainingMana).toBe(state.maxMana - 5);
  });
});
