import { describe, test, expect } from 'vitest';
import { spriteRegistry } from '@/sprites/registry';
import { Unit } from '@/types/Unit';
import { UNIT_DEFINITIONS } from '@/data/unitDefinitions';
import { IRON_SWORD, STEEL_SWORD, SOL_BLADE, IRON_ARMOR } from '@/data/equipment';

describe('Sprite Registry', () => {
  describe('getBattleSprite', () => {
    test('returns correct path for Isaac with default equipment', () => {
      const isaac = new Unit(UNIT_DEFINITIONS.isaac);
      const path = spriteRegistry.getBattleSprite(isaac, 'Front');

      expect(path).toMatch(/\/sprites\/battle\/party\/isaac\/Isaac_.*_Front\.gif$/);
      expect(path).toContain('/sprites/battle/party/isaac/');
      expect(path).toContain('Front.gif');
    });

    test('handles Jenna fallback for CastFront animations', () => {
      const jenna = new Unit(UNIT_DEFINITIONS.jenna);
      const path = spriteRegistry.getBattleSprite(jenna, 'CastFront1');

      // Should use jenna_gs2 folder for missing animations
      expect(path).toContain('jenna_gs2');
      expect(path).toContain('CastFront1.gif');
    });

    test('Jenna uses regular folder for non-CastFront animations', () => {
      const jenna = new Unit(UNIT_DEFINITIONS.jenna);
      const frontPath = spriteRegistry.getBattleSprite(jenna, 'Front');
      const attackPath = spriteRegistry.getBattleSprite(jenna, 'Attack1');

      // Should use regular jenna folder for these
      expect(frontPath).toContain('/jenna/');
      expect(frontPath).not.toContain('jenna_gs2');
      expect(attackPath).toContain('/jenna/');
      expect(attackPath).not.toContain('jenna_gs2');
    });

    test('returns correct path for all 8 units', () => {
      const units = ['isaac', 'garet', 'ivan', 'mia', 'felix', 'jenna', 'sheba', 'piers'];

      for (const unitId of units) {
        const unit = new Unit(UNIT_DEFINITIONS[unitId]);
        const path = spriteRegistry.getBattleSprite(unit, 'Front');

        expect(path).toContain('/battle/party/');
        expect(path).toContain('Front.gif');
        expect(path).toMatch(/\.gif$/);
      }
    });

    test('handles different weapon types correctly', () => {
      const isaac = new Unit(UNIT_DEFINITIONS.isaac);

      // Isaac starts with no weapon, should use default (lSword)
      const defaultPath = spriteRegistry.getBattleSprite(isaac, 'Front');
      expect(defaultPath).toContain('_lSword_');

      // Equip a sword
      isaac.equipItem('weapon', IRON_SWORD);

      const swordPath = spriteRegistry.getBattleSprite(isaac, 'Front');
      expect(swordPath).toContain('_lSword_');
    });

    test('handles different animation states', () => {
      const isaac = new Unit(UNIT_DEFINITIONS.isaac);

      const animations = ['Front', 'Back', 'Attack1', 'Attack2', 'CastFront1', 'DownedFront'];

      for (const animation of animations) {
        const path = spriteRegistry.getBattleSprite(isaac, animation as any);
        expect(path).toContain(`_${animation}.gif`);
      }
    });
  });

  describe('getEquipmentIcon', () => {
    test('returns correct path for sword equipment', () => {
      const path = spriteRegistry.getEquipmentIcon(IRON_SWORD);

      expect(path).toContain('/icons/items/');
      expect(path).toContain('Iron_Sword.gif');
      expect(path).toMatch(/\.gif$/);
    });

    test('returns correct path for legendary sword', () => {
      const path = spriteRegistry.getEquipmentIcon(SOL_BLADE);

      expect(path).toContain('/icons/items/');
      expect(path).toContain('Sol_Blade.gif');
    });

    test('returns correct path for armor', () => {
      const path = spriteRegistry.getEquipmentIcon(IRON_ARMOR);

      expect(path).toContain('/icons/items/');
      expect(path).toContain('Iron_Armor.gif');
      expect(path).toMatch(/\.gif$/);
    });

    test('converts equipment names with spaces to underscores', () => {
      const path = spriteRegistry.getEquipmentIcon(STEEL_SWORD);

      expect(path).toContain('Steel_Sword.gif');
      expect(path).not.toContain(' ');
    });
  });

  describe('getAbilityIcon', () => {
    test('returns correct path for Ragnarok', () => {
      const path = spriteRegistry.getAbilityIcon('Ragnarok');

      expect(path).toBe('/sprites/icons/psynergy/Ragnarok.gif');
    });

    test('handles abilities with spaces', () => {
      const path = spriteRegistry.getAbilityIcon('Healing Spring');

      expect(path).toBe('/sprites/icons/psynergy/Healing_Spring.gif');
      expect(path).not.toContain(' ');
    });

    test('handles single-word abilities', () => {
      const path = spriteRegistry.getAbilityIcon('Cure');

      expect(path).toBe('/sprites/icons/psynergy/Cure.gif');
    });
  });

  describe('getDjinnIcon', () => {
    test('returns element-based sprite for Venus Djinn', () => {
      const flint = { name: 'Flint', element: 'Venus' as const, id: 'flint', tier: 1 as const, lore: '', unleashEffect: { type: 'damage' as const, basePower: 50, targets: 'single-enemy' as const }, source: '' };
      const path = spriteRegistry.getDjinnIcon(flint);

      expect(path).toBe('/sprites/battle/djinn/Venus_Djinn_Front.gif');
    });

    test('returns element-based sprite for Mars Djinn', () => {
      const forge = { name: 'Forge', element: 'Mars' as const, id: 'forge', tier: 1 as const, lore: '', unleashEffect: { type: 'damage' as const, basePower: 50, targets: 'single-enemy' as const }, source: '' };
      const path = spriteRegistry.getDjinnIcon(forge);

      expect(path).toBe('/sprites/battle/djinn/Mars_Djinn_Front.gif');
    });

    test('returns element-based sprite for Jupiter Djinn', () => {
      const gust = { name: 'Gust', element: 'Jupiter' as const, id: 'gust', tier: 1 as const, lore: '', unleashEffect: { type: 'damage' as const, basePower: 50, targets: 'single-enemy' as const }, source: '' };
      const path = spriteRegistry.getDjinnIcon(gust);

      expect(path).toBe('/sprites/battle/djinn/Jupiter_Djinn_Front.gif');
    });

    test('returns element-based sprite for Mercury Djinn', () => {
      const sleet = { name: 'Sleet', element: 'Mercury' as const, id: 'sleet', tier: 1 as const, lore: '', unleashEffect: { type: 'damage' as const, basePower: 50, targets: 'single-enemy' as const }, source: '' };
      const path = spriteRegistry.getDjinnIcon(sleet);

      expect(path).toBe('/sprites/battle/djinn/Mercury_Djinn_Front.gif');
    });
  });
});
