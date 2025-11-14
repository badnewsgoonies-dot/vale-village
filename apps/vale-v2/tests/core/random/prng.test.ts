import { describe, test, expect } from 'vitest';
import { makePRNG, prngFromSnapshot, deriveSeed } from '../../../src/core/random/prng';

describe('PRNG', () => {
  test('should generate deterministic sequences with same seed', () => {
    const rng1 = makePRNG(12345);
    const rng2 = makePRNG(12345);
    
    const seq1 = Array.from({ length: 10 }, () => rng1.next());
    const seq2 = Array.from({ length: 10 }, () => rng2.next());
    
    expect(seq1).toEqual(seq2);
  });
  
  test('should generate different sequences with different seeds', () => {
    const rng1 = makePRNG(12345);
    const rng2 = makePRNG(67890);
    
    const seq1 = Array.from({ length: 10 }, () => rng1.next());
    const seq2 = Array.from({ length: 10 }, () => rng2.next());
    
    expect(seq1).not.toEqual(seq2);
  });
  
  test('should clone correctly', () => {
    const rng1 = makePRNG(12345);
    const value1 = rng1.next();
    
    const rng2 = rng1.clone();
    const value2 = rng2.next();
    
    // Cloned RNG should continue from same state
    const rng3 = makePRNG(12345);
    rng3.next(); // Advance to match rng1
    const value3 = rng3.next();
    
    expect(value2).toBe(value3);
  });
  
  test('should generate numbers in [0, 1) range', () => {
    const rng = makePRNG(12345);
    
    for (let i = 0; i < 100; i++) {
      const value = rng.next();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  test('should reject negative seeds', () => {
    expect(() => {
      makePRNG(-1);
    }).toThrow('PRNG seed must be non-negative');

    expect(() => {
      makePRNG(-100);
    }).toThrow('PRNG seed must be non-negative');
  });

  test('should accept zero seed (converted to 1)', () => {
    // Zero seed should be converted to 1 internally
    expect(() => {
      const rng = makePRNG(0);
      expect(rng.getSeed()).toBe(1);
    }).not.toThrow();
  });

  test('should accept positive seeds', () => {
    expect(() => {
      makePRNG(1);
      makePRNG(12345);
      makePRNG(999999);
    }).not.toThrow();
  });

  test('should snapshot and restore deterministically', () => {
    const rng1 = makePRNG(4242);

    const prefix = Array.from({ length: 5 }, () => rng1.next());
    const snapshot = rng1.snapshot();

    const rng2 = prngFromSnapshot(snapshot);

    const rest1 = Array.from({ length: 10 }, () => rng1.next());
    const rest2 = Array.from({ length: 10 }, () => rng2.next());

    expect(rest2).toEqual(rest1);
    expect(prefix.length).toBe(5);
  });

  test('should track draw count excluding warmup', () => {
    const rng = makePRNG(2025);
    expect(rng.getDrawCount()).toBe(0);

    rng.next();
    rng.next();
    rng.next();

    expect(rng.getDrawCount()).toBe(3);
  });

  test('deriveSeed should be deterministic per label', () => {
    const base = 1337;
    const a1 = deriveSeed(base, 'actions');
    const a2 = deriveSeed(base, 'actions');
    const b = deriveSeed(base, 'effects');

    expect(a1).toBe(a2);
    expect(a1).not.toBe(b);
  });
});

