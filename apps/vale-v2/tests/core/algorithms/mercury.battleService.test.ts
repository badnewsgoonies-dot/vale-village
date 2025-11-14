import { describe, test, expect } from 'vitest';
import { BattleService } from '@/core/services/BattleService';
import { createUnit } from '@/core/models/Unit';
import { createTeam } from '@/core/models/Team';
import { createBattleState } from '@/core/models/BattleState';
import { makePRNG } from '@/core/random/prng';
import { isNegativeStatus } from '@/core/algorithms/status';
import type { Unit } from '@/core/models/Unit';
import type { Ability } from '@/data/schemas/AbilitySchema';

/**
 * Mercury BattleService Execution Tests (Phase 2)
 *
 * Tests end-to-end ability execution through BattleService for Mercury abilities.
 * Verifies heal + cleanse + immunity applied in single ability execution.
 *
 * Scenarios:
 * 1. fizz-healing-wave: Heal + cleanse negatives + grant burn/poison immunity
 * 2. crystal-mist-blessing: Multi-target heal + cleanse + grant burn/poison/freeze immunity
 *
 * Assertions:
 * - HP increases by calculated heal amount (clamped to maxHp)
 * - Negative statuses removed (burn, poison, freeze, debuff)
 * - Positive statuses retained (buff, healOverTime)
 * - Immunity status present with correct structure
 */

describe('Mercury BattleService Execution (Phase 2)', () => {
  const rng = makePRNG(123);

  // Helper: Create ally with mixed statuses
  function createAllyWithStatuses(id: string, negatives: string[], positives: string[] = []): Unit {
    const definition: import('@/data/schemas/UnitSchema').UnitDefinition = {
      id,
      name: `Ally ${id}`,
      element: 'Mercury',
      role: 'Balanced',
      baseStats: { hp: 100, pp: 30, atk: 15, def: 15, mag: 20, spd: 15 },
      growthRates: { hp: 12, pp: 4, atk: 2, def: 2, mag: 3, spd: 2 },
      abilities: [],
      manaContribution: 1,
    };
    const unit = createUnit(definition, 10);

    // Set partial HP to allow healing
    unit.currentHp = 50;

    const statuses: typeof unit.statusEffects = [];

    // Add negative statuses
    if (negatives.includes('burn')) {
      statuses.push({ type: 'burn', damagePerTurn: 10, duration: 3 });
    }
    if (negatives.includes('poison')) {
      statuses.push({ type: 'poison', damagePerTurn: 8, duration: 3 });
    }
    if (negatives.includes('freeze')) {
      statuses.push({ type: 'freeze', duration: 2 });
    }
    if (negatives.includes('debuff')) {
      statuses.push({ type: 'debuff', stat: 'atk', modifier: -5, duration: 3 });
    }

    // Add positive statuses
    if (positives.includes('buff')) {
      statuses.push({ type: 'buff', stat: 'def', modifier: 10, duration: 3 });
    }
    if (positives.includes('healOverTime')) {
      statuses.push({ type: 'healOverTime', amountPerTurn: 5, duration: 3 });
    }

    return {
      ...unit,
      statusEffects: statuses,
    };
  }

  // Helper: Create caster
  function createCaster(): Unit {
    const definition: import('@/data/schemas/UnitSchema').UnitDefinition = {
      id: 'caster',
      name: 'Caster',
      element: 'Mercury',
      role: 'Healer',
      baseStats: { hp: 100, pp: 50, atk: 10, def: 10, mag: 30, spd: 20 },
      growthRates: { hp: 10, pp: 6, atk: 1, def: 1, mag: 4, spd: 2 },
      abilities: [],
      manaContribution: 1,
    };
    return createUnit(definition, 10);
  }

  test('fizz-healing-wave: heal + cleanse + immunity (burn/poison)', () => {
    // Setup: 2 allies with burn, poison, and buff
    const ally1 = createAllyWithStatuses('ally1', ['burn', 'poison'], ['buff']);
    const ally2 = createAllyWithStatuses('ally2', ['burn', 'poison'], ['healOverTime']);
    const caster = createCaster();
    const dummyDef: import('@/data/schemas/UnitSchema').UnitDefinition = {
      id: 'dummy',
      name: 'Dummy',
      element: 'Venus',
      role: 'Filler',
      baseStats: { hp: 10, pp: 5, atk: 1, def: 1, mag: 1, spd: 1 },
      growthRates: { hp: 1, pp: 1, atk: 0, def: 0, mag: 0, spd: 0 },
      abilities: [],
      manaContribution: 1,
    };
    const dummy = createUnit(dummyDef, 1);

    const createEnemy = (id: string) => {
      const def: import('@/data/schemas/UnitSchema').UnitDefinition = {
        id,
        name: `Enemy ${id}`,
        element: 'Mars',
        role: 'Enemy',
        baseStats: { hp: 50, pp: 10, atk: 10, def: 10, mag: 10, spd: 10 },
        growthRates: { hp: 8, pp: 2, atk: 2, def: 1, mag: 1, spd: 1 },
        abilities: [],
        manaContribution: 1,
      };
      return createUnit(def, 5);
    };

    const playerTeam = createTeam([caster, ally1, ally2, dummy]);
    const enemyTeam = createTeam([
      createEnemy('enemy1'),
      createEnemy('enemy2'),
      createEnemy('enemy3'),
      createEnemy('enemy4'),
    ]);

    const battle = createBattleState(playerTeam, enemyTeam, { seed: 123 });

    // Ability: fizz-healing-wave
    const ability: Ability = {
      id: 'fizz-healing-wave',
      name: 'Healing Wave',
      type: 'healing',
      element: 'Mercury',
      manaCost: 4,
      basePower: 42,
      targets: 'all-allies',
      unlockLevel: 1,
      description: 'Restore health to all allies, cleanse negatives, and grant short burn/poison immunity.',
      removeStatusEffects: { type: 'negative' },
      grantImmunity: { all: false, types: ['burn', 'poison'], duration: 1 },
    };

    // Pre-execution snapshot
    const ally1PreHp = ally1.currentHp;
    const ally2PreHp = ally2.currentHp;
    const ally1PreStatuses = ally1.statusEffects.length;
    const ally2PreStatuses = ally2.statusEffects.length;

    // Execute ability through BattleService
    const battleService = new BattleService();
    const updatedBattle = battleService.executeAbility(battle, caster, ability, [ally1, ally2]);

    // Find updated allies
    const ally1After = updatedBattle.playerTeam.units.find(u => u.id === 'ally1');
    const ally2After = updatedBattle.playerTeam.units.find(u => u.id === 'ally2');

    expect(ally1After).toBeDefined();
    expect(ally2After).toBeDefined();

    if (!ally1After || !ally2After) {
      throw new Error('Allies not found after execution');
    }

    // Verify HP increased (healed)
    expect(ally1After.currentHp).toBeGreaterThan(ally1PreHp);
    expect(ally2After.currentHp).toBeGreaterThan(ally2PreHp);
    expect(ally1After.currentHp).toBeLessThanOrEqual(ally1After.maxHp); // Clamped to max
    expect(ally2After.currentHp).toBeLessThanOrEqual(ally2After.maxHp);

    // Verify negative statuses removed
    const ally1Negatives = ally1After.statusEffects.filter(s => isNegativeStatus(s));
    const ally2Negatives = ally2After.statusEffects.filter(s => isNegativeStatus(s));
    expect(ally1Negatives).toHaveLength(0); // All negatives cleansed
    expect(ally2Negatives).toHaveLength(0);

    // Verify positive statuses retained
    const ally1Buff = ally1After.statusEffects.find(s => s.type === 'buff');
    const ally2HoT = ally2After.statusEffects.find(s => s.type === 'healOverTime');
    expect(ally1Buff).toBeDefined(); // Buff retained
    expect(ally2HoT).toBeDefined(); // HealOverTime retained

    // Verify immunity status present
    const ally1Immunity = ally1After.statusEffects.find(s => s.type === 'immunity');
    const ally2Immunity = ally2After.statusEffects.find(s => s.type === 'immunity');
    expect(ally1Immunity).toBeDefined();
    expect(ally2Immunity).toBeDefined();

    if (ally1Immunity && ally1Immunity.type === 'immunity') {
      expect(ally1Immunity.all).toBe(false);
      expect(ally1Immunity.types).toEqual(['burn', 'poison']);
      expect(ally1Immunity.duration).toBe(1);
    }

    if (ally2Immunity && ally2Immunity.type === 'immunity') {
      expect(ally2Immunity.all).toBe(false);
      expect(ally2Immunity.types).toEqual(['burn', 'poison']);
      expect(ally2Immunity.duration).toBe(1);
    }
  });

  test('crystal-mist-blessing: multi-target heal + cleanse + multi-immunity', () => {
    // Setup: 3 allies with various negative statuses
    const ally1 = createAllyWithStatuses('ally1', ['burn', 'freeze'], ['buff']);
    const ally2 = createAllyWithStatuses('ally2', ['poison', 'debuff'], []);
    const ally3 = createAllyWithStatuses('ally3', ['freeze'], ['healOverTime']);
    const caster = createCaster();

    const createEnemy2 = (id: string) => {
      const def: import('@/data/schemas/UnitSchema').UnitDefinition = {
        id,
        name: `Enemy ${id}`,
        element: 'Mars',
        role: 'Enemy',
        baseStats: { hp: 50, pp: 10, atk: 10, def: 10, mag: 10, spd: 10 },
        growthRates: { hp: 8, pp: 2, atk: 2, def: 1, mag: 1, spd: 1 },
        abilities: [],
        manaContribution: 1,
      };
      return createUnit(def, 5);
    };

    const playerTeam = createTeam([caster, ally1, ally2, ally3]);
    const enemyTeam = createTeam([
      createEnemy2('enemy1'),
      createEnemy2('enemy2'),
      createEnemy2('enemy3'),
      createEnemy2('enemy4'),
    ]);

    const battle = createBattleState(playerTeam, enemyTeam, { seed: 123 });

    // Ability: crystal-mist-blessing
    const ability: Ability = {
      id: 'crystal-mist-blessing',
      name: 'Mist Blessing',
      type: 'healing',
      element: 'Mercury',
      manaCost: 5,
      basePower: 70,
      targets: 'all-allies',
      unlockLevel: 3,
      description: 'Bless all allies with restorative mist, cleansing negatives and granting short immunity to burn/poison/freeze.',
      removeStatusEffects: { type: 'negative' },
      grantImmunity: { all: false, types: ['burn', 'poison', 'freeze'], duration: 1 },
    };

    // Execute ability through BattleService
    const battleService = new BattleService();
    const updatedBattle = battleService.executeAbility(battle, caster, ability, [ally1, ally2, ally3]);

    // Find updated allies
    const ally1After = updatedBattle.playerTeam.units.find(u => u.id === 'ally1');
    const ally2After = updatedBattle.playerTeam.units.find(u => u.id === 'ally2');
    const ally3After = updatedBattle.playerTeam.units.find(u => u.id === 'ally3');

    expect(ally1After).toBeDefined();
    expect(ally2After).toBeDefined();
    expect(ally3After).toBeDefined();

    if (!ally1After || !ally2After || !ally3After) {
      throw new Error('Allies not found after execution');
    }

    // Verify all healed
    expect(ally1After.currentHp).toBeGreaterThan(50);
    expect(ally2After.currentHp).toBeGreaterThan(50);
    expect(ally3After.currentHp).toBeGreaterThan(50);

    // Verify all negative statuses cleansed
    expect(ally1After.statusEffects.filter(s => isNegativeStatus(s))).toHaveLength(0);
    expect(ally2After.statusEffects.filter(s => isNegativeStatus(s))).toHaveLength(0);
    expect(ally3After.statusEffects.filter(s => isNegativeStatus(s))).toHaveLength(0);

    // Verify positive statuses retained
    expect(ally1After.statusEffects.find(s => s.type === 'buff')).toBeDefined();
    expect(ally3After.statusEffects.find(s => s.type === 'healOverTime')).toBeDefined();

    // Verify immunity status present on all
    const ally1Immunity = ally1After.statusEffects.find(s => s.type === 'immunity');
    const ally2Immunity = ally2After.statusEffects.find(s => s.type === 'immunity');
    const ally3Immunity = ally3After.statusEffects.find(s => s.type === 'immunity');

    expect(ally1Immunity).toBeDefined();
    expect(ally2Immunity).toBeDefined();
    expect(ally3Immunity).toBeDefined();

    // Verify immunity covers burn, poison, freeze
    if (ally1Immunity && ally1Immunity.type === 'immunity') {
      expect(ally1Immunity.all).toBe(false);
      expect(ally1Immunity.types).toEqual(['burn', 'poison', 'freeze']);
      expect(ally1Immunity.duration).toBe(1);
    }

    if (ally2Immunity && ally2Immunity.type === 'immunity') {
      expect(ally2Immunity.all).toBe(false);
      expect(ally2Immunity.types).toEqual(['burn', 'poison', 'freeze']);
      expect(ally2Immunity.duration).toBe(1);
    }

    if (ally3Immunity && ally3Immunity.type === 'immunity') {
      expect(ally3Immunity.all).toBe(false);
      expect(ally3Immunity.types).toEqual(['burn', 'poison', 'freeze']);
      expect(ally3Immunity.duration).toBe(1);
    }
  });

  test('heal clamped to maxHp (no overflow)', () => {
    // Setup: Ally near max HP
    const ally = createCaster();
    ally.currentHp = 95; // Close to max (100)

    const caster = createCaster();
    const createDummy = (id: string) => {
      const def: import('@/data/schemas/UnitSchema').UnitDefinition = {
        id,
        name: `Dummy ${id}`,
        element: 'Venus',
        role: 'Filler',
        baseStats: { hp: 10, pp: 5, atk: 1, def: 1, mag: 1, spd: 1 },
        growthRates: { hp: 1, pp: 1, atk: 0, def: 0, mag: 0, spd: 0 },
        abilities: [],
        manaContribution: 1,
      };
      return createUnit(def, 1);
    };

    const dummies = [
      createDummy('dummy1'),
      createDummy('dummy2'),
      createDummy('dummy3'),
    ];

    const createEnemy3 = (id: string) => {
      const def: import('@/data/schemas/UnitSchema').UnitDefinition = {
        id,
        name: `Enemy ${id}`,
        element: 'Mars',
        role: 'Enemy',
        baseStats: { hp: 50, pp: 10, atk: 10, def: 10, mag: 10, spd: 10 },
        growthRates: { hp: 8, pp: 2, atk: 2, def: 1, mag: 1, spd: 1 },
        abilities: [],
        manaContribution: 1,
      };
      return createUnit(def, 5);
    };

    const playerTeam = createTeam([caster, ally, ...dummies]);
    const enemyTeam = createTeam([
      createEnemy3('enemy1'),
      createEnemy3('enemy2'),
      createEnemy3('enemy3'),
      createEnemy3('enemy4'),
    ]);

    const battle = createBattleState(playerTeam, enemyTeam, { seed: 123 });

    const ability: Ability = {
      id: 'fizz-healing-wave',
      name: 'Healing Wave',
      type: 'healing',
      element: 'Mercury',
      manaCost: 4,
      basePower: 42,
      targets: 'all-allies',
      unlockLevel: 1,
      description: 'Restore health to all allies.',
      removeStatusEffects: { type: 'negative' },
      grantImmunity: { all: false, types: ['burn', 'poison'], duration: 1 },
    };

    const battleService = new BattleService();
    const updatedBattle = battleService.executeAbility(battle, caster, ability, [ally]);

    const allyAfter = updatedBattle.playerTeam.units.find(u => u.id === ally.id);
    expect(allyAfter).toBeDefined();

    if (!allyAfter) {
      throw new Error('Ally not found after execution');
    }

    // Verify HP clamped to maxHp (not above)
    expect(allyAfter.currentHp).toBe(allyAfter.maxHp);
    expect(allyAfter.currentHp).toBe(100);
  });
});
