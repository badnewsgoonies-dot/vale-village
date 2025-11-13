import type { Team } from '../models/Team';
import type { Unit } from '../models/Unit';
import type { Stats, Element } from '../models/types';
import { getSetDjinnIds } from './djinn';
import { DJINN } from '../../data/definitions/djinn';
import { DJINN_ABILITIES } from '../../data/definitions/djinnAbilities';

export type ElementCompatibility = 'same' | 'counter' | 'neutral';

const COUNTER_PAIRS: Record<Element, Element> = {
  Venus: 'Mars',
  Mars: 'Venus',
  Jupiter: 'Mercury',
  Mercury: 'Jupiter',
  Neutral: 'Neutral',
};

export function getElementCompatibility(
  unitElement: Element,
  djinnElement: Element
): ElementCompatibility {
  if (unitElement === djinnElement) {
    return 'same';
  }

  if (COUNTER_PAIRS[unitElement] === djinnElement) {
    return 'counter';
  }

  return 'neutral';
}

export function calculateDjinnBonusesForUnit(unit: Unit, team: Team): Partial<Stats> {
  const setDjinnIds = getSetDjinnIds(team);
  const totals: Partial<Stats> = {};

  for (const djinnId of setDjinnIds) {
    const djinnElement = getDjinnElementFromId(djinnId);
    if (!djinnElement) {
      continue;
    }

    const compatibility = getElementCompatibility(unit.element, djinnElement);
    const addStat = (key: keyof Stats, value: number) => {
      totals[key] = (totals[key] || 0) + value;
    };

    switch (compatibility) {
      case 'same':
        addStat('atk', 4);
        addStat('def', 3);
        break;
      case 'counter':
        addStat('atk', -3);
        addStat('def', -2);
        break;
      case 'neutral':
        addStat('atk', 2);
        addStat('def', 2);
        break;
    }
  }

  return totals;
}

function getDjinnElementFromId(djinnId: string): Element | null {
  return DJINN[djinnId]?.element ?? null;
}

export function getDjinnGrantedAbilitiesForUnit(unit: Unit, team: Team): string[] {
  const setDjinnIds = getSetDjinnIds(team);
  const granted: string[] = [];

  for (const djinnId of setDjinnIds) {
    const djinn = DJINN[djinnId];
    if (!djinn) continue;

    const compatibility = getElementCompatibility(unit.element, djinn.element);
    const abilityGroup = djinn.grantedAbilities[unit.id];
    if (!abilityGroup) continue;

    switch (compatibility) {
      case 'same':
        granted.push(...abilityGroup.same);
        break;
      case 'counter':
        granted.push(...abilityGroup.counter);
        break;
      case 'neutral':
        granted.push(...abilityGroup.neutral);
        break;
    }
  }

  return [...new Set(granted)];
}

export function mergeDjinnAbilitiesIntoUnit(unit: Unit, team: Team): Unit {
  const abilityIds = getDjinnGrantedAbilitiesForUnit(unit, team);
  const existingIds = new Set(unit.abilities.map((ability) => ability.id));
  const baseAbilities = unit.abilities.filter((ability) => !DJINN_ABILITIES[ability.id]);
  const baseUnlocked = unit.unlockedAbilityIds.filter((id) => !DJINN_ABILITIES[id]);

  const djinnAbilities = abilityIds
    .map((id) => DJINN_ABILITIES[id])
    .filter(
      (ability): ability is typeof DJINN_ABILITIES[string] =>
        Boolean(ability) && !existingIds.has(ability.id)
    );

  const mergedAbilities = [...baseAbilities, ...djinnAbilities];
  const mergedUnlocked = Array.from(new Set([...baseUnlocked, ...abilityIds]));

  return {
    ...unit,
    abilities: mergedAbilities,
    unlockedAbilityIds: mergedUnlocked,
  };
}
