/**
 * BattleState model (POJO)
 * Following ADR 003: Plain objects with readonly properties where possible
 */

import type { Team } from './Team';
import type { Unit } from './Unit';

/**
 * Battle result types
 */
export type BattleResult = 'PLAYER_VICTORY' | 'PLAYER_DEFEAT' | 'PLAYER_FLEE';

/**
 * Battle status (ongoing or ended)
 */
export type BattleStatus = 'ongoing' | BattleResult;

/**
 * Battle state
 * Tracks current battle state including units, turn order, and battle status
 */
export interface BattleState {
  /** Player's team */
  readonly playerTeam: Team;

  /** Enemy units */
  readonly enemies: readonly Unit[];

  /** Current turn number (for Djinn recovery tracking) */
  currentTurn: number;

  /** Turn order (SPD-sorted) - array of unit IDs */
  readonly turnOrder: readonly string[];  // Unit IDs

  /** Index of current acting unit in turnOrder */
  currentActorIndex: number;

  /** Battle status */
  status: BattleStatus;

  /** Battle log (for UI display) */
  log: readonly string[];

  /** Is this a boss battle? (cannot flee) */
  readonly isBossBattle?: boolean;

  /** NPC ID that triggered this battle (for post-battle cutscene) */
  readonly npcId?: string;

  /** Encounter ID for story progression */
  encounterId?: string;

  /** Battle metadata */
  meta?: {
    encounterId: string;
    difficulty?: 'normal' | 'elite' | 'boss';
  };
}

/**
 * Create initial battle state
 */
export function createBattleState(
  playerTeam: Team,
  enemies: readonly Unit[],
  turnOrder: readonly string[] = []
): BattleState {
  return {
    playerTeam,
    enemies,
    currentTurn: 0,
    turnOrder: turnOrder.length > 0 ? turnOrder : [],
    currentActorIndex: 0,
    status: 'ongoing',
    log: [],
  };
}

/**
 * Update battle state (returns new object - immutability)
 */
export function updateBattleState(state: BattleState, updates: Partial<BattleState>): BattleState {
  return { ...state, ...updates };
}

