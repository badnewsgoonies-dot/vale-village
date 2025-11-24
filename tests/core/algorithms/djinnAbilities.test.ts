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

describe('Element Compatibility', () => {
  test('same element resolves to same', () => {
    expect(getElementCompatibility('Venus', 'Venus')).toBe('same');
    expect(getElementCompatibility('Mars', 'Mars')).toBe('same');
  });

  test('counter pairs return counter', () => {
    expect(getElementCompatibility('Venus', 'Mars')).toBe('counter');
    expect(getElementCompatibility('Mars', 'Venus')).toBe('counter');
    expect(getElementCompatibility('Jupiter', 'Mercury')).toBe('counter');
    expect(getElementCompatibility('Mercury', 'Jupiter')).toBe('counter');
  });

  test('other combinations return neutral', () => {
    expect(getElementCompatibility('Venus', 'Jupiter')).toBe('neutral');
    expect(getElementCompatibility('Mars', 'Mercury')).toBe('neutral');
    expect(getElementCompatibility('Neutral', 'Venus')).toBe('neutral');
  });
});

describe('Per-unit Djinn Bonuses', () => {
  test('same element grants +4 ATK +3 DEF per Djinn', () => {
    const unit = createUnit(UNIT_DEFINITIONS.adept, 1);
    const team = createTeamWithDjinn(unit, ['flint']);

    const bonuses = calculateDjinnBonusesForUnit(unit, team);
    expect(bonuses.atk).toBe(4);
    expect(bonuses.def).toBe(3);
  });

  test('counter element applies penalties', () => {
    const unit = createUnit(UNIT_DEFINITIONS['war-mage'], 1);
    const team = createTeamWithDjinn(unit, ['flint']);

    const bonuses = calculateDjinnBonusesForUnit(unit, team);
    expect(bonuses.atk).toBe(-3);
    expect(bonuses.def).toBe(-2);
  });

  test('neutral element gives moderate bonuses', () => {
    const unit = createUnit(UNIT_DEFINITIONS.mystic, 1);
    const team = createTeamWithDjinn(unit, ['flint']);

    const bonuses = calculateDjinnBonusesForUnit(unit, team);
    expect(bonuses.atk).toBe(2);
    expect(bonuses.def).toBe(2);
  });

  test('multiple Djinn stack bonuses', () => {
    const unit = createUnit(UNIT_DEFINITIONS.adept, 1);
    const team = createTeamWithDjinn(unit, ['flint', 'granite']);

    const bonuses = calculateDjinnBonusesForUnit(unit, team);
    expect(bonuses.atk).toBe(8);
    expect(bonuses.def).toBe(6);
  });

  test('Standby Djinn do not contribute', () => {
    const unit = createUnit(UNIT_DEFINITIONS.adept, 1);
    const team = createTeamWithDjinn(unit, ['flint'], 'Standby');

    const bonuses = calculateDjinnBonusesForUnit(unit, team);
    expect(bonuses.atk ?? 0).toBe(0);
    expect(bonuses.def ?? 0).toBe(0);
  });
});
