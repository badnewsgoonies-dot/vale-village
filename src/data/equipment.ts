<<<<<<< HEAD
import type { Equipment } from '@/types/Equipment';

/**
 * Equipment items from GAME_MECHANICS.md Section 3
 */

// ========== WEAPONS ==========
export const WOODEN_SWORD: Equipment = {
  id: 'wooden-sword',
  name: 'Wooden Sword',
  slot: 'weapon',
  tier: 'basic',
  cost: 50,
  statBonus: { atk: 5 },
};

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
export const LEATHER_VEST: Equipment = {
  id: 'leather-vest',
  name: 'Leather Vest',
  slot: 'armor',
  tier: 'basic',
  cost: 80,
  statBonus: { def: 6, hp: 10 },
};

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

export const DRAGON_SCALES: Equipment = {
  id: 'dragon-scales',
  name: 'Dragon Scales',
  slot: 'armor',
  tier: 'legendary',
  cost: 4000,
  statBonus: { def: 35, hp: 60 },
  elementalResist: 0.2, // 20% reduction to elemental damage
};

// ========== HELMS ==========
export const CLOTH_CAP: Equipment = {
  id: 'cloth-cap',
  name: 'Cloth Cap',
  slot: 'helm',
  tier: 'basic',
  cost: 60,
  statBonus: { def: 4 },
};

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

export const ORACLES_CROWN: Equipment = {
  id: 'oracles-crown',
  name: "Oracle's Crown",
  slot: 'helm',
  tier: 'legendary',
  cost: 3500,
  statBonus: { def: 25, mag: 10, pp: 15 },
};

// ========== BOOTS ==========
export const LEATHER_BOOTS: Equipment = {
  id: 'leather-boots',
  name: 'Leather Boots',
  slot: 'boots',
  tier: 'basic',
  cost: 70,
  statBonus: { spd: 2 },
};

export const IRON_BOOTS: Equipment = {
  id: 'iron-boots',
  name: 'Iron Boots',
  slot: 'boots',
  tier: 'iron',
  cost: 100,
  statBonus: { spd: 3 },
};

export const HYPER_BOOTS: Equipment = {
  id: 'hyper-boots',
  name: 'Hyper Boots',
  slot: 'boots',
  tier: 'steel',
  cost: 750,
  statBonus: { spd: 8 },
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
  // Weapons
  'wooden-sword': WOODEN_SWORD,
  'iron-sword': IRON_SWORD,
  'steel-sword': STEEL_SWORD,
  'sol-blade': SOL_BLADE,
  // Armor
  'leather-vest': LEATHER_VEST,
  'iron-armor': IRON_ARMOR,
  'steel-armor': STEEL_ARMOR,
  'dragon-scales': DRAGON_SCALES,
  // Helms
  'cloth-cap': CLOTH_CAP,
  'iron-helm': IRON_HELM,
  'steel-helm': STEEL_HELM,
  'oracles-crown': ORACLES_CROWN,
  // Boots
  'leather-boots': LEATHER_BOOTS,
  'iron-boots': IRON_BOOTS,
  'hyper-boots': HYPER_BOOTS,
  'hermes-sandals': HERMES_SANDALS,
};
=======
import type { Equipment } from '@/types/Equipment';

/**
 * Equipment items from GAME_MECHANICS.md Section 3
 */

// ========== WEAPONS ==========
export const WOODEN_SWORD: Equipment = {
  id: 'wooden-sword',
  name: 'Wooden Sword',
  slot: 'weapon',
  tier: 'basic',
  cost: 50,
  statBonus: { atk: 5 },
};

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
export const LEATHER_VEST: Equipment = {
  id: 'leather-vest',
  name: 'Leather Vest',
  slot: 'armor',
  tier: 'basic',
  cost: 80,
  statBonus: { def: 6, hp: 10 },
};

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

export const DRAGON_SCALES: Equipment = {
  id: 'dragon-scales',
  name: 'Dragon Scales',
  slot: 'armor',
  tier: 'legendary',
  cost: 4000,
  statBonus: { def: 35, hp: 60 },
  elementalResist: 0.2, // 20% reduction to elemental damage
};

// ========== HELMS ==========
export const CLOTH_CAP: Equipment = {
  id: 'cloth-cap',
  name: 'Cloth Cap',
  slot: 'helm',
  tier: 'basic',
  cost: 60,
  statBonus: { def: 4 },
};

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

export const ORACLES_CROWN: Equipment = {
  id: 'oracles-crown',
  name: "Oracle's Crown",
  slot: 'helm',
  tier: 'legendary',
  cost: 3500,
  statBonus: { def: 25, mag: 10, pp: 15 },
};

// ========== BOOTS ==========
export const LEATHER_BOOTS: Equipment = {
  id: 'leather-boots',
  name: 'Leather Boots',
  slot: 'boots',
  tier: 'basic',
  cost: 70,
  statBonus: { spd: 2 },
};

export const IRON_BOOTS: Equipment = {
  id: 'iron-boots',
  name: 'Iron Boots',
  slot: 'boots',
  tier: 'iron',
  cost: 100,
  statBonus: { spd: 3 },
};

export const HYPER_BOOTS: Equipment = {
  id: 'hyper-boots',
  name: 'Hyper Boots',
  slot: 'boots',
  tier: 'steel',
  cost: 750,
  statBonus: { spd: 8 },
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
  // Weapons
  'wooden-sword': WOODEN_SWORD,
  'iron-sword': IRON_SWORD,
  'steel-sword': STEEL_SWORD,
  'sol-blade': SOL_BLADE,
  // Armor
  'leather-vest': LEATHER_VEST,
  'iron-armor': IRON_ARMOR,
  'steel-armor': STEEL_ARMOR,
  'dragon-scales': DRAGON_SCALES,
  // Helms
  'cloth-cap': CLOTH_CAP,
  'iron-helm': IRON_HELM,
  'steel-helm': STEEL_HELM,
  'oracles-crown': ORACLES_CROWN,
  // Boots
  'leather-boots': LEATHER_BOOTS,
  'iron-boots': IRON_BOOTS,
  'hyper-boots': HYPER_BOOTS,
  'hermes-sandals': HERMES_SANDALS,
};
>>>>>>> da011dae5a42c00b1fdb0e0f62b8f00e0a566dcf
