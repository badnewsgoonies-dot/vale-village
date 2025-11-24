import { describe, expect, test } from 'vitest';
import { createEmptyQueue } from '../../../src/core/constants';
import { updateBattleState, type QueuedAction } from '../../../src/core/models/BattleState';
import { mkBattle, mkUnit } from '../../../src/test/factories';
import { queueBattleServiceInternals } from '../../../src/core/services/QueueBattleService';

const { transitionToPlanningPhase } = queueBattleServiceInternals;

describe('transitionToPlanningPhase', () => {
  test('resets queue and advances to next planning round', () => {
    // Explicitly create 4-unit party so queue size matches createEmptyQueue() default
    const battle = mkBattle({
      party: [mkUnit(), mkUnit(), mkUnit(), mkUnit()],
    });
    const targetId = battle.enemies[0]?.id ?? 'enemy';
    const queuedActions: (QueuedAction | null)[] = battle.playerTeam.units.map(unit => ({
      unitId: unit.id,
      abilityId: null,
      targetIds: [targetId],
      manaCost: 0,
    }));

    const executingState = updateBattleState(battle, {
      phase: 'executing',
      roundNumber: 3,
      queuedActions,
      queuedDjinn: ['flint'],
      currentQueueIndex: 2,
      executionIndex: 1,
      remainingMana: 0,
    });

    const nextState = transitionToPlanningPhase(executingState);

    expect(nextState.phase).toBe('planning');
    expect(nextState.roundNumber).toBe(4);
    expect(nextState.currentQueueIndex).toBe(0);
    expect(nextState.executionIndex).toBe(0);
    expect(nextState.queuedActions).toEqual(createEmptyQueue());
    expect(nextState.queuedDjinn).toEqual([]);
    expect(nextState.remainingMana).toBe(nextState.maxMana);
  });
});
