import { describe, test, expect } from 'vitest';
import { Unit } from '@/types/Unit';
import { ISAAC, GARET, MIA } from '@/data/unitDefinitions';
import { IRON_SWORD, STEEL_SWORD, SOL_BLADE, IRON_ARMOR, STEEL_ARMOR, IRON_HELM, STEEL_HELM, IRON_BOOTS, HERMES_SANDALS } from '@/data/equipment';
import { FLINT, GRANITE, BANE, FORGE, FIZZ } from '@/data/djinn';
import type { StatusEffect } from '@/types/Unit';

describe('TASK 2: Stat Calculation System - Core Formula', () => {

  test('✅ Base stats from definition', () => {
    const isaac = new Unit(ISAAC, 1);

    // No modifiers, just base stats
    expect(isaac.stats.hp).toBe(100);
    expect(isaac.stats.pp).toBe(20);
    expect(isaac.stats.atk).toBe(15);
    expect(isaac.stats.def).toBe(10);
    expect(isaac.stats.mag).toBe(12);
    expect(isaac.stats.spd).toBe(12);
  });

  test('✅ Level bonuses: base + (growthRate × (level - 1))', () => {
    const isaac1 = new Unit(ISAAC, 1);
    const isaac5 = new Unit(ISAAC, 5);

    // Verify growth formula
    // Isaac growth: HP +20, PP +4, ATK +3, DEF +2, MAG +2, SPD +1 per level
    expect(isaac5.stats.hp).toBe(100 + (20 * 4)); // 180
    expect(isaac5.stats.pp).toBe(20 + (4 * 4));   // 36
    expect(isaac5.stats.atk).toBe(15 + (3 * 4));  // 27
    expect(isaac5.stats.def).toBe(10 + (2 * 4));  // 18
    expect(isaac5.stats.mag).toBe(12 + (2 * 4));  // 20
    expect(isaac5.stats.spd).toBe(12 + (1 * 4));  // 16
  });

  test('✅ Equipment bonuses add to stats', () => {
    const isaac = new Unit(ISAAC, 5); // Base ATK 27

    isaac.equipItem('weapon', IRON_SWORD); // +12 ATK
    expect(isaac.stats.atk).toBe(39); // 27 + 12

    isaac.equipItem('weapon', STEEL_SWORD); // +20 ATK
    expect(isaac.stats.atk).toBe(47); // 27 + 20
  });

  test('✅ Multiple equipment slots stack bonuses', () => {
    const isaac = new Unit(ISAAC, 5);
    // Base: HP 180, ATK 27, DEF 18, SPD 16

    isaac.equipItem('weapon', IRON_SWORD);  // +12 ATK
    isaac.equipItem('armor', IRON_ARMOR);    // +10 DEF, +20 HP
    isaac.equipItem('helm', IRON_HELM);      // +5 DEF
    isaac.equipItem('boots', IRON_BOOTS);    // +3 SPD

    expect(isaac.stats.hp).toBe(200);  // 180 + 20
    expect(isaac.stats.atk).toBe(39);  // 27 + 12
    expect(isaac.stats.def).toBe(33);  // 18 + 10 + 5
    expect(isaac.stats.spd).toBe(19);  // 16 + 3
  });

  test('✅ Djinn synergy adds stat bonuses', () => {
    const isaac = new Unit(ISAAC, 5); // Base ATK 27, DEF 18

    // 3 Venus Djinn: +12 ATK, +8 DEF (from GAME_MECHANICS.md Section 3.2)
    isaac.equipDjinn([FLINT, GRANITE, BANE]);

    expect(isaac.stats.atk).toBe(39); // 27 + 12
    expect(isaac.stats.def).toBe(26); // 18 + 8
  });

  test('✅ Only Set Djinn count for synergy (not Standby)', () => {
    const isaac = new Unit(ISAAC, 5); // Base ATK 27

    isaac.equipDjinn([FLINT, GRANITE, BANE]);
    expect(isaac.stats.atk).toBe(39); // 27 + 12 (all 3 Set, all Venus)

    // Activate one Djinn (moves to Standby)
    isaac.activateDjinn('flint');
    // Still 2 Venus Djinn Set → synergy based on composition, not count
    // 2 Venus (all same element) = +12 ATK still
    expect(isaac.stats.atk).toBe(39); // 27 + 12 (2 Set Venus)
  });
});

describe('TASK 2: Status Effect Multipliers', () => {

  test('✅ Buff multiplies final stats', () => {
    const isaac = new Unit(ISAAC, 5); // Base ATK 27

    // Apply Blessing buff: ATK ×1.25, DEF ×1.25
    isaac.statusEffects.push({
      type: 'buff',
      stat: 'atk',
      modifier: 1.25,
      duration: 3,
    });

    // 27 × 1.25 = 33.75 → floor = 33
    expect(isaac.stats.atk).toBe(33);
  });

  test('✅ Debuff reduces stats', () => {
    const isaac = new Unit(ISAAC, 5); // Base ATK 27

    // Apply debuff: ATK ×0.75
    isaac.statusEffects.push({
      type: 'debuff',
      stat: 'atk',
      modifier: 0.75,
      duration: 2,
    });

    // 27 × 0.75 = 20.25 → floor = 20
    expect(isaac.stats.atk).toBe(20);
  });

  test('✅ Multiple buffs stack multiplicatively', () => {
    const isaac = new Unit(ISAAC, 5); // Base ATK 27

    // Two buffs: ×1.25 and ×1.2
    isaac.statusEffects.push(
      { type: 'buff', stat: 'atk', modifier: 1.25, duration: 3 },
      { type: 'buff', stat: 'atk', modifier: 1.2, duration: 2 }
    );

    // 27 × 1.25 × 1.2 = 40.5 → floor = 40
    expect(isaac.stats.atk).toBe(40);
  });

  test('✅ Status effects do NOT affect HP/PP', () => {
    const isaac = new Unit(ISAAC, 5); // HP 180, PP 36

    // Buffs should not affect HP/PP
    isaac.statusEffects.push({
      type: 'buff',
      stat: 'atk',
      modifier: 2.0,
      duration: 3,
    });

    expect(isaac.stats.hp).toBe(180); // Unchanged
    expect(isaac.stats.pp).toBe(36);  // Unchanged
  });
});

describe('TASK 2: Complete Stat Calculation Formula', () => {

  test('🎯 Formula: floor((base + level + equipment + djinn) × effects)', () => {
    const isaac = new Unit(ISAAC, 5);
    // Base: ATK 15
    // Level 5: +12 (3 × 4)
    // Total before modifiers: 27

    // Equipment: Sol Blade +30 ATK
    isaac.equipItem('weapon', SOL_BLADE);
    expect(isaac.stats.atk).toBe(57); // 27 + 30

    // Djinn: 3 Venus +12 ATK
    isaac.equipDjinn([FLINT, GRANITE, BANE]);
    expect(isaac.stats.atk).toBe(69); // 27 + 30 + 12

    // Buff: Blessing ×1.25
    isaac.statusEffects.push({
      type: 'buff',
      stat: 'atk',
      modifier: 1.25,
      duration: 3,
    });

    // (27 + 30 + 12) × 1.25 = 86.25 → floor = 86
    expect(isaac.stats.atk).toBe(86);

    // ← PROVES complete stat formula works!
  });

  test('🎯 Defensive stats follow same formula', () => {
    const garet = new Unit(GARET, 5);
    // Base DEF: 8, Growth: +1, Level 5: 8 + (1 × 4) = 12

    // Equipment: Steel Armor +18 DEF
    garet.equipItem('armor', STEEL_ARMOR);
    expect(garet.stats.def).toBe(30); // 12 + 18

    // Buff: Guardian's Stance ×1.5
    garet.statusEffects.push({
      type: 'buff',
      stat: 'def',
      modifier: 1.5,
      duration: 2,
    });

    // (12 + 18) × 1.5 = 45
    expect(garet.stats.def).toBe(45);

    // ← PROVES formula works for DEF!
  });

  test('🎯 Speed calculation with equipment and buffs', () => {
    const isaac = new Unit(ISAAC, 5);
    // Base SPD: 12, Level 5: +4 (1 × 4) = 16

    // Equipment: Hermes' Sandals +10 SPD
    isaac.equipItem('boots', HERMES_SANDALS);
    expect(isaac.stats.spd).toBe(26); // 16 + 10

    // Buff: Wind's Favor ×1.4
    isaac.statusEffects.push({
      type: 'buff',
      stat: 'spd',
      modifier: 1.4,
      duration: 3,
    });

    // (16 + 10) × 1.4 = 36.4 → floor = 36
    expect(isaac.stats.spd).toBe(36);

    // ← PROVES formula works for SPD!
  });
});

describe('CONTEXT-AWARE: Stat Modifiers Create Strategy', () => {

  test('🎯 Buffs make weak units competitive', () => {
    const mia = new Unit(MIA, 5);  // Low ATK: 12 + (2 × 4) = 20
    const garet = new Unit(GARET, 5); // High ATK: 18 + (4 × 4) = 34

    // Mia unbuffed is weaker (59% of Garet's ATK)
    expect(mia.stats.atk).toBe(20);
    expect(garet.stats.atk).toBe(34);
    expect(mia.stats.atk / garet.stats.atk).toBeLessThan(0.6);

    // Apply double buff to Mia
    mia.statusEffects.push(
      { type: 'buff', stat: 'atk', modifier: 1.5, duration: 3 },
      { type: 'buff', stat: 'atk', modifier: 1.3, duration: 2 }
    );

    // 20 × 1.5 × 1.3 = 39
    expect(mia.stats.atk).toBe(39);

    // Now stronger than unbuffed Garet!
    expect(mia.stats.atk).toBeGreaterThan(garet.stats.atk);

    // ← PROVES buffs enable support units to become DPS!
  });

  test('🎯 Equipment progression path: Iron → Steel → Legendary', () => {
    const isaac = new Unit(ISAAC, 5); // ATK 27

    // Early game: Iron Sword
    isaac.equipItem('weapon', IRON_SWORD);
    const earlyATK = isaac.stats.atk; // 27 + 12 = 39

    // Mid game: Steel Sword
    isaac.equipItem('weapon', STEEL_SWORD);
    const midATK = isaac.stats.atk; // 27 + 20 = 47

    // Late game: Sol Blade
    isaac.equipItem('weapon', SOL_BLADE);
    const lateATK = isaac.stats.atk; // 27 + 30 = 57

    expect(midATK).toBeGreaterThan(earlyATK);
    expect(lateATK).toBeGreaterThan(midATK);
    expect(lateATK / earlyATK).toBeGreaterThan(1.4);

    // ← PROVES equipment creates progression!
  });

  test('🎯 Djinn specialization vs hybrid trade-off', () => {
    const isaac1 = new Unit(ISAAC, 5); // ATK 27
    const isaac2 = new Unit(ISAAC, 5); // ATK 27

    // Specialized: All Venus (3× same element)
    isaac1.equipDjinn([FLINT, GRANITE, BANE]);
    const specializedATK = isaac1.stats.atk; // 27 + 12 = 39

    // Hybrid: Mixed elements
    isaac2.equipDjinn([FLINT, FORGE, FIZZ]);
    const hybridATK = isaac2.stats.atk; // 27 + 4 = 31

    // Specialized gives 3× more ATK bonus
    expect((specializedATK - 27) / (hybridATK - 27)).toBe(3);

    // ← PROVES specialization rewards!
  });

  test('🎯 Debuffs counter strong enemies', () => {
    const garet = new Unit(GARET, 5); // ATK 34 (highest DPS)

    // Enemy applies debuff
    garet.statusEffects.push({
      type: 'debuff',
      stat: 'atk',
      modifier: 0.5, // Halved!
      duration: 3,
    });

    // 34 × 0.5 = 17
    expect(garet.stats.atk).toBe(17);

    // Now weaker than Isaac (27 ATK)!
    const isaac = new Unit(ISAAC, 5);
    expect(garet.stats.atk).toBeLessThan(isaac.stats.atk);

    // ← PROVES debuffs are powerful tactical tools!
  });

  test('🎯 Max HP affected by equipment but not buffs', () => {
    const isaac = new Unit(ISAAC, 5); // HP 180

    // Equipment increases max HP
    isaac.equipItem('armor', STEEL_ARMOR); // +40 HP
    expect(isaac.maxHp).toBe(220);
    expect(isaac.currentHp).toBe(180); // Current HP unchanged

    // ATK buffs don't affect max HP
    isaac.statusEffects.push({
      type: 'buff',
      stat: 'atk',
      modifier: 2.0,
      duration: 3,
    });
    expect(isaac.maxHp).toBe(220); // Still 220

    // ← PROVES HP/PP calculation is separate!
  });
});

describe('EDGE CASES: Stat Calculation', () => {

  test('Floor function rounds down correctly', () => {
    const isaac = new Unit(ISAAC, 5); // ATK 27

    // Apply buff that creates fractional result
    isaac.statusEffects.push({
      type: 'buff',
      stat: 'atk',
      modifier: 1.1,
      duration: 3,
    });

    // 27 × 1.1 = 29.7 → floor = 29
    expect(isaac.stats.atk).toBe(29);
    expect(isaac.stats.atk).not.toBe(30); // Not rounded up!
  });

  test('Unequipping removes bonuses immediately', () => {
    const isaac = new Unit(ISAAC, 5); // ATK 27

    isaac.equipItem('weapon', SOL_BLADE);
    expect(isaac.stats.atk).toBe(57); // 27 + 30

    isaac.unequipItem('weapon');
    expect(isaac.stats.atk).toBe(27); // Back to base

    // ← PROVES stats recalculate on unequip!
  });

  test('Stats recalculate every time accessed', () => {
    const isaac = new Unit(ISAAC, 5);

    const atk1 = isaac.stats.atk; // 27
    isaac.equipItem('weapon', IRON_SWORD);
    const atk2 = isaac.stats.atk; // 39
    isaac.equipDjinn([FLINT, GRANITE, BANE]);
    const atk3 = isaac.stats.atk; // 51

    expect(atk1).toBe(27);
    expect(atk2).toBe(39);
    expect(atk3).toBe(51);

    // ← PROVES calculateStats() is called each time!
  });

  test('Empty equipment slots contribute 0', () => {
    const isaac = new Unit(ISAAC, 5); // ATK 27

    // All slots empty
    expect(isaac.equipment.weapon).toBeNull();
    expect(isaac.equipment.armor).toBeNull();
    expect(isaac.stats.atk).toBe(27); // No crash, just base

    // ← PROVES null safety!
  });
});

describe('DATA INTEGRITY: Stat Formulas', () => {

  test('All units follow same stat formula', () => {
    const units = [
      new Unit(ISAAC, 5),
      new Unit(GARET, 5),
      new Unit(MIA, 5),
    ];

    for (const unit of units) {
      // Equip same gear
      unit.equipItem('weapon', IRON_SWORD); // +12 ATK

      // Bonus should always be exactly +12
      const baseATK = unit.baseStats.atk + (unit.growthRates.atk * 4);
      expect(unit.stats.atk).toBe(baseATK + 12);
    }

    // ← PROVES formula consistent across units!
  });

  test('Stats never become negative', () => {
    const isaac = new Unit(ISAAC, 5); // ATK 27

    // Apply extreme debuff
    isaac.statusEffects.push({
      type: 'debuff',
      stat: 'atk',
      modifier: 0.01, // 99% reduction
      duration: 3,
    });

    // 27 × 0.01 = 0.27 → floor = 0
    expect(isaac.stats.atk).toBe(0);
    expect(isaac.stats.atk).toBeGreaterThanOrEqual(0);

    // ← PROVES no negative stats!
  });
});
