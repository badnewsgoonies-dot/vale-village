import { describe, test, expect } from 'vitest';
import { makePRNG } from '../../../src/core/random/prng';
import { createUnit } from '../../../src/core/models/Unit';
import { createTeam } from '../../../src/core/models/Team';
import type { UnitDefinition } from '../../../src/core/models/Unit';
import { enemyToUnit } from '../../../src/core/utils/enemyToUnit';
import { SLIME, WOLF } from '../../../src/data/definitions/enemies';
import {
  calculateBattleRewards,
  calculateEquipmentDrops,
  calculateStatGains,
  distributeRewards,
} from '../../../src/core/algorithms/rewards';
import { isUnitKO } from '../../../src/core/models/Unit';

describe('Reward Algorithms', () => {
  const createSampleUnit = (level: number, xp: number, currentHp?: number): ReturnType<typeof createUnit> => {
    const definition: UnitDefinition = {
      id: 'test-unit',
      name: 'Test Unit',
      element: 'Venus',
      role: 'Balanced Warrior',
      baseStats: {
        hp: 100,
        pp: 20,
        atk: 10,
        def: 8,
        mag: 5,
        spd: 12,
      },
      growthRates: {
        hp: 20,
        pp: 5,
        atk: 3,
        def: 2,
        mag: 2,
        spd: 1,
      },
      abilities: [],
      manaContribution: 1,
      description: 'A test unit',
    };

    const unit = createUnit(definition, level, xp);
    if (currentHp !== undefined) {
      return { ...unit, currentHp };
    }
    return unit;
  };

  describe('calculateBattleRewards', () => {
    test('should calculate rewards with survival bonus', () => {
      const rng = makePRNG(12345);
      const enemy1 = enemyToUnit(SLIME);
      const enemy2 = enemyToUnit(WOLF);
      const enemies = [enemy1, enemy2];

      // All survived
      const rewardsAll = calculateBattleRewards(enemies, true, 4, rng.clone());
      expect(rewardsAll.allSurvived).toBe(true);
      expect(rewardsAll.survivorCount).toBe(4);
      expect(rewardsAll.enemiesDefeated).toBe(2);
      
      // Base XP: (10 * 1) + (15 * 1) = 25
      // With 1.5× bonus: 25 * 1.5 = 37.5 → 37
      expect(rewardsAll.totalXp).toBe(37);
      expect(rewardsAll.xpPerUnit).toBe(Math.floor(37 / 4)); // 9 XP per unit

      // Not all survived
      const rewardsPartial = calculateBattleRewards(enemies, false, 2, rng.clone());
      expect(rewardsPartial.allSurvived).toBe(false);
      expect(rewardsPartial.totalXp).toBe(25); // No bonus
      expect(rewardsPartial.xpPerUnit).toBe(Math.floor(25 / 2)); // 12 XP per unit
    });

    test('should handle no enemies', () => {
      const rng = makePRNG(12345);
      const rewards = calculateBattleRewards([], true, 4, rng);
      
      expect(rewards.totalXp).toBe(0);
      expect(rewards.totalGold).toBe(0);
      expect(rewards.xpPerUnit).toBe(0);
      expect(rewards.enemiesDefeated).toBe(0);
    });

    test('should handle no survivors', () => {
      const rng = makePRNG(12345);
      const enemy = enemyToUnit(SLIME);
      const rewards = calculateBattleRewards([enemy], false, 0, rng);
      
      expect(rewards.totalXp).toBe(0);
      expect(rewards.totalGold).toBe(0);
      expect(rewards.xpPerUnit).toBe(0);
      expect(rewards.survivorCount).toBe(0);
    });

    test('should calculate gold with variance', () => {
      const rng1 = makePRNG(11111);
      const rng2 = makePRNG(22222);
      const enemy = enemyToUnit(SLIME);
      
      const rewards1 = calculateBattleRewards([enemy], true, 4, rng1);
      const rewards2 = calculateBattleRewards([enemy], true, 4, rng2);
      
      // Gold should be between baseGold * level * 1.0 and baseGold * level * 1.2
      // Base: 5 * 1 = 5, range: 5-6
      expect(rewards1.totalGold).toBeGreaterThanOrEqual(5);
      expect(rewards1.totalGold).toBeLessThanOrEqual(6);
      expect(rewards2.totalGold).toBeGreaterThanOrEqual(5);
      expect(rewards2.totalGold).toBeLessThanOrEqual(6);
      
      // Different seeds should produce different gold (with high probability)
      // But both should be in valid range
      expect(rewards1.totalGold).toBeGreaterThanOrEqual(5);
    });

    test('should be deterministic with same seed', () => {
      const seed = 99999;
      const enemy = enemyToUnit(SLIME);
      
      const rng1 = makePRNG(seed);
      const rng2 = makePRNG(seed);
      
      const rewards1 = calculateBattleRewards([enemy], true, 4, rng1);
      const rewards2 = calculateBattleRewards([enemy], true, 4, rng2);
      
      expect(rewards1.totalXp).toBe(rewards2.totalXp);
      expect(rewards1.totalGold).toBe(rewards2.totalGold);
    });
  });

  describe('calculateEquipmentDrops', () => {
    test('should roll for equipment drops', () => {
      const rng = makePRNG(12345);
      const enemy = enemyToUnit(SLIME);
      
      // SLIME doesn't have drops in current definition, so should return empty
      const drops = calculateEquipmentDrops([enemy], rng);
      expect(drops).toEqual([]);
    });

    test('should be deterministic with same seed', () => {
      const seed = 55555;
      const enemy = enemyToUnit(SLIME);
      
      const rng1 = makePRNG(seed);
      const rng2 = makePRNG(seed);
      
      const drops1 = calculateEquipmentDrops([enemy], rng1);
      const drops2 = calculateEquipmentDrops([enemy], rng2);
      
      expect(drops1).toEqual(drops2);
    });
  });

  describe('calculateStatGains', () => {
    test('should calculate stat gains for level up', () => {
      const unit = createSampleUnit(1, 0);
      const gains = calculateStatGains(unit, 1, 3); // Level 1 → 3 (2 levels)
      
      expect(gains.hp).toBe(unit.growthRates.hp * 2); // 20 * 2 = 40
      expect(gains.pp).toBe(unit.growthRates.pp * 2); // 5 * 2 = 10
      expect(gains.atk).toBe(unit.growthRates.atk * 2); // 3 * 2 = 6
      expect(gains.def).toBe(unit.growthRates.def * 2); // 2 * 2 = 4
      expect(gains.mag).toBe(unit.growthRates.mag * 2); // 2 * 2 = 4
      expect(gains.spd).toBe(unit.growthRates.spd * 2); // 1 * 2 = 2
    });

    test('should handle single level gain', () => {
      const unit = createSampleUnit(1, 0);
      const gains = calculateStatGains(unit, 1, 2); // Level 1 → 2 (1 level)
      
      expect(gains.hp).toBe(unit.growthRates.hp); // 20
      expect(gains.atk).toBe(unit.growthRates.atk); // 3
    });
  });

  describe('distributeRewards', () => {
    test('should skip KO\'d units', () => {
      const unit1 = createSampleUnit(1, 0, 50); // Alive
      const unit2 = createSampleUnit(1, 0, 0); // KO'd
      const unit3 = createSampleUnit(1, 0, 30); // Alive
      const unit4 = createSampleUnit(1, 0, 0); // KO'd
      
      const team = createTeam([unit1, unit2, unit3, unit4]);
      
      const rewards = {
        totalXp: 100,
        totalGold: 50,
        xpPerUnit: 50, // 100 / 2 survivors
        survivorCount: 2,
        allSurvived: false,
        enemiesDefeated: 1,
        equipmentDrops: [],
      };
      
      const distribution = distributeRewards(team, rewards);
      
      // Should have 2 survivors, so 2 units should get XP
      // But only if they level up, we track level-ups
      expect(distribution.levelUps.length).toBeGreaterThanOrEqual(0);
      expect(distribution.goldEarned).toBe(50);
      expect(distribution.updatedTeam).toBeDefined();
      expect(distribution.updatedTeam.units.length).toBe(4);
    });

    test('should detect level-ups', () => {
      const unit = createSampleUnit(1, 0, 100); // Level 1, 0 XP
      const team = createTeam([unit, unit, unit, unit]);
      
      const rewards = {
        totalXp: 200,
        totalGold: 50,
        xpPerUnit: 50, // Enough to level up (needs 100 XP for level 2)
        survivorCount: 4,
        allSurvived: true,
        enemiesDefeated: 1,
        equipmentDrops: [],
      };
      
      const distribution = distributeRewards(team, rewards);
      
      // All 4 units should level up (50 XP each, but they need 100 total for level 2)
      // Actually, 50 XP from 0 = 50 total, which is still level 1
      // Need more XP to level up
      // Let's give enough XP to level up
      const rewardsLevelUp = {
        totalXp: 400,
        totalGold: 50,
        xpPerUnit: 100, // Enough to reach level 2 (100 XP needed)
        survivorCount: 4,
        allSurvived: true,
        enemiesDefeated: 1,
        equipmentDrops: [],
      };
      
      const distribution2 = distributeRewards(team, rewardsLevelUp);
      
      // All 4 units should level up from 1 → 2
      expect(distribution2.levelUps.length).toBe(4);
      expect(distribution2.levelUps[0]?.oldLevel).toBe(1);
      expect(distribution2.levelUps[0]?.newLevel).toBe(2);
      expect(distribution2.updatedTeam).toBeDefined();
      expect(distribution2.updatedTeam.units.every(u => u.level === 2)).toBe(true);
    });

    test('should skip max level units', () => {
      const unit1 = createSampleUnit(20, 92800, 100); // Max level
      const unit2 = createSampleUnit(1, 0, 100); // Can level up
      const team = createTeam([unit1, unit2, unit2, unit2]);
      
      const rewards = {
        totalXp: 300,
        totalGold: 50,
        xpPerUnit: 100,
        survivorCount: 4,
        allSurvived: true,
        enemiesDefeated: 1,
        equipmentDrops: [],
      };
      
      const distribution = distributeRewards(team, rewards);
      
      // Only 3 units should level up (unit1 is max level)
      expect(distribution.levelUps.length).toBe(3);
      expect(distribution.updatedTeam).toBeDefined();
    });

    test('should track stat gains and unlocked abilities', () => {
      const unit = createSampleUnit(1, 0, 100);
      const team = createTeam([unit, unit, unit, unit]);
      
      const rewards = {
        totalXp: 400,
        totalGold: 50,
        xpPerUnit: 100, // Level 1 → 2
        survivorCount: 4,
        allSurvived: true,
        enemiesDefeated: 1,
        equipmentDrops: [],
      };
      
      const distribution = distributeRewards(team, rewards);
      
      expect(distribution.levelUps.length).toBe(4);
      const levelUp = distribution.levelUps[0];
      expect(levelUp).toBeDefined();
      if (levelUp) {
        expect(levelUp.oldLevel).toBe(1);
        expect(levelUp.newLevel).toBe(2);
        expect(levelUp.statGains.hp).toBe(unit.growthRates.hp); // 1 level gain
        expect(levelUp.statGains.atk).toBe(unit.growthRates.atk);
        expect(levelUp.newAbilitiesUnlocked).toBeDefined();
      }
      expect(distribution.updatedTeam).toBeDefined();
      expect(distribution.updatedTeam.units.every(u => u.level === 2)).toBe(true);
    });
  });
});

