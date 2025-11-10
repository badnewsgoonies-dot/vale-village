/**
 * Test Context Factory
 * Creates deterministic test contexts for unit tests
 */

import { makePRNG } from '../core/random/prng';
import type { PRNG } from '../core/random/prng';

/**
 * Test context with deterministic RNG
 */
export interface TestContext {
  rng: PRNG;
  seed: number;
}

/**
 * Create a deterministic test context
 */
export function makeTestCtx(seed: number = 1234): TestContext {
  return {
    rng: makePRNG(seed),
    seed,
  };
}

