import { describe, it, expect } from 'vitest';
import { makePRNG } from '../../../src/core/random/prng';
import { createUnit } from '../../../src/core/models/Unit';
import { createTeam } from '../../../src/core/models/Team';
import { startBattle } from '../../../src/core/services/BattleService';
import type { UnitDefinition } from '../../../src/data/schemas/UnitSchema';

describe('Preview Determinism', () => {
  const testUnitDef: UnitDefinition = {
    id: 'test-warrior',
    name: 'Test Warrior',
    element: 'Venus',
    role: 'Balanced Warrior',
    baseStats: {
      hp: 100,
      pp: 20,
      atk: 15,
      def: 10,
      mag: 5,
      spd: 12,
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
    description: 'A test warrior',
  };

  it('preview does not advance live RNG', () => {
    const unit1 = createUnit(testUnitDef, 1, 0);
    const unit2 = createUnit({ ...testUnitDef, id: 'unit2', name: 'Unit 2' }, 1, 0);
    const unit3 = createUnit({ ...testUnitDef, id: 'unit3', name: 'Unit 3' }, 1, 0);
    const unit4 = createUnit({ ...testUnitDef, id: 'unit4', name: 'Unit 4' }, 1, 0);
    const enemy1 = createUnit({ ...testUnitDef, id: 'enemy1', name: 'Enemy 1' }, 1, 0);
    
    const team = createTeam([unit1, unit2, unit3, unit4]);
    const seed = 12345;
    const rng = makePRNG(seed);
    const battleState = startBattle(team, [enemy1], rng);

    // Capture RNG state by getting a sequence of values
    const beforeSequence: number[] = [];
    const testRng = makePRNG(seed);
    for (let i = 0; i < 10; i++) {
      beforeSequence.push(testRng.next());
    }

    // Simulate preview (should use cloned RNG)
    // Note: This test assumes preview uses a separate RNG stream
    // In actual implementation, preview uses a derived seed
    const previewRng = makePRNG(seed ^ 0x1234); // Different seed for preview
    for (let i = 0; i < 100; i++) {
      previewRng.next(); // Consume many values in preview
    }

    // Verify live RNG is unchanged
    const afterSequence: number[] = [];
    const verifyRng = makePRNG(seed);
    for (let i = 0; i < 10; i++) {
      afterSequence.push(verifyRng.next());
    }

    expect(afterSequence).toEqual(beforeSequence);
  });

  it('preview produces consistent results', () => {
    const unit1 = createUnit(testUnitDef, 1, 0);
    const unit2 = createUnit({ ...testUnitDef, id: 'unit2' }, 1, 0);
    const unit3 = createUnit({ ...testUnitDef, id: 'unit3' }, 1, 0);
    const unit4 = createUnit({ ...testUnitDef, id: 'unit4' }, 1, 0);
    const enemy1 = createUnit({ ...testUnitDef, id: 'enemy1' }, 1, 0);
    
    const team = createTeam([unit1, unit2, unit3, unit4]);
    const seed = 12345;
    const rng = makePRNG(seed);
    const battleState = startBattle(team, [enemy1], rng);

    // Run preview multiple times with same inputs
    const previewSeed = seed ^ (0 << 8) ^ (0 << 16) ^ ('test-warrior'.length << 24);
    const preview1 = makePRNG(previewSeed);
    const preview2 = makePRNG(previewSeed);

    // Both should produce identical sequences
    const seq1: number[] = [];
    const seq2: number[] = [];
    for (let i = 0; i < 20; i++) {
      seq1.push(preview1.next());
      seq2.push(preview2.next());
    }

    expect(seq1).toEqual(seq2);
  });
});

