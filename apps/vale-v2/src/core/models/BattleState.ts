/**
 * BattleState model (POJO)
 * Following ADR 003: Plain objects with readonly properties where possible
 */

import type { Team } from './Team';
import type { Unit } from './Unit';
import { createEmptyQueue } from '../constants';

/**
 * Battle result types
 */
export type BattleResult = 'PLAYER_VICTORY' | 'PLAYER_DEFEAT' | 'PLAYER_FLEE';

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
 * Battle state
 * Tracks current battle state including units, turn order, and battle status
 * 
 * PR-QUEUE-BATTLE: Extended with queue-based battle system
 */
export interface BattleState {
  /** Player's team */
  readonly playerTeam: Team;

  /** Enemy units */
  readonly enemies: readonly Unit[];

  /** Current turn number (for Djinn recovery tracking) */
  currentTurn: number;

  /** Current round number (increments each planning phase) */
  roundNumber: number;

  /** Battle phase (planning/executing/victory/defeat) */
  phase: BattlePhase;

  /** Turn order (SPD-sorted) - array of unit IDs */
  readonly turnOrder: readonly string[];  // Unit IDs

  /** Index of current acting unit in turnOrder (legacy, for old system compatibility) */
  currentActorIndex: number;

  /** Battle status */
  status: BattleStatus;

  /** Battle log (for UI display) */
  log: readonly string[];

  // ===== QUEUE-BASED BATTLE SYSTEM FIELDS =====
  
  /** Which unit we're currently selecting action for (0-3) */
  currentQueueIndex: number;

  /** All 4 queued actions (null if not queued yet) */
  queuedActions: readonly (QueuedAction | null)[];

  /** Djinn IDs marked for activation this round */
  queuedDjinn: readonly string[];

  /** Mana remaining in team pool */
  remainingMana: number;

  /** Maximum mana pool (sum of all units' manaContribution) */
  maxMana: number;

  /** Index of action currently executing (during execution phase) */
  executionIndex: number;

  /** Djinn recovery timers: djinnId → turns until recovery */
  djinnRecoveryTimers: Record<string, number>; // Plain object instead of Map

  // ===== LEGACY FIELDS (for backward compatibility) =====

  /** Is this a boss battle? (cannot flee) */
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
 * Calculate team mana pool from unit contributions
 */
export function calculateTeamManaPool(team: Team): number {
  return team.units.reduce((total, unit) => total + unit.manaContribution, 0);
}

/**
 * Create initial battle state
 * PR-QUEUE-BATTLE: Initializes queue-based battle system
 */
export function createBattleState(
  playerTeam: Team,
  enemies: readonly Unit[],
  turnOrder: readonly string[] = []
): BattleState {
  const maxMana = calculateTeamManaPool(playerTeam);

  return {
    playerTeam,
    enemies,
    currentTurn: 0,
    roundNumber: 1,
    phase: 'planning',
    turnOrder: turnOrder.length > 0 ? turnOrder : [],
    currentActorIndex: 0,
    status: 'ongoing',
    log: [],
    // Queue-based fields
    currentQueueIndex: 0,
    queuedActions: createEmptyQueue(),
    queuedDjinn: [],
    remainingMana: maxMana,
    maxMana,
    executionIndex: 0,
    djinnRecoveryTimers: {},
  };
}

/**
 * Update battle state (returns new object - immutability)
 */
export function updateBattleState(state: BattleState, updates: Partial<BattleState>): BattleState {
  return { ...state, ...updates };
}

/**
 * Get encounter ID from battle state
 * Uses canonical meta.encounterId, falls back to deprecated encounterId field
 */
export function getEncounterId(battle: BattleState): string | undefined {
  return battle.meta?.encounterId ?? battle.encounterId;
}

