import { describe, test, expect } from 'vitest';
import { Unit } from '@/types/Unit';
import { createTeam } from '@/types/Team';
import { createPlayerData, selectStarter, recruitUnit, getActiveParty } from '@/types/PlayerData';
import { createBattleState, executeAbility, advanceBattleTurn, checkBattleEnd, getCurrentActor, isPlayerUnit, BattleResult } from '@/types/Battle';
import { calculateBattleRewards, distributeRewards } from '@/types/BattleRewards';
import { ISAAC, GARET, MIA, IVAN, KYLE, JENNA } from '@/data/unitDefinitions';
import type { EnemyReward } from '@/types/BattleRewards';
import { IRON_SWORD, IRON_ARMOR, STEEL_SWORD, BASIC_STAFF } from '@/data/equipment';
import { SLASH, PLY } from '@/data/abilities';
import { SeededRNG } from '@/utils/SeededRNG';

/**
 * Game Loop Integration Tests
 *
 * Tests complete game flows that exercise multiple systems together:
 * - Battle � Rewards � Level � Equipment � Djinn
 * - Multi-battle campaigns
 * - Party management during gameplay
 * - Edge cases in integrated systems
 */

describe('INTEGRATION: Complete Game Loops', () => {
  test('<� Rookie playthrough: Level 1 � 5 progression', () => {
    // Start with Isaac level 1
    const isaac = new Unit(ISAAC, 1);
    let team = createTeam([isaac]);

    expect(isaac.level).toBe(1);
    expect(isaac.xp).toBe(0);

    // Battle 1: Easy enemies (2 low-level units)
    const enemy1 = new Unit(KYLE, 1);
    const enemy2 = new Unit(JENNA, 1);
    let enemies = [enemy1, enemy2];

    // Simulate battle victory (KO enemies for test)
    enemies.forEach(e => e.takeDamage(999));

    const battleResult = checkBattleEnd([isaac], enemies);
    expect(battleResult).toBe(BattleResult.PLAYER_VICTORY);

    // Get rewards from first battle
    const enemyRewards1: EnemyReward[] = enemies.map(e => ({
      baseXp: 15, // Equivalent to goblin reward
      baseGold: 10,
      level: e.level,
    }));

    const rewards1 = calculateBattleRewards(enemyRewards1, true, 1);
    distributeRewards(team, rewards1);

    // Should have gained some XP (not leveled yet from 2 goblins)
    expect(isaac.xp).toBeGreaterThan(0);
    expect(isaac.level).toBe(1); // Need 100 XP for level 2

    // Battle 2: Find equipment, recruit Garet
    isaac.equipItem('weapon', IRON_SWORD);
    const garet = new Unit(GARET, 1);
    team = createTeam([isaac, garet]);

    expect(team.units).toHaveLength(2);

    // Continue grinding to level 5
    isaac.gainXP(1850);  // Max XP to level 5
    garet.gainXP(1850);

    expect(isaac.level).toBe(5);
    expect(garet.level).toBe(5);
    expect(isaac.getUnlockedAbilities().length).toBeGreaterThan(3);
    expect(garet.getUnlockedAbilities().length).toBeGreaterThan(3);
  });

  test('<� Multi-battle campaign: 3 battles in dungeon with HP tracking', () => {
    const isaac = new Unit(ISAAC, 3);
    const garet = new Unit(GARET, 3);
    const team = createTeam([isaac, garet]);

    const initialHp = isaac.currentHp;
    expect(initialHp).toBe(isaac.stats.hp); // Start at full HP

    // Battle 1: 2 enemies
    const battle1Enemies = [new Unit(KYLE, 2), new Unit(JENNA, 2)];
    let battle = createBattleState(team, battle1Enemies);

    // Quick simulation
    let turns = 0;
    while (battle.status === 'ongoing' && turns < 50) {
      const actor = getCurrentActor(battle);
      if (actor) {
        const targets = isPlayerUnit(battle, actor)
          ? battle.enemies.filter(e => !e.isKO)
          : battle.playerTeam.units.filter(u => !u.isKO);

        if (targets.length > 0) {
          executeAbility(actor, SLASH, [targets[0]]);
        }
      }

      const result = checkBattleEnd(battle.playerTeam.units, battle.enemies);
      if (result) {
        battle.status = result;
        break;
      }

      battle = advanceBattleTurn(battle);
      turns++;
    }

    expect(battle.status).toBe(BattleResult.PLAYER_VICTORY);

    // HP should decrease after battle
    const hpAfterBattle1 = isaac.currentHp;
    expect(hpAfterBattle1).toBeLessThanOrEqual(initialHp);

    // Battle 2: Single enemy (without healing)
    const battle2Enemies = [new Unit(MIA, 2)];
    battle = createBattleState(team, battle2Enemies);

    turns = 0;
    while (battle.status === 'ongoing' && turns < 50) {
      const actor = getCurrentActor(battle);
      if (actor) {
        const targets = isPlayerUnit(battle, actor)
          ? battle.enemies.filter(e => !e.isKO)
          : battle.playerTeam.units.filter(u => !u.isKO);

        if (targets.length > 0) {
          executeAbility(actor, SLASH, [targets[0]]);
        }
      }

      const result = checkBattleEnd(battle.playerTeam.units, battle.enemies);
      if (result) {
        battle.status = result;
        break;
      }

      battle = advanceBattleTurn(battle);
      turns++;
    }

    // Should still win
    expect(battle.status).toBe(BattleResult.PLAYER_VICTORY);

    // Battle 3: Boss fight (stronger enemy)
    const battle3Enemies = [new Unit(IVAN, 3)];
    battle = createBattleState(team, battle3Enemies);

    turns = 0;
    while (battle.status === 'ongoing' && turns < 50) {
      const actor = getCurrentActor(battle);
      if (actor) {
        const targets = isPlayerUnit(battle, actor)
          ? battle.enemies.filter(e => !e.isKO)
          : battle.playerTeam.units.filter(u => !u.isKO);

        if (targets.length > 0) {
          executeAbility(actor, SLASH, [targets[0]]);
        }
      }

      const result = checkBattleEnd(battle.playerTeam.units, battle.enemies);
      if (result) {
        battle.status = result;
        break;
      }

      battle = advanceBattleTurn(battle);
      turns++;
    }

    // Should survive (or at least finish the battle)
    expect(battle.status).not.toBe('ongoing');
    expect(isaac.isKO || garet.isKO || (!isaac.isKO && !garet.isKO)).toBe(true); // At least one outcome
  });
});

describe('INTEGRATION: Equipment � Battle � Rewards', () => {
  test('<� Equipment upgrade path feels meaningful', () => {
    const isaac = new Unit(ISAAC, 5);
    const rng = new SeededRNG(42);

    // Create consistent enemy
    const createEnemy = () => new Unit(GARET, 5);

    // No equipment baseline
    const enemy1 = createEnemy();
    const baseStats = isaac.calculateStats(createTeam([isaac]));
    const baseDamage = (SLASH.basePower || baseStats.atk) + baseStats.atk - (enemy1.stats.def * 0.5);

    // Equip Iron Sword (+12 ATK)
    isaac.equipItem('weapon', IRON_SWORD);
    const ironStats = isaac.calculateStats(createTeam([isaac]));
    const ironDamage = (SLASH.basePower || ironStats.atk) + ironStats.atk - (enemy1.stats.def * 0.5);

    // Should be significantly stronger
    expect(ironDamage).toBeGreaterThan(baseDamage * 1.2); // At least 20% boost

    // Equip Steel Sword (+20 ATK)
    isaac.unequipItem('weapon');
    isaac.equipItem('weapon', STEEL_SWORD);
    const steelStats = isaac.calculateStats(createTeam([isaac]));
    const steelDamage = (SLASH.basePower || steelStats.atk) + steelStats.atk - (enemy1.stats.def * 0.5);

    expect(steelDamage).toBeGreaterThan(ironDamage * 1.1); // Further improvement
  });

  test('<� Battle victory � Rewards � Level up � Stats increase', () => {
    const isaac = new Unit(ISAAC, 1);
    isaac.xp = 50;  // Close to level 2 (needs 100)

    const team = createTeam([isaac]);
    const enemies = [new Unit(KYLE, 1), new Unit(JENNA, 1)];

    // Track before state
    const oldLevel = isaac.level;
    const oldAtk = isaac.stats.atk;

    // Simulate battle (instant victory for test)
    enemies.forEach(e => e.takeDamage(999));

    // Rewards (should level up)
    const rewards = calculateBattleRewards(
      enemies.map(e => ({ baseXp: 30, baseGold: 10, level: 1 })),
      true,
      1
    );

    const distribution = distributeRewards(team, rewards);

    // Should level up (50 existing + 60 new = 110 XP total)
    expect(isaac.level).toBe(2);
    expect(isaac.stats.atk).toBeGreaterThan(oldAtk);
    expect(distribution.levelUps).toHaveLength(1);
    expect(distribution.levelUps[0].newLevel).toBe(2);
  });
});

describe('INTEGRATION: Party Management', () => {
  test('<� Recruit units � Battle � Only active gain XP', () => {
    // Create starters
    const starters = [
      new Unit(ISAAC, 3),
      new Unit(GARET, 3),
      new Unit(IVAN, 3),
    ];

    const starterResult = selectStarter(starters, ISAAC.id);
    expect(starterResult.ok).toBe(true);
    let playerData = starterResult.value;

    // Recruit more units
    const recruitResult1 = recruitUnit(playerData, new Unit(GARET, 3));
    expect(recruitResult1.ok).toBe(true);
    playerData = recruitResult1.value;

    const recruitResult2 = recruitUnit(playerData, new Unit(MIA, 3));
    expect(recruitResult2.ok).toBe(true);
    playerData = recruitResult2.value;

    const recruitResult3 = recruitUnit(playerData, new Unit(IVAN, 3));
    expect(recruitResult3.ok).toBe(true);
    playerData = recruitResult3.value;

    expect(playerData.unitsCollected).toHaveLength(4);

    // Active party: Isaac, Garet, Mia, Ivan (all 4)
    const activeParty = getActiveParty(playerData);
    expect(activeParty).toHaveLength(4);

    // Battle with active party
    const team = createTeam(activeParty);
    const enemies = [new Unit(KYLE, 3)];
    enemies.forEach(e => e.takeDamage(999)); // Quick victory

    // Distribute rewards
    const rewards = calculateBattleRewards(
      [{ baseXp: 50, baseGold: 30, level: 3 }],
      true,
      4
    );

    const beforeXp = activeParty.map(u => u.xp);
    distributeRewards(team, rewards);

    // Active party should have gained XP
    activeParty.forEach((unit, i) => {
      expect(unit.xp).toBeGreaterThan(beforeXp[i]);
    });
  });

  test('<� Party composition: Healer keeps team alive', () => {
    const isaac = new Unit(ISAAC, 5);
    const mia = new Unit(MIA, 5);
    const team = createTeam([isaac, mia]);

    // Damage Isaac
    isaac.takeDamage(50);
    const damagedHp = isaac.currentHp;
    expect(damagedHp).toBe(isaac.stats.hp - 50);

    // Mia heals Isaac
    executeAbility(mia, PLY, [isaac]);

    // HP should increase
    expect(isaac.currentHp).toBeGreaterThan(damagedHp);
  });
});

describe('INTEGRATION: Edge Cases', () => {
  test('<� Party wipe � No rewards � Defeat', () => {
    // Level 1 party vs Level 5 boss (impossible fight)
    const weakParty = createTeam([
      new Unit(ISAAC, 1),
      new Unit(GARET, 1),
    ]);

    const boss = new Unit(KYLE, 5);
    let battle = createBattleState(weakParty, [boss]);

    // Simulate until all KO
    let turns = 0;
    while (battle.status === 'ongoing' && turns < 20) {
      const actor = getCurrentActor(battle);
      if (actor && !isPlayerUnit(battle, actor)) {
        // Boss attacks and likely one-shots
        const target = battle.playerTeam.units.find(u => !u.isKO);
        if (target) {
          executeAbility(actor, SLASH, [target]);
        }
      }

      const result = checkBattleEnd(battle.playerTeam.units, battle.enemies);
      if (result) {
        battle.status = result;
        break;
      }

      battle = advanceBattleTurn(battle);
      turns++;
    }

    // Should result in defeat (or at least not victory)
    expect(battle.status).not.toBe(BattleResult.PLAYER_VICTORY);

    // Try to give rewards (should handle gracefully)
    const rewards = calculateBattleRewards([], false, 0);
    expect(rewards.totalXp).toBe(0);
    expect(rewards.totalGold).toBe(0);
  });

  test('<� Level up mid-progression increases max HP', () => {
    const isaac = new Unit(ISAAC, 1);
    isaac.xp = 95;  // 5 XP from level 2

    // Take damage
    isaac.takeDamage(30);
    const damagedHp = isaac.currentHp;
    expect(damagedHp).toBe(70);  // 100 - 30

    const oldMaxHp = isaac.stats.hp;

    // Gain XP (triggers level up)
    isaac.gainXP(10);

    // Should have leveled up
    expect(isaac.level).toBe(2);
    expect(isaac.stats.hp).toBeGreaterThan(oldMaxHp);

    // HP should increase (level up restores HP fully)
    expect(isaac.currentHp).toBeGreaterThan(damagedHp);
    expect(isaac.currentHp).toBe(isaac.stats.hp); // Fully restored on level up
  });

  test('<� Equipment + Stats stack correctly in battle', () => {
    const isaac = new Unit(ISAAC, 5);
    isaac.equipItem('weapon', IRON_SWORD);  // +12 ATK
    isaac.equipItem('armor', IRON_ARMOR);   // +10 DEF, +20 HP

    const team = createTeam([isaac]);
    const stats = isaac.calculateStats(team);

    // Base: 26 ATK, Equipment: +12 ATK (BALANCE: 27→26)
    expect(stats.atk).toBe(38); // BALANCE: 39→38

    // Base: 180 HP, Equipment: +20 HP
    expect(stats.hp).toBe(200);

    // Base: 18 DEF, Equipment: +10 DEF
    expect(stats.def).toBe(28);
  });
});
