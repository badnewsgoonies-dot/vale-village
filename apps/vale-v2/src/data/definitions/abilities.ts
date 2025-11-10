/**
 * Ability definitions
 * These will be validated against AbilitySchema at startup
 */
import type { Ability } from '@/data/schemas/AbilitySchema';

// Physical attacks
export const SLASH: Ability = {
  id: 'slash',
  name: 'Slash',
  type: 'physical',
  manaCost: 0,
  basePower: 0, // Uses unit's ATK
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Basic physical attack',
};

export const CLEAVE: Ability = {
  id: 'cleave',
  name: 'Cleave',
  type: 'physical',
  manaCost: 0,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Powerful physical strike',
};

// Venus (Earth) abilities
export const QUAKE: Ability = {
  id: 'quake',
  name: 'Quake',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 1,
  basePower: 30,
  targets: 'all-enemies',
  unlockLevel: 2,
  description: 'Earth elemental attack hitting all enemies',
};

// Export all abilities
export const ABILITIES: Record<string, Ability> = {
  slash: SLASH,
  cleave: CLEAVE,
  quake: QUAKE,
};

