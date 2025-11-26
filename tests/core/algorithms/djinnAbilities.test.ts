import { describe, expect, test } from 'vitest';
import { getElementCompatibility, calculateDjinnBonusesForUnit } from '../../../src/core/algorithms/djinnAbilities';
import { createUnit } from '../../../src/core/models/Unit';
import { createTeam, type DjinnTracker, type Team } from '../../../src/core/models/Team';
import { UNIT_DEFINITIONS } from '../../../src/data/definitions/units';

function createTeamWithDjinn(unit: ReturnType<typeof createUnit>, djinnIds: string[], state: DjinnTracker['state'] = 'Set'): Team {
  const fillerUnits = [
    createUnit(UNIT_DEFINITIONS['war-mage'], 1),
    createUnit(UNIT_DEFINITIONS.mystic, 1),
    createUnit(UNIT_DEFINITIONS.ranger, 1),
  ];

  const teamUnits = [unit, ...fillerUnits].slice(0, 4);
  const team = createTeam(teamUnits);
  team.equippedDjinn = djinnIds;
  const trackers: Record<string, DjinnTracker> = {};
  for (const id of djinnIds) {
    trackers[id] = {
      djinnId: id,
      state,
      lastActivatedTurn: 0,
    };
  }
  team.djinnTrackers = trackers;
  return team;
}

describe('Element Compatibility (Tetra System)', () => {
  test('same element resolves to same', () => {
    expect(getElementCompatibility('Venus', 'Venus')).toBe('same');
    expect(getElementCompatibility('Mars', 'Mars')).toBe('same');
    expect(getElementCompatibility('Jupiter', 'Jupiter')).toBe('same');
    expect(getElementCompatibility('Mercury', 'Mercury')).toBe('same');
  });

  test('opposing pairs return counter (Venus↔Jupiter, Mars↔Mercury)', () => {
    // Venus opposes Jupiter (Earth vs Wind)
    expect(getElementCompatibility('Venus', 'Jupiter')).toBe('counter');
    expect(getElementCompatibility('Jupiter', 'Venus')).toBe('counter');
    // Mars opposes Mercury (Fire vs Water)
    expect(getElementCompatibility('Mars', 'Mercury')).toBe('counter');
    expect(getElementCompatibility('Mercury', 'Mars')).toBe('counter');
  });

  test('adjacent elements return neutral', () => {
    // Venus-Mars, Venus-Mercury are adjacent (not opposing)
    expect(getElementCompatibility('Venus', 'Mars')).toBe('neutral');
    expect(getElementCompatibility('Venus', 'Mercury')).toBe('neutral');
    // Jupiter-Mars, Jupiter-Mercury are adjacent
    expect(getElementCompatibility('Jupiter', 'Mars')).toBe('neutral');
    expect(getElementCompatibility('Jupiter', 'Mercury')).toBe('neutral');
    // Neutral element
    expect(getElementCompatibility('Neutral', 'Venus')).toBe('neutral');
  });
});

describe('Per-unit Djinn Bonuses', () => {
  // Unit elements: adept=Venus, war-mage=Mars, mystic=Mercury, ranger=Jupiter
  // Djinn: flint=Venus, granite=Venus

  test('same element grants +4 ATK +3 DEF per Djinn (adept + flint)', () => {
    const unit = createUnit(UNIT_DEFINITIONS.adept, 1); // Venus
    const team = createTeamWithDjinn(unit, ['flint']); // Venus Djinn

    const bonuses = calculateDjinnBonusesForUnit(unit, team);
    expect(bonuses.atk).toBe(4);
    expect(bonuses.def).toBe(3);
  });

  test('counter element applies stat penalties (ranger + flint = Jupiter vs Venus)', () => {
    const unit = createUnit(UNIT_DEFINITIONS.ranger, 1); // Jupiter
    const team = createTeamWithDjinn(unit, ['flint']); // Venus Djinn - COUNTER!

    const bonuses = calculateDjinnBonusesForUnit(unit, team);
    expect(bonuses.atk).toBe(-3); // Debuff for opposing element
    expect(bonuses.def).toBe(-2);
  });

  test('neutral element gives moderate bonuses (war-mage + flint = Mars vs Venus)', () => {
    const unit = createUnit(UNIT_DEFINITIONS['war-mage'], 1); // Mars
    const team = createTeamWithDjinn(unit, ['flint']); // Venus Djinn - NEUTRAL (adjacent)

    const bonuses = calculateDjinnBonusesForUnit(unit, team);
    expect(bonuses.atk).toBe(2);
    expect(bonuses.def).toBe(2);
  });

  test('multiple same-element Djinn stack bonuses', () => {
    const unit = createUnit(UNIT_DEFINITIONS.adept, 1); // Venus
    const team = createTeamWithDjinn(unit, ['flint', 'granite']); // 2x Venus

    const bonuses = calculateDjinnBonusesForUnit(unit, team);
    expect(bonuses.atk).toBe(8); // 4 + 4
    expect(bonuses.def).toBe(6); // 3 + 3
  });

  test('Standby Djinn do not contribute stat bonuses', () => {
    const unit = createUnit(UNIT_DEFINITIONS.adept, 1);
    const team = createTeamWithDjinn(unit, ['flint'], 'Standby');

    const bonuses = calculateDjinnBonusesForUnit(unit, team);
    expect(bonuses.atk ?? 0).toBe(0);
    expect(bonuses.def ?? 0).toBe(0);
  });
});
