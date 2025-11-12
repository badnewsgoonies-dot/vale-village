import { describe, expect, test } from 'vitest';
import { makePRNG } from '../../../src/core/random/prng';
import { mkBattle } from '../../../src/test/factories';
import { queueBattleServiceInternals } from '../../../src/core/services/QueueBattleService';

const { executeEnemyActionsPhase } = queueBattleServiceInternals;

describe('executeEnemyActionsPhase', () => {
  test('no enemies leaves state untouched', () => {
    const battle = mkBattle({ enemies: [] });
    const result = executeEnemyActionsPhase(battle, makePRNG(42));

    expect(result.state).toBe(battle);
    expect(result.events).toHaveLength(0);
  });
});
