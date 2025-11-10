import { describe, it, expect } from 'vitest';
import { makePRNG, XorShiftPRNG } from '@/core/random/prng';

describe('PRNG', () => {
  it('should generate deterministic sequences with same seed', () => {
    const rng1 = makePRNG(12345);
    const rng2 = makePRNG(12345);
    
    const seq1 = Array.from({ length: 10 }, () => rng1.next());
    const seq2 = Array.from({ length: 10 }, () => rng2.next());
    
    expect(seq1).toEqual(seq2);
  });
  
  it('should generate different sequences with different seeds', () => {
    const rng1 = makePRNG(12345);
    const rng2 = makePRNG(67890);
    
    const seq1 = Array.from({ length: 10 }, () => rng1.next());
    const seq2 = Array.from({ length: 10 }, () => rng2.next());
    
    expect(seq1).not.toEqual(seq2);
  });
  
  it('should clone correctly', () => {
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
  
  it('should generate numbers in [0, 1) range', () => {
    const rng = makePRNG(12345);
    
    for (let i = 0; i < 100; i++) {
      const value = rng.next();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

