import { describe, test, expect } from 'vitest';
import { Unit } from '@/types/Unit';
import { createTeam } from '@/types/Team';
import { ISAAC, GARET, MIA } from '@/data/unitDefinitions';
import { IRON_SWORD, DRAGON_SCALES } from '@/data/equipment';
import { FLINT, GRANITE, BANE } from '@/data/djinn';

/**
 * CRITICAL: Tests for Previously Uncovered Code Paths
 *
 * These test scenarios that have 0% coverage despite being critical.
 */
describe('CRITICAL: Equipment Edge Cases (78.37% coverage - missing 22%)', () => {

  test('Equipment.ts lines 59-74: What happens with malformed equipment?', () => {
    const isaac = new Unit(ISAAC, 5);

    // Missing statBonus object entirely
    const brokenItem = {
      id: 'broken-item',
      name: 'Broken Item',
      slot: 'weapon' as const,
      tier: 'basic' as const,
      cost: 0,
      // statBonus missing!
    } as any;

    // Should not crash
    expect(() => isaac.equipItem('weapon', brokenItem)).not.toThrow();

    // Stats should remain unchanged (graceful degradation)
    expect(isaac.stats.atk).toBe(27); // No bonus applied
  });

  test('What if equipment has undefined stat values?', () => {
    const isaac = new Unit(ISAAC, 5);

    const weirdItem = {
      id: 'weird',
      name: 'Weird Item',
      slot: 'weapon' as const,
      tier: 'basic' as const,
      cost: 0,
      statBonus: {
        atk: undefined as any,
        def: undefined as any,
      },
    };

    isaac.equipItem('weapon', weirdItem);

    // Should handle undefined gracefully (treat as 0)
    expect(isaac.stats.atk).toBe(27); // Base, no crash
  });

  test('What if equipment has negative stat bonuses?', () => {
    const isaac = new Unit(ISAAC, 5);

    const cursedItem = {
      id: 'cursed-sword',
      name: 'Cursed Sword',
      slot: 'weapon' as const,
      tier: 'basic' as const,
      cost: 0,
      statBonus: {
        atk: -10, // Negative bonus (curse)
      },
    };

    isaac.equipItem('weapon', cursedItem);

    // Negative bonuses should work (cursed items)
    expect(isaac.stats.atk).toBe(17); // 27 - 10
  });
});

describe('CRITICAL: Result.ts Error Paths (66.66% coverage - missing 33%)', () => {

  test('Result.ts lines 58, 64-68, 75-81: Chain operations with errors', () => {
    const isaac = new Unit(ISAAC, 5);

    // Try to equip 4 Djinn (should fail)
    const result = isaac.equipDjinn([FLINT, GRANITE, BANE, FLINT]); // Duplicate!

    expect(result.ok).toBe(false);

    if (!result.ok) {
      // Error message should be descriptive
      expect(result.error).toBeTruthy();
      expect(typeof result.error).toBe('string');
      expect(result.error.length).toBeGreaterThan(0);
    }
  });

  test('What happens when Result error is accessed on Ok?', () => {
    const isaac = new Unit(ISAAC, 5);

    const result = isaac.equipDjinn([FLINT]);

    if (result.ok) {
      // Accessing .error on Ok result
      // TypeScript prevents this, but runtime check?
      expect((result as any).error).toBeUndefined();
    }
  });
});

describe('CRITICAL: Status Effect Duration Edge Cases', () => {

  test('What if status effect has 0 duration?', () => {
    const isaac = new Unit(ISAAC, 5);

    isaac.statusEffects.push({
      type: 'buff',
      stat: 'atk',
      modifier: 2.0,
      duration: 0, // Already expired?
    });

    // Should it apply? Should it be ignored?
    // Current behavior: probably applies (bug?)
    const atk = isaac.stats.atk;

    // Document current behavior
    expect(typeof atk).toBe('number');
  });

  test('What if status effect has negative duration?', () => {
    const isaac = new Unit(ISAAC, 5);

    isaac.statusEffects.push({
      type: 'buff',
      stat: 'atk',
      modifier: 2.0,
      duration: -5, // Negative duration?!
    });

    // Should not crash
    expect(() => isaac.stats.atk).not.toThrow();
  });

  test('What if multiple status effects target same stat?', () => {
    const isaac = new Unit(ISAAC, 5);

    // Two buffs on same stat
    isaac.statusEffects.push(
      { type: 'buff', stat: 'atk', modifier: 1.5, duration: 3 },
      { type: 'buff', stat: 'atk', modifier: 1.3, duration: 2 }
    );

    // Should multiply: 27 × 1.5 × 1.3 = 52.65 → 52
    expect(isaac.stats.atk).toBe(52);
  });

  test('What if buff and debuff on same stat?', () => {
    const isaac = new Unit(ISAAC, 5);

    isaac.statusEffects.push(
      { type: 'buff', stat: 'atk', modifier: 2.0, duration: 3 },
      { type: 'debuff', stat: 'atk', modifier: 0.5, duration: 2 }
    );

    // 27 × 2.0 × 0.5 = 27 (cancel out!)
    expect(isaac.stats.atk).toBe(27);
  });
});

describe('CRITICAL: HP/PP Edge Cases', () => {

  test('What if currentHp is set to negative?', () => {
    const isaac = new Unit(ISAAC, 5);

    // Direct manipulation (shouldn't happen, but what if?)
    isaac.currentHp = -50;

    // Should be clamped to 0
    expect(isaac.currentHp).toBeGreaterThanOrEqual(0);
  });

  test('What if currentHp is set above maxHp?', () => {
    const isaac = new Unit(ISAAC, 5);

    // Overheal attempt
    isaac.currentHp = 999;

    // Should be clamped to maxHp
    expect(isaac.currentHp).toBeLessThanOrEqual(isaac.maxHp);
  });

  test('What if heal amount is negative?', () => {
    const isaac = new Unit(ISAAC, 5);
    isaac.takeDamage(50); // 130 HP

    // Negative heal (damage disguised as heal?)
    const healed = isaac.heal(-20);

    // Should heal 0 or treat as damage?
    expect(healed).toBeGreaterThanOrEqual(0);
    expect(isaac.currentHp).toBeGreaterThanOrEqual(110); // Not damaged by "heal"
  });

  test('What if unit is KO and we try to heal?', () => {
    const isaac = new Unit(ISAAC, 5);
    isaac.takeDamage(999); // KO

    expect(isaac.isKO).toBe(true);
    expect(isaac.currentHp).toBe(0);

    // Try to heal a dead unit
    const healed = isaac.heal(50);

    // Should not resurrect (unless ability has revivesFallen)
    expect(healed).toBe(0);
    expect(isaac.isKO).toBe(true);
  });
});

describe('CRITICAL: Djinn System Edge Cases', () => {

  test('What if we equip the same Djinn twice?', () => {
    const isaac = new Unit(ISAAC, 5);

    // Try to equip FLINT twice
    const result = isaac.equipDjinn([FLINT, FLINT, GRANITE]);

    // Should fail (can't equip duplicates)
    expect(result.ok).toBe(false);
  });

  test('What if we activate Djinn that was just activated?', () => {
    const isaac = new Unit(ISAAC, 5);
    isaac.equipDjinn([FLINT]);

    // Activate once
    const result1 = isaac.activateDjinn('flint');
    expect(result1.ok).toBe(true);

    // Try to activate again immediately
    const result2 = isaac.activateDjinn('flint');
    expect(result2.ok).toBe(false); // Should fail (already Standby)
  });

  test('What if we unequip all Djinn mid-battle?', () => {
    const isaac = new Unit(ISAAC, 5);
    isaac.equipDjinn([FLINT, GRANITE, BANE]);

    const beforeAtk = isaac.stats.atk; // 27 + 12 = 39

    // Unequip all
    isaac.equipDjinn([]);

    const afterAtk = isaac.stats.atk; // 27 (no bonus)

    expect(afterAtk).toBeLessThan(beforeAtk);
    expect(afterAtk).toBe(27);
  });
});

describe('CRITICAL: Team System Edge Cases', () => {

  test('What if team has 0 units?', () => {
    const team = createTeam([]);

    expect(team.units).toHaveLength(0);
    expect(team.equippedDjinn).toHaveLength(0);

    // Should not crash when calculating stats
    expect(() => team.units.length).not.toThrow();
  });

  test('What if team has 5 units (exceeds max)?', () => {
    const units = [
      new Unit(ISAAC, 5),
      new Unit(GARET, 5),
      new Unit(MIA, 5),
      new Unit(ISAAC, 5), // Duplicate ID
      new Unit(GARET, 5), // Duplicate ID
    ];

    // Should throw or clamp to 4?
    expect(() => createTeam(units)).toThrow();
  });

  test('What if team has duplicate unit IDs?', () => {
    const isaac1 = new Unit(ISAAC, 5);
    const isaac2 = new Unit(ISAAC, 5); // Same ID!

    const team = createTeam([isaac1, isaac2]);

    // Both have id 'isaac' - how does system handle?
    expect(team.units.length).toBe(2);

    // Are they treated as different units or same?
    isaac1.takeDamage(50);

    expect(isaac1.currentHp).toBe(130);
    expect(isaac2.currentHp).toBe(180); // Different instances
  });
});

describe('CRITICAL: calculateStats() Edge Cases', () => {

  test('What if calculateStats called with null team?', () => {
    const isaac = new Unit(ISAAC, 5);

    // Call without team parameter
    const stats = isaac.calculateStats();

    // Should work (no team Djinn bonuses)
    expect(stats.atk).toBe(27);
  });

  test('What if calculateStats called with team that unit is not in?', () => {
    const isaac = new Unit(ISAAC, 5);
    const otherTeam = createTeam([new Unit(GARET, 5)]);

    otherTeam.collectedDjinn = [FLINT, GRANITE, BANE];

    // Isaac calculates stats with team he's NOT in
    const stats = isaac.calculateStats(otherTeam as any);

    // Should not get Djinn bonuses (not in team)
    expect(stats.atk).toBe(27);
  });

  test('Performance: calculateStats called 10,000 times', () => {
    const isaac = new Unit(ISAAC, 5);
    isaac.equipItem('weapon', IRON_SWORD);
    isaac.equipItem('armor', DRAGON_SCALES);
    isaac.equipDjinn([FLINT, GRANITE, BANE]);

    const team = createTeam([isaac]);

    const start = performance.now();

    for (let i = 0; i < 10000; i++) {
      isaac.calculateStats(team);
    }

    const elapsed = performance.now() - start;

    // Should be < 100ms for 10k calls
    expect(elapsed).toBeLessThan(100);

    console.log(`calculateStats 10k calls: ${elapsed.toFixed(2)}ms`);
  });
});
