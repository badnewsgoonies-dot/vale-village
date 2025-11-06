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
  if (name.includes('glove')) return 'gloves';
  if (name.includes('ring')) return 'rings';
  if (name.includes('bracelet')) return 'bracelets';

  // Fallback
  return 'items';
}

/**
 * Convert equipment name to filename
 * "Gaia Blade" → "Gaia_Blade.gif"
 */
export function getEquipmentIconFilename(equipment: Equipment): string {
  return equipment.name.replace(/ /g, '_') + '.gif';
}
