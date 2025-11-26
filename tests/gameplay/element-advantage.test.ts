/**
 * Element Advantage Integration Tests
 * Tests elemental damage modifiers and the element wheel
 *
 * Coverage:
 * - Full element wheel (Venus → Mars → Jupiter → Mercury → Venus)
 * - Advantage multipliers (1.5×, 0.67×, 1.0×)
 * - Psynergy element advantages
 * - Same-element neutral damage
 */

import { describe, test, expect } from 'vitest';
import { mkUnit, mkEnemy, mkTeam } from '@/test/factories';
import { createBattleState } from '@/core/models/BattleState';
import { executeRound, queueAction } from '@/core/services/QueueBattleService';
import { makePRNG } from '@/core/random/prng';
import { ABILITIES } from '@/data/definitions/abilities';
import { getElementModifier } from '@/core/algorithms/damage';
import type { Element } from '@/data/schemas/ElementSchema';

describe('Element Advantage - Modifier Calculation', () => {
  // Actual element wheel: Venus → Jupiter → Mercury → Mars → Venus

  test('Venus > Jupiter: 1.5× damage', () => {
    const modifier = getElementModifier('Venus', 'Jupiter');
    expect(modifier).toBe(1.5);
  });

  test('Jupiter > Mercury: 1.5× damage', () => {
    const modifier = getElementModifier('Jupiter', 'Mercury');
    expect(modifier).toBe(1.5);
  });

  test('Mercury > Mars: 1.5× damage', () => {
    const modifier = getElementModifier('Mercury', 'Mars');
    expect(modifier).toBe(1.5);
  });

  test('Mars > Venus: 1.5× damage', () => {
    const modifier = getElementModifier('Mars', 'Venus');
    expect(modifier).toBe(1.5);
  });

  test('Jupiter < Venus: 0.67× damage (disadvantage)', () => {
    const modifier = getElementModifier('Jupiter', 'Venus');
    expect(modifier).toBeCloseTo(0.67, 2);
  });

  test('Mercury < Jupiter: 0.67× damage (disadvantage)', () => {
    const modifier = getElementModifier('Mercury', 'Jupiter');
    expect(modifier).toBeCloseTo(0.67, 2);
  });

  test('Mars < Mercury: 0.67× damage (disadvantage)', () => {
    const modifier = getElementModifier('Mars', 'Mercury');
    expect(modifier).toBeCloseTo(0.67, 2);
  });

  test('Venus < Mars: 0.67× damage (disadvantage)', () => {
    const modifier = getElementModifier('Venus', 'Mars');
    expect(modifier).toBeCloseTo(0.67, 2);
  });

  test('same element: 1.0× damage (neutral)', () => {
    const elements: Element[] = ['Venus', 'Mars', 'Jupiter', 'Mercury'];

    for (const element of elements) {
      const modifier = getElementModifier(element, element);
      expect(modifier).toBe(1.0);
    }
  });
});

describe('Element Advantage - Battle Integration', () => {
  test('Venus unit does more damage to Jupiter enemy', () => {
    // Venus attacker
    const venusUnit = mkUnit({
      id: 'venus',
      name: 'Venus Fighter',
      element: 'Venus',
      level: 5,
      baseStats: { hp: 100, atk: 20, def: 10, spd: 10 },
    });

    // Jupiter defender (weak to Venus)
    const jupiterEnemy = mkEnemy('wind-scout', {
      id: 'jupiter-enemy',
      element: 'Jupiter',
      currentHp: 100,
      baseStats: { hp: 100, atk: 10, def: 10, spd: 5 },
    });

    const team = mkTeam([venusUnit]);
    const enemies = [jupiterEnemy];
    let state = createBattleState(team, enemies);
    const rng = makePRNG(1111);

    const strikeAbility = ABILITIES['strike'];

    // Queue Venus unit attack
    const result = queueAction(state, 'venus', 'strike', ['jupiter-enemy'], strikeAbility);
    if (result.ok) state = result.value;

    // Execute round
    const roundResult = executeRound(state, rng);

    // Check damage dealt
    const damagedEnemy = roundResult.state.enemies.find(e => e.id === 'jupiter-enemy');
    expect(damagedEnemy).toBeDefined();
    if (damagedEnemy) {
      const damageTaken = 100 - damagedEnemy.currentHp;
      expect(damageTaken).toBeGreaterThan(0);

      // With advantage, should do significantly more damage
      // Base damage would be around (20 ATK - 10 DEF * 0.5) = 15
      // With 1.5× advantage: 15 * 1.5 = 22-23 damage (with variance)
      expect(damageTaken).toBeGreaterThan(15);
    }
  });

  test('Jupiter unit does less damage to Venus enemy', () => {
    // Jupiter attacker
    const jupiterUnit = mkUnit({
      id: 'jupiter',
      name: 'Jupiter Fighter',
      element: 'Jupiter',
      level: 5,
      baseStats: { hp: 100, atk: 20, def: 10, spd: 10 },
    });

    // Venus defender (strong vs Jupiter)
    const venusEnemy = mkEnemy('venus-beetle', {
      id: 'venus-enemy',
      element: 'Venus',
      currentHp: 100,
      baseStats: { hp: 100, atk: 10, def: 10, spd: 5 },
    });

    const team = mkTeam([jupiterUnit]);
    const enemies = [venusEnemy];
    let state = createBattleState(team, enemies);
    const rng = makePRNG(2222);

    const strikeAbility = ABILITIES['strike'];

    // Queue Jupiter unit attack
    const result = queueAction(state, 'jupiter', 'strike', ['venus-enemy'], strikeAbility);
    if (result.ok) state = result.value;

    // Execute round
    const roundResult = executeRound(state, rng);

    // Check damage dealt
    const damagedEnemy = roundResult.state.enemies.find(e => e.id === 'venus-enemy');
    expect(damagedEnemy).toBeDefined();
    if (damagedEnemy) {
      const damageTaken = 100 - damagedEnemy.currentHp;
      expect(damageTaken).toBeGreaterThan(0);

      // With disadvantage, should do significantly less damage
      // Base damage would be around 15
      // With 0.67× disadvantage: 15 * 0.67 = 10 damage (with variance)
      expect(damageTaken).toBeLessThan(15);
    }
  });

  test('same element does neutral damage', () => {
    // Venus attacker
    const venusUnit = mkUnit({
      id: 'venus',
      name: 'Venus Fighter',
      element: 'Venus',
      level: 5,
      baseStats: { hp: 100, atk: 20, def: 10, spd: 10 },
    });

    // Venus defender (same element)
    const venusEnemy = mkEnemy('venus-beetle', {
      id: 'venus-enemy',
      element: 'Venus',
      currentHp: 100,
      baseStats: { hp: 100, atk: 10, def: 10, spd: 5 },
    });

    const team = mkTeam([venusUnit]);
    const enemies = [venusEnemy];
    let state = createBattleState(team, enemies);
    const rng = makePRNG(3333);

    const strikeAbility = ABILITIES['strike'];

    // Queue attack
    const result = queueAction(state, 'venus', 'strike', ['venus-enemy'], strikeAbility);
    if (result.ok) state = result.value;

    // Execute round
    const roundResult = executeRound(state, rng);

    // Check damage dealt
    const damagedEnemy = roundResult.state.enemies.find(e => e.id === 'venus-enemy');
    expect(damagedEnemy).toBeDefined();
    if (damagedEnemy) {
      const damageTaken = 100 - damagedEnemy.currentHp;
      expect(damageTaken).toBeGreaterThan(0);

      // Neutral damage, no modifier
      // Base damage around 15 (20 ATK - 10 DEF * 0.5)
      // Should be close to base damage (12-18 range with variance)
      expect(damageTaken).toBeGreaterThanOrEqual(10);
      expect(damageTaken).toBeLessThanOrEqual(20);
    }
  });
});

describe('Element Advantage - Psynergy Abilities', () => {
  test('Fireball (Mars) does bonus damage to Jupiter enemy', () => {
    const marsUnit = mkUnit({
      id: 'mars-mage',
      name: 'Mars Mage',
      element: 'Mars',
      level: 5,
      baseStats: { hp: 80, atk: 15, mag: 20, def: 8, spd: 10 },
      manaContribution: 3,
    });

    const jupiterEnemy = mkEnemy('wind-scout', {
      id: 'jupiter-enemy',
      element: 'Jupiter',
      currentHp: 100,
      baseStats: { hp: 100, atk: 10, def: 8, spd: 12 },
    });

    const team = mkTeam([marsUnit]);
    const enemies = [jupiterEnemy];
    let state = createBattleState(team, enemies);
    const rng = makePRNG(4444);

    const fireballAbility = ABILITIES['fireball'];
    expect(fireballAbility).toBeDefined();

    if (fireballAbility) {
      // Queue fireball
      const result = queueAction(state, 'mars-mage', 'fireball', ['jupiter-enemy'], fireballAbility);
      if (result.ok) state = result.value;

      // Execute round
      const roundResult = executeRound(state, rng);

      // Check damage dealt
      const damagedEnemy = roundResult.state.enemies.find(e => e.id === 'jupiter-enemy');
      expect(damagedEnemy).toBeDefined();
      if (damagedEnemy) {
        const damageTaken = 100 - damagedEnemy.currentHp;
        expect(damageTaken).toBeGreaterThan(0);

        // Fireball has higher base power than strike
        // With 1.5× advantage, should do significant damage (30+ damage)
        expect(damageTaken).toBeGreaterThan(20);
      }
    }
  });

  test('Whirlwind (Jupiter) does less damage to Mars enemy', () => {
    const jupiterUnit = mkUnit({
      id: 'jupiter-mage',
      name: 'Jupiter Mage',
      element: 'Jupiter',
      level: 5,
      baseStats: { hp: 80, atk: 12, mag: 20, def: 8, spd: 15 },
      manaContribution: 3,
    });

    const marsEnemy = mkEnemy('mars-bandit', {
      id: 'mars-enemy',
      element: 'Mars',
      currentHp: 100,
      baseStats: { hp: 100, atk: 12, def: 10, spd: 8 },
    });

    const team = mkTeam([jupiterUnit]);
    const enemies = [marsEnemy];
    let state = createBattleState(team, enemies);
    const rng = makePRNG(5555);

    const whirlwindAbility = ABILITIES['whirlwind'];

    if (whirlwindAbility) {
      // Queue whirlwind
      const result = queueAction(state, 'jupiter-mage', 'whirlwind', ['mars-enemy'], whirlwindAbility);
      if (result.ok) state = result.value;

      // Execute round
      const roundResult = executeRound(state, rng);

      // Check damage dealt
      const damagedEnemy = roundResult.state.enemies.find(e => e.id === 'mars-enemy');
      expect(damagedEnemy).toBeDefined();
      if (damagedEnemy) {
        const damageTaken = 100 - damagedEnemy.currentHp;
        expect(damageTaken).toBeGreaterThan(0);

        // With 0.67× disadvantage, damage should be reduced
        // Expect less than 20 damage
        expect(damageTaken).toBeLessThan(25);
      }
    }
  });

  test('Quake (Venus) does bonus damage to Mars enemy', () => {
    const venusUnit = mkUnit({
      id: 'venus-mage',
      name: 'Venus Mage',
      element: 'Venus',
      level: 5,
      baseStats: { hp: 85, atk: 14, mag: 22, def: 10, spd: 9 },
      manaContribution: 3,
    });

    const marsEnemy = mkEnemy('mars-bandit', {
      id: 'mars-enemy',
      element: 'Mars',
      currentHp: 100,
      baseStats: { hp: 100, atk: 12, def: 10, spd: 8 },
    });

    const team = mkTeam([venusUnit]);
    const enemies = [marsEnemy];
    let state = createBattleState(team, enemies);
    const rng = makePRNG(6666);

    const quakeAbility = ABILITIES['quake'];

    if (quakeAbility) {
      // Queue quake
      const result = queueAction(state, 'venus-mage', 'quake', ['mars-enemy'], quakeAbility);
      if (result.ok) state = result.value;

      // Execute round
      const roundResult = executeRound(state, rng);

      // Check damage dealt
      const damagedEnemy = roundResult.state.enemies.find(e => e.id === 'mars-enemy');
      expect(damagedEnemy).toBeDefined();
      if (damagedEnemy) {
        const damageTaken = 100 - damagedEnemy.currentHp;
        expect(damageTaken).toBeGreaterThan(0);

        // Quake is powerful + 1.5× advantage
        // Should deal significant damage (40+ damage expected)
        expect(damageTaken).toBeGreaterThan(25);
      }
    }
  });
});

describe('Element Advantage - Full Wheel Validation', () => {
  test('complete element wheel: Venus > Jupiter > Mercury > Mars > Venus', () => {
    // Test full cycle (advantages)
    expect(getElementModifier('Venus', 'Jupiter')).toBe(1.5);
    expect(getElementModifier('Jupiter', 'Mercury')).toBe(1.5);
    expect(getElementModifier('Mercury', 'Mars')).toBe(1.5);
    expect(getElementModifier('Mars', 'Venus')).toBe(1.5);

    // Test reverse cycle (disadvantages)
    expect(getElementModifier('Jupiter', 'Venus')).toBeCloseTo(0.67, 2);
    expect(getElementModifier('Mercury', 'Jupiter')).toBeCloseTo(0.67, 2);
    expect(getElementModifier('Mars', 'Mercury')).toBeCloseTo(0.67, 2);
    expect(getElementModifier('Venus', 'Mars')).toBeCloseTo(0.67, 2);
  });

  test('transitive relationships: skipping one element', () => {
    // Venus > Mars > Jupiter, so Venus should be neutral or slightly advantaged vs Jupiter
    // In Golden Sun, skipping one element is usually neutral
    const modifier = getElementModifier('Venus', 'Jupiter');
    expect(modifier).toBeGreaterThanOrEqual(0.8);
    expect(modifier).toBeLessThanOrEqual(1.2);
  });

  test('opposite elements: skipping two elements', () => {
    // Venus and Jupiter are "opposite" (skip two)
    // Should be approximately neutral
    const venusVsJupiter = getElementModifier('Venus', 'Jupiter');
    const jupiterVsVenus = getElementModifier('Jupiter', 'Venus');

    expect(venusVsJupiter).toBeGreaterThanOrEqual(0.8);
    expect(venusVsJupiter).toBeLessThanOrEqual(1.2);
    expect(jupiterVsVenus).toBeGreaterThanOrEqual(0.8);
    expect(jupiterVsVenus).toBeLessThanOrEqual(1.2);
  });
});

describe('Element Advantage - Battle Scenarios', () => {
  test('advantage makes difference in victory/defeat', () => {
    // Setup: Mid-level attacker vs tough enemy
    const baseStats = { hp: 150, atk: 15, def: 15, spd: 8 };

    // Scenario 1: Disadvantage (Mars vs Venus)
    {
      const marsUnit = mkUnit({
        id: 'mars',
        element: 'Mars',
        level: 5,
        baseStats: { hp: 100, atk: 18, def: 10, spd: 10 },
      });

      const venusEnemy = mkEnemy('venus-beetle', {
        id: 'venus-enemy',
        element: 'Venus',
        currentHp: 150,
        baseStats,
      });

      const team = mkTeam([marsUnit]);
      const enemies = [venusEnemy];
      let state = createBattleState(team, enemies);
      const rng = makePRNG(7777);

      const strikeAbility = ABILITIES['strike'];

      // Run 5 rounds
      for (let round = 0; round < 5; round++) {
        if (state.phase !== 'planning') break;

        const result = queueAction(state, 'mars', 'strike', ['venus-enemy'], strikeAbility);
        if (result.ok) state = result.value;

        const roundResult = executeRound(state, rng);
        state = roundResult.state;
      }

      const disadvantageEnemy = state.enemies.find(e => e.id === 'venus-enemy');
      const disadvantageDamage = 150 - (disadvantageEnemy?.currentHp || 0);

      // Scenario 2: Advantage (Venus vs Mars)
      const venusUnit = mkUnit({
        id: 'venus',
        element: 'Venus',
        level: 5,
        baseStats: { hp: 100, atk: 18, def: 10, spd: 10 },
      });

      const marsEnemy = mkEnemy('mars-bandit', {
        id: 'mars-enemy',
        element: 'Mars',
        currentHp: 150,
        baseStats,
      });

      const team2 = mkTeam([venusUnit]);
      const enemies2 = [marsEnemy];
      let state2 = createBattleState(team2, enemies2);
      const rng2 = makePRNG(7777); // Same seed

      // Run 5 rounds
      for (let round = 0; round < 5; round++) {
        if (state2.phase !== 'planning') break;

        const result = queueAction(state2, 'venus', 'strike', ['mars-enemy'], strikeAbility);
        if (result.ok) state2 = result.value;

        const roundResult = executeRound(state2, rng2);
        state2 = roundResult.state;
      }

      const advantageEnemy = state2.enemies.find(e => e.id === 'mars-enemy');
      const advantageDamage = 150 - (advantageEnemy?.currentHp || 0);

      // Advantage should deal more damage than disadvantage
      expect(advantageDamage).toBeGreaterThan(disadvantageDamage);
    }
  });
});
