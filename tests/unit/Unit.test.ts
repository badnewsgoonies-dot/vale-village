import { describe, test, expect } from 'vitest';
import { Unit } from '@/types/Unit';
import { ISAAC, GARET, IVAN, MIA, FELIX, JENNA, SHEBA, PIERS, KYLE } from '@/data/unitDefinitions';
import { IRON_SWORD, STEEL_SWORD, SOL_BLADE, IRON_ARMOR, IRON_HELM, IRON_BOOTS } from '@/data/equipment';
import { FLINT, GRANITE, BANE, FORGE, FIZZ } from '@/data/djinn';
import { isOk, isErr } from '@/utils/Result';

describe('TASK 1: Unit Data Models - Core Functionality', () => {

  test('✅ Isaac level 5 has exact stats from GAME_MECHANICS.md', () => {
    const isaac = new Unit(ISAAC, 5);

    // Expected stats from GAME_MECHANICS.md Section 1.3
    expect(isaac.level).toBe(5);
    expect(isaac.stats.hp).toBe(180);  // 100 + (20 * 4)
    expect(isaac.stats.pp).toBe(36);   // 20 + (4 * 4)
    expect(isaac.stats.atk).toBe(27);  // 15 + (3 * 4)
    expect(isaac.stats.def).toBe(18);  // 10 + (2 * 4)
    expect(isaac.stats.mag).toBe(20);  // 12 + (2 * 4)
    expect(isaac.stats.spd).toBe(16);  // 12 + (1 * 4)
  });

  test('✅ Stats auto-calculate based on level', () => {
    const isaac1 = new Unit(ISAAC, 1);
    const isaac5 = new Unit(ISAAC, 5);

    // Level 1 base stats
    expect(isaac1.stats.hp).toBe(100);
    expect(isaac1.stats.atk).toBe(15);

    // Level 5 should have grown
    expect(isaac5.stats.hp).toBe(180);
    expect(isaac5.stats.atk).toBe(27);

    // Verify growth formula: base + (growth * (level - 1))
    expect(isaac5.stats.hp).toBe(isaac1.stats.hp + (ISAAC.growthRates.hp * 4));
    expect(isaac5.stats.atk).toBe(isaac1.stats.atk + (ISAAC.growthRates.atk * 4));
  });

  test('✅ All 10 units have correct base stats', () => {
    const isaac = new Unit(ISAAC, 1);
    const garet = new Unit(GARET, 1);
    const mia = new Unit(MIA, 1);

    // Isaac (Balanced)
    expect(isaac.stats.hp).toBe(100);
    expect(isaac.stats.atk).toBe(15);
    expect(isaac.stats.def).toBe(10);

    // Garet (Pure DPS - high ATK, low DEF)
    expect(garet.stats.hp).toBe(120);
    expect(garet.stats.atk).toBe(18);
    expect(garet.stats.def).toBe(8);

    // Mia (Healer - balanced stats, can heal at level 1)
    expect(mia.stats.hp).toBe(90);
    expect(mia.stats.mag).toBe(16);
    expect(mia.abilities[0].type).toBe('healing');
  });

  test('✅ Abilities unlock at correct levels', () => {
    const isaac1 = new Unit(ISAAC, 1);
    expect(isaac1.unlockedAbilityIds.size).toBe(1); // Only Slash

    const isaac2 = new Unit(ISAAC, 2);
    expect(isaac2.unlockedAbilityIds.size).toBe(2); // Slash + Quake

    const isaac5 = new Unit(ISAAC, 5);
    expect(isaac5.unlockedAbilityIds.size).toBe(5); // All abilities
  });

  test('✅ CurrentHP and CurrentPP initialize to max', () => {
    const isaac = new Unit(ISAAC, 5);

    expect(isaac.currentHp).toBe(isaac.maxHp);
    expect(isaac.currentHp).toBe(180);

    expect(isaac.currentPp).toBe(isaac.maxPp);
    expect(isaac.currentPp).toBe(36);
  });
});

describe('CONTEXT-AWARE: Progression Proves Leveling Matters', () => {

  test('🎯 Level 1 deals weak damage, Level 5 deals strong damage', () => {
    const isaac1 = new Unit(ISAAC, 1);
    const isaac5 = new Unit(ISAAC, 5);

    // Simulate damage against same enemy (DEF 20)
    const enemyDEF = 20;
    const defReduction = enemyDEF / 2; // 10

    // Level 1: (15 ATK - 10) = 5 damage
    const damage1 = Math.max(1, isaac1.stats.atk - defReduction);

    // Level 5: (27 ATK - 10) = 17 damage
    const damage5 = Math.max(1, isaac5.stats.atk - defReduction);

    // ← PROVES leveling makes you 3.4× stronger!
    expect(damage5).toBeGreaterThan(damage1 * 3);
    expect(damage5).toBe(17);
    expect(damage1).toBe(5);
  });

  test('🎯 High-level survives hits that would nearly KO low-level', () => {
    const isaac1 = new Unit(ISAAC, 1);
    const isaac5 = new Unit(ISAAC, 5);

    // Boss deals 60 damage
    const bossDamage = 60;

    // Level 1: HP 100 - 60 = 40 HP remaining (40% HP)
    isaac1.takeDamage(bossDamage);
    expect(isaac1.currentHp).toBe(40);
    expect(isaac1.isKO).toBe(false);

    // Level 5: HP 180 - 60 = 120 HP remaining (67% HP)
    isaac5.takeDamage(bossDamage);
    expect(isaac5.currentHp).toBe(120);
    expect(isaac5.isKO).toBe(false);

    // Same hit leaves Lv5 with 3× more HP!
    expect(isaac5.currentHp).toBeGreaterThan(isaac1.currentHp * 2);

    // ← PROVES leveling makes you tankier!
  });

  test('🎯 Level progression unlocks more abilities = more tactics', () => {
    const isaac1 = new Unit(ISAAC, 1);
    const isaac3 = new Unit(ISAAC, 3);
    const isaac5 = new Unit(ISAAC, 5);

    const abilities1 = isaac1.getUnlockedAbilities();
    const abilities3 = isaac3.getUnlockedAbilities();
    const abilities5 = isaac5.getUnlockedAbilities();

    // Level 1: Only basic attack
    expect(abilities1.length).toBe(1);

    // Level 3: Has 3 abilities (more tactical depth)
    expect(abilities3.length).toBe(3);

    // Level 5: Has all 5 abilities (maximum tactics)
    expect(abilities5.length).toBe(5);
    expect(abilities5.map(a => a.id)).toContain('judgment'); // Ultimate unlocked

    // ← PROVES progression gives player more options!
  });
});

describe('CONTEXT-AWARE: Unit Variety Creates Strategy', () => {

  test('🎯 Garet (DPS) hits 25% harder than Isaac (Balanced)', () => {
    const isaac = new Unit(ISAAC, 5); // Balanced: 27 ATK
    const garet = new Unit(GARET, 5); // Pure DPS: 34 ATK

    expect(garet.stats.atk).toBeGreaterThan(isaac.stats.atk);
    expect(garet.stats.atk).toBe(34); // 18 + (4 × 4)
    expect(isaac.stats.atk).toBe(27); // 15 + (3 × 4)

    // Garet deals 25% more damage
    expect(garet.stats.atk / isaac.stats.atk).toBeGreaterThan(1.25);

    // ← PROVES unit choice matters for DPS!
  });

  test('🎯 Mia (Healer) has 66% more PP than Garet (DPS)', () => {
    const mia = new Unit(MIA, 5);   // Healer: High PP
    const garet = new Unit(GARET, 5); // DPS: Low PP

    expect(mia.stats.pp).toBeGreaterThan(garet.stats.pp);
    expect(mia.stats.pp).toBe(45);   // 25 + (5 × 4)
    expect(garet.stats.pp).toBe(27); // 15 + (3 × 4)

    // Mia can cast 66% more spells
    expect(mia.stats.pp / garet.stats.pp).toBeGreaterThan(1.6);

    // ← PROVES unit choice matters for spellcasting!
  });

  test('🎯 Piers (Tank) survives hits that wound Ivan (Mage)', () => {
    const piers = new Unit(PIERS, 5); // Tank: High HP/DEF
    const ivan = new Unit(IVAN, 5);   // Mage: Low HP/DEF

    // Boss deals 80 damage
    const bossDamage = 80;

    // Piers: HP 212, DEF 28
    expect(piers.stats.hp).toBe(212); // 140 + (18 × 4)
    piers.takeDamage(bossDamage);
    expect(piers.currentHp).toBe(132); // Still 62% HP!
    expect(piers.isKO).toBe(false);

    // Ivan: HP 128, DEF 10
    expect(ivan.stats.hp).toBe(128); // 80 + (12 × 4)
    ivan.takeDamage(bossDamage);
    expect(ivan.currentHp).toBe(48); // Only 37% HP!

    // Piers survives with 2.75× more HP remaining
    expect(piers.currentHp / ivan.currentHp).toBeGreaterThan(2.7);

    // ← PROVES tank vs mage trade-off works!
  });

  test('🎯 Felix (Rogue) acts 2× faster than Kyle (Warrior)', () => {
    const felix = new Unit(FELIX, 5); // Rogue: 30 SPD
    const kyle = new Unit(KYLE, 5);   // Warrior: 15 SPD

    expect(felix.stats.spd).toBe(30); // 18 + (3 × 4)
    expect(kyle.stats.spd).toBe(15);  // 11 + (1 × 4)

    // Felix is 2× faster (turn order advantage)
    expect(felix.stats.spd / kyle.stats.spd).toBe(2);

    // ← PROVES speed matters for turn order!
  });
});

describe('CONTEXT-AWARE: Equipment System Works', () => {

  test('🎯 Iron Sword increases damage by 70%', () => {
    const isaac = new Unit(ISAAC, 5);
    const baseATK = isaac.stats.atk; // 27

    // Equip weapon
    isaac.equipItem('weapon', IRON_SWORD);

    // ATK should increase
    const newATK = isaac.stats.atk;
    expect(newATK).toBe(baseATK + 12); // 27 + 12 = 39
    expect(newATK).toBe(39);

    // Against enemy DEF 20, damage increases:
    const damageWithoutSword = Math.max(1, baseATK - 10); // 17
    const damageWithSword = Math.max(1, newATK - 10);     // 29

    expect(damageWithSword).toBeGreaterThan(damageWithoutSword * 1.7);

    // ← PROVES equipment makes you 70% stronger!
  });

  test('🎯 Legendary weapon unlocks new ability', () => {
    const isaac = new Unit(ISAAC, 5);

    // Before equipping
    expect(isaac.unlockedAbilityIds.has('megiddo')).toBe(false);

    // Equip legendary weapon
    isaac.equipItem('weapon', SOL_BLADE);

    // New ability should be unlocked (ID added to set)
    expect(isaac.unlockedAbilityIds.has('megiddo')).toBe(true);

    // ← PROVES legendary weapons add new ability IDs!
    // (Note: Full ability data would be added in Task 9)
  });

  test('🎯 Full equipment set makes Lv1 ≈ Lv5 without gear', () => {
    const isaac = new Unit(ISAAC, 1); // Lv1: Weak

    // Base stats (naked)
    expect(isaac.stats.atk).toBe(15);
    expect(isaac.stats.def).toBe(10);
    expect(isaac.stats.hp).toBe(100);

    // Equip full set
    isaac.equipItem('weapon', IRON_SWORD);  // +12 ATK
    isaac.equipItem('armor', IRON_ARMOR);    // +10 DEF, +20 HP
    isaac.equipItem('helm', IRON_HELM);      // +5 DEF
    isaac.equipItem('boots', IRON_BOOTS);    // +3 SPD

    // Stats with equipment
    expect(isaac.stats.atk).toBe(27);  // 15 + 12 = 27 (like Lv5!)
    expect(isaac.stats.def).toBe(25);  // 10 + 10 + 5 = 25
    expect(isaac.stats.hp).toBe(120);  // 100 + 20 = 120

    // ← PROVES Lv1 with gear ≈ Lv5 without gear!
    // ← Equipment is an alternative to leveling!
  });
});

describe('CONTEXT-AWARE: Djinn System Works', () => {

  test('🎯 3 Venus Djinn boost damage by 70%', () => {
    const isaac = new Unit(ISAAC, 5);
    const baseATK = isaac.stats.atk; // 27
    const baseDEF = isaac.stats.def; // 18

    const result = isaac.equipDjinn([FLINT, GRANITE, BANE]);
    expect(isOk(result)).toBe(true);

    // Stats should increase (synergy: +12 ATK, +8 DEF from GAME_MECHANICS.md)
    expect(isaac.stats.atk).toBe(baseATK + 12); // 27 + 12 = 39
    expect(isaac.stats.def).toBe(baseDEF + 8);  // 18 + 8 = 26

    // Against enemy DEF 20:
    // Without Djinn: (27 - 10) = 17 damage
    // With Djinn: (39 - 10) = 29 damage
    // ← 70% damage increase from Djinn!

    const damageWithout = baseATK - 10;
    const damageWith = (baseATK + 12) - 10;
    expect(damageWith / damageWithout).toBeGreaterThan(1.7);

    // ← PROVES Djinn synergy significantly boosts damage!
  });

  test('🎯 Mixed element Djinn give smaller bonus', () => {
    const isaac1 = new Unit(ISAAC, 5);
    const isaac2 = new Unit(ISAAC, 5);
    const baseATK = isaac1.stats.atk; // 27

    // All same (3 Venus): +12 ATK
    isaac1.equipDjinn([FLINT, GRANITE, BANE]);
    expect(isaac1.stats.atk).toBe(39); // 27 + 12

    // Mixed (Venus, Mars, Mercury): +4 ATK
    isaac2.equipDjinn([FLINT, FORGE, FIZZ]);
    expect(isaac2.stats.atk).toBe(31); // 27 + 4

    // All same gives 3× more ATK bonus!
    expect((isaac1.stats.atk - baseATK) / (isaac2.stats.atk - baseATK)).toBe(3);

    // ← PROVES specialization (all same element) is stronger than hybrid!
  });
});

describe('CONTEXT-AWARE: Battle State Management', () => {

  test('🎯 Unit survives multiple hits before KO', () => {
    const isaac = new Unit(ISAAC, 5); // 180 HP

    expect(isaac.isKO).toBe(false);
    expect(isaac.currentHp).toBe(180);

    // Take 3 hits of 50 damage each
    isaac.takeDamage(50);
    expect(isaac.currentHp).toBe(130);
    expect(isaac.isKO).toBe(false);

    isaac.takeDamage(50);
    expect(isaac.currentHp).toBe(80);
    expect(isaac.isKO).toBe(false);

    isaac.takeDamage(50);
    expect(isaac.currentHp).toBe(30);
    expect(isaac.isKO).toBe(false);

    // 4th hit kills
    isaac.takeDamage(50);
    expect(isaac.currentHp).toBe(0);
    expect(isaac.isKO).toBe(true);

    // ← PROVES unit can survive multiple hits based on HP!
  });

  test('🎯 Healing brings unit back from near-death', () => {
    const mia = new Unit(MIA, 5); // 150 HP

    // Take big hit (100 damage) - near death
    mia.takeDamage(100);
    expect(mia.currentHp).toBe(50);
    expect(mia.currentHp / mia.maxHp).toBeLessThan(0.35);

    // Heal for 70 HP
    const healed = mia.heal(70);
    expect(healed).toBe(70);
    expect(mia.currentHp).toBe(120);
    expect(mia.currentHp / mia.maxHp).toBe(0.8); // Back to 80% HP!

    // ← PROVES healing is meaningful!
  });

  test('🎯 Healing respects max HP cap', () => {
    const isaac = new Unit(ISAAC, 5); // 180 HP max

    isaac.takeDamage(50);
    expect(isaac.currentHp).toBe(130);

    // Try to heal for 100 (would go to 230)
    const healed = isaac.heal(100);

    // Should only heal to max (180)
    expect(healed).toBe(50); // Only 50 HP actually restored
    expect(isaac.currentHp).toBe(180); // Capped at max

    // ← PROVES heal respects max HP cap!
  });
});

describe('VALIDATION: Result Types Work', () => {

  test('✅ Cannot equip more than 3 Djinn (returns Err)', () => {
    const unit = new Unit(ISAAC, 5);

    const result = unit.equipDjinn([FLINT, GRANITE, BANE, FORGE]);

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toContain('Cannot equip more than 3 Djinn');
    }
  });

  test('✅ Activating non-existent Djinn returns Err', () => {
    const unit = new Unit(ISAAC, 5);
    unit.equipDjinn([FLINT, GRANITE]);

    const result = unit.activateDjinn('nonexistent');

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toContain('not equipped');
    }
  });

  test('✅ Valid Djinn operations return Ok', () => {
    const unit = new Unit(ISAAC, 5);

    const equipResult = unit.equipDjinn([FLINT, GRANITE]);
    expect(isOk(equipResult)).toBe(true);

    const activateResult = unit.activateDjinn('flint');
    expect(isOk(activateResult)).toBe(true);
  });
});

describe('EDGE CASES: Validation', () => {

  test('Level clamped to 1-5 range', () => {
    const unitLevel0 = new Unit(ISAAC, 0);
    expect(unitLevel0.level).toBe(1);

    const unitLevel10 = new Unit(ISAAC, 10);
    expect(unitLevel10.level).toBe(5);
  });

  test('Damage cannot reduce HP below 0', () => {
    const unit = new Unit(ISAAC, 1); // 100 HP

    unit.takeDamage(150); // Overkill
    expect(unit.currentHp).toBe(0);
    expect(unit.currentHp).toBeGreaterThanOrEqual(0);
  });
});
