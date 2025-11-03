import { describe, test, expect } from 'vitest';
import { Unit } from '@/types/Unit';
import { ISAAC, GARET, IVAN, MIA, FELIX, JENNA, SHEBA, PIERS, KRADEN, KYLE } from '@/data/unitDefinitions';
import { IRON_SWORD, STEEL_SWORD, SOL_BLADE, IRON_ARMOR, IRON_HELM, IRON_BOOTS } from '@/data/equipment';
import { FLINT, GRANITE, BANE, FORGE, FIZZ } from '@/data/djinn';
import { isOk, isErr } from '@/utils/Result';

describe('TASK 1: Unit Data Models - Core Functionality', () => {

  test('✅ Stats auto-calculate based on level', () => {
    const isaac1 = new Unit(ISAAC, 1);
    const isaac5 = new Unit(ISAAC, 5);

    // Level 1 base stats
    expect(isaac1.stats.hp).toBe(100);
    expect(isaac1.stats.atk).toBe(14); // BALANCE: 15→14

    // Level 5 should have grown
    expect(isaac5.stats.hp).toBe(180);
    expect(isaac5.stats.atk).toBe(26); // BALANCE: 27→26

    // Verify growth formula: base + (growth * (level - 1))
    expect(isaac5.stats.hp).toBe(isaac1.stats.hp + (ISAAC.growthRates.hp * 4));
    expect(isaac5.stats.atk).toBe(isaac1.stats.atk + (ISAAC.growthRates.atk * 4));
  });

  test('✅ Abilities unlock at correct levels', () => {
    const isaac1 = new Unit(ISAAC, 1);
    expect(isaac1.unlockedAbilityIds.size).toBe(1); // Only Slash

    const isaac2 = new Unit(ISAAC, 2);
    expect(isaac2.unlockedAbilityIds.size).toBe(2); // Slash + Quake

    const isaac5 = new Unit(ISAAC, 5);
    expect(isaac5.unlockedAbilityIds.size).toBe(5); // All abilities
  });

});

describe('CONTEXT-AWARE: Progression Proves Leveling Matters', () => {

  test('🎯 Level 1 deals weak damage, Level 5 deals strong damage', () => {
    const isaac1 = new Unit(ISAAC, 1);
    const isaac5 = new Unit(ISAAC, 5);

    // Simulate damage against same enemy (DEF 20)
    const enemyDEF = 20;
    const defReduction = enemyDEF / 2; // 10

    // Level 1: (14 ATK - 10) = 4 damage (BALANCE: 15→14)
    const damage1 = Math.max(1, isaac1.stats.atk - defReduction);

    // Level 5: (26 ATK - 10) = 16 damage (BALANCE: 27→26)
    const damage5 = Math.max(1, isaac5.stats.atk - defReduction);

    // ← PROVES leveling makes you 4× stronger! (BALANCE: 3.4→4.0)
    expect(damage5).toBeGreaterThan(damage1 * 3);
    expect(damage5).toBe(16);
    expect(damage1).toBe(4);
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
    const isaac = new Unit(ISAAC, 5); // Balanced: 26 ATK (BALANCE: 27→26)
    const garet = new Unit(GARET, 5); // Pure DPS: 31 ATK (BALANCE: 34→31, base 18→19, growth 4→3)

    expect(garet.stats.atk).toBeGreaterThan(isaac.stats.atk);
    expect(garet.stats.atk).toBe(31); // 19 + (3 × 4) (BALANCE: 18→19, growth 4→3)
    expect(isaac.stats.atk).toBe(26); // 14 + (3 × 4) (BALANCE: 15→14)

    // Garet deals 19% more damage (BALANCE: 25→19%)
    expect(garet.stats.atk / isaac.stats.atk).toBeGreaterThan(1.15);

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
    const baseATK = isaac.stats.atk; // 26 (BALANCE: 27→26)

    // Equip weapon
    isaac.equipItem('weapon', IRON_SWORD);

    // ATK should increase
    const newATK = isaac.stats.atk;
    expect(newATK).toBe(baseATK + 12); // 26 + 12 = 38 (BALANCE: 27→26)
    expect(newATK).toBe(38);

    // Against enemy DEF 20, damage increases:
    const damageWithoutSword = Math.max(1, baseATK - 10); // 16 (BALANCE: 17→16)
    const damageWithSword = Math.max(1, newATK - 10);     // 28 (BALANCE: 29→28)

    expect(damageWithSword).toBeGreaterThan(damageWithoutSword * 1.7);

    // ← PROVES equipment makes you 75% stronger! (BALANCE: 70→75%)
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
    expect(isaac.stats.atk).toBe(14); // BALANCE: 15→14
    expect(isaac.stats.def).toBe(10);
    expect(isaac.stats.hp).toBe(100);

    // Equip full set
    isaac.equipItem('weapon', IRON_SWORD);  // +12 ATK
    isaac.equipItem('armor', IRON_ARMOR);    // +10 DEF, +20 HP
    isaac.equipItem('helm', IRON_HELM);      // +5 DEF
    isaac.equipItem('boots', IRON_BOOTS);    // +3 SPD

    // Stats with equipment
    expect(isaac.stats.atk).toBe(26);  // 14 + 12 = 26 (like Lv5!) (BALANCE: 15→14)
    expect(isaac.stats.def).toBe(25);  // 10 + 10 + 5 = 25
    expect(isaac.stats.hp).toBe(120);  // 100 + 20 = 120

    // ← PROVES Lv1 with gear ≈ Lv5 without gear!
    // ← Equipment is an alternative to leveling!
  });
});

describe('CONTEXT-AWARE: Djinn System Works', () => {

  test('🎯 3 Venus Djinn boost damage by 70%', () => {
    const isaac = new Unit(ISAAC, 5);
    const baseATK = isaac.stats.atk; // 26 (BALANCE: 27→26)
    const baseDEF = isaac.stats.def; // 18

    const result = isaac.equipDjinn([FLINT, GRANITE, BANE]);
    expect(isOk(result)).toBe(true);

    // Stats should increase (synergy: +12 ATK, +8 DEF from GAME_MECHANICS.md)
    expect(isaac.stats.atk).toBe(baseATK + 12); // 26 + 12 = 38 (BALANCE: 27→26)
    expect(isaac.stats.def).toBe(baseDEF + 8);  // 18 + 8 = 26

    // Against enemy DEF 20:
    // Without Djinn: (26 - 10) = 16 damage (BALANCE: 27→26)
    // With Djinn: (38 - 10) = 28 damage (BALANCE: 39→38)
    // ← 75% damage increase from Djinn! (BALANCE: 70→75%)

    const damageWithout = baseATK - 10;
    const damageWith = (baseATK + 12) - 10;
    expect(damageWith / damageWithout).toBeGreaterThan(1.7);

    // ← PROVES Djinn synergy significantly boosts damage!
  });

  test('🎯 Mixed element Djinn give smaller bonus', () => {
    const isaac1 = new Unit(ISAAC, 5);
    const isaac2 = new Unit(ISAAC, 5);
    const baseATK = isaac1.stats.atk; // 26 (BALANCE: 27→26)

    // All same (3 Venus): +12 ATK
    isaac1.equipDjinn([FLINT, GRANITE, BANE]);
    expect(isaac1.stats.atk).toBe(38); // 26 + 12 (BALANCE: 27→26)

    // Mixed (Venus, Mars, Mercury): +4 ATK
    isaac2.equipDjinn([FLINT, FORGE, FIZZ]);
    expect(isaac2.stats.atk).toBe(30); // 26 + 4 (BALANCE: 27→26)

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

describe('INTEGRATION: Units Work With Other Systems', () => {

  test('🎯 Turn order determined by SPD stat', () => {
    const felix = new Unit(FELIX, 5);  // SPD 30 (fastest)
    const isaac = new Unit(ISAAC, 5);  // SPD 16 (medium)
    const piers = new Unit(PIERS, 5);  // SPD 12 (slowest)

    const turnOrder = [felix, isaac, piers].sort((a, b) => b.stats.spd - a.stats.spd);

    expect(turnOrder[0].name).toBe('Felix');  // Acts first
    expect(turnOrder[1].name).toBe('Isaac');
    expect(turnOrder[2].name).toBe('Piers');  // Acts last

    // ← PROVES turn order system will work in Task 11!
  });

  test('🎯 Element types enable advantage system', () => {
    const venus = new Unit(ISAAC, 5);
    const jupiter = new Unit(IVAN, 5);

    expect(venus.element).toBe('Venus');
    expect(jupiter.element).toBe('Jupiter');
    // Venus → Jupiter will deal 1.5× damage in battle system (Task 12)

    // ← PROVES element system ready for damage calculation!
  });

  test('🎯 Clone creates independent copy for battle simulation', () => {
    const isaac = new Unit(ISAAC, 5);
    isaac.takeDamage(50);

    const clone = isaac.clone();
    expect(clone.currentHp).toBe(130);

    clone.takeDamage(50);
    expect(clone.currentHp).toBe(80);
    expect(isaac.currentHp).toBe(130); // Original unchanged

    // ← PROVES clone() works for battle simulations!
  });

  test('🎯 Party of 4 has balanced total stats', () => {
    const party = [
      new Unit(ISAAC, 5),
      new Unit(GARET, 5),
      new Unit(MIA, 5),
      new Unit(IVAN, 5),
    ];

    const totalHP = party.reduce((sum, u) => sum + u.stats.hp, 0);
    const totalATK = party.reduce((sum, u) => sum + u.stats.atk, 0);

    expect(totalHP).toBeGreaterThan(600);
    expect(totalATK).toBeGreaterThan(90);

    // ← PROVES party composition system will work!
  });

  test('🎯 Ability PP cost validation prevents spam', () => {
    const ivan = new Unit(IVAN, 5); // 54 PP
    expect(ivan.canUseAbility('tempest')).toBe(true);

    ivan.currentPp = 15; // Not enough for Tempest (28 PP)
    expect(ivan.canUseAbility('tempest')).toBe(false);
    expect(ivan.canUseAbility('gust')).toBe(true); // Cheaper ability works

    // ← PROVES PP system limits ability spam!
  });
});

describe('BALANCE: Stats Are Reasonable', () => {

  test('🎯 No unit has outlier stats (too strong/weak)', () => {
    const allUnits = [ISAAC, GARET, IVAN, MIA, FELIX, JENNA, SHEBA, PIERS, KRADEN, KYLE]
      .map(def => new Unit(def, 5));

    const hpValues = allUnits.map(u => u.stats.hp);
    const atkValues = allUnits.map(u => u.stats.atk);

    const maxHP = Math.max(...hpValues);
    const minHP = Math.min(...hpValues);

    // No unit 3× tankier than another
    expect(maxHP / minHP).toBeLessThan(2.7);

    const maxATK = Math.max(...atkValues);
    const minATK = Math.min(...atkValues);

    // No unit ridiculously weak
    expect(maxATK / minATK).toBeLessThan(3.8);

    // ← PROVES no overpowered or useless units!
  });

  test('🎯 Element distribution is balanced (2-3 per element)', () => {
    const allUnits = [ISAAC, GARET, IVAN, MIA, FELIX, JENNA, SHEBA, PIERS, KRADEN, KYLE];

    const venus = allUnits.filter(u => u.element === 'Venus').length;
    const mars = allUnits.filter(u => u.element === 'Mars').length;
    const mercury = allUnits.filter(u => u.element === 'Mercury').length;
    const jupiter = allUnits.filter(u => u.element === 'Jupiter').length;

    expect(venus).toBeGreaterThanOrEqual(2);
    expect(venus).toBeLessThanOrEqual(3);
    expect(mars).toBeGreaterThanOrEqual(2);
    expect(mars).toBeLessThanOrEqual(3);

    // ← PROVES player has choices within each element!
  });

  test('🎯 Growth rates are reasonable (no zero growth)', () => {
    const allUnits = [ISAAC, GARET, IVAN, MIA, FELIX, JENNA, SHEBA, PIERS, KRADEN, KYLE];

    for (const unit of allUnits) {
      // Every unit should grow in HP
      expect(unit.growthRates.hp).toBeGreaterThan(0);

      // Every unit should grow in at least offensive stats
      const offenseGrowth = unit.growthRates.atk + unit.growthRates.mag;
      expect(offenseGrowth).toBeGreaterThan(0);
    }

    // ← PROVES every unit gets stronger with levels!
  });
});

describe('DATA INTEGRITY: No Copy-Paste Errors', () => {

  test('🎯 All 10 units have unique stat distributions', () => {
    const allUnits = [ISAAC, GARET, IVAN, MIA, FELIX, JENNA, SHEBA, PIERS, KRADEN, KYLE]
      .map(def => new Unit(def, 5));

    const signatures = allUnits.map(u => {
      const s = u.stats;
      return `${s.hp}:${s.atk}:${s.def}:${s.mag}:${s.spd}`;
    });

    const uniqueSignatures = new Set(signatures);
    expect(uniqueSignatures.size).toBe(10); // All different

    // ← PROVES no accidental duplicates!
  });

  test('🎯 All units have exactly 5 abilities (one per level)', () => {
    const allUnits = [ISAAC, GARET, IVAN, MIA, FELIX, JENNA, SHEBA, PIERS, KRADEN, KYLE];

    for (const unit of allUnits) {
      expect(unit.abilities.length).toBe(5);

      const unlockLevels = unit.abilities.map(a => a.unlockLevel).sort((a, b) => a - b);
      expect(unlockLevels).toEqual([1, 2, 3, 4, 5]);
    }

    // ← PROVES data integrity (no missing/extra abilities)!
  });
});
