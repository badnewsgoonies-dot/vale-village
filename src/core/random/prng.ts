/**
 * Serializable snapshot of the PRNG state.
 *
 * NOTE: `state` is the internal XorShift state after warmup and draws,
 * not the original seed. `initialSeed` is preserved for debugging and
 * reproducibility. `draws` counts how many times `next()` has been
 * called on this instance (after warmup).
 */
export interface SerializedPRNG {
  state: number;
  initialSeed: number;
  draws: number;
}

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
   * Returns original seed (for debugging / provenance)
   */
  getSeed(): number;

  /**
   * Returns the number of draws that have been performed.
   * Does not include the warmup draws performed in the constructor.
   */
  getDrawCount(): number;

  /**
   * Captures a serializable snapshot of the current generator state.
   */
  snapshot(): SerializedPRNG;
}

/**
 * XorShift PRNG implementation
 * Fast, deterministic, good quality
 */
export class XorShiftPRNG implements PRNG {
  private state: number;
  private readonly initialSeed: number;
  private draws: number;

  constructor(seed: number) {
    // Validate seed is non-negative
    if (seed < 0) {
      throw new Error(`PRNG seed must be non-negative, got: ${seed}`);
    }

    // Use 1 as default if seed is 0 (0 would cause issues with XorShift)
    this.initialSeed = seed || 1;
    this.state = this.initialSeed;
    this.draws = 0;

    // Warm up the generator
    for (let i = 0; i < 10; i++) {
      this.stepInternal();
    }
  }

  /**
   * Internal XorShift32 step that updates the state and returns the raw u32.
   */
  private stepInternal(): number {
    // XorShift32 algorithm
    this.state ^= this.state << 13;
    this.state ^= this.state >>> 17;
    this.state ^= this.state << 5;
    return this.state >>> 0;
  }

  /**
   * Returns next random number in [0, 1).
   */
  next(): number {
    const value = this.stepInternal();
    this.draws += 1;
    // Convert to [0, 1) range using 2^32 as denominator
    return value / 0x1_0000_0000;
  }

  /**
   * Returns the raw 32-bit unsigned integer from the generator.
   * Useful for hashing or deriving additional values.
   */
  nextU32(): number {
    const value = this.stepInternal();
    this.draws += 1;
    return value;
  }

  clone(): PRNG {
    const cloned = new XorShiftPRNG(this.initialSeed);
    cloned.state = this.state;
    cloned.draws = this.draws;
    return cloned;
  }

  getSeed(): number {
    return this.initialSeed;
  }

  getDrawCount(): number {
    return this.draws;
  }

  snapshot(): SerializedPRNG {
    return {
      state: this.state >>> 0,
      initialSeed: this.initialSeed >>> 0,
      draws: this.draws >>> 0,
    };
  }

  /**
   * Reconstruct a PRNG from a serialized snapshot.
   *
   * This will perform the same warmup as the constructor and then
   * restore the internal state and draw count, so subsequent calls
   * to `next()` produce the same sequence as the original instance.
   */
  static fromSerialized(snapshot: SerializedPRNG): XorShiftPRNG {
    const prng = new XorShiftPRNG(snapshot.initialSeed);
    prng.state = snapshot.state >>> 0;
    prng.draws = snapshot.draws >>> 0;
    return prng;
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
 * Recreate a PRNG instance from a serialized snapshot.
 */
export function prngFromSnapshot(snapshot: SerializedPRNG): PRNG {
  return XorShiftPRNG.fromSerialized(snapshot);
}

/**
 * Create PRNG from current time (for non-deterministic use cases).
 *
 * NOTE: This should be used only in UI/infra layers. Core deterministic
 * logic should receive a seeded PRNG created via `makePRNG` instead.
 */
export function makeRandomPRNG(): PRNG {
  return new XorShiftPRNG(Date.now());
}

/**
 * Deterministically derive a new seed from a parent seed and a label.
 * Uses a simple FNV-1a 32-bit hash.
 */
export function deriveSeed(parentSeed: number, label: string): number {
  // FNV-1a 32-bit offset basis
  let h = (0x811c9dc5 ^ (parentSeed >>> 0)) >>> 0;
  for (let i = 0; i < label.length; i++) {
    h ^= label.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

