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
const PROTAGONIST_BASE_PATH = '/sprites/overworld/protagonists';
const MAJOR_NPC_BASE_PATH = '/sprites/overworld/majornpcs';

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

interface ProtagonistPoseConfig {
  front: string;
  back: string;
  side: string;
}

const ISAAC_POSE: ProtagonistPoseConfig = { front: 'Isaac.gif', back: 'Isaac_Back.gif', side: 'Isaac_Right.gif' };

const PROTAGONIST_POSES: Record<string, ProtagonistPoseConfig> = {
  Isaac: ISAAC_POSE,
  Garet: { front: 'Garet.gif', back: 'Garet_Back.gif', side: 'Garet_Right.gif' },
  Mia: { front: 'Mia.gif', back: 'Mia_Back.gif', side: 'Mia_Right.gif' },
  Ivan: { front: 'Ivan.gif', back: 'Ivan_Back.gif', side: 'Ivan_Right.gif' },
  Felix: { front: 'Felix.gif', back: 'Felix_Back.gif', side: 'Felix_E.gif' },
  Jenna: { front: 'Jenna.gif', back: 'Jenna_Back.gif', side: 'Jenna_Right.gif' },
};

const DEFAULT_POSE = ISAAC_POSE;

function protagonistPath(file: string): string {
  return `${PROTAGONIST_BASE_PATH}/${file}`;
}

function getPoseConfig(baseName: string): ProtagonistPoseConfig {
  return PROTAGONIST_POSES[baseName] ?? DEFAULT_POSE;
}

export function getPlayerSprite(unitId: string, direction: Direction): string {
  const baseName = PLAYER_UNIT_TO_SPRITE[unitId] || 'Isaac';
  const poseConfig = getPoseConfig(baseName);

  const poseFile = (() => {
    switch (direction) {
      case 'up':
        return poseConfig.back;
      case 'down':
        return poseConfig.front;
      case 'right':
      case 'left':
        return poseConfig.side;
      default:
        return poseConfig.front;
    }
  })();

  return protagonistPath(poseFile);
}

/**
 * Maps NPC types/roles to sprite IDs
 *
 * Available NPC categories:
 * - majornpcs/: Story NPCs (Saturos, Menardi, Kraden, etc.)
 * - minornpcs/: Villagers, guards, merchants (50+ variants)
 * - minornpcs_2/: Additional villager variety
 */
const NPC_ROLE_TO_FILE = {
  elder: 'Elder.gif',
  merchant: 'Weaponshop_Owner.gif',
  shopkeeper: 'Weaponshop_Keeper.gif',
  villagerMale: 'Mr_Jerra.gif',
  villagerFemale: 'Mrs_Jerra.gif',
  guard: 'Thief1.gif',
  enemy: 'Thief1.gif',
  default: 'Innkeeper.gif',
} as const;

const SPECIFIC_NPC_TO_FILE: Record<string, string> = {
  'elder-vale': NPC_ROLE_TO_FILE.elder,
  'shopkeeper-weapons': NPC_ROLE_TO_FILE.shopkeeper,
  'tower-attendant': NPC_ROLE_TO_FILE.elder,
};

function npcPath(file: string): string {
  return `${MAJOR_NPC_BASE_PATH}/${file}`;
}

/**
 * Get NPC sprite ID with fallback
 * Handles actual NPC IDs from map data (elder-vale, shopkeeper-weapons, villager-1, etc.)
 */
export function getNPCSprite(npcId: string): string {
  const specificFile = SPECIFIC_NPC_TO_FILE[npcId];
  if (specificFile) {
    return npcPath(specificFile);
  }

  if (/house-\d+-enemy/.test(npcId)) {
    return npcPath(NPC_ROLE_TO_FILE.enemy);
  }

  if (npcId.includes('elder')) {
    return npcPath(NPC_ROLE_TO_FILE.elder);
  }

  if (npcId.includes('shopkeeper') || npcId.includes('merchant')) {
    return npcPath(NPC_ROLE_TO_FILE.merchant);
  }

  if (npcId.includes('blacksmith')) {
    return npcPath(NPC_ROLE_TO_FILE.shopkeeper);
  }

  if (npcId.includes('guard')) {
    return npcPath(NPC_ROLE_TO_FILE.guard);
  }

  // Handle villagers with variety (villager-1, villager-2, etc.)
  if (npcId.includes('villager')) {
    const match = npcId.match(/villager-(\d+)/);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      const villagerFile = num % 2 === 0
        ? NPC_ROLE_TO_FILE.villagerFemale
        : NPC_ROLE_TO_FILE.villagerMale;
      return npcPath(villagerFile);
    }
    return npcPath(NPC_ROLE_TO_FILE.villagerMale);
  }

  return npcPath(NPC_ROLE_TO_FILE.default);
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
