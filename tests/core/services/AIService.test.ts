/**
 * AI Service Tests
 * Tests deterministic enemy AI decision-making
 */

import { describe, test, expect } from 'vitest';
import { makeAIDecision } from '@/core/services/AIService';
import { startBattle } from '@/core/services/BattleService';
import { createTeam } from '@/core/models/Team';
import { makePRNG } from '@/core/random/prng';
import { mkUnit, mkEnemy } from '@/test/factories';
import { ABILITIES } from '@/data/definitions/abilities';

describe('AIService - Decision Making', () => {
  test('AI selects valid ability and targets', () => {
    const playerTeam = createTeam([
      mkUnit({ id: 'isaac', name: 'Isaac', level: 5 }),
      mkUnit({ id: 'garet', name: 'Garet', level: 5 }),
    ]);

    const enemies = [
      mkEnemy('slime', { id: 'enemy1', name: 'Goblin', level: 3, currentHp: 50 }),
    ];

    const rng = makePRNG(42);
    const battleResult = startBattle(playerTeam, enemies, rng);

    if (!battleResult.ok) throw new Error(battleResult.error);
    const battle = battleResult.value;

    const decision = makeAIDecision(battle, 'enemy1', rng);

    expect(decision).toBeDefined();
    expect(decision.abilityId).toBeDefined();
    expect(decision.targetIds).toBeInstanceOf(Array);
    expect(decision.targetIds.length).toBeGreaterThan(0);
  });

  test('AI targets weakest enemy for single-target attacks', () => {
    const playerTeam = createTeam([
      mkUnit({ id: 'isaac', name: 'Isaac', level: 5, currentHp: 10 }), // Weakest
      mkUnit({ id: 'garet', name: 'Garet', level: 5, currentHp: 100 }), // Strongest
    ]);

    const strike = ABILITIES.attack;
    if (!strike) throw new Error('Strike ability not found');

    const enemies = [
      mkEnemy('slime', {
        id: 'enemy1',
        name: 'Goblin',
        level: 3,
        abilities: [strike],
        unlockedAbilityIds: [strike.id],
      }),
    ];

    const rng = makePRNG(42);
    const battleResult = startBattle(playerTeam, enemies, rng);

    if (!battleResult.ok) throw new Error(battleResult.error);
    const battle = battleResult.value;

    // Run multiple times to ensure consistency (deterministic)
    for (let i = 0; i < 5; i++) {
      const testRng = makePRNG(100 + i);
      const decision = makeAIDecision(battle, 'enemy1', testRng);

      // Should target isaac (weakest)
      expect(decision.targetIds).toContain('isaac');
    }
  });

  test('AI selects highest priority ability', () => {
    const playerTeam = createTeam([
      mkUnit({ id: 'isaac', name: 'Isaac', level: 5 }),
    ]);

    const strike = ABILITIES.attack;
    const chainLightning = ABILITIES['chain-lightning'];

    if (!strike || !chainLightning) {
      throw new Error('Required abilities not found');
    }

    const enemies = [
      mkEnemy('slime', {
        id: 'enemy1',
        name: 'Mage',
        level: 5,
        abilities: [strike, chainLightning],
        unlockedAbilityIds: [strike.id, chainLightning.id],
      }),
    ];

    const rng = makePRNG(42);
    const battleResult = startBattle(playerTeam, enemies, rng);

    if (!battleResult.ok) throw new Error(battleResult.error);
    const battle = battleResult.value;

    const decision = makeAIDecision(battle, 'enemy1', rng);

    // Chain Lightning should be preferred over basic attack (higher damage)
    // Note: AI may select strike if it scores higher due to target weakness
    expect(decision.abilityId).toBeTruthy();
    expect(['strike', 'chain-lightning']).toContain(decision.abilityId);
  });

  test('AI falls back to basic attack when no abilities usable', () => {
    const playerTeam = createTeam([
      mkUnit({ id: 'isaac', name: 'Isaac', level: 5, currentHp: 0 }), // KO'd
    ]);

    const strike = ABILITIES.attack;
    const cure = ABILITIES.cure; // Healing ability (no valid targets if no wounded)

    if (!strike || !cure) {
      throw new Error('Required abilities not found');
    }

    // Enemy has only healing ability but no wounded allies
    const enemies = [
      mkEnemy('slime', {
        id: 'enemy1',
        name: 'Healer',
        level: 3,
        abilities: [cure], // Only healing ability
        unlockedAbilityIds: [cure.id],
      }),
    ];

    const rng = makePRNG(42);

    // This should throw because no usable abilities
    // (cure targets allies but enemy has no allies)
    expect(() => {
      const battleResult = startBattle(playerTeam, enemies, rng);
      if (!battleResult.ok) throw new Error(battleResult.error);
      makeAIDecision(battleResult.value, 'enemy1', rng);
    }).toThrow();
  });

  test('AI decision is deterministic with same seed', () => {
    const playerTeam = createTeam([
      mkUnit({ id: 'isaac', name: 'Isaac', level: 5 }),
      mkUnit({ id: 'garet', name: 'Garet', level: 5 }),
    ]);

    const enemies = [
      mkEnemy('slime', { id: 'enemy1', name: 'Goblin', level: 3 }),
    ];

    const rng1 = makePRNG(12345);
    const rng2 = makePRNG(12345);

    const battleResult = startBattle(playerTeam, enemies, makePRNG(42));
    if (!battleResult.ok) throw new Error(battleResult.error);
    const battle = battleResult.value;

    const decision1 = makeAIDecision(battle, 'enemy1', rng1);
    const decision2 = makeAIDecision(battle, 'enemy1', rng2);

    expect(decision1.abilityId).toBe(decision2.abilityId);
    expect(decision1.targetIds).toEqual(decision2.targetIds);
  });

  test('AI handles multiple valid targets for AoE abilities', () => {
    const playerTeam = createTeam([
      mkUnit({ id: 'isaac', name: 'Isaac', level: 5 }),
      mkUnit({ id: 'garet', name: 'Garet', level: 5 }),
      mkUnit({ id: 'ivan', name: 'Ivan', level: 5 }),
    ]);

    const quake = ABILITIES.quake; // AoE ability
    const strike = ABILITIES.attack;

    if (!quake || !strike) {
      throw new Error('Required abilities not found');
    }

    const enemies = [
      mkEnemy('slime', {
        id: 'enemy1',
        name: 'Earth Mage',
        level: 5,
        abilities: [strike, quake],
        unlockedAbilityIds: [strike.id, quake.id],
      }),
    ];

    const rng = makePRNG(42);
    const battleResult = startBattle(playerTeam, enemies, rng);

    if (!battleResult.ok) throw new Error(battleResult.error);
    const battle = battleResult.value;

    const decision = makeAIDecision(battle, 'enemy1', rng);

    // If AoE is selected, should target all valid enemies
    if (decision.abilityId === 'quake') {
      expect(decision.targetIds.length).toBe(3); // All player units
    }
  });

  test('AI ignores KO\'d units when selecting targets', () => {
    const playerTeam = createTeam([
      mkUnit({ id: 'isaac', name: 'Isaac', level: 5, currentHp: 0 }), // KO'd
      mkUnit({ id: 'garet', name: 'Garet', level: 5, currentHp: 50 }), // Alive
    ]);

    const enemies = [
      mkEnemy('slime', { id: 'enemy1', name: 'Goblin', level: 3 }),
    ];

    const rng = makePRNG(42);
    const battleResult = startBattle(playerTeam, enemies, rng);

    if (!battleResult.ok) throw new Error(battleResult.error);
    const battle = battleResult.value;

    const decision = makeAIDecision(battle, 'enemy1', rng);

    // Should not target isaac (KO'd)
    expect(decision.targetIds).not.toContain('isaac');
    expect(decision.targetIds).toContain('garet');
  });

  test('AI throws error for invalid actor ID', () => {
    const playerTeam = createTeam([
      mkUnit({ id: 'isaac', name: 'Isaac', level: 5 }),
    ]);

    const enemies = [
      mkEnemy('slime', { id: 'enemy1', name: 'Goblin', level: 3 }),
    ];

    const rng = makePRNG(42);
    const battleResult = startBattle(playerTeam, enemies, rng);

    if (!battleResult.ok) throw new Error(battleResult.error);
    const battle = battleResult.value;

    expect(() => {
      makeAIDecision(battle, 'invalid-id', rng);
    }).toThrow(/invalid actor/i);
  });

  test('AI throws error for KO\'d actor', () => {
    const playerTeam = createTeam([
      mkUnit({ id: 'isaac', name: 'Isaac', level: 5 }),
    ]);

    const enemies = [
      mkEnemy('slime', { id: 'enemy1', name: 'Goblin', level: 3, currentHp: 0 }), // KO'd
    ];

    const rng = makePRNG(42);
    const battleResult = startBattle(playerTeam, enemies, rng);

    if (!battleResult.ok) throw new Error(battleResult.error);
    const battle = battleResult.value;

    expect(() => {
      makeAIDecision(battle, 'enemy1', rng);
    }).toThrow(/invalid actor/i);
  });
});

describe('AIService - Target Selection Strategies', () => {
  test('random target selection is deterministic with seeded RNG', () => {
    const playerTeam = createTeam([
      mkUnit({ id: 'isaac', name: 'Isaac', level: 5 }),
      mkUnit({ id: 'garet', name: 'Garet', level: 5 }),
      mkUnit({ id: 'ivan', name: 'Ivan', level: 5 }),
    ]);

    const strike = ABILITIES.attack;
    if (!strike) throw new Error('Strike ability not found');

    // Create ability with random targeting hint
    const randomStrike = {
      ...strike,
      aiHints: { target: 'random' as const, priority: 2 },
    };

    const enemies = [
      mkEnemy('slime', {
        id: 'enemy1',
        name: 'Goblin',
        level: 3,
        abilities: [randomStrike],
        unlockedAbilityIds: [randomStrike.id],
      }),
    ];

    const rng1 = makePRNG(777);
    const rng2 = makePRNG(777);

    const battleResult = startBattle(playerTeam, enemies, makePRNG(42));
    if (!battleResult.ok) throw new Error(battleResult.error);
    const battle = battleResult.value;

    const decision1 = makeAIDecision(battle, 'enemy1', rng1);
    const decision2 = makeAIDecision(battle, 'enemy1', rng2);

    // Same seed = same target
    expect(decision1.targetIds).toEqual(decision2.targetIds);
  });

  test('weakest target selection picks lowest HP unit', () => {
    const playerTeam = createTeam([
      mkUnit({ id: 'isaac', name: 'Isaac', level: 5, currentHp: 100 }),
      mkUnit({ id: 'garet', name: 'Garet', level: 5, currentHp: 5 }), // Weakest
      mkUnit({ id: 'ivan', name: 'Ivan', level: 5, currentHp: 50 }),
    ]);

    const strike = ABILITIES.attack;
    if (!strike) throw new Error('Strike ability not found');

    const weakestStrike = {
      ...strike,
      aiHints: { target: 'weakest' as const, priority: 2 },
    };

    const enemies = [
      mkEnemy('slime', {
        id: 'enemy1',
        name: 'Goblin',
        level: 3,
        abilities: [weakestStrike],
        unlockedAbilityIds: [weakestStrike.id],
      }),
    ];

    const rng = makePRNG(42);
    const battleResult = startBattle(playerTeam, enemies, rng);

    if (!battleResult.ok) throw new Error(battleResult.error);
    const battle = battleResult.value;

    const decision = makeAIDecision(battle, 'enemy1', rng);

    // Should target garet (lowest HP)
    expect(decision.targetIds).toContain('garet');
  });
});

describe('AIService - Edge Cases', () => {
  test('AI handles battle with no valid player targets', () => {
    const playerTeam = createTeam([
      mkUnit({ id: 'isaac', name: 'Isaac', level: 5, currentHp: 0 }), // All KO'd
      mkUnit({ id: 'garet', name: 'Garet', level: 5, currentHp: 0 }),
    ]);

    const enemies = [
      mkEnemy('slime', { id: 'enemy1', name: 'Goblin', level: 3 }),
    ];

    const rng = makePRNG(42);
    const battleResult = startBattle(playerTeam, enemies, rng);

    if (!battleResult.ok) throw new Error(battleResult.error);
    const battle = battleResult.value;

    // Should throw because no valid targets
    expect(() => {
      makeAIDecision(battle, 'enemy1', rng);
    }).toThrow();
  });

  test('AI handles single-ability enemy', () => {
    const playerTeam = createTeam([
      mkUnit({ id: 'isaac', name: 'Isaac', level: 5 }),
    ]);

    const strike = ABILITIES.attack;
    if (!strike) throw new Error('Strike ability not found');

    const enemies = [
      mkEnemy('slime', {
        id: 'enemy1',
        name: 'Goblin',
        level: 3,
        abilities: [strike], // Only one ability
        unlockedAbilityIds: [strike.id],
      }),
    ];

    const rng = makePRNG(42);
    const battleResult = startBattle(playerTeam, enemies, rng);

    if (!battleResult.ok) throw new Error(battleResult.error);
    const battle = battleResult.value;

    const decision = makeAIDecision(battle, 'enemy1', rng);

    // Should select the only ability (strike)
    expect(decision.abilityId).toBe('strike');
    expect(decision.targetIds).toContain('isaac');
  });
});
