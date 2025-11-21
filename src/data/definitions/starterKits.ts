import type { Element } from '../../core/models/types';

/**
 * Element-Based Starter Kit
 * REFACTORED: Kits are now element-specific (not unit-specific)
 * - All Venus units share the same kit
 * - All Mars units share the same kit
 * - All Mercury units share the same kit
 * - All Jupiter units share the same kit
 */
export interface StarterKit {
  /** Element type this kit belongs to */
  readonly element: Element;
  /** Display name shown in the shop */
  readonly name: string;
  /** Gold cost to unlock the kit */
  readonly cost: number;
  /** Equipment bundle granted when purchasing the kit */
  readonly equipment: {
    readonly weapon: string;
    readonly armor: string;
    readonly helm: string;
    readonly boots: string;
    readonly accessory: string;
  };
}

export const STARTER_KITS: Record<Element, StarterKit> = {
  Venus: {
    element: 'Venus',
    name: "Earth Warrior Kit",
    cost: 350,
    equipment: {
      weapon: 'wooden-sword',    // Basic sword
      armor: 'leather-vest',     // Medium armor
      helm: 'leather-cap',       // Medium helm
      boots: 'leather-boots',    // Medium boots
      accessory: 'guardian-ring', // Defensive ring
    },
  },
  Mars: {
    element: 'Mars',
    name: "Fire Mage Kit",
    cost: 350,
    equipment: {
      weapon: 'wooden-axe',      // Mars axe
      armor: 'leather-vest',     // Medium armor
      helm: 'bronze-helm',       // Heavy helm
      boots: 'leather-boots',    // Medium boots
      accessory: 'war-gloves',   // Mars-specific gloves
    },
  },
  Mercury: {
    element: 'Mercury',
    name: "Water Mystic Kit",
    cost: 350,
    equipment: {
      weapon: 'wooden-staff',    // Mage staff
      armor: 'cotton-shirt',     // Light mage armor
      helm: 'cloth-cap',         // Light mage helm
      boots: 'leather-boots',    // Medium boots
      accessory: 'spirit-gloves', // Mage gloves
    },
  },
  Jupiter: {
    element: 'Jupiter',
    name: "Wind Warrior Kit",
    cost: 350,
    equipment: {
      weapon: 'wooden-staff',    // Staff for Stormcaller, also works for Ranger
      armor: 'leather-vest',     // Medium armor
      helm: 'cloth-cap',         // Light helm
      boots: 'leather-boots',    // Medium boots
      accessory: 'lucky-medal',  // Jupiter-specific medal
    },
  },
  Neutral: {
    element: 'Neutral',
    name: "Neutral Kit",
    cost: 350,
    equipment: {
      weapon: 'wooden-sword',    // Generic weapon
      armor: 'leather-vest',     // Generic armor
      helm: 'leather-cap',       // Generic helm
      boots: 'leather-boots',    // Generic boots
      accessory: 'power-ring',   // Generic accessory
    },
  },
};

/**
 * Get starter kit for a unit based on their element
 * REFACTORED: Returns kit by element, not unit ID
 */
export function getStarterKit(unit: { element: Element }): StarterKit {
  return STARTER_KITS[unit.element];
}

/**
 * Get available starter kits for a list of units
 * REFACTORED: Returns kits by element (deduplicates same-element units)
 */
export function getAvailableStarterKits(units: readonly { id: string; element: Element }[]): StarterKit[] {
  // Deduplicate by element
  const uniqueElements = Array.from(new Set(units.map(u => u.element)));
  return uniqueElements
    .map((element) => STARTER_KITS[element])
    .filter((kit): kit is StarterKit => Boolean(kit));
}
