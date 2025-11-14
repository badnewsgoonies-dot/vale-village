import { describe, expect, test } from 'vitest';
import { applyHealing, calculateHealAmount } from '../../../src/core/algorithms/damage';
import { applyStatusToUnit, isNegativeStatus, processStatusEffectTick } from '../../../src/core/algorithms/status';
import { createTeam } from '../../../src/core/models/Team';
import type { Unit } from '../../../src/core/models/Unit';
import { createUnit, calculateMaxHp } from '../../../src/core/models/Unit';
import { UNIT_DEFINITIONS } from '../../../src/data/definitions/units';
import { FIZZ_HEALING_WAVE } from '../../../src/data/definitions/djinnAbilities';
import { makePRNG } from '../../../src/core/random/prng';

describe('Mercury Djinn Phase 2 Integration', () => {
  test('Healing Wave heals, cleanses negatives, and grants temporary immunity', () => {
    const caster = createUnit(UNIT_DEFINITIONS.mystic, 1);
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

    const team = createTeam([caster, allyA, allyB, filler]);
    const healAmount = calculateHealAmount(caster, team, FIZZ_HEALING_WAVE);

    const healedA = applyHealing(allyA, healAmount);
    const healedB = applyHealing(allyB, healAmount);

    const maxHpA = calculateMaxHp(healedA);
    const maxHpB = calculateMaxHp(healedB);

    expect(healAmount).toBeGreaterThan(0);
    expect(healedA.currentHp - allyA.currentHp).toBe(healAmount);
    expect(healedB.currentHp).toBe(maxHpB);

    const cleanseNegativeStatuses = (unit: Unit) => ({
      ...unit,
      statusEffects: unit.statusEffects.filter(status => !isNegativeStatus(status)),
    });

    const cleansedA = cleanseNegativeStatuses(healedA);
    const cleansedB = cleanseNegativeStatuses(healedB);

    const immunityStatus = {
      type: 'immunity',
      all: false,
      types: ['burn', 'poison'] as const,
      duration: 1,
    };

    const withImmunityA = applyStatusToUnit(cleansedA, immunityStatus);
    const withImmunityB = applyStatusToUnit(cleansedB, immunityStatus);

    expect(withImmunityA.statusEffects.some(status => status.type === 'buff')).toBe(true);
    expect(withImmunityB.statusEffects.some(status => status.type === 'healOverTime')).toBe(true);
    expect(withImmunityA.statusEffects.some(status =>
      ['burn', 'poison', 'freeze', 'debuff'].includes(status.type)
    )).toBe(false);

    const immunity = withImmunityA.statusEffects.find(status => status.type === 'immunity');
    expect(immunity).toMatchObject({ all: false, types: ['burn', 'poison'], duration: 1 });

    const blocked = applyStatusToUnit(withImmunityA, { type: 'burn', duration: 2 });
    expect(blocked.statusEffects.filter(status => status.type === 'burn')).toHaveLength(0);

    const { updatedUnit: afterTick } = processStatusEffectTick(withImmunityA, makePRNG(42));
    expect(afterTick.statusEffects.some(status => status.type === 'immunity')).toBe(false);

    const appliedAfterExpiration = applyStatusToUnit(afterTick, { type: 'burn', duration: 2 });
    expect(appliedAfterExpiration.statusEffects.filter(status => status.type === 'burn')).toHaveLength(1);

    const reCleaned = {
      ...appliedAfterExpiration,
      statusEffects: appliedAfterExpiration.statusEffects.filter(status => !isNegativeStatus(status)),
    };
    const reImmunized = applyStatusToUnit(reCleaned, immunityStatus);
    expect(reImmunized.statusEffects.some(status => status.type === 'buff')).toBe(true);
    expect(reImmunized.statusEffects.filter(status => status.type === 'burn')).toHaveLength(0);
    expect(reImmunized.statusEffects.some(status => status.type === 'immunity')).toBe(true);
  });
});
