/**
 * Comprehensive Equipment System
 * Based on Golden Sun progression: basic → bronze → iron → steel → silver → mythril → legendary → artifact
 * 
 * Migrated from v1 codebase - all 58 equipment items
 */
import type { Equipment } from '../schemas/EquipmentSchema';

// ========================================
// WEAPONS - SWORDS
// ========================================
export const WOODEN_SWORD: Equipment = {
  id: 'wooden-sword',
  name: 'Wooden Sword',
  slot: 'weapon',
  tier: 'basic',
  cost: 50,
  statBonus: { atk: 5 },
};

export const BRONZE_SWORD: Equipment = {
  id: 'bronze-sword',
  name: 'Bronze Sword',
  slot: 'weapon',
  tier: 'bronze',
  cost: 120,
  statBonus: { atk: 9 },
};

export const IRON_SWORD: Equipment = {
  id: 'iron-sword',
  name: 'Iron Sword',
  slot: 'weapon',
  tier: 'iron',
  cost: 200,
  statBonus: { atk: 14 },
};

export const STEEL_SWORD: Equipment = {
  id: 'steel-sword',
  name: 'Steel Sword',
  slot: 'weapon',
  tier: 'steel',
  cost: 500,
  statBonus: { atk: 22 },
};

export const SILVER_BLADE: Equipment = {
  id: 'silver-blade',
  name: 'Silver Blade',
  slot: 'weapon',
  tier: 'silver',
  cost: 1200,
  statBonus: { atk: 32 },
};

export const MYTHRIL_BLADE: Equipment = {
  id: 'mythril-blade',
  name: 'Mythril Blade',
  slot: 'weapon',
  tier: 'mythril',
  cost: 3000,
  statBonus: { atk: 45 },
};

export const GAIA_BLADE: Equipment = {
  id: 'gaia-blade',
  name: 'Gaia Blade',
  slot: 'weapon',
  tier: 'legendary',
  cost: 7500,
  statBonus: { atk: 58 },
};

export const SOL_BLADE: Equipment = {
  id: 'sol-blade',
  name: 'Sol Blade',
  slot: 'weapon',
  tier: 'artifact',
  cost: 15000,
  statBonus: { atk: 72 },
  // Note: megiddo ability not yet implemented
};

// ========================================
// WEAPONS - AXES
// ========================================
export const WOODEN_AXE: Equipment = {
  id: 'wooden-axe',
  name: 'Wooden Axe',
  slot: 'weapon',
  tier: 'basic',
  cost: 60,
  statBonus: { atk: 7, spd: -1 },
};

export const BATTLE_AXE: Equipment = {
  id: 'battle-axe',
  name: 'Battle Axe',
  slot: 'weapon',
  tier: 'iron',
  cost: 280,
  statBonus: { atk: 18, spd: -2 },
};

export const GREAT_AXE: Equipment = {
  id: 'great-axe',
  name: 'Great Axe',
  slot: 'weapon',
  tier: 'steel',
  cost: 800,
  statBonus: { atk: 30, spd: -3 },
};

export const TITANS_AXE: Equipment = {
  id: 'titans-axe',
  name: "Titan's Axe",
  slot: 'weapon',
  tier: 'legendary',
  cost: 9000,
  statBonus: { atk: 65, def: 10, spd: -2 },
};

// ========================================
// WEAPONS - MACES
// ========================================
export const MACE: Equipment = {
  id: 'mace',
  name: 'Mace',
  slot: 'weapon',
  tier: 'bronze',
  cost: 150,
  statBonus: { atk: 11, def: 2 },
};

export const HEAVY_MACE: Equipment = {
  id: 'heavy-mace',
  name: 'Heavy Mace',
  slot: 'weapon',
  tier: 'steel',
  cost: 650,
  statBonus: { atk: 26, def: 5 },
};

export const DEMON_MACE: Equipment = {
  id: 'demon-mace',
  name: 'Demon Mace',
  slot: 'weapon',
  tier: 'mythril',
  cost: 3500,
  statBonus: { atk: 48, def: 8 },
};

// ========================================
// WEAPONS - STAVES (for mage characters)
// ========================================
export const WOODEN_STAFF: Equipment = {
  id: 'wooden-staff',
  name: 'Wooden Staff',
  slot: 'weapon',
  tier: 'basic',
  cost: 40,
  statBonus: { atk: 3, mag: 4 },
};

export const MAGIC_ROD: Equipment = {
  id: 'magic-rod',
  name: 'Magic Rod',
  slot: 'weapon',
  tier: 'bronze',
  cost: 180,
  statBonus: { atk: 6, mag: 8 },
};

export const SHAMAN_ROD: Equipment = {
  id: 'shaman-rod',
  name: 'Shaman Rod',
  slot: 'weapon',
  tier: 'iron',
  cost: 400,
  statBonus: { atk: 10, mag: 14 },
};

export const CRYSTAL_ROD: Equipment = {
  id: 'crystal-rod',
  name: 'Crystal Rod',
  slot: 'weapon',
  tier: 'silver',
  cost: 1500,
  statBonus: { atk: 18, mag: 24 },
};

export const ZODIAC_WAND: Equipment = {
  id: 'zodiac-wand',
  name: 'Zodiac Wand',
  slot: 'weapon',
  tier: 'mythril',
  cost: 4000,
  statBonus: { atk: 28, mag: 38 },
};

export const STAFF_OF_AGES: Equipment = {
  id: 'staff-of-ages',
  name: 'Staff of Ages',
  slot: 'weapon',
  tier: 'artifact',
  cost: 18000,
  statBonus: { atk: 42, mag: 58, pp: 25 },
  // Note: odyssey ability not yet implemented
};

// ========================================
// ARMOR
// ========================================
export const COTTON_SHIRT: Equipment = {
  id: 'cotton-shirt',
  name: 'Cotton Shirt',
  slot: 'armor',
  tier: 'basic',
  cost: 30,
  statBonus: { def: 3, hp: 5 },
};

export const LEATHER_VEST: Equipment = {
  id: 'leather-vest',
  name: 'Leather Vest',
  slot: 'armor',
  tier: 'basic',
  cost: 80,
  statBonus: { def: 6, hp: 10 },
};

export const BRONZE_ARMOR: Equipment = {
  id: 'bronze-armor',
  name: 'Bronze Armor',
  slot: 'armor',
  tier: 'bronze',
  cost: 200,
  statBonus: { def: 10, hp: 15 },
};

export const IRON_ARMOR: Equipment = {
  id: 'iron-armor',
  name: 'Iron Armor',
  slot: 'armor',
  tier: 'iron',
  cost: 350,
  statBonus: { def: 15, hp: 25 },
};

export const STEEL_ARMOR: Equipment = {
  id: 'steel-armor',
  name: 'Steel Armor',
  slot: 'armor',
  tier: 'steel',
  cost: 800,
  statBonus: { def: 24, hp: 40 },
};

export const SILVER_ARMOR: Equipment = {
  id: 'silver-armor',
  name: 'Silver Armor',
  slot: 'armor',
  tier: 'silver',
  cost: 2000,
  statBonus: { def: 35, hp: 60 },
};

export const MYTHRIL_ARMOR: Equipment = {
  id: 'mythril-armor',
  name: 'Mythril Armor',
  slot: 'armor',
  tier: 'mythril',
  cost: 5000,
  statBonus: { def: 48, hp: 85 },
};

export const DRAGON_SCALES: Equipment = {
  id: 'dragon-scales',
  name: 'Dragon Scales',
  slot: 'armor',
  tier: 'legendary',
  cost: 10000,
  statBonus: { def: 62, hp: 110 },
  elementalResist: 0.25,
};

export const VALKYRIE_MAIL: Equipment = {
  id: 'valkyrie-mail',
  name: 'Valkyrie Mail',
  slot: 'armor',
  tier: 'artifact',
  cost: 20000,
  statBonus: { def: 78, hp: 140 },
  elementalResist: 0.3,
};

// ========================================
// HELMS
// ========================================
export const LEATHER_CAP: Equipment = {
  id: 'leather-cap',
  name: 'Leather Cap',
  slot: 'helm',
  tier: 'basic',
  cost: 25,
  statBonus: { def: 2 },
};

export const CLOTH_CAP: Equipment = {
  id: 'cloth-cap',
  name: 'Cloth Cap',
  slot: 'helm',
  tier: 'basic',
  cost: 60,
  statBonus: { def: 4 },
};

export const BRONZE_HELM: Equipment = {
  id: 'bronze-helm',
  name: 'Bronze Helm',
  slot: 'helm',
  tier: 'bronze',
  cost: 140,
  statBonus: { def: 6 },
};

export const IRON_HELM: Equipment = {
  id: 'iron-helm',
  name: 'Iron Helm',
  slot: 'helm',
  tier: 'iron',
  cost: 220,
  statBonus: { def: 9 },
};

export const STEEL_HELM: Equipment = {
  id: 'steel-helm',
  name: 'Steel Helm',
  slot: 'helm',
  tier: 'steel',
  cost: 500,
  statBonus: { def: 14 },
};

export const SILVER_CIRCLET: Equipment = {
  id: 'silver-circlet',
  name: 'Silver Circlet',
  slot: 'helm',
  tier: 'silver',
  cost: 1300,
  statBonus: { def: 20, mag: 5 },
};

export const MYTHRIL_CROWN: Equipment = {
  id: 'mythril-crown',
  name: 'Mythril Crown',
  slot: 'helm',
  tier: 'mythril',
  cost: 3200,
  statBonus: { def: 28, mag: 8 },
};

export const ORACLES_CROWN: Equipment = {
  id: 'oracles-crown',
  name: "Oracle's Crown",
  slot: 'helm',
  tier: 'legendary',
  cost: 8000,
  statBonus: { def: 38, mag: 14, pp: 20 },
};

export const GLORY_HELM: Equipment = {
  id: 'glory-helm',
  name: 'Glory Helm',
  slot: 'helm',
  tier: 'artifact',
  cost: 16000,
  statBonus: { def: 50, mag: 18, pp: 30 },
};

// ========================================
// BOOTS
// ========================================
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
  cost: 150,
  statBonus: { spd: 3, def: 2 },
};

export const STEEL_GREAVES: Equipment = {
  id: 'steel-greaves',
  name: 'Steel Greaves',
  slot: 'boots',
  tier: 'steel',
  cost: 400,
  statBonus: { spd: 5, def: 4 },
};

export const SILVER_GREAVES: Equipment = {
  id: 'silver-greaves',
  name: 'Silver Greaves',
  slot: 'boots',
  tier: 'silver',
  cost: 1100,
  statBonus: { spd: 7, def: 6 },
};

export const HYPER_BOOTS: Equipment = {
  id: 'hyper-boots',
  name: 'Hyper Boots',
  slot: 'boots',
  tier: 'mythril',
  cost: 2800,
  statBonus: { spd: 10, def: 8 },
};

export const QUICK_BOOTS: Equipment = {
  id: 'quick-boots',
  name: 'Quick Boots',
  slot: 'boots',
  tier: 'legendary',
  cost: 6500,
  statBonus: { spd: 14, def: 10 },
};

export const HERMES_SANDALS: Equipment = {
  id: 'hermes-sandals',
  name: "Hermes' Sandals",
  slot: 'boots',
  tier: 'artifact',
  cost: 14000,
  statBonus: { spd: 20, def: 12 },
  alwaysFirstTurn: true,
};

// ========================================
// ACCESSORIES
// ========================================
export const POWER_RING: Equipment = {
  id: 'power-ring',
  name: 'Power Ring',
  slot: 'accessory',
  tier: 'basic',
  cost: 100,
  statBonus: { atk: 5 },
};

export const GUARDIAN_RING: Equipment = {
  id: 'guardian-ring',
  name: 'Guardian Ring',
  slot: 'accessory',
  tier: 'basic',
  cost: 120,
  statBonus: { def: 5 },
};

export const ADEPTS_RING: Equipment = {
  id: 'adepts-ring',
  name: "Adept's Ring",
  slot: 'accessory',
  tier: 'bronze',
  cost: 250,
  statBonus: { mag: 6, pp: 5 },
};

export const WAR_GLOVES: Equipment = {
  id: 'war-gloves',
  name: 'War Gloves',
  slot: 'accessory',
  tier: 'iron',
  cost: 400,
  statBonus: { atk: 10, def: 3 },
};

export const SPIRIT_GLOVES: Equipment = {
  id: 'spirit-gloves',
  name: 'Spirit Gloves',
  slot: 'accessory',
  tier: 'steel',
  cost: 900,
  statBonus: { mag: 12, pp: 10 },
};

export const LUCKY_MEDAL: Equipment = {
  id: 'lucky-medal',
  name: 'Lucky Medal',
  slot: 'accessory',
  tier: 'silver',
  cost: 1800,
  statBonus: { spd: 5 },
};

export const ELEMENTAL_STAR: Equipment = {
  id: 'elemental-star',
  name: 'Elemental Star',
  slot: 'accessory',
  tier: 'mythril',
  cost: 4500,
  statBonus: { mag: 18, pp: 20 },
  elementalResist: 0.15,
};

export const DRAGONS_EYE: Equipment = {
  id: 'dragons-eye',
  name: "Dragon's Eye",
  slot: 'accessory',
  tier: 'legendary',
  cost: 8500,
  statBonus: { atk: 15, mag: 15, def: 10 },
};

export const CLERIC_RING: Equipment = {
  id: 'cleric-ring',
  name: 'Cleric Ring',
  slot: 'accessory',
  tier: 'legendary',
  cost: 9000,
  statBonus: { pp: 30, mag: 12 },
};

export const IRIS_ROBE: Equipment = {
  id: 'iris-robe',
  name: 'Iris Robe',
  slot: 'accessory',
  tier: 'artifact',
  cost: 12000,
  statBonus: { def: 20, mag: 20 },
  elementalResist: 0.2,
};

export const COSMOS_SHIELD: Equipment = {
  id: 'cosmos-shield',
  name: 'Cosmos Shield',
  slot: 'accessory',
  tier: 'artifact',
  cost: 17000,
  statBonus: { def: 30, hp: 50 },
  elementalResist: 0.25,
};

// ========================================
// EQUIPMENT REGISTRY
// ========================================
export const EQUIPMENT: Record<string, Equipment> = {
  // Swords
  'wooden-sword': WOODEN_SWORD,
  'bronze-sword': BRONZE_SWORD,
  'iron-sword': IRON_SWORD,
  'steel-sword': STEEL_SWORD,
  'silver-blade': SILVER_BLADE,
  'mythril-blade': MYTHRIL_BLADE,
  'gaia-blade': GAIA_BLADE,
  'sol-blade': SOL_BLADE,

  // Axes
  'wooden-axe': WOODEN_AXE,
  'battle-axe': BATTLE_AXE,
  'great-axe': GREAT_AXE,
  'titans-axe': TITANS_AXE,

  // Maces
  'mace': MACE,
  'heavy-mace': HEAVY_MACE,
  'demon-mace': DEMON_MACE,

  // Staves
  'wooden-staff': WOODEN_STAFF,
  'magic-rod': MAGIC_ROD,
  'shaman-rod': SHAMAN_ROD,
  'crystal-rod': CRYSTAL_ROD,
  'zodiac-wand': ZODIAC_WAND,
  'staff-of-ages': STAFF_OF_AGES,

  // Armor
  'cotton-shirt': COTTON_SHIRT,
  'leather-vest': LEATHER_VEST,
  'bronze-armor': BRONZE_ARMOR,
  'iron-armor': IRON_ARMOR,
  'steel-armor': STEEL_ARMOR,
  'silver-armor': SILVER_ARMOR,
  'mythril-armor': MYTHRIL_ARMOR,
  'dragon-scales': DRAGON_SCALES,
  'valkyrie-mail': VALKYRIE_MAIL,

  // Helms
  'leather-cap': LEATHER_CAP,
  'cloth-cap': CLOTH_CAP,
  'bronze-helm': BRONZE_HELM,
  'iron-helm': IRON_HELM,
  'steel-helm': STEEL_HELM,
  'silver-circlet': SILVER_CIRCLET,
  'mythril-crown': MYTHRIL_CROWN,
  'oracles-crown': ORACLES_CROWN,
  'glory-helm': GLORY_HELM,

  // Boots
  'leather-boots': LEATHER_BOOTS,
  'iron-boots': IRON_BOOTS,
  'steel-greaves': STEEL_GREAVES,
  'silver-greaves': SILVER_GREAVES,
  'hyper-boots': HYPER_BOOTS,
  'quick-boots': QUICK_BOOTS,
  'hermes-sandals': HERMES_SANDALS,

  // Accessories
  'power-ring': POWER_RING,
  'guardian-ring': GUARDIAN_RING,
  'adepts-ring': ADEPTS_RING,
  'war-gloves': WAR_GLOVES,
  'spirit-gloves': SPIRIT_GLOVES,
  'lucky-medal': LUCKY_MEDAL,
  'elemental-star': ELEMENTAL_STAR,
  'dragons-eye': DRAGONS_EYE,
  'cleric-ring': CLERIC_RING,
  'iris-robe': IRIS_ROBE,
  'cosmos-shield': COSMOS_SHIELD,
};
