import { describe, test, expect } from 'vitest';
import { emptyStats, addStats, multiplyStats } from '@/types/Stats';
import type { Stats } from '@/types/Stats';

/**
 * CRITICAL: Stats.ts has 0% test coverage
 *
 * These utility functions are used EVERYWHERE in the codebase.
 * If they have bugs, EVERYTHING is broken.
 */
describe('CRITICAL: Stats.ts Utility Functions (0% Coverage!)', () => {

  test('emptyStats() returns all zeros', () => {
    const stats = emptyStats();

    expect(stats.hp).toBe(0);
    expect(stats.pp).toBe(0);
    expect(stats.atk).toBe(0);
    expect(stats.def).toBe(0);
    expect(stats.mag).toBe(0);
    expect(stats.spd).toBe(0);
  });

  test('addStats() correctly adds two stat objects', () => {
    const base: Stats = {
      hp: 100,
      pp: 20,
      atk: 15,
      def: 10,
      mag: 12,
      spd: 8,
    };

    const bonus: Stats = {
      hp: 50,
      pp: 10,
      atk: 5,
      def: 3,
      mag: 4,
      spd: 2,
    };

    const result = addStats(base, bonus);

    expect(result.hp).toBe(150);
    expect(result.pp).toBe(30);
    expect(result.atk).toBe(20);
    expect(result.def).toBe(13);
    expect(result.mag).toBe(16);
    expect(result.spd).toBe(10);
  });

  test('multiplyStats() correctly scales all stats', () => {
    const base: Stats = {
      hp: 100,
      pp: 20,
      atk: 15,
      def: 10,
      mag: 12,
      spd: 8,
    };

    const result = multiplyStats(base, 1.5);

    // Should floor the results
    expect(result.hp).toBe(150);   // 100 × 1.5 = 150
    expect(result.pp).toBe(30);    // 20 × 1.5 = 30
    expect(result.atk).toBe(22);   // 15 × 1.5 = 22.5 → 22
    expect(result.def).toBe(15);   // 10 × 1.5 = 15
    expect(result.mag).toBe(18);   // 12 × 1.5 = 18
    expect(result.spd).toBe(12);   // 8 × 1.5 = 12
  });
});

describe('EDGE CASES: Stats Utilities With Problematic Inputs', () => {

  test('EDGE: addStats() with negative values', () => {
    const base: Stats = {
      hp: 100,
      pp: 20,
      atk: 15,
      def: 10,
      mag: 12,
      spd: 8,
    };

    const debuff: Stats = {
      hp: -20,    // Cursed item?
      pp: -5,
      atk: -3,
      def: 0,
      mag: -2,
      spd: -1,
    };

    const result = addStats(base, debuff);

    // Should allow negative bonuses
    expect(result.hp).toBe(80);
    expect(result.pp).toBe(15);
    expect(result.atk).toBe(12);
    expect(result.def).toBe(10);
    expect(result.mag).toBe(10);
    expect(result.spd).toBe(7);
  });

  test('EDGE: addStats() resulting in negative totals', () => {
    const base: Stats = {
      hp: 10,
      pp: 5,
      atk: 3,
      def: 2,
      mag: 2,
      spd: 1,
    };

    const massiveDebuff: Stats = {
      hp: -50,
      pp: -20,
      atk: -10,
      def: -10,
      mag: -10,
      spd: -10,
    };

    const result = addStats(base, massiveDebuff);

    // Should NOT clamp (raw math)
    expect(result.hp).toBe(-40);   // 10 - 50 = -40
    expect(result.atk).toBe(-7);   // 3 - 10 = -7

    // ⚠️ THIS COULD BE A BUG!
    // Should negative stats be allowed?
  });

  test('EDGE: multiplyStats() with 0 multiplier', () => {
    const base: Stats = {
      hp: 100,
      pp: 20,
      atk: 15,
      def: 10,
      mag: 12,
      spd: 8,
    };

    const result = multiplyStats(base, 0);

    // Should zero everything
    expect(result.hp).toBe(0);
    expect(result.pp).toBe(0);
    expect(result.atk).toBe(0);
    expect(result.def).toBe(0);
    expect(result.mag).toBe(0);
    expect(result.spd).toBe(0);
  });

  test('EDGE: multiplyStats() with negative multiplier', () => {
    const base: Stats = {
      hp: 100,
      pp: 20,
      atk: 15,
      def: 10,
      mag: 12,
      spd: 8,
    };

    const result = multiplyStats(base, -1);

    // Should negate all stats (is this intentional?)
    expect(result.hp).toBe(-100);
    expect(result.atk).toBe(-15);

    // ⚠️ DEFINITELY A BUG!
    // Negative multipliers should probably be rejected
  });

  test('EDGE: multiplyStats() with very large multiplier', () => {
    const base: Stats = {
      hp: 100,
      pp: 20,
      atk: 15,
      def: 10,
      mag: 12,
      spd: 8,
    };

    const result = multiplyStats(base, 1000);

    // Should handle large numbers
    expect(result.hp).toBe(100000);
    expect(result.atk).toBe(15000);

    // Could overflow Number.MAX_SAFE_INTEGER?
  });

  test('EDGE: multiplyStats() with decimal that causes rounding', () => {
    const base: Stats = {
      hp: 100,
      pp: 20,
      atk: 15,
      def: 11,   // 11 × 1.3 = 14.3
      mag: 13,   // 13 × 1.3 = 16.9
      spd: 7,    // 7 × 1.3 = 9.1
    };

    const result = multiplyStats(base, 1.3);

    // Should floor (not round)
    expect(result.def).toBe(14);   // floor(14.3) = 14, NOT 14.3
    expect(result.mag).toBe(16);   // floor(16.9) = 16, NOT 17
    expect(result.spd).toBe(9);    // floor(9.1) = 9
  });

  test('EDGE: addStats() with floating point values', () => {
    // What if stats aren't integers?
    const base = {
      hp: 100.5,
      pp: 20.7,
      atk: 15.3,
      def: 10.1,
      mag: 12.9,
      spd: 8.4,
    } as Stats;

    const bonus = {
      hp: 50.2,
      pp: 10.8,
      atk: 5.5,
      def: 3.3,
      mag: 4.1,
      spd: 2.6,
    } as Stats;

    const result = addStats(base, bonus);

    // Should preserve decimals (no flooring in addStats)
    expect(result.hp).toBe(150.7);    // 100.5 + 50.2
    expect(result.atk).toBe(20.8);    // 15.3 + 5.5

    // ⚠️ INCONSISTENT WITH multiplyStats!
    // multiplyStats floors, but addStats doesn't
  });
});

describe('CORRECTNESS: Verify Math Is Actually Correct', () => {

  test('addStats() is commutative (order doesn\'t matter)', () => {
    const a: Stats = { hp: 100, pp: 20, atk: 15, def: 10, mag: 12, spd: 8 };
    const b: Stats = { hp: 50, pp: 10, atk: 5, def: 3, mag: 4, spd: 2 };

    const result1 = addStats(a, b);
    const result2 = addStats(b, a);

    expect(result1).toEqual(result2);
  });

  test('addStats() with emptyStats() is identity', () => {
    const base: Stats = { hp: 100, pp: 20, atk: 15, def: 10, mag: 12, spd: 8 };
    const zero = emptyStats();

    const result = addStats(base, zero);

    expect(result).toEqual(base);
  });

  test('multiplyStats() by 1.0 is identity', () => {
    const base: Stats = { hp: 100, pp: 20, atk: 15, def: 10, mag: 12, spd: 8 };

    const result = multiplyStats(base, 1.0);

    expect(result).toEqual(base);
  });

  test('multiplyStats() by 2.0 is same as addStats(base, base)', () => {
    const base: Stats = { hp: 100, pp: 20, atk: 14, def: 10, mag: 12, spd: 8 };

    const doubled = multiplyStats(base, 2.0);
    const added = addStats(base, base);

    expect(doubled).toEqual(added);
  });

  test('Chaining operations: (A + B) × 2 = (A × 2) + (B × 2)', () => {
    const a: Stats = { hp: 100, pp: 20, atk: 15, def: 10, mag: 12, spd: 8 };
    const b: Stats = { hp: 50, pp: 10, atk: 5, def: 3, mag: 4, spd: 2 };

    const left = multiplyStats(addStats(a, b), 2);
    const right = addStats(multiplyStats(a, 2), multiplyStats(b, 2));

    expect(left).toEqual(right);
  });
});

describe('PERFORMANCE: Stats Operations Are Fast', () => {

  test('addStats() called 100,000 times completes quickly', () => {
    const a: Stats = { hp: 100, pp: 20, atk: 15, def: 10, mag: 12, spd: 8 };
    const b: Stats = { hp: 50, pp: 10, atk: 5, def: 3, mag: 4, spd: 2 };

    const start = performance.now();

    for (let i = 0; i < 100000; i++) {
      addStats(a, b);
    }

    const elapsed = performance.now() - start;

    // Should be < 50ms for 100k calls
    expect(elapsed).toBeLessThan(50);

    console.log(`addStats 100k calls: ${elapsed.toFixed(2)}ms`);
  });

  test('multiplyStats() called 100,000 times completes quickly', () => {
    const base: Stats = { hp: 100, pp: 20, atk: 15, def: 10, mag: 12, spd: 8 };

    const start = performance.now();

    for (let i = 0; i < 100000; i++) {
      multiplyStats(base, 1.5);
    }

    const elapsed = performance.now() - start;

    // Should be < 50ms for 100k calls
    expect(elapsed).toBeLessThan(50);

    console.log(`multiplyStats 100k calls: ${elapsed.toFixed(2)}ms`);
  });
});
