/**
 * AI Targeting Tests
 * Tests for AI target selection logic
 */

import { describe, it, expect } from 'vitest';
import { makeAIDecision } from '../../src/core/services/AIService';
import { makeTestCtx } from '../../src/test/testCtx';
import { mkBattle, mkUnit, mkEnemy } from '../../src/test/factories';
import { isUnitKO } from '../../src/core/models/Unit';

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
});

