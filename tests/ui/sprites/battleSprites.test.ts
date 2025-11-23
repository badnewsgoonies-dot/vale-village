import { describe, expect, test } from 'vitest';

import { ENCOUNTERS } from '@/data/definitions/encounters';
import type { BattleSpriteState } from '@/ui/sprites/mappings/battleSprites';
import {
  EARLY_GAME_ENEMY_IDS,
  EARLY_HOUSE_THRESHOLD,
  getEnemyBattleSprite,
  getPlayerBattleSprite,
  KNOWN_PLAYER_BATTLE_UNITS,
} from '@/ui/sprites/mappings/battleSprites';
import { validateSpritePath } from '@/ui/sprites/catalog';

describe('battle sprite mappings', () => {
const PLAYER_STATES: BattleSpriteState[] = ['idle', 'attack', 'hit'];

test.each(
  KNOWN_PLAYER_BATTLE_UNITS.flatMap(unitId =>
    PLAYER_STATES.map(state => ({ unitId, state }))
  )
)('player sprite exists for $unitId ($state)', ({ unitId, state }) => {
  const spriteId = getPlayerBattleSprite(unitId, state);
  expect(spriteId).not.toBeNull();
  expect(validateSpritePath(spriteId!)).toBe(true);
});

const derivedEarlyEnemyIds = Array.from(
  new Set(
    Object.entries(ENCOUNTERS)
      .filter(([encounterId]) => isEarlyEncounterId(encounterId))
      .flatMap(([, encounter]) => encounter.enemies)
  )
).sort();

test('early enemy list stays in sync with encounter data', () => {
  expect(EARLY_GAME_ENEMY_IDS.slice().sort()).toEqual(derivedEarlyEnemyIds);
});

test.each(EARLY_GAME_ENEMY_IDS)('early enemy sprite exists for %s', (enemyId) => {
    const spriteId = getEnemyBattleSprite(enemyId, 'idle');
    expect(spriteId).not.toBeNull();
    expect(validateSpritePath(spriteId!)).toBe(true);
  });

  test('unknown ids return null', () => {
    expect(getPlayerBattleSprite('unknown-unit', 'idle')).toBeNull();
    expect(getEnemyBattleSprite('unknown-enemy', 'idle')).toBeNull();
  });

function isEarlyEncounterId(encounterId: string): boolean {
  const match = encounterId.match(/^house-(\d+)/);
  if (match) {
    return Number(match[1]) <= EARLY_HOUSE_THRESHOLD;
    }
  return encounterId === 'vs1-garet';
}
});

