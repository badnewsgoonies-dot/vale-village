/**
 * Seeded PRNG interface for deterministic randomness
 */
export interface PRNG {
  /**
   * Returns next random number in [0, 1)
   */
  next(): number;
  
  /**
   * Creates a clone of this PRNG (for branching)
   */
  clone(): PRNG;
  
  /**
   * Returns current seed (for serialization)
   */
  getSeed(): number;
}

/**
 * XorShift PRNG implementation
 * Fast, deterministic, good quality
 */
export class XorShiftPRNG implements PRNG {
  private state: number;
  private readonly initialSeed: number;

  constructor(seed: number) {
    // Validate seed is non-negative
    if (seed < 0) {
      throw new Error(`PRNG seed must be non-negative, got: ${seed}`);
    }
    
    // Use 1 as default if seed is 0 (0 would cause issues with XorShift)
    this.initialSeed = seed || 1;
    this.state = this.initialSeed;
    
    // Warm up the generator
    for (let i = 0; i < 10; i++) {
      this.next();
    }
  }

  next(): number {
    // XorShift32 algorithm
    this.state ^= this.state << 13;
    this.state ^= this.state >>> 17;
    this.state ^= this.state << 5;
    
    // Convert to [0, 1) range
    return (this.state >>> 0) / 0xFFFFFFFF;
  }

  clone(): PRNG {
    const cloned = new XorShiftPRNG(this.initialSeed);
    cloned.state = this.state;
    return cloned;
  }

  getSeed(): number {
    return this.initialSeed;
  }
}

/**
 * Create a new PRNG from seed
 * @param seed - Non-negative integer seed (0 is converted to 1)
 * @throws Error if seed is negative
 */
export function makePRNG(seed: number): PRNG {
  if (seed < 0) {
    throw new Error(`PRNG seed must be non-negative, got: ${seed}`);
  }
  return new XorShiftPRNG(seed);
}

/**
 * Create PRNG from current time (for non-deterministic use cases)
 */
export function makeRandomPRNG(): PRNG {
  return new XorShiftPRNG(Date.now());
}

