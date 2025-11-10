/**
 * Battle event types for UI integration
 * Discriminated union for type-safe event handling
 */

import type { Element } from '../models/types';
import type { StatusEffect } from '../../data/schemas/UnitSchema';

/**
 * Battle event discriminated union
 * Used for UI animation and logging
 */
export type BattleEvent =
  | { type: 'turn-start'; actorId: string; turn: number }
  | { type: 'ability'; casterId: string; abilityId: string; targets: readonly string[] }
  | { type: 'hit'; targetId: string; amount: number; crit: boolean; element?: Element }
  | { type: 'miss'; targetId: string }
  | { type: 'heal'; targetId: string; amount: number }
  | { type: 'status-applied'; targetId: string; status: StatusEffect }
  | { type: 'status-expired'; targetId: string; status: StatusEffect }
  | { type: 'ko'; unitId: string }
  | { type: 'xp'; unitId: string; xp: number; levelUp?: { from: number; to: number } }
  | { type: 'battle-end'; result: 'PLAYER_VICTORY' | 'PLAYER_DEFEAT' | 'PLAYER_FLEE' };

