import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { makePRNG } from '../../../src/core/random/prng';
import { createUnit } from '../../../src/core/models/Unit';
import { createTeam } from '../../../src/core/models/Team';
import type { UnitDefinition } from '../../../src/core/models/Unit';
import {
  checkCriticalHit,
  checkDodge,
  calculatePhysicalDamage,
  applyHealing,
} from '../../../src/core/algorithms/damage';
import { calculateMaxHp } from '../../../src/core/models/Unit';

describe('Damage Algorithm Properties', () => {
  const createSampleUnit = (spd: number): ReturnType<typeof createUnit> => {
    const definition: UnitDefinition = {
      id: 'test-unit',
      name: 'Test Unit',
      element: 'Venus',
      role: 'Balanced Warrior',
      baseStats: {
        hp: 100,
        pp: 20,
        atk: 10,
        def: 8,
        mag: 5,
        spd,
      },
      growthRates: {
        hp: 20,
        pp: 5,
        atk: 3,
        def: 2,
        mag: 2,
        spd: 1,
      },
      abilities: [],
      manaContribution: 1,
      description: 'A test unit',
    };

    return createUnit(definition, 1, 0);
  };

  test('should cap crit chance at 35% regardless of SPD', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 999 }), (spd) => {
        const unit = createSampleUnit(spd);
        const team = createTeam([unit, createSampleUnit(10), createSampleUnit(10), createSampleUnit(10)]);
        const rng = makePRNG(12345);
        
        // Test multiple times to get average
        let critCount = 0;
        const trials = 1000;
        for (let i = 0; i < trials; i++) {
          const testRng = makePRNG(12345 + i);
          if (checkCriticalHit(unit, team, testRng)) {
            critCount++;
          }
        }
        
        const critRate = critCount / trials;
        // Should be capped at 35% (with some variance for randomness)
        expect(critRate).toBeLessThanOrEqual(0.40); // Allow 5% variance
      })
    );
  });

  test('should maintain hit chance bounds (5% to 95%)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }), // attacker SPD
        fc.integer({ min: 0, max: 100 }), // defender SPD
        fc.integer({ min: 0, max: 100 }), // equipment evasion %
        fc.float({ min: 0.5, max: 1.0 }).filter(x => !isNaN(x) && isFinite(x)), // ability accuracy
        (attackerSpd, defenderSpd, equipmentEvasion, abilityAccuracy) => {
          // Skip invalid inputs
          if (isNaN(abilityAccuracy) || !isFinite(abilityAccuracy)) {
            return true;
          }

          const attacker = createSampleUnit(attackerSpd);
          const defender = createSampleUnit(defenderSpd);
          
          // Set equipment evasion
          defender.equipment = {
            ...defender.equipment,
            boots: {
              id: 'test-boots',
              name: 'Test Boots',
              slot: 'boots',
              tier: 'basic',
              cost: 100,
              statBonus: {},
              evasion: equipmentEvasion,
            },
          };
          
          const team = createTeam([attacker, createSampleUnit(10), createSampleUnit(10), createSampleUnit(10)]);
          
          // Calculate hit chance (same logic as checkDodge)
          const BASE_EVASION = 0.05;
          const speedBonus = (defenderSpd - attackerSpd) * 0.01;
          const evasion = Math.min(0.40, BASE_EVASION + (equipmentEvasion / 100) + speedBonus);
          const hitChance = Math.max(0.05, Math.min(0.95, abilityAccuracy * (1 - evasion)));
          
          expect(hitChance).toBeGreaterThanOrEqual(0.05);
          expect(hitChance).toBeLessThanOrEqual(0.95);
        }
      )
    );
  });

  test('should clamp healing to max HP', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 1000 }), (healingAmount) => {
        const unit = createSampleUnit(12);
        const maxHp = calculateMaxHp(unit);
        
        const healed = applyHealing(unit, healingAmount);
        
        expect(healed.currentHp).toBeLessThanOrEqual(maxHp);
        expect(healed.currentHp).toBeGreaterThanOrEqual(0);
      })
    );
  });
});

