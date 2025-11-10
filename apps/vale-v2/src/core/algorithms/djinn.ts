/**
 * Djinn synergy calculation algorithms
 * Pure functions, deterministic
 */

import type { Element } from '../models/types';

/**
 * Djinn synergy bonus when multiple Djinn equipped
 * From GAME_MECHANICS.md Section 2.1
 */
export interface DjinnSynergy {
  atk: number;
  def: number;
  spd?: number;
  classChange: string;
  abilitiesUnlocked: readonly string[];
}

/**
 * Calculate Djinn synergy based on elements
 * From GAME_MECHANICS.md Section 2.1
 * 🚨 CRITICAL: Synergy scales with Djinn COUNT!
 */
export function calculateDjinnSynergy(djinnElements: readonly Element[]): DjinnSynergy {
  if (djinnElements.length === 0) {
    return {
      atk: 0,
      def: 0,
      classChange: 'Base',
      abilitiesUnlocked: [],
    };
  }

  const elementCounts = new Map<Element, number>();

  for (const element of djinnElements) {
    elementCounts.set(element, (elementCounts.get(element) || 0) + 1);
  }

  const uniqueElements = elementCounts.size;
  const maxCount = Math.max(...Array.from(elementCounts.values()));
  const primaryElement = Array.from(elementCounts.entries())
    .find(([_, count]) => count === maxCount)?.[0];

  // 1 Djinn (any element)
  if (djinnElements.length === 1) {
    return {
      atk: 4,
      def: 3,
      classChange: 'Adept',
      abilitiesUnlocked: [],
    };
  }

  // 2 Djinn - Same element
  if (djinnElements.length === 2 && uniqueElements === 1) {
    return {
      atk: 8,
      def: 5,
      classChange: `${primaryElement} Warrior`,
      abilitiesUnlocked: [],
    };
  }

  // 2 Djinn - Different elements
  if (djinnElements.length === 2 && uniqueElements === 2) {
    return {
      atk: 5,
      def: 5,
      classChange: 'Hybrid',
      abilitiesUnlocked: [],
    };
  }

  // 3 Djinn - All same element
  if (djinnElements.length === 3 && uniqueElements === 1) {
    return {
      atk: 12,
      def: 8,
      classChange: `${primaryElement} Adept`,
      abilitiesUnlocked: [`${primaryElement}-Ultimate`],
    };
  }

  // 3 Djinn - 2 same + 1 different
  if (djinnElements.length === 3 && uniqueElements === 2 && maxCount === 2) {
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

