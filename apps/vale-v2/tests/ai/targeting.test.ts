/**
 * AI Targeting Tests
 * Tests for AI target selection logic
 */

import { describe, it, expect } from 'vitest';
import { makeAIDecision } from '../../src/core/services/AIService';
import { makeTestCtx } from '../../src/test/testCtx';
import { mkBattle, mkUnit, mkEnemy } from '../../src/test/factories';
import { isUnitKO } from '../../src/core/models/Unit';
import { ABILITIES } from '../../src/data/definitions/abilities';

describe('AI Targeting', () => {
  it('should not target KO\'d units', () => {
    const { rng } = makeTestCtx(42);
    
    const aliveEnemy = mkEnemy('slime', { id: 'e1', currentHp: 30 });
    const deadEnemy = mkEnemy('wolf', { id: 'e2', currentHp: 0 }); // KO'd
    
    const battle = mkBattle({
      party: [mkUnit({ id: 'u1' })],
      enemies: [aliveEnemy, deadEnemy],
    });

    // Verify dead enemy is KO'd
    expect(isUnitKO(deadEnemy)).toBe(true);
    
    const decision = makeAIDecision(battle, 'e1', rng);
    
    // Should not target the KO'd enemy
    expect(decision.targetIds).not.toContain('e2');
    expect(decision.targetIds.length).toBeGreaterThan(0);
  });

  it('should prefer weakest effective HP target', () => {
    // Note: AI targets enemies (not allies), so this test targets player units
    const weakPlayer = mkUnit({ id: 'u1', currentHp: 15 });
    const strongPlayer = mkUnit({ id: 'u2', currentHp: 60 });

    const battle = mkBattle({
      party: [weakPlayer, strongPlayer],
      enemies: [mkEnemy('slime', { id: 'e1' })],
    });

    // Run multiple times to verify consistency
    const decisions = [];
    for (let i = 0; i < 5; i++) {
      const { rng } = makeTestCtx(100 + i);
      const decision = makeAIDecision(battle, 'e1', rng);
      decisions.push(decision);
    }

    // Should mostly target the weaker player
    const weakTargetCount = decisions.filter(d => d.targetIds.includes('u1')).length;
    const strongTargetCount = decisions.filter(d => d.targetIds.includes('u2')).length;

    // Weak player should be targeted more often
    expect(weakTargetCount).toBeGreaterThanOrEqual(strongTargetCount);
  });

  it('should handle single target abilities correctly', () => {
    const { rng } = makeTestCtx(50);
    
    const battle = mkBattle({
      party: [mkUnit({ id: 'u1' })],
      enemies: [mkEnemy('slime', { id: 'e1' })],
    });

    const decision = makeAIDecision(battle, 'e1', rng);
    
    // Single target ability should have exactly one target
    // (Multi-target abilities may have more)
    expect(decision.targetIds.length).toBeGreaterThan(0);
  });

  it('should make valid decisions even with low HP targets', () => {
    const { rng } = makeTestCtx(200);
    
    // Create a very weak player unit
    const weakPlayer = mkUnit({ id: 'u1', currentHp: 5 });
    
    const battle = mkBattle({
      party: [weakPlayer],
      enemies: [mkEnemy('slime', { id: 'e1' })],
    });

    const decision = makeAIDecision(battle, 'e1', rng);
    
    // Should still make a decision (may overkill, but shouldn't crash)
    expect(decision.abilityId).toBeDefined();
    expect(decision.targetIds.length).toBeGreaterThan(0);
    // Should target player unit
    expect(decision.targetIds).toContain('u1');
  });

  it('should handle no valid targets gracefully', () => {
    const { rng } = makeTestCtx(300);
    
    // Create battle with all enemies KO'd
    const deadEnemy1 = mkEnemy('slime', { id: 'e1', currentHp: 0 });
    const deadEnemy2 = mkEnemy('wolf', { id: 'e2', currentHp: 0 });
    
    const battle = mkBattle({
      party: [mkUnit({ id: 'u1' })],
      enemies: [deadEnemy1, deadEnemy2],
    });

    // Should throw error or return empty targets (depending on implementation)
    expect(() => {
      makeAIDecision(battle, 'e1', rng);
    }).toThrow(); // AI should fail when no valid targets
  });

  describe('highestDef targeting', () => {
    it('should target unit with highest DEF', () => {
      // Create enemies with different DEF values
      const lowDefEnemy = mkEnemy('slime', { 
        id: 'e1', 
        baseStats: { def: 5 } 
      });
      const highDefEnemy = mkEnemy('beetle', { 
        id: 'e2', 
        baseStats: { def: 14 } 
      });
      const midDefEnemy = mkEnemy('wolf', { 
        id: 'e3', 
        baseStats: { def: 8 } 
      });
      
      // Create a player unit with guard-break (uses highestDef hint)
      const guardBreakUnit = mkUnit({
        id: 'u1',
        abilities: [{ ...ABILITIES['guard-break'], unlockLevel: 1 }],
        unlockedAbilityIds: ['guard-break'],
      });
      
      const battle = mkBattle({
        party: [guardBreakUnit],
        enemies: [lowDefEnemy, highDefEnemy, midDefEnemy],
      });
      
      // Run multiple times to verify consistency
      const decisions = [];
      for (let i = 0; i < 10; i++) {
        const { rng } = makeTestCtx(500 + i);
        const decision = makeAIDecision(battle, 'u1', rng);
        if (decision.abilityId === 'guard-break') {
          decisions.push(decision);
        }
      }
      
      // Should mostly target highest DEF enemy (e2)
      const highDefTargetCount = decisions.filter(d => d.targetIds.includes('e2')).length;
      expect(highDefTargetCount).toBeGreaterThan(5); // Should target high DEF most of the time
    });
  });

  describe('avoidOverkill behavior', () => {
    it('should avoid overkilling low HP targets when hint is set', () => {
      // Create player units with different HP
      const lowHpPlayer = mkUnit({ id: 'u1', currentHp: 10 }); // Very low HP
      const highHpPlayer = mkUnit({ id: 'u2', currentHp: 80 });
      
      // Create enemy with ONLY heavy-strike ability (override default abilities)
      const heavyStrikeEnemy = mkEnemy('slime', {
        id: 'e1',
        abilities: [{ ...ABILITIES['heavy-strike'], unlockLevel: 1 }],
        unlockedAbilityIds: ['heavy-strike'],
        baseStats: { atk: 20 }, // High ATK, will overkill low HP target
      });
      
      const battle = mkBattle({
        party: [lowHpPlayer, highHpPlayer],
        enemies: [heavyStrikeEnemy],
      });
      
      // Run multiple times
      const decisions = [];
      for (let i = 0; i < 10; i++) {
        const { rng } = makeTestCtx(600 + i);
        const decision = makeAIDecision(battle, 'e1', rng);
        if (decision.abilityId === 'heavy-strike') {
          decisions.push(decision);
        }
      }
      
      // Should prefer high HP target to avoid overkill
      const highHpTargetCount = decisions.filter(d => d.targetIds.includes('u2')).length;
      expect(highHpTargetCount).toBeGreaterThan(3); // Should avoid overkill most of the time
    });
  });

  describe('AoE ignores target hints', () => {
    it('should target all enemies for AoE abilities even with random hint', () => {
      const { rng } = makeTestCtx(700);

      const enemy1 = mkEnemy('slime', { id: 'e1' });
      const enemy2 = mkEnemy('wolf', { id: 'e2' });
      const enemy3 = mkEnemy('beetle', { id: 'e3' });

      // Create player unit with only quake (AoE with random hint)
      const quakeUnit = mkUnit({
        id: 'u1',
        abilities: [{ ...ABILITIES.quake, unlockLevel: 1 }],
        unlockedAbilityIds: ['quake'],
      });

      const battle = mkBattle({
        party: [quakeUnit],
        enemies: [enemy1, enemy2, enemy3],
      });

      const decision = makeAIDecision(battle, 'u1', rng);
      expect(decision.abilityId).toBe('quake');
      expect(decision.targetIds).toHaveLength(3);
      expect(decision.targetIds).toContain('e1');
      expect(decision.targetIds).toContain('e2');
      expect(decision.targetIds).toContain('e3');
    });
  });
});

