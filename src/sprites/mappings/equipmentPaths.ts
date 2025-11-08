import type { Equipment } from '../../types/Equipment';

/**
 * Map equipment to icon subdirectory
 * Equipment icons are organized like: /sprites/icons/items/{category}/{name}.gif
 */
export function getEquipmentIconCategory(equipment: Equipment): string {
  const slot = equipment.slot;
  const name = equipment.name.toLowerCase();

  // Weapons
  if (slot === 'weapon') {
    if (name.includes('axe')) return 'axes';

    if (name.includes('blade') || name.includes('dagger') || name.includes('knife')) {
      return 'light-blades';
    }

    if (name.includes('sword') || name.includes('claymore') || name.includes('katana')) {
      return 'long-swords';
    }

    if (name.includes('mace') || name.includes('hammer') || name.includes('club')) {
      return 'maces';
    }

    if (name.includes('staff') || name.includes('rod') || name.includes('wand')) {
      return 'staves';
    }
  }

  // Armor
  if (slot === 'armor') {
    if (name.includes('robe')) return 'robes';
    if (name.includes('vest') || name.includes('mail') || name.includes('armor')) {
      return 'armor';
    }
    return 'clothing';
  }

  // Helm
  if (slot === 'helm') {
    if (name.includes('circlet')) return 'circlets';
    if (name.includes('crown')) return 'crowns';
    if (name.includes('helm')) return 'helmets';
    return 'hats';
  }

  // Accessories
  if (slot === 'boots') return 'boots';
  if (slot === 'accessory') {
    if (name.includes('glove')) return 'gloves';
    if (name.includes('ring')) return 'rings';
    if (name.includes('bracelet')) return 'bracelets';
    if (name.includes('shield')) return 'shields';
    if (name.includes('robe') || name.includes('vest')) return 'clothing';
  }

  // Fallback
  return 'items';
}

/**
 * Sprite name mappings for equipment that doesn't have exact sprite matches
 * Maps our equipment names to actual sprite filenames (without .gif extension)
 */
const EQUIPMENT_SPRITE_MAPPINGS: Record<string, string> = {
  // Swords
  'Wooden Sword': 'Long_Sword',
  'Bronze Sword': 'Broad_Sword',
  'Iron Sword': 'Great_Sword',
  'Steel Sword': 'Claymore',

  // Axes
  'Wooden Axe': 'Broad_Axe',
  'Great Axe': 'Giant_Axe',
  "Titan's Axe": 'Stellar_Axe',

  // Staves
  'Wooden Staff': 'Wooden_Stick',
  'Shaman Rod': 'Shamans_Rod',
  'Zodiac Wand': 'Nebula_Wand',

  // Armor (Cotton Shirt and Leather Cap have exact matches!)
  'Leather Vest': 'Full_Metal_Vest',
  'Bronze Armor': 'Chain_Mail',
  'Iron Armor': 'Plate_Mail',
  'Mythril Armor': 'Dragon_Mail',

  // Helms (Leather Cap has exact match in hats!)
  'Cloth Cap': 'Wooden_Cap',
  // Bronze_Helm, Iron_Helm, Steel_Helm have exact matches in helmets!
  'Mythril Crown': 'Mythril_Helm',
  "Oracle's Crown": 'Thunder_Crown',
  'Glory Helm': 'Gloria_Helm',

  // Boots (Leather_Boots, Hyper_Boots, Quick_Boots have exact matches!)
  'Iron Boots': 'Fur_Boots',
  'Steel Greaves': 'Knights_Greave',
  'Silver Greaves': 'Silver_Greave',
  "Hermes' Sandals": 'Ninja_Sandals',

  // Accessories (Guardian_Ring, War_Gloves, Spirit_Gloves have exact matches!)
  'Power Ring': 'War_Ring',
  "Adept's Ring": 'Adept_Ring',
  'Lucky Medal': 'Golden_Ring',
  'Elemental Star': 'Stardust_Ring',
  "Dragon's Eye": 'Rainbow_Ring',
  'Cleric Ring': 'Clerics_Ring',
  'Iris Robe': 'Faery_Vest',
  // Cosmos_Shield has exact match!
};

/**
 * Convert equipment name to filename
 * "Gaia Blade" → "Gaia_Blade.gif"
 * Uses sprite mappings for equipment without exact matches
 */
export function getEquipmentIconFilename(equipment: Equipment): string {
  // Check if there's a custom mapping
  if (EQUIPMENT_SPRITE_MAPPINGS[equipment.name]) {
    return EQUIPMENT_SPRITE_MAPPINGS[equipment.name] + '.gif';
  }

  // Default: convert name to filename
  return equipment.name.replace(/ /g, '_') + '.gif';
}
