import { describe, expect, it } from 'vitest';
import { ENCOUNTERS } from '../../../src/data/definitions/encounters';
import { EQUIPMENT } from '../../../src/data/definitions/equipment';

describe('House equipment rewards', () => {
  it('every house has equipment and fixed drops are unique and valid', () => {
    const houses = Object.values(ENCOUNTERS).filter((enc) => enc.id.startsWith('house-'));

    // All houses should have some equipment reward (no "none")
    houses.forEach((encounter) => {
      expect(encounter.reward.equipment.type).not.toBe('none');
    });

    // Collect fixed drops
    const fixedIds = houses
      .filter((encounter) => encounter.reward.equipment.type === 'fixed')
      .map((encounter) => encounter.reward.equipment.itemId);

    // All fixed drops must exist in the equipment registry
    fixedIds.forEach((id) => {
      expect(EQUIPMENT[id]).toBeDefined();
    });

    // No duplicate fixed drops across houses
    expect(new Set(fixedIds).size).toBe(fixedIds.length);
  });
});
