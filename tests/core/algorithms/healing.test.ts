/**
 * Tests for healing algorithms
 * Pure utilities for restoring unit HP/status
 */

import { describe, test, expect } from 'vitest';
import { autoHealUnits } from '../../../src/core/algorithms/healing';
import { mkUnit } from '../../../src/test/factories';
import { calculateMaxHp } from '../../../src/core/models/Unit';

describe('Healing Algorithms', () => {
  describe('autoHealUnits', () => {
    test('should restore all units to max HP', () => {
      const units = [
        mkUnit({ currentHp: 50 }),
        mkUnit({ currentHp: 30 }),
        mkUnit({ currentHp: 0 }), // KO'd
      ];

      const healed = autoHealUnits(units);

      for (let i = 0; i < units.length; i++) {
        const maxHp = calculateMaxHp(units[i]!);
        expect(healed[i]!.currentHp).toBe(maxHp);
      }
    });

    test('should clear all status effects', () => {
      const units = [
        mkUnit({
          currentHp: 50,
          statusEffects: [
            { type: 'poison', damagePerTurn: 5, duration: 3 },
            { type: 'buff', stat: 'atk', modifier: 10, duration: 2 },
          ],
        }),
        mkUnit({
          currentHp: 30,
          statusEffects: [
            { type: 'burn', damagePerTurn: 8, duration: 2 },
            { type: 'debuff', stat: 'def', modifier: -5, duration: 1 },
          ],
        }),
      ];

      const healed = autoHealUnits(units);

      for (const unit of healed) {
        expect(unit.statusEffects).toEqual([]);
      }
    });

    test('should work with mixed HP levels', () => {
      const units = [
        mkUnit({ level: 1, currentHp: 10 }),
        mkUnit({ level: 5, currentHp: 50 }),
        mkUnit({ level: 10, currentHp: 100 }),
        mkUnit({ level: 20, currentHp: 200 }),
      ];

      const healed = autoHealUnits(units);

      for (let i = 0; i < units.length; i++) {
        const maxHp = calculateMaxHp(units[i]!);
        expect(healed[i]!.currentHp).toBe(maxHp);
      }
    });

    test('should handle empty unit array', () => {
      const units: ReturnType<typeof mkUnit>[] = [];

      const healed = autoHealUnits(units);

      expect(healed).toEqual([]);
    });

    test('should be pure (not mutate input)', () => {
      const originalUnits = [
        mkUnit({ currentHp: 50 }),
        mkUnit({ currentHp: 30 }),
      ];
      const originalHp = originalUnits.map(u => u.currentHp);

      const healed = autoHealUnits(originalUnits);

      // Original units unchanged
      for (let i = 0; i < originalUnits.length; i++) {
        expect(originalUnits[i]!.currentHp).toBe(originalHp[i]);
      }

      // Healed units are different references
      for (let i = 0; i < healed.length; i++) {
        expect(healed[i]).not.toBe(originalUnits[i]);
      }
    });

    test('should handle units at full HP', () => {
      const units = [
        mkUnit({ level: 1 }),
        mkUnit({ level: 5 }),
      ];

      // Set to max HP
      for (let i = 0; i < units.length; i++) {
        const maxHp = calculateMaxHp(units[i]!);
        units[i]!.currentHp = maxHp;
      }

      const healed = autoHealUnits(units);

      for (let i = 0; i < healed.length; i++) {
        const maxHp = calculateMaxHp(units[i]!);
        expect(healed[i]!.currentHp).toBe(maxHp);
      }
    });

    test('should clear multiple status effects at once', () => {
      const unit = mkUnit({
        currentHp: 50,
        statusEffects: [
          { type: 'poison', damagePerTurn: 5, duration: 3 },
          { type: 'burn', damagePerTurn: 8, duration: 2 },
          { type: 'freeze', duration: 1 },
          { type: 'buff', stat: 'atk', modifier: 10, duration: 2 },
          { type: 'debuff', stat: 'def', modifier: -5, duration: 1 },
          { type: 'shield', remainingCharges: 2, source: 'test' },
        ],
      });

      const healed = autoHealUnits([unit]);

      expect(healed[0]!.statusEffects).toEqual([]);
    });
  });
});
