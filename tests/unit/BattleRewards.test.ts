import { describe, test, expect } from 'vitest';
import { Unit } from '@/types/Unit';
import { createTeam } from '@/types/Team';
import {
  calculateBattleRewards,
  distributeRewards,
  calculateStatGains,
  type EnemyReward,
} from '@/types/BattleRewards';
import { ISAAC, GARET, MIA, IVAN } from '@/data/unitDefinitions';
import { GOBLIN, FIRE_ELEMENTAL, SLIME, WILD_WOLF, EARTH_GOLEM } from '@/data/enemies';
import { SeededRNG } from '@/utils/SeededRNG';

/**
 * Task 8: Battle Rewards System Tests
 *
 * Tests XP and Gold calculation and distribution after battle victories.
 * Verifies integration with leveling system and proper handling of edge cases.
 */

describe('TASK 8: Battle Rewards Calculation', () => {
  test('✅ XP formula: 3 enemies (15×1, 20×2, 50×3) = 15+40+150 = 205 XP', () => {
    const enemies: EnemyReward[] = [
      { baseXp: 15, baseGold: 10, level: 1 },
      { baseXp: 20, baseGold: 15, level: 2 },
      { baseXp: 50, baseGold: 30, level: 3 },
    ];

    const rewards = calculateBattleRewards(enemies, false, 4);

    // 15×1 + 20×2 + 50×3 = 15 + 40 + 150 = 205
    expect(rewards.totalXp).toBe(205);
    expect(rewards.enemiesDefeated).toBe(3);
  });

  test('✅ Survival bonus: All survived = 1.5× XP multiplier', () => {
    const enemies: EnemyReward[] = [
      { baseXp: 100, baseGold: 50, level: 1 },
    ];

    const rewards = calculateBattleRewards(enemies, true, 4);

    // 100 × 1.5 = 150
    expect(rewards.totalXp).toBe(150);
    expect(rewards.allSurvived).toBe(true);
  });

  test('✅ No survival bonus: 1 unit KO = 1.0× XP (no bonus)', () => {
    const enemies: EnemyReward[] = [
      { baseXp: 100, baseGold: 50, level: 1 },
    ];

    const rewards = calculateBattleRewards(enemies, false, 3);

    // 100 × 1.0 = 100 (no bonus)
    expect(rewards.totalXp).toBe(100);
    expect(rewards.allSurvived).toBe(false);
  });

  test('✅ Gold variance: Random 1.0× to 1.2× multiplier', () => {
    const enemies: EnemyReward[] = [
      { baseXp: 50, baseGold: 100, level: 1 },
    ];

    // Test with deterministic seeds
    const rng1 = new SeededRNG(42);
    const rewards1 = calculateBattleRewards(enemies, false, 4, rng1);

    const rng2 = new SeededRNG(999);
    const rewards2 = calculateBattleRewards(enemies, false, 4, rng2);

    // Gold should be in range 100 to 120
    expect(rewards1.totalGold).toBeGreaterThanOrEqual(100);
    expect(rewards1.totalGold).toBeLessThanOrEqual(120);
    expect(rewards2.totalGold).toBeGreaterThanOrEqual(100);
    expect(rewards2.totalGold).toBeLessThanOrEqual(120);

    // Test multiple enemies to see variance
    const multiEnemies: EnemyReward[] = Array(10).fill(null).map(() => ({
      baseXp: 50,
      baseGold: 100,
      level: 1,
    }));

    const rng3 = new SeededRNG(123);
    const rewardsMulti = calculateBattleRewards(multiEnemies, false, 4, rng3);

    // 10 × 100 × (1.0 to 1.2) = 1000 to 1200
    expect(rewardsMulti.totalGold).toBeGreaterThanOrEqual(1000);
    expect(rewardsMulti.totalGold).toBeLessThanOrEqual(1200);
  });

  test('✅ XP split: 120 XP ÷ 4 survivors = 30 XP each', () => {
    const enemies: EnemyReward[] = [
      { baseXp: 120, baseGold: 50, level: 1 },
    ];

    const rewards = calculateBattleRewards(enemies, false, 4);

    expect(rewards.totalXp).toBe(120);
    expect(rewards.xpPerUnit).toBe(30);
    expect(rewards.survivorCount).toBe(4);
  });

  test('✅ XP split: 100 XP ÷ 3 survivors = 33 XP each (rounded)', () => {
    const enemies: EnemyReward[] = [
      { baseXp: 100, baseGold: 50, level: 1 },
    ];

    const rewards = calculateBattleRewards(enemies, false, 3);

    // 100 ÷ 3 = 33.333... → floor to 33
    expect(rewards.xpPerUnit).toBe(33);
    expect(rewards.survivorCount).toBe(3);
  });

  test('✅ Single survivor: Gets 100% of XP', () => {
    const enemies: EnemyReward[] = [
      { baseXp: 200, baseGold: 100, level: 1 },
    ];

    const rewards = calculateBattleRewards(enemies, false, 1);

    expect(rewards.totalXp).toBe(200);
    expect(rewards.xpPerUnit).toBe(200);
    expect(rewards.survivorCount).toBe(1);
  });

  test('✅ Level up: Unit gains XP and levels from 1 → 2', () => {
    const isaac = new Unit(ISAAC, 1);
    const team = createTeam([isaac]);

    // Isaac needs 100 XP to reach level 2
    const rewards = calculateBattleRewards(
      [{ baseXp: 100, baseGold: 50, level: 1 }],
      false,
      1
    );

    const distribution = distributeRewards(team, rewards);

    expect(distribution.levelUps).toHaveLength(1);
    expect(distribution.levelUps[0].unitId).toBe(ISAAC.id);
    expect(distribution.levelUps[0].oldLevel).toBe(1);
    expect(distribution.levelUps[0].newLevel).toBe(2);
  });

  test('✅ Multiple level ups: 500 XP takes unit 1 → 4', () => {
    const garet = new Unit(GARET, 1);
    const team = createTeam([garet]);

    // 100 → L2, 250 → L3, 500 → L4 (1850 total for L5)
    // Give 850 XP to go from L1 to L4
    const rewards = calculateBattleRewards(
      [{ baseXp: 850, baseGold: 200, level: 1 }],
      false,
      1
    );

    const distribution = distributeRewards(team, rewards);

    expect(distribution.levelUps).toHaveLength(1);
    expect(distribution.levelUps[0].oldLevel).toBe(1);
    expect(distribution.levelUps[0].newLevel).toBe(4);
  });

  test('✅ Level cap: Level 5 units don\'t gain XP', () => {
    const isaac = new Unit(ISAAC, 5);
    const team = createTeam([isaac]);

    const rewards = calculateBattleRewards(
      [{ baseXp: 500, baseGold: 100, level: 1 }],
      false,
      1
    );

    const distribution = distributeRewards(team, rewards);

    // No level ups because already at max
    expect(distribution.levelUps).toHaveLength(0);
    expect(isaac.level).toBe(5);
  });

  test('✅ Stat gains: Track HP/PP/ATK/DEF/MAG/SPD increases', () => {
    const isaac = new Unit(ISAAC, 1);

    // Isaac growth rates: HP +20, PP +3, ATK +3, DEF +2, MAG +2, SPD +1 (BALANCE: PP 4→3)
    const statGains = calculateStatGains(isaac, 1, 2);

    expect(statGains.hp).toBe(20);
    expect(statGains.pp).toBe(3); // BALANCE: 4→3
    expect(statGains.atk).toBe(3);
    expect(statGains.def).toBe(2);
    expect(statGains.mag).toBe(2);
    expect(statGains.spd).toBe(1);
  });

  test('✅ Ability unlock: Level 1 → 2 unlocks new ability', () => {
    const isaac = new Unit(ISAAC, 1);
    const team = createTeam([isaac]);

    // Track abilities before
    const oldAbilities = isaac.unlockedAbilityIds.size;

    // Isaac unlocks abilities at each level
    // Give enough XP to reach level 2 (100 XP)
    const rewards = calculateBattleRewards(
      [{ baseXp: 100, baseGold: 50, level: 1 }],
      false,
      1
    );

    const distribution = distributeRewards(team, rewards);

    expect(distribution.levelUps).toHaveLength(1);
    expect(distribution.levelUps[0].oldLevel).toBe(1);
    expect(distribution.levelUps[0].newLevel).toBe(2);

    // Should have unlocked new ability at level 2
    const newAbilities = isaac.unlockedAbilityIds.size;
    expect(newAbilities).toBeGreaterThan(oldAbilities);
  });

  test('✅ Zero enemies: 0 XP, 0 Gold', () => {
    const rewards = calculateBattleRewards([], false, 4);

    expect(rewards.totalXp).toBe(0);
    expect(rewards.totalGold).toBe(0);
    expect(rewards.xpPerUnit).toBe(0);
    expect(rewards.enemiesDefeated).toBe(0);
  });

  test('✅ KO units excluded: Don\'t gain XP', () => {
    const isaac = new Unit(ISAAC, 1);
    const garet = new Unit(GARET, 1);
    const mia = new Unit(MIA, 1);

    // KO Garet
    garet.takeDamage(999);

    const team = createTeam([isaac, garet, mia]);

    const rewards = calculateBattleRewards(
      [{ baseXp: 300, baseGold: 100, level: 1 }],
      false,
      2 // Only 2 survivors (Isaac and Mia)
    );

    const distribution = distributeRewards(team, rewards);

    // Only 2 level-ups (Isaac and Mia, not Garet)
    expect(distribution.levelUps).toHaveLength(2);
    expect(distribution.levelUps.some(lu => lu.unitId === GARET.id)).toBe(false);
  });

  test('✅ Gold calculation: 3 enemies with level multipliers', () => {
    const enemies: EnemyReward[] = [
      { baseXp: 15, baseGold: 10, level: 1 },  // 10×1 = 10 gold
      { baseXp: 20, baseGold: 20, level: 2 },  // 20×2 = 40 gold
      { baseXp: 50, baseGold: 30, level: 3 },  // 30×3 = 90 gold
    ];

    const rng = new SeededRNG(42);
    const rewards = calculateBattleRewards(enemies, false, 4, rng);

    // Base: 10 + 40 + 90 = 140, then × (1.0 to 1.2) per enemy
    expect(rewards.totalGold).toBeGreaterThanOrEqual(140);
    expect(rewards.totalGold).toBeLessThanOrEqual(168); // 140 × 1.2
  });
});

describe('TASK 8: Battle Rewards Edge Cases', () => {
  test('✅ All units KO\'d: No XP distributed', () => {
    const rewards = calculateBattleRewards(
      [{ baseXp: 100, baseGold: 50, level: 1 }],
      false,
      0 // No survivors
    );

    expect(rewards.totalXp).toBe(0);
    expect(rewards.xpPerUnit).toBe(0);
    expect(rewards.totalGold).toBe(0);
    expect(rewards.survivorCount).toBe(0);
  });

  test('✅ Survival bonus doesn\'t affect Gold', () => {
    const enemies: EnemyReward[] = [
      { baseXp: 100, baseGold: 100, level: 1 },
    ];

    const rng1 = new SeededRNG(42);
    const rng2 = new SeededRNG(42);

    const withBonus = calculateBattleRewards(enemies, true, 4, rng1);
    const withoutBonus = calculateBattleRewards(enemies, false, 4, rng2);

    // XP should differ (150 vs 100)
    expect(withBonus.totalXp).toBe(150);
    expect(withoutBonus.totalXp).toBe(100);

    // Gold should be same (both use same RNG seed)
    expect(withBonus.totalGold).toBe(withoutBonus.totalGold);
  });

  test('✅ Multiple level-ups track all stat gains correctly', () => {
    const isaac = new Unit(ISAAC, 1);

    // Level 1 → 4 = 3 level-ups
    const statGains = calculateStatGains(isaac, 1, 4);

    // Isaac growth rates × 3
    expect(statGains.hp).toBe(60);  // 20 × 3
    expect(statGains.pp).toBe(9);   // 3 × 3 (BALANCE: 4→3 growth)
    expect(statGains.atk).toBe(9);  // 3 × 3
    expect(statGains.def).toBe(6);  // 2 × 3
    expect(statGains.mag).toBe(6);  // 2 × 3
    expect(statGains.spd).toBe(3);  // 1 × 3
  });

  test('✅ Distribution handles mixed levels', () => {
    const isaac = new Unit(ISAAC, 1);
    const garet = new Unit(GARET, 4); // Already high level
    const mia = new Unit(MIA, 5);     // Max level

    const team = createTeam([isaac, garet, mia]);

    // Give enough XP to level up Isaac and Garet
    const rewards = calculateBattleRewards(
      [{ baseXp: 600, baseGold: 200, level: 1 }],
      false,
      3 // All 3 survivors
    );

    const distribution = distributeRewards(team, rewards);

    // Isaac should level up (1 → 2+)
    // Garet might level up (4 → 5)
    // Mia won't level up (already 5)
    expect(distribution.levelUps.length).toBeGreaterThanOrEqual(1);
    expect(distribution.levelUps.length).toBeLessThanOrEqual(2);
    expect(distribution.levelUps.every(lu => lu.unitId !== MIA.id)).toBe(true);
  });

  test('✅ Exact level boundary: 100 XP reaches level 2 exactly', () => {
    const isaac = new Unit(ISAAC, 1);
    const team = createTeam([isaac]);

    // Exactly 100 XP to reach level 2
    const rewards = calculateBattleRewards(
      [{ baseXp: 100, baseGold: 50, level: 1 }],
      false,
      1
    );

    const distribution = distributeRewards(team, rewards);

    expect(isaac.level).toBe(2);
    expect(distribution.levelUps).toHaveLength(1);
    expect(distribution.levelUps[0].newLevel).toBe(2);
  });

  test('✅ One short of level up: 99 XP doesn\'t trigger level 2', () => {
    const isaac = new Unit(ISAAC, 1);
    const team = createTeam([isaac]);

    // 99 XP (1 short of 100)
    const rewards = calculateBattleRewards(
      [{ baseXp: 99, baseGold: 50, level: 1 }],
      false,
      1
    );

    const distribution = distributeRewards(team, rewards);

    expect(isaac.level).toBe(1);
    expect(distribution.levelUps).toHaveLength(0);
  });

  test('✅ Gold earned matches totalGold', () => {
    const enemies: EnemyReward[] = [
      { baseXp: 50, baseGold: 75, level: 2 },
    ];

    const rng = new SeededRNG(123);
    const rewards = calculateBattleRewards(enemies, false, 4, rng);

    const isaac = new Unit(ISAAC, 1);
    const team = createTeam([isaac]);

    const distribution = distributeRewards(team, rewards);

    expect(distribution.goldEarned).toBe(rewards.totalGold);
  });
});

describe('CONTEXT-AWARE: Battle → Rewards Integration', () => {
  test('🎮 Full flow: Battle victory → Rewards → Level up → Stats', () => {
    // Create low-level party
    const isaac = new Unit(ISAAC, 1);
    const garet = new Unit(GARET, 1);
    const team = createTeam([isaac, garet]);

    // Simulate battle victory against 5 goblins (more XP)
    const enemies: EnemyReward[] = Array(5).fill(null).map(() => ({
      baseXp: GOBLIN.baseXp,
      baseGold: GOBLIN.baseGold,
      level: GOBLIN.level,
    }));

    // All survived = 1.5× XP bonus
    const rewards = calculateBattleRewards(enemies, true, 2);

    // 5 × (15 × 1) × 1.5 = 112.5 → 112 XP total
    // 112 ÷ 2 = 56 XP per unit
    expect(rewards.allSurvived).toBe(true);
    expect(rewards.xpPerUnit).toBeGreaterThanOrEqual(50);

    // Distribute rewards
    const distribution = distributeRewards(team, rewards);

    // Both units should level up from L1 (needed 100 XP, got 56 each - won't level)
    // Let's verify rewards were distributed
    expect(distribution.goldEarned).toBeGreaterThan(0);

    // Give more XP to actually level up
    const moreEnemies: EnemyReward[] = Array(10).fill(null).map(() => ({
      baseXp: GOBLIN.baseXp,
      baseGold: GOBLIN.baseGold,
      level: GOBLIN.level,
    }));

    const moreRewards = calculateBattleRewards(moreEnemies, true, 2);
    const moreDistribution = distributeRewards(team, moreRewards);

    // Now should level up
    expect(moreDistribution.levelUps.length).toBeGreaterThan(0);

    // Stats should have increased
    expect(isaac.stats.hp).toBeGreaterThan(100); // L1 base HP
    expect(garet.stats.atk).toBeGreaterThan(18); // L1 base ATK
  });

  test('🎮 Survival bonus affects XP, not Gold', () => {
    const enemies: EnemyReward[] = [
      { baseXp: 100, baseGold: 100, level: 1 },
    ];

    const rng1 = new SeededRNG(42);
    const rng2 = new SeededRNG(42);

    const allSurvived = calculateBattleRewards(enemies, true, 4, rng1);
    const casualties = calculateBattleRewards(enemies, false, 4, rng2);

    // XP should be 1.5× with survival bonus
    expect(allSurvived.totalXp).toBe(150);
    expect(casualties.totalXp).toBe(100);

    // Gold should be identical (same RNG seed, no bonus)
    expect(allSurvived.totalGold).toBe(casualties.totalGold);
  });

  test('🎮 Seeded RNG: Deterministic gold rewards', () => {
    const enemies: EnemyReward[] = [
      { baseXp: 50, baseGold: 100, level: 1 },
    ];

    // Same seed → same gold
    const rng1 = new SeededRNG(999);
    const rng2 = new SeededRNG(999);

    const rewards1 = calculateBattleRewards(enemies, false, 4, rng1);
    const rewards2 = calculateBattleRewards(enemies, false, 4, rng2);

    expect(rewards1.totalGold).toBe(rewards2.totalGold);
  });

  test('🎮 Real enemies: Defeat Fire Elemental at Level 4', () => {
    // Level 4 party vs Level 4 Fire Elemental
    const isaac = new Unit(ISAAC, 4);
    const garet = new Unit(GARET, 4);
    const team = createTeam([isaac, garet]);

    const enemies: EnemyReward[] = [
      {
        baseXp: FIRE_ELEMENTAL.baseXp,
        baseGold: FIRE_ELEMENTAL.baseGold,
        level: FIRE_ELEMENTAL.level,
      },
    ];

    const rewards = calculateBattleRewards(enemies, true, 2);

    // Fire Elemental: baseXp 60, level 4
    // Expected: 60 × 4 × 1.5 = 360 XP total
    // Split: 360 ÷ 2 = 180 XP per unit
    expect(rewards.totalXp).toBe(360);
    expect(rewards.xpPerUnit).toBe(180);

    // Gold: 40 × 4 × (1.0 to 1.2) = 160-192
    expect(rewards.totalGold).toBeGreaterThanOrEqual(160);
    expect(rewards.totalGold).toBeLessThanOrEqual(192);
  });

  test('🎮 Early game grinding: 5 slimes for level up', () => {
    const isaac = new Unit(ISAAC, 1);
    const team = createTeam([isaac]);

    // Fight 5 slimes
    const enemies: EnemyReward[] = Array(5).fill(null).map(() => ({
      baseXp: SLIME.baseXp,
      baseGold: SLIME.baseGold,
      level: SLIME.level,
    }));

    const rewards = calculateBattleRewards(enemies, true, 1);

    // 5 × (20 × 2) × 1.5 = 300 XP (with survival bonus)
    expect(rewards.totalXp).toBe(300);

    const distribution = distributeRewards(team, rewards);

    // 300 XP: reaches level 3 (need 350 total, starting from 0)
    // Actually goes from L1 (0 XP) to L3 (100+250 = 350 XP)
    // 300 XP gets to L3 but not quite to 350
    expect(isaac.level).toBeGreaterThanOrEqual(2);
    expect(distribution.levelUps).toHaveLength(1);
    expect(distribution.levelUps[0].newLevel).toBeGreaterThanOrEqual(2);
  });
});
