/**
 * BattleState model (POJO)
 * Following ADR 003: Plain objects with readonly properties where possible
 */

import type { Team } from './Team';
import type { Unit } from './Unit';
import { createEmptyQueue } from '../constants';
import { updateTeam } from './Team';
import { mergeDjinnAbilitiesIntoUnit } from '../algorithms/djinnAbilities';

/**
 * Battle result types
 */
export type BattleResult = 'PLAYER_VICTORY' | 'PLAYER_DEFEAT';

/**
 * Battle status (ongoing or ended)
 */
export type BattleStatus = 'ongoing' | BattleResult;

/**
 * Battle phase for queue-based system
 */
export type BattlePhase = 'planning' | 'executing' | 'victory' | 'defeat';

/**
 * Queued action for a unit
 */
export interface QueuedAction {
  /** Unit ID that will perform this action */
  readonly unitId: string;
  /** Ability ID (null for basic attack) */
  readonly abilityId: string | null;
  /** Target unit IDs */
  readonly targetIds: readonly string[];
  /** Mana cost of this action */
  readonly manaCost: number;
}

/**
 * Unit index for O(1) lookups
 * Maps unit ID -> unit and tracks which side they're on
 */
export interface UnitIndex {
  readonly unit: Unit;
  readonly isPlayer: boolean;
}

/**
 * Turn order tracking
 * Manages the sequence of unit actions in battle
 */
export interface BattleTurnOrder {
  /** Turn order (SPD-sorted) - array of unit IDs */
  readonly turnOrder: readonly string[];
  /** Index of current acting unit in turnOrder (legacy, for old system compatibility) */
  currentActorIndex: number;
}

/**
 * Queue-based battle system state
 * Tracks queued actions and execution progress
 */
export interface BattleQueue {
  /** Which unit we're currently selecting action for (0 to teamSize-1) */
  currentQueueIndex: number;
  /** Queued actions for each unit (null if not queued yet). Array length matches team size (1-4) */
  queuedActions: readonly (QueuedAction | null)[];
  /** Djinn IDs marked for activation this round */
  queuedDjinn: readonly string[];
  /** Index of action currently executing (during execution phase) */
  executionIndex: number;
}

/**
 * Battle progress tracking
 * Tracks current phase, status, and turn/round counters
 */
export interface BattleProgress {
  /** Battle phase (planning/executing/victory/defeat) */
  phase: BattlePhase;
  /** Battle status (ongoing or result) */
  status: BattleStatus;
  /** Current turn number (for Djinn recovery tracking) */
  currentTurn: number;
  /** Current round number (increments each planning phase) */
  roundNumber: number;
}

/**
 * Battle metadata
 * Context information about the battle encounter
 */
export interface BattleMetadata {
  /** Is this a boss battle? (used for difficulty/rewards/UX) */
  readonly isBossBattle?: boolean;
  /** NPC ID that triggered this battle (for post-battle cutscene) */
  readonly npcId?: string;
  /**
   * Encounter ID for story progression
   * @deprecated Use meta.encounterId instead. This field is kept for backward compatibility.
   */
  encounterId?: string;
  /** Battle metadata */
  meta?: {
    /** Canonical encounter ID for story progression */
    encounterId: string;
    /** Encounter difficulty tier */
    difficulty?: 'normal' | 'elite' | 'boss';
  };
}

/**
 * Battle state
 * Tracks current battle state including units, turn order, and battle status
 *
 * PR-QUEUE-BATTLE: Extended with queue-based battle system
 * PERFORMANCE: Added unitById index for O(1) lookups
 * REFACTOR: Split into focused sub-interfaces for better organization
 */
export interface BattleState extends BattleTurnOrder, BattleQueue, BattleProgress, BattleMetadata {
  /** Player's team */
  readonly playerTeam: Team;

  /** Enemy units */
  readonly enemies: readonly Unit[];

  /**
   * Unit index for O(1) lookups by ID
   * PERFORMANCE: Eliminates repeated [...playerTeam.units, ...enemies].find() calls
   */
  readonly unitById: ReadonlyMap<string, UnitIndex>;

  /** Battle log (for UI display) */
  log: readonly string[];

  /** Mana remaining in team pool */
  remainingMana: number;

  /** Maximum mana pool (sum of all units' manaContribution) */
  maxMana: number;

  /** Djinn recovery timers: djinnId → turns until recovery */
  djinnRecoveryTimers: Record<string, number>; // Plain object instead of Map
}

/**
 * Build unit index for O(1) lookups
 * PERFORMANCE: Eliminates O(n) array searches
 */
export function buildUnitIndex(
  playerUnits: readonly Unit[],
  enemyUnits: readonly Unit[]
): ReadonlyMap<string, UnitIndex> {
  const index = new Map<string, UnitIndex>();

  for (const unit of playerUnits) {
    index.set(unit.id, { unit, isPlayer: true });
  }

  for (const unit of enemyUnits) {
    index.set(unit.id, { unit, isPlayer: false });
  }

  return index;
}

/**
 * Calculate team mana pool from unit contributions
 */
export function calculateTeamManaPool(team: Team): number {
  return team.units.reduce((total, unit) => total + unit.manaContribution, 0);
}

/**
 * Create initial battle state
 * PR-QUEUE-BATTLE: Initializes queue-based battle system
 * PERFORMANCE: Builds unitById index for O(1) lookups
 */
export function createBattleState(
  playerTeam: Team,
  enemies: readonly Unit[],
  turnOrder: readonly string[] = []
): BattleState {
  const unitsWithDjinnAbilities = playerTeam.units.map(unit =>
    mergeDjinnAbilitiesIntoUnit(unit, playerTeam)
  );
  const updatedTeam = updateTeam(playerTeam, {
    units: unitsWithDjinnAbilities,
  });
  const maxMana = calculateTeamManaPool(updatedTeam);
  const unitById = buildUnitIndex(updatedTeam.units, enemies);

  return {
    playerTeam: updatedTeam,
    enemies,
    unitById,
    currentTurn: 0,
    roundNumber: 1,
    phase: 'planning',
    turnOrder: turnOrder.length > 0 ? turnOrder : [],
    currentActorIndex: 0,
    status: 'ongoing',
    log: [],
    // Queue-based fields
    currentQueueIndex: 0,
    queuedActions: createEmptyQueue(playerTeam.units.length),
    queuedDjinn: [],
    remainingMana: maxMana,
    maxMana,
    executionIndex: 0,
    djinnRecoveryTimers: {},
  };
}

/**
 * Update battle state (returns new object - immutability)
 * PERFORMANCE: Automatically rebuilds unitById index when units change
 * DEV MODE: Validates state invariants to catch impossible states early
 */
export function updateBattleState(state: BattleState, updates: Partial<BattleState>): BattleState {
  const newState = { ...state, ...updates };

  // Rebuild index if units changed
  if (updates.playerTeam || updates.enemies) {
    newState.unitById = buildUnitIndex(newState.playerTeam.units, newState.enemies);
  }

  // Validate invariants in development mode
  if (process.env.NODE_ENV !== 'production') {
    try {
      // Dynamic import to avoid bundling in production
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { validateBattleState } = require('../validation/battleStateInvariants');
      validateBattleState(newState);
    } catch (error) {
      // Re-throw validation errors
      if (error instanceof Error && error.name === 'BattleStateInvariantError') {
        throw error;
      }
      // Ignore module loading errors (validation module might not exist in some builds)
      if (error instanceof Error && !error.message.includes('Cannot find module') && !error.message.includes('require is not defined')) {
        console.warn('Battle state validation failed:', error);
      }
    }
  }

  return newState;
}

/**
 * Get encounter ID from battle state
 * Uses canonical meta.encounterId, falls back to deprecated encounterId field
 */
export function getEncounterId(battle: BattleState): string | undefined {
  return battle.meta?.encounterId ?? battle.encounterId;
}
