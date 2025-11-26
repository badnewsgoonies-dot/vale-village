/**
 * Djinn System Integration Tests
 * Tests Djinn collection, equipping, synergy bonuses, and battle integration
 *
 * Coverage:
 * - Collection (via service, not dialogue - that's E2E)
 * - Equipping/unequipping
 * - Synergy bonuses (same element vs mixed)
 * - Activation and recovery (full cycle)
 * - Post-battle reset to Set state
 */

import { describe, test, expect } from 'vitest';
import { mkUnit, mkEnemy, mkTeam } from '@/test/factories';
import { collectDjinn, equipDjinn, unequipDjinn } from '@/core/services/DjinnService';
import { calculateDjinnBonuses } from '@/core/algorithms/djinnCalculations';
import { createBattleState } from '@/core/models/BattleState';
import { executeRound, queueAction, queueDjinn } from '@/core/services/QueueBattleService';
import { makePRNG } from '@/core/random/prng';
import { ABILITIES } from '@/data/definitions/abilities';
import { DJINN } from '@/data/definitions/djinn';

describe('Djinn Integration - Collection', () => {
  test('collect first djinn successfully', () => {
    const team = mkTeam([mkUnit({ id: 'u1' })]);

    const result = collectDjinn(team, 'flint');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.collectedDjinn).toContain('flint');
      expect(result.value.collectedDjinn.length).toBe(1);
    }
  });

  test('collect multiple djinn', () => {
    let team = mkTeam([mkUnit({ id: 'u1' })]);

    // Collect 3 djinn
    let result = collectDjinn(team, 'flint');
    expect(result.ok).toBe(true);
    if (result.ok) team = result.value;

    result = collectDjinn(team, 'granite');
    expect(result.ok).toBe(true);
    if (result.ok) team = result.value;

    result = collectDjinn(team, 'quartz');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.collectedDjinn).toEqual(['flint', 'granite', 'quartz']);
      expect(result.value.collectedDjinn.length).toBe(3);
    }
  });

  test('cannot collect duplicate djinn', () => {
    let team = mkTeam([mkUnit({ id: 'u1' })]);

    // Collect flint
    let result = collectDjinn(team, 'flint');
    expect(result.ok).toBe(true);
    if (result.ok) team = result.value;

    // Try to collect flint again
    result = collectDjinn(team, 'flint');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('already collected');
    }
  });

  test('cannot collect non-existent djinn', () => {
    const team = mkTeam([mkUnit({ id: 'u1' })]);

    const result = collectDjinn(team, 'fake-djinn-id');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('does not exist');
    }
  });

  test('max 12 djinn collection limit enforced', () => {
    let team = mkTeam([mkUnit({ id: 'u1' })]);

    // Collect 12 djinn
    const allDjinnIds = Object.keys(DJINN).slice(0, 12);
    for (const djinnId of allDjinnIds) {
      const result = collectDjinn(team, djinnId);
      if (result.ok) {
        team = result.value;
      }
    }

    expect(team.collectedDjinn.length).toBe(12);

    // Try to collect 13th djinn
    const extraDjinnId = Object.keys(DJINN)[12];
    if (extraDjinnId) {
      const result = collectDjinn(team, extraDjinnId);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Cannot collect more than 12');
      }
    }
  });
});

describe('Djinn Integration - Equipping', () => {
  test('equip collected djinn to team slot', () => {
    let team = mkTeam([mkUnit({ id: 'u1' })]);

    // Collect djinn first
    let result = collectDjinn(team, 'flint');
    expect(result.ok).toBe(true);
    if (result.ok) team = result.value;

    // Equip djinn
    const equipResult = equipDjinn(team, 'flint');
    expect(equipResult.ok).toBe(true);
    if (equipResult.ok) {
      expect(equipResult.value.equippedDjinn).toContain('flint');
      expect(equipResult.value.djinnTrackers['flint']).toBeDefined();
      expect(equipResult.value.djinnTrackers['flint']?.state).toBe('Set');
    }
  });

  test('cannot equip uncollected djinn', () => {
    const team = mkTeam([mkUnit({ id: 'u1' })]);

    const result = equipDjinn(team, 'flint');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('not collected');
    }
  });

  test('cannot equip already equipped djinn', () => {
    let team = mkTeam([mkUnit({ id: 'u1' })]);

    // Collect and equip
    let result = collectDjinn(team, 'flint');
    if (result.ok) team = result.value;

    let equipResult = equipDjinn(team, 'flint');
    if (equipResult.ok) team = equipResult.value;

    // Try to equip again
    equipResult = equipDjinn(team, 'flint');
    expect(equipResult.ok).toBe(false);
    if (!equipResult.ok) {
      expect(equipResult.error).toContain('already equipped');
    }
  });

  test('max 3 djinn can be equipped', () => {
    let team = mkTeam([mkUnit({ id: 'u1' })]);

    // Collect and equip 3 djinn
    const djinnIds = ['flint', 'granite', 'quartz'];
    for (const djinnId of djinnIds) {
      const collectResult = collectDjinn(team, djinnId);
      if (collectResult.ok) team = collectResult.value;

      const equipResult = equipDjinn(team, djinnId);
      if (equipResult.ok) team = equipResult.value;
    }

    expect(team.equippedDjinn.length).toBe(3);

    // Try to equip 4th djinn
    const collectResult = collectDjinn(team, 'breeze');
    if (collectResult.ok) team = collectResult.value;

    const equipResult = equipDjinn(team, 'breeze');
    expect(equipResult.ok).toBe(false);
    if (!equipResult.ok) {
      expect(equipResult.error).toContain('slots are full');
    }
  });

  test('unequip djinn removes from team', () => {
    let team = mkTeam([mkUnit({ id: 'u1' })]);

    // Collect and equip
    let result = collectDjinn(team, 'flint');
    if (result.ok) team = result.value;

    let equipResult = equipDjinn(team, 'flint');
    if (equipResult.ok) team = equipResult.value;

    // Unequip
    const unequipResult = unequipDjinn(team, 'flint');
    expect(unequipResult.ok).toBe(true);
    if (unequipResult.ok) {
      expect(unequipResult.value.equippedDjinn).not.toContain('flint');
      expect(unequipResult.value.djinnTrackers['flint']).toBeUndefined();
      // Should still be in collected list
      expect(unequipResult.value.collectedDjinn).toContain('flint');
    }
  });

  test('cannot unequip non-equipped djinn', () => {
    const team = mkTeam([mkUnit({ id: 'u1' })]);

    const result = unequipDjinn(team, 'flint');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('not equipped');
    }
  });

  test('replace djinn in full slots', () => {
    let team = mkTeam([mkUnit({ id: 'u1' })]);

    // Collect and equip 3 djinn
    const djinnIds = ['flint', 'granite', 'quartz'];
    for (const djinnId of djinnIds) {
      const collectResult = collectDjinn(team, djinnId);
      if (collectResult.ok) team = collectResult.value;

      const equipResult = equipDjinn(team, djinnId);
      if (equipResult.ok) team = equipResult.value;
    }

    // Collect a 4th djinn
    const collectResult = collectDjinn(team, 'breeze');
    if (collectResult.ok) team = collectResult.value;

    // Replace slot 1 (index 1)
    const equipResult = equipDjinn(team, 'breeze', 1);
    expect(equipResult.ok).toBe(true);
    if (equipResult.ok) {
      expect(equipResult.value.equippedDjinn).toContain('breeze');
      expect(equipResult.value.equippedDjinn).not.toContain('granite'); // Was at slot 1
      expect(equipResult.value.equippedDjinn.length).toBe(3);
    }
  });
});

describe('Djinn Integration - Synergy Bonuses', () => {
  test('3 same-element djinn give +12 ATK, +8 DEF', () => {
    const team = mkTeam([mkUnit({ id: 'u1' })]);

    // Equip 3 Venus djinn (flint, granite, quartz)
    team.equippedDjinn = ['flint', 'granite', 'quartz'];
    team.djinnTrackers = {
      flint: { djinnId: 'flint', state: 'Set', lastActivatedTurn: -1 },
      granite: { djinnId: 'granite', state: 'Set', lastActivatedTurn: -1 },
      quartz: { djinnId: 'quartz', state: 'Set', lastActivatedTurn: -1 },
    };

    const bonuses = calculateDjinnBonuses(team);

    expect(bonuses.atk).toBe(12);
    expect(bonuses.def).toBe(8);
    expect(bonuses.spd).toBe(0);
  });

  test('mixed-element djinn give balanced bonuses', () => {
    const team = mkTeam([mkUnit({ id: 'u1' })]);

    // Equip mixed djinn: Venus (flint), Mars (forge), Mercury (fizz)
    team.equippedDjinn = ['flint', 'forge', 'fizz'];
    team.djinnTrackers = {
      flint: { djinnId: 'flint', state: 'Set', lastActivatedTurn: -1 },
      forge: { djinnId: 'forge', state: 'Set', lastActivatedTurn: -1 },
      fizz: { djinnId: 'fizz', state: 'Set', lastActivatedTurn: -1 },
    };

    const bonuses = calculateDjinnBonuses(team);

    // Mixed elements give +4 ATK, +4 DEF, +2 SPD per djinn (approximately)
    expect(bonuses.atk).toBeGreaterThan(0);
    expect(bonuses.def).toBeGreaterThan(0);
    expect(bonuses.atk).toBeLessThan(12); // Less than same-element bonus
  });

  test('no bonuses when no djinn equipped', () => {
    const team = mkTeam([mkUnit({ id: 'u1' })]);

    team.equippedDjinn = [];
    team.djinnTrackers = {};

    const bonuses = calculateDjinnBonuses(team);

    expect(bonuses.atk).toBe(0);
    expect(bonuses.def).toBe(0);
    expect(bonuses.spd).toBe(0);
  });

  test('standby djinn do not contribute to bonuses', () => {
    const team = mkTeam([mkUnit({ id: 'u1' })]);

    // 2 Set, 1 Standby
    team.equippedDjinn = ['flint', 'granite', 'quartz'];
    team.djinnTrackers = {
      flint: { djinnId: 'flint', state: 'Set', lastActivatedTurn: -1 },
      granite: { djinnId: 'granite', state: 'Standby', lastActivatedTurn: 5 }, // Activated
      quartz: { djinnId: 'quartz', state: 'Set', lastActivatedTurn: -1 },
    };

    const bonuses = calculateDjinnBonuses(team);

    // Only 2 djinn (flint + quartz) contribute
    // Should get less than 3-djinn bonus
    expect(bonuses.atk).toBeLessThan(12);
    expect(bonuses.atk).toBeGreaterThan(0);
  });
});

describe('Djinn Integration - Battle Activation & Recovery', () => {
  test('djinn activation moves to Standby state', () => {
    const units = [
      mkUnit({ id: 'u1', level: 5 }),
      mkUnit({ id: 'u2', level: 5 }),
      mkUnit({ id: 'u3', level: 5 }),
      mkUnit({ id: 'u4', level: 5 }),
    ];
    const team = mkTeam(units);

    // Add djinn
    team.equippedDjinn.push('flint');
    team.djinnTrackers['flint'] = {
      djinnId: 'flint',
      state: 'Set',
      lastActivatedTurn: 0,
    };

    const enemies = [mkEnemy('slime', { id: 'e1', currentHp: 100 })];
    let state = createBattleState(team, enemies);
    const rng = makePRNG(12345);

    expect(state.playerTeam.djinnTrackers['flint']?.state).toBe('Set');

    // Queue djinn activation
    const djinnResult = queueDjinn(state, 'flint');
    expect(djinnResult.ok).toBe(true);
    if (djinnResult.ok) {
      state = djinnResult.value;
    }

    // Queue player actions
    const strikeAbility = ABILITIES['strike'];
    for (const unit of state.playerTeam.units) {
      const result = queueAction(state, unit.id, 'strike', ['e1'], strikeAbility);
      if (result.ok) {
        state = result.value;
      }
    }

    // Execute round
    const roundResult = executeRound(state, rng);
    state = roundResult.state;

    // Djinn should be in Standby or Recovery after activation
    if (state.phase === 'planning') {
      const djinnState = state.playerTeam.djinnTrackers['flint']?.state;
      expect(['Standby', 'Recovery']).toContain(djinnState);
      expect(state.djinnRecoveryTimers['flint']).toBeGreaterThan(0);
    }
  });

  test('djinn recovers to Set after multiple rounds', () => {
    const units = [
      mkUnit({ id: 'u1', level: 5 }),
      mkUnit({ id: 'u2', level: 5 }),
      mkUnit({ id: 'u3', level: 5 }),
      mkUnit({ id: 'u4', level: 5 }),
    ];
    const team = mkTeam(units);

    team.equippedDjinn.push('flint');
    team.djinnTrackers['flint'] = {
      djinnId: 'flint',
      state: 'Set',
      lastActivatedTurn: 0,
    };

    const enemies = [mkEnemy('slime', { id: 'e1', currentHp: 200 })]; // High HP to survive many rounds
    let state = createBattleState(team, enemies);
    const rng = makePRNG(54321);

    // Round 1: Activate djinn
    let djinnResult = queueDjinn(state, 'flint');
    if (djinnResult.ok) state = djinnResult.value;

    const strikeAbility = ABILITIES['strike'];
    for (const unit of state.playerTeam.units) {
      const result = queueAction(state, unit.id, 'strike', ['e1'], strikeAbility);
      if (result.ok) state = result.value;
    }

    let roundResult = executeRound(state, rng);
    state = roundResult.state;

    // Execute more rounds until djinn recovers (max 10 rounds)
    let roundsExecuted = 1;
    while (
      state.phase === 'planning' &&
      state.playerTeam.djinnTrackers['flint']?.state !== 'Set' &&
      roundsExecuted < 10
    ) {
      // Queue actions (no more djinn activation)
      for (const unit of state.playerTeam.units) {
        const result = queueAction(state, unit.id, 'strike', ['e1'], strikeAbility);
        if (result.ok) state = result.value;
      }

      roundResult = executeRound(state, rng);
      state = roundResult.state;
      roundsExecuted++;
    }

    // Djinn should eventually recover to Set (typically 3 turns)
    if (state.phase === 'planning') {
      expect(state.playerTeam.djinnTrackers['flint']?.state).toBe('Set');
      expect(roundsExecuted).toBeLessThanOrEqual(5); // Should recover within 5 rounds
    }
  });

  test('multiple djinn can be activated in same round', () => {
    const units = [
      mkUnit({ id: 'u1', level: 5 }),
      mkUnit({ id: 'u2', level: 5 }),
      mkUnit({ id: 'u3', level: 5 }),
      mkUnit({ id: 'u4', level: 5 }),
    ];
    const team = mkTeam(units);

    // Add 3 djinn
    team.equippedDjinn = ['flint', 'granite', 'quartz'];
    team.djinnTrackers = {
      flint: { djinnId: 'flint', state: 'Set', lastActivatedTurn: 0 },
      granite: { djinnId: 'granite', state: 'Set', lastActivatedTurn: 0 },
      quartz: { djinnId: 'quartz', state: 'Set', lastActivatedTurn: 0 },
    };

    const enemies = [mkEnemy('slime', { id: 'e1', currentHp: 300 })];
    let state = createBattleState(team, enemies);
    const rng = makePRNG(99999);

    // Queue all 3 djinn
    let djinnResult = queueDjinn(state, 'flint');
    if (djinnResult.ok) state = djinnResult.value;

    djinnResult = queueDjinn(state, 'granite');
    if (djinnResult.ok) state = djinnResult.value;

    djinnResult = queueDjinn(state, 'quartz');
    if (djinnResult.ok) state = djinnResult.value;

    expect(state.queuedDjinn).toEqual(['flint', 'granite', 'quartz']);

    // Queue player actions
    const strikeAbility = ABILITIES['strike'];
    for (const unit of state.playerTeam.units) {
      const result = queueAction(state, unit.id, 'strike', ['e1'], strikeAbility);
      if (result.ok) state = result.value;
    }

    // Execute round
    const roundResult = executeRound(state, rng);
    state = roundResult.state;

    // All 3 djinn should be in Standby/Recovery
    if (state.phase === 'planning') {
      expect(['Standby', 'Recovery']).toContain(state.playerTeam.djinnTrackers['flint']?.state);
      expect(['Standby', 'Recovery']).toContain(state.playerTeam.djinnTrackers['granite']?.state);
      expect(['Standby', 'Recovery']).toContain(state.playerTeam.djinnTrackers['quartz']?.state);
    }
  });
});
