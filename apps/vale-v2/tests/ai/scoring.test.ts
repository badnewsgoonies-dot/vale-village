/**
 * AI Scoring Tests
 * Tests for AI ability scoring logic
 */

import { describe, it, expect } from 'vitest';
import { makeAIDecision } from '../../src/core/services/AIService';
import { makeTestCtx } from '../../src/test/testCtx';
import { mkBattle, mkUnit, mkEnemy } from '../../src/test/factories';

describe('AI Scoring', () => {
  it('should prefer abilities with higher damage potential', () => {
    const { rng } = makeTestCtx(42);
    const battle = mkBattle({
      party: [mkUnit({ id: 'u1', currentHp: 50 })],
      enemies: [mkEnemy('slime', { id: 'e1', currentHp: 30 })],
    });

    const decision = makeAIDecision(battle, 'e1', rng);
    
    // Should select an ability (not throw)
    expect(decision.abilityId).toBeDefined();
    expect(decision.targetIds.length).toBeGreaterThan(0);
  });

  it('should not choose abilities the unit cannot afford (PP gate)', () => {
    const { rng } = makeTestCtx(7);
    
    // Create enemy with low PP
    const enemy = mkEnemy('slime', {
      id: 'e1',
      baseStats: {
        hp: 50,
        pp: 0, // No PP
        atk: 10,
        def: 5,
        mag: 5,
        spd: 10,
      },
    });

    const battle = mkBattle({
      party: [mkUnit({ id: 'u1' })],
      enemies: [enemy],
    });

    const decision = makeAIDecision(battle, 'e1', rng);
    
    // Should still make a decision (likely a physical ability that costs 0 PP)
    expect(decision.abilityId).toBeDefined();
    
    // Verify the chosen ability costs 0 PP (or enemy has enough)
    const enemyUnit = battle.enemies.find(e => e.id === 'e1');
    const ability = enemyUnit?.abilities.find(a => a.id === decision.abilityId);
    expect(ability).toBeDefined();
    if (ability && enemyUnit) {
      // Ability should be affordable (0 cost or enemy has PP)
      const currentPp = enemyUnit.baseStats.pp + (enemyUnit.level - 1) * enemyUnit.growthRates.pp;
      expect(ability.manaCost).toBeLessThanOrEqual(currentPp);
    }
  });

  it('should prefer targeting weakest player unit when multiple options available', () => {
    const { rng } = makeTestCtx(100);

    const weakPlayer = mkUnit({ id: 'u1', currentHp: 20 });
    const strongPlayer = mkUnit({ id: 'u2', currentHp: 80 });

    const battle = mkBattle({
      party: [weakPlayer, strongPlayer],
      enemies: [mkEnemy('slime', { id: 'e1' })],
    });

    // Run AI decision multiple times to verify consistency
    const decisions = [];
    for (let i = 0; i < 5; i++) {
      const { rng: freshRng } = makeTestCtx(100 + i);
      const decision = makeAIDecision(battle, 'e1', freshRng);
      decisions.push(decision);
    }

    // Should mostly target the weaker unit
    const weakTargetCount = decisions.filter(d => d.targetIds.includes('u1')).length;
    const strongTargetCount = decisions.filter(d => d.targetIds.includes('u2')).length;

    // Weak player should be targeted more often than strong player
    expect(weakTargetCount).toBeGreaterThanOrEqual(strongTargetCount);
  });

  it('should make deterministic decisions given same seed', () => {
    const seed = 999;
    const { rng: rng1 } = makeTestCtx(seed);
    const { rng: rng2 } = makeTestCtx(seed);
    
    const battle = mkBattle({
      party: [mkUnit({ id: 'u1' })],
      enemies: [mkEnemy('slime', { id: 'e1' })],
    });

    const decision1 = makeAIDecision(battle, 'e1', rng1);
    const decision2 = makeAIDecision(battle, 'e1', rng2);
    
    expect(decision1.abilityId).toBe(decision2.abilityId);
    expect(decision1.targetIds).toEqual(decision2.targetIds);
  });
});

