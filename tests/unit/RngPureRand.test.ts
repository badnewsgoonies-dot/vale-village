import { describe, test, expect } from 'vitest';
import { makeRng, type IRng } from '@/utils/rng';

/**
 * RNG Fairness Testing
 *
 * Tests for src/utils/rng.ts (pure-rand based IRng implementation)
 * Ensures random number generation is fair, uniform, and deterministic
 *
 * Priority 1: CRITICAL (Currently 0% coverage)
 */

describe('RNG: Basic Functionality', () => {
  test(' makeRng creates RNG with seed', () => {
    const rng = makeRng(12345);
    expect(rng).toBeDefined();
    expect(rng.describe().seed).toBe(12345);
  });

  test(' RNG.float() returns value in [0, 1)', () => {
    const rng = makeRng(42);
    for (let i = 0; i < 100; i++) {
      const val = rng.float();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });

  test(' RNG.int(min, max) returns value in [min, max]', () => {
    const rng = makeRng(999);
    for (let i = 0; i < 100; i++) {
      const val = rng.int(10, 20);
      expect(val).toBeGreaterThanOrEqual(10);
      expect(val).toBeLessThanOrEqual(20);
    }
  });

  test(' RNG.bool(0.5) returns ~50% true', () => {
    const rng = makeRng(123);
    let trueCount = 0;

    for (let i = 0; i < 1000; i++) {
      if (rng.bool(0.5)) trueCount++;
    }

    const trueRate = trueCount / 1000;
    expect(trueRate).toBeGreaterThan(0.45);
    expect(trueRate).toBeLessThan(0.55);
  });

  test(' RNG.choose() picks from array uniformly', () => {
    const rng = makeRng(456);
    const arr = ['a', 'b', 'c', 'd'];
    const counts: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 };

    for (let i = 0; i < 1000; i++) {
      const choice = rng.choose(arr);
      counts[choice]++;
    }

    // Each should be ~25% (±5%)
    expect(counts.a).toBeGreaterThan(200);
    expect(counts.a).toBeLessThan(300);
    expect(counts.b).toBeGreaterThan(200);
    expect(counts.b).toBeLessThan(300);
    expect(counts.c).toBeGreaterThan(200);
    expect(counts.c).toBeLessThan(300);
    expect(counts.d).toBeGreaterThan(200);
    expect(counts.d).toBeLessThan(300);
  });
});

describe('RNG: Uniform Distribution', () => {
  test(' CRITICAL: float() produces uniform distribution', () => {
    const rng = makeRng(12345);
    const samples = Array.from({ length: 10000 }, () => rng.float());

    // Average should be ~0.5
    const avg = samples.reduce((a, b) => a + b) / samples.length;
    expect(avg).toBeGreaterThan(0.49);
    expect(avg).toBeLessThan(0.51);

    // Should cover full range
    expect(Math.min(...samples)).toBeLessThan(0.1);
    expect(Math.max(...samples)).toBeGreaterThan(0.9);

    // Distribution test: Split into 5 buckets
    const buckets = [0, 0, 0, 0, 0];
    samples.forEach(val => {
      const bucket = Math.floor(val * 5);
      buckets[Math.min(bucket, 4)]++;
    });

    // Each bucket should have ~2000 items (±10%)
    buckets.forEach(count => {
      expect(count).toBeGreaterThan(1800);
      expect(count).toBeLessThan(2200);
    });
  });

  test(' int(0, 100) produces uniform distribution', () => {
    const rng = makeRng(999);
    const counts = new Array(101).fill(0);

    for (let i = 0; i < 10000; i++) {
      const val = rng.int(0, 100);
      counts[val]++;
    }

    // Each value should appear ~99 times (±50%)
    counts.forEach(count => {
      expect(count).toBeGreaterThan(50);
      expect(count).toBeLessThan(150);
    });
  });

  test(' Damage variance stays in 0.9-1.1 range', () => {
    const rng = makeRng(42);
    const multipliers = [];

    for (let i = 0; i < 1000; i++) {
      const mult = 0.9 + (rng.float() * 0.2);
      multipliers.push(mult);
    }

    // Verify range
    expect(Math.min(...multipliers)).toBeGreaterThanOrEqual(0.9);
    expect(Math.max(...multipliers)).toBeLessThanOrEqual(1.1);

    // Average should be ~1.0
    const avg = multipliers.reduce((a, b) => a + b) / multipliers.length;
    expect(avg).toBeGreaterThan(0.99);
    expect(avg).toBeLessThan(1.01);
  });
});

describe('RNG: Seed Determinism', () => {
  test(' Same seed produces same sequence', () => {
    const rng1 = makeRng(12345);
    const rng2 = makeRng(12345);

    const seq1 = Array.from({ length: 100 }, () => rng1.float());
    const seq2 = Array.from({ length: 100 }, () => rng2.float());

    expect(seq1).toEqual(seq2);
  });

  test(' Different seeds produce different sequences', () => {
    const rng1 = makeRng(12345);
    const rng2 = makeRng(54321);

    const seq1 = Array.from({ length: 100 }, () => rng1.float());
    const seq2 = Array.from({ length: 100 }, () => rng2.float());

    // Should be different (very unlikely to match)
    expect(seq1).not.toEqual(seq2);
  });

  test(' Fork creates independent RNG stream', () => {
    const parent = makeRng(12345);
    const child = parent.fork('child');

    // Generate from both
    const parentVals = [parent.float(), parent.float(), parent.float()];
    const childVals = [child.float(), child.float(), child.float()];

    // Should be independent
    expect(parentVals).not.toEqual(childVals);

    // Parent forks should be tracked
    expect(parent.describe().forks).toBeGreaterThan(0);
  });
});

describe('RNG: Advanced Features', () => {
  test(' shuffleInPlace() randomizes array', () => {
    const rng = makeRng(789);
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const original = [...arr];

    rng.shuffleInPlace(arr);

    // Array should be different (very unlikely to be same)
    expect(arr).not.toEqual(original);

    // But should contain same elements
    expect(arr.sort()).toEqual(original.sort());
  });

  test(' bool() with different probabilities', () => {
    const rng1 = makeRng(111);
    const rng2 = makeRng(222);
    const rng3 = makeRng(333);

    // 10% probability
    let count10 = 0;
    for (let i = 0; i < 1000; i++) {
      if (rng1.bool(0.1)) count10++;
    }
    expect(count10 / 1000).toBeGreaterThan(0.05);
    expect(count10 / 1000).toBeLessThan(0.15);

    // 50% probability
    let count50 = 0;
    for (let i = 0; i < 1000; i++) {
      if (rng2.bool(0.5)) count50++;
    }
    expect(count50 / 1000).toBeGreaterThan(0.45);
    expect(count50 / 1000).toBeLessThan(0.55);

    // 90% probability
    let count90 = 0;
    for (let i = 0; i < 1000; i++) {
      if (rng3.bool(0.9)) count90++;
    }
    expect(count90 / 1000).toBeGreaterThan(0.85);
    expect(count90 / 1000).toBeLessThan(0.95);
  });

  test(' Multiple forks create independent streams', () => {
    const root = makeRng(42);
    const child1 = root.fork('map');
    const child2 = root.fork('battle');
    const child3 = root.fork('loot');

    const seq1 = Array.from({ length: 10 }, () => child1.float());
    const seq2 = Array.from({ length: 10 }, () => child2.float());
    const seq3 = Array.from({ length: 10 }, () => child3.float());

    // All should be different
    expect(seq1).not.toEqual(seq2);
    expect(seq1).not.toEqual(seq3);
    expect(seq2).not.toEqual(seq3);

    // Root should track all forks
    expect(root.describe().forks).toBe(3);
  });

  test(' Fork label is tracked', () => {
    const root = makeRng(12345);
    const child = root.fork('test-label');

    expect(child.describe().label).toBe('test-label');
  });
});

describe('RNG: Edge Cases and Error Handling', () => {
  test(' int() throws on invalid range', () => {
    const rng = makeRng(42);

    // max < min
    expect(() => rng.int(10, 5)).toThrow();

    // Non-integer
    expect(() => rng.int(1.5, 10)).toThrow();
    expect(() => rng.int(1, 10.5)).toThrow();
  });

  test(' bool() throws on invalid probability', () => {
    const rng = makeRng(42);

    expect(() => rng.bool(-0.1)).toThrow();
    expect(() => rng.bool(1.1)).toThrow();
  });

  test(' choose() throws on empty array', () => {
    const rng = makeRng(42);

    expect(() => rng.choose([])).toThrow();
  });

  test(' int() with same min and max returns that value', () => {
    const rng = makeRng(42);

    for (let i = 0; i < 10; i++) {
      expect(rng.int(5, 5)).toBe(5);
    }
  });

  test(' bool(0) always returns false', () => {
    const rng = makeRng(42);

    for (let i = 0; i < 100; i++) {
      expect(rng.bool(0)).toBe(false);
    }
  });

  test(' bool(1) always returns true', () => {
    const rng = makeRng(42);

    for (let i = 0; i < 100; i++) {
      expect(rng.bool(1)).toBe(true);
    }
  });

  test(' shuffleInPlace() works with 1-element array', () => {
    const rng = makeRng(42);
    const arr = [42];

    rng.shuffleInPlace(arr);

    expect(arr).toEqual([42]);
  });

  test(' choose() with 1-element array returns that element', () => {
    const rng = makeRng(42);
    const arr = ['only'];

    for (let i = 0; i < 10; i++) {
      expect(rng.choose(arr)).toBe('only');
    }
  });
});
