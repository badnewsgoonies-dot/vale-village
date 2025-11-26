/**
 * Tests for reward calculation algorithms
 * Deterministic rewards from encounter data
 */

import { describe, test, expect } from 'vitest';
import {
  calculateBattleRewards,
  calculateStatGains,
  distributeRewards,
} from '../../../src/core/algorithms/rewards';
import { mkUnit, mkTeam } from '../../../src/test/factories';
import { ENCOUNTERS } from '../../../src/data/definitions/encounters';

describe('Reward Algorithms', () => {
  describe('calculateBattleRewards', () => {
    test('should calculate correct XP/gold from encounter data', () => {
      const encounterId = 'house-01';
      const encounter = ENCOUNTERS[encounterId];

      if (!encounter) {
        throw new Error(`Test setup failed: encounter ${encounterId} not found`);
      }

      const rewards = calculateBattleRewards(encounterId, 4);

      expect(rewards.totalXp).toBe(encounter.reward.xp);
      expect(rewards.totalGold).toBe(encounter.reward.gold);
    });

    test('should split XP among survivors', () => {
      const encounterId = 'house-01';
      const encounter = ENCOUNTERS[encounterId];

      if (!encounter) {
        throw new Error(`Test setup failed: encounter ${encounterId} not found`);
      }

      const survivorCount = 3;
      const rewards = calculateBattleRewards(encounterId, survivorCount);

      expect(rewards.xpPerUnit).toBe(Math.floor(encounter.reward.xp / survivorCount));
      expect(rewards.survivorCount).toBe(survivorCount);
    });

    test('should set allSurvived flag when 4 survivors', () => {
      const encounterId = 'house-01';
      const rewards = calculateBattleRewards(encounterId, 4);

      expect(rewards.allSurvived).toBe(true);
    });

    test('should not set allSurvived flag when less than 4 survivors', () => {
      const encounterId = 'house-01';

      const rewards1 = calculateBattleRewards(encounterId, 3);
      expect(rewards1.allSurvived).toBe(false);

      const rewards2 = calculateBattleRewards(encounterId, 1);
      expect(rewards2.allSurvived).toBe(false);
    });

    test('should handle 0 survivors (divide by zero protection)', () => {
      const encounterId = 'house-01';
      const rewards = calculateBattleRewards(encounterId, 0);

      expect(rewards.xpPerUnit).toBe(0);
      expect(rewards.survivorCount).toBe(0);
      expect(rewards.allSurvived).toBe(false);
    });

    test('should throw for invalid encounterId', () => {
      expect(() => {
        calculateBattleRewards('invalid-encounter-id', 4);
      }).toThrow();
    });

    test('should pass through equipment rewards', () => {
      const encounterId = 'house-01';
      const encounter = ENCOUNTERS[encounterId];

      if (!encounter) {
        throw new Error(`Test setup failed: encounter ${encounterId} not found`);
      }

      const rewards = calculateBattleRewards(encounterId, 4);

      expect(rewards.equipmentReward).toEqual(encounter.reward.equipment);
    });

    test('should include enemy count in rewards', () => {
      const encounterId = 'house-01';
      const encounter = ENCOUNTERS[encounterId];

      if (!encounter) {
        throw new Error(`Test setup failed: encounter ${encounterId} not found`);
      }

      const rewards = calculateBattleRewards(encounterId, 4);

      expect(rewards.enemiesDefeated).toBe(encounter.enemies.length);
    });
  });

  describe('calculateStatGains', () => {
    test('should calculate stat gains for single level up', () => {
      const unit = mkUnit({ level: 1 });
      const statGains = calculateStatGains(unit, 1, 2);

      expect(statGains.hp).toBe(unit.growthRates.hp * 1);
      expect(statGains.pp).toBe(unit.growthRates.pp * 1);
      expect(statGains.atk).toBe(unit.growthRates.atk * 1);
      expect(statGains.def).toBe(unit.growthRates.def * 1);
      expect(statGains.mag).toBe(unit.growthRates.mag * 1);
      expect(statGains.spd).toBe(unit.growthRates.spd * 1);
    });

    test('should calculate stat gains for multiple level ups', () => {
      const unit = mkUnit({ level: 5 });
      const levelDiff = 3;
      const statGains = calculateStatGains(unit, 5, 8);

      expect(statGains.hp).toBe(unit.growthRates.hp * levelDiff);
      expect(statGains.atk).toBe(unit.growthRates.atk * levelDiff);
      expect(statGains.def).toBe(unit.growthRates.def * levelDiff);
    });

    test('should return zero gains when no level change', () => {
      const unit = mkUnit({ level: 5 });
      const statGains = calculateStatGains(unit, 5, 5);

      expect(statGains.hp).toBe(0);
      expect(statGains.atk).toBe(0);
      expect(statGains.def).toBe(0);
    });
  });

  describe('distributeRewards', () => {
    test('should give XP to surviving units', () => {
      const units = [
        mkUnit({ id: 'unit1', level: 1, xp: 0, currentHp: 100 }),
        mkUnit({ id: 'unit2', level: 1, xp: 0, currentHp: 100 }),
      ];
      const team = mkTeam(units);

      const rewards = {
        totalXp: 200,
        totalGold: 50,
        xpPerUnit: 100,
        survivorCount: 2,
        allSurvived: true,
        enemiesDefeated: 2,
      };

      const result = distributeRewards(team, rewards);

      expect(result.updatedTeam.units[0]!.xp).toBe(100);
      expect(result.updatedTeam.units[1]!.xp).toBe(100);
    });

    test('should skip KO\'d units when distributing XP', () => {
      const units = [
        mkUnit({ id: 'unit1', level: 1, xp: 0, currentHp: 100 }),
        mkUnit({ id: 'unit2', level: 1, xp: 0, currentHp: 0 }), // KO'd
      ];
      const team = mkTeam(units);

      const rewards = {
        totalXp: 100,
        totalGold: 50,
        xpPerUnit: 100,
        survivorCount: 1,
        allSurvived: false,
        enemiesDefeated: 1,
      };

      const result = distributeRewards(team, rewards);

      expect(result.updatedTeam.units[0]!.xp).toBe(100);
      expect(result.updatedTeam.units[1]!.xp).toBe(0); // No XP for KO'd
    });

    test('should skip max-level units (level 20 cap)', () => {
      const units = [
        mkUnit({ id: 'unit1', level: 20, xp: 92800, currentHp: 100 }), // Max level
        mkUnit({ id: 'unit2', level: 5, xp: 0, currentHp: 100 }),
      ];
      const team = mkTeam(units);

      const rewards = {
        totalXp: 200,
        totalGold: 50,
        xpPerUnit: 100,
        survivorCount: 2,
        allSurvived: true,
        enemiesDefeated: 1,
      };

      const result = distributeRewards(team, rewards);

      // Max-level unit should not gain XP
      expect(result.updatedTeam.units[0]!.xp).toBe(92800);
      expect(result.updatedTeam.units[0]!.level).toBe(20);

      // Normal unit should gain XP
      expect(result.updatedTeam.units[1]!.xp).toBe(100);
    });

    test('should track level-up events', () => {
      const units = [
        mkUnit({ id: 'unit1', level: 1, xp: 0, currentHp: 100 }),
      ];
      const team = mkTeam(units);

      const rewards = {
        totalXp: 100,
        totalGold: 50,
        xpPerUnit: 100,
        survivorCount: 1,
        allSurvived: true,
        enemiesDefeated: 1,
      };

      const result = distributeRewards(team, rewards);

      expect(result.levelUps.length).toBeGreaterThan(0);
      expect(result.levelUps[0]!.unitId).toBe('unit1');
      expect(result.levelUps[0]!.oldLevel).toBe(1);
      expect(result.levelUps[0]!.newLevel).toBe(2);
    });

    test('should include stat gains in level-up events', () => {
      const units = [
        mkUnit({ id: 'unit1', level: 1, xp: 0, currentHp: 100 }),
      ];
      const team = mkTeam(units);

      const rewards = {
        totalXp: 100,
        totalGold: 50,
        xpPerUnit: 100,
        survivorCount: 1,
        allSurvived: true,
        enemiesDefeated: 1,
      };

      const result = distributeRewards(team, rewards);

      const levelUp = result.levelUps[0];
      expect(levelUp).toBeDefined();
      expect(levelUp!.statGains).toBeDefined();
      expect(levelUp!.statGains.hp).toBeGreaterThan(0);
      expect(levelUp!.statGains.atk).toBeGreaterThan(0);
    });

    test('should track multiple level-ups in one battle', () => {
      const units = [
        mkUnit({ id: 'unit1', level: 1, xp: 0, currentHp: 100 }),
      ];
      const team = mkTeam(units);

      const rewards = {
        totalXp: 350, // Enough for level 3
        totalGold: 50,
        xpPerUnit: 350,
        survivorCount: 1,
        allSurvived: true,
        enemiesDefeated: 3,
      };

      const result = distributeRewards(team, rewards);

      expect(result.levelUps.length).toBe(1); // One event per unit
      expect(result.levelUps[0]!.oldLevel).toBe(1);
      expect(result.levelUps[0]!.newLevel).toBe(3);
    });

    test('should unlock abilities on level-up', () => {
      const units = [
        mkUnit({ id: 'unit1', level: 1, xp: 0, currentHp: 100 }),
      ];
      const team = mkTeam(units);

      const rewards = {
        totalXp: 100,
        totalGold: 50,
        xpPerUnit: 100,
        survivorCount: 1,
        allSurvived: true,
        enemiesDefeated: 1,
      };

      const result = distributeRewards(team, rewards);

      const levelUp = result.levelUps[0];
      expect(levelUp).toBeDefined();
      expect(levelUp!.newAbilitiesUnlocked).toBeDefined();
      expect(Array.isArray(levelUp!.newAbilitiesUnlocked)).toBe(true);
    });

    test('should return gold earned', () => {
      const units = [
        mkUnit({ id: 'unit1', level: 1, xp: 0, currentHp: 100 }),
      ];
      const team = mkTeam(units);

      const rewards = {
        totalXp: 100,
        totalGold: 50,
        xpPerUnit: 100,
        survivorCount: 1,
        allSurvived: true,
        enemiesDefeated: 1,
      };

      const result = distributeRewards(team, rewards);

      expect(result.goldEarned).toBe(50);
    });

    test('should handle team with no survivors', () => {
      const units = [
        mkUnit({ id: 'unit1', level: 1, xp: 0, currentHp: 0 }), // KO'd
        mkUnit({ id: 'unit2', level: 1, xp: 0, currentHp: 0 }), // KO'd
      ];
      const team = mkTeam(units);

      const rewards = {
        totalXp: 100,
        totalGold: 50,
        xpPerUnit: 0,
        survivorCount: 0,
        allSurvived: false,
        enemiesDefeated: 1,
      };

      const result = distributeRewards(team, rewards);

      expect(result.levelUps.length).toBe(0);
      expect(result.updatedTeam.units[0]!.xp).toBe(0);
      expect(result.updatedTeam.units[1]!.xp).toBe(0);
    });
  });
});
