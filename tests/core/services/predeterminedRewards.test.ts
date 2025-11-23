import { describe, test, expect } from 'vitest';
import { calculateBattleRewards } from '../../../src/core/algorithms/rewards';
import { resolveEquipmentReward } from '../../../src/core/services/RewardsService';
import { ENCOUNTERS } from '../../../src/data/definitions/encounters';

describe('Predetermined Equipment Rewards', () => {
  test('same encounter always yields identical reward definition', () => {
    const rewards1 = calculateBattleRewards('house-02', 4);
    const rewards2 = calculateBattleRewards('house-02', 4);

    expect(rewards1).toEqual(rewards2);
    expect(rewards1.equipmentReward).toEqual(rewards2.equipmentReward);
  });

  test('fixed reward resolves to correct equipment', () => {
    const encounter = ENCOUNTERS['house-02'];
    expect(encounter.reward.equipment.type).toBe('fixed');

    if (encounter.reward.equipment.type === 'fixed') {
      const resolved = resolveEquipmentReward(encounter.reward.equipment);
      expect(resolved.type).toBe('fixed');
      expect(resolved.equipment.id).toBe('bronze-sword');
    }
  });

  test('choice reward exposes exactly three options', () => {
    const encounter = ENCOUNTERS['house-07'];
    expect(encounter.reward.equipment.type).toBe('choice');

    if (encounter.reward.equipment.type === 'choice') {
      const resolved = resolveEquipmentReward(encounter.reward.equipment);
      expect(resolved.type).toBe('choice');
      expect(resolved.options).toHaveLength(3);
      expect(resolved.options.map(o => o.id)).toEqual(
        expect.arrayContaining(['steel-sword', 'battle-axe', 'crystal-rod'])
      );
    }
  });

  test('no reward case returns none', () => {
    const encounter = ENCOUNTERS['training-dummy'];
    expect(encounter.reward.equipment.type).toBe('none');

    const resolved = resolveEquipmentReward(encounter.reward.equipment);
    expect(resolved.type).toBe('none');
  });

  test('gold is deterministic (no variance)', () => {
    const rewards1 = calculateBattleRewards('house-02', 4);
    const rewards2 = calculateBattleRewards('house-02', 4);

    expect(rewards1.totalGold).toBe(22);
    expect(rewards2.totalGold).toBe(22);
    expect(rewards1.totalGold).toBe(rewards2.totalGold);
  });
});
