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

    // Grant only first 2 abilities per Djinn (1 from primary compatibility, 1 from secondary if available)
    let abilitiesToGrant: string[] = [];
    
    switch (compatibility) {
      case 'same':
        abilitiesToGrant = abilityGroup.same.slice(0, 2);
        break;
      case 'counter':
        abilitiesToGrant = abilityGroup.counter.slice(0, 2);
        break;
      case 'neutral':
        abilitiesToGrant = abilityGroup.neutral.slice(0, 2);
        break;
    }
    
    granted.push(...abilitiesToGrant);
  }

  return [...new Set(granted)];
}

export function mergeDjinnAbilitiesIntoUnit(unit: Unit, team: Team): Unit {
  const abilityIds = getDjinnGrantedAbilitiesForUnit(unit, team);
  const existingIds = new Set(unit.abilities.map((ability) => ability.id));
  const baseAbilities = unit.abilities.filter(
    ability => !DJINN_ABILITIES[ability.id] || abilityIds.includes(ability.id)
  );
  const baseUnlocked = unit.unlockedAbilityIds.filter(
    id => !DJINN_ABILITIES[id] || abilityIds.includes(id)
  );

  const djinnAbilities = abilityIds
    .map((id) => DJINN_ABILITIES[id])
    .filter((ability): ability is typeof DJINN_ABILITIES[string] => ability !== undefined)
    .filter((ability) => !existingIds.has(ability.id));

  const mergedAbilities = [...baseAbilities, ...djinnAbilities];
  const mergedUnlocked = Array.from(new Set([...baseUnlocked, ...abilityIds]));

  return {
    ...unit,
    abilities: mergedAbilities,
    unlockedAbilityIds: mergedUnlocked,
  };
}

export interface DjinnAbilityMetadata {
  abilityId: string;
  djinnId: string;
  compatibility: ElementCompatibility;
}

export function getDjinnAbilityMetadataForUnit(
  unit: Unit,
  team: Team,
  djinnIds?: readonly string[]
): DjinnAbilityMetadata[] {
  const targetDjinn = djinnIds ?? team.equippedDjinn;
  const seen = new Set<string>();
  const metadata: DjinnAbilityMetadata[] = [];

  for (const djinnId of targetDjinn) {
    const djinn = DJINN[djinnId];
    if (!djinn) continue;

    const abilityGroup = djinn.grantedAbilities[unit.id];
    if (!abilityGroup) continue;

    const compatibility = getElementCompatibility(unit.element, djinn.element);
    const abilityList =
      compatibility === 'same'
        ? abilityGroup.same
        : compatibility === 'counter'
          ? abilityGroup.counter
          : abilityGroup.neutral;

    for (const abilityId of abilityList) {
      if (seen.has(abilityId)) continue;
      seen.add(abilityId);
      metadata.push({
        abilityId,
        djinnId,
        compatibility,
      });
    }
  }

  return metadata;
}

export function getLockedDjinnAbilityMetadataForUnit(unit: Unit, team: Team): DjinnAbilityMetadata[] {
  const lockedDjinnIds = team.equippedDjinn.filter((djinnId) => {
    const tracker = team.djinnTrackers[djinnId];
    return tracker?.state !== 'Set';
  });

  if (lockedDjinnIds.length === 0) {
    return [];
  }

  const lockedSet = new Set(lockedDjinnIds);
  return getDjinnAbilityMetadataForUnit(unit, team).filter((meta) => lockedSet.has(meta.djinnId));
}
