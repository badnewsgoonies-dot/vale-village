import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { warnIfPlaceholderSprite } from '@/ui/sprites/utils/warnIfPlaceholderSprite';

describe('warnIfPlaceholderSprite', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  test('does not log for normal sprite ids', () => {
    warnIfPlaceholderSprite('TestScreen', 'some-regular-sprite');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('logs once for placeholder sprite ids', () => {
    const placeholderId = 'missing-battle-sprite-scout';
    warnIfPlaceholderSprite('TestScreen', placeholderId);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    const [message] = warnSpy.mock.calls[0] ?? [''];
    expect(String(message)).toContain('[Sprites][DEV]');
    expect(String(message)).toContain(placeholderId);
  });
});

