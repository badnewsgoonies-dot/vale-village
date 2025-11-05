import { describe, test, expect } from 'vitest';
import { Unit } from '@/types/Unit';
import { ISAAC, GARET, MIA } from '@/data/unitDefinitions';
import { IRON_SWORD, STEEL_SWORD, SOL_BLADE, IRON_ARMOR, STEEL_ARMOR, IRON_HELM, STEEL_HELM, IRON_BOOTS, HERMES_SANDALS } from '@/data/equipment';
import { FLINT, GRANITE, BANE, FORGE, FIZZ } from '@/data/djinn';
import type { StatusEffect } from '@/types/Unit';

describe('TASK 2: Stat Calculation System - Core Formula', () => {

  test('✅ Level bonuses: base + (growthRate × (level - 1))', () => {
    const isaac1 = new Unit(ISAAC, 1);
    const isaac5 = new Unit(ISAAC, 5);

    // Verify growth formula
    // Isaac growth: HP +20, PP +3, ATK +3, DEF +2, MAG +2, SPD +1 per level
    expect(isaac5.stats.hp).toBe(100 + (20 * 4)); // 180
    expect(isaac5.stats.pp).toBe(24 + (3 * 4));   // 36
    expect(isaac5.stats.atk).toBe(14 + (3 * 4));  // 26 (BALANCE: 15→14)
    expect(isaac5.stats.def).toBe(10 + (2 * 4));  // 18
    expect(isaac5.stats.mag).toBe(12 + (2 * 4));  // 20
    expect(isaac5.stats.spd).toBe(12 + (1 * 4));  // 16
  });

  test('✅ Djinn synergy adds stat bonuses', () => {
    const isaac = new Unit(ISAAC, 5); // Base ATK 26, DEF 18

    // 3 Venus Djinn: +12 ATK, +8 DEF (from GAME_MECHANICS.md Section 3.2)
    isaac.equipDjinn([FLINT, GRANITE, BANE]);

    expect(isaac.stats.atk).toBe(38); // 26 + 12 (BALANCE: 27→26)
    expect(isaac.stats.def).toBe(26); // 18 + 8
  });

  test('✅ Only Set Djinn count for synergy (not Standby)', () => {
    const isaac = new Unit(ISAAC, 5); // Base ATK 26

    isaac.equipDjinn([FLINT, GRANITE, BANE]);
    expect(isaac.stats.atk).toBe(38); // 26 + 12 (all 3 Set, all Venus) (BALANCE: 27→26)

    // Activate one Djinn (moves to Standby)
    isaac.activateDjinn('flint');
    // Now only 2 Venus Djinn Set → reduced synergy!
    // 2 Venus (same element) = +8 ATK (from GAME_MECHANICS.md 2.1)
    expect(isaac.stats.atk).toBe(34); // 26 + 8 (2 Set Venus) (BALANCE: 27→26)

    // ← PROVES activating Djinn weakens passive bonuses (tactical trade-off)!
  });
});

describe('TASK 2: Status Effect Multipliers', () => {

  test('✅ Buff multiplies final stats', () => {
    const isaac = new Unit(ISAAC, 5); // Base ATK 26 (BALANCE: 27→26)

    // Apply Blessing buff: ATK ×1.25, DEF ×1.25
    isaac.statusEffects.push({
      type: 'buff',
      stat: 'atk',
      modifier: 1.25,
      duration: 3,
    });

    // 26 × 1.25 = 32.5 → floor = 32 (BALANCE: 27→26)
    expect(isaac.stats.atk).toBe(32);
  });

  test('✅ Debuff reduces stats', () => {
    const isaac = new Unit(ISAAC, 5); // Base ATK 26 (BALANCE: 27→26)

    // Apply debuff: ATK ×0.75
    isaac.statusEffects.push({
      type: 'debuff',
      stat: 'atk',
      modifier: 0.75,
      duration: 2,
    });

    // 26 × 0.75 = 19.5 → floor = 19 (BALANCE: 27→26)
    expect(isaac.stats.atk).toBe(19);
  });

  test('✅ Multiple buffs stack multiplicatively', () => {
    const isaac = new Unit(ISAAC, 5); // Base ATK 26 (BALANCE: 27→26)

    // Two buffs: ×1.25 and ×1.2
    isaac.statusEffects.push(
      { type: 'buff', stat: 'atk', modifier: 1.25, duration: 3 },
      { type: 'buff', stat: 'atk', modifier: 1.2, duration: 2 }
    );

    // 26 × 1.25 × 1.2 = 39 → floor = 39 (BALANCE: 27→26)
    expect(isaac.stats.atk).toBe(39);
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
    // Base: ATK 14 (BALANCE: 15→14)
    // Level 5: +12 (3 × 4)
    // Total before modifiers: 26 (BALANCE: 27→26)

    // Equipment: Sol Blade +30 ATK
    isaac.equipItem('weapon', SOL_BLADE);
    expect(isaac.stats.atk).toBe(56); // 26 + 30 (BALANCE: 27→26)

    // Djinn: 3 Venus +12 ATK
    isaac.equipDjinn([FLINT, GRANITE, BANE]);
    expect(isaac.stats.atk).toBe(68); // 26 + 30 + 12 (BALANCE: 27→26)

    // Buff: Blessing ×1.25
    isaac.statusEffects.push({
      type: 'buff',
      stat: 'atk',
      modifier: 1.25,
      duration: 3,
    });

    // (26 + 30 + 12) × 1.25 = 85 → floor = 85 (BALANCE: 27→26)
    expect(isaac.stats.atk).toBe(85);

    // ← PROVES complete stat formula works!
  });

  test('🎯 Defensive stats follow same formula', () => {
    const garet = new Unit(GARET, 5);
    // Base DEF: 7 (BALANCE: 8→7), Growth: +1, Level 5: 7 + (1 × 4) = 11

    // Equipment: Steel Armor +18 DEF
    garet.equipItem('armor', STEEL_ARMOR);
    expect(garet.stats.def).toBe(29); // 11 + 18 (BALANCE: 8→7)

    // Buff: Guardian's Stance ×1.5
    garet.statusEffects.push({
      type: 'buff',
      stat: 'def',
      modifier: 1.5,
      duration: 2,
    });

    // (11 + 18) × 1.5 = 43.5 → floor = 43 (BALANCE: 8→7)
    expect(garet.stats.def).toBe(43);

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
    const garet = new Unit(GARET, 5); // High ATK: 19 + (3 × 4) = 31 (BALANCE: 18→19, growth 4→3)

    // Mia unbuffed is weaker (65% of Garet's ATK) (BALANCE: Garet 34→31)
    expect(mia.stats.atk).toBe(20);
    expect(garet.stats.atk).toBe(31);
    expect(mia.stats.atk / garet.stats.atk).toBeLessThan(0.7);

    // Apply double buff to Mia
    mia.statusEffects.push(
      { type: 'buff', stat: 'atk', modifier: 1.5, duration: 3 },
      { type: 'buff', stat: 'atk', modifier: 1.3, duration: 2 }
    );

    // 20 × 1.5 × 1.3 = 39
    expect(mia.stats.atk).toBe(39);

    // Now stronger than unbuffed Garet! (31)
    expect(mia.stats.atk).toBeGreaterThan(garet.stats.atk);

    // ← PROVES buffs enable support units to become DPS!
  });

  test('🎯 Equipment progression path: Iron → Steel → Legendary', () => {
    const isaac = new Unit(ISAAC, 5); // ATK 26 (BALANCE: 27→26)

    // Early game: Iron Sword
    isaac.equipItem('weapon', IRON_SWORD);
    const earlyATK = isaac.stats.atk; // 26 + 12 = 38 (BALANCE: 27→26)

    // Mid game: Steel Sword
    isaac.equipItem('weapon', STEEL_SWORD);
    const midATK = isaac.stats.atk; // 26 + 20 = 46 (BALANCE: 27→26)

    // Late game: Sol Blade
    isaac.equipItem('weapon', SOL_BLADE);
    const lateATK = isaac.stats.atk; // 26 + 30 = 56 (BALANCE: 27→26)

    expect(midATK).toBeGreaterThan(earlyATK);
    expect(lateATK).toBeGreaterThan(midATK);
    expect(lateATK / earlyATK).toBeGreaterThan(1.4);

    // ← PROVES equipment creates progression!
  });

  test('🎯 Djinn specialization vs hybrid trade-off', () => {
    const isaac1 = new Unit(ISAAC, 5); // ATK 26 (BALANCE: 27→26)
    const isaac2 = new Unit(ISAAC, 5); // ATK 26 (BALANCE: 27→26)

    // Specialized: All Venus (3× same element)
    isaac1.equipDjinn([FLINT, GRANITE, BANE]);
    const specializedATK = isaac1.stats.atk; // 26 + 12 = 38 (BALANCE: 27→26)

    // Hybrid: Mixed elements
    isaac2.equipDjinn([FLINT, FORGE, FIZZ]);
    const hybridATK = isaac2.stats.atk; // 26 + 4 = 30 (BALANCE: 27→26)

    // Specialized gives 3× more ATK bonus
    expect((specializedATK - 26) / (hybridATK - 26)).toBe(3);

    // ← PROVES specialization rewards!
  });

  test('🎯 Debuffs counter strong enemies', () => {
    const garet = new Unit(GARET, 5); // ATK 31 (BALANCE: 34→31, base 18→19, growth 4→3)

    // Enemy applies debuff
    garet.statusEffects.push({
      type: 'debuff',
      stat: 'atk',
      modifier: 0.5, // Halved!
      duration: 3,
    });

    // 31 × 0.5 = 15.5 → floor = 15 (BALANCE: 34→31)
    expect(garet.stats.atk).toBe(15);

    // Now weaker than Isaac (26 ATK)! (BALANCE: 27→26)
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
    const isaac = new Unit(ISAAC, 5); // ATK 26 (BALANCE: 27→26)

    // Apply buff that creates fractional result
    isaac.statusEffects.push({
      type: 'buff',
      stat: 'atk',
      modifier: 1.1,
      duration: 3,
    });

    // 26 × 1.1 = 28.6 → floor = 28 (BALANCE: 27→26)
    expect(isaac.stats.atk).toBe(28);
    expect(isaac.stats.atk).not.toBe(29); // Not rounded up!
  });

  test('Unequipping removes bonuses immediately', () => {
    const isaac = new Unit(ISAAC, 5); // ATK 26 (BALANCE: 27→26)

    isaac.equipItem('weapon', SOL_BLADE);
    expect(isaac.stats.atk).toBe(56); // 26 + 30 (BALANCE: 27→26)

    isaac.unequipItem('weapon');
    expect(isaac.stats.atk).toBe(26); // Back to base (BALANCE: 27→26)

    // ← PROVES stats recalculate on unequip!
  });

  test('Stats recalculate every time accessed', () => {
    const isaac = new Unit(ISAAC, 5);

    const atk1 = isaac.stats.atk; // 26 (BALANCE: 27→26)
    isaac.equipItem('weapon', IRON_SWORD);
    const atk2 = isaac.stats.atk; // 38 (BALANCE: 27→26)
    isaac.equipDjinn([FLINT, GRANITE, BANE]);
    const atk3 = isaac.stats.atk; // 50 (BALANCE: 27→26)

    expect(atk1).toBe(26);
    expect(atk2).toBe(38);
    expect(atk3).toBe(50);

    // ← PROVES calculateStats() is called each time!
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
    const isaac = new Unit(ISAAC, 5); // ATK 26 (BALANCE: 27→26)

    // Apply extreme debuff
    isaac.statusEffects.push({
      type: 'debuff',
      stat: 'atk',
      modifier: 0.01, // 99% reduction
      duration: 3,
    });

    // 26 × 0.01 = 0.26 → floor = 0 (BALANCE: 27→26)
    expect(isaac.stats.atk).toBe(0);
    expect(isaac.stats.atk).toBeGreaterThanOrEqual(0);

    // ← PROVES no negative stats!
  });
});
