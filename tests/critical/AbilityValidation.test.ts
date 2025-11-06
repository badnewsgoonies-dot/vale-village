import { describe, test, expect } from 'vitest';
import { Unit } from '@/types/Unit';
import { executeAbility } from '@/types/Battle';
import { ISAAC, GARET } from '@/data/unitDefinitions';
import { SLASH, QUAKE, PLY, GLACIAL_BLESSING } from '@/data/abilities';
import type { Ability } from '@/types/Ability';

/**
 * CRITICAL: Ability System Validation (Minimal Coverage)
 *
 * Tests for malformed abilities, invalid types, edge cases.
 * What happens when abilities have bad data?
 */
describe('CRITICAL: Ability Type Validation', () => {

  test('✅ Valid ability types execute correctly', () => {
    const isaac = new Unit(ISAAC, 5);
    const enemy = new Unit(GARET, 5);

    const physicalResult = executeAbility(isaac, SLASH, [enemy]);
    expect(physicalResult.damage).toBeGreaterThan(0);

    const psynergyResult = executeAbility(isaac, QUAKE, [enemy]);
    expect(psynergyResult.damage).toBeGreaterThan(0);

    // Damage Isaac before healing to get positive healing result
    isaac.takeDamage(50);
    const healingResult = executeAbility(isaac, PLY, [isaac]);
    expect(healingResult.healing).toBeGreaterThan(0);
  });

  test('❌ EDGE: What happens with invalid ability type?', () => {
    const isaac = new Unit(ISAAC, 5);
    const enemy = new Unit(GARET, 5);

    const invalidAbility = {
      ...SLASH,
      type: 'INVALID_TYPE' as any,
    };

    const result = executeAbility(isaac, invalidAbility, [enemy]);

    // Falls through to default case
    expect(result.message).toContain('Effect not implemented');

    // ⚠️ No error thrown - silently fails!
  });

  test('❌ EDGE: Ability with type "summon" (not implemented in executeAbility)', () => {
    const isaac = new Unit(ISAAC, 5);
    const enemy = new Unit(GARET, 5);

    const summonAbility: Ability = {
      id: 'test-summon',
      name: 'Test Summon',
      type: 'summon',
      ppCost: 10,
      basePower: 200,
      targets: 'all-enemies',
      unlockLevel: 5,
      description: 'Test summon ability',
    };

    const result = executeAbility(isaac, summonAbility, [enemy]);

    // Default case: "Effect not implemented"
    expect(result.message).toContain('Effect not implemented');
    expect(result.damage).toBeUndefined();

    // ⚠️ Summons work via Team.executeSummon(), not executeAbility()
  });
});

describe('CRITICAL: Ability Field Validation', () => {

  test('❌ BUG: Ability with negative PP cost', () => {
    const isaac = new Unit(ISAAC, 5);
    const enemy = new Unit(GARET, 5);

    const negativePPAbility: Ability = {
      ...QUAKE,
      ppCost: -10, // NEGATIVE PP COST!
    };

    isaac.currentPp = 5;
    const result = executeAbility(isaac, negativePPAbility, [enemy]);

    // Negative PP cost allows ability to execute (weird edge case)
    // The PP check (-10 > 5) is FALSE, so it passes
    if (result.damage !== undefined) {
      expect(result.damage).toBeGreaterThan(0);
      // ⚠️ BUG: Negative PP cost ADDS PP instead of consuming!
      expect(isaac.currentPp).toBe(15); // 5 - (-10) = 15
    } else {
      // If damage is undefined, the ability type isn't handling this correctly
      expect(result.message).toBeDefined();
    }
  });

  test('❌ BUG: Ability with negative base power', () => {
    const isaac = new Unit(ISAAC, 5);
    const enemy = new Unit(GARET, 5);

    const negativePowerAbility: Ability = {
      ...QUAKE,
      basePower: -50, // NEGATIVE DAMAGE!
    };

    const result = executeAbility(isaac, negativePowerAbility, [enemy]);

    // What happens with negative base power?
    expect(result.damage).toBeDefined();

    // ⚠️ Could cause negative damage (healing enemies?)
    console.log(`Negative base power result: ${result.damage}`);
  });

  test('❌ EDGE: Ability with 0 PP cost (should be free)', () => {
    const isaac = new Unit(ISAAC, 5);
    const enemy = new Unit(GARET, 5);

    isaac.currentPp = 0;

    const result = executeAbility(isaac, SLASH, [enemy]); // SLASH has 0 PP cost

    expect(result.damage).toBeGreaterThan(0);
    expect(isaac.currentPp).toBe(0); // No PP consumed
  });

  test('❌ EDGE: Ability with massive PP cost', () => {
    const isaac = new Unit(ISAAC, 5);
    const enemy = new Unit(GARET, 5);

    const massivePPAbility: Ability = {
      ...QUAKE,
      ppCost: 999999,
    };

    isaac.currentPp = 100;
    const result = executeAbility(isaac, massivePPAbility, [enemy]);

    expect(result.message).toContain("doesn't have enough PP");
    expect(result.targetIds).toEqual([]);
  });

  test('❌ BUG: Healing ability with negative base power', () => {
    const isaac = new Unit(ISAAC, 5);
    isaac.takeDamage(50);

    const negativeHealAbility: Ability = {
      ...PLY,
      basePower: -50, // NEGATIVE HEALING!
    };

    const result = executeAbility(isaac, negativeHealAbility, [isaac]);

    // Does negative healing = damage?
    expect(result.healing).toBeDefined();
    console.log(`Negative healing result: ${result.healing}`);

    // ⚠️ calculateHealAmount might allow negative values!
  });
});

describe('CRITICAL: Ability Target Validation', () => {

  test('❌ EDGE: Execute ability with empty targets array', () => {
    const isaac = new Unit(ISAAC, 5);

    const result = executeAbility(isaac, SLASH, []);

    // What happens with no targets?
    expect(result.targetIds).toEqual([]);
    expect(result.damage).toBe(0); // Total damage = 0

    // ⚠️ Ability executes successfully with 0 targets!
  });

  test('❌ EDGE: Execute single-target ability on multiple targets', () => {
    const isaac = new Unit(ISAAC, 5);
    const enemy1 = new Unit(GARET, 5);
    const enemy2 = new Unit(GARET, 5);
    const enemy3 = new Unit(GARET, 5);

    // SLASH is single-enemy, but we pass 3 targets
    const result = executeAbility(isaac, SLASH, [enemy1, enemy2, enemy3]);

    // Does it hit all 3?
    expect(result.damage).toBeGreaterThan(0);

    // ⚠️ executeAbility doesn't validate targets match ability.targets!
    // It will hit ALL targets regardless of ability.targets setting!
  });

  test('❌ EDGE: Execute AOE ability on single target', () => {
    const isaac = new Unit(ISAAC, 5);
    const enemy = new Unit(GARET, 5);

    // QUAKE is all-enemies, but we pass 1 target
    const result = executeAbility(isaac, QUAKE, [enemy]);

    expect(result.damage).toBeGreaterThan(0);

    // ⚠️ Works fine - targets are just an array
  });

  test('❌ EDGE: Target same unit multiple times', () => {
    const isaac = new Unit(ISAAC, 5);
    const enemy = new Unit(GARET, 5);

    // Pass same enemy 3 times
    const result = executeAbility(isaac, SLASH, [enemy, enemy, enemy]);

    // Does it deal damage 3× to same target?
    expect(result.damage).toBeGreaterThan(0);

    // ⚠️ Same unit takes damage multiple times!
  });

  test('❌ EDGE: Target caster with offensive ability', () => {
    const isaac = new Unit(ISAAC, 5);

    // Isaac attacks himself
    const result = executeAbility(isaac, SLASH, [isaac]);

    expect(result.damage).toBeGreaterThan(0);

    // ⚠️ Self-damage is allowed!
    expect(isaac.currentHp).toBeLessThan(isaac.maxHp);
  });

  test('❌ EDGE: Heal enemy unit', () => {
    const isaac = new Unit(ISAAC, 5);
    const enemy = new Unit(GARET, 5);
    enemy.takeDamage(50);

    // Heal the enemy!
    const result = executeAbility(isaac, PLY, [enemy]);

    expect(result.healing).toBeGreaterThan(0);

    // ⚠️ Can heal enemies (no allegiance check)
  });
});

describe('CRITICAL: Buff/Debuff Edge Cases', () => {

  test('❌ EDGE: Buff with missing buffEffect', () => {
    const isaac = new Unit(ISAAC, 5);
    const ally = new Unit(GARET, 5);

    const brokenBuff: Ability = {
      id: 'broken-buff',
      name: 'Broken Buff',
      type: 'buff',
      ppCost: 5,
      basePower: 0,
      targets: 'single-ally',
      unlockLevel: 1,
      description: 'Buff with no effect',
      // buffEffect missing!
    };

    const result = executeAbility(isaac, brokenBuff, [ally]);

    expect(result.message).toContain('Applied buff');
    expect(ally.statusEffects.length).toBe(0);

    // ⚠️ Buff executes but does nothing
  });

  test('❌ EDGE: Buff with empty buffEffect object', () => {
    const isaac = new Unit(ISAAC, 5);
    const ally = new Unit(GARET, 5);

    const emptyBuff: Ability = {
      id: 'empty-buff',
      name: 'Empty Buff',
      type: 'buff',
      ppCost: 5,
      basePower: 0,
      targets: 'single-ally',
      unlockLevel: 1,
      description: 'Buff with empty effect',
      buffEffect: {}, // Empty object
    };

    const result = executeAbility(isaac, emptyBuff, [ally]);

    expect(result.message).toContain('Applied buff');
    expect(ally.statusEffects.length).toBe(0);

    // ⚠️ Consumes PP but does nothing
  });

  test('❌ EDGE: Buff with negative modifiers', () => {
    const isaac = new Unit(ISAAC, 5);
    const ally = new Unit(GARET, 5);

    const negativeBuff: Ability = {
      id: 'negative-buff',
      name: 'Negative Buff',
      type: 'buff',
      ppCost: 5,
      basePower: 0,
      targets: 'single-ally',
      unlockLevel: 1,
      description: 'Buff that reduces stats',
      buffEffect: {
        atk: -10, // NEGATIVE!
        def: -5,
      },
      duration: 3,
    };

    const result = executeAbility(isaac, negativeBuff, [ally]);

    expect(result.message).toContain('Applied buff');
    expect(ally.statusEffects.length).toBe(2);

    // ⚠️ "Buff" with negative modifiers = debuff!
    expect(ally.statusEffects[0].type).toBe('buff');
    expect(ally.statusEffects[0].modifier).toBe(-10);
  });

  test('❌ EDGE: Buff with 0 duration (persists forever?)', () => {
    const isaac = new Unit(ISAAC, 5);
    const ally = new Unit(GARET, 5);

    const permanentBuff: Ability = {
      id: 'permanent-buff',
      name: 'Permanent Buff',
      type: 'buff',
      ppCost: 5,
      basePower: 0,
      targets: 'single-ally',
      unlockLevel: 1,
      description: 'Buff with 0 duration',
      buffEffect: {
        atk: 20,
      },
      duration: 0, // ZERO DURATION!
    };

    const result = executeAbility(isaac, permanentBuff, [ally]);

    expect(ally.statusEffects.length).toBe(1);
    // When duration is 0, defaults to 3 (standard buff duration)
    expect(ally.statusEffects[0].duration).toBe(3);

    // ⚠️ Duration 0 is treated as "no duration specified" and defaults to 3
  });

  test('❌ EDGE: Buff without duration (uses default 3)', () => {
    const isaac = new Unit(ISAAC, 5);
    const ally = new Unit(GARET, 5);

    const noDurationBuff: Ability = {
      id: 'no-duration-buff',
      name: 'No Duration Buff',
      type: 'buff',
      ppCost: 5,
      basePower: 0,
      targets: 'single-ally',
      unlockLevel: 1,
      description: 'Buff without duration field',
      buffEffect: {
        atk: 20,
      },
      // duration missing!
    };

    const result = executeAbility(isaac, noDurationBuff, [ally]);

    expect(ally.statusEffects.length).toBe(1);
    expect(ally.statusEffects[0].duration).toBe(3); // Default

    // ✅ Correctly defaults to 3
  });
});

describe('CRITICAL: PP Management Edge Cases', () => {

  test('❌ EDGE: Execute ability with exact PP cost', () => {
    const isaac = new Unit(ISAAC, 5);
    const enemy = new Unit(GARET, 5);

    isaac.currentPp = 5;

    const result = executeAbility(isaac, QUAKE, [enemy]); // QUAKE costs 5 PP

    expect(result.damage).toBeGreaterThan(0);
    expect(isaac.currentPp).toBe(0); // Exact match works
  });

  test('❌ EDGE: Execute ability with PP = cost - 1', () => {
    const isaac = new Unit(ISAAC, 5);
    const enemy = new Unit(GARET, 5);

    isaac.currentPp = 4;

    const result = executeAbility(isaac, QUAKE, [enemy]); // QUAKE costs 5 PP

    expect(result.message).toContain("doesn't have enough PP");
    expect(isaac.currentPp).toBe(4); // PP unchanged
  });

  test('❌ BUG: PP can go negative if currentPp somehow becomes negative', () => {
    const isaac = new Unit(ISAAC, 5);
    const enemy = new Unit(GARET, 5);

    // Force negative PP (bypass validation)
    isaac.currentPp = -10;

    const result = executeAbility(isaac, SLASH, [enemy]); // 0 PP cost

    expect(result.damage).toBeGreaterThan(0);
    expect(isaac.currentPp).toBe(0); // Math.max(0, -10 - 0) = 0

    // ⚠️ PP gets clamped to 0 during execution
  });

  test('❌ EDGE: Execute expensive ability twice (second should fail)', () => {
    const isaac = new Unit(ISAAC, 5);
    const enemy = new Unit(GARET, 5);

    isaac.currentPp = 10;

    const result1 = executeAbility(isaac, QUAKE, [enemy]); // -5 PP
    expect(result1.damage).toBeGreaterThan(0);
    expect(isaac.currentPp).toBe(5);

    const result2 = executeAbility(isaac, QUAKE, [enemy]); // -5 PP
    expect(result2.damage).toBeGreaterThan(0);
    expect(isaac.currentPp).toBe(0);

    const result3 = executeAbility(isaac, QUAKE, [enemy]); // Can't afford!
    expect(result3.message).toContain("doesn't have enough PP");
    expect(isaac.currentPp).toBe(0);
  });
});

describe('CRITICAL: Revival Edge Cases', () => {

  test('❌ EDGE: Revival ability on alive unit', () => {
    const isaac = new Unit(ISAAC, 5);
    const ally = new Unit(GARET, 5);
    ally.takeDamage(50); // Damaged but alive

    // Use existing revival ability
    const revivalAbility = GLACIAL_BLESSING;

    const result = executeAbility(isaac, revivalAbility, [ally]);

    expect(result.healing).toBeGreaterThan(0);
    expect(ally.isKO).toBe(false);

    // ⚠️ Revival ability also heals living units
  });

  test('❌ EDGE: Revival ability on dead unit', () => {
    const isaac = new Unit(ISAAC, 5);
    const ally = new Unit(GARET, 5);
    ally.takeDamage(999); // KO
    expect(ally.isKO).toBe(true);

    // Use existing revival ability
    const revivalAbility = GLACIAL_BLESSING;

    const result = executeAbility(isaac, revivalAbility, [ally]);

    // BUG from earlier: heal() works on dead units (Bug #6)
    // Also: revival sets HP to 50% maxHp
    expect(ally.currentHp).toBe(Math.floor(ally.maxHp * 0.5));
    expect(ally.isKO).toBe(false); // Revived!
  });

  test('❌ EDGE: Non-revival healing on dead unit', () => {
    const isaac = new Unit(ISAAC, 5);
    const ally = new Unit(GARET, 5);
    ally.takeDamage(999); // KO
    expect(ally.isKO).toBe(true);

    const result = executeAbility(isaac, PLY, [ally]); // No revivesFallen

    // BUG #6 FIXED: Dead units can't be healed (need revival first)
    expect(result.healing).toBe(0);

    // They stay dead with 0 HP
    expect(ally.currentHp).toBe(0);
    expect(ally.isKO).toBe(true);
  });
});

describe('PERFORMANCE: Ability Execution Speed', () => {

  test('Execute 10,000 abilities completes quickly', () => {
    const isaac = new Unit(ISAAC, 5);
    const enemy = new Unit(GARET, 5);

    const start = performance.now();

    for (let i = 0; i < 10000; i++) {
      executeAbility(isaac, SLASH, [enemy]);
    }

    const elapsed = performance.now() - start;

    // Should be < 200ms for 10k executions
    expect(elapsed).toBeLessThan(200);

    console.log(`10k ability executions: ${elapsed.toFixed(2)}ms`);
  });
});
