/**
 * Shop Service Tests
 * Tests equipment purchasing and starter kit system
 */

import { describe, test, expect } from 'vitest';
import {
  canAffordItem,
  buyItem,
  purchaseStarterKit,
  purchaseUnitEquipment,
  getPriceByTier,
} from '@/core/services/ShopService';
import { mkUnit } from '@/test/factories';

describe('ShopService - Affordability Check', () => {
  test('canAffordItem returns true with sufficient gold', () => {
    expect(canAffordItem(1000, 'wooden-sword')).toBe(true);
  });

  test('canAffordItem returns false with insufficient gold', () => {
    expect(canAffordItem(10, 'wooden-sword')).toBe(false);
  });

  test('canAffordItem returns false for invalid item', () => {
    expect(canAffordItem(1000, 'nonexistent-item')).toBe(false);
  });

  test('canAffordItem handles exact cost match', () => {
    // wooden-sword costs 100g (basic tier)
    expect(canAffordItem(100, 'wooden-sword')).toBe(true);
  });
});

describe('ShopService - Item Purchase', () => {
  test('buyItem succeeds with valid item and gold', () => {
    const result = buyItem(500, 'wooden-sword');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.success).toBe(true);
      expect(result.value.newGold).toBe(400); // 500 - 100
      expect(result.value.item.id).toBe('wooden-sword');
    }
  });

  test('buyItem fails with insufficient gold', () => {
    const result = buyItem(50, 'wooden-sword');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/cannot afford/i);
    }
  });

  test('buyItem fails with invalid item ID', () => {
    const result = buyItem(1000, 'invalid-item');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/not found/i);
    }
  });

  test('buyItem deducts exact cost', () => {
    const initialGold = 250;
    const result = buyItem(initialGold, 'wooden-sword');

    expect(result.ok).toBe(true);
    if (result.ok) {
      const cost = result.value.item.cost;
      expect(result.value.newGold).toBe(initialGold - cost);
    }
  });

  test('buyItem returns purchased item', () => {
    const result = buyItem(500, 'leather-armor');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.item.id).toBe('leather-armor');
      expect(result.value.item.slot).toBe('armor');
    }
  });
});

describe('ShopService - Starter Kit Purchase', () => {
  test('purchaseStarterKit returns equipment for Venus element', () => {
    const unit = mkUnit({ id: 'test', element: 'Venus' });
    const result = purchaseStarterKit(unit, 1000);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.equipment.length).toBeGreaterThan(0);
      expect(result.value.newGold).toBeLessThan(1000);
    }
  });

  test('purchaseStarterKit returns equipment for Mars element', () => {
    const unit = mkUnit({ id: 'test', element: 'Mars' });
    const result = purchaseStarterKit(unit, 1000);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.equipment.length).toBeGreaterThan(0);
    }
  });

  test('purchaseStarterKit returns equipment for Mercury element', () => {
    const unit = mkUnit({ id: 'test', element: 'Mercury' });
    const result = purchaseStarterKit(unit, 1000);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.equipment.length).toBeGreaterThan(0);
    }
  });

  test('purchaseStarterKit returns equipment for Jupiter element', () => {
    const unit = mkUnit({ id: 'test', element: 'Jupiter' });
    const result = purchaseStarterKit(unit, 1000);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.equipment.length).toBeGreaterThan(0);
    }
  });

  test('purchaseStarterKit fails with insufficient gold', () => {
    const unit = mkUnit({ id: 'test', element: 'Venus' });
    const result = purchaseStarterKit(unit, 10);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/insufficient gold/i);
    }
  });

  test('purchaseStarterKit deducts correct gold', () => {
    const unit = mkUnit({ id: 'test', element: 'Venus' });
    const initialGold = 1000;
    const result = purchaseStarterKit(unit, initialGold);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.newGold).toBeLessThan(initialGold);
      expect(result.value.newGold).toBeGreaterThanOrEqual(0);
    }
  });

  test('purchaseStarterKit returns valid equipment items', () => {
    const unit = mkUnit({ id: 'test', element: 'Venus' });
    const result = purchaseStarterKit(unit, 1000);

    expect(result.ok).toBe(true);
    if (result.ok) {
      // All equipment should have valid properties
      result.value.equipment.forEach(item => {
        expect(item.id).toBeDefined();
        expect(item.name).toBeDefined();
        expect(item.slot).toBeDefined();
        expect(item.tier).toBeDefined();
      });
    }
  });
});

describe('ShopService - Unit Equipment Purchase', () => {
  test('purchaseUnitEquipment succeeds for compatible element', () => {
    const venusUnit = mkUnit({ id: 'isaac', element: 'Venus' });
    const result = purchaseUnitEquipment(venusUnit, 500, 'wooden-sword');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.item.id).toBe('wooden-sword');
      expect(result.value.newGold).toBe(400); // 500 - 100
    }
  });

  test('purchaseUnitEquipment fails for incompatible element', () => {
    const mercuryUnit = mkUnit({ id: 'mia', element: 'Mercury' });

    // Try to buy Venus equipment (wooden-sword)
    const result = purchaseUnitEquipment(mercuryUnit, 500, 'wooden-sword');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/cannot equip/i);
    }
  });

  test('purchaseUnitEquipment fails with insufficient gold', () => {
    const venusUnit = mkUnit({ id: 'isaac', element: 'Venus' });
    const result = purchaseUnitEquipment(venusUnit, 10, 'wooden-sword');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/cannot afford/i);
    }
  });

  test('purchaseUnitEquipment fails for invalid item', () => {
    const venusUnit = mkUnit({ id: 'isaac', element: 'Venus' });
    const result = purchaseUnitEquipment(venusUnit, 500, 'invalid-item');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/not found/i);
    }
  });

  test('purchaseUnitEquipment deducts exact cost', () => {
    const venusUnit = mkUnit({ id: 'isaac', element: 'Venus' });
    const initialGold = 300;
    const result = purchaseUnitEquipment(venusUnit, initialGold, 'wooden-sword');

    expect(result.ok).toBe(true);
    if (result.ok) {
      const expectedGold = initialGold - result.value.item.cost;
      expect(result.value.newGold).toBe(expectedGold);
    }
  });
});

describe('ShopService - Tier Pricing', () => {
  test('getPriceByTier returns correct prices', () => {
    expect(getPriceByTier('basic')).toBe(100);
    expect(getPriceByTier('bronze')).toBe(300);
    expect(getPriceByTier('iron')).toBe(800);
    expect(getPriceByTier('steel')).toBe(2000);
    expect(getPriceByTier('silver')).toBe(2000);
    expect(getPriceByTier('mythril')).toBe(2000);
    expect(getPriceByTier('legendary')).toBe(2000);
    expect(getPriceByTier('artifact')).toBe(2000);
  });

  test('getPriceByTier handles unknown tier', () => {
    const unknownTier = 'unknown' as any;
    expect(getPriceByTier(unknownTier)).toBe(100); // Default to basic
  });
});

describe('ShopService - Edge Cases', () => {
  test('buying with exact gold amount works', () => {
    const result = buyItem(100, 'wooden-sword');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.newGold).toBe(0);
    }
  });

  test('buying with 1 gold less than cost fails', () => {
    const result = buyItem(99, 'wooden-sword');

    expect(result.ok).toBe(false);
  });

  test('buying multiple items sequentially', () => {
    let gold = 1000;

    // Buy wooden-sword
    let result = buyItem(gold, 'wooden-sword');
    expect(result.ok).toBe(true);
    if (result.ok) gold = result.value.newGold;

    // Buy leather-armor
    result = buyItem(gold, 'leather-armor');
    expect(result.ok).toBe(true);
    if (result.ok) gold = result.value.newGold;

    // Verify gold decreased twice
    expect(gold).toBeLessThan(1000);
  });

  test('starter kit purchase with exact required gold', () => {
    const unit = mkUnit({ id: 'test', element: 'Venus' });

    // First get the cost
    const testResult = purchaseStarterKit(unit, 10000);
    if (!testResult.ok) throw new Error('Test setup failed');

    const cost = 10000 - testResult.value.newGold;

    // Now purchase with exact cost
    const exactResult = purchaseStarterKit(unit, cost);
    expect(exactResult.ok).toBe(true);
    if (exactResult.ok) {
      expect(exactResult.value.newGold).toBe(0);
    }
  });

  test('purchaseUnitEquipment validates element compatibility first', () => {
    const mercuryUnit = mkUnit({ id: 'mia', element: 'Mercury' });

    // Even with enough gold, should fail element check first
    const result = purchaseUnitEquipment(mercuryUnit, 100000, 'wooden-sword');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      // Should fail on compatibility, not on gold
      expect(result.error).toMatch(/cannot equip/i);
      expect(result.error).not.toMatch(/afford/i);
    }
  });
});

describe('ShopService - Integration', () => {
  test('full purchase flow with starter kit and additional item', () => {
    let gold = 2000;
    const unit = mkUnit({ id: 'isaac', element: 'Venus' });

    // Buy starter kit
    const kitResult = purchaseStarterKit(unit, gold);
    expect(kitResult.ok).toBe(true);
    if (kitResult.ok) {
      gold = kitResult.value.newGold;
      expect(kitResult.value.equipment.length).toBeGreaterThan(0);
    }

    // Buy additional item compatible with Venus
    const itemResult = purchaseUnitEquipment(unit, gold, 'wooden-sword');
    expect(itemResult.ok).toBe(true);
    if (itemResult.ok) {
      gold = itemResult.value.newGold;
    }

    // Should still have some gold left
    expect(gold).toBeGreaterThanOrEqual(0);
  });
});
