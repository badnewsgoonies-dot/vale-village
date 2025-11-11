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
import { ALL_EQUIPMENT } from '../../src/data/definitions/equipment';
import { mkUnit, mkEnemy, mkTeam } from '../../src/test/factories';

describe('Progression - Leveling Matters', () => {
  test('Level 1 Isaac loses to Level 5 Bandit, Level 5 Isaac wins', () => {
    // Create a tough enemy
    const bandit = mkEnemy('bandit', {
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

        // Isaac attacks
        const queueResult = queueAction(battle, 'isaac', null, ['bandit']);
        if (!queueResult.ok) throw new Error(queueResult.error);
        battle = queueResult.value;

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

        // Isaac attacks
        const queueResult = queueAction(battle, 'isaac', null, ['bandit']);
        if (!queueResult.ok) throw new Error(queueResult.error);
        battle = queueResult.value;

        // Execute round
        const result = executeRound(battle, rng);
        battle = result.state;
      }

      // Isaac should have won
      expect(battle.phase).toBe('victory');
    }
  });

  test('Weak party loses to boss, strong party wins', () => {
    const boss = mkEnemy('gladiator', {
      id: 'boss',
      name: 'Fire Dragon',
      level: 10,
      baseStats: { hp: 300, atk: 25, def: 20, spd: 12 },
    });

    // Weak party (Level 1)
    {
      const weakParty = createTeam([
        mkUnit({ id: 'u1', name: 'Fighter', level: 1, baseStats: { hp: 60, atk: 8 } }),
        mkUnit({ id: 'u2', name: 'Mage', level: 1, baseStats: { hp: 50, atk: 6 } }),
        mkUnit({ id: 'u3', name: 'Cleric', level: 1, baseStats: { hp: 55, atk: 5 } }),
        mkUnit({ id: 'u4', name: 'Rogue', level: 1, baseStats: { hp: 65, atk: 9 } }),
      ]);

      const rng = makePRNG(42);
      let battle = initializeBattle(weakParty, [{ ...boss }], rng);

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
      const strongParty = createTeam([
        mkUnit({ id: 'u1', name: 'Fighter', level: 5, baseStats: { hp: 120, atk: 18 } }),
        mkUnit({ id: 'u2', name: 'Mage', level: 5, baseStats: { hp: 90, atk: 16 } }),
        mkUnit({ id: 'u3', name: 'Cleric', level: 5, baseStats: { hp: 100, atk: 14 } }),
        mkUnit({ id: 'u4', name: 'Rogue', level: 5, baseStats: { hp: 110, atk: 19 } }),
      ]);

      const rng = makePRNG(42);
      let battle = initializeBattle(strongParty, [{ ...boss }], rng);

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
    const enemy = mkEnemy('beetle', {
      id: 'enemy',
      name: 'Armored Knight',
      level: 3,
      baseStats: { hp: 100, atk: 12, def: 15, spd: 5 },
    });

    // Unequipped Isaac
    {
      const isaacNaked = mkUnit({
        id: 'isaac',
        name: 'Isaac',
        level: 3,
        baseStats: { hp: 85, atk: 12, def: 8, spd: 8 },
        equipment: { weapon: null, armor: null, helm: null, boots: null },
      });

      const rng = makePRNG(200);
      let battle = startBattle(mkTeam([isaacNaked]), [{ ...enemy }], rng);

      // Simulate battle
      for (let round = 0; round < 20; round++) {
        if (battle.phase !== 'planning') break;
        const queueResult = queueAction(battle, 'isaac', null, ['enemy']);
        if (!queueResult.ok) throw new Error(queueResult.error);
        battle = queueResult.value;
        const result = executeRound(battle, rng);
        battle = result.state;
      }

      // Should lose without equipment
      expect(battle.phase).toBe('defeat');
    }

    // Fully equipped Isaac
    {
      const legendarySword = ALL_EQUIPMENT.find(e => e.id === 'legendary-sword');
      const platinumArmor = ALL_EQUIPMENT.find(e => e.id === 'platinum-armor');
      const warriorsHelm = ALL_EQUIPMENT.find(e => e.id === 'warriors-helm');
      const hypersBoots = ALL_EQUIPMENT.find(e => e.id === 'hypers-boots');

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
        },
      });

      const rng = makePRNG(200);
      let battle = startBattle(mkTeam([isaacEquipped]), [{ ...enemy }], rng);

      // Simulate battle
      for (let round = 0; round < 20; round++) {
        if (battle.phase !== 'planning') break;
        const queueResult = queueAction(battle, 'isaac', null, ['enemy']);
        if (!queueResult.ok) throw new Error(queueResult.error);
        battle = queueResult.value;
        const result = executeRound(battle, rng);
        battle = result.state;
      }

      // Should win with equipment
      expect(battle.phase).toBe('victory');
    }
  });

  test('Better weapon = faster kill', () => {
    const enemy = mkEnemy('slime', {
      id: 'enemy',
      name: 'Target Dummy',
      level: 2,
      baseStats: { hp: 80, atk: 5, def: 5, spd: 5 },
    });

    // With basic weapon
    let roundsWithBasic = 0;
    {
      const ironSword = ALL_EQUIPMENT.find(e => e.id === 'iron-sword');
      const isaac = mkUnit({
        id: 'isaac',
        name: 'Isaac',
        level: 3,
        baseStats: { hp: 85, atk: 12, def: 8, spd: 8 },
        equipment: { weapon: ironSword || null, armor: null, helm: null, boots: null },
      });

      const rng = makePRNG(300);
      let battle = startBattle(mkTeam([isaac]), [{ ...enemy }], rng);

      for (let round = 0; round < 20; round++) {
        if (battle.phase !== 'planning') break;
        roundsWithBasic++;
        const queueResult = queueAction(battle, 'isaac', null, ['enemy']);
        if (!queueResult.ok) throw new Error(queueResult.error);
        battle = queueResult.value;
        const result = executeRound(battle, rng);
        battle = result.state;
      }

      expect(battle.phase).toBe('victory');
    }

    // With legendary weapon
    let roundsWithLegendary = 0;
    {
      const legendarySword = ALL_EQUIPMENT.find(e => e.id === 'legendary-sword');
      const isaac = mkUnit({
        id: 'isaac',
        name: 'Isaac',
        level: 3,
        baseStats: { hp: 85, atk: 12, def: 8, spd: 8 },
        equipment: { weapon: legendarySword || null, armor: null, helm: null, boots: null },
      });

      const rng = makePRNG(300);
      let battle = startBattle(mkTeam([isaac]), [{ ...enemy }], rng);

      for (let round = 0; round < 20; round++) {
        if (battle.phase !== 'planning') break;
        roundsWithLegendary++;
        const queueResult = queueAction(battle, 'isaac', null, ['enemy']);
        if (!queueResult.ok) throw new Error(queueResult.error);
        battle = queueResult.value;
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
    const enemy = mkEnemy('gladiator', {
      id: 'enemy',
      name: 'Tough Golem',
      level: 5,
      baseStats: { hp: 150, atk: 18, def: 15, spd: 5 },
    });

    // Unit with only basic attack
    let roundsWithBasic = 0;
    {
      const isaac = mkUnit({
        id: 'isaac',
        name: 'Isaac',
        level: 5,
        baseStats: { hp: 110, atk: 16, def: 10, spd: 10 },
        abilities: [], // No special abilities
        unlockedAbilityIds: [],
      });

      const rng = makePRNG(400);
      let battle = startBattle(mkTeam([isaac]), [{ ...enemy }], rng);

      for (let round = 0; round < 30; round++) {
        if (battle.phase !== 'planning') break;
        roundsWithBasic++;
        const queueResult = queueAction(battle, 'isaac', null, ['enemy']);
        if (!queueResult.ok) throw new Error(queueResult.error);
        battle = queueResult.value;
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
        let queueResult: ReturnType<typeof queueAction>;
        if (battle.remainingMana >= chainLightning.manaCost && chainLightning) {
          queueResult = queueAction(battle, 'isaac', 'chain-lightning', ['enemy'], chainLightning);
        } else {
          queueResult = queueAction(battle, 'isaac', null, ['enemy']);
        }
        if (!queueResult.ok) throw new Error(queueResult.error);
        battle = queueResult.value;

        const result = executeRound(battle, rng);
        battle = result.state;
      }

      expect(battle.phase).toBe('victory');
    }

    // Abilities should win faster
    expect(roundsWithAbilities).toBeLessThan(roundsWithBasic);
  });
});
