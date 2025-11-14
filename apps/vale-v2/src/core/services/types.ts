/**
 * Battle event types for UI integration
 * Discriminated union for type-safe event handling
 */

import type { Element } from '../models/types';
import type { StatusEffect } from '../../data/schemas/UnitSchema';

/**
 * Battle event discriminated union
 * Used for UI animation and logging
 * 
 * Event separation:
 * - `battle-end`: Generic battle completion event, emitted for all battles (including test battles).
 *   Use this for UI that needs to react to any battle ending (results screen, disable controls, etc.).
 * - `encounter-finished`: Story-specific event emitted only when a battle has an encounterId.
 *   Use this for story progression logic (flag updates, chapter advancement).
 *   Always emitted alongside `battle-end` when an encounterId is present.
 */
export type BattleEvent =
  | { type: 'turn-start'; actorId: string; turn: number }
  | { type: 'ability'; casterId: string; abilityId: string; targets: readonly string[] }
  | { type: 'hit'; targetId: string; amount: number; element?: Element }
  | { type: 'heal'; targetId: string; amount: number }
  | { type: 'auto-heal'; message: string }
  | { type: 'mana-generated'; amount: number; source: string; newTotal: number }
  | { type: 'status-applied'; targetId: string; status: StatusEffect }
  | { type: 'status-expired'; targetId: string; status: StatusEffect }
  | { type: 'ko'; unitId: string }
  | { type: 'xp'; unitId: string; xp: number; levelUp?: { from: number; to: number } }
  | { type: 'battle-end'; result: 'PLAYER_VICTORY' | 'PLAYER_DEFEAT' }
  | { type: 'encounter-finished'; outcome: 'PLAYER_VICTORY' | 'PLAYER_DEFEAT'; encounterId: string }
  | {
      type: 'djinn-standby';
      unitId: string;
      djinnIds: readonly string[];
      atkDelta: number;
      defDelta: number;
    }
  | {
      type: 'djinn-recovered';
      unitId: string;
      djinnIds: readonly string[];
      atkDelta: number;
      defDelta: number;
    };
