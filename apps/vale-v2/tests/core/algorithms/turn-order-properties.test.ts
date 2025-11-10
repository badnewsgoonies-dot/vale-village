import { describe, it, expect } from 'vitest';
import { makePRNG } from '../../../src/core/random/prng';
import { createUnit } from '../../../src/core/models/Unit';
import type { UnitDefinition } from '../../../src/core/models/Unit';
import { calculateTurnOrder } from '../../../src/core/algorithms/turn-order';

describe('Turn Order Algorithm Properties', () => {
  const createSampleUnit = (id: string, spd: number, hasHermes: boolean = false): ReturnType<typeof createUnit> => {
    const definition: UnitDefinition = {
      id,
      name: `Unit ${id}`,
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

    const unit = createUnit(definition, 1, 0);
    
    if (hasHermes) {
      return {
        ...unit,
        equipment: {
          ...unit.equipment,
          boots: {
            id: 'hermes-sandals',
            name: "Hermes' Sandals",
            slot: 'boots',
            tier: 'legendary',
            cost: 1000,
            statBonus: {},
            alwaysFirstTurn: true,
          },
        },
      };
    }
    
    return unit;
  };

  it('should produce stable turn order with same seed and SPD', () => {
    const units = [
      createSampleUnit('unit1', 15),
      createSampleUnit('unit2', 15), // Same SPD
      createSampleUnit('unit3', 20),
      createSampleUnit('unit4', 10),
    ];

    const seed = 12345;
    const rng1 = makePRNG(seed);
    const rng2 = makePRNG(seed);

    const order1 = calculateTurnOrder(units, rng1, 0);
    const order2 = calculateTurnOrder(units, rng2, 0);

    // Should be deterministic for same seed
    expect(order1).toEqual(order2);
  });

  it('should prioritize Hermes Sandals over higher SPD units', () => {
    const units = [
      createSampleUnit('fast-unit', 50), // Very fast
      createSampleUnit('hermes-unit', 10, true), // Slow but has Hermes
      createSampleUnit('medium-unit', 25),
      createSampleUnit('slow-unit', 5),
    ];

    const rng = makePRNG(12345);
    const order = calculateTurnOrder(units, rng, 0);

    // Hermes unit should be first (or in priority tier)
    const hermesIndex = order.indexOf('hermes-unit');
    const fastIndex = order.indexOf('fast-unit');
    
    // Hermes should come before regular fast unit
    expect(hermesIndex).toBeLessThan(fastIndex);
  });

  it('should maintain determinism across turns', () => {
    const units = [
      createSampleUnit('unit1', 15),
      createSampleUnit('unit2', 15),
      createSampleUnit('unit3', 20),
      createSampleUnit('unit4', 10),
    ];

    const seed = 12345;
    
    // Turn 0
    const rng1 = makePRNG(seed);
    const order1 = calculateTurnOrder(units, rng1, 0);
    
    // Turn 1 (should be deterministic)
    const rng2 = makePRNG(seed);
    const order2 = calculateTurnOrder(units, rng2, 1);
    
    // Both should be valid orders (same units, potentially different order due to tiebreaker)
    expect(order1.length).toBe(order2.length);
    expect(new Set(order1)).toEqual(new Set(order2)); // Same units
  });
});

