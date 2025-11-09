import type { WeaponType, UnitSpriteMapping } from '../types';
import type { Equipment } from '../../types/Equipment';

export const UNIT_SPRITE_MAPPING: Record<string, UnitSpriteMapping> = {
  'isaac': {
    folder: 'isaac',
    weapons: ['Axe', 'lBlade', 'lSword', 'Mace'],
    animations: 12
  },
  'garet': {
    folder: 'garet',
    weapons: ['Axe', 'lSword', 'Mace'],
    animations: 12
  },
  'ivan': {
    folder: 'ivan',
    weapons: ['lBlade', 'Staff'],
    animations: 12
  },
  'mia': {
    folder: 'mia',
    weapons: ['Mace', 'Staff'],
    animations: 12
  },
  'felix': {
    folder: 'felix',
    weapons: ['Axe', 'lBlade', 'lSword', 'Mace'],
    animations: 12
  },
  'jenna': {
    folder: 'jenna',
    weapons: ['lBlade', 'Staff'], // GS2 also has Ankh but it's not used in GS1
    animations: 7, // Only back-facing animations (Back, Attack1/2, CastBack1/2, HitBack, DownedBack)
    fallback: 'jenna_gs2' // CRITICAL: Use GS2 for all front-facing animations (Front, CastFront1/2, HitFront, DownedFront)
  },
  'sheba': {
    folder: 'sheba',
    weapons: ['Ankh', 'Mace', 'Staff'],
    animations: 12
  },
  'piers': {
    folder: 'piers',
    weapons: ['lSword', 'Mace'],
    animations: 12
  }
};

/**
 * Normalize weapon names from Equipment to sprite WeaponType
 * Equipment names: "Gaia Blade", "Battle Axe", "Blessed Mace"
 * Sprite names: "lBlade", "Axe", "Mace"
 */
export function normalizeWeaponType(equipment: Equipment | null): WeaponType {
  if (!equipment) return 'lSword'; // Default weapon

  const name = equipment.name.toLowerCase();

  // Axes
  if (name.includes('axe')) return 'Axe';

  // Light Blades (daggers, short swords, etc.)
  if (name.includes('blade') || name.includes('dagger') || name.includes('knife')) {
    return 'lBlade';
  }

  // Long Swords (broadswords, claymores, etc.)
  if (name.includes('sword') || name.includes('claymore') || name.includes('katana')) {
    return 'lSword';
  }

  // Maces (hammers, clubs)
  if (name.includes('mace') || name.includes('hammer') || name.includes('club')) {
    return 'Mace';
  }

  // Staves (rods, wands)
  if (name.includes('staff') || name.includes('rod') || name.includes('wand')) {
    return 'Staff';
  }

  // Ankh (special weapon type)
  if (name.includes('ankh')) return 'Ankh';

  // Default fallback
  return 'lSword';
}
