/**
 * Element advantage calculations
 * Pure functions, deterministic
 */

import type { Element } from '../models/types';

/**
 * Element advantage triangle (from GAME_MECHANICS.md Section 5.2)
 * - Venus → Jupiter (Earth strong vs Wind)
 * - Mars → Venus (Fire strong vs Earth)
 * - Mercury → Mars (Water strong vs Fire)
 * - Jupiter → Mercury (Wind strong vs Water)
 */
const ELEMENT_ADVANTAGE: Record<string, number> = {
  'Venus→Jupiter': 1.5,
  'Mars→Venus': 1.5,
  'Mercury→Mars': 1.5,
  'Jupiter→Mercury': 1.5,
};

/**
 * Get element modifier for attack
 * Returns 1.5 for advantage, 0.67 for disadvantage, 1.0 for neutral
 */
export function getElementModifier(attackElement: Element, defenseElement: Element): number {
  const key = `${attackElement}→${defenseElement}`;
  if (ELEMENT_ADVANTAGE[key]) {
    return 1.5; // +50% damage
  }

  const reverseKey = `${defenseElement}→${attackElement}`;
  if (ELEMENT_ADVANTAGE[reverseKey]) {
    return 0.67; // -33% damage
  }

  return 1.0; // Neutral
}

