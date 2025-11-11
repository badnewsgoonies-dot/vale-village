/**
 * Game constants
 * Centralized magic numbers and configuration values
 */

/**
 * Party size - maximum number of units in player team
 */
export const PARTY_SIZE = 4;

/**
 * Maximum queue size (matches party size)
 */
export const MAX_QUEUE_SIZE = PARTY_SIZE;

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
  /** Default ability accuracy (95%) */
  DEFAULT_ABILITY_ACCURACY: 0.95,
  /** Critical hit damage multiplier */
  CRITICAL_HIT_MULTIPLIER: 2.0,
  /** Revive HP percentage (50% of max HP) */
  REVIVE_HP_PERCENTAGE: 0.5,
  /** Base defense multiplier in damage formula */
  DEFENSE_MULTIPLIER: 0.5,
  /** Element advantage damage multiplier */
  ELEMENT_ADVANTAGE_MULTIPLIER: 1.5,
  /** Element disadvantage damage multiplier */
  ELEMENT_DISADVANTAGE_MULTIPLIER: 0.67,
  /** Normal battle equipment drop rate (10%) */
  EQUIPMENT_DROP_RATE_NORMAL: 0.1,
  /** Boss battle equipment drop rate (50%) */
  EQUIPMENT_DROP_RATE_BOSS: 0.5,
} as const;

/**
 * Create an empty action queue
 * Returns array of nulls with proper type for BattleState
 */
export function createEmptyQueue(): readonly null[] {
  return Array(MAX_QUEUE_SIZE).fill(null) as null[];
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

