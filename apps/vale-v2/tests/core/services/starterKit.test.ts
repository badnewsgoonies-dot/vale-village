import { describe, expect, test } from 'vitest';
import { mkUnit } from '@/test/factories';
import { purchaseStarterKit, purchaseUnitEquipment } from '../../../src/core/services/ShopService';
import { STARTER_KITS } from '../../../src/data/definitions/starterKits';

describe('Starter Kit Service', () => {
  test('purchases starter kit when affordable', () => {
    const result = purchaseStarterKit('adept', 500);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.newGold).toBe(500 - STARTER_KITS.adept.cost);
      expect(result.value.equipment).toHaveLength(5);
      expect(result.value.equipment[0].id).toBe(STARTER_KITS.adept.equipment.weapon);
    }
  });

  test('fails when insufficient gold', () => {
    const result = purchaseStarterKit('adept', 100);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('Insufficient gold');
    }
  });

  test('fails when unit has no kit', () => {
    const result = purchaseStarterKit('unknown-unit', 500);
    expect(result.ok).toBe(false);
  });
});

describe('Unit Equipment Purchases', () => {
  test('allows purchasing compatible equipment', () => {
    const unit = mkUnit({ id: 'adept' });
    const result = purchaseUnitEquipment(unit, 500, 'wooden-sword');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.newGold).toBe(500 - 50);
      expect(result.value.item.id).toBe('wooden-sword');
    }
  });

  test('rejects incompatible equipment', () => {
    const unit = mkUnit({ id: 'adept' });
    const result = purchaseUnitEquipment(unit, 500, 'battle-axe');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('cannot equip');
    }
  });

  test('rejects when gold insufficient', () => {
    const unit = mkUnit({ id: 'adept' });
    const result = purchaseUnitEquipment(unit, 10, 'wooden-sword');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('Cannot afford');
    }
  });
});
