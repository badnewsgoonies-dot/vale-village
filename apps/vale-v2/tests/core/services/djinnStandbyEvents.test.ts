import { describe, expect, test } from 'vitest';
import { makePRNG } from '../../../src/core/random/prng';
import { createBattleState } from '../../../src/core/models/BattleState';
import { createTeam, updateTeam } from '../../../src/core/models/Team';
import type { DjinnTracker } from '../../../src/core/models/Team';
import { queueAction, queueDjinn, executeRound } from '../../../src/core/services/QueueBattleService';
import { mkUnit, mkEnemy } from '../../../src/test/factories';
import type { BattleEvent } from '../../../src/core/services/types';

function createTeamWithDjinn(units: readonly ReturnType<typeof mkUnit>[], djinnIds: readonly string[]) {
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

describe('Djinn standby events', () => {
  const units = Array.from({ length: 4 }, (_, i) =>
    mkUnit({
      id: `unit${i + 1}`,
      baseStats: { hp: 120, pp: 30, atk: 12, def: 6, mag: 5, spd: 10 + i },
    })
  );

  test('activating a Djinn emits standby events', () => {
    const team = createTeamWithDjinn(units, ['flint']);
    const enemy = createEnemy();

    let battle = createBattleState(team, [enemy]);
    const queued = queueDjinn(battle, 'flint');
    if (!queued.ok) throw new Error(queued.error);
    battle = queued.value;

    battle = queueBasicActions(battle, enemy.id);
    const result = executeRound(battle, makePRNG(1));

    const standbyEvent = result.events.find(
      (event): event is Extract<BattleEvent, { type: 'djinn-standby' }> => event.type === 'djinn-standby'
    );

    expect(standbyEvent).toBeDefined();
    expect(standbyEvent?.djinnIds).toContain('flint');
    expect(standbyEvent?.atkDelta).not.toBe(0);
  });

  test('recovering a Djinn emits recovered events', () => {
    const team = createTeamWithDjinn(units, ['flint']);
    const enemy = createEnemy();

    let battle = createBattleState(team, [enemy]);
    const queued = queueDjinn(battle, 'flint');
    if (!queued.ok) throw new Error(queued.error);
    battle = queued.value;

    let recoveryEvent: Extract<BattleEvent, { type: 'djinn-recovered' }> | undefined;

    for (let round = 1; round <= 4; round++) {
      battle = queueBasicActions(battle, enemy.id);
      const result = executeRound(battle, makePRNG(round));
      battle = result.state;
      recoveryEvent = result.events.find(
        (event): event is Extract<BattleEvent, { type: 'djinn-recovered' }> => event.type === 'djinn-recovered'
      );
      if (recoveryEvent) {
        break;
      }
    }

    expect(recoveryEvent).toBeDefined();
    expect(recoveryEvent?.djinnIds).toContain('flint');
    expect(recoveryEvent?.atkDelta).not.toBe(0);
  });
});
