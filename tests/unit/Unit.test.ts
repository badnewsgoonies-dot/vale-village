import { describe, test, expect } from 'vitest';
import { Unit } from '@/types/Unit';
import { ISAAC, GARET, IVAN, MIA } from '@/data/unitDefinitions';

describe('TASK 1: Unit Data Models', () => {
  /**
   * Context-Aware Test from TASK_BREAKDOWN.md
   * Verifies Isaac's stats at level 5 match GAME_MECHANICS.md Section 1.3
   */
  test('Isaac level 5 has exact stats from GAME_MECHANICS.md', () => {
    const isaac = new Unit(ISAAC, 5);

    // Expected stats from GAME_MECHANICS.md Section 1.3
    expect(isaac.level).toBe(5);
    expect(isaac.stats.hp).toBe(180);  // 100 + (20 * 4)
    expect(isaac.stats.pp).toBe(36);   // 20 + (4 * 4)
    expect(isaac.stats.atk).toBe(27);  // 15 + (3 * 4)
    expect(isaac.stats.def).toBe(18);  // 10 + (2 * 4)
    expect(isaac.stats.mag).toBe(20);  // 12 + (2 * 4)
    expect(isaac.stats.spd).toBe(16);  // 12 + (1 * 4)
  });

  test('Can instantiate any unit with level', () => {
    const isaac = new Unit(ISAAC, 1);
    const garet = new Unit(GARET, 3);
    const ivan = new Unit(IVAN, 5);

    expect(isaac.name).toBe('Isaac');
    expect(isaac.level).toBe(1);

    expect(garet.name).toBe('Garet');
    expect(garet.level).toBe(3);

    expect(ivan.name).toBe('Ivan');
    expect(ivan.level).toBe(5);
  });

  test('Stats auto-calculate based on level', () => {
    const isaac1 = new Unit(ISAAC, 1);
    const isaac5 = new Unit(ISAAC, 5);

    // Level 1 base stats
    expect(isaac1.stats.hp).toBe(100);
    expect(isaac1.stats.atk).toBe(15);

    // Level 5 should have grown
    expect(isaac5.stats.hp).toBe(180);
    expect(isaac5.stats.atk).toBe(27);

    // Verify growth formula: base + (growth * (level - 1))
    expect(isaac5.stats.hp).toBe(isaac1.stats.hp + (ISAAC.growthRates.hp * 4));
    expect(isaac5.stats.atk).toBe(isaac1.stats.atk + (ISAAC.growthRates.atk * 4));
  });

  test('Equipment slots initialized empty', () => {
    const unit = new Unit(ISAAC, 1);

    expect(unit.equipment.weapon).toBeNull();
    expect(unit.equipment.armor).toBeNull();
    expect(unit.equipment.helm).toBeNull();
    expect(unit.equipment.boots).toBeNull();
  });

  test('Djinn slots initialized empty', () => {
    const unit = new Unit(ISAAC, 1);

    expect(unit.djinn).toEqual([]);
    expect(unit.djinn.length).toBe(0);
  });

  test('All 10 units have correct base stats', () => {
    // Test a few key units to verify data integrity
    const isaac = new Unit(ISAAC, 1);
    const garet = new Unit(GARET, 1);
    const mia = new Unit(MIA, 1);

    // Isaac (Balanced)
    expect(isaac.stats.hp).toBe(100);
    expect(isaac.stats.atk).toBe(15);
    expect(isaac.stats.def).toBe(10);

    // Garet (Pure DPS - high ATK, low DEF)
    expect(garet.stats.hp).toBe(120);
    expect(garet.stats.atk).toBe(18);
    expect(garet.stats.def).toBe(8);

    // Mia (Healer - balanced stats, can heal at level 1)
    expect(mia.stats.hp).toBe(90);
    expect(mia.stats.mag).toBe(16);
    expect(mia.abilities[0].type).toBe('healing');
  });

  test('Abilities unlock at correct levels', () => {
    const isaac = new Unit(ISAAC, 1);
    expect(isaac.unlockedAbilityIds.size).toBe(1); // Only Slash

    const isaac2 = new Unit(ISAAC, 2);
    expect(isaac2.unlockedAbilityIds.size).toBe(2); // Slash + Quake

    const isaac5 = new Unit(ISAAC, 5);
    expect(isaac5.unlockedAbilityIds.size).toBe(5); // All abilities
  });

  test('CurrentHP and CurrentPP initialize to max', () => {
    const isaac = new Unit(ISAAC, 5);

    expect(isaac.currentHp).toBe(isaac.maxHp);
    expect(isaac.currentHp).toBe(180);

    expect(isaac.currentPp).toBe(isaac.maxPp);
    expect(isaac.currentPp).toBe(36);
  });

  test('Unit elements are correct', () => {
    const isaac = new Unit(ISAAC, 1);
    const garet = new Unit(GARET, 1);
    const ivan = new Unit(IVAN, 1);
    const mia = new Unit(MIA, 1);

    expect(isaac.element).toBe('Venus');
    expect(garet.element).toBe('Mars');
    expect(ivan.element).toBe('Jupiter');
    expect(mia.element).toBe('Mercury');
  });

  test('Level clamped to 1-5 range', () => {
    const unitLevel0 = new Unit(ISAAC, 0);
    expect(unitLevel0.level).toBe(1);

    const unitLevel10 = new Unit(ISAAC, 10);
    expect(unitLevel10.level).toBe(5);

    const unitLevel3 = new Unit(ISAAC, 3);
    expect(unitLevel3.level).toBe(3);
  });
});
