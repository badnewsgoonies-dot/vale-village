/**
 * Unit Sprite Mappings
 * Maps all recruitable units to their sprite assets (overworld, battle, portrait)
 * From ROLE_5_GRAPHICS_INTEGRATION_ONBOARDING.md lines 158-180
 */

export interface UnitSpriteMapping {
  overworld: string;
  battle: string;
  portrait: string;
  weapon: string;
}

/**
 * All 10 recruitable units mapped to Golden Sun character sprites
 */
export const UNIT_SPRITE_MAP: Record<string, UnitSpriteMapping> = {
  // STARTER UNITS (from STARTER_UNITS.md)
  'isaac': {
    overworld: '/sprites/overworld/protagonists/Isaac.gif',
    battle: '/sprites/battle/party/isaac/Isaac_lSword_Front.gif',
    portrait: '/sprites/portraits/isaac.gif',
    weapon: 'lSword',
  },
  'garet': {
    overworld: '/sprites/overworld/protagonists/Garet.gif',
    battle: '/sprites/battle/party/garet/Garet_Axe_Front.gif',
    portrait: '/sprites/portraits/garet.gif',
    weapon: 'Axe',
  },
  'ivan': {
    overworld: '/sprites/overworld/protagonists/Ivan.gif',
    battle: '/sprites/battle/party/ivan/Ivan_Staff_Front.gif',
    portrait: '/sprites/portraits/ivan.gif',
    weapon: 'Staff',
  },
  'mia': {
    overworld: '/sprites/overworld/protagonists/Mia.gif',
    battle: '/sprites/battle/party/mia/Mia_Staff_Front.gif',
    portrait: '/sprites/portraits/mia.gif',
    weapon: 'Staff',
  },

  // RECRUITABLE UNITS (from RECRUITABLE_UNITS_FULL.md)
  'jenna': {
    overworld: '/sprites/overworld/protagonists/Jenna.gif',
    battle: '/sprites/battle/party/jenna/Jenna_Staff_Front.gif',
    portrait: '/sprites/portraits/jenna.gif',
    weapon: 'Staff',
  },
  'felix': {
    overworld: '/sprites/overworld/protagonists/Felix.gif',
    battle: '/sprites/battle/party/felix/Felix_lSword_Front.gif',
    portrait: '/sprites/portraits/felix.gif',
    weapon: 'lSword',
  },
  'sheba': {
    overworld: '/sprites/overworld/protagonists/Sheba.gif',
    battle: '/sprites/battle/party/sheba/Sheba_Staff_Front.gif',
    portrait: '/sprites/portraits/sheba.gif',
    weapon: 'Staff',
  },
  'piers': {
    overworld: '/sprites/overworld/protagonists/Piers.gif',
    battle: '/sprites/battle/party/piers/Piers_Staff_Front.gif',
    portrait: '/sprites/portraits/piers.gif',
    weapon: 'Staff',
  },
  'kraden': {
    overworld: '/sprites/overworld/protagonists/Kraden.gif',
    battle: '/sprites/battle/party/kraden/Kraden_Staff_Front.gif',
    portrait: '/sprites/portraits/kraden.gif',
    weapon: 'Staff',
  },
  'saturos': {
    overworld: '/sprites/overworld/protagonists/Saturos.gif',
    battle: '/sprites/battle/party/saturos/Saturos_Sword_Front.gif',
    portrait: '/sprites/portraits/saturos.gif',
    weapon: 'Sword',
  },
};

/**
 * Djinn Sprite Mappings
 * Maps all 12 Djinn to their sprite assets
 * From ROLE_5_GRAPHICS_INTEGRATION_ONBOARDING.md lines 182-192
 */

export interface DjinnSpriteMapping {
  sprite: string;
  element: 'Venus' | 'Mars' | 'Mercury' | 'Jupiter';
}

/**
 * All 12 Djinn mapped to Golden Sun Djinn sprites
 */
export const DJINN_SPRITE_MAP: Record<string, DjinnSpriteMapping> = {
  // VENUS (EARTH) DJINN
  'flint': {
    sprite: '/sprites/battle/djinn/Venus_Djinn_Front.gif',
    element: 'Venus',
  },
  'granite': {
    sprite: '/sprites/battle/djinn/Venus_Djinn_Front.gif',
    element: 'Venus',
  },
  'bane': {
    sprite: '/sprites/battle/djinn/Venus_Djinn_Front.gif',
    element: 'Venus',
  },

  // MARS (FIRE) DJINN
  'forge': {
    sprite: '/sprites/battle/djinn/Mars_Djinn_Front.gif',
    element: 'Mars',
  },
  'corona': {
    sprite: '/sprites/battle/djinn/Mars_Djinn_Front.gif',
    element: 'Mars',
  },
  'fury': {
    sprite: '/sprites/battle/djinn/Mars_Djinn_Front.gif',
    element: 'Mars',
  },

  // MERCURY (WATER) DJINN
  'fizz': {
    sprite: '/sprites/battle/djinn/Mercury_Djinn_Front.gif',
    element: 'Mercury',
  },
  'tonic': {
    sprite: '/sprites/battle/djinn/Mercury_Djinn_Front.gif',
    element: 'Mercury',
  },
  'crystal': {
    sprite: '/sprites/battle/djinn/Mercury_Djinn_Front.gif',
    element: 'Mercury',
  },

  // JUPITER (WIND) DJINN
  'breeze': {
    sprite: '/sprites/battle/djinn/Jupiter_Djinn_Front.gif',
    element: 'Jupiter',
  },
  'squall': {
    sprite: '/sprites/battle/djinn/Jupiter_Djinn_Front.gif',
    element: 'Jupiter',
  },
  'storm': {
    sprite: '/sprites/battle/djinn/Jupiter_Djinn_Front.gif',
    element: 'Jupiter',
  },
};

/**
 * Get battle sprite path for a unit with specific weapon and animation
 */
export function getUnitBattleSprite(
  unitId: string,
  weapon?: string,
  animation: string = 'Front'
): string {
  const mapping = UNIT_SPRITE_MAP[unitId];
  if (!mapping) {
    return '/sprites/battle/party/isaac/Isaac_lSword_Front.gif'; // Fallback
  }

  const weaponType = weapon || mapping.weapon;
  const basePath = mapping.battle.split('/').slice(0, -1).join('/');
  const unitName = unitId.charAt(0).toUpperCase() + unitId.slice(1);

  return `${basePath}/${unitName}_${weaponType}_${animation}.gif`;
}

/**
 * Get Djinn sprite path by Djinn ID
 */
export function getDjinnSprite(djinnId: string): string {
  const mapping = DJINN_SPRITE_MAP[djinnId];
  if (!mapping) {
    return '/sprites/battle/djinn/Venus_Djinn_Front.gif'; // Fallback
  }

  return mapping.sprite;
}

/**
 * Get overworld sprite path by unit ID
 */
export function getUnitOverworldSprite(unitId: string): string {
  const mapping = UNIT_SPRITE_MAP[unitId];
  if (!mapping) {
    return '/sprites/overworld/protagonists/Isaac.gif'; // Fallback
  }

  return mapping.overworld;
}

/**
 * Get portrait sprite path by unit ID
 */
export function getUnitPortrait(unitId: string): string {
  const mapping = UNIT_SPRITE_MAP[unitId];
  if (!mapping) {
    return '/sprites/portraits/isaac.gif'; // Fallback
  }

  return mapping.portrait;
}
