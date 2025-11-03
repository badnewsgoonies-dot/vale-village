<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< HEAD
=======
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
/**
 * Four elemental types from Golden Sun + Neutral
 */
export type Element = 'Venus' | 'Mars' | 'Mercury' | 'Jupiter' | 'Neutral';

export const ELEMENTS: readonly Element[] = ['Venus', 'Mars', 'Mercury', 'Jupiter', 'Neutral'] as const;

/**
 * Element advantage triangle (from GAME_MECHANICS.md Section 5.2)
 * - Venus → Jupiter (Earth strong vs Wind)
 * - Mars → Venus (Fire strong vs Earth)
 * - Mercury → Mars (Water strong vs Fire)
 * - Jupiter → Mercury (Wind strong vs Water)
 */
export const ELEMENT_ADVANTAGE: Record<string, number> = {
  'Venus→Jupiter': 1.5,
  'Mars→Venus': 1.5,
  'Mercury→Mars': 1.5,
  'Jupiter→Mercury': 1.5,
};

/**
 * Check if attackElement has advantage over defenseElement
 */
export function getElementModifier(attackElement: Element, defenseElement: Element): number {
  const key = `${attackElement}→${defenseElement}`;
  if (ELEMENT_ADVANTAGE[key]) return 1.5; // +50% damage

  const reverseKey = `${defenseElement}→${attackElement}`;
  if (ELEMENT_ADVANTAGE[reverseKey]) return 0.67; // -33% damage

  return 1.0; // Neutral
}
=======
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
<<<<<<< HEAD
/**
 * Four elemental types from Golden Sun + Neutral
 */
export type Element = 'Venus' | 'Mars' | 'Mercury' | 'Jupiter' | 'Neutral';

export const ELEMENTS: readonly Element[] = ['Venus', 'Mars', 'Mercury', 'Jupiter', 'Neutral'] as const;

/**
 * Element advantage triangle (from GAME_MECHANICS.md Section 5.2)
 * - Venus → Jupiter (Earth strong vs Wind)
 * - Mars → Venus (Fire strong vs Earth)
 * - Mercury → Mars (Water strong vs Fire)
 * - Jupiter → Mercury (Wind strong vs Water)
 */
export const ELEMENT_ADVANTAGE: Record<string, number> = {
  'Venus→Jupiter': 1.5,
  'Mars→Venus': 1.5,
  'Mercury→Mars': 1.5,
  'Jupiter→Mercury': 1.5,
};

/**
 * Check if attackElement has advantage over defenseElement
 */
export function getElementModifier(attackElement: Element, defenseElement: Element): number {
  const key = `${attackElement}→${defenseElement}`;
  if (ELEMENT_ADVANTAGE[key]) return 1.5; // +50% damage

  const reverseKey = `${defenseElement}→${attackElement}`;
  if (ELEMENT_ADVANTAGE[reverseKey]) return 0.67; // -33% damage

  return 1.0; // Neutral
}
=======
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
/**
 * Four elemental types from Golden Sun + Neutral
 */
export type Element = 'Venus' | 'Mars' | 'Mercury' | 'Jupiter' | 'Neutral';

export const ELEMENTS: readonly Element[] = ['Venus', 'Mars', 'Mercury', 'Jupiter', 'Neutral'] as const;

/**
 * Element advantage triangle (from GAME_MECHANICS.md Section 5.2)
 * - Venus → Jupiter (Earth strong vs Wind)
 * - Mars → Venus (Fire strong vs Earth)
 * - Mercury → Mars (Water strong vs Fire)
 * - Jupiter → Mercury (Wind strong vs Water)
 */
export const ELEMENT_ADVANTAGE: Record<string, number> = {
  'Venus→Jupiter': 1.5,
  'Mars→Venus': 1.5,
  'Mercury→Mars': 1.5,
  'Jupiter→Mercury': 1.5,
};

/**
 * Check if attackElement has advantage over defenseElement
 */
export function getElementModifier(attackElement: Element, defenseElement: Element): number {
  const key = `${attackElement}→${defenseElement}`;
  if (ELEMENT_ADVANTAGE[key]) return 1.5; // +50% damage

  const reverseKey = `${defenseElement}→${attackElement}`;
  if (ELEMENT_ADVANTAGE[reverseKey]) return 0.67; // -33% damage

  return 1.0; // Neutral
}
>>>>>>> da011dae5a42c00b1fdb0e0f62b8f00e0a566dcf
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
