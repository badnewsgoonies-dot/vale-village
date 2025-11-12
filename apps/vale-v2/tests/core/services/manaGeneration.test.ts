import { describe, expect, test } from 'vitest';
import { createBattleState } from '@/core/models/BattleState';
import { createTeam } from '@/core/models/Team';
import { queueAction, executeRound } from '@/core/services/QueueBattleService';
import { makePRNG } from '@/core/random/prng';
import { mkUnit, mkEnemy } from '@/test/factories';
import { STRIKE } from '@/data/definitions/abilities';
import type { Ability } from '@/data/schemas/AbilitySchema';

const queueActionUnwrap = (
  battle: ReturnType<typeof createBattleState>,
  unitId: string,
  abilityId: string | null,
  targetIds: readonly string[],
  ability?: Ability
): ReturnType<typeof createBattleState> => {
  const result = queueAction(battle, unitId, abilityId, targetIds, ability);
  if (!result.ok) {
    throw new Error(result.error);
  }
  return result.value;
};

const queueBasicAttacksForAll = (
  battle: ReturnType<typeof createBattleState>,
  targetId: string
): ReturnType<typeof createBattleState> => {
  return battle.playerTeam.units.reduce((current, unit) => {
    return queueActionUnwrap(current, unit.id, null, [targetId]);
  }, battle);
};

describe('Mana Generation from Basic Attacks', () => {
  test('basic attack hit generates +1 mana', () => {
    const units = [
      mkUnit({ id: 'unit1', manaContribution: 2 }),
      mkUnit({ id: 'unit2', manaContribution: 2 }),
      mkUnit({ id: 'unit3' }),
      mkUnit({ id: 'unit4' }),
    ];
    const team = createTeam(units);
    const enemy = mkEnemy('slime', {
      id: 'enemy1',
      baseStats: { hp: 1_000_000, def: 0 },
      currentHp: 1_000_000,
    });
    let battle = createBattleState(team, [enemy]);
    const initialMana = battle.remainingMana;

    battle = queueBasicAttacksForAll(battle, 'enemy1');

    const result = executeRound(battle, makePRNG(42));
    const manaEvent = result.events.find(e => e.type === 'mana-generated');

    expect(manaEvent).toBeDefined();
    expect(manaEvent?.amount).toBe(1);
    expect(manaEvent?.newTotal).toBe(Math.min(initialMana + 1, battle.maxMana));
  });

  test('Ability attacks do not generate mana', () => {
    const units = [
      mkUnit({ id: 'unit1', manaContribution: 3 }),
      mkUnit({ id: 'unit2' }),
      mkUnit({ id: 'unit3' }),
      mkUnit({ id: 'unit4' }),
    ];
    const team = createTeam(units);
    const enemy = mkEnemy('slime', {
      id: 'enemy1',
      baseStats: { hp: 1_000_000, def: 0 },
      currentHp: 1_000_000,
    });
    let battle = createBattleState(team, [enemy]);

    battle = queueBasicAttacksForAll(battle, 'enemy1');
    battle = queueActionUnwrap(battle, 'unit1', STRIKE.id, ['enemy1'], STRIKE);
    const result = executeRound(battle, makePRNG(42));

    const abilityManaEvent = result.events.find(
      (e) => e.type === 'mana-generated' && e.source === 'unit1'
    );
    expect(abilityManaEvent).toBeUndefined();
  });

  test('fast basic attack generates mana before slower action', () => {
    const fast = mkUnit({ id: 'fast', baseStats: { spd: 20 }, manaContribution: 2 });
    const slow = mkUnit({ id: 'slow', baseStats: { spd: 10 }, manaContribution: 2 });
    const filler1 = mkUnit({ id: 'filler1' });
    const filler2 = mkUnit({ id: 'filler2' });
    const team = createTeam([fast, slow, filler1, filler2]);
    const enemy = mkEnemy('slime', {
      id: 'enemy1',
      baseStats: { hp: 1_000_000, def: 0 },
      currentHp: 1_000_000,
    });
    let battle = createBattleState(team, [enemy]);

    battle = queueBasicAttacksForAll(battle, 'enemy1');
    battle = queueActionUnwrap(battle, 'fast', null, ['enemy1']);

    battle = queueActionUnwrap(battle, 'slow', STRIKE.id, ['enemy1'], STRIKE);

    const result = executeRound(battle, makePRNG(42));
    const manaEventIndex = result.events.findIndex(e => e.type === 'mana-generated');
    const slowActionIndex = result.events.findIndex(
      e => e.type === 'ability' && e.casterId === 'slow'
    );

    expect(manaEventIndex).toBeGreaterThan(-1);
    expect(slowActionIndex).toBeGreaterThan(-1);
    expect(manaEventIndex).toBeLessThan(slowActionIndex);
  });
});

describe('Multiple Basic Attack Mana Generation', () => {
  test('four basic attacks generate four mana events', () => {
    const units = Array.from({ length: 4 }, (_, index) =>
      mkUnit({ id: `unit${index + 1}`, manaContribution: 2 })
    );
    const team = createTeam(units);
    const enemy = mkEnemy('slime', {
      id: 'enemy1',
      baseStats: { hp: 1_000_000, def: 0 },
      currentHp: 1_000_000,
    });
    let battle = createBattleState(team, [enemy]);

    battle = queueBasicAttacksForAll(battle, 'enemy1');

    const result = executeRound(battle, makePRNG(42));
    const manaEvents = result.events.filter(e => e.type === 'mana-generated');

    expect(manaEvents).toHaveLength(4);
    const totalGenerated = manaEvents.reduce((sum, event) => sum + event.amount, 0);
    expect(totalGenerated).toBe(4);
    manaEvents.forEach(event => {
      expect(event.newTotal).toBeLessThanOrEqual(result.state.maxMana);
    });
  });
});
