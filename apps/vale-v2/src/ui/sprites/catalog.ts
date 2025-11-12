/**
 * Sprite Catalog API
 * Provides flexible access to all cataloged sprites
 */

import { SPRITE_LIST, type SpriteEntry } from './sprite-list-generated';

/**
 * Get sprite by exact path
 */
export function getSpriteByPath(path: string): SpriteEntry | null {
  return SPRITE_LIST.find(s => s.path === path) ?? null;
}

/**
 * Get all sprites in a category
 */
export function getSpritesByCategory(category: string): SpriteEntry[] {
  return SPRITE_LIST.filter(s => s.category === category);
}

/**
 * Get sprites by category and subcategory
 */
export function getSpritesBySubcategory(category: string, subcategory: string): SpriteEntry[] {
  return SPRITE_LIST.filter(s => s.category === category && s.subcategory === subcategory);
}

/**
 * Search sprites by name (case-insensitive)
 */
export function searchSprites(query: string): SpriteEntry[] {
  const lowerQuery = query.toLowerCase();
  return SPRITE_LIST.filter(s => s.name.toLowerCase().includes(lowerQuery));
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  return [...new Set(SPRITE_LIST.map(s => s.category))].sort();
}

/**
 * Get all subcategories for a category
 */
export function getSubcategories(category: string): string[] {
  const subs = SPRITE_LIST
    .filter(s => s.category === category && s.subcategory !== null)
    .map(s => s.subcategory as string);
  return [...new Set(subs)].sort();
}

/**
 * Get sprite by flexible ID matching
 * Tries to match sprites by keywords in the name
 * 
 * @example
 * getSpriteById('isaac-battle-idle') → finds "Isaac lBlade Front" sprite
 * getSpriteById('goblin') → finds "Alec Goblin" sprite
 */
export function getSpriteById(id: string): SpriteEntry | null {
  const keywords = id.split('-').map(k => k.toLowerCase());
  
  // Try exact name match first
  const exactMatch = SPRITE_LIST.find(s => 
    s.name.toLowerCase() === id.toLowerCase()
  );
  if (exactMatch) return exactMatch;
  
  // Try keyword matching (all keywords must be in name)
  const keywordMatch = SPRITE_LIST.find(s => 
    keywords.every(kw => s.name.toLowerCase().includes(kw))
  );
  
  return keywordMatch ?? null;
}

/**
 * Get random sprite from category
 */
export function getRandomSprite(category?: string): SpriteEntry {
  const sprites = category 
    ? getSpritesByCategory(category)
    : SPRITE_LIST;
  
  const randomIndex = Math.floor(Math.random() * sprites.length);
  return sprites[randomIndex]!;
}

/**
 * Get statistics about sprite catalog
 */
export function getStats() {
  const categories = getCategories();
  const categoryCounts = categories.map(cat => ({
    category: cat,
    count: getSpritesByCategory(cat).length,
  }));
  
  return {
    total: SPRITE_LIST.length,
    categories: categoryCounts,
    largestCategory: categoryCounts.reduce((max, curr) => 
      curr.count > max.count ? curr : max
    ),
  };
}

/**
 * Validate that a sprite path exists in the catalog
 */
export function validateSpritePath(path: string): boolean {
  return SPRITE_LIST.some(s => s.path === path);
}

// Re-export for convenience
export { SPRITE_LIST, type SpriteEntry };
