/**
 * Seeded Random Number Generator for deterministic testing
 *
 * Uses a simple Linear Congruential Generator (LCG) algorithm.
 * This allows tests to produce predictable, repeatable random sequences.
 *
 * Based on the algorithm used in Numerical Recipes and other sources.
 */
export class SeededRNG {
  private seed: number;

  /**
   * Create a new SeededRNG with the given seed
   * @param seed - Initial seed value (default: 12345)
   */
  constructor(seed: number = 12345) {
    this.seed = seed;
  }

  /**
   * Generate next random number in [0, 1) range
   * Uses Linear Congruential Generator: seed = (a * seed + c) % m
   */
  next(): number {
    // LCG parameters (from Numerical Recipes)
    const a = 1664525;
    const c = 1013904223;
    const m = 2 ** 32;

    this.seed = (a * this.seed + c) % m;
    return this.seed / m;
  }

  /**
   * Reset the seed to a new value
   */
  setSeed(seed: number): void {
    this.seed = seed;
  }

  /**
   * Get current seed value
   */
  getSeed(): number {
    return this.seed;
  }
}

/**
 * Global default RNG instance (uses Math.random by default)
 */
export interface RNG {
  next(): number;
}

/**
 * Default RNG that wraps Math.random() for production use
 */
export class DefaultRNG implements RNG {
  next(): number {
    return Math.random();
  }
}

/**
 * Global RNG instance used by battle system
 * Can be replaced with SeededRNG for deterministic testing
 */
export const globalRNG: RNG = new DefaultRNG();
