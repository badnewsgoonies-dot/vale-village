/**
 * Overworld Sprite Mapping
 * Maps overworld entities (player, NPCs, scenery) to sprite IDs
 */

/**
 * Player character directions
 */
export type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * Maps tile types to sprite IDs (or fallback to CSS for now)
 * Note: Basic terrain tiles (grass, path, water) use CSS colors for now
 * Can be upgraded with proper tile sprites in future phase
 */
export const TILE_SPRITE_MAP: Record<string, string | null> = {
  // Basic terrain - using CSS colors for now (null = use CSS)
  'grass': null,
  'path': null,
  'water': null,
  'wall': null,

  // Special tiles with sprites
  'door': 'door2',  // From scenery/outdoor
  'chest': 'chest',  // From scenery
  'trigger': null,  // Hidden/transparent
  'npc': null,  // NPCs rendered separately
};

/**
 * Maps player unit IDs to their base sprite names
 */
export const PLAYER_UNIT_TO_SPRITE: Record<string, string> = {
  // Main party - matches unit definitions
  'adept': 'Isaac',        // Isaac (Venus Adept)
  'war-mage': 'Garet',     // Garet (Mars Warrior)
  'mystic': 'Mia',         // Mia (Mercury Healer)
  'ranger': 'Ivan',        // Ivan (Jupiter Mage)
  'sentinel': 'Felix',     // Felix (Venus Adept)
  'stormcaller': 'Jenna',  // Jenna (Mars Mage)

  // Test units
  'test-warrior-1': 'Isaac',
  'test-warrior-2': 'Garet',
  'test-warrior-3': 'Mia',
  'test-warrior-4': 'Ivan',
};

/**
 * Maps direction + player sprite name to actual sprite ID
 *
 * Available protagonist sprites from catalog:
 * - Isaac, Isaac_Back, Isaac_E, Isaac_NE, Isaac_Run, etc.
 * - Garet, Garet_Back, Garet_E, Garet_NE, Garet_Run, etc.
 * - All 8 protagonists: Isaac, Felix, Garet, Jenna, Ivan, Mia, Sheba, Piers
 */
export function getPlayerSprite(unitId: string, direction: Direction): string {
  const baseName = PLAYER_UNIT_TO_SPRITE[unitId] || 'Isaac';

  // Map direction to sprite suffix
  // Note: Golden Sun sprites use: default (front/down), _Back (up), _E (east/right)
  // For left, we can mirror the east sprite in CSS or use default
  switch (direction) {
    case 'up':
      return `${baseName}_Back`;
    case 'down':
      return baseName;  // Default facing is down/front
    case 'right':
      return `${baseName}_E`;
    case 'left':
      return `${baseName}_E`;  // Will be CSS-flipped in component
    default:
      return baseName;
  }
}

/**
 * Maps NPC types/roles to sprite IDs
 *
 * Available NPC categories:
 * - majornpcs/: Story NPCs (Saturos, Menardi, Kraden, etc.)
 * - minornpcs/: Villagers, guards, merchants (50+ variants)
 * - minornpcs_2/: Additional villager variety
 */
export const NPC_SPRITE_MAP: Record<string, string> = {
  // Major Story NPCs
  'saturos': 'saturos',
  'menardi': 'menardi',
  'agatio': 'agatio',
  'karst': 'karst',
  'alex': 'alex',
  'kraden': 'kraden',
  'babi': 'babi',

  // Generic NPC types (will map to specific villager sprites)
  'villager': 'villager',
  'villager-male': 'male-villager',
  'villager-female': 'female-villager',
  'elder': 'elder',
  'merchant': 'merchant',
  'guard': 'guard',
  'blacksmith': 'blacksmith',

  // Fallback
  'default': 'villager',
};

/**
 * Get NPC sprite ID with fallback
 * Handles actual NPC IDs from map data (elder-vale, shopkeeper-weapons, villager-1, etc.)
 */
export function getNPCSprite(npcId: string): string {
  // Handle specific NPC types
  if (npcId.includes('elder')) return 'elder';
  if (npcId.includes('shopkeeper')) return 'merchant';
  if (npcId.includes('guard')) return 'guard';
  if (npcId.includes('blacksmith')) return 'blacksmith';

  // Handle villagers with variety (villager-1, villager-2, etc.)
  if (npcId.includes('villager')) {
    const match = npcId.match(/villager-(\d+)/);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      // Alternate between male/female villagers for variety
      return num % 2 === 0 ? 'female-villager' : 'male-villager';
    }
    return 'villager';
  }

  // Fallback to mapping table
  return NPC_SPRITE_MAP[npcId] ?? NPC_SPRITE_MAP['default'] ?? 'villager';
}

/**
 * Maps scenery object types to sprite IDs
 */
export const SCENERY_SPRITE_MAP: Record<string, string> = {
  'chest': 'chest',
  'chest-open': 'chest_open',
  'door': 'door2',
  'sign': 'sign',
  'sign-weapon-shop': 'WepShop_Sign',
  'sign-potion-shop': 'PotionShop_Sign',
  'barrel': 'barrel1',
  'crate': 'box4',
  'stump': 'stump1',
  'stone': 'stone3',
  'fence': 'Fence_HorizSeg',
};

/**
 * Get scenery sprite ID with fallback
 */
export function getScenerySprite(sceneryType: string): string | null {
  return SCENERY_SPRITE_MAP[sceneryType] || null;
}

/**
 * Helper: Check if a direction requires sprite mirroring
 */
export function shouldMirrorSprite(direction: Direction): boolean {
  return direction === 'left';
}

/**
 * Tile type definitions (matches mapSchema.ts)
 */
export type TileType = 'grass' | 'path' | 'water' | 'wall' | 'door' | 'npc' | 'trigger';

/**
 * Get tile sprite ID (null means use CSS color fallback)
 */
export function getTileSprite(tileType: TileType): string | null {
  return TILE_SPRITE_MAP[tileType] || null;
}
