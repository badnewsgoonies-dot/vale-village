import { describe, expect, test } from 'vitest';
import { queueBattleServiceInternals } from '../../../src/core/services/QueueBattleService';
import { mkBattle } from '../../../src/test/factories';
import { updateBattleState, type QueuedAction } from '../../../src/core/models/BattleState';

const { validateQueueForExecution } = queueBattleServiceInternals;

describe('validateQueueForExecution', () => {
  const battle = mkBattle({});
  const targetId = battle.enemies[0]?.id ?? 'enemy';
  const completeQueue: (QueuedAction | null)[] = battle.playerTeam.units.map(unit => ({
    unitId: unit.id,
    abilityId: null,
    targetIds: [targetId],
    manaCost: 0,
  }));

  const readyState = updateBattleState(battle, {
    queuedActions: completeQueue,
    remainingMana: 999,
  });

  test('allows execution when queue is valid', () => {
    expect(() => validateQueueForExecution(readyState)).not.toThrow();
  });

  test('throws when not in planning phase', () => {
    const executingState = updateBattleState(readyState, { phase: 'executing' });
    expect(() => validateQueueForExecution(executingState)).toThrow('planning phase');
  });

  test('throws when queue is incomplete', () => {
    const incompleteState = updateBattleState(readyState, {
      queuedActions: [completeQueue[0], null, null, null],
    });
    expect(() => validateQueueForExecution(incompleteState)).toThrow('queue is not complete');
  });

  test('throws when mana budget is exceeded', () => {
    const lowManaState = updateBattleState(readyState, { remainingMana: -1 });
    expect(() => validateQueueForExecution(lowManaState)).toThrow('actions exceed mana budget');
  });
});
