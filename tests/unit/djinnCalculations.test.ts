import { describe, it, expect } from 'vitest';
import { Unit } from '@/types/Unit';
import { UNIT_DEFINITIONS } from '@/data/unitDefinitions';
import { FLINT, GRANITE, FORGE } from '@/data/djinn';
import { calculateDjinnStatBonuses, getDjinnGrantedAbilities, DJINN_BONUS_VALUES } from '@/utils/djinnCalculations';

describe('djinnCalculations', () => {
  it('gives matching bonuses and matching ability for same-element unit', () => {
    const isaac = new Unit(UNIT_DEFINITIONS.isaac);
    const bonuses = calculateDjinnStatBonuses(isaac, [FLINT]);
    const abilities = getDjinnGrantedAbilities(isaac, [FLINT]);

    expect(bonuses).toEqual({ atk: DJINN_BONUS_VALUES.matching.atk, def: DJINN_BONUS_VALUES.matching.def });
    expect(abilities).toEqual([FLINT.grantsAbilities.matching]);
  });

  it('gives counter bonuses and counter ability for counter-element unit', () => {
    const garet = new Unit(UNIT_DEFINITIONS.garet);
    const bonuses = calculateDjinnStatBonuses(garet, [FLINT]);
    const abilities = getDjinnGrantedAbilities(garet, [FLINT]);

    expect(bonuses).toEqual({ atk: DJINN_BONUS_VALUES.counter.atk, def: DJINN_BONUS_VALUES.counter.def });
    expect(abilities).toEqual([FLINT.grantsAbilities.counter]);
  });

  it('treats neutral units as neutral (no abilities) and stacks bonuses linearly', () => {
    const kraden = new Unit(UNIT_DEFINITIONS.kraden); // Neutral
    const bonuses = calculateDjinnStatBonuses(kraden, [FLINT, FORGE]);
    const abilities = getDjinnGrantedAbilities(kraden, [FLINT, FORGE]);

    expect(bonuses).toEqual({ atk: DJINN_BONUS_VALUES.neutral.atk * 2, def: DJINN_BONUS_VALUES.neutral.def * 2 });
    expect(abilities).toEqual([]);
  });

  it('stacks mixed relations correctly and aggregates abilities (deduplicated)', () => {
    const isaac = new Unit(UNIT_DEFINITIONS.isaac);
    // Two Venus djinn (matching) + one Mars djinn (counter)
    const bonuses = calculateDjinnStatBonuses(isaac, [FLINT, GRANITE, FORGE]);
    const abilities = getDjinnGrantedAbilities(isaac, [FLINT, GRANITE, FORGE]);

    const expectedAtk = DJINN_BONUS_VALUES.matching.atk * 2 + DJINN_BONUS_VALUES.counter.atk;
    const expectedDef = DJINN_BONUS_VALUES.matching.def * 2 + DJINN_BONUS_VALUES.counter.def;

    expect(bonuses).toEqual({ atk: expectedAtk, def: expectedDef });
    expect(abilities.sort()).toEqual(
      [FLINT.grantsAbilities.matching, GRANITE.grantsAbilities.matching, FORGE.grantsAbilities.counter].sort()
    );
  });
});
