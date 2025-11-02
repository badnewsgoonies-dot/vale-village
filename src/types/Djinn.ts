import type { Element } from './Element';

/**
 * Djinn tiers (from GAME_MECHANICS.md Section 2)
 */
export type DjinnTier = 1 | 2 | 3;

/**
 * Djinn states during battle
 */
export type DjinnState = 'Set' | 'Standby' | 'Recovery';

/**
 * Djinn definition
 */
export interface Djinn {
  id: string;
  name: string;
  element: Element;
  tier: DjinnTier;
  lore: string;

  // Active use effect (unleash in battle)
  unleashEffect: {
    type: 'damage' | 'heal' | 'buff';
    basePower: number;
    targets: 'all-enemies' | 'single-enemy' | 'all-allies' | 'single-ally';
  };

  // How to acquire this Djinn
  source: string;
}

/**
 * Synergy bonus when multiple Djinn equipped
 * From GAME_MECHANICS.md Section 2.1
 */
export interface DjinnSynergy {
  atk: number;
  def: number;
  spd?: number;
  classChange: string;
  abilitiesUnlocked: string[];
}

/**
 * Calculate Djinn synergy based on elements
 * From GAME_MECHANICS.md Section 2.1
 * 🚨 CRITICAL: Synergy scales with Djinn COUNT!
 */
export function calculateDjinnSynergy(djinn: Djinn[]): DjinnSynergy {
  if (djinn.length === 0) {
    return {
      atk: 0,
      def: 0,
      classChange: 'Base',
      abilitiesUnlocked: [],
    };
  }

  const elements = djinn.map(d => d.element);
  const elementCounts = new Map<Element, number>();

  for (const element of elements) {
    elementCounts.set(element, (elementCounts.get(element) || 0) + 1);
  }

  const uniqueElements = elementCounts.size;
  const maxCount = Math.max(...Array.from(elementCounts.values()));
  const primaryElement = Array.from(elementCounts.entries())
    .find(([_, count]) => count === maxCount)?.[0];

  // 1 Djinn (any element)
  if (djinn.length === 1) {
    return {
      atk: 4,
      def: 3,
      classChange: 'Adept',
      abilitiesUnlocked: [],
    };
  }

  // 2 Djinn - Same element
  if (djinn.length === 2 && uniqueElements === 1) {
    return {
      atk: 8,
      def: 5,
      classChange: `${primaryElement} Warrior`,
      abilitiesUnlocked: [],
    };
  }

  // 2 Djinn - Different elements
  if (djinn.length === 2 && uniqueElements === 2) {
    return {
      atk: 5,
      def: 5,
      classChange: 'Hybrid',
      abilitiesUnlocked: [],
    };
  }

  // 3 Djinn - All same element
  if (djinn.length === 3 && uniqueElements === 1) {
    return {
      atk: 12,
      def: 8,
      classChange: `${primaryElement} Adept`,
      abilitiesUnlocked: [`${primaryElement}-Ultimate`],
    };
  }

  // 3 Djinn - 2 same + 1 different
  if (djinn.length === 3 && uniqueElements === 2 && maxCount === 2) {
    return {
      atk: 8,
      def: 6,
      classChange: `${primaryElement} Knight`,
      abilitiesUnlocked: ['Hybrid-Spell'],
    };
  }

  // 3 Djinn - All different elements
  return {
    atk: 4,
    def: 4,
    spd: 4,
    classChange: 'Mystic',
    abilitiesUnlocked: ['Elemental Harmony'],
  };
}
