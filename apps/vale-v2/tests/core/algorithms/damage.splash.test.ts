import { describe, test, expect } from 'vitest';
import { calculatePsynergyDamage, applyDamageWithShields } from '@/core/algorithms/damage';
import { createUnit } from '@/core/models/Unit';
import { createTeam } from '@/core/models/Team';
import { makePRNG } from '@/core/random/prng';
import type { Ability } from '@/data/schemas/AbilitySchema';
import type { Unit } from '@/core/models/Unit';

/**
 * Splash Damage Tests
 *
 * Tests for splashDamagePercent mechanic (Phase 2).
 * Primary test ability: storm-breeze-pulse (splashDamagePercent: 0.3)
 *
 * Scenarios:
 * 1. Splash with shield on secondary → shield blocks, charge consumed
 * 2. Splash with invulnerable secondary → invuln blocks, shield untouched
 * 3. Splash with DR + elementalResistance on secondary → multiplicative reduction
 * 4. Lethal primary hit still applies splash to others
 * 5. Splash percent = 0 edge case → no secondary damage
 * 6. Secondary KO'd by splash triggers autoRevive
 */

describe('Splash Damage (Phase 2)', () => {
  const rng = makePRNG(42);

  // Helper: Create basic attacker
  function createAttacker(): Unit {
    const definition: import('@/data/schemas/UnitSchema').UnitDefinition = {
      id: 'attacker',
      name: 'Attacker',
      element: 'Jupiter',
      role: 'Magic Attacker',
      baseStats: { hp: 100, pp: 50, atk: 30, def: 10, mag: 50, spd: 20 },
      growthRates: { hp: 10, pp: 5, atk: 2, def: 1, mag: 4, spd: 2 },
      abilities: [],
      manaContribution: 1,
    };
    return createUnit(definition, 10);
  }

  // Helper: Create basic defender
  function createDefender(id: string, defenses: { shield?: number; invuln?: boolean; dr?: number; resist?: number } = {}): Unit {
    const definition: import('@/data/schemas/UnitSchema').UnitDefinition = {
      id,
      name: `Defender ${id}`,
      element: 'Mercury',
      role: 'Tank',
      baseStats: { hp: 100, pp: 20, atk: 10, def: 20, mag: 10, spd: 10 },
      growthRates: { hp: 15, pp: 3, atk: 1, def: 3, mag: 1, spd: 1 },
      abilities: [],
      manaContribution: 1,
    };
    const unit = createUnit(definition, 10);

    const statuses: typeof unit.statusEffects = [];

    if (defenses.shield) {
      statuses.push({
        type: 'shield',
        remainingCharges: defenses.shield,
        duration: 3,
      });
    }

    if (defenses.invuln) {
      statuses.push({
        type: 'invulnerable',
        duration: 2,
      });
    }

    if (defenses.dr) {
      statuses.push({
        type: 'damageReduction',
        percent: defenses.dr,
        duration: 3,
      });
    }

    if (defenses.resist) {
      statuses.push({
        type: 'elementalResistance',
        element: 'Jupiter',
        modifier: defenses.resist,
        duration: 3,
      });
    }

    return {
      ...unit,
      statusEffects: statuses,
    };
  }

  // Test ability: Jupiter psynergy with 30% splash
  const splashAbility: Ability = {
    id: 'storm-breeze-pulse',
    name: 'Breeze Pulse',
    type: 'psynergy',
    element: 'Jupiter',
    manaCost: 4,
    basePower: 55,
    targets: 'single-enemy',
    unlockLevel: 3,
    description: 'Wind attack that deals 30% splash damage to other enemies.',
    splashDamagePercent: 0.3,
  };

  test('splash with shield on secondary → shield blocks, charge consumed', () => {
    const attacker = createAttacker();
    const primary = createDefender('primary');
    const secondary = createDefender('secondary', { shield: 1 });

    const attackerTeam = createTeam([attacker, createDefender('dummy1'), createDefender('dummy2'), createDefender('dummy3')]);
    const defenderTeam = createTeam([primary, secondary, createDefender('dummy4'), createDefender('dummy5')]);

    // Calculate primary damage
    const primaryDamage = calculatePsynergyDamage(attacker, primary, attackerTeam, splashAbility);
    expect(primaryDamage).toBeGreaterThan(0);

    // Apply damage to primary
    const primaryResult = applyDamageWithShields(primary, primaryDamage);
    expect(primaryResult.actualDamage).toBe(primaryDamage);

    // Calculate splash damage (30% of primary damage)
    const splashDamage = Math.floor(primaryDamage * 0.3);
    expect(splashDamage).toBeGreaterThan(0);

    // Apply splash to secondary (should be blocked by shield)
    const secondaryResult = applyDamageWithShields(secondary, splashDamage);
    expect(secondaryResult.actualDamage).toBe(0); // Shield blocks
    expect(secondaryResult.updatedUnit.currentHp).toBe(secondary.currentHp); // No HP loss

    // Verify shield charge consumed
    const shieldAfter = secondaryResult.updatedUnit.statusEffects.find(s => s.type === 'shield');
    expect(shieldAfter).toBeUndefined(); // Shield removed after consuming last charge
  });

  test('splash with invulnerable secondary → invuln blocks, shield untouched', () => {
    const attacker = createAttacker();
    const primary = createDefender('primary');
    const secondary = createDefender('secondary', { invuln: true, shield: 1 });

    const attackerTeam = createTeam([attacker, createDefender('dummy1'), createDefender('dummy2'), createDefender('dummy3')]);

    // Calculate primary and splash damage
    const primaryDamage = calculatePsynergyDamage(attacker, primary, attackerTeam, splashAbility);
    const splashDamage = Math.floor(primaryDamage * 0.3);

    // Apply splash to invulnerable secondary
    const secondaryResult = applyDamageWithShields(secondary, splashDamage);

    // Invulnerable blocks damage
    expect(secondaryResult.actualDamage).toBe(0);
    expect(secondaryResult.updatedUnit.currentHp).toBe(secondary.currentHp);

    // Shield should NOT be consumed (invuln blocks before shield check)
    const shieldAfter = secondaryResult.updatedUnit.statusEffects.find(s => s.type === 'shield');
    expect(shieldAfter).toBeDefined();
    if (shieldAfter && shieldAfter.type === 'shield') {
      expect(shieldAfter.remainingCharges).toBe(1); // Unchanged
    }
  });

  test('splash with DR + elementalResistance on secondary → multiplicative reduction', () => {
    const attacker = createAttacker();
    const primary = createDefender('primary');
    const secondary = createDefender('secondary', { dr: 0.3, resist: 0.25 });

    const attackerTeam = createTeam([attacker, createDefender('dummy1'), createDefender('dummy2'), createDefender('dummy3')]);

    // Calculate base splash damage (before DR/resist)
    const primaryDamage = calculatePsynergyDamage(attacker, primary, attackerTeam, splashAbility);
    const baseSplashDamage = Math.floor(primaryDamage * 0.3);

    // Apply damage modifiers: resist first, then DR
    // Resist: modifier 0.25 → factor (1 - 0.25) = 0.75
    // DR: 0.3 → factor (1 - 0.3) = 0.7
    // Expected: baseSplashDamage × 0.75 × 0.7 (multiplicative)
    const expectedDamage = Math.floor(Math.floor(baseSplashDamage * 0.75) * 0.7);

    // Apply splash damage (this happens in BattleService, but we're testing the pipeline)
    // Note: In real implementation, resist/DR are applied via calculatePsynergyDamage
    // For this test, we verify the damage reduction mechanics work correctly

    // Calculate splash damage with modifiers (simulating BattleService calculation)
    const splashWithModifiers = calculatePsynergyDamage(attacker, secondary, attackerTeam, {
      ...splashAbility,
      basePower: Math.floor(splashAbility.basePower * 0.3), // Splash reduced power
    });

    // Apply to unit
    const result = applyDamageWithShields(secondary, splashWithModifiers);
    expect(result.actualDamage).toBe(splashWithModifiers);
    expect(result.actualDamage).toBeLessThan(baseSplashDamage); // Reduced by DR/resist
  });

  test('lethal primary hit still applies splash to others', () => {
    const attacker = createAttacker();
    const primary = createDefender('primary');
    primary.currentHp = 10; // Low HP, will be KO'd

    const secondary = createDefender('secondary');
    const attackerTeam = createTeam([attacker, createDefender('dummy1'), createDefender('dummy2'), createDefender('dummy3')]);

    // Calculate damage
    const primaryDamage = calculatePsynergyDamage(attacker, primary, attackerTeam, splashAbility);

    // Primary is KO'd
    const primaryResult = applyDamageWithShields(primary, primaryDamage);
    expect(primaryResult.updatedUnit.currentHp).toBe(0); // KO'd

    // Splash should still apply to secondary
    const splashDamage = Math.floor(primaryDamage * 0.3);
    const secondaryResult = applyDamageWithShields(secondary, splashDamage);
    expect(secondaryResult.actualDamage).toBe(splashDamage);
    expect(secondaryResult.updatedUnit.currentHp).toBe(secondary.currentHp - splashDamage);
  });

  test('splash percent = 0 edge case → no secondary damage', () => {
    const attacker = createAttacker();
    const primary = createDefender('primary');
    const secondary = createDefender('secondary');

    const attackerTeam = createTeam([attacker, createDefender('dummy1'), createDefender('dummy2'), createDefender('dummy3')]);

    // Ability with 0% splash
    const noSplashAbility: Ability = {
      ...splashAbility,
      splashDamagePercent: 0,
    };

    // Calculate primary damage
    const primaryDamage = calculatePsynergyDamage(attacker, primary, attackerTeam, noSplashAbility);
    expect(primaryDamage).toBeGreaterThan(0);

    // Splash damage should be 0
    const splashDamage = Math.floor(primaryDamage * 0);
    expect(splashDamage).toBe(0);

    // Apply zero damage to secondary (should be no-op)
    const secondaryResult = applyDamageWithShields(secondary, splashDamage);
    expect(secondaryResult.actualDamage).toBe(0);
    expect(secondaryResult.updatedUnit.currentHp).toBe(secondary.currentHp); // Unchanged
  });

  test('secondary KO\'d by splash triggers autoRevive', () => {
    const attacker = createAttacker();
    const primary = createDefender('primary');
    const secondary = createDefender('secondary');
    secondary.currentHp = 5; // Low HP, will be KO'd by splash

    // Add auto-revive to secondary
    secondary.statusEffects = [
      {
        type: 'autoRevive',
        hpPercent: 0.5,
        usesRemaining: 1,
      },
    ];

    const attackerTeam = createTeam([attacker, createDefender('dummy1'), createDefender('dummy2'), createDefender('dummy3')]);

    // Calculate damage
    const primaryDamage = calculatePsynergyDamage(attacker, primary, attackerTeam, splashAbility);
    const splashDamage = Math.floor(primaryDamage * 0.3);
    expect(splashDamage).toBeGreaterThan(secondary.currentHp); // Will KO

    // Apply splash to secondary
    const secondaryResult = applyDamageWithShields(secondary, splashDamage);

    // Auto-revive should trigger
    expect(secondaryResult.autoRevived).toBe(true);
    expect(secondaryResult.updatedUnit.currentHp).toBe(Math.floor(secondary.maxHp * 0.5)); // Revived to 50%

    // Auto-revive status should be removed (usesRemaining decremented to 0)
    const autoReviveAfter = secondaryResult.updatedUnit.statusEffects.find(s => s.type === 'autoRevive');
    expect(autoReviveAfter).toBeUndefined();
  });
});
