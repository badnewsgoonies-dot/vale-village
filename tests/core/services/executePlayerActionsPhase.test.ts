import { describe, expect, test } from 'vitest';
import { makePRNG } from '../../../src/core/random/prng';
import { mkBattle } from '../../../src/test/factories';
import { queueBattleServiceInternals } from '../../../src/core/services/QueueBattleService';

const { executePlayerActionsPhase } = queueBattleServiceInternals;

describe('executePlayerActionsPhase', () => {
  test('returns original state when no player actions are queued', () => {
    const battle = mkBattle({ enemies: [] });
    const result = executePlayerActionsPhase(battle, makePRNG(0));

    expect(result.state).toBe(battle);
    expect(result.events).toHaveLength(0);
  });
});
http://localhost:5173/