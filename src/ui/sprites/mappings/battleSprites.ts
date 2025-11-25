import { ENCOUNTERS } from '@/data/definitions/encounters';

/**
 * Battle sprite mappings
 * Provides deterministic path IDs for battle unit rendering.
 *
 * The mapping only references actual GIFs that ship with the repo. Missing units
 * or enemies return `null`, allowing `BattleUnitSprite` to show a placeholder.
 */

export type BattleSpriteState = 'idle' | 'attack' | 'hit';

type SpriteStateMap = Record<BattleSpriteState, string>;

const EARLY_HOUSE_MAX = 5;
const EARLY_SPECIAL_ENCOUNTERS = new Set(['vs1-garet']);

function isEarlyEncounterId(encounterId: string): boolean {
  const match = encounterId.match(/^house-(\d+)/);
  if (match) {
    return Number(match[1]) <= EARLY_HOUSE_MAX;
  }
  return EARLY_SPECIAL_ENCOUNTERS.has(encounterId);
}

function collectEarlyEnemyIds(): string[] {
  const ids = new Set<string>();
  for (const [encounterId, encounter] of Object.entries(ENCOUNTERS)) {
    if (!isEarlyEncounterId(encounterId)) {
      continue;
    }
    encounter.enemies.forEach(enemyId => ids.add(enemyId));
  }
  return Array.from(ids).sort();
}

function makePlayerSpritePaths(character: 'Isaac' | 'Garet' | 'Ivan' | 'Mia', weapon: 'lBlade' | 'Axe' | 'Staff' | 'Mace'): SpriteStateMap {
  const base = `/sprites/battle/party/${character.toLowerCase()}/${character}_${weapon}`;
  return {
    idle: `${base}_Front.gif`,
    attack: `${base}_Attack1.gif`,
    hit: `${base}_HitFront.gif`,
  };
}

function makeSinglePose(path: string): SpriteStateMap {
  return {
    idle: path,
    attack: path,
    hit: path,
  };
}

const PLAYER_SPRITES: Record<string, SpriteStateMap> = {
  // Canonical roster
  'adept': makePlayerSpritePaths('Isaac', 'lBlade'),
  'war-mage': makePlayerSpritePaths('Garet', 'Axe'),
  'mystic': makePlayerSpritePaths('Mia', 'Staff'),
  'ranger': makePlayerSpritePaths('Ivan', 'Staff'),

  // Development/test units map onto the starter party for visuals
  'test-warrior-1': makePlayerSpritePaths('Isaac', 'lBlade'),
  'test-warrior-2': makePlayerSpritePaths('Garet', 'Axe'),
  'test-warrior-3': makePlayerSpritePaths('Mia', 'Staff'),
  'test-warrior-4': makePlayerSpritePaths('Ivan', 'Staff'),
};

const ENEMY_SPRITES: Record<string, SpriteStateMap> = {
  // Test goblins + tutorial encounters
  'enemy-1': makeSinglePose('/sprites/battle/enemies/Goblin.gif'),
  'enemy-2': makeSinglePose('/sprites/battle/enemies/Alec_Goblin.gif'),
  'garet-enemy': makeSinglePose('/sprites/battle/enemies/Brigand.gif'),
  'war-mage': makeSinglePose('/sprites/battle/enemies/Brigand.gif'),

  // Houses 2-5 (Act 1 focus)
  'earth-scout': makeSinglePose('/sprites/battle/enemies/Goblin.gif'),
  'venus-wolf': makeSinglePose('/sprites/battle/enemies/Wild_Wolf.gif'),
  'flame-scout': makeSinglePose('/sprites/battle/enemies/Hobgoblin.gif'),
  'mars-wolf': makeSinglePose('/sprites/battle/enemies/Dire_Wolf.gif'),
  'frost-scout': makeSinglePose('/sprites/battle/enemies/Mini-Goblin.gif'),
  'mercury-wolf': makeSinglePose('/sprites/battle/enemies/Wolfkin.gif'),
  'gale-scout': makeSinglePose('/sprites/battle/enemies/Alec_Goblin.gif'),
  'jupiter-wolf': makeSinglePose('/sprites/battle/enemies/Wolfkin_Cub.gif'),

  // Existing misc mappings
  'mercury-slime': makeSinglePose('/sprites/battle/enemies/Slime.gif'),
  'mars-bandit': makeSinglePose('/sprites/battle/enemies/Brigand.gif'),
  'jupiter-sprite': makeSinglePose('/sprites/battle/enemies/Pixie.gif'),
};

export const EARLY_GAME_ENEMY_IDS = collectEarlyEnemyIds();
export const EARLY_HOUSE_THRESHOLD = EARLY_HOUSE_MAX;

/**
 * Resolve a player unit battle sprite.
 */
export function getPlayerBattleSprite(unitId: string, state: BattleSpriteState): string | null {
  const spriteMap = PLAYER_SPRITES[unitId];
  if (!spriteMap) {
    return null;
  }
  return spriteMap[state] ?? null;
}

/**
 * Resolve an enemy battle sprite.
 */
export function getEnemyBattleSprite(enemyId: string, state: BattleSpriteState): string | null {
  const spriteMap = ENEMY_SPRITES[enemyId];
  if (!spriteMap) {
    return null;
  }
  return spriteMap[state] ?? null;
}

/**
 * Inspectable ids for tests / tooling.
 */
export const KNOWN_PLAYER_BATTLE_UNITS = Object.keys(PLAYER_SPRITES);
export const KNOWN_ENEMY_BATTLE_UNITS = Object.keys(ENEMY_SPRITES);
