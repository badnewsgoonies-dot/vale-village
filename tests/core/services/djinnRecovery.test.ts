import { describe, expect, test } from 'vitest';
import { makePRNG } from '../../../src/core/random/prng';
import { createBattleState } from '../../../src/core/models/BattleState';
import { createTeam, updateTeam } from '../../../src/core/models/Team';
import type { DjinnTracker } from '../../../src/core/models/Team';
import { mkUnit, mkEnemy } from '../../../src/test/factories';
import { queueAction, queueDjinn, executeRound } from '../../../src/core/services/QueueBattleService';

function createTeamWithDjinn(units: readonly ReturnType<typeof mkUnit>, djinnIds: readonly string[]) {
  const team = createTeam(units);
  const trackers: Record<string, DjinnTracker> = {};
  for (const djinnId of djinnIds) {
    trackers[djinnId] = {
      djinnId,
      state: 'Set',
      lastActivatedTurn: 0,
    };
  }
  return updateTeam(team, {
    equippedDjinn: [...djinnIds],
    djinnTrackers: trackers,
  });
}

function queueBasicActions(battle: ReturnType<typeof createBattleState>, enemyId: string) {
  let next = battle;
  for (const unit of next.playerTeam.units) {
    const result = queueAction(next, unit.id, null, [enemyId]);
    if (!result.ok) {
      throw new Error(result.error);
    }
    next = result.value;
  }
  return next;
}

function createEnemy() {
  return mkEnemy('slime', {
    id: 'enemy1',
    baseStats: { hp: 1_000_000, pp: 0, atk: 5, def: 0, mag: 0, spd: 1 },
    currentHp: 1_000_000,
  });
}

describe('Djinn Recovery Timing', () => {
  const units = Array.from({ length: 4 }, (_, i) =>
    mkUnit({
      id: `unit${i + 1}`,
      baseStats: { hp: 120, pp: 30, atk: 12, def: 6, mag: 5, spd: 10 + i },
    })
  );

  test('single Djinn recovers after 2 rounds', () => {
    const team = createTeamWithDjinn(units, ['flint']);
    const enemy = createEnemy();

    let battle = createBattleState(team, [enemy]);
    const result = queueDjinn(battle, 'flint');
    if (!result.ok) throw new Error(result.error);
    battle = queueBasicActions(result.value, enemy.id);

    battle = executeRound(battle, makePRNG(1)).state;
    expect(battle.djinnRecoveryTimers['flint']).toBe(1);

    battle = queueBasicActions(battle, enemy.id);
    battle = executeRound(battle, makePRNG(2)).state;
    expect(battle.djinnRecoveryTimers['flint']).toBeUndefined();

    battle = queueBasicActions(battle, enemy.id);
    battle = executeRound(battle, makePRNG(3)).state;
    expect(battle.djinnRecoveryTimers['flint']).toBeUndefined();
    expect(battle.playerTeam.djinnTrackers['flint']?.state).toBe('Set');
  });

  test('two Djinn recover after 3 rounds each', () => {
    const team = createTeamWithDjinn(units, ['flint', 'granite']);
    const enemy = createEnemy();

    let battle = createBattleState(team, [enemy]);
    const first = queueDjinn(battle, 'flint');
    if (!first.ok) throw new Error(first.error);
    battle = first.value;

    const second = queueDjinn(battle, 'granite');
    if (!second.ok) throw new Error(second.error);
    battle = second.value;
    battle = queueBasicActions(battle, enemy.id);

    battle = executeRound(battle, makePRNG(1)).state;
    expect(battle.djinnRecoveryTimers['flint']).toBe(2);
    expect(battle.djinnRecoveryTimers['granite']).toBe(2);

    battle = queueBasicActions(battle, enemy.id);
    battle = executeRound(battle, makePRNG(2)).state;
    expect(battle.djinnRecoveryTimers['flint']).toBe(1);

    battle = queueBasicActions(battle, enemy.id);
    battle = executeRound(battle, makePRNG(3)).state;
    expect(battle.djinnRecoveryTimers['flint']).toBeUndefined();

    battle = queueBasicActions(battle, enemy.id);
    battle = executeRound(battle, makePRNG(4)).state;
    expect(battle.djinnRecoveryTimers['flint']).toBeUndefined();
    expect(battle.djinnRecoveryTimers['granite']).toBeUndefined();
    expect(battle.playerTeam.djinnTrackers['flint']?.state).toBe('Set');
    expect(battle.playerTeam.djinnTrackers['granite']?.state).toBe('Set');
  });

  test('three Djinn recover after 4 turns each', () => {
    const team = createTeamWithDjinn(units, ['flint', 'granite', 'bane']);
    const enemy = createEnemy();

    let battle = createBattleState(team, [enemy]);
    for (const djinn of ['flint', 'granite', 'bane'] as const) {
      const res = queueDjinn(battle, djinn);
      if (!res.ok) throw new Error(res.error);
      battle = res.value;
    }
    battle = queueBasicActions(battle, enemy.id);

    battle = executeRound(battle, makePRNG(1)).state;
    expect(battle.djinnRecoveryTimers['flint']).toBe(3);

    for (let round = 2; round <= 4; round++) {
      battle = queueBasicActions(battle, enemy.id);
      battle = executeRound(battle, makePRNG(round)).state;
      if (round < 4) {
        expect(battle.djinnRecoveryTimers['flint']).toBe(4 - round);
      }
    }

    expect(battle.djinnRecoveryTimers['flint']).toBeUndefined();
    expect(battle.playerTeam.djinnTrackers['flint']?.state).toBe('Set');
  });

  test('independent recovery allows immediate reactivation', () => {
    const team = createTeamWithDjinn(units, ['flint', 'granite']);
    const enemy = createEnemy();

    let battle = createBattleState(team, [enemy]);
    const first = queueDjinn(battle, 'flint');
    if (!first.ok) throw new Error(first.error);
    battle = first.value;
    battle = queueBasicActions(battle, enemy.id);
    battle = executeRound(battle, makePRNG(1)).state;

    battle = queueBasicActions(battle, enemy.id);
    const second = queueDjinn(battle, 'granite');
    if (!second.ok) throw new Error(second.error);
    battle = second.value;
    battle = executeRound(battle, makePRNG(2)).state;

    expect(battle.djinnRecoveryTimers['flint']).toBeUndefined();
    expect(battle.djinnRecoveryTimers['granite']).toBe(1);

    battle = queueBasicActions(battle, enemy.id);
    battle = executeRound(battle, makePRNG(3)).state;
    expect(battle.playerTeam.djinnTrackers['flint']?.state).toBe('Set');

    const recloak = queueDjinn(battle, 'flint');
    expect(recloak.ok).toBe(true);
  });
});
