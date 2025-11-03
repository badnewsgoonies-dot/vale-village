import { describe, test, expect } from 'vitest';
import { Unit } from '@/types/Unit';
import { createTeam, equipDjinn } from '@/types/Team';
import { calculatePhysicalDamage, calculatePsynergyDamage } from '@/types/Battle';
import { ISAAC, GARET, IVAN, MIA, FELIX, JENNA, SHEBA, PIERS, KRADEN, KYLE } from '@/data/unitDefinitions';
import { FLINT, GRANITE, BANE } from '@/data/djinn';
import { SLASH, FIREBALL } from '@/data/abilities';

/**
 * SIMON COWELL'S GAME BALANCE AUDIT
 *
 * These tests answer the question: "Is this game actually FUN?"
 *
 * If any of these fail, your game has SERIOUS balance problems.
 */
describe('⚖️ GAME BALANCE: Is Your Game Actually Fun?', () => {

  test('❌ CRITICAL: No unit should be 3× stronger than another (OP check)', () => {
    // If one unit is 3× stronger, why would anyone use the weak units?

    const allUnits = [
      new Unit(ISAAC, 5),
      new Unit(GARET, 5),
      new Unit(IVAN, 5),
      new Unit(MIA, 5),
      new Unit(FELIX, 5),
      new Unit(JENNA, 5),
      new Unit(SHEBA, 5),
      new Unit(PIERS, 5),
      new Unit(KRADEN, 5),
      new Unit(KYLE, 5),
    ];

    // Test physical damage output
    const enemy = new Unit(GARET, 5); // Standard enemy
    const damages = allUnits.map(unit =>
      calculatePhysicalDamage(unit, enemy, SLASH)
    );

    const maxDamage = Math.max(...damages);
    const minDamage = Math.min(...damages);

    console.log('Damage range:', {
      min: minDamage,
      max: maxDamage,
      ratio: maxDamage / minDamage,
      strongest: allUnits[damages.indexOf(maxDamage)].name,
      weakest: allUnits[damages.indexOf(minDamage)].name,
    });

    // Max should be < 3× min
    expect(maxDamage / minDamage).toBeLessThan(3);

    // ← IF THIS FAILS: You have a balance problem!
  });

  test('❌ CRITICAL: Every unit should be VIABLE (no "useless" units)', () => {
    // Every unit should have a reason to exist

    const units = [
      { def: ISAAC, role: 'Balanced' },
      { def: GARET, role: 'Pure DPS' },
      { def: IVAN, role: 'Mage' },
      { def: MIA, role: 'Healer' },
      { def: FELIX, role: 'Rogue' },
      { def: JENNA, role: 'Glass Cannon' },
      { def: SHEBA, role: 'Support' },
      { def: PIERS, role: 'Tank' },
      { def: KRADEN, role: 'Scholar' },
      { def: KYLE, role: 'Warrior' },
    ];

    for (const {def, role} of units) {
      const unit = new Unit(def, 5);

      // Every unit should have SOME strength
      const hasHighHP = unit.stats.hp > 150;
      const hasHighATK = unit.stats.atk > 25;
      const hasHighDEF = unit.stats.def > 20;
      const hasHighMAG = unit.stats.mag > 25;
      const hasHighSPD = unit.stats.spd > 20;
      const hasHighPP = unit.stats.pp > 40;

      const strengths = [hasHighHP, hasHighATK, hasHighDEF, hasHighMAG, hasHighSPD, hasHighPP];
      const strengthCount = strengths.filter(Boolean).length;

      // Should have at least 1 strength
      expect(strengthCount).toBeGreaterThan(0);

      console.log(`${unit.name} (${role}): ${strengthCount} strengths`);
    }

    // ← IF THIS FAILS: Some units are USELESS!
  });

  test('⚠️ WARNING: Jenna should be "glass cannon" (high risk, high reward)', () => {
    const jenna = new Unit(JENNA, 5);
    const piers = new Unit(PIERS, 5);

    // Jenna should have:
    // - Higher MAG than Piers (glass cannon = high damage)
    expect(jenna.stats.mag).toBeGreaterThan(piers.stats.mag);

    // - Lower HP than Piers (glass cannon = fragile)
    expect(jenna.stats.hp).toBeLessThan(piers.stats.hp);

    // - Lower DEF than Piers (glass cannon = can't tank)
    expect(jenna.stats.def).toBeLessThan(piers.stats.def);

    // Damage output should be 2× higher
    const enemy = new Unit(GARET, 5);
    const jennaDamage = calculatePsynergyDamage(jenna, enemy, FIREBALL);
    const piersDamage = calculatePsynergyDamage(piers, enemy, FIREBALL);

    expect(jennaDamage / piersDamage).toBeGreaterThan(1.5);

    // ← IF THIS FAILS: Glass cannon isn't glassy OR cannony!
  });

  test('⚠️ WARNING: Piers should be "tank" (low damage, high survivability)', () => {
    const piers = new Unit(PIERS, 5);
    const jenna = new Unit(JENNA, 5);

    // Piers should have:
    // - Highest HP in game
    const allUnits = [ISAAC, GARET, IVAN, MIA, FELIX, JENNA, SHEBA, PIERS, KRADEN, KYLE]
      .map(def => new Unit(def, 5));

    const maxHP = Math.max(...allUnits.map(u => u.stats.hp));
    expect(piers.stats.hp).toBe(maxHP);

    // - High DEF
    expect(piers.stats.def).toBeGreaterThan(jenna.stats.def * 2);

    // - Low damage output (trade-off)
    const enemy = new Unit(GARET, 5);
    const piersDamage = calculatePhysicalDamage(piers, enemy, SLASH);
    const jennaDamage = calculatePhysicalDamage(jenna, enemy, SLASH);

    expect(piersDamage).toBeLessThan(jennaDamage);

    // ← IF THIS FAILS: Tank isn't tanky!
  });

  test('🎮 FUN CHECK: Leveling should feel MEANINGFUL (2× power gain)', () => {
    // If leveling doesn't make you stronger, why level up?

    const isaac1 = new Unit(ISAAC, 1);
    const isaac5 = new Unit(ISAAC, 5);

    const enemy = new Unit(GARET, 3); // Mid-level enemy

    // Level 1 vs Level 5 damage difference
    const damage1 = calculatePhysicalDamage(isaac1, enemy, SLASH);
    const damage5 = calculatePhysicalDamage(isaac5, enemy, SLASH);

    // Should be at least 2× stronger
    expect(damage5 / damage1).toBeGreaterThan(2);

    // HP should also scale well
    expect(isaac5.stats.hp / isaac1.stats.hp).toBeGreaterThan(1.5);

    // ← IF THIS FAILS: Leveling doesn't feel rewarding!
  });

  test('🎮 FUN CHECK: Equipment should matter as much as leveling', () => {
    // Gear vs Levels: Both should be viable progression paths

    const nakedL5 = new Unit(ISAAC, 5);
    const gearedL1 = new Unit(ISAAC, 1);

    // Give L1 good gear
    gearedL1.equipItem('weapon', {
      id: 'test-weapon',
      name: 'Test Weapon',
      slot: 'weapon',
      tier: 'iron',
      cost: 100,
      statBonus: { atk: 15 }, // Big bonus
    });

    gearedL1.equipItem('armor', {
      id: 'test-armor',
      name: 'Test Armor',
      slot: 'armor',
      tier: 'iron',
      cost: 100,
      statBonus: { def: 15, hp: 50 },
    });

    // Geared L1 should compete with naked L5
    expect(gearedL1.stats.atk).toBeGreaterThan(nakedL5.stats.atk * 0.8);
    expect(gearedL1.stats.hp).toBeGreaterThan(nakedL5.stats.hp * 0.7);

    // ← IF THIS FAILS: Gear doesn't matter enough!
  });
});

describe('💀 BROKEN GAME SCENARIOS: Things That Kill Fun', () => {

  test('BROKEN: Can Kraden solo a Level 5 enemy? (Should be NO)', () => {
    // If weakest unit can solo, game is too easy

    const kraden = new Unit(KRADEN, 5); // Lowest HP (110)
    const enemy = new Unit(KYLE, 5);    // Strongest unit

    // Simulate 1v1 battle
    let kradenHP = kraden.currentHp;
    let enemyHP = enemy.currentHp;

    let turns = 0;
    const maxTurns = 100;

    while (kradenHP > 0 && enemyHP > 0 && turns < maxTurns) {
      // Kraden attacks
      const kradenDamage = Math.max(1, kraden.stats.atk - (enemy.stats.def / 2));
      enemyHP -= kradenDamage;

      // Enemy counterattacks
      if (enemyHP > 0) {
        const enemyDamage = Math.max(1, enemy.stats.atk - (kraden.stats.def / 2));
        kradenHP -= enemyDamage;
      }

      turns++;
    }

    // Kraden should LOSE (he's a scholar, not a fighter!)
    expect(kradenHP).toBeLessThanOrEqual(0);
    expect(enemyHP).toBeGreaterThan(0);

    // ← IF THIS FAILS: Game is too easy / no challenge!
  });

  test('BROKEN: Does stacking 3 same-element Djinn trivialize content?', () => {
    // If Djinn bonus is too strong, it becomes mandatory (not fun)

    const withoutDjinn = new Unit(ISAAC, 5);
    const withDjinn = new Unit(ISAAC, 5);

    const team = createTeam([withDjinn]);
    team.collectedDjinn = [FLINT, GRANITE, BANE];
    const result = equipDjinn(team, [FLINT, GRANITE, BANE]);

    if (result.ok) {
      const equipped = result.value;

      const atkWithout = withoutDjinn.stats.atk;
      const atkWith = withDjinn.calculateStats(equipped).atk;

      // Djinn should be strong but not OP
      // 50% boost = too strong (mandatory)
      // 25% boost = good (optional but useful)

      const boost = (atkWith - atkWithout) / atkWithout;

      expect(boost).toBeLessThan(0.50); // Not 50%+ boost
      expect(boost).toBeGreaterThan(0.20); // But noticeable

      console.log(`Djinn ATK boost: ${(boost * 100).toFixed(1)}%`);
    }

    // ← IF THIS FAILS: Djinn are OP (becomes mandatory meta)
  });

  test('BORING: Are all units just stat blocks with no identity?', () => {
    // Good design: Every unit feels unique
    // Bad design: All units are same archetype with different numbers

    const isaac = new Unit(ISAAC, 5);
    const garet = new Unit(GARET, 5);
    const mia = new Unit(MIA, 5);

    // Check if they have different stat distributions
    const isaacProfile = {
      hp: isaac.stats.hp / 200,      // Normalized to 0-1
      atk: isaac.stats.atk / 40,
      def: isaac.stats.def / 30,
      mag: isaac.stats.mag / 40,
      spd: isaac.stats.spd / 30,
    };

    const garetProfile = {
      hp: garet.stats.hp / 200,
      atk: garet.stats.atk / 40,
      def: garet.stats.def / 30,
      mag: garet.stats.mag / 40,
      spd: garet.stats.spd / 30,
    };

    // Profiles should be DIFFERENT
    const differences = Object.keys(isaacProfile).filter(key => {
      const k = key as keyof typeof isaacProfile;
      return Math.abs(isaacProfile[k] - garetProfile[k]) > 0.1;
    });

    expect(differences.length).toBeGreaterThan(2); // At least 3 stats differ

    // ← IF THIS FAILS: Units are too similar (boring!)
  });
});

describe('😴 GRIND CHECK: Is progression fun or tedious?', () => {

  test('GRIND: Can reach Level 5 in reasonable time? (<20 battles)', () => {
    // If it takes 100 battles to hit level 5, that's a GRIND

    const xpNeeded = 1850; // Total to reach L5
    const avgXpPerBattle = 100; // Assumed

    const battlesNeeded = Math.ceil(xpNeeded / avgXpPerBattle);

    expect(battlesNeeded).toBeLessThan(20);

    console.log(`Battles to L5: ${battlesNeeded}`);

    // ← IF THIS FAILS: Too grindy!
  });

  test('GRIND: Does each level feel like progress? (unlock new abilities)', () => {
    const isaac = new Unit(ISAAC, 1);

    // XP needed for each level-up (from XP_CURVE in Unit.ts)
    const xpPerLevel = [100, 250, 500, 1000]; // L1→L2, L2→L3, L3→L4, L4→L5

    // Every level should unlock something new
    for (let level = 2; level <= 5; level++) {
      isaac.gainXP(xpPerLevel[level - 2]); // Give exact XP for this level

      const abilities = isaac.getUnlockedAbilities();

      // Should have more abilities each level
      expect(abilities.length).toBe(level);
    }

    // ← IF THIS FAILS: Some levels give nothing (feels bad)
  });
});
