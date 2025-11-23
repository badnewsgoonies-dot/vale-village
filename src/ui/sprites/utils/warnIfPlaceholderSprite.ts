const PLACEHOLDER_PREFIXES = ['missing-battle-sprite-', 'missing-compendium-enemy-'];
const IS_DEV = typeof import.meta !== 'undefined' && import.meta.env?.DEV;

export function warnIfPlaceholderSprite(screenName: string, spriteId: string) {
  if (!IS_DEV) {
    return;
  }
  if (PLACEHOLDER_PREFIXES.some(prefix => spriteId.startsWith(prefix))) {
    // eslint-disable-next-line no-console -- Development helper that should never reach production
    console.warn(
      `[Sprites][DEV] Placeholder sprite rendered on ${screenName} for "${spriteId}". ` +
        'Add a mapping in battleSprites.ts or the appropriate overworld/menu mapping.'
    );
  }
}

