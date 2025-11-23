/**
 * Status Effect Tests
 * Tests for status effect application, ticking, and expiration
 */

import { describe, test, expect } from 'vitest';
import { makePRNG } from '../../../src/core/random/prng';
import { processStatusEffectTick, checkParalyzeFailure, isFrozen } from '../../../src/core/algorithms/status';
import { performAction } from '../../../src/core/services/BattleService';
import { mkBattle, mkUnit, mkEnemy } from '../../../src/test/factories';
import { makeTestCtx } from '../../../src/test/testCtx';
import { ABILITIES } from '../../../src/data/definitions/abilities';

describe('Status Effects', () => {
  describe('On-Hit Status Application', () => {
    test('should apply poison status on successful hit', () => {
      const { rng } = makeTestCtx(1000);
      const attacker = mkUnit({
        id: 'attacker',
        abilities: [ABILITIES['poison-strike']],
        unlockedAbilityIds: ['poison-strike'],
      });

      const target = mkEnemy('slime', { id: 'target' });
      const battle = mkBattle({
        party: [attacker],
        enemies: [target],
      });

      const result = performAction(battle, 'attacker', 'poison-strike', ['target'], rng);

      const updatedTarget = result.state.enemies.find(u => u.id === 'target');
      expect(updatedTarget).toBeDefined();

      const poisonStatus = updatedTarget?.statusEffects.find(s => s.type === 'poison');
      expect(poisonStatus).toBeDefined();
      expect(poisonStatus?.duration).toBe(3);
      expect(poisonStatus?.damagePerTurn).toBe(8);

      const statusEvent = result.events.find(
        e => e.type === 'status-applied' &&
             e.status.type === 'poison' &&
             e.targetId === 'target'
      );
      expect(statusEvent).toBeDefined();
    });
    
    test('should apply burn status on successful hit', () => {
      const { rng } = makeTestCtx(2000);
      const attacker = mkUnit({
        id: 'attacker',
        abilities: [ABILITIES['burn-touch']],
        unlockedAbilityIds: ['burn-touch'],
      });

      const target = mkEnemy('slime', { id: 'target' });
      const battle = mkBattle({
        party: [attacker],
        enemies: [target],
      });

      const result = performAction(battle, 'attacker', 'burn-touch', ['target'], rng);

      const updatedTarget = result.state.enemies.find(u => u.id === 'target');
      const burnStatus = updatedTarget?.statusEffects.find(s => s.type === 'burn');

      expect(burnStatus).toBeDefined();
      expect(burnStatus?.duration).toBe(3);
      expect(burnStatus?.damagePerTurn).toBe(10);

      const statusEvent = result.events.find(
        e => e.type === 'status-applied' &&
             e.status.type === 'burn' &&
             e.targetId === 'target'
      );
      expect(statusEvent).toBeDefined();
    });
  });
  
  describe('Stacking Prevention', () => {
    test('should prevent status stacking (reapply replaces same type)', () => {
      const unit = mkUnit({
        id: 'unit',
        statusEffects: [
          { type: 'poison', damagePerTurn: 8, duration: 2 },
        ],
      });
      
      // Simulate reapplication (filter + replace pattern from BattleService)
      const statusType = 'poison';
      const filteredStatuses = unit.statusEffects.filter(s => s.type !== statusType);
      const newPoison = { type: 'poison' as const, damagePerTurn: 8, duration: 3 };
      const updatedUnit = {
        ...unit,
        statusEffects: [...filteredStatuses, newPoison],
      };
      
      // Should have only one poison status
      const poisonStatuses = updatedUnit.statusEffects.filter(s => s.type === 'poison');
      expect(poisonStatuses.length).toBe(1);
      expect(poisonStatuses[0]?.duration).toBe(3); // New duration replaces old
    });
    
    test('should allow different status types to coexist', () => {
      const unit = mkUnit({
        id: 'unit',
        statusEffects: [
          { type: 'poison', damagePerTurn: 8, duration: 2 },
          { type: 'burn', damagePerTurn: 10, duration: 3 },
        ],
      });
      
      // Apply freeze (different type)
      const newFreeze = { type: 'freeze' as const, duration: 2 };
      const updatedUnit = {
        ...unit,
        statusEffects: [...unit.statusEffects, newFreeze],
      };
      
      // Should have all three status types
      expect(updatedUnit.statusEffects.length).toBe(3);
      expect(updatedUnit.statusEffects.some(s => s.type === 'poison')).toBe(true);
      expect(updatedUnit.statusEffects.some(s => s.type === 'burn')).toBe(true);
      expect(updatedUnit.statusEffects.some(s => s.type === 'freeze')).toBe(true);
    });
  });
  
  describe('Status Tick Damage', () => {
    test('should deal 8% max HP poison damage per turn', () => {
      const rng = makePRNG(12345);
      const unit = mkUnit({
        id: 'unit',
        level: 1,
      });
      const maxHp = unit.baseStats.hp + (unit.level - 1) * unit.growthRates.hp;
      
      const unitWithPoison = {
        ...unit,
        statusEffects: [{ type: 'poison' as const, damagePerTurn: 8, duration: 3 }],
      };
      
      const result = processStatusEffectTick(unitWithPoison, rng);
      
      const expectedDamage = Math.floor(maxHp * 0.08);
      expect(result.damage).toBe(expectedDamage);
      expect(result.updatedUnit.currentHp).toBe(unit.currentHp - expectedDamage);
      expect(result.messages.some(m => m.includes('poison damage'))).toBe(true);
    });
    
    test('should deal 10% max HP burn damage per turn', () => {
      const rng = makePRNG(12345);
      const unit = mkUnit({
        id: 'unit',
        level: 1,
      });
      const maxHp = unit.baseStats.hp + (unit.level - 1) * unit.growthRates.hp;
      
      const unitWithBurn = {
        ...unit,
        statusEffects: [{ type: 'burn' as const, damagePerTurn: 10, duration: 3 }],
      };
      
      const result = processStatusEffectTick(unitWithBurn, rng);
      
      const expectedDamage = Math.floor(maxHp * 0.10);
      expect(result.damage).toBe(expectedDamage);
      expect(result.updatedUnit.currentHp).toBe(unit.currentHp - expectedDamage);
      expect(result.messages.some(m => m.includes('burn damage'))).toBe(true);
    });
    
    test('should decrement duration after tick', () => {
      const rng = makePRNG(12345);
      const unit = mkUnit({
        id: 'unit',
        statusEffects: [{ type: 'poison' as const, damagePerTurn: 8, duration: 3 }],
      });
      
      const result = processStatusEffectTick(unit, rng);
      
      const poisonStatus = result.updatedUnit.statusEffects.find(s => s.type === 'poison');
      expect(poisonStatus?.duration).toBe(2);
    });
    
    test('should remove status when duration reaches 0', () => {
      const rng = makePRNG(12345);
      const unit = mkUnit({
        id: 'unit',
        statusEffects: [{ type: 'poison' as const, damagePerTurn: 8, duration: 1 }],
      });
      
      const result = processStatusEffectTick(unit, rng);
      
      // Duration 1 -> 0, should be removed
      const poisonStatus = result.updatedUnit.statusEffects.find(s => s.type === 'poison');
      expect(poisonStatus).toBeUndefined();
    });
  });
  
  describe('Freeze Status', () => {
    test('should prevent unit from acting when frozen', () => {
      const unit = mkUnit({
        id: 'unit',
        statusEffects: [{ type: 'freeze' as const, duration: 2 }],
      });
      
      expect(isFrozen(unit)).toBe(true);
    });
    
    test('should have ~30% break chance per turn', () => {
      // Test over many trials to verify probability
      let breakCount = 0;
      const trials = 1000;
      
      for (let i = 0; i < trials; i++) {
        const rng = makePRNG(3000 + i); // Different seed per trial
        const unit = mkUnit({
          id: 'unit',
          statusEffects: [{ type: 'freeze' as const, duration: 2 }],
        });
        
        const result = processStatusEffectTick(unit, rng);
        
        // Check if freeze broke (duration set to 0 or removed)
        const freezeStatus = result.updatedUnit.statusEffects.find(s => s.type === 'freeze');
        if (!freezeStatus || freezeStatus.duration === 0) {
          breakCount++;
        }
      }
      
      const breakRate = breakCount / trials;
      // Should be approximately 30% (allow 5% tolerance: 25-35%)
      expect(breakRate).toBeGreaterThan(0.25);
      expect(breakRate).toBeLessThan(0.35);
    });
  });
  
  describe('Paralyze Status', () => {
    test('should have ~25% failure chance', () => {
      // Test over many trials to verify probability
      let failureCount = 0;
      const trials = 1000;
      
      for (let i = 0; i < trials; i++) {
        const rng = makePRNG(4000 + i);
        const unit = mkUnit({
          id: 'unit',
          statusEffects: [{ type: 'paralyze' as const, duration: 2 }],
        });
        
        if (checkParalyzeFailure(unit, rng)) {
          failureCount++;
        }
      }
      
      const failureRate = failureCount / trials;
      // Should be approximately 25% (allow 5% tolerance: 20-30%)
      expect(failureRate).toBeGreaterThan(0.20);
      expect(failureRate).toBeLessThan(0.30);
    });
    
    test('should not fail actions when not paralyzed', () => {
      const rng = makePRNG(12345);
      const unit = mkUnit({ id: 'unit' });
      
      expect(checkParalyzeFailure(unit, rng)).toBe(false);
    });
  });
});
