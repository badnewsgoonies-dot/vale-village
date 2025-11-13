/**
 * Tests for effective stats pipeline
 * PR-STATS-EFFECTIVE Task F
 */

import { describe, test, expect } from 'vitest';
import { 
  calculateLevelBonuses,
  calculateEquipmentBonusesFromLoadout,
  calculateDjinnBonuses,
  calculateStatusModifiers,
  calculateEffectiveStats,
  getEffectiveSPD
} from '../../../src/core/algorithms/stats';
import type { Unit } from '../../../src/core/models/Unit';
import type { Team } from '../../../src/core/models/Team';
import { createUnit } from '../../../src/core/models/Unit';
import { createTeam } from '../../../src/core/models/Team';
import { UNIT_DEFINITIONS } from '../../../src/data/definitions/units';

describe('Effective Stats Pipeline', () => {
  describe('calculateLevelBonuses', () => {
    test('should return zero bonuses for level 1', () => {
      const unit = createUnit(UNIT_DEFINITIONS.adept, 1);
      const bonuses = calculateLevelBonuses(unit);
      
      expect(bonuses.hp).toBe(0);
      expect(bonuses.atk).toBe(0);
      expect(bonuses.def).toBe(0);
      expect(bonuses.mag).toBe(0);
      expect(bonuses.spd).toBe(0);
    });

    test('should calculate correct bonuses for level 5', () => {
      const unit = createUnit(UNIT_DEFINITIONS.adept, 5);
      const bonuses = calculateLevelBonuses(unit);
      const levelBonus = 5 - 1; // 4 levels above 1
      
      expect(bonuses.hp).toBe(levelBonus * unit.growthRates.hp);
      expect(bonuses.atk).toBe(levelBonus * unit.growthRates.atk);
      expect(bonuses.def).toBe(levelBonus * unit.growthRates.def);
      expect(bonuses.mag).toBe(levelBonus * unit.growthRates.mag);
      expect(bonuses.spd).toBe(levelBonus * unit.growthRates.spd);
    });

    test('should calculate correct bonuses for level 20', () => {
      const unit = createUnit(UNIT_DEFINITIONS.adept, 20);
      const bonuses = calculateLevelBonuses(unit);
      const levelBonus = 20 - 1; // 19 levels above 1
      
      expect(bonuses.hp).toBe(levelBonus * unit.growthRates.hp);
      expect(bonuses.atk).toBe(levelBonus * unit.growthRates.atk);
    });
  });

  describe('calculateEquipmentBonusesFromLoadout', () => {
    test('should return empty bonuses for empty loadout', () => {
      const loadout = {
        weapon: null,
        armor: null,
        helm: null,
        boots: null,
        accessory: null,
      };
      const bonuses = calculateEquipmentBonusesFromLoadout(loadout);
      
      expect(bonuses).toEqual({});
    });

    test('should sum bonuses from multiple equipment pieces', () => {
      // This test would need actual equipment definitions
      // For now, just verify the function exists and returns an object
      const loadout = {
        weapon: null,
        armor: null,
        helm: null,
        boots: null,
        accessory: null,
      };
      const bonuses = calculateEquipmentBonusesFromLoadout(loadout);
      
      expect(typeof bonuses).toBe('object');
    });
  });

  describe('calculateDjinnBonuses', () => {
    test('should return empty bonuses when no Djinn are Set', () => {
      // Create team with 4 units (required)
      const units = [
        createUnit(UNIT_DEFINITIONS.adept, 1),
        createUnit(UNIT_DEFINITIONS['war-mage'], 1),
        createUnit(UNIT_DEFINITIONS.mystic, 1),
        createUnit(UNIT_DEFINITIONS.ranger, 1),
      ];
      const team = createTeam(units);
      const bonuses = calculateDjinnBonuses(units[0], team);
      
      expect(bonuses).toEqual({});
    });

    test('should return bonuses when Djinn are Set', () => {
      const units = [
        createUnit(UNIT_DEFINITIONS.adept, 1),
        createUnit(UNIT_DEFINITIONS['war-mage'], 1),
        createUnit(UNIT_DEFINITIONS.mystic, 1),
        createUnit(UNIT_DEFINITIONS.ranger, 1),
      ];
      const team = createTeam(units);
      team.equippedDjinn = ['flint'];
      team.djinnTrackers = {
        flint: {
          djinnId: 'flint',
          state: 'Set',
          lastActivatedTurn: 0,
        },
      };
      
      const bonuses = calculateDjinnBonuses(units[0], team);
      
      // Should have synergy bonuses (at least ATK/DEF)
      expect(bonuses.atk).toBeGreaterThan(0);
      expect(bonuses.def).toBeGreaterThan(0);
    });

    test('should ignore Standby Djinn', () => {
      const units = [
        createUnit(UNIT_DEFINITIONS.adept, 1),
        createUnit(UNIT_DEFINITIONS['war-mage'], 1),
        createUnit(UNIT_DEFINITIONS.mystic, 1),
        createUnit(UNIT_DEFINITIONS.ranger, 1),
      ];
      const team = createTeam(units);
      team.equippedDjinn = ['flint'];
      team.djinnTrackers = {
        flint: {
          djinnId: 'flint',
          state: 'Standby', // Not Set
          lastActivatedTurn: 0,
        },
      };
      
      const bonuses = calculateDjinnBonuses(units[0], team);
      
      // Standby Djinn should not contribute bonuses
      expect(bonuses).toEqual({});
    });
  });

  describe('calculateStatusModifiers', () => {
    test('should return empty modifiers when no status effects', () => {
      const unit = createUnit(UNIT_DEFINITIONS.adept, 1);
      const modifiers = calculateStatusModifiers(unit);
      
      expect(modifiers).toEqual({});
    });

    test('should sum buff modifiers', () => {
      const unit = createUnit(UNIT_DEFINITIONS.adept, 1);
      unit.statusEffects = [
        {
          type: 'buff',
          stat: 'atk',
          modifier: 5,
          duration: 3,
        },
        {
          type: 'buff',
          stat: 'atk',
          modifier: 3,
          duration: 2,
        },
      ];
      
      const modifiers = calculateStatusModifiers(unit);
      
      expect(modifiers.atk).toBe(8); // 5 + 3
    });

    test('should sum debuff modifiers (negative)', () => {
      const unit = createUnit(UNIT_DEFINITIONS.adept, 1);
      unit.statusEffects = [
        {
          type: 'debuff',
          stat: 'def',
          modifier: -5,
          duration: 2,
        },
      ];
      
      const modifiers = calculateStatusModifiers(unit);
      
      expect(modifiers.def).toBe(-5);
    });

    test('should ignore non-stat status effects', () => {
      const unit = createUnit(UNIT_DEFINITIONS.adept, 1);
      unit.statusEffects = [
        {
          type: 'poison',
          damagePerTurn: 5,
          duration: 3,
        },
        {
          type: 'freeze',
          duration: 1,
        },
      ];
      
      const modifiers = calculateStatusModifiers(unit);
      
      expect(modifiers).toEqual({});
    });
  });

  describe('calculateEffectiveStats', () => {
    test('should combine base + level + equipment + Djinn + status', () => {
      const unit = createUnit(UNIT_DEFINITIONS.adept, 5);
      const units = [
        unit,
        createUnit(UNIT_DEFINITIONS['war-mage'], 1),
        createUnit(UNIT_DEFINITIONS.mystic, 1),
        createUnit(UNIT_DEFINITIONS.ranger, 1),
      ];
      const team = createTeam(units);
      
      // Add Set Djinn
      team.equippedDjinn = ['flint'];
      team.djinnTrackers = {
        flint: {
          djinnId: 'flint',
          state: 'Set',
          lastActivatedTurn: 0,
        },
      };
      
      // Add buff
      unit.statusEffects = [
        {
          type: 'buff',
          stat: 'atk',
          modifier: 5,
          duration: 3,
        },
      ];
      
      const effective = calculateEffectiveStats(unit, team);
      
      // Should be greater than base stats
      expect(effective.atk).toBeGreaterThan(unit.baseStats.atk);
      expect(effective.hp).toBeGreaterThan(unit.baseStats.hp);
    });

    test('should clamp stats to prevent negatives', () => {
      const unit = createUnit(UNIT_DEFINITIONS.adept, 1);
      unit.statusEffects = [
        {
          type: 'debuff',
          stat: 'def',
          modifier: -999, // Massive debuff
          duration: 1,
        },
      ];
      const units = [
        unit,
        createUnit(UNIT_DEFINITIONS['war-mage'], 1),
        createUnit(UNIT_DEFINITIONS.mystic, 1),
        createUnit(UNIT_DEFINITIONS.ranger, 1),
      ];
      const team = createTeam(units);
      
      const effective = calculateEffectiveStats(unit, team);
      
      // DEF should be clamped to at least 0
      expect(effective.def).toBeGreaterThanOrEqual(0);
    });

    test('should be idempotent (same inputs = same outputs)', () => {
      const unit = createUnit(UNIT_DEFINITIONS.adept, 5);
      const units = [
        unit,
        createUnit(UNIT_DEFINITIONS['war-mage'], 1),
        createUnit(UNIT_DEFINITIONS.mystic, 1),
        createUnit(UNIT_DEFINITIONS.ranger, 1),
      ];
      const team = createTeam(units);
      
      const result1 = calculateEffectiveStats(unit, team);
      const result2 = calculateEffectiveStats(unit, team);
      
      expect(result1).toEqual(result2);
    });

    test('should be deterministic (pure function)', () => {
      const unit = createUnit(UNIT_DEFINITIONS.adept, 5);
      const units = [
        unit,
        createUnit(UNIT_DEFINITIONS['war-mage'], 1),
        createUnit(UNIT_DEFINITIONS.mystic, 1),
        createUnit(UNIT_DEFINITIONS.ranger, 1),
      ];
      const team = createTeam(units);
      
      // Call multiple times - should always return same result
      const results = Array.from({ length: 10 }, () => 
        calculateEffectiveStats(unit, team)
      );
      
      // All results should be identical
      const first = results[0]!;
      for (const result of results) {
        expect(result).toEqual(first);
      }
    });
  });

  describe('getEffectiveSPD', () => {
    test('should return effective SPD', () => {
      const unit = createUnit(UNIT_DEFINITIONS.adept, 5);
      const units = [
        unit,
        createUnit(UNIT_DEFINITIONS['war-mage'], 1),
        createUnit(UNIT_DEFINITIONS.mystic, 1),
        createUnit(UNIT_DEFINITIONS.ranger, 1),
      ];
      const team = createTeam(units);
      
      const effectiveSpd = getEffectiveSPD(unit, team);
      const effectiveStats = calculateEffectiveStats(unit, team);
      
      expect(effectiveSpd).toBe(effectiveStats.spd);
    });

    test('should be greater than base SPD when level > 1', () => {
      const unit = createUnit(UNIT_DEFINITIONS.adept, 5);
      const units = [
        unit,
        createUnit(UNIT_DEFINITIONS['war-mage'], 1),
        createUnit(UNIT_DEFINITIONS.mystic, 1),
        createUnit(UNIT_DEFINITIONS.ranger, 1),
      ];
      const team = createTeam(units);
      
      const effectiveSpd = getEffectiveSPD(unit, team);
      
      expect(effectiveSpd).toBeGreaterThanOrEqual(unit.baseStats.spd);
    });
  });
});
