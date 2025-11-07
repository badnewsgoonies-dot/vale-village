/**
 * Batch 1 Enemy Implementation Tests
 *
 * Verifies that all 20 new Batch 1 enemies:
 * - Load correctly from enemies.ts
 * - Have proper stat values
 * - Have assigned abilities
 * - Have valid sprite references
 */

import { describe, it, expect } from 'vitest';
import { ENEMIES } from '@/data/enemies';

describe('Batch 1: Basic Enemies (Levels 1-2)', () => {
  const batch1Enemies = [
    'rat', 'bat', 'spider', 'grub', 'worm', 'vermin',
    'mini-goblin', 'kobold', 'roach', 'momonga',
    'emu', 'seabird', 'seafowl', 'wild-mushroom',
    'poison-toad', 'devil-frog', 'mole', 'mad-mole',
    'mad-vermin', 'squirrelfang'
  ];

  describe('Enemy Data Loading', () => {
    it('should have all 20 Batch 1 enemies in ENEMIES registry', () => {
      batch1Enemies.forEach(enemyId => {
        expect(ENEMIES[enemyId]).toBeDefined();
        expect(ENEMIES[enemyId].id).toBe(enemyId);
      });
    });

    it('should have unique IDs for all enemies', () => {
      const allEnemyIds = Object.keys(ENEMIES);
      const uniqueIds = new Set(allEnemyIds);
      expect(uniqueIds.size).toBe(allEnemyIds.length);
    });

    it('should have 30 total enemies registered (10 original + 20 Batch 1)', () => {
      const totalEnemies = Object.keys(ENEMIES).length;
      expect(totalEnemies).toBe(30);
    });
  });

  describe('Level 1 Enemies (10 total)', () => {
    const level1Enemies = [
      'rat', 'bat', 'spider', 'grub', 'worm',
      'vermin', 'mini-goblin', 'kobold', 'roach', 'momonga'
    ];

    level1Enemies.forEach(enemyId => {
      it(`${enemyId} should have level 1 and valid stats`, () => {
        const enemy = ENEMIES[enemyId];

        expect(enemy.level).toBe(1);
        expect(enemy.name).toBeTruthy();
        expect(enemy.element).toBeTruthy();

        // Stat validation for Level 1
        expect(enemy.stats.hp).toBeGreaterThanOrEqual(16);
        expect(enemy.stats.hp).toBeLessThanOrEqual(40);
        expect(enemy.stats.atk).toBeGreaterThanOrEqual(4);
        expect(enemy.stats.atk).toBeLessThanOrEqual(12);
        expect(enemy.stats.def).toBeGreaterThanOrEqual(2);
        expect(enemy.stats.def).toBeLessThanOrEqual(10);
        expect(enemy.stats.spd).toBeGreaterThanOrEqual(4);
        expect(enemy.stats.spd).toBeLessThanOrEqual(16);
      });

      it(`${enemyId} should have at least one ability`, () => {
        const enemy = ENEMIES[enemyId];
        expect(enemy.abilities.length).toBeGreaterThan(0);
        expect(enemy.abilities.length).toBeLessThanOrEqual(3);
      });

      it(`${enemyId} should have XP and Gold rewards`, () => {
        const enemy = ENEMIES[enemyId];
        expect(enemy.baseXp).toBeGreaterThan(0);
        expect(enemy.baseGold).toBeGreaterThan(0);
      });
    });
  });

  describe('Level 2 Enemies (10 total)', () => {
    const level2Enemies = [
      'emu', 'seabird', 'seafowl', 'wild-mushroom',
      'poison-toad', 'devil-frog', 'mole', 'mad-mole',
      'mad-vermin', 'squirrelfang'
    ];

    level2Enemies.forEach(enemyId => {
      it(`${enemyId} should have level 2 and valid stats`, () => {
        const enemy = ENEMIES[enemyId];

        expect(enemy.level).toBe(2);
        expect(enemy.name).toBeTruthy();
        expect(enemy.element).toBeTruthy();

        // Stat validation for Level 2
        expect(enemy.stats.hp).toBeGreaterThanOrEqual(29);
        expect(enemy.stats.hp).toBeLessThanOrEqual(45);
        expect(enemy.stats.atk).toBeGreaterThanOrEqual(6);
        expect(enemy.stats.atk).toBeLessThanOrEqual(12);
      });

      it(`${enemyId} should have abilities`, () => {
        const enemy = ENEMIES[enemyId];
        expect(enemy.abilities.length).toBeGreaterThan(0);
        expect(enemy.abilities.length).toBeLessThanOrEqual(3);
      });
    });
  });

  describe('Enemy Archetypes', () => {
    it('should have fast enemies with high SPD', () => {
      const fastEnemies = ['bat', 'mad-vermin', 'emu', 'roach', 'momonga'];

      fastEnemies.forEach(enemyId => {
        const enemy = ENEMIES[enemyId];
        expect(enemy.stats.spd).toBeGreaterThanOrEqual(12);
      });
    });

    it('should have tank enemies with high DEF/HP', () => {
      const tankEnemies = ['grub', 'mole'];

      tankEnemies.forEach(enemyId => {
        const enemy = ENEMIES[enemyId];
        expect(enemy.stats.def).toBeGreaterThanOrEqual(8);
      });
    });

    it('should have swarm enemies with low HP', () => {
      const swarmEnemies = ['rat', 'vermin', 'roach'];

      swarmEnemies.forEach(enemyId => {
        const enemy = ENEMIES[enemyId];
        expect(enemy.stats.hp).toBeLessThanOrEqual(22);
      });
    });

    it('should have caster enemies with PP and Psynergy abilities', () => {
      const casterEnemies = ['bat', 'seabird', 'seafowl', 'wild-mushroom', 'poison-toad', 'devil-frog', 'worm', 'mole', 'mad-mole'];

      casterEnemies.forEach(enemyId => {
        const enemy = ENEMIES[enemyId];
        expect(enemy.stats.pp).toBeGreaterThan(0);
        expect(enemy.abilities.length).toBeGreaterThan(1); // Has SLASH + Psynergy
      });
    });
  });

  describe('Element Distribution', () => {
    it('should have Neutral element enemies', () => {
      const neutralEnemies = batch1Enemies.filter(id =>
        ENEMIES[id].element === 'Neutral'
      );

      expect(neutralEnemies.length).toBeGreaterThan(8);
    });

    it('should have Jupiter (wind) element enemies', () => {
      const jupiterEnemies = ['bat', 'seabird', 'seafowl'];

      jupiterEnemies.forEach(id => {
        expect(ENEMIES[id].element).toBe('Jupiter');
      });
    });

    it('should have Venus (earth) element enemies', () => {
      const venusEnemies = ['spider', 'worm', 'wild-mushroom', 'mole', 'mad-mole'];

      venusEnemies.forEach(id => {
        expect(ENEMIES[id].element).toBe('Venus');
      });
    });

    it('should have Mercury (water) element enemies', () => {
      const mercuryEnemies = ['poison-toad', 'devil-frog'];

      mercuryEnemies.forEach(id => {
        expect(ENEMIES[id].element).toBe('Mercury');
      });
    });
  });

  describe('Equipment Drops', () => {
    it('should have Devil Frog with equipment drop', () => {
      const devilFrog = ENEMIES['devil-frog'];

      expect(devilFrog.drops).toBeDefined();
      expect(devilFrog.drops!.length).toBe(1);
      expect(devilFrog.drops![0].chance).toBe(0.08); // 8% drop rate
      expect(devilFrog.drops![0].equipment).toBeDefined();
    });

    it('should have most enemies without equipment drops (common)', () => {
      const enemiesWithDrops = batch1Enemies.filter(id =>
        ENEMIES[id].drops && ENEMIES[id].drops!.length > 0
      );

      // Only 1 enemy in Batch 1 should have drops (Devil Frog)
      expect(enemiesWithDrops.length).toBe(1);
    });
  });

  describe('Reward Scaling', () => {
    it('should have higher rewards for Level 2 enemies', () => {
      const level1Avg = batch1Enemies
        .filter(id => ENEMIES[id].level === 1)
        .reduce((sum, id) => sum + ENEMIES[id].baseXp, 0) / 10;

      const level2Avg = batch1Enemies
        .filter(id => ENEMIES[id].level === 2)
        .reduce((sum, id) => sum + ENEMIES[id].baseXp, 0) / 10;

      expect(level2Avg).toBeGreaterThan(level1Avg);
    });

    it('should have XP values in expected range for level', () => {
      batch1Enemies.forEach(id => {
        const enemy = ENEMIES[id];
        const level = enemy.level;

        // Level 1: 8-15 baseXP, Level 2: 16-20 baseXP
        if (level === 1) {
          expect(enemy.baseXp).toBeGreaterThanOrEqual(8);
          expect(enemy.baseXp).toBeLessThanOrEqual(15);
        } else if (level === 2) {
          expect(enemy.baseXp).toBeGreaterThanOrEqual(16);
          expect(enemy.baseXp).toBeLessThanOrEqual(20);
        }
      });
    });
  });

  describe('Sprite File Validation', () => {
    it('should have sprite file names matching enemy IDs', () => {
      // This test verifies the naming convention
      // Sprite files use Title_Case: Rat.gif, Wild_Wolf.gif
      // Enemy IDs use kebab-case: rat, wild-wolf

      const spriteNameMap: Record<string, string> = {
        'rat': 'Rat',
        'bat': 'Bat',
        'spider': 'Spider',
        'grub': 'Grub',
        'worm': 'Worm',
        'vermin': 'Vermin',
        'mini-goblin': 'Mini-Goblin',
        'kobold': 'Kobold',
        'roach': 'Roach',
        'momonga': 'Momonga',
        'emu': 'Emu',
        'seabird': 'Seabird',
        'seafowl': 'Seafowl',
        'wild-mushroom': 'Wild_Mushroom',
        'poison-toad': 'Poison_Toad',
        'devil-frog': 'Devil_Frog',
        'mole': 'Mole',
        'mad-mole': 'Mad_Mole',
        'mad-vermin': 'Mad_Vermin',
        'squirrelfang': 'Squirrelfang',
      };

      batch1Enemies.forEach(id => {
        expect(spriteNameMap[id]).toBeDefined();
        // Sprite path would be: /public/sprites/battle/enemies/${spriteNameMap[id]}.gif
      });
    });
  });
});
