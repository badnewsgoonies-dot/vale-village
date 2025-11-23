import { describe, test, expect } from 'vitest';
import { calculateDjinnSynergy } from '../../../src/core/algorithms/djinn';
import type { Element } from '../../../src/core/models/types';

describe('Djinn Algorithms', () => {
  test('should return base stats for no Djinn', () => {
    const synergy = calculateDjinnSynergy([]);

    expect(synergy.atk).toBe(0);
    expect(synergy.def).toBe(0);
    expect(synergy.classChange).toBe('Base');
    expect(synergy.abilitiesUnlocked).toEqual([]);
  });

  test('should calculate synergy for 1 Djinn', () => {
    const synergy = calculateDjinnSynergy(['Venus']);

    expect(synergy.atk).toBe(4);
    expect(synergy.def).toBe(3);
    expect(synergy.classChange).toBe('Adept');
  });

  test('should calculate synergy for 2 same-element Djinn', () => {
    const synergy = calculateDjinnSynergy(['Venus', 'Venus']);

    expect(synergy.atk).toBe(8);
    expect(synergy.def).toBe(5);
    expect(synergy.classChange).toBe('Venus Warrior');
  });

  test('should calculate synergy for 2 different-element Djinn', () => {
    const synergy = calculateDjinnSynergy(['Venus', 'Mars']);

    expect(synergy.atk).toBe(5);
    expect(synergy.def).toBe(5);
    expect(synergy.classChange).toBe('Hybrid');
  });

  test('should calculate synergy for 3 same-element Djinn', () => {
    const synergy = calculateDjinnSynergy(['Venus', 'Venus', 'Venus']);

    expect(synergy.atk).toBe(12);
    expect(synergy.def).toBe(8);
    expect(synergy.classChange).toBe('Venus Adept');
    expect(synergy.abilitiesUnlocked).toContain('Venus-Ultimate');
  });

  test('should calculate synergy for 3 mixed Djinn (2+1)', () => {
    const synergy = calculateDjinnSynergy(['Venus', 'Venus', 'Mars']);

    expect(synergy.atk).toBe(8);
    expect(synergy.def).toBe(6);
    expect(synergy.classChange).toBe('Venus Knight');
    expect(synergy.abilitiesUnlocked).toContain('Hybrid-Spell');
  });

  test('should calculate synergy for 3 different-element Djinn', () => {
    const synergy = calculateDjinnSynergy(['Venus', 'Mars', 'Mercury']);

    expect(synergy.atk).toBe(4);
    expect(synergy.def).toBe(4);
    expect(synergy.spd).toBe(4);
    expect(synergy.classChange).toBe('Mystic');
    expect(synergy.abilitiesUnlocked).toContain('Elemental Harmony');
  });
});

