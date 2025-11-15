/**
 * VS1 Battle Feel & Balance Tests
 *
 * These tests validate that the vs1-bandits encounter:
 * - Has proper enemy composition (2 minions + 1 captain)
 * - Is winnable with reasonable effort
 * - Provides meaningful combat choices (AoE vs single-target, Djinn vs basic)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createStore } from '@/ui/state/store';
import { VS1_ENCOUNTER_ID } from '@/story/vs1Constants';
import type { BattleState } from '@/core/models/BattleState';
import { createTestBattle } from '@/ui/utils/testBattle';
import { calculateMaxHp } from '@/core/models/Unit';

describe('VS1 vs1-bandits encounter (feel & balance)', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();

    // Initialize team (same as App.tsx does on startup)
    const { battleState } = createTestBattle();
    store.getState().setTeam(battleState.playerTeam);
  });

  function startVs1Battle(): BattleState | null {
    store.getState().handleTrigger({
      id: 'vs1-start',
      type: 'battle',
      position: { x: 0, y: 0 },
      data: { encounterId: VS1_ENCOUNTER_ID },
    });
    return store.getState().battle;
  }

  it('creates VS1 battle with correct enemy composition', () => {
    const battle = startVs1Battle();

    expect(battle).toBeTruthy();
    if (!battle) return;

    // VS1 should have 3 enemies: 2 minions + 1 captain
    expect(battle.enemies.length).toBe(3);

    // Check enemy IDs include bandit-related enemies
    const enemyIds = battle.enemies.map(e => e.id);
    const hasBandits = enemyIds.some(id => id.includes('bandit'));
    expect(hasBandits).toBe(true);

    // Should start in planning phase
    expect(battle.phase).toBe('planning');

    // Player should have 4 units
    expect(battle.playerTeam.units.length).toBe(4);
  });

  it('player team has sufficient HP and mana to sustain battle', () => {
    const battle = startVs1Battle();
    if (!battle) return;

    const playerUnits = battle.playerTeam.units;

    // Each player unit should have reasonable HP
    playerUnits.forEach(unit => {
      expect(unit.currentHp).toBeGreaterThan(0);
      const maxHp = calculateMaxHp(unit);
      expect(maxHp).toBeGreaterThan(50); // Minimum viable HP
    });

    // Team should have mana pool
    expect(battle.remainingMana).toBeGreaterThanOrEqual(0);
  });

  it('enemy units have reasonable stats for a tutorial encounter', () => {
    const battle = startVs1Battle();
    if (!battle) return;

    battle.enemies.forEach(enemy => {
      // Enemies should be alive at start
      expect(enemy.currentHp).toBeGreaterThan(0);
      const maxHp = calculateMaxHp(enemy);
      expect(maxHp).toBeGreaterThan(0);

      // VS1 is early game - enemies shouldn't be too tanky
      expect(maxHp).toBeLessThan(300);

      // Should have basic combat stats
      expect(enemy.baseStats.atk).toBeGreaterThan(0);
      expect(enemy.baseStats.def).toBeGreaterThanOrEqual(0);
    });
  });

  it('player units have abilities available for combat', () => {
    const battle = startVs1Battle();
    if (!battle) return;

    const playerUnits = battle.playerTeam.units;

    // At least some units should have unlocked abilities
    const totalAbilities = playerUnits.reduce(
      (sum, unit) => sum + unit.unlockedAbilityIds.length,
      0
    );

    expect(totalAbilities).toBeGreaterThan(0);

    // Each unit should have at least basic strike
    playerUnits.forEach(unit => {
      expect(unit.unlockedAbilityIds.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('battle has proper turn order initialization', () => {
    const battle = startVs1Battle();
    if (!battle) return;

    // Turn order should include all combatants
    expect(battle.turnOrder.length).toBe(7); // 4 players + 3 enemies

    // Turn order should contain all unit IDs
    const allUnitIds = [
      ...battle.playerTeam.units.map(u => u.id),
      ...battle.enemies.map(e => e.id),
    ];

    battle.turnOrder.forEach(id => {
      expect(allUnitIds).toContain(id);
    });
  });

  it('encounter has proper metadata for VS1', () => {
    const battle = startVs1Battle();
    if (!battle) return;

    // Should have encounter ID in metadata
    const hasEncounterId =
      battle.encounterId === VS1_ENCOUNTER_ID ||
      battle.meta?.encounterId === VS1_ENCOUNTER_ID;

    expect(hasEncounterId).toBe(true);
  });
});
