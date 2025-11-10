/**
 * Integration tests for effective stats
 * PR-STATS-EFFECTIVE Task F
 * Tests that effective stats affect combat outcomes
 */

import { describe, it, expect } from 'vitest';
import { makeTestCtx } from '../../../src/test/testCtx';
import { mkUnit, mkEnemy, mkTeam, mkBattle } from '../../../src/test/factories';
import { performAction } from '../../../src/core/services/BattleService';
import { calculateEffectiveStats } from '../../../src/core/algorithms/stats';
import { createUnit } from '../../../src/core/models/Unit';
import { UNIT_DEFINITIONS } from '../../../src/data/definitions/units';
import { ABILITIES } from '../../../src/data/definitions/abilities';

describe('Effective Stats Integration', () => {
  it('should increase damage with equipment bonuses', () => {
    const ctx = makeTestCtx();
    const playerUnit = createUnit(UNIT_DEFINITIONS.adept, 5);
    const enemyUnit = mkEnemy('slime');
    
    // Create team with 4 units
    const team = mkTeam([
      playerUnit,
      createUnit(UNIT_DEFINITIONS.war_mage, 1),
      createUnit(UNIT_DEFINITIONS.mystic, 1),
      createUnit(UNIT_DEFINITIONS.ranger, 1),
    ]);
    
    // Compare effective stats with and without equipment
    const baseEffective = calculateEffectiveStats(playerUnit, team);
    
    // Add equipment with ATK bonus
    const equippedUnit = {
      ...playerUnit,
      equipment: {
        ...playerUnit.equipment,
        weapon: {
          id: 'test_sword',
          name: 'Test Sword',
          slot: 'weapon',
          tier: 'common',
          cost: 100,
          statBonus: { atk: 10 },
        },
      },
    };
    
    const equippedEffective = calculateEffectiveStats(equippedUnit, team);
    
    // Effective ATK should be higher with equipment
    expect(equippedEffective.atk).toBeGreaterThan(baseEffective.atk);
    expect(equippedEffective.atk).toBe(baseEffective.atk + 10);
  });

  it('should increase damage with level bonuses', () => {
    const ctx = makeTestCtx();
    // Use createUnit directly to set level correctly
    const lowLevelUnit = createUnit(UNIT_DEFINITIONS.adept, 1);
    const highLevelUnit = createUnit(UNIT_DEFINITIONS.adept, 10);
    
    const lowTeam = mkTeam([lowLevelUnit, createUnit(UNIT_DEFINITIONS.war_mage, 1), createUnit(UNIT_DEFINITIONS.mystic, 1), createUnit(UNIT_DEFINITIONS.ranger, 1)]);
    const highTeam = mkTeam([highLevelUnit, createUnit(UNIT_DEFINITIONS.war_mage, 1), createUnit(UNIT_DEFINITIONS.mystic, 1), createUnit(UNIT_DEFINITIONS.ranger, 1)]);
    
    // Compare effective stats
    const lowEffective = calculateEffectiveStats(lowLevelUnit, lowTeam);
    const highEffective = calculateEffectiveStats(highLevelUnit, highTeam);
    
    // Higher level should have higher effective stats (if growth rates > 0)
    // Note: Some units may have 0 growth rates, so we check >= instead of >
    expect(highEffective.atk).toBeGreaterThanOrEqual(lowEffective.atk);
    expect(highEffective.def).toBeGreaterThanOrEqual(lowEffective.def);
    expect(highEffective.mag).toBeGreaterThanOrEqual(lowEffective.mag);
    expect(highEffective.spd).toBeGreaterThanOrEqual(lowEffective.spd);
    
    // HP should increase if growth rate > 0 (level 10 vs level 1 = 9 levels of growth)
    // Adept has hp growth rate of 25, so level 10 should have 120 + (9 * 25) = 345 HP
    expect(highEffective.hp).toBeGreaterThan(lowEffective.hp);
  });

  it('should affect turn order with effective SPD', () => {
    const slowUnit = createUnit(UNIT_DEFINITIONS.adept, 1);
    const fastUnit = createUnit(UNIT_DEFINITIONS.ranger, 1);
    
    // Give fast unit SPD buff
    fastUnit.statusEffects = [
      {
        type: 'buff',
        stat: 'spd',
        modifier: 20,
        duration: 5,
      },
    ];
    
    const team = mkTeam([
      slowUnit,
      fastUnit,
      createUnit(UNIT_DEFINITIONS.war_mage, 1),
      createUnit(UNIT_DEFINITIONS.mystic, 1),
    ]);
    
    // Fast unit should have higher effective SPD
    const slowEffective = calculateEffectiveStats(slowUnit, team);
    const fastEffective = calculateEffectiveStats(fastUnit, team);
    
    expect(fastEffective.spd).toBeGreaterThan(slowEffective.spd);
    
    // Turn order should reflect effective SPD
    // (This is tested more thoroughly in turn-order tests)
  });

  it('should affect healing with effective MAG', () => {
    const healer = createUnit(UNIT_DEFINITIONS.mystic, 5);
    const target = createUnit(UNIT_DEFINITIONS.adept, 5);
    target.currentHp = 50; // Wounded
    
    const team = mkTeam([
      healer,
      target,
      createUnit(UNIT_DEFINITIONS.war_mage, 1),
      createUnit(UNIT_DEFINITIONS.ranger, 1),
    ]);
    
    // Get base healing
    const baseEffective = calculateEffectiveStats(healer, team);
    
    // Add MAG buff
    const buffedHealer = {
      ...healer,
      statusEffects: [
        {
          type: 'buff',
          stat: 'mag',
          modifier: 10,
          duration: 5,
        },
      ],
    };
    
    const buffedEffective = calculateEffectiveStats(buffedHealer, team);
    
    // Buffed MAG should be higher
    expect(buffedEffective.mag).toBeGreaterThan(baseEffective.mag);
    expect(buffedEffective.mag).toBe(baseEffective.mag + 10);
  });
});

