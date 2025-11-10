/**
 * RNG Service
 * Thin wrapper around PRNG for deterministic branching
 */

import type { PRNG } from '../random/prng';
import { makePRNG, makeRandomPRNG } from '../random/prng';

/**
 * Create a new PRNG from seed
 */
export function createRng(seed: number): PRNG {
  return makePRNG(seed);
}

/**
 * Create PRNG from current time (for non-deterministic use cases)
 */
export function createRandomRng(): PRNG {
  return makeRandomPRNG();
}

/**
 * Clone PRNG for branching (e.g., simulation)
 */
export function cloneRng(rng: PRNG): PRNG {
  return rng.clone();
}

/**
 * Get seed from PRNG (for serialization)
 */
export function getRngSeed(rng: PRNG): number {
  return rng.getSeed();
}

