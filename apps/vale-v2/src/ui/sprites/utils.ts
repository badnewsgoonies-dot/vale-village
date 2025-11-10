/**
 * Sprite Utility Functions
 * Helpers for mapping domain entities to sprite IDs
 */

/**
 * Get sprite ID for a unit
 */
export function getUnitSpriteId(unitId: string): string {
  return `unit:${unitId}`;
}

/**
 * Get sprite ID for an enemy
 */
export function getEnemySpriteId(enemyId: string): string {
  return `enemy:${enemyId}`;
}

/**
 * Get sprite state from battle event
 */
export function getSpriteStateFromEvent(eventType: string): 'idle' | 'attack' | 'hurt' | 'cast' | 'downed' {
  switch (eventType) {
    case 'ability':
      return 'cast';
    case 'hit':
      return 'hurt';
    case 'ko':
      return 'downed';
    default:
      return 'idle';
  }
}

