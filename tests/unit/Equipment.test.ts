import { describe, test, expect } from 'vitest';
import { Unit } from '@/types/Unit';
import { ISAAC, GARET, MIA, IVAN } from '@/data/unitDefinitions';
import {
  WOODEN_SWORD, IRON_SWORD, STEEL_SWORD, SOL_BLADE,
  LEATHER_VEST, IRON_ARMOR, STEEL_ARMOR, DRAGON_SCALES,
  CLOTH_CAP, IRON_HELM, STEEL_HELM, ORACLES_CROWN,
  LEATHER_BOOTS, IRON_BOOTS, HYPER_BOOTS, HERMES_SANDALS
} from '@/data/equipment';

describe('TASK 4: Equipment System - Basic Functionality', () => {

<<<<<<< HEAD
=======
  test('✅ Weapon increases ATK stat', () => {
    const isaac = new Unit(ISAAC, 5); // Base ATK 27

    isaac.equipItem('weapon', IRON_SWORD);

    expect(isaac.stats.atk).toBe(39); // 27 + 12
  });

  test('✅ Armor increases DEF and HP stats', () => {
    const isaac = new Unit(ISAAC, 5); // Base HP 180, DEF 18

    isaac.equipItem('armor', IRON_ARMOR);

    expect(isaac.stats.hp).toBe(200); // 180 + 20
    expect(isaac.stats.def).toBe(28); // 18 + 10
  });

  test('✅ Helm increases DEF stat', () => {
    const isaac = new Unit(ISAAC, 5); // Base DEF 18

    isaac.equipItem('helm', IRON_HELM);

    expect(isaac.stats.def).toBe(23); // 18 + 5
  });

  test('✅ Boots increase SPD stat', () => {
    const isaac = new Unit(ISAAC, 5); // Base SPD 16

    isaac.equipItem('boots', IRON_BOOTS);

    expect(isaac.stats.spd).toBe(19); // 16 + 3
  });

>>>>>>> da011dae5a42c00b1fdb0e0f62b8f00e0a566dcf
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

    // ← PROVES equipment slots stack!
  });

  test('✅ Unequipping removes bonuses', () => {
    const isaac = new Unit(ISAAC, 5); // ATK 27

    isaac.equipItem('weapon', IRON_SWORD);
    expect(isaac.stats.atk).toBe(39); // 27 + 12

    isaac.unequipItem('weapon');
    expect(isaac.stats.atk).toBe(27); // Back to base

    // ← PROVES unequip works!
  });

  test('✅ Replacing equipment swaps bonuses', () => {
    const isaac = new Unit(ISAAC, 5); // ATK 27

    // Equip Iron Sword
    isaac.equipItem('weapon', IRON_SWORD);
    expect(isaac.stats.atk).toBe(39); // 27 + 12

    // Replace with Steel Sword
    isaac.equipItem('weapon', STEEL_SWORD);
    expect(isaac.stats.atk).toBe(47); // 27 + 20

    // ← PROVES replacing works!
  });
});

describe('TASK 4: Equipment Progression Paths', () => {

<<<<<<< HEAD
=======
  test('✅ Weapon progression: Basic → Iron → Steel → Legendary', () => {
    const isaac = new Unit(ISAAC, 5); // ATK 27

    // Basic: Wooden Sword
    isaac.equipItem('weapon', WOODEN_SWORD);
    expect(isaac.stats.atk).toBe(32); // 27 + 5

    // Iron: Iron Sword
    isaac.equipItem('weapon', IRON_SWORD);
    expect(isaac.stats.atk).toBe(39); // 27 + 12

    // Steel: Steel Sword
    isaac.equipItem('weapon', STEEL_SWORD);
    expect(isaac.stats.atk).toBe(47); // 27 + 20

    // Legendary: Sol Blade
    isaac.equipItem('weapon', SOL_BLADE);
    expect(isaac.stats.atk).toBe(57); // 27 + 30

    // ← PROVES 6× damage increase from Basic to Legendary!
  });

>>>>>>> da011dae5a42c00b1fdb0e0f62b8f00e0a566dcf
  test('✅ Armor progression: Basic → Iron → Steel → Legendary', () => {
    const isaac = new Unit(ISAAC, 5); // HP 180, DEF 18

    // Basic: Leather Vest
    isaac.equipItem('armor', LEATHER_VEST);
    expect(isaac.stats.hp).toBe(190);  // 180 + 10
    expect(isaac.stats.def).toBe(24);  // 18 + 6

    // Iron: Iron Armor
    isaac.equipItem('armor', IRON_ARMOR);
    expect(isaac.stats.hp).toBe(200);  // 180 + 20
    expect(isaac.stats.def).toBe(28);  // 18 + 10

    // Steel: Steel Armor
    isaac.equipItem('armor', STEEL_ARMOR);
    expect(isaac.stats.hp).toBe(220);  // 180 + 40
    expect(isaac.stats.def).toBe(36);  // 18 + 18

    // Legendary: Dragon Scales
    isaac.equipItem('armor', DRAGON_SCALES);
    expect(isaac.stats.hp).toBe(240);  // 180 + 60
    expect(isaac.stats.def).toBe(53);  // 18 + 35

    // ← PROVES tankiness scales with equipment tier!
  });

  test('✅ Helm progression unlocks MAG/PP bonuses at legendary tier', () => {
    const mia = new Unit(MIA, 5); // DEF 24, MAG 28, PP 45

    // Basic: Cloth Cap
    mia.equipItem('helm', CLOTH_CAP);
    expect(mia.stats.def).toBe(28);  // 24 + 4
    expect(mia.stats.mag).toBe(28);  // No change
    expect(mia.stats.pp).toBe(45);   // No change

    // Legendary: Oracle's Crown
    mia.equipItem('helm', ORACLES_CROWN);
    expect(mia.stats.def).toBe(49);  // 24 + 25
    expect(mia.stats.mag).toBe(38);  // 28 + 10
    expect(mia.stats.pp).toBe(60);   // 45 + 15

    // ← PROVES legendary helms are perfect for mages!
  });

  test('✅ Boots progression: Basic → Iron → Steel → Legendary', () => {
    const felix = new Unit(ISAAC, 5); // SPD 16

    // Basic: Leather Boots
    felix.equipItem('boots', LEATHER_BOOTS);
    expect(felix.stats.spd).toBe(18); // 16 + 2

    // Iron: Iron Boots
    felix.equipItem('boots', IRON_BOOTS);
    expect(felix.stats.spd).toBe(19); // 16 + 3

    // Steel: Hyper Boots
    felix.equipItem('boots', HYPER_BOOTS);
    expect(felix.stats.spd).toBe(24); // 16 + 8

    // Legendary: Hermes' Sandals
    felix.equipItem('boots', HERMES_SANDALS);
    expect(felix.stats.spd).toBe(26); // 16 + 10

    // ← PROVES speed scales dramatically!
  });
});

describe('TASK 4: Legendary Equipment Special Properties', () => {

  test('✅ Sol Blade unlocks Megiddo ability', () => {
    const isaac = new Unit(ISAAC, 5);

    // Before equipping
    expect(isaac.unlockedAbilityIds.has('megiddo')).toBe(false);

    // Equip legendary weapon
    isaac.equipItem('weapon', SOL_BLADE);

    // Ability should be unlocked
    expect(isaac.unlockedAbilityIds.has('megiddo')).toBe(true);

    // Unequip removes ability
    isaac.unequipItem('weapon');
    expect(isaac.unlockedAbilityIds.has('megiddo')).toBe(false);

    // ← PROVES legendary weapons grant abilities!
  });

  test('✅ Hermes\' Sandals grant always-first-turn property', () => {
    const felix = new Unit(ISAAC, 5);

    felix.equipItem('boots', HERMES_SANDALS);

    // Check that equipment has alwaysFirstTurn property
    expect(felix.equipment.boots).toBe(HERMES_SANDALS);
    expect(felix.equipment.boots?.alwaysFirstTurn).toBe(true);

    // ← PROVES legendary boots grant special property!
  });

  test('✅ Oracle\'s Crown boosts both defense AND magic', () => {
    const ivan = new Unit(IVAN, 5); // DEF 10, MAG 34, PP 54

    ivan.equipItem('helm', ORACLES_CROWN);

    expect(ivan.stats.def).toBe(35);  // 10 + 25 (tank-like DEF!)
    expect(ivan.stats.mag).toBe(44);  // 34 + 10 (stronger spells!)
    expect(ivan.stats.pp).toBe(69);   // 54 + 15 (more casts!)

    // ← PROVES Oracle's Crown turns mages into battle mages!
  });

  test('✅ Dragon Scales grant elemental resistance', () => {
    const isaac = new Unit(ISAAC, 5);

    isaac.equipItem('armor', DRAGON_SCALES);

    // Check that equipment has elementalResist property
    expect(isaac.equipment.armor).toBe(DRAGON_SCALES);
    expect(isaac.equipment.armor?.elementalResist).toBe(0.2);

    // ← PROVES Dragon Scales reduce elemental damage by 20%!
    // (Actual damage reduction will be tested in Task 5: Battle System)
  });
});

describe('CONTEXT-AWARE: Equipment Creates Strategic Choices', () => {

  test('🎯 Naked vs Fully Equipped = 2× stat difference', () => {
    const isaac1 = new Unit(ISAAC, 5); // Naked
    const isaac2 = new Unit(ISAAC, 5); // Fully equipped

    // Equip full Iron set
    isaac2.equipItem('weapon', IRON_SWORD);  // +12 ATK
    isaac2.equipItem('armor', IRON_ARMOR);   // +20 HP, +10 DEF
    isaac2.equipItem('helm', IRON_HELM);     // +5 DEF
    isaac2.equipItem('boots', IRON_BOOTS);   // +3 SPD

    // Compare stats
    const nakedATK = isaac1.stats.atk;  // 27
    const equippedATK = isaac2.stats.atk; // 39

    const nakedDEF = isaac1.stats.def;  // 18
    const equippedDEF = isaac2.stats.def; // 33

    expect(equippedATK / nakedATK).toBeGreaterThan(1.4); // 44% stronger
    expect(equippedDEF / nakedDEF).toBeGreaterThan(1.8); // 83% tankier

    // ← PROVES equipment dramatically increases power!
  });

  test('🎯 Full gear Lv1 ≈ Naked Lv5 (equipment is leveling alternative)', () => {
    const isaac1 = new Unit(ISAAC, 1); // Lv1 with equipment
    const isaac5 = new Unit(ISAAC, 5); // Lv5 naked

    // Equip Lv1 Isaac with full Iron set
    isaac1.equipItem('weapon', IRON_SWORD);  // +12 ATK
    isaac1.equipItem('armor', IRON_ARMOR);   // +20 HP, +10 DEF
    isaac1.equipItem('helm', IRON_HELM);     // +5 DEF
    isaac1.equipItem('boots', IRON_BOOTS);   // +3 SPD

    // Compare ATK
    expect(isaac1.stats.atk).toBe(27);  // 15 + 12
    expect(isaac5.stats.atk).toBe(27);  // Same!

    // Compare DEF
    expect(isaac1.stats.def).toBe(25);  // 10 + 10 + 5
    expect(isaac5.stats.def).toBe(18);  // Lower!

    // ← PROVES equipment is viable alternative to grinding levels!
  });

  test('🎯 Legendary equipment makes early-game units late-game viable', () => {
    const isaac1 = new Unit(ISAAC, 1); // Lv1 with legendary gear
    const garet5 = new Unit(GARET, 5); // Lv5 Pure DPS, naked

    // Equip Lv1 Isaac with legendary set
    isaac1.equipItem('weapon', SOL_BLADE);       // +30 ATK
    isaac1.equipItem('armor', DRAGON_SCALES);    // +60 HP, +35 DEF
    isaac1.equipItem('helm', ORACLES_CROWN);     // +25 DEF, +10 MAG, +15 PP
    isaac1.equipItem('boots', HERMES_SANDALS);   // +10 SPD

    // Lv1 Isaac with legendary gear > Lv5 Garet naked!
    expect(isaac1.stats.atk).toBe(45);  // 15 + 30
    expect(garet5.stats.atk).toBe(34);  // Lv5 Pure DPS

    expect(isaac1.stats.def).toBe(70);  // 10 + 35 + 25
    expect(garet5.stats.def).toBe(12);  // Lv5 Pure DPS

    // ← PROVES legendary equipment breaks power curve!
  });

  test('🎯 Equipment specialization: DPS vs Tank builds', () => {
    const isaac1 = new Unit(ISAAC, 5); // DPS build
    const isaac2 = new Unit(ISAAC, 5); // Tank build

    // DPS build: Max damage
    isaac1.equipItem('weapon', SOL_BLADE);       // +30 ATK
    isaac1.equipItem('armor', LEATHER_VEST);     // +6 DEF, +10 HP (light)
    isaac1.equipItem('helm', CLOTH_CAP);         // +4 DEF (light)
    isaac1.equipItem('boots', HERMES_SANDALS);   // +10 SPD (first strike)

    // Tank build: Max survivability
    isaac2.equipItem('weapon', WOODEN_SWORD);    // +5 ATK (minimal)
    isaac2.equipItem('armor', DRAGON_SCALES);    // +35 DEF, +60 HP
    isaac2.equipItem('helm', ORACLES_CROWN);     // +25 DEF, +10 MAG, +15 PP
    isaac2.equipItem('boots', IRON_BOOTS);       // +3 SPD (minimal)

    // DPS has way more ATK
    expect(isaac1.stats.atk).toBe(57);  // 27 + 30
    expect(isaac2.stats.atk).toBe(32);  // 27 + 5

    // Tank has way more DEF
    expect(isaac1.stats.def).toBe(28);  // 18 + 6 + 4
    expect(isaac2.stats.def).toBe(78);  // 18 + 35 + 25

    // ← PROVES equipment enables build diversity!
  });

  test('🎯 Mage build: Oracle\'s Crown + Sol Blade = Battle Mage', () => {
    const mia = new Unit(MIA, 5); // Healer

    // Hybrid battle mage build
    mia.equipItem('weapon', SOL_BLADE);       // +30 ATK (usually weak!)
    mia.equipItem('armor', STEEL_ARMOR);      // +18 DEF, +40 HP
    mia.equipItem('helm', ORACLES_CROWN);     // +25 DEF, +10 MAG, +15 PP
    mia.equipItem('boots', HYPER_BOOTS);      // +8 SPD

    // Mia becomes battle mage!
    expect(mia.stats.atk).toBe(50);  // 20 + 30 (can fight!)
    expect(mia.stats.def).toBe(67);  // 24 + 18 + 25 (tanky!)
    expect(mia.stats.mag).toBe(38);  // 28 + 10 (strong heals!)
    expect(mia.stats.pp).toBe(60);   // 45 + 15 (many casts!)

    // ← PROVES equipment enables hybrid roles!
  });
});

describe('CONTEXT-AWARE: Equipment Synergy with Other Systems', () => {

  test('🎯 Equipment + Leveling = Exponential power growth', () => {
    const isaac1 = new Unit(ISAAC, 1); // Lv1, naked
    const isaac5 = new Unit(ISAAC, 5); // Lv5, fully equipped

    // Equip Lv5 Isaac with full legendary set
    isaac5.equipItem('weapon', SOL_BLADE);       // +30 ATK
    isaac5.equipItem('armor', DRAGON_SCALES);    // +60 HP, +35 DEF
    isaac5.equipItem('helm', ORACLES_CROWN);     // +25 DEF, +10 MAG, +15 PP
    isaac5.equipItem('boots', HERMES_SANDALS);   // +10 SPD

    // Compare power levels
    const atkRatio = isaac5.stats.atk / isaac1.stats.atk; // 57 / 15 = 3.8×
    const defRatio = isaac5.stats.def / isaac1.stats.def; // 78 / 10 = 7.8×

    expect(atkRatio).toBeGreaterThan(3.5);
    expect(defRatio).toBeGreaterThan(7.0);

    // ← PROVES leveling + equipment = exponential growth!
  });

  test('🎯 Equipment changes affect battle stats immediately', () => {
    const isaac = new Unit(ISAAC, 5); // ATK 27

    // Simulate mid-battle equipment swap
    const beforeATK = isaac.stats.atk; // 27

    isaac.equipItem('weapon', IRON_SWORD);
    const midBattleATK = isaac.stats.atk; // 39

    expect(midBattleATK).toBeGreaterThan(beforeATK);
    expect(midBattleATK).toBe(39);

    // ← PROVES equipment changes are immediate!
  });

  test('🎯 HP increase from armor does NOT heal current HP', () => {
    const isaac = new Unit(ISAAC, 5); // HP 180

    // Take damage
    isaac.takeDamage(50);
    expect(isaac.currentHp).toBe(130);

    // Equip armor (increases max HP)
    isaac.equipItem('armor', IRON_ARMOR); // +20 HP

    // Max HP increases but current HP stays the same
    expect(isaac.maxHp).toBe(200);  // 180 + 20
    expect(isaac.currentHp).toBe(130); // Still damaged

    // ← PROVES equipment changes max HP but doesn't heal!
  });
});

describe('EDGE CASES: Equipment System', () => {

<<<<<<< HEAD
=======
  test('Empty equipment slots contribute 0', () => {
    const isaac = new Unit(ISAAC, 5); // ATK 27

    // All slots empty
    expect(isaac.equipment.weapon).toBeNull();
    expect(isaac.equipment.armor).toBeNull();
    expect(isaac.stats.atk).toBe(27); // No crash, just base

    // ← PROVES null safety!
  });

  test('Unequipping empty slot returns null', () => {
    const isaac = new Unit(ISAAC, 5);

    const result = isaac.unequipItem('weapon');

    expect(result).toBeNull();
  });

>>>>>>> da011dae5a42c00b1fdb0e0f62b8f00e0a566dcf
  test('Unequipping returns the previous item', () => {
    const isaac = new Unit(ISAAC, 5);

    isaac.equipItem('weapon', IRON_SWORD);
    const unequipped = isaac.unequipItem('weapon');

    expect(unequipped).toBe(IRON_SWORD);
  });

<<<<<<< HEAD
=======
  test('Replacing equipment returns no error', () => {
    const isaac = new Unit(ISAAC, 5);

    // Equip Iron Sword
    isaac.equipItem('weapon', IRON_SWORD);

    // Replace with Steel Sword (should work)
    isaac.equipItem('weapon', STEEL_SWORD);
    expect(isaac.equipment.weapon).toBe(STEEL_SWORD);

    // ← PROVES replacing works without unequipping first!
  });
>>>>>>> da011dae5a42c00b1fdb0e0f62b8f00e0a566dcf
});

describe('DATA INTEGRITY: Equipment Catalog', () => {

  test('✅ All equipment tiers exist (Basic, Iron, Steel, Legendary)', () => {
    // Weapons
    expect(WOODEN_SWORD.tier).toBe('basic');
    expect(IRON_SWORD.tier).toBe('iron');
    expect(STEEL_SWORD.tier).toBe('steel');
    expect(SOL_BLADE.tier).toBe('legendary');

    // Armor
    expect(LEATHER_VEST.tier).toBe('basic');
    expect(IRON_ARMOR.tier).toBe('iron');
    expect(STEEL_ARMOR.tier).toBe('steel');
    expect(DRAGON_SCALES.tier).toBe('legendary');

    // ← PROVES full progression path exists!
  });

  test('✅ Equipment costs increase with tier', () => {
    // Weapons
    expect(WOODEN_SWORD.cost).toBe(50);
    expect(IRON_SWORD.cost).toBe(200);
    expect(STEEL_SWORD.cost).toBe(500);
    expect(SOL_BLADE.cost).toBe(10000);

    // Verify progression
    expect(IRON_SWORD.cost).toBeGreaterThan(WOODEN_SWORD.cost);
    expect(STEEL_SWORD.cost).toBeGreaterThan(IRON_SWORD.cost);
    expect(SOL_BLADE.cost).toBeGreaterThan(STEEL_SWORD.cost);

    // ← PROVES economy scales correctly!
  });

  test('✅ Equipment bonuses scale with tier', () => {
    // Weapons: ATK bonus
    expect(WOODEN_SWORD.statBonus.atk).toBe(5);
    expect(IRON_SWORD.statBonus.atk).toBe(12);
    expect(STEEL_SWORD.statBonus.atk).toBe(20);
    expect(SOL_BLADE.statBonus.atk).toBe(30);

    // Verify scaling
    expect(IRON_SWORD.statBonus.atk).toBeGreaterThan(WOODEN_SWORD.statBonus.atk);
    expect(STEEL_SWORD.statBonus.atk).toBeGreaterThan(IRON_SWORD.statBonus.atk);
    expect(SOL_BLADE.statBonus.atk).toBeGreaterThan(STEEL_SWORD.statBonus.atk);

    // ← PROVES stat bonuses increase with tier!
  });

  test('✅ All 4 equipment slots have items', () => {
    const isaac = new Unit(ISAAC, 5);

    // Can equip all 4 slots
    isaac.equipItem('weapon', IRON_SWORD);
    isaac.equipItem('armor', IRON_ARMOR);
    isaac.equipItem('helm', IRON_HELM);
    isaac.equipItem('boots', IRON_BOOTS);

    expect(isaac.equipment.weapon).toBeTruthy();
    expect(isaac.equipment.armor).toBeTruthy();
    expect(isaac.equipment.helm).toBeTruthy();
    expect(isaac.equipment.boots).toBeTruthy();

    // ← PROVES all equipment slots functional!
  });

  test('✅ Legendary equipment has unique properties', () => {
    // Sol Blade unlocks ability
    expect(SOL_BLADE.unlocksAbility).toBe('megiddo');

    // Hermes' Sandals grant special property
    expect(HERMES_SANDALS.alwaysFirstTurn).toBe(true);

    // Oracle's Crown boosts multiple stats
    expect(ORACLES_CROWN.statBonus.def).toBeTruthy();
    expect(ORACLES_CROWN.statBonus.mag).toBeTruthy();
    expect(ORACLES_CROWN.statBonus.pp).toBeTruthy();

    // Dragon Scales grant elemental resistance
    expect(DRAGON_SCALES.elementalResist).toBe(0.2);

    // ← PROVES legendary items are special!
  });
});
