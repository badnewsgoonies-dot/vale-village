/**
 * Property-based Test Arbitraries
 * Fast-check arbitraries that respect domain schemas
 */

import * as fc from 'fast-check';
import { mkUnit, mkEnemy, mkBattle } from './factories';

/**
 * Arbitrary for health values (1-999)
 */
export const arbHealth = fc.integer({ min: 1, max: 999 });

/**
 * Arbitrary for PP values (0-99)
 */
export const arbPp = fc.integer({ min: 0, max: 99 });

/**
 * Arbitrary for stat values (reasonable range)
 */
export const arbStat = fc.integer({ min: 1, max: 50 });

/**
 * Arbitrary for unit IDs
 */
export const arbUnitId = fc.string({ minLength: 1, maxLength: 8 });

/**
 * Arbitrary for a unit (simplified)
 */
export const arbUnit = fc.record({
  id: arbUnitId,
  currentHp: arbHealth,
}).map(({ id, currentHp }) => 
  mkUnit({ id, currentHp })
);

/**
 * Arbitrary for an enemy unit
 */
export const arbEnemy = fc.record({
  id: arbUnitId,
  currentHp: arbHealth,
}).map(({ id, currentHp }) => 
  mkEnemy('slime', { id, currentHp })
);

/**
 * Arbitrary for battle state
 * Generates valid battle states with 1-4 party members and 1-4 enemies
 */
export const arbBattleState = fc.record({
  partySize: fc.integer({ min: 1, max: 4 }),
  enemySize: fc.integer({ min: 1, max: 4 }),
}).chain(({ partySize, enemySize }) => {
  return fc.tuple(
    fc.array(arbUnit, { minLength: partySize, maxLength: partySize }),
    fc.array(arbEnemy, { minLength: enemySize, maxLength: enemySize })
  ).map(([party, enemies]) => mkBattle({ party, enemies }));
});

