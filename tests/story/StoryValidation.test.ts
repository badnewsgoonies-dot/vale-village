import { describe, test, expect } from 'vitest';
import { Unit } from '@/types/Unit';
import { createTeam } from '@/types/Team';
import { executeAbility } from '@/types/Battle';
import { ISAAC, GARET, MIA, IVAN, JENNA, PIERS } from '@/data/unitDefinitions';
import { SLASH, QUAKE, PLY, JUDGMENT } from '@/data/abilities';
import { IRON_SWORD, IRON_ARMOR } from '@/data/equipment';

/**
 * STORY-DRIVEN INTEGRATION TESTS
 *
 * These tests validate that game mechanics match narrative design.
 * Based on Story Director's STORY_DRIVEN_TESTS.md document.
 *
 * Purpose: Prove character personalities, elemental themes, and epic moments
 * work as described in the story documentation.
 */

describe('📖 SUITE 1: Character Personality Validation', () => {

  test('📖 STORY: Isaac is mechanically balanced (not extreme in any stat)', () => {
    const isaac = new Unit(ISAAC, 5);
    const team = createTeam([isaac]);
    const stats = isaac.calculateStats(team);

    // Isaac should have BALANCED stats (no extreme highs/lows)
    const avgStat = (stats.atk + stats.def + stats.mag + stats.spd) / 4;

    // No stat should be 2× higher than average (balanced!)
    expect(stats.atk).toBeLessThan(avgStat * 2);
    expect(stats.def).toBeLessThan(avgStat * 2);
    expect(stats.mag).toBeLessThan(avgStat * 2);
    expect(stats.spd).toBeLessThan(avgStat * 2);

    // HP should be moderate-high (tank aspect)
    expect(stats.hp).toBeGreaterThanOrEqual(150);

    // ← PROVES Isaac's mechanics match his "Balanced Warrior" narrative!
  });

  test('📖 STORY: Garet is glass cannon (extreme ATK, low DEF)', () => {
    const garet = new Unit(GARET, 5);
    const isaac = new Unit(ISAAC, 5);

    const garetTeam = createTeam([garet]);
    const isaacTeam = createTeam([isaac]);

    const garetStats = garet.calculateStats(garetTeam);
    const isaacStats = isaac.calculateStats(isaacTeam);

    // Garet should have HIGHER ATK than Isaac (pure DPS)
    expect(garetStats.atk).toBeGreaterThan(isaacStats.atk);

    // Garet should have LOWER DEF than Isaac (glass cannon)
    expect(garetStats.def).toBeLessThan(isaacStats.def);

    // ← PROVES Garet's "Pure DPS" narrative matches mechanics!
  });

  test('📖 STORY: Mia is effective healer (has healing abilities, good MAG)', () => {
    const mia = new Unit(MIA, 5);

    // Mia should have healing abilities
    const hasHeal = mia.abilities.some(a => a.type === 'healing');
    expect(hasHeal).toBe(true);

    // Mia should have good MAG (for healing power)
    const team = createTeam([mia]);
    const stats = mia.calculateStats(team);
    expect(stats.mag).toBeGreaterThanOrEqual(20); // Good magic power

    // Mia should NOT be a physical powerhouse
    expect(stats.atk).toBeLessThan(stats.mag); // Magic > Physical

    // ← PROVES Mia's "Healer" narrative matches mechanics!
  });

  test('📖 STORY: Jenna is extreme glass cannon (highest MAG, lowest DEF)', () => {
    const allUnits = [
      new Unit(ISAAC, 5),
      new Unit(GARET, 5),
      new Unit(IVAN, 5),
      new Unit(MIA, 5),
      new Unit(JENNA, 5),
    ];

    const jenna = new Unit(JENNA, 5);
    const jennaTeam = createTeam([jenna]);
    const jennaStats = jenna.calculateStats(jennaTeam);

    // Jenna should have HIGHEST MAG among all units
    const allMag = allUnits.map(u => {
      const team = createTeam([u]);
      return u.calculateStats(team).mag;
    });
    expect(jennaStats.mag).toBe(Math.max(...allMag));

    // Jenna should have VERY LOW DEF (glass cannon)
    expect(jennaStats.def).toBeLessThanOrEqual(10);

    // ← PROVES Jenna is the ultimate glass cannon (story accurate)!
  });

  test('📖 STORY: Piers is immovable wall (highest HP/DEF, slowest)', () => {
    const allUnits = [
      new Unit(ISAAC, 5),
      new Unit(GARET, 5),
      new Unit(IVAN, 5),
      new Unit(PIERS, 5),
    ];

    const piers = new Unit(PIERS, 5);
    const piersTeam = createTeam([piers]);
    const piersStats = piers.calculateStats(piersTeam);

    // Piers should have HIGHEST HP
    const allHP = allUnits.map(u => {
      const team = createTeam([u]);
      return u.calculateStats(team).hp;
    });
    expect(piersStats.hp).toBe(Math.max(...allHP));

    // Piers should have HIGHEST DEF
    const allDEF = allUnits.map(u => {
      const team = createTeam([u]);
      return u.calculateStats(team).def;
    });
    expect(piersStats.def).toBe(Math.max(...allDEF));

    // Piers should have LOWEST SPD (slow tank)
    const allSPD = allUnits.map(u => {
      const team = createTeam([u]);
      return u.calculateStats(team).spd;
    });
    expect(piersStats.spd).toBe(Math.min(...allSPD));

    // ← PROVES Piers is the ultimate tank (story accurate)!
  });
});

describe('📖 SUITE 2: Elemental Theme Validation', () => {

  test('📖 STORY: Venus (earth) units have high DEF (defensive theme)', () => {
    const isaac = new Unit(ISAAC, 5);  // Venus
    const ivan = new Unit(IVAN, 5);   // Jupiter

    const isaacTeam = createTeam([isaac]);
    const ivanTeam = createTeam([ivan]);

    const isaacStats = isaac.calculateStats(isaacTeam);
    const ivanStats = ivan.calculateStats(ivanTeam);

    // Venus (earth) should have higher DEF than Jupiter (wind)
    expect(isaacStats.def).toBeGreaterThan(ivanStats.def);

    // ← PROVES Venus = defensive theme!
  });

  test('📖 STORY: Mars (fire) units have high ATK (offensive theme)', () => {
    const garet = new Unit(GARET, 5);  // Mars
    const mia = new Unit(MIA, 5);     // Mercury

    const garetTeam = createTeam([garet]);
    const miaTeam = createTeam([mia]);

    const garetStats = garet.calculateStats(garetTeam);
    const miaStats = mia.calculateStats(miaTeam);

    // Mars (fire) should have higher ATK than Mercury (water/healing)
    expect(garetStats.atk).toBeGreaterThan(miaStats.atk);

    // ← PROVES Mars = offensive theme!
  });

  test('📖 STORY: Mercury (water) units have healing abilities', () => {
    const mia = new Unit(MIA, 5);    // Mercury healer
    const piers = new Unit(PIERS, 5); // Mercury tank

    // At least one Mercury unit should have healing
    const miaHasHeal = mia.abilities.some(a => a.type === 'healing');
    const piersHasHeal = piers.abilities.some(a => a.type === 'healing');

    expect(miaHasHeal || piersHasHeal).toBe(true);

    // ← PROVES Mercury = healing/support theme!
  });

  test('📖 STORY: Jupiter (wind) units have high SPD (speed theme)', () => {
    const ivan = new Unit(IVAN, 5);   // Jupiter
    const piers = new Unit(PIERS, 5); // Mercury

    const ivanTeam = createTeam([ivan]);
    const piersTeam = createTeam([piers]);

    const ivanStats = ivan.calculateStats(ivanTeam);
    const piersStats = piers.calculateStats(piersTeam);

    // Jupiter (wind) should be MUCH faster than Mercury (water)
    expect(ivanStats.spd).toBeGreaterThan(piersStats.spd * 1.5);

    // ← PROVES Jupiter = speed theme!
  });
});

describe('📖 SUITE 4: Epic Moments', () => {

  test('📖 STORY: Clutch heal saves Isaac at low HP (epic moment)', () => {
    const isaac = new Unit(ISAAC, 5);
    const mia = new Unit(MIA, 5);

    // Setup: Isaac at very low HP (about to die)
    isaac.currentHp = 5;

    const playerTeam = createTeam([isaac, mia]);

    // Mia's turn: Heal Isaac
    const result = executeAbility(mia, PLY, [isaac]);

    // Isaac should survive (clutch heal!)
    expect(isaac.currentHp).toBeGreaterThan(5);
    expect(result.healing).toBeGreaterThan(0);

    // ← PROVES "clutch comeback" mechanic works (story moment validated)!
  });

  test('📖 STORY: Isaac\'s Judgment is his most powerful ability', () => {
    const isaac = new Unit(ISAAC, 5);
    const enemy = new Unit(PIERS, 5); // Tanky enemy

    const playerTeam = createTeam([isaac]);

    // Reset enemy HP between tests
    const resetEnemy = () => {
      enemy.currentHp = enemy.maxHp;
    };

    // Test SLASH (basic attack)
    resetEnemy();
    const slash = executeAbility(isaac, SLASH, [enemy]);
    const slashDamage = slash.damage || 0;

    // Test QUAKE (mid-tier ability)
    resetEnemy();
    const quake = executeAbility(isaac, QUAKE, [enemy]);
    const quakeDamage = quake.damage || 0;

    // Test JUDGMENT (ultimate ability)
    resetEnemy();
    const judgment = executeAbility(isaac, JUDGMENT, [enemy]);
    const judgmentDamage = judgment.damage || 0;

    // JUDGMENT should be more powerful than basic attacks
    expect(judgmentDamage).toBeGreaterThan(slashDamage);
    expect(judgmentDamage).toBeGreaterThan(quakeDamage);

    // ← PROVES Isaac's ultimate ability is mechanically his strongest (story accurate)!
  });

  test('📖 STORY: Healing at critical HP creates tension (low HP scenario)', () => {
    const isaac = new Unit(ISAAC, 5);
    const mia = new Unit(MIA, 5);

    // Setup: Isaac takes massive damage (80% HP gone)
    const maxHp = isaac.maxHp;
    isaac.takeDamage(Math.floor(maxHp * 0.8));

    // Isaac should be at critical HP (< 25%)
    expect(isaac.currentHp).toBeLessThan(maxHp * 0.25);
    expect(isaac.isKO).toBe(false); // Still alive!

    // Mia heals Isaac
    const healResult = executeAbility(mia, PLY, [isaac]);

    // Isaac should recover significantly
    expect(healResult.healing).toBeGreaterThan(0);
    expect(isaac.currentHp).toBeGreaterThan(maxHp * 0.25);

    // ← PROVES critical HP healing creates dramatic comeback moments!
  });
});

describe('📖 SUITE 5: Progression & Difficulty Curve', () => {

  test('📖 STORY: Early game (Level 1) characters are weaker than late game (Level 5)', () => {
    const isaacLv1 = new Unit(ISAAC, 1);
    const isaacLv5 = new Unit(ISAAC, 5);

    const lv1Team = createTeam([isaacLv1]);
    const lv5Team = createTeam([isaacLv5]);

    const lv1Stats = isaacLv1.calculateStats(lv1Team);
    const lv5Stats = isaacLv5.calculateStats(lv5Team);

    // Level 5 should be MUCH stronger
    expect(lv5Stats.hp).toBeGreaterThan(lv1Stats.hp * 1.5);
    expect(lv5Stats.atk).toBeGreaterThan(lv1Stats.atk * 1.5);
    expect(lv5Stats.def).toBeGreaterThan(lv1Stats.def * 1.5);

    // ← PROVES progression curve makes leveling meaningful!
  });

  test('📖 STORY: Equipment progression creates power curve', () => {
    const isaac = new Unit(ISAAC, 5);

    const nakedTeam = createTeam([isaac]);
    const nakedStats = isaac.calculateStats(nakedTeam);

    // Equip iron gear (mid-tier)
    isaac.equipItem('weapon', IRON_SWORD);
    isaac.equipItem('armor', IRON_ARMOR);

    const equippedStats = isaac.calculateStats(nakedTeam);

    // Equipment should provide significant boost
    expect(equippedStats.atk).toBeGreaterThan(nakedStats.atk * 1.3);
    expect(equippedStats.hp).toBeGreaterThan(nakedStats.hp);

    // ← PROVES equipment progression creates meaningful power gains!
  });
});
