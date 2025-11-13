/**
 * Event text renderer
 * Converts BattleEvent discriminated union to display strings
 */

import { DJINN } from '../../data/definitions/djinn';
import type { BattleEvent } from '../../core/services/types';

export function renderEventText(e: BattleEvent): string {
  switch (e.type) {
    case 'turn-start':
      return `Turn ${e.turn} — ${e.actorId}`;
    case 'ability':
      return `${e.casterId} used ${e.abilityId}`;
    case 'hit':
      return `${e.targetId} took ${e.amount}${e.element ? ` [${e.element}]` : ''}`;
    case 'heal':
      return `${e.targetId} recovered ${e.amount} HP`;
    case 'auto-heal':
      return `✨ ${e.message}`;
    case 'mana-generated':
      return `⚡ ${e.source} generated +${e.amount} mana! (${e.newTotal} total)`;
    case 'status-applied': {
      const statusNames: Record<string, string> = {
        poison: 'Poisoned',
        burn: 'Burned',
        freeze: 'Frozen',
        paralyze: 'Paralyzed',
      };
      const statusName = statusNames[e.status.type] || e.status.type;
      return `${e.targetId} is ${statusName}!`;
    }
    case 'status-expired': {
      const recoveryNames: Record<string, string> = {
        poison: 'Poison',
        burn: 'Burn',
        freeze: 'Freeze',
        paralyze: 'Paralysis',
      };
      const recoveryName = recoveryNames[e.status.type] || e.status.type;
      return `${e.targetId} recovered from ${recoveryName}`;
    }
    case 'ko':
      return `${e.unitId} is down!`;
    case 'xp':
      return `${e.unitId} gained ${e.xp} XP${e.levelUp ? ` (Lv ${e.levelUp.to})` : ''}`;
    case 'battle-end':
      return `Battle ended: ${e.result}`;
    case 'encounter-finished':
      return `Encounter completed: ${e.outcome}`;
    case 'djinn-standby':
    case 'djinn-recovered': {
      const djinnNames = e.djinnIds
        .map((id) => DJINN[id]?.name ?? id)
        .filter(Boolean)
        .join(', ') || 'Djinn';
      const stateText = e.type === 'djinn-standby' ? 'Standby' : 'Recovered';
      const formatDelta = (value: number) => (value >= 0 ? `+${value}` : `${value}`);
      return `${djinnNames} ${stateText} — ${e.unitId} ATK ${formatDelta(e.atkDelta)}, DEF ${formatDelta(e.defDelta)}`;
    }
    default: {
      // Exhaustive check - ensures all event types are handled
      const _exhaustive: never = e;
      console.warn(`Unhandled event type:`, _exhaustive);
      return '';
    }
  }
}
