/**
 * Progression Tests
 * Context-aware tests that prove leveling, equipment, and Djinn actually matter
 * Tests the core premise: "Level X loses, Level Y wins"
 */

import { describe, test, expect } from 'vitest';
import { queueAction, executeRound } from '../../src/core/services/QueueBattleService';
import { startBattle } from '../../src/core/services/BattleService';
import { createTeam } from '../../src/core/models/Team';
import { makePRNG } from '../../src/core/random/prng';
import { ABILITIES } from '../../src/data/definitions/abilities';
import { EQUIPMENT } from '../../src/data/definitions/equipment';
import { mkUnit, mkEnemy, mkTeam } from '../../src/test/factories';
import type { Ability } from '../../src/data/schemas/AbilitySchema';

function queueAllUnits(
  battle: ReturnType<typeof startBattle>,
  targetId: string,
  mainUnitId?: string,
  abilityId?: string | null,
  ability?: Ability
) {
  let state = battle;
  // Queue actions for all player units (including placeholders if alive)
  for (const unit of state.playerTeam.units) {
    if (unit.currentHp <= 0) continue; // Skip KO'd units
    // Only use ability for the main unit, and only if ability is provided and not null
    const useAbility = unit.id === mainUnitId && abilityId !== undefined && abilityId !== null;
    const result = queueAction(
      state,
      unit.id,
      useAbility ? abilityId : null,
      [targetId],
      useAbility ? ability : undefined
    );
    if (!result.ok) throw new Error(result.error);
    state = result.value;
  }
  return state;
}

describe('Progression - Leveling Matters', () => {
  test('Level 1 Isaac loses to Level 5 Bandit, Level 5 Isaac wins', () => {
    // Create a tough enemy
    const bandit = mkEnemy('mars-bandit', {
      id: 'bandit',
      name: 'Bandit',
      level: 5,
      baseStats: { hp: 100, atk: 15, def: 10, spd: 8 },
    });

    // Test with Level 1 Isaac
    {
      const isaacLv1 = mkUnit({
        id: 'isaac',
        name: 'Isaac',
        level: 1,
        baseStats: { hp: 70, atk: 8, def: 5, spd: 6 },
      });

      const playerTeam = mkTeam([isaacLv1]);
      const enemies = [{ ...bandit }];

      const rng = makePRNG(100);
      let battle = startBattle(playerTeam, enemies, rng);

      // Simulate 20 rounds (should lose before then)
      for (let round = 0; round < 20; round++) {
        if (battle.phase !== 'planning') break;

        // Queue actions for all player units
        for (const unit of battle.playerTeam.units) {
          const queueResult = queueAction(battle, unit.id, null, ['bandit']);
          if (!queueResult.ok) throw new Error(queueResult.error);
          battle = queueResult.value;
        }

        // Execute round
        const result = executeRound(battle, rng);
        battle = result.state;
      }

      // Isaac should have lost
      expect(battle.phase).toBe('defeat');
    }

    // Test with Level 5 Isaac (same stats structure, higher level)
    {
      const isaacLv5 = mkUnit({
        id: 'isaac',
        name: 'Isaac',
        level: 5,
        baseStats: { hp: 110, atk: 16, def: 10, spd: 10 }, // Stat growth applied
      });

      const playerTeam = mkTeam([isaacLv5]);
      const enemies = [{ ...bandit }];

      const rng = makePRNG(100);
      let battle = startBattle(playerTeam, enemies, rng);

      // Simulate 20 rounds
      for (let round = 0; round < 20; round++) {
        if (battle.phase !== 'planning') break;

        // Queue actions for all player units
        for (const unit of battle.playerTeam.units) {
          const queueResult = queueAction(battle, unit.id, null, ['bandit']);
          if (!queueResult.ok) throw new Error(queueResult.error);
          battle = queueResult.value;
        }

        // Execute round
        const result = executeRound(battle, rng);
        battle = result.state;
      }

      // Isaac should have won
      expect(battle.phase).toBe('victory');
    }
  });

  test('Weak party loses to boss, strong party wins', () => {
    const boss = mkEnemy('granite-warlord', {
      id: 'boss',
      name: 'Fire Dragon',
      level: 10,
      baseStats: { hp: 300, atk: 25, def: 20, spd: 12 },
    });

    // Weak party (Level 1)
    {
      const weakParty = mkTeam([
        mkUnit({ id: 'u1', name: 'Fighter', level: 1, baseStats: { hp: 60, atk: 8 } }),
        mkUnit({ id: 'u2', name: 'Mage', level: 1, baseStats: { hp: 50, atk: 6 } }),
        mkUnit({ id: 'u3', name: 'Cleric', level: 1, baseStats: { hp: 55, atk: 5 } }),
        mkUnit({ id: 'u4', name: 'Rogue', level: 1, baseStats: { hp: 65, atk: 9 } }),
      ]);

      const rng = makePRNG(42);
      let battle = startBattle(weakParty, [{ ...boss }], rng);

      // Simulate 10 rounds
      for (let round = 0; round < 10; round++) {
        if (battle.phase !== 'planning') break;

        // All units attack boss
        let queueResult = queueAction(battle, 'u1', null, ['boss']);
        if (!queueResult.ok) throw new Error(queueResult.error);
        battle = queueResult.value;
        queueResult = queueAction(battle, 'u2', null, ['boss']);
        if (!queueResult.ok) throw new Error(queueResult.error);
        battle = queueResult.value;
        queueResult = queueAction(battle, 'u3', null, ['boss']);
        if (!queueResult.ok) throw new Error(queueResult.error);
        battle = queueResult.value;
        queueResult = queueAction(battle, 'u4', null, ['boss']);
        if (!queueResult.ok) throw new Error(queueResult.error);
        battle = queueResult.value;

        const result = executeRound(battle, rng);
        battle = result.state;
      }

      // Weak party should lose
      expect(battle.phase).toBe('defeat');
    }

    // Strong party (Level 5)
    {
      const strongParty = mkTeam([
        mkUnit({ id: 'u1', name: 'Fighter', level: 5, baseStats: { hp: 120, atk: 18 } }),
        mkUnit({ id: 'u2', name: 'Mage', level: 5, baseStats: { hp: 90, atk: 16 } }),
        mkUnit({ id: 'u3', name: 'Cleric', level: 5, baseStats: { hp: 100, atk: 14 } }),
        mkUnit({ id: 'u4', name: 'Rogue', level: 5, baseStats: { hp: 110, atk: 19 } }),
      ]);

      const rng = makePRNG(42);
      let battle = startBattle(strongParty, [{ ...boss }], rng);

      // Simulate 20 rounds
      for (let round = 0; round < 20; round++) {
        if (battle.phase !== 'planning') break;

        // All units attack boss
        let queueResult = queueAction(battle, 'u1', null, ['boss']);
        if (!queueResult.ok) throw new Error(queueResult.error);
        battle = queueResult.value;
        queueResult = queueAction(battle, 'u2', null, ['boss']);
        if (!queueResult.ok) throw new Error(queueResult.error);
        battle = queueResult.value;
        queueResult = queueAction(battle, 'u3', null, ['boss']);
        if (!queueResult.ok) throw new Error(queueResult.error);
        battle = queueResult.value;
        queueResult = queueAction(battle, 'u4', null, ['boss']);
        if (!queueResult.ok) throw new Error(queueResult.error);
        battle = queueResult.value;

        const result = executeRound(battle, rng);
        battle = result.state;
      }

      // Strong party should win
      expect(battle.phase).toBe('victory');
    }
  });
});

describe('Progression - Equipment Matters', () => {
  test('Unequipped unit loses, fully equipped unit wins', () => {
    const enemy = mkEnemy('venus-beetle', {
      id: 'enemy',
      name: 'Armored Knight',
      level: 3,
      baseStats: { hp: 200, atk: 20, def: 25, spd: 5 }, // Increased stats to ensure unequipped loses
    });

    // Unequipped Isaac
    {
      const isaacNaked = mkUnit({
        id: 'isaac',
        name: 'Isaac',
        level: 3,
        baseStats: { hp: 85, atk: 12, def: 8, spd: 8 },
        equipment: { weapon: null, armor: null, helm: null, boots: null, accessory: null },
      });

      const rng = makePRNG(200);
      let battle = startBattle(mkTeam([isaacNaked]), [{ ...enemy }], rng);

      // Simulate battle - only queue Isaac, not placeholders
      for (let round = 0; round < 20; round++) {
        if (battle.phase !== 'planning') break;
        battle = queueAllUnits(battle, 'enemy');
        const result = executeRound(battle, rng);
        battle = result.state;
      }

      // Should lose without equipment
      expect(battle.phase).toBe('defeat');
    }

    // Fully equipped Isaac
    {
      const legendarySword = EQUIPMENT['legendary-sword'];
      const platinumArmor = EQUIPMENT['platinum-armor'];
      const warriorsHelm = EQUIPMENT['warriors-helm'];
      const hypersBoots = EQUIPMENT['hypers-boots'];

      const isaacEquipped = mkUnit({
        id: 'isaac',
        name: 'Isaac',
        level: 3,
        baseStats: { hp: 85, atk: 12, def: 8, spd: 8 },
        equipment: {
          weapon: legendarySword || null,
          armor: platinumArmor || null,
          helm: warriorsHelm || null,
          boots: hypersBoots || null,
          accessory: null,
        },
      });

      const rng = makePRNG(200);
      let battle = startBattle(mkTeam([isaacEquipped]), [{ ...enemy }], rng);

      // Simulate battle - only queue Isaac
      for (let round = 0; round < 20; round++) {
        if (battle.phase !== 'planning') break;
        battle = queueAllUnits(battle, 'enemy');
        const result = executeRound(battle, rng);
        battle = result.state;
      }

      // Should win with equipment
      expect(battle.phase).toBe('victory');
    }
  });

  test('Better weapon = faster kill', () => {
    const enemy = mkEnemy('mercury-slime', {
      id: 'enemy',
      name: 'Target Dummy',
      level: 2,
      baseStats: { hp: 120, atk: 5, def: 10, spd: 5 }, // Increased for multi-round test
    });

    // With basic weapon
    let roundsWithBasic = 0;
    {
      const ironSword = EQUIPMENT['iron-sword'];
      const isaac = mkUnit({
        id: 'isaac',
        name: 'Isaac',
        level: 3,
        baseStats: { hp: 85, atk: 12, def: 8, spd: 8 },
        equipment: { weapon: ironSword || null, armor: null, helm: null, boots: null, accessory: null },
      });

      const rng = makePRNG(300);
      let battle = startBattle(mkTeam([isaac]), [{ ...enemy }], rng);

      for (let round = 0; round < 20; round++) {
        if (battle.phase !== 'planning') break;
        roundsWithBasic++;
        battle = queueAllUnits(battle, 'enemy');
        const result = executeRound(battle, rng);
        battle = result.state;
      }

      expect(battle.phase).toBe('victory');
    }

    // With legendary weapon
    let roundsWithLegendary = 0;
    {
      const legendarySword = EQUIPMENT['legendary-sword'];
      const isaac = mkUnit({
        id: 'isaac',
        name: 'Isaac',
        level: 3,
        baseStats: { hp: 85, atk: 12, def: 8, spd: 8 },
        equipment: { weapon: legendarySword || null, armor: null, helm: null, boots: null, accessory: null },
      });

      const rng = makePRNG(300);
      let battle = startBattle(mkTeam([isaac]), [{ ...enemy }], rng);

      for (let round = 0; round < 20; round++) {
        if (battle.phase !== 'planning') break;
        roundsWithLegendary++;
        battle = queueAllUnits(battle, 'enemy');
        const result = executeRound(battle, rng);
        battle = result.state;
      }

      expect(battle.phase).toBe('victory');
    }

    // Legendary should kill faster
    expect(roundsWithLegendary).toBeLessThan(roundsWithBasic);
  });
});

describe('Progression - Abilities Matter', () => {
  test('Unit with strong abilities beats unit with only basic attack', () => {
    const enemy = mkEnemy('granite-warlord', {
      id: 'enemy',
      name: 'Tough Golem',
      level: 5,
      baseStats: { hp: 200, atk: 18, def: 15, spd: 5 }, // Increased HP for multi-round test
    });

    // Unit with only basic attack
    let roundsWithBasic = 0;
    {
      const strike = ABILITIES.strike;
      if (!strike) {
        throw new Error('Strike ability not found');
      }

      const isaac = mkUnit({
        id: 'isaac',
        name: 'Isaac',
        level: 5,
        baseStats: { hp: 110, atk: 16, def: 10, spd: 10 },
        abilities: [strike], // Only basic attack, no special abilities
        unlockedAbilityIds: [strike.id],
      });

      const rng = makePRNG(400);
      let battle = startBattle(mkTeam([isaac]), [{ ...enemy }], rng);

      for (let round = 0; round < 30; round++) {
        if (battle.phase !== 'planning') break;
        roundsWithBasic++;
        battle = queueAllUnits(battle, 'enemy');
        const result = executeRound(battle, rng);
        battle = result.state;
      }
    }

    // Unit with powerful abilities
    let roundsWithAbilities = 0;
    {
      const chainLightning = ABILITIES['chain-lightning'];
      const quake = ABILITIES.quake;

      if (!chainLightning || !quake) {
        throw new Error('Required abilities not found');
      }

      const isaac = mkUnit({
        id: 'isaac',
        name: 'Isaac',
        level: 5,
        baseStats: { hp: 110, atk: 16, def: 10, spd: 10 },
        abilities: [chainLightning, quake],
        unlockedAbilityIds: [chainLightning.id, quake.id],
      });

      const rng = makePRNG(400);
      let battle = startBattle(mkTeam([isaac]), [{ ...enemy }], rng);

      for (let round = 0; round < 30; round++) {
        if (battle.phase !== 'planning') break;
        roundsWithAbilities++;

        // Use powerful ability if enough mana
        const abilityToUse = battle.remainingMana >= chainLightning.manaCost ? 'chain-lightning' : null;
        battle = queueAllUnits(battle, 'enemy', 'isaac', abilityToUse, chainLightning);
        const result = executeRound(battle, rng);
        battle = result.state;
      }

      expect(battle.phase).toBe('victory');
    }

    // Abilities should win faster
    expect(roundsWithAbilities).toBeLessThan(roundsWithBasic);
  });
});
