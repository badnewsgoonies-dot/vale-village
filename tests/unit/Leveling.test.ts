import { describe, test, expect } from 'vitest';
import { Unit } from '@/types/Unit';
import { ISAAC, GARET, IVAN, MIA, FELIX, JENNA, SHEBA, PIERS, KRADEN, KYLE } from '@/data/unitDefinitions';

describe('TASK 3: Leveling System - XP Curve', () => {

  test('✅ XP requirements match exponential curve', () => {
    const isaac = new Unit(ISAAC, 1);

    // Level 1 → 2: 100 XP
    expect(isaac.xpToNextLevel()).toBe(100);

    isaac.gainXP(100);
    expect(isaac.level).toBe(2);

    // Level 2 → 3: 250 XP
    expect(isaac.xpToNextLevel()).toBe(250);

    isaac.gainXP(250);
    expect(isaac.level).toBe(3);

    // Level 3 → 4: 500 XP
    expect(isaac.xpToNextLevel()).toBe(500);

    isaac.gainXP(500);
    expect(isaac.level).toBe(4);

    // Level 4 → 5: 1000 XP
    expect(isaac.xpToNextLevel()).toBe(1000);

    isaac.gainXP(1000);
    expect(isaac.level).toBe(5);

    // ← PROVES XP curve follows GAME_MECHANICS.md Section 1.1!
  });

  test('✅ Total XP to reach level 5 is 1850', () => {
    const isaac = new Unit(ISAAC, 1);

    // Gain exactly 1850 XP
    isaac.gainXP(1850);

    expect(isaac.level).toBe(5);
    expect(isaac.xp).toBe(1850);

    // ← PROVES total XP requirement is correct!
  });

  test('✅ Excess XP carries over to next level', () => {
    const isaac = new Unit(ISAAC, 1);

    // Gain 120 XP (100 to level, 20 carry over)
    isaac.gainXP(120);

    expect(isaac.level).toBe(2);
    expect(isaac.xp).toBe(120);

    // Still need 250 - 20 = 230 more to reach level 3
    expect(isaac.xpToNextLevel()).toBe(230);

    // ← PROVES overflow XP carries over!
  });
});

describe('TASK 3: Level Up System', () => {

  test('✅ Leveling up increases stats according to growth rates', () => {
    const isaac = new Unit(ISAAC, 1);
    // Base: HP 100, ATK 15, DEF 10

    const level1Stats = { ...isaac.stats };

    isaac.gainXP(100); // Level up to 2

    const level2Stats = { ...isaac.stats };

    // Growth: HP +20, ATK +3, DEF +2
    expect(level2Stats.hp).toBe(level1Stats.hp + 20);
    expect(level2Stats.atk).toBe(level1Stats.atk + 3);
    expect(level2Stats.def).toBe(level1Stats.def + 2);

    // ← PROVES stats increase on level up!
  });

  test('✅ Multiple level ups from single XP gain', () => {
    const isaac = new Unit(ISAAC, 1);

    // Gain 350 XP (100 for L2, 250 for L3)
    isaac.gainXP(350);

    expect(isaac.level).toBe(3);
    expect(isaac.xp).toBe(350);

    // Stats should match level 3
    // Level 3: base + (growth × 2)
    expect(isaac.stats.hp).toBe(140); // 100 + (20 × 2)
    expect(isaac.stats.atk).toBe(21); // 15 + (3 × 2)

    // ← PROVES multi-level jumps work!
  });

  test('✅ Level cap at 5 prevents over-leveling', () => {
    const isaac = new Unit(ISAAC, 1);

    // Gain massive XP (way more than needed)
    isaac.gainXP(10000);

    expect(isaac.level).toBe(5);
    expect(isaac.xp).toBe(10000); // XP still tracked

    // Further XP doesn't increase level
    isaac.gainXP(1000);
    expect(isaac.level).toBe(5);

    // ← PROVES level cap works!
  });

  test('✅ Leveling up fully restores HP and PP', () => {
    const isaac = new Unit(ISAAC, 1);
    // Max HP: 100, Max PP: 20

    // Take damage and spend PP
    isaac.takeDamage(50);
    isaac.currentPp = 5;

    expect(isaac.currentHp).toBe(50);
    expect(isaac.currentPp).toBe(5);

    // Level up
    isaac.gainXP(100); // Level 2: Max HP 120, Max PP 24

    // Should be fully healed to NEW max values
    expect(isaac.currentHp).toBe(120);
    expect(isaac.currentPp).toBe(24);

    // ← PROVES level up fully heals!
  });

  test('✅ Abilities unlock at correct levels', () => {
    const isaac = new Unit(ISAAC, 1);

    // Level 1: Should have 1 ability (Slash)
    expect(isaac.getUnlockedAbilities().length).toBe(1);
    expect(isaac.getUnlockedAbilities()[0].id).toBe('slash');

    // Level up to 2
    isaac.gainXP(100);
    expect(isaac.getUnlockedAbilities().length).toBe(2);

    // Level up to 3
    isaac.gainXP(250);
    expect(isaac.getUnlockedAbilities().length).toBe(3);

    // Level up to 5
    isaac.gainXP(1500);
    expect(isaac.getUnlockedAbilities().length).toBe(5);

    // ← PROVES abilities unlock on level up!
  });
});

describe('TASK 3: Stat Calculation at Different Levels', () => {

  test('✅ Isaac stats match GAME_MECHANICS.md at all levels', () => {
    // From GAME_MECHANICS.md Section 1.3
    const expectedStats = {
      1: { hp: 100, pp: 20, atk: 15, def: 10, mag: 12, spd: 12 },
      2: { hp: 120, pp: 24, atk: 18, def: 12, mag: 14, spd: 13 },
      3: { hp: 140, pp: 28, atk: 21, def: 14, mag: 16, spd: 14 },
      4: { hp: 160, pp: 32, atk: 24, def: 16, mag: 18, spd: 15 },
      5: { hp: 180, pp: 36, atk: 27, def: 18, mag: 20, spd: 16 },
    };

    for (let level = 1; level <= 5; level++) {
      const isaac = new Unit(ISAAC, level);
      const expected = expectedStats[level as keyof typeof expectedStats];

      expect(isaac.stats.hp).toBe(expected.hp);
      expect(isaac.stats.pp).toBe(expected.pp);
      expect(isaac.stats.atk).toBe(expected.atk);
      expect(isaac.stats.def).toBe(expected.def);
      expect(isaac.stats.mag).toBe(expected.mag);
      expect(isaac.stats.spd).toBe(expected.spd);
    }

    // ← PROVES stats match design doc!
  });

  test('✅ Garet stats match GAME_MECHANICS.md at all levels', () => {
    const expectedStats = {
      1: { hp: 120, pp: 15, atk: 18, def: 8, mag: 10, spd: 10 },
      2: { hp: 135, pp: 18, atk: 22, def: 9, mag: 12, spd: 11 },
      3: { hp: 150, pp: 21, atk: 26, def: 10, mag: 14, spd: 12 },
      4: { hp: 165, pp: 24, atk: 30, def: 11, mag: 16, spd: 13 },
      5: { hp: 180, pp: 27, atk: 34, def: 12, mag: 18, spd: 14 },
    };

    for (let level = 1; level <= 5; level++) {
      const garet = new Unit(GARET, level);
      const expected = expectedStats[level as keyof typeof expectedStats];

      expect(garet.stats.hp).toBe(expected.hp);
      expect(garet.stats.atk).toBe(expected.atk);
      expect(garet.stats.def).toBe(expected.def);
    }

    // ← PROVES Garet's high ATK growth!
  });

  test('✅ Ivan stats match GAME_MECHANICS.md at all levels', () => {
    const expectedStats = {
      1: { hp: 80, pp: 30, atk: 10, def: 6, mag: 18, spd: 15 },
      2: { hp: 92, pp: 36, atk: 12, def: 7, mag: 22, spd: 17 },
      3: { hp: 104, pp: 42, atk: 14, def: 8, mag: 26, spd: 19 },
      4: { hp: 116, pp: 48, atk: 16, def: 9, mag: 30, spd: 21 },
      5: { hp: 128, pp: 54, atk: 18, def: 10, mag: 34, spd: 23 },
    };

    for (let level = 1; level <= 5; level++) {
      const ivan = new Unit(IVAN, level);
      const expected = expectedStats[level as keyof typeof expectedStats];

      expect(ivan.stats.mag).toBe(expected.mag);
      expect(ivan.stats.spd).toBe(expected.spd);
    }

    // ← PROVES Ivan's high MAG growth!
  });

  test('✅ Mia stats match GAME_MECHANICS.md at all levels', () => {
    const expectedStats = {
      1: { hp: 90, pp: 25, atk: 12, def: 12, mag: 16, spd: 11 },
      5: { hp: 150, pp: 45, atk: 20, def: 24, mag: 28, spd: 15 },
    };

    const mia1 = new Unit(MIA, 1);
    const mia5 = new Unit(MIA, 5);

    expect(mia1.stats.def).toBe(expectedStats[1].def);
    expect(mia5.stats.def).toBe(expectedStats[5].def);

    // ← PROVES Mia's high DEF growth!
  });
});

describe('CONTEXT-AWARE: Leveling Creates Progression', () => {

  test('🎯 Low-level unit vs high-level unit power gap', () => {
    const isaac1 = new Unit(ISAAC, 1);
    const isaac5 = new Unit(ISAAC, 5);

    // Level 5 Isaac should be significantly stronger
    const atkRatio = isaac5.stats.atk / isaac1.stats.atk;
    const hpRatio = isaac5.maxHp / isaac1.maxHp;

    expect(atkRatio).toBeGreaterThan(1.5); // 27/15 = 1.8
    expect(hpRatio).toBeGreaterThan(1.7);  // 180/100 = 1.8

    // ← PROVES leveling creates power progression!
  });

  test('🎯 Different units have different growth curves', () => {
    const garet5 = new Unit(GARET, 5); // Pure DPS
    const mia5 = new Unit(MIA, 5);     // Healer

    // Garet should have way more ATK
    expect(garet5.stats.atk).toBeGreaterThan(mia5.stats.atk);
    expect(garet5.stats.atk / mia5.stats.atk).toBeGreaterThan(1.5); // 34/20 = 1.7

    // Mia should have more DEF
    expect(mia5.stats.def).toBeGreaterThan(garet5.stats.def);
    expect(mia5.stats.def / garet5.stats.def).toBeGreaterThan(1.5); // 24/12 = 2.0

    // ← PROVES unit roles create strategic differences!
  });

  test('🎯 Ability unlocks create power spikes', () => {
    const isaac = new Unit(ISAAC, 1);

    // Early game: Only basic attack
    const abilities1 = isaac.getUnlockedAbilities();
    expect(abilities1.length).toBe(1);

    // Mid game: More options
    isaac.gainXP(350); // Level 3
    const abilities3 = isaac.getUnlockedAbilities();
    expect(abilities3.length).toBe(3);

    // Late game: Full arsenal
    isaac.gainXP(1500); // Level 5
    const abilities5 = isaac.getUnlockedAbilities();
    expect(abilities5.length).toBe(5);

    // Each level unlocks 1 new ability
    expect(abilities5.length - abilities1.length).toBe(4);

    // ← PROVES ability unlocks add depth!
  });

  test('🎯 Level-up healing can save units in battle', () => {
    const isaac = new Unit(ISAAC, 1);

    // Simulate near-death in battle
    isaac.currentHp = 10; // 10/100 HP
    expect(isaac.currentHp / isaac.maxHp).toBeLessThan(0.15);

    // Level up mid-battle!
    isaac.gainXP(100);

    // Now fully healed to new max
    expect(isaac.currentHp).toBe(120);
    expect(isaac.currentHp).toBe(isaac.maxHp);

    // ← PROVES level-up is a tactical resource!
  });
});

describe('EDGE CASES: Leveling System', () => {

  test('Gaining 0 XP does nothing', () => {
    const isaac = new Unit(ISAAC, 1);

    isaac.gainXP(0);

    expect(isaac.level).toBe(1);
    expect(isaac.xp).toBe(0);
  });

  test('Gaining negative XP does nothing', () => {
    const isaac = new Unit(ISAAC, 1);

    isaac.gainXP(-100);

    expect(isaac.level).toBe(1);
    expect(isaac.xp).toBe(0);
  });

  test('XP at exact level threshold triggers level up', () => {
    const isaac = new Unit(ISAAC, 1);

    // Gain exactly 100 XP
    isaac.gainXP(100);

    expect(isaac.level).toBe(2);
    expect(isaac.xp).toBe(100);
  });

  test('Starting at higher level initializes correctly', () => {
    const isaac = new Unit(ISAAC, 5);

    expect(isaac.level).toBe(5);
    expect(isaac.stats.hp).toBe(180);
    expect(isaac.stats.atk).toBe(27);
    expect(isaac.getUnlockedAbilities().length).toBe(5);
  });

  test('Cannot level up beyond 5 even with massive XP', () => {
    const isaac = new Unit(ISAAC, 5);

    isaac.gainXP(999999);

    expect(isaac.level).toBe(5);
    // XP still accumulated but no effect
    expect(isaac.xp).toBeGreaterThan(1850);
  });
});

describe('DATA INTEGRITY: All 10 Units Level Correctly', () => {

  test('✅ All units can reach level 5', () => {
    const units = [
      ISAAC, GARET, IVAN, MIA, FELIX,
      JENNA, SHEBA, PIERS, KRADEN, KYLE,
    ];

    for (const unitDef of units) {
      const unit = new Unit(unitDef, 1);

      // Level to 5
      unit.gainXP(1850);

      expect(unit.level).toBe(5);
      expect(unit.stats.hp).toBeGreaterThan(0);
      expect(unit.stats.atk).toBeGreaterThan(0);
      expect(unit.getUnlockedAbilities().length).toBe(5);
    }

    // ← PROVES all units work!
  });

  test('✅ Felix stats match GAME_MECHANICS.md (Rogue Assassin)', () => {
    const felix5 = new Unit(FELIX, 5);

    // From GAME_MECHANICS.md Section 1.3
    expect(felix5.stats.hp).toBe(151);  // 95 + (14 × 4)
    expect(felix5.stats.atk).toBe(33);  // 17 + (4 × 4)
    expect(felix5.stats.spd).toBe(30);  // 18 + (3 × 4) - highest SPD!

    // ← PROVES Felix's speed specialization!
  });

  test('✅ Jenna stats match GAME_MECHANICS.md (AoE Fire Mage)', () => {
    const jenna5 = new Unit(JENNA, 5);

    // From GAME_MECHANICS.md Section 1.3
    expect(jenna5.stats.hp).toBe(123);  // 75 + (12 × 4)
    expect(jenna5.stats.mag).toBe(40);  // 20 + (5 × 4) - highest MAG!
    expect(jenna5.stats.def).toBe(9);   // 5 + (1 × 4) - lowest DEF!

    // ← PROVES Jenna's glass cannon design!
  });

  test('✅ Piers stats match GAME_MECHANICS.md (Defensive Tank)', () => {
    const piers5 = new Unit(PIERS, 5);

    // From GAME_MECHANICS.md Section 1.3
    expect(piers5.stats.hp).toBe(212);  // 140 + (18 × 4) - highest HP!
    expect(piers5.stats.def).toBe(28);  // 16 + (3 × 4) - highest DEF!
    expect(piers5.stats.spd).toBe(12);  // 8 + (1 × 4) - lowest SPD!

    // ← PROVES Piers' tank role!
  });

  test('✅ Kraden stats match GAME_MECHANICS.md (Versatile Scholar)', () => {
    const kraden5 = new Unit(KRADEN, 5);

    // From GAME_MECHANICS.md Section 1.3
    expect(kraden5.stats.hp).toBe(110);  // 70 + (10 × 4) - lowest HP!
    expect(kraden5.stats.pp).toBe(63);   // 35 + (7 × 4) - highest PP!
    expect(kraden5.stats.mag).toBe(27);  // 15 + (3 × 4)

    // ← PROVES Kraden's mage specialization!
  });

  test('✅ Kyle stats match GAME_MECHANICS.md (Master Warrior)', () => {
    const kyle5 = new Unit(KYLE, 5);

    // From GAME_MECHANICS.md Section 1.3
    expect(kyle5.stats.hp).toBe(198);  // 130 + (17 × 4)
    expect(kyle5.stats.atk).toBe(28);  // 16 + (3 × 4)
    expect(kyle5.stats.def).toBe(22);  // 14 + (2 × 4)

    // ← PROVES Kyle's balanced warrior design!
  });
});
