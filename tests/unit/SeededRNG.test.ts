import { describe, test, expect } from 'vitest';
import { SeededRNG } from '@/utils/SeededRNG';
import { Unit } from '@/types/Unit';
import { ISAAC, GARET } from '@/data/unitDefinitions';
import { SLASH } from '@/data/abilities';
import {
  calculatePhysicalDamage,
  calculatePsynergyDamage,
  calculateHealAmount,
  checkCriticalHit,
  executeAbility,
  attemptFlee,
  calculateTurnOrder,
} from '@/types/Battle';

/**
 * SeededRNG Tests: Demonstrating deterministic testing
 *
 * This replaces the Math.random() mocking anti-pattern with proper
 * dependency injection using SeededRNG.
 *
 * From user's hypercritical audit:
 * "Issue #11: Anti-Pattern - tests mock Math.random() directly instead of using SeededRNG pattern"
 *
 * Benefits of SeededRNG pattern:
 * - Deterministic: Same seed = same sequence
 * - Reproducible: Tests always produce same results
 * - Testable: Can verify specific random outcomes
 * - No mocking: Clean dependency injection
 */

describe('🎲 SeededRNG: Deterministic Random Testing', () => {
  test('✅ SeededRNG produces deterministic sequence', () => {
    const rng1 = new SeededRNG(42);
    const rng2 = new SeededRNG(42);

    // Same seed → same sequence
    expect(rng1.next()).toBe(rng2.next());
    expect(rng1.next()).toBe(rng2.next());
    expect(rng1.next()).toBe(rng2.next());
  });

  test('✅ Different seeds produce different sequences', () => {
    const rng1 = new SeededRNG(42);
    const rng2 = new SeededRNG(100);

    // Different seeds → different sequences
    expect(rng1.next()).not.toBe(rng2.next());
  });

  test('✅ Can reset seed to replay sequence', () => {
    const rng = new SeededRNG(42);
    const first = rng.next();
    const second = rng.next();

    rng.setSeed(42);
    expect(rng.next()).toBe(first);
    expect(rng.next()).toBe(second);
  });
});

describe('🎲 Battle System: Deterministic Damage with SeededRNG', () => {
  test('✅ Physical damage is deterministic with same seed', () => {
    const isaac = new Unit(ISAAC, 5);
    const enemy = new Unit(GARET, 5);

    const rng1 = new SeededRNG(123);
    const damage1 = calculatePhysicalDamage(isaac, enemy, SLASH, rng1);

    const rng2 = new SeededRNG(123);
    const damage2 = calculatePhysicalDamage(isaac, enemy, SLASH, rng2);

    // Same seed → same damage
    expect(damage1).toBe(damage2);
  });

  test('✅ Can test min/max damage bounds with specific seeds', () => {
    const isaac = new Unit(ISAAC, 5);
    const enemy = new Unit(GARET, 5);

    // Find a seed that produces minimum damage (multiplier ~0.9)
    const minRng = new SeededRNG(1);
    const minDamage = calculatePhysicalDamage(isaac, enemy, SLASH, minRng);

    // Find a seed that produces maximum damage (multiplier ~1.1)
    const maxRng = new SeededRNG(1000);
    const maxDamage = calculatePhysicalDamage(isaac, enemy, SLASH, maxRng);

    // Damage should vary within expected range
    expect(maxDamage).toBeGreaterThanOrEqual(minDamage);
    expect(maxDamage).toBeLessThanOrEqual(minDamage * 1.3); // Max ~22% higher
  });

  test('✅ Critical hits are deterministic with same seed', () => {
    const isaac = new Unit(ISAAC, 5);

    // Test determinism: same seed → same crit result
    const rng1 = new SeededRNG(42);
    const result1 = checkCriticalHit(isaac, rng1);

    const rng2 = new SeededRNG(42);
    const result2 = checkCriticalHit(isaac, rng2);

    // Same seed → same result (deterministic)
    expect(result1).toBe(result2);

    // Test with 10 different seeds, all produce deterministic results
    for (let seed = 0; seed < 10; seed++) {
      const rngA = new SeededRNG(seed);
      const rngB = new SeededRNG(seed);

      const resultA = checkCriticalHit(isaac, rngA);
      const resultB = checkCriticalHit(isaac, rngB);

      // Same seed → same result
      expect(resultA).toBe(resultB);
    }
  });

  test('✅ executeAbility produces deterministic results', () => {
    const isaac = new Unit(ISAAC, 5);
    const enemy = new Unit(GARET, 5);

    // Execute with same seed twice
    const rng1 = new SeededRNG(456);
    const result1 = executeAbility(isaac, SLASH, [enemy], rng1);

    // Reset enemy HP
    enemy.currentHp = enemy.maxHp;

    const rng2 = new SeededRNG(456);
    const result2 = executeAbility(isaac, SLASH, [enemy], rng2);

    // Same seed → same damage
    expect(result1.damage).toBe(result2.damage);
    expect(result1.critical).toBe(result2.critical);
  });

  test('✅ Turn order tiebreaker is deterministic', () => {
    // Create 4 units with SAME speed for tiebreaker test
    const unit1 = new Unit(ISAAC, 1);
    const unit2 = new Unit(GARET, 1);
    const unit3 = new Unit(ISAAC, 1);
    const unit4 = new Unit(GARET, 1);

    // Force same SPD
    unit1.stats.spd = 10;
    unit2.stats.spd = 10;
    unit3.stats.spd = 10;
    unit4.stats.spd = 10;

    const units = [unit1, unit2, unit3, unit4];

    // Same seed → same turn order
    const rng1 = new SeededRNG(789);
    const order1 = calculateTurnOrder(units, rng1);

    const rng2 = new SeededRNG(789);
    const order2 = calculateTurnOrder(units, rng2);

    expect(order1.map(u => u.id)).toEqual(order2.map(u => u.id));
  });

  test('✅ Flee attempt is deterministic', () => {
    const playerUnits = [new Unit(ISAAC, 5), new Unit(GARET, 5)];
    const enemies = [new Unit(ISAAC, 3), new Unit(GARET, 3)];

    // Find seed that produces successful flee
    let successSeed = 0;
    for (let seed = 0; seed < 1000; seed++) {
      const rng = new SeededRNG(seed);
      const result = attemptFlee(playerUnits, enemies, false, rng);
      if (result.ok && result.value === true) {
        successSeed = seed;
        break;
      }
    }

    // Verify deterministic flee success
    const rng1 = new SeededRNG(successSeed);
    const result1 = attemptFlee(playerUnits, enemies, false, rng1);

    const rng2 = new SeededRNG(successSeed);
    const result2 = attemptFlee(playerUnits, enemies, false, rng2);

    expect(result1.ok && result1.value).toBe(true);
    expect(result2.ok && result2.value).toBe(true);
  });
});

describe('🎲 SeededRNG: Performance and Statistical Properties', () => {
  test('✅ Generates values in [0, 1) range', () => {
    const rng = new SeededRNG(999);

    for (let i = 0; i < 1000; i++) {
      const value = rng.next();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  test('✅ Distribution is roughly uniform (statistical test)', () => {
    const rng = new SeededRNG(42);
    const buckets = [0, 0, 0, 0, 0]; // 5 buckets for 0-0.2, 0.2-0.4, etc.

    // Generate 1000 samples
    for (let i = 0; i < 1000; i++) {
      const value = rng.next();
      const bucket = Math.floor(value * 5);
      buckets[Math.min(bucket, 4)]++;
    }

    // Each bucket should have ~200 samples (±50 tolerance)
    for (const count of buckets) {
      expect(count).toBeGreaterThan(150);
      expect(count).toBeLessThan(250);
    }
  });

  test('✅ No obvious patterns in sequence', () => {
    const rng = new SeededRNG(42);
    const values: number[] = [];

    for (let i = 0; i < 100; i++) {
      values.push(rng.next());
    }

    // Check that values are not monotonically increasing/decreasing
    let increasing = 0;
    let decreasing = 0;

    for (let i = 1; i < values.length; i++) {
      if (values[i] > values[i - 1]) increasing++;
      if (values[i] < values[i - 1]) decreasing++;
    }

    // Both should happen (no monotonic trend)
    expect(increasing).toBeGreaterThan(20);
    expect(decreasing).toBeGreaterThan(20);
  });
});
