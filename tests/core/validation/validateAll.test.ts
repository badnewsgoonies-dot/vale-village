import { describe, test, expect } from 'vitest';
import { validateAllGameData } from '@/core/validation/validateAll';

describe('validateAllGameData', () => {
  test('should validate all game data successfully', () => {
    expect(() => validateAllGameData()).not.toThrow();
  });
  
  // TODO: Add test for invalid data (when we have test fixtures)
});

