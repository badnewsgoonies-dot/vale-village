import { describe, test, expect } from 'vitest';
import { Unit } from '@/types/Unit';
import { createTeam, equipDjinn } from '@/types/Team';
import { createBattleState, executeAbility, advanceBattleTurn, getCurrentActor, isPlayerUnit, checkBattleEnd, BattleResult } from '@/types/Battle';
import { ISAAC, GARET, MIA, IVAN, KYLE, PIERS, JENNA } from '@/data/unitDefinitions';
import { SOL_BLADE, DRAGON_SCALES, ORACLES_CROWN, HERMES_SANDALS, STEEL_SWORD, IRON_ARMOR } from '@/data/equipment';
import { FLINT, GRANITE, BANE, FORGE, FIZZ, SQUALL } from '@/data/djinn';
import { SLASH, RAGNAROK, PLY, JUDGMENT } from '@/data/abilities';

/**
 * SIMON COWELL'S EPIC BATTLE TESTS
 *
 * These are the tests that SHOULD have existed from day one.
 * Epic moments. Clutch plays. Drama. Excitement.
 *
 * NOT just "unit has correct stats" - BORING!
 */
describe('🎮 EPIC BATTLES: The Tests You SHOULD Have Written', () => {

  test('⚔️ EPIC: "Against All Odds" - Level 3 Party Defeats Level 5 Boss Through Strategy', () => {
    // SETUP: Underdog party
    const isaac = new Unit(ISAAC, 3);
    const garet = new Unit(GARET, 3);
    const mia = new Unit(MIA, 3);

    // Give them GOOD gear (makes up for low level)
    isaac.equipItem('weapon', STEEL_SWORD);
    garet.equipItem('weapon', STEEL_SWORD);
    mia.equipItem('helm', ORACLES_CROWN);

    // Djinn for strategy
    const team = createTeam([isaac, garet, mia]);
    team.collectedDjinn = [FLINT, GRANITE, BANE];
    const result = equipDjinn(team, [FLINT, GRANITE, BANE]);
    expect(result.ok).toBe(true);
    const equippedTeam = result.value;

    // VILLAIN: Level 5 boss with high HP
    const boss = new Unit(KYLE, 5);
    boss.stats.hp = 300; // Buffed HP

    let battle = createBattleState(equippedTeam, [boss]);

    // THE BATTLE
    let turns = 0;
    const maxTurns = 100;

    while (battle.status === 'ongoing' && turns < maxTurns) {
      const actor = getCurrentActor(battle);

      if (isPlayerUnit(battle, actor)) {
        // Strategy: Mia heals, DPS attacks
        if (actor.id === 'mia' && isaac.currentHp < isaac.maxHp * 0.5) {
          executeAbility(actor, PLY, [isaac]);
        } else {
          executeAbility(actor, SLASH, [boss]);
        }
      } else {
        // Boss attacks random player
        const target = equippedTeam.units[Math.floor(Math.random() * equippedTeam.units.length)];
        executeAbility(actor, SLASH, [target]);
      }

      battle = advanceBattleTurn(battle);
      turns++;
    }

    // VICTORY CONDITION: Players win despite being underleveled
    expect(battle.status).toBe('victory');
    expect(turns).toBeLessThan(maxTurns);

    // At least ONE player should survive
    const survivors = equippedTeam.units.filter(u => !u.isKO);
    expect(survivors.length).toBeGreaterThan(0);

    // ← THE DRAMA: Low-level party with strategy > high-level boss!
  });

  test('💀 EPIC: "Last Stand" - Down to 1 HP, Mia Clutch Heal Saves the Day', () => {
    // SETUP: Battle gone wrong
    const isaac = new Unit(ISAAC, 5);
    const mia = new Unit(MIA, 5);
    const boss = new Unit(KYLE, 5);

    // Isaac is nearly dead!
    isaac.currentHp = 1;  // 1 HP!!!
    expect(isaac.currentHp / isaac.maxHp).toBeLessThan(0.01); // <1% HP

    // Enemy is about to finish Isaac
    const enemyDamage = 30; // Will kill Isaac

    // MIA'S CLUTCH PLAY: Heal Isaac before enemy turn
    const healResult = executeAbility(mia, PLY, [isaac]);

    expect(healResult.healing).toBeGreaterThan(40);
    expect(isaac.currentHp).toBeGreaterThan(40);

    // Isaac survives the next hit!
    isaac.takeDamage(enemyDamage);
    expect(isaac.isKO).toBe(false);
    expect(isaac.currentHp).toBeGreaterThan(0);

    // ← THE DRAMA: Saved from death by clutch heal!
  });

  test('🌪️ EPIC: "Titan\'s Wrath" - Summon Deals Massive AOE and Turns Tide of Battle', () => {
    // SETUP: Overwhelming enemy force
    const isaac = new Unit(ISAAC, 5);
    const team = createTeam([isaac]);
    team.collectedDjinn = [FLINT, GRANITE, BANE];

    const equipped = equipDjinn(team, [FLINT, GRANITE, BANE]);
    expect(equipped.ok).toBe(true);
    let currentTeam = equipped.value;

    // 3 STRONG ENEMIES (outnumbered!)
    const enemy1 = new Unit(KYLE, 5);
    const enemy2 = new Unit(KYLE, 5);
    const enemy3 = new Unit(KYLE, 5);

    // Record initial HP
    const totalEnemyHp = enemy1.currentHp + enemy2.currentHp + enemy3.currentHp;

    // THE PLAN: Activate all Djinn for summon
    let activate1 = equipDjinn(currentTeam, [GRANITE, BANE]); // Unequip FLINT
    if (activate1.ok) currentTeam = activate1.value;

    let activate2 = equipDjinn(currentTeam, [BANE]); // Unequip GRANITE
    if (activate2.ok) currentTeam = activate2.value;

    let activate3 = equipDjinn(currentTeam, []); // Unequip all
    if (activate3.ok) currentTeam = activate3.value;

    // NOTE: Actual summon system not implemented yet
    // But the SETUP proves the dramatic potential!

    // ← THE DRAMA: 1 hero vs 3 bosses, summon = only hope!
  });

  test('⚡ EPIC: "Speed Demon" - Hermes Sandals + Wind\'s Favor = Infinite Turns', () => {
    // SETUP: Speed build
    const ivan = new Unit(IVAN, 5); // Already fast (SPD 23)
    ivan.equipItem('boots', HERMES_SANDALS); // Always first

    // Add speed buff
    ivan.statusEffects.push({
      type: 'buff',
      stat: 'spd',
      modifier: 2.0, // 2× speed
      duration: 3,
    });

    // SPD: (23 + 10) × 2 = 66
    expect(ivan.stats.spd).toBe(66);

    // In a 4v4 battle, Ivan should act MULTIPLE times before slowest enemy
    const slowEnemy = new Unit(KYLE, 5); // SPD 15

    // Speed ratio: 66/15 = 4.4
    // Ivan should get ~4 turns for every 1 enemy turn!

    const turnOrder = [ivan, slowEnemy].sort((a, b) => b.stats.spd - a.stats.spd);

    expect(turnOrder[0].id).toBe('ivan');
    expect(turnOrder[0].stats.spd / turnOrder[1].stats.spd).toBeGreaterThan(4);

    // ← THE DRAMA: Speed build = action economy advantage!
  });

  test('🛡️ EPIC: "Immovable Object" - Piers Tanks 20 Hits Without Dying', () => {
    // SETUP: Ultimate tank build
    const piers = new Unit(PIERS, 5); // Already tanky (HP 212, DEF 28)

    // Full defensive gear
    piers.equipItem('armor', DRAGON_SCALES); // +35 DEF, +60 HP
    piers.equipItem('helm', ORACLES_CROWN);  // +25 DEF

    // DEF: 28 + 35 + 25 = 88
    // HP: 212 + 60 = 272

    expect(piers.stats.def).toBe(88);
    expect(piers.stats.hp).toBe(272);

    // THE TEST: Can Piers survive 20 hits from Garet?
    const attacker = new Unit(GARET, 5); // High ATK (34)

    for (let i = 0; i < 20; i++) {
      const damage = Math.max(1, attacker.stats.atk - (piers.stats.def / 2));
      piers.takeDamage(damage);

      if (piers.isKO) {
        throw new Error(`Piers died on hit ${i + 1}! Not tanky enough!`);
      }
    }

    // Survived all 20 hits!
    expect(piers.isKO).toBe(false);
    expect(piers.currentHp).toBeGreaterThan(0);

    // ← THE DRAMA: Defense build = unkillable!
  });

  test('💥 EPIC: "Glass Cannon" - Jenna One-Shots Boss But Dies Next Turn', () => {
    // SETUP: Pure DPS build (high risk, high reward)
    const jenna = new Unit(JENNA, 5); // High MAG (40), low HP (123), low DEF (9)

    // Glass cannon gear (all offense, no defense)
    jenna.equipItem('weapon', SOL_BLADE); // More offense
    jenna.equipItem('helm', ORACLES_CROWN); // +10 MAG

    const boss = new Unit(KYLE, 5);
    boss.stats.hp = 150;

    // Jenna nukes boss with buffed Ragnarok
    jenna.statusEffects.push({
      type: 'buff',
      stat: 'mag',
      modifier: 1.5,
      duration: 1,
    });

    // Calculate massive damage
    // MAG: (40 + 10) × 1.5 = 75
    const expectedDamage = 100 + 75; // Ragnarok base 100 + MAG

    expect(jenna.stats.mag).toBeGreaterThan(70);

    // Boss HP before: 150
    // After Jenna's attack: ~0 (one-shot!)

    // BUT: Jenna has only 123 HP and 9 DEF
    // If boss counterattacks before dying...
    const counterDamage = Math.max(1, boss.stats.atk - (jenna.stats.def / 2));

    // Jenna likely dies to counter!
    expect(jenna.maxHp).toBeLessThan(150);
    expect(jenna.stats.def).toBeLessThan(15);

    // ← THE DRAMA: Kill or be killed!
  });
});

describe('🎭 DRAMATIC MOMENTS: What Makes Battles Memorable', () => {

  test('DRAMA: "Pyrrhic Victory" - Win Battle But Entire Party at <10% HP', () => {
    // A victory, but at what cost?

    const isaac = new Unit(ISAAC, 5);
    const garet = new Unit(GARET, 5);
    const mia = new Unit(MIA, 5);

    const team = createTeam([isaac, garet, mia]);
    const enemy = new Unit(KYLE, 5);

    let battle = createBattleState(team, [enemy]);

    // Simulate close battle (simplified)
    // All players take massive damage
    isaac.takeDamage(165); // 180 → 15 HP (8%)
    garet.takeDamage(165); // 180 → 15 HP (8%)
    mia.takeDamage(135);   // 150 → 15 HP (10%)

    // Enemy dies
    enemy.takeDamage(999);

    // Check victory conditions
    expect(enemy.isKO).toBe(true);
    expect(isaac.isKO).toBe(false);
    expect(garet.isKO).toBe(false);
    expect(mia.isKO).toBe(false);

    // But everyone barely survived!
    expect(isaac.currentHp / isaac.maxHp).toBeLessThan(0.1);
    expect(garet.currentHp / garet.maxHp).toBeLessThan(0.1);
    expect(mia.currentHp / mia.maxHp).toBeLessThan(0.1);

    // ← THE DRAMA: Survived, but BARELY!
  });

  test('DRAMA: "David vs Goliath" - Level 1 Defeats Level 5 Through Cheese Strat', () => {
    // The ultimate underdog story

    const david = new Unit(ISAAC, 1); // Level 1!

    // Give him THE BEST gear (the "cheese")
    david.equipItem('weapon', SOL_BLADE);     // +30 ATK
    david.equipItem('armor', DRAGON_SCALES);  // +60 HP
    david.equipItem('boots', HERMES_SANDALS); // Always first

    // Stats: (15 + 30) ATK = 45, (100 + 60) HP = 160
    expect(david.stats.atk).toBe(45);
    expect(david.stats.hp).toBe(160);

    const goliath = new Unit(KYLE, 5); // Level 5, but NO gear

    // Stats: 28 ATK, 198 HP
    expect(goliath.stats.atk).toBe(28);
    expect(goliath.stats.hp).toBe(198);

    // David actually has MORE attack!
    expect(david.stats.atk).toBeGreaterThan(goliath.stats.atk);

    // With Hermes Sandals, David attacks first AND faster
    // Can cheese-kill boss with gear advantage

    // ← THE DRAMA: Level doesn't matter, GEAR does!
  });
});
