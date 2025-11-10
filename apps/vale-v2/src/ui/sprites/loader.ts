/**
 * Sprite Loader
 * Handles loading and caching of sprite assets
 * Provides fallback placeholders for missing assets
 */

import { getSpriteDef } from './manifest';

/**
 * Sprite cache
 */
const spriteCache = new Map<string, HTMLImageElement>();

/**
 * Create a placeholder sprite (colored rectangle with label)
 */
function makePlaceholder(label: string): HTMLImageElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    // Fallback: create a simple colored div representation
    const img = new Image();
    img.src = 'data:image/svg+xml,' + encodeURIComponent(`
      <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" fill="#555"/>
        <text x="32" y="32" text-anchor="middle" fill="#fff" font-size="10">${label.slice(0, 6)}</text>
      </svg>
    `);
    return img;
  }
  
  // Draw placeholder
  ctx.fillStyle = '#555';
  ctx.fillRect(0, 0, 64, 64);
  
  ctx.fillStyle = '#fff';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label.slice(0, 6), 32, 32);
  
  const img = new Image();
  img.src = canvas.toDataURL();
  return img;
}

/**
 * Load a sprite by ID
 * Returns cached version if available, otherwise loads and caches
 */
export async function loadSprite(id: string): Promise<HTMLImageElement> {
  // Check cache first
  if (spriteCache.has(id)) {
    return spriteCache.get(id)!;
  }
  
  const def = getSpriteDef(id);
  if (!def) {
    // No definition - return placeholder
    const placeholder = makePlaceholder(id);
    spriteCache.set(id, placeholder);
    return placeholder;
  }
  
  // Try to load the actual sprite
  const img = new Image();
  
  try {
    img.src = def.src;
    await img.decode().catch(() => {
      // Decode failed - use placeholder
      const placeholder = makePlaceholder(id);
      spriteCache.set(id, placeholder);
      return placeholder;
    });
    
    if (img.complete && img.naturalWidth > 0) {
      // Image loaded successfully
      spriteCache.set(id, img);
      return img;
    } else {
      // Image failed to load - use placeholder
      const placeholder = makePlaceholder(id);
      spriteCache.set(id, placeholder);
      return placeholder;
    }
  } catch (error) {
    // Load error - use placeholder
    const placeholder = makePlaceholder(id);
    spriteCache.set(id, placeholder);
    return placeholder;
  }
}

/**
 * Preload sprites (for faster initial render)
 */
export async function preloadSprites(ids: string[]): Promise<void> {
  await Promise.all(ids.map(id => loadSprite(id).catch(() => {
    // Ignore individual load failures
  })));
}

/**
 * Clear sprite cache (useful for testing or memory management)
 */
export function clearSpriteCache(): void {
  spriteCache.clear();
}

