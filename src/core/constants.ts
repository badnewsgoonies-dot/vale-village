/**
 * Game constants
 * Centralized magic numbers and configuration values
 */

/**
 * Minimum party size - minimum number of units in player team
 */
export const MIN_PARTY_SIZE = 1;

/**
 * Maximum party size - maximum number of units in player team
 */
export const MAX_PARTY_SIZE = 4;

/**
 * Party size - maximum number of units in player team
 * @deprecated Use MAX_PARTY_SIZE instead. Kept for backward compatibility.
 */
export const PARTY_SIZE = MAX_PARTY_SIZE;

/**
 * Maximum queue size (matches party size)
 * @deprecated Use MAX_PARTY_SIZE instead. Kept for backward compatibility.
 */
export const MAX_QUEUE_SIZE = MAX_PARTY_SIZE;

/**
 * RNG stream offsets for deterministic battle RNG
 * Each stream is separated by a large offset to prevent collisions
 */
export const RNG_STREAMS = {
  /** Status effects processing (poison, burn, etc.) */
  STATUS_EFFECTS: 0,
  /** Player/enemy actions */
  ACTIONS: 7,
  /** Victory reward calculation */
  VICTORY: 999,
  /** End turn processing */
  END_TURN: 0,
  /** Queue battle round execution */
  QUEUE_ROUND: 1000,
} as const;

/**
 * Base multiplier for RNG stream separation
 * Ensures streams don't overlap across turns
 */
export const RNG_STREAM_BASE_MULTIPLIER = 1_000_000;

/**
 * Battle calculation constants
 */
export const BATTLE_CONSTANTS = {
  /** Revive HP percentage (50% of max HP) */
  REVIVE_HP_PERCENTAGE: 0.5,
  /** Base defense multiplier in damage formula (physical) */
  DEFENSE_MULTIPLIER: 0.5,
  /** Base defense multiplier for psynergy damage */
  PSYNERGY_DEFENSE_MULTIPLIER: 0.3,
  /** Element advantage damage multiplier */
  ELEMENT_ADVANTAGE_MULTIPLIER: 1.5,
  /** Element disadvantage damage multiplier */
  ELEMENT_DISADVANTAGE_MULTIPLIER: 0.67,
  /** Normal battle equipment drop rate (10%) */
  EQUIPMENT_DROP_RATE_NORMAL: 0.1,
  /** Boss battle equipment drop rate (50%) */
  EQUIPMENT_DROP_RATE_BOSS: 0.5,
  /** Minimum damage floor (all attacks deal at least this much) */
  MINIMUM_DAMAGE: 1,
  /** Minimum healing amount (all heals restore at least this much if basePower > 0) */
  MINIMUM_HEALING: 1,
} as const;

/**
 * Create an empty action queue
 * Returns array of nulls with proper type for BattleState
 * @param size - Queue size (defaults to MAX_PARTY_SIZE for backward compatibility)
 */
export function createEmptyQueue(size: number = MAX_PARTY_SIZE): readonly null[] {
  if (size < MIN_PARTY_SIZE || size > MAX_PARTY_SIZE) {
    throw new Error(`Queue size must be between ${MIN_PARTY_SIZE} and ${MAX_PARTY_SIZE}, got ${size}`);
  }
  return Array(size).fill(null) as null[];
}

/**
 * Create RNG stream for a specific purpose
 * @param rngSeed Base seed for the battle
 * @param turnNumber Current turn/round number
 * @param stream Stream identifier (from RNG_STREAMS or custom offset)
 */
export function createRNGStream(
  rngSeed: number,
  turnNumber: number,
  stream: keyof typeof RNG_STREAMS | number
): number {
  const offset = typeof stream === 'number' ? stream : RNG_STREAMS[stream];
  return rngSeed + turnNumber * RNG_STREAM_BASE_MULTIPLIER + offset;
}
