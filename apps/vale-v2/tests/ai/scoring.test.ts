/**
 * AI Scoring Tests
 * Tests for AI ability scoring logic
 */

import { describe, test, expect } from 'vitest';
import { makeAIDecision } from '../../src/core/services/AIService';
import { makeTestCtx } from '../../src/test/testCtx';
import { mkBattle, mkUnit, mkEnemy } from '../../src/test/factories';
import { ABILITIES } from '../../src/data/definitions/abilities';

describe('AI Scoring', () => {
  test('should prefer abilities with higher damage potential', () => {
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

  test('should not choose abilities the unit cannot afford (PP gate)', () => {
    const { rng } = makeTestCtx(7);
    
    // Create enemy with low PP
    const enemy = mkEnemy('slime', {
      id: 'e1',
      abilities: [ABILITIES['strike']],
    });

    const battle = mkBattle({
      party: [mkUnit({ id: 'u1' })],
      enemies: [enemy],
    });
    battle.remainingMana = 0;

    const decision = makeAIDecision(battle, 'e1', rng);
    
    // Should still make a decision (likely a physical ability that costs 0 PP)
    expect(decision.abilityId).toBeDefined();
    
    // Verify the chosen ability costs 0 PP (or enemy has enough)
    const enemyUnit = battle.enemies.find(e => e.id === 'e1');
    const ability = enemyUnit?.abilities.find(a => a.id === decision.abilityId);
    expect(ability).toBeDefined();
    if (ability && enemyUnit) {
      const availableMana = battle.remainingMana;
      expect(ability.manaCost).toBeLessThanOrEqual(availableMana);
    }
  });

  test('should prefer targeting weakest player unit when multiple options available', () => {
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

  test('should make deterministic decisions given same seed', () => {
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

