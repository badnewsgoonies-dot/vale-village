/**
 * Event text renderer
 * Converts BattleEvent discriminated union to display strings
 */

import type { BattleEvent } from '../../core/services/types';

export function renderEventText(e: BattleEvent): string {
  switch (e.type) {
    case 'turn-start':
      return `Turn ${e.turn} — ${e.actorId}`;
    case 'ability':
      return `${e.casterId} used ${e.abilityId}`;
    case 'hit':
      return `${e.targetId} took ${e.amount}${e.crit ? ' (CRIT)' : ''}${e.element ? ` [${e.element}]` : ''}`;
    case 'miss':
      return `${e.targetId} dodged!`;
    case 'heal':
      return `${e.targetId} recovered ${e.amount} HP`;
    case 'status-applied':
      return `${e.targetId} is ${e.status.type}`;
    case 'status-expired':
      return `${e.targetId} is no longer ${e.status.type}`;
    case 'ko':
      return `${e.unitId} is down!`;
    case 'xp':
      return `${e.unitId} gained ${e.xp} XP${e.levelUp ? ` (Lv ${e.levelUp.to})` : ''}`;
    case 'battle-end':
      return `Battle ended: ${e.result}`;
    case 'encounter-finished':
      return `Encounter completed: ${e.outcome}`;
    default: {
      // Exhaustive check - ensures all event types are handled
      const _exhaustive: never = e;
      console.warn(`Unhandled event type:`, _exhaustive);
      return '';
    }
  }
}

