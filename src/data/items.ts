import type { Item } from '@/types/Item';

/**
 * Consumable Items for Vale Chronicles
 * Based on Golden Sun's item system
 *
 * Categories:
 * - Healing Items (HP restoration)
 * - PP Restoration Items (Psynergy recovery)
 * - Revival Items (revive KO'd units)
 * - Status Cure Items (cure ailments)
 * - Battle Items (temporary effects)
 */

// ========== HEALING ITEMS (HP Restoration) ==========

export const HERB: Item = {
  id: 'herb',
  name: 'Herb',
  type: 'healing',
  description: 'Restores 50 HP to one ally',
  cost: 10,
  sellPrice: 5,
  healAmount: 50,
  usableInBattle: true,
  usableOutOfBattle: true,
  targetType: 'single-ally',
};

export const NUT: Item = {
  id: 'nut',
  name: 'Nut',
  type: 'healing',
  description: 'Restores 200 HP to one ally',
  cost: 200,
  sellPrice: 100,
  healAmount: 200,
  usableInBattle: true,
  usableOutOfBattle: true,
  targetType: 'single-ally',
};

export const VIAL: Item = {
  id: 'vial',
  name: 'Vial',
  type: 'healing',
  description: 'Restores 500 HP to one ally',
  cost: 500,
  sellPrice: 250,
  healAmount: 500,
  usableInBattle: true,
  usableOutOfBattle: true,
  targetType: 'single-ally',
};

export const POTION: Item = {
  id: 'potion',
  name: 'Potion',
  type: 'healing',
  description: 'Fully restores HP to one ally',
  cost: 1000,
  sellPrice: 500,
  healAmount: 9999, // Max healing
  usableInBattle: true,
  usableOutOfBattle: true,
  targetType: 'single-ally',
};

export const HERMES_WATER: Item = {
  id: 'hermes-water',
  name: "Hermes' Water",
  type: 'healing',
  description: 'Restores 300 HP to all allies',
  cost: 1500,
  sellPrice: 750,
  healAmount: 300,
  usableInBattle: true,
  usableOutOfBattle: true,
  targetType: 'all-allies',
};

// ========== PP RESTORATION ITEMS (Psynergy Recovery) ==========

export const PSYNERGY_DROP: Item = {
  id: 'psynergy-drop',
  name: 'Psynergy Drop',
  type: 'pp_restore',
  description: 'Restores 10 PP to one ally',
  cost: 50,
  sellPrice: 25,
  ppAmount: 10,
  usableInBattle: true,
  usableOutOfBattle: true,
  targetType: 'single-ally',
};

export const PSYNERGY_STONE: Item = {
  id: 'psynergy-stone',
  name: 'Psynergy Stone',
  type: 'pp_restore',
  description: 'Restores 30 PP to one ally',
  cost: 150,
  sellPrice: 75,
  ppAmount: 30,
  usableInBattle: true,
  usableOutOfBattle: true,
  targetType: 'single-ally',
};

export const PSYNERGY_CRYSTAL: Item = {
  id: 'psynergy-crystal',
  name: 'Psynergy Crystal',
  type: 'pp_restore',
  description: 'Restores 100 PP to one ally',
  cost: 500,
  sellPrice: 250,
  ppAmount: 100,
  usableInBattle: true,
  usableOutOfBattle: true,
  targetType: 'single-ally',
};

export const MIST_POTION: Item = {
  id: 'mist-potion',
  name: 'Mist Potion',
  type: 'pp_restore',
  description: 'Fully restores PP to one ally',
  cost: 1500,
  sellPrice: 750,
  ppAmount: 999, // Max PP
  usableInBattle: true,
  usableOutOfBattle: true,
  targetType: 'single-ally',
};

// ========== REVIVAL ITEMS (Revive KO'd Units) ==========

export const WATER_OF_LIFE: Item = {
  id: 'water-of-life',
  name: 'Water of Life',
  type: 'revive',
  description: 'Revives a fallen ally with 50% HP',
  cost: 3000,
  sellPrice: 1500,
  revive: true,
  revivePercent: 0.5,
  usableInBattle: true,
  usableOutOfBattle: true,
  targetType: 'single-ally',
};

export const ELIXIR: Item = {
  id: 'elixir',
  name: 'Elixir',
  type: 'revive',
  description: 'Revives a fallen ally with full HP',
  cost: 5000,
  sellPrice: 2500,
  revive: true,
  revivePercent: 1.0,
  usableInBattle: true,
  usableOutOfBattle: true,
  targetType: 'single-ally',
};

// ========== STATUS CURE ITEMS (Cure Ailments) ==========

export const ANTIDOTE: Item = {
  id: 'antidote',
  name: 'Antidote',
  type: 'status_cure',
  description: 'Cures poison and venom',
  cost: 20,
  sellPrice: 10,
  curesStatus: ['poison', 'venom'],
  usableInBattle: true,
  usableOutOfBattle: true,
  targetType: 'single-ally',
};

export const ELIXIR_HERB: Item = {
  id: 'elixir-herb',
  name: 'Elixir Herb',
  type: 'status_cure',
  description: 'Cures sleep and stun',
  cost: 30,
  sellPrice: 15,
  curesStatus: ['sleep', 'stun'],
  usableInBattle: true,
  usableOutOfBattle: true,
  targetType: 'single-ally',
};

export const SACRED_FEATHER: Item = {
  id: 'sacred-feather',
  name: 'Sacred Feather',
  type: 'status_cure',
  description: 'Cures seal (unable to use Psynergy)',
  cost: 50,
  sellPrice: 25,
  curesStatus: ['seal'],
  usableInBattle: true,
  usableOutOfBattle: true,
  targetType: 'single-ally',
};

export const DRIED_LIZARD: Item = {
  id: 'dried-lizard',
  name: 'Dried Lizard',
  type: 'status_cure',
  description: 'Cures delusion (confused state)',
  cost: 40,
  sellPrice: 20,
  curesStatus: ['delusion', 'confusion'],
  usableInBattle: true,
  usableOutOfBattle: true,
  targetType: 'single-ally',
};

export const PEPPER: Item = {
  id: 'pepper',
  name: 'Pepper',
  type: 'status_cure',
  description: 'Cures sleep',
  cost: 15,
  sellPrice: 7,
  curesStatus: ['sleep'],
  usableInBattle: true,
  usableOutOfBattle: true,
  targetType: 'single-ally',
};

export const CURE_POISON: Item = {
  id: 'cure-poison',
  name: 'Cure Poison',
  type: 'status_cure',
  description: 'Cures poison',
  cost: 20,
  sellPrice: 10,
  curesStatus: ['poison'],
  usableInBattle: true,
  usableOutOfBattle: true,
  targetType: 'single-ally',
};

// ========== MULTI-PURPOSE ITEMS ==========

export const MINT: Item = {
  id: 'mint',
  name: 'Mint',
  type: 'healing',
  description: 'Restores 100 HP and cures poison',
  cost: 80,
  sellPrice: 40,
  healAmount: 100,
  curesStatus: ['poison'],
  usableInBattle: true,
  usableOutOfBattle: true,
  targetType: 'single-ally',
};

export const CRYSTAL_POWDER: Item = {
  id: 'crystal-powder',
  name: 'Crystal Powder',
  type: 'pp_restore',
  description: 'Restores 50 PP and 100 HP to one ally',
  cost: 400,
  sellPrice: 200,
  ppAmount: 50,
  healAmount: 100,
  usableInBattle: true,
  usableOutOfBattle: true,
  targetType: 'single-ally',
};

// ========== RARE/SPECIAL ITEMS ==========

export const SMOKE_BOMB: Item = {
  id: 'smoke-bomb',
  name: 'Smoke Bomb',
  type: 'battle',
  description: 'Escape from any non-boss battle',
  cost: 300,
  sellPrice: 150,
  usableInBattle: true,
  usableOutOfBattle: false,
  targetType: 'self',
};

export const BRAMBLE_SEED: Item = {
  id: 'bramble-seed',
  name: 'Bramble Seed',
  type: 'battle',
  description: 'Deals moderate Venus damage to all enemies',
  cost: 200,
  sellPrice: 100,
  usableInBattle: true,
  usableOutOfBattle: false,
  targetType: 'single-ally', // targeting yourself to use on enemies
};

export const OIL_DROP: Item = {
  id: 'oil-drop',
  name: 'Oil Drop',
  type: 'battle',
  description: 'Deals moderate Mars damage to all enemies',
  cost: 200,
  sellPrice: 100,
  usableInBattle: true,
  usableOutOfBattle: false,
  targetType: 'single-ally',
};

export const WEASEL_CLAW: Item = {
  id: 'weasel-claw',
  name: "Weasel's Claw",
  type: 'battle',
  description: 'Deals moderate Jupiter damage to all enemies',
  cost: 200,
  sellPrice: 100,
  usableInBattle: true,
  usableOutOfBattle: false,
  targetType: 'single-ally',
};

export const FROST_JEWEL: Item = {
  id: 'frost-jewel',
  name: 'Frost Jewel',
  type: 'battle',
  description: 'Deals moderate Mercury damage to all enemies',
  cost: 200,
  sellPrice: 100,
  usableInBattle: true,
  usableOutOfBattle: false,
  targetType: 'single-ally',
};

// ========== KEY ITEMS (Quest/Story) ==========
// These are non-consumable but included for completeness

export const SMALL_JEWEL: Item = {
  id: 'small-jewel',
  name: 'Small Jewel',
  type: 'battle',
  description: 'A small precious gem. Can be sold for gold.',
  cost: 0, // Cannot buy
  sellPrice: 500,
  usableInBattle: false,
  usableOutOfBattle: false,
  targetType: 'self',
};

export const LARGE_JEWEL: Item = {
  id: 'large-jewel',
  name: 'Large Jewel',
  type: 'battle',
  description: 'A large precious gem. Can be sold for gold.',
  cost: 0, // Cannot buy
  sellPrice: 2000,
  usableInBattle: false,
  usableOutOfBattle: false,
  targetType: 'self',
};

/**
 * All items indexed by ID for easy lookup
 */
export const ITEMS: Record<string, Item> = {
  // Healing Items
  'herb': HERB,
  'nut': NUT,
  'vial': VIAL,
  'potion': POTION,
  'hermes-water': HERMES_WATER,
  'mint': MINT,

  // PP Restoration
  'psynergy-drop': PSYNERGY_DROP,
  'psynergy-stone': PSYNERGY_STONE,
  'psynergy-crystal': PSYNERGY_CRYSTAL,
  'mist-potion': MIST_POTION,
  'crystal-powder': CRYSTAL_POWDER,

  // Revival
  'water-of-life': WATER_OF_LIFE,
  'elixir': ELIXIR,

  // Status Cure
  'antidote': ANTIDOTE,
  'elixir-herb': ELIXIR_HERB,
  'sacred-feather': SACRED_FEATHER,
  'dried-lizard': DRIED_LIZARD,
  'pepper': PEPPER,
  'cure-poison': CURE_POISON,

  // Battle Items
  'smoke-bomb': SMOKE_BOMB,
  'bramble-seed': BRAMBLE_SEED,
  'oil-drop': OIL_DROP,
  'weasel-claw': WEASEL_CLAW,
  'frost-jewel': FROST_JEWEL,

  // Valuables
  'small-jewel': SMALL_JEWEL,
  'large-jewel': LARGE_JEWEL,
};

/**
 * Get item by ID with type safety
 */
export function getItemById(id: string): Item | undefined {
  return ITEMS[id];
}

/**
 * Get items by type
 */
export function getItemsByType(type: Item['type']): Item[] {
  return Object.values(ITEMS).filter(item => item.type === type);
}

/**
 * Get shop inventory (items available for purchase)
 */
export function getShopItems(): Item[] {
  return Object.values(ITEMS).filter(item => item.cost > 0);
}

/**
 * Calculate total value of item stack
 */
export function calculateItemValue(itemId: string, quantity: number): number {
  const item = ITEMS[itemId];
  return item ? item.sellPrice * quantity : 0;
}
