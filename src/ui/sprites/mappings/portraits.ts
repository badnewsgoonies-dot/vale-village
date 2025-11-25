/**
 * Portrait Sprite Mapping
 * Maps character/speaker names to portrait sprite IDs
 */

/**
 * Maps character names to portrait sprite IDs
 * Uses available portraits from /sprites/icons/characters/ (100+ portraits available)
 */
export const PORTRAIT_MAP: Record<string, string> = {
  // Main Party Characters (both name variations)
  'Isaac': 'isaac1',
  'isaac': 'isaac1',
  'Garet': 'garet1',
  'garet': 'garet1',
  'Mia': 'mia',
  'mia': 'mia',
  'Ivan': 'ivan',
  'ivan': 'ivan',
  'Felix': 'felix1',
  'felix': 'felix1',
  'Jenna': 'jenna1',
  'jenna': 'jenna1',
  'Piers': 'piers',
  'piers': 'piers',
  'Sheba': 'sheba',
  'sheba': 'sheba',

  // Unit IDs to portraits
  'adept': 'isaac1',
  'war-mage': 'garet1',
  'mystic': 'mia',
  'ranger': 'ivan',
  'blaze': 'garet1',         // Mars - uses Garet portrait
  'karis': 'ivan',            // Jupiter - uses Ivan portrait (Karis not available)
  'sentinel': 'felix1',       // Venus - uses Felix portrait
  'stormcaller': 'jenna1',    // Jupiter - has portrait
  'tyrell': 'garet1',         // Mars - uses Garet portrait
  'tower-champion': 'isaac1', // Venus - uses Isaac portrait

  // Test units
  'test-warrior-1': 'isaac1',
  'test-warrior-2': 'garet1',
  'test-warrior-3': 'mia',
  'test-warrior-4': 'ivan',

  // Antagonists (available in catalog)
  'Saturos': 'saturos',
  'saturos': 'saturos',
  'Menardi': 'menardi',
  'menardi': 'menardi',
  'Alex': 'alex',
  'alex': 'alex',
  'Agatio': 'agatio',
  'agatio': 'agatio',
  'Karst': 'karst',
  'karst': 'karst',

  // Common NPCs (generic fallbacks)
  'Elder': 'elder',
  'elder': 'elder',
  'Merchant': 'armor-shopkeeper',
  'merchant': 'armor-shopkeeper',
  'Villager': 'villager',
  'villager': 'villager',
};

/**
 * Get portrait sprite ID for a character/speaker
 * Returns fallback if character not recognized
 *
 * @param name - Character name or unit ID
 * @returns Sprite ID for the character's portrait
 */
export function getPortraitSprite(name: string): string {
  // Try exact match first
  const exactMatch = PORTRAIT_MAP[name];
  if (exactMatch) {
    return exactMatch;
  }

  // Try lowercase match
  const lowerName = name.toLowerCase();
  const lowerMatch = PORTRAIT_MAP[lowerName];
  if (lowerMatch) {
    return lowerMatch;
  }

  // Default fallback - use Isaac portrait
  return 'isaac1';
}

/**
 * Check if a character has a mapped portrait
 */
export function hasPortrait(name: string): boolean {
  return name in PORTRAIT_MAP || name.toLowerCase() in PORTRAIT_MAP;
}

/**
 * Get all mapped character names
 */
export function getMappedCharacters(): string[] {
  return Object.keys(PORTRAIT_MAP);
}
