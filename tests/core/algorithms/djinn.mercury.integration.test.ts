import { describe, expect, test } from 'vitest';
import { applyStatusToUnit, processStatusEffectTick } from '../../../src/core/algorithms/status';
import { createTeam } from '../../../src/core/models/Team';
import type { Unit } from '../../../src/core/models/Unit';
import { createUnit } from '../../../src/core/models/Unit';
import { UNIT_DEFINITIONS } from '../../../src/data/definitions/units';
import { FIZZ_HEALING_WAVE } from '../../../src/data/definitions/djinnAbilities';
import { makePRNG } from '../../../src/core/random/prng';
import { performAction } from '../../../src/core/services/BattleService';
import { createBattleState } from '../../../src/core/models/BattleState';
import { collectDjinn, equipDjinn } from '../../../src/core/services/DjinnService';
import { getDjinnGrantedAbilitiesForUnit } from '@/core/algorithms/djinnAbilities';

describe('Mercury Djinn Phase 2 Integration', () => {
  test('Healing Wave heals, cleanses negatives, and grants temporary immunity via executeAbility', () => {
    const caster = createUnit(UNIT_DEFINITIONS.mystic, 1);
    expect(caster.id).toBe('mystic');
    const rawAllyA = createUnit(UNIT_DEFINITIONS.adept, 1);
    const rawAllyB = createUnit(UNIT_DEFINITIONS.ranger, 1);
    const filler = createUnit(UNIT_DEFINITIONS['war-mage'], 1);

    const allyA: Unit = {
      ...rawAllyA,
      currentHp: Math.max(1, rawAllyA.currentHp - 30),
      statusEffects: [
        { type: 'burn', duration: 3 },
        { type: 'poison', duration: 3 },
        { type: 'buff', stat: 'def', modifier: 0.2, duration: 3 },
      ],
    };

    const allyB: Unit = {
      ...rawAllyB,
      currentHp: Math.max(1, rawAllyB.currentHp - 5),
      statusEffects: [
        { type: 'freeze', duration: 2 },
        { type: 'debuff', stat: 'atk', modifier: -0.3, duration: 3 },
        { type: 'healOverTime', healPerTurn: 8, duration: 3 },
      ],
    };

    let team = createTeam([caster, allyA, allyB, filler]);
    const collected = collectDjinn(team, 'fizz');
    expect(collected.ok).toBe(true);
    team = collected.value;
    const equipped = equipDjinn(team, 'fizz');
    expect(equipped.ok).toBe(true);
    team = equipped.value;
    const granted = getDjinnGrantedAbilitiesForUnit(caster, team);
    expect(granted).toContain(FIZZ_HEALING_WAVE.id);
    const enemies = [createUnit(UNIT_DEFINITIONS.sentinel, 1)];
    const battleState = createBattleState(team, enemies);
    const casterInBattle = battleState.playerTeam.units.find(u => u.id === caster.id);
    expect(casterInBattle).toBeDefined();
    expect(casterInBattle?.abilities.some(ability => ability.id === FIZZ_HEALING_WAVE.id)).toBe(true);
    const rng = makePRNG(42);

    // Execute ability through performAction (which calls executeAbility internally)
    const { result } = performAction(
      battleState,
      caster.id,
      FIZZ_HEALING_WAVE.id,
      [allyA.id, allyB.id],
      rng
    );

    // Find updated units
    const updatedAllyA = result.updatedUnits.find(u => u.id === allyA.id);
    const updatedAllyB = result.updatedUnits.find(u => u.id === allyB.id);

    expect(updatedAllyA).toBeDefined();
    expect(updatedAllyB).toBeDefined();

    if (!updatedAllyA || !updatedAllyB) return;

    // Verify healing occurred
    expect(updatedAllyA.currentHp).toBeGreaterThan(allyA.currentHp);
    expect(updatedAllyB.currentHp).toBeGreaterThan(allyB.currentHp);

    // Verify negative statuses were cleansed (Phase 2: removeStatusEffects)
    expect(updatedAllyA.statusEffects.some(status => status.type === 'burn')).toBe(false);
    expect(updatedAllyA.statusEffects.some(status => status.type === 'poison')).toBe(false);
    expect(updatedAllyB.statusEffects.some(status => status.type === 'freeze')).toBe(false);
    expect(updatedAllyB.statusEffects.some(status => status.type === 'debuff')).toBe(false);

    // Verify positive statuses were preserved
    expect(updatedAllyA.statusEffects.some(status => status.type === 'buff')).toBe(true);
    expect(updatedAllyB.statusEffects.some(status => status.type === 'healOverTime')).toBe(true);

    // Verify immunity was granted (Phase 2: grantImmunity)
    const immunityA = updatedAllyA.statusEffects.find(status => status.type === 'immunity');
    expect(immunityA).toBeDefined();
    if (immunityA && immunityA.type === 'immunity') {
      expect(immunityA.all).toBe(false);
      expect(immunityA.types).toEqual(['burn', 'poison']);
      expect(immunityA.duration).toBe(1);
    }

    // Verify immunity blocks burn/poison
    const blockedBurn = applyStatusToUnit(updatedAllyA, { type: 'burn', duration: 2 });
    expect(blockedBurn.statusEffects.filter(status => status.type === 'burn')).toHaveLength(0);

    // Verify immunity expires after duration
    let ticking = updatedAllyA;
    ticking = processStatusEffectTick(ticking, makePRNG(7)).updatedUnit;
    expect(ticking.statusEffects.some(status => status.type === 'immunity')).toBe(false);

    // Verify status can be applied after immunity expires
    const appliedAfterExpiration = applyStatusToUnit(ticking, { type: 'burn', duration: 2 });
    expect(appliedAfterExpiration.statusEffects.filter(status => status.type === 'burn')).toHaveLength(1);
  });
});
