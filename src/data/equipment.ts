import type { Equipment } from '@/types/Equipment';

/**
 * Equipment items from GAME_MECHANICS.md Section 3
 */

// ========== WEAPONS ==========
export const IRON_SWORD: Equipment = {
  id: 'iron-sword',
  name: 'Iron Sword',
  slot: 'weapon',
  tier: 'iron',
  cost: 200,
  statBonus: { atk: 12 },
};

export const STEEL_SWORD: Equipment = {
  id: 'steel-sword',
  name: 'Steel Sword',
  slot: 'weapon',
  tier: 'steel',
  cost: 500,
  statBonus: { atk: 20 },
};

export const SOL_BLADE: Equipment = {
  id: 'sol-blade',
  name: 'Sol Blade',
  slot: 'weapon',
  tier: 'legendary',
  cost: 10000,
  statBonus: { atk: 30 },
  unlocksAbility: 'megiddo',
};

// ========== ARMOR ==========
export const IRON_ARMOR: Equipment = {
  id: 'iron-armor',
  name: 'Iron Armor',
  slot: 'armor',
  tier: 'iron',
  cost: 300,
  statBonus: { def: 10, hp: 20 },
};

export const STEEL_ARMOR: Equipment = {
  id: 'steel-armor',
  name: 'Steel Armor',
  slot: 'armor',
  tier: 'steel',
  cost: 700,
  statBonus: { def: 18, hp: 40 },
};

// ========== HELMS ==========
export const IRON_HELM: Equipment = {
  id: 'iron-helm',
  name: 'Iron Helm',
  slot: 'helm',
  tier: 'iron',
  cost: 150,
  statBonus: { def: 5 },
};

export const STEEL_HELM: Equipment = {
  id: 'steel-helm',
  name: 'Steel Helm',
  slot: 'helm',
  tier: 'steel',
  cost: 400,
  statBonus: { def: 10 },
};

// ========== BOOTS ==========
export const IRON_BOOTS: Equipment = {
  id: 'iron-boots',
  name: 'Iron Boots',
  slot: 'boots',
  tier: 'iron',
  cost: 100,
  statBonus: { spd: 3 },
};

export const HERMES_SANDALS: Equipment = {
  id: 'hermes-sandals',
  name: "Hermes' Sandals",
  slot: 'boots',
  tier: 'legendary',
  cost: 5000,
  statBonus: { spd: 10 },
  alwaysFirstTurn: true,
};

/**
 * All equipment indexed by ID
 */
export const EQUIPMENT: Record<string, Equipment> = {
  'iron-sword': IRON_SWORD,
  'steel-sword': STEEL_SWORD,
  'sol-blade': SOL_BLADE,
  'iron-armor': IRON_ARMOR,
  'steel-armor': STEEL_ARMOR,
  'iron-helm': IRON_HELM,
  'steel-helm': STEEL_HELM,
  'iron-boots': IRON_BOOTS,
  'hermes-sandals': HERMES_SANDALS,
};
