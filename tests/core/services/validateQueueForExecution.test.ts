import { describe, expect, test } from 'vitest';
import { queueBattleServiceInternals } from '../../../src/core/services/QueueBattleService';
import { mkBattle, mkUnit } from '../../../src/test/factories';
import { updateBattleState, type QueuedAction } from '../../../src/core/models/BattleState';

const { validateQueueForExecution } = queueBattleServiceInternals;

describe('validateQueueForExecution', () => {
  // Explicitly create 4-unit party for these tests
  const battle = mkBattle({
    party: [mkUnit(), mkUnit(), mkUnit(), mkUnit()],
  });
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
    const result = validateQueueForExecution(readyState);
    expect(result.ok).toBe(true);
  });

  test('returns error when not in planning phase', () => {
    const executingState = updateBattleState(readyState, { phase: 'executing' });
    const result = validateQueueForExecution(executingState);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('planning phase');
    }
  });

  test('returns error when queue is incomplete', () => {
    const incompleteState = updateBattleState(readyState, {
      queuedActions: [completeQueue[0], null, null, null],
    });
    const result = validateQueueForExecution(incompleteState);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('queue incomplete');
    }
  });

  test('returns error when mana budget is exceeded', () => {
    // Create a queue with actions that exceed maxMana
    // maxMana is calculated from team mana contributions, so we need to set up
    // a scenario where total cost > maxMana
    const expensiveQueue: (QueuedAction | null)[] = battle.playerTeam.units.map(unit => ({
      unitId: unit.id,
      abilityId: null,
      targetIds: [targetId],
      manaCost: 999, // Each action costs 999 mana
    }));
    
    // Set maxMana to a low value so the total cost exceeds it
    const lowMaxManaState = updateBattleState(readyState, {
      queuedActions: expensiveQueue,
      maxMana: 1, // Very low max mana
      remainingMana: 1,
    });
    
    const result = validateQueueForExecution(lowMaxManaState);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('actions exceed mana budget');
    }
  });
});
