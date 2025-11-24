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
  // Canonical roster - Starter Party (with battle sprites)
  'adept': makePlayerSpritePaths('Isaac', 'lBlade'),
  'war-mage': makePlayerSpritePaths('Garet', 'Axe'),
  'mystic': makePlayerSpritePaths('Mia', 'Staff'),
  'ranger': makePlayerSpritePaths('Ivan', 'Staff'),

  // Recruitable units (using starter party sprites as placeholders until battle sprites are available)
  'blaze': makePlayerSpritePaths('Garet', 'Mace'),          // Mars - uses Garet
  'felix': makePlayerSpritePaths('Isaac', 'lSword'),        // Venus - uses Isaac
  'karis': makePlayerSpritePaths('Ivan', 'Staff'),          // Jupiter - uses Ivan
  'sentinel': makePlayerSpritePaths('Isaac', 'Axe'),        // Venus - uses Isaac
  'stormcaller': makePlayerSpritePaths('Mia', 'Staff'),     // Jupiter - uses Mia (Ivan lacks varied weapons)
  'tyrell': makePlayerSpritePaths('Garet', 'lSword'),       // Mars - uses Garet
  'tower-champion': makePlayerSpritePaths('Isaac', 'Mace'), // Venus - uses Isaac

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
  'sentinel-enemy': makeSinglePose('/sprites/battle/enemies/Skeleton.gif'),
  'stormcaller-enemy': makeSinglePose('/sprites/battle/enemies/Ghost_Mage.gif'),

  // Houses 1-5 (Early game)
  'earth-scout': makeSinglePose('/sprites/battle/enemies/Goblin.gif'),
  'venus-wolf': makeSinglePose('/sprites/battle/enemies/Wild_Wolf.gif'),
  'flame-scout': makeSinglePose('/sprites/battle/enemies/Hobgoblin.gif'),
  'mars-wolf': makeSinglePose('/sprites/battle/enemies/Dire_Wolf.gif'),
  'frost-scout': makeSinglePose('/sprites/battle/enemies/Mini-Goblin.gif'),
  'mercury-wolf': makeSinglePose('/sprites/battle/enemies/Wolfkin.gif'),
  'gale-scout': makeSinglePose('/sprites/battle/enemies/Alec_Goblin.gif'),
  'jupiter-wolf': makeSinglePose('/sprites/battle/enemies/Wolfkin_Cub.gif'),
  'mercury-slime': makeSinglePose('/sprites/battle/enemies/Slime.gif'),
  'mars-bandit': makeSinglePose('/sprites/battle/enemies/Brigand.gif'),
  'jupiter-sprite': makeSinglePose('/sprites/battle/enemies/Pixie.gif'),
  'venus-beetle': makeSinglePose('/sprites/battle/enemies/Doodle_Bug.gif'),

  // Houses 6-10 (Mid game - Animal tier)
  'mars-bear': makeSinglePose('/sprites/battle/enemies/Grizzly.gif'),
  'mercury-bear': makeSinglePose('/sprites/battle/enemies/Mauler.gif'),
  'jupiter-bear': makeSinglePose('/sprites/battle/enemies/Wild_Ape.gif'),
  'venus-bear': makeSinglePose('/sprites/battle/enemies/Ape.gif'),

  // Houses 11-15 (Mid-late game - Soldier tier)
  'terra-soldier': makeSinglePose('/sprites/battle/enemies/Orc.gif'),
  'blaze-soldier': makeSinglePose('/sprites/battle/enemies/Lizard_Fighter.gif'),
  'tide-soldier': makeSinglePose('/sprites/battle/enemies/Merman.gif'),
  'wind-soldier': makeSinglePose('/sprites/battle/enemies/Harpy.gif'),

  // Houses 16-20 (Late game progression)
  'stone-captain': makeSinglePose('/sprites/battle/enemies/Orc_Captain.gif'),
  'inferno-captain': makeSinglePose('/sprites/battle/enemies/Lizard_Man.gif'),
  'glacier-captain': makeSinglePose('/sprites/battle/enemies/Minos_Warrior.gif'),
  'thunder-captain': makeSinglePose('/sprites/battle/enemies/Gryphon.gif'),

  'mountain-commander': makeSinglePose('/sprites/battle/enemies/Living_Armor.gif'),
  'fire-commander': makeSinglePose('/sprites/battle/enemies/Lizard_King.gif'),
  'storm-commander': makeSinglePose('/sprites/battle/enemies/Harridan.gif'),
  'lightning-commander': makeSinglePose('/sprites/battle/enemies/Wild_Gryphon.gif'),

  'granite-warlord': makeSinglePose('/sprites/battle/enemies/Orc_Lord.gif'),
  'volcano-warlord': makeSinglePose('/sprites/battle/enemies/Cruel_Dragon.gif'),
  'blizzard-warlord': makeSinglePose('/sprites/battle/enemies/Minotaurus.gif'),
  'tempest-warlord': makeSinglePose('/sprites/battle/enemies/Wise_Gryphon.gif'),

  // Elemental Bosses
  'rock-elemental': makeSinglePose('/sprites/battle/enemies/Earth_Golem.gif'),
  'flame-elemental': makeSinglePose('/sprites/battle/enemies/Salamander.gif'),
  'ice-elemental': makeSinglePose('/sprites/battle/enemies/Mummy.gif'),
  'storm-elemental': makeSinglePose('/sprites/battle/enemies/Willowisp.gif'),

  // Legendary Beasts
  'basilisk': makeSinglePose('/sprites/battle/enemies/Wyvern.gif'),
  'phoenix': makeSinglePose('/sprites/battle/enemies/Phoenix.gif'),
  'leviathan': makeSinglePose('/sprites/battle/enemies/Turtle_Dragon.gif'),
  'thunderbird': makeSinglePose('/sprites/battle/enemies/Roc.gif'),
  'hydra': makeSinglePose('/sprites/battle/enemies/Hydra.gif'),

  // Sprites (elemental beings)
  'mars-sprite': makeSinglePose('/sprites/battle/enemies/Faery.gif'),
  'mercury-sprite': makeSinglePose('/sprites/battle/enemies/Spirit.gif'),
  'venus-sprite': makeSinglePose('/sprites/battle/enemies/Gnome.gif'),

  // Special encounters
  'chimera': makeSinglePose('/sprites/battle/enemies/Chimera.gif'),
  'overseer': makeSinglePose('/sprites/battle/enemies/Lich.gif'),
  'bandit-minion': makeSinglePose('/sprites/battle/enemies/Ruffian.gif'),
  'bandit-captain': makeSinglePose('/sprites/battle/enemies/Assassin.gif'),
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

