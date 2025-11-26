import type { Team } from '../models/Team';
import type { Unit } from '../models/Unit';
import type { Stats, Element } from '../models/types';
import { getSetDjinnIds } from './djinn';
import { DJINN } from '../../data/definitions/djinn';
import { DJINN_ABILITIES } from '../../data/definitions/djinnAbilities';

export type ElementCompatibility = 'same' | 'counter' | 'neutral';

/**
 * Element Opposition Pairs (Tetra System)
 * - Venus ↔ Jupiter (Earth opposes Wind)
 * - Mars ↔ Mercury (Fire opposes Water)
 *
 * Counter Djinn give stat DEBUFF but grant STRONGER abilities (2 skills)
 * Same element gives stat BONUS and 2 skills
 * Neutral (adjacent) gives small bonus and 1 skill
 */
const COUNTER_PAIRS: Record<Element, Element> = {
  Venus: 'Jupiter',   // Earth opposes Wind
  Jupiter: 'Venus',   // Wind opposes Earth
  Mars: 'Mercury',    // Fire opposes Water
  Mercury: 'Mars',    // Water opposes Fire
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

/**
 * Get Standby Djinn IDs from team (Djinn that have been activated)
 */
function getStandbyDjinnIds(team: Team): readonly string[] {
  return team.equippedDjinn.filter(djinnId => {
    const tracker = team.djinnTrackers[djinnId];
    return tracker?.state === 'Standby';
  });
}

export function getDjinnGrantedAbilitiesForUnit(unit: Unit, team: Team): string[] {
  const setDjinnIds = getSetDjinnIds(team);
  const standbyDjinnIds = getStandbyDjinnIds(team);
  const granted: string[] = [];

  // Same & Neutral elements: Grant abilities when Djinn is SET
  for (const djinnId of setDjinnIds) {
    const djinn = DJINN[djinnId];
    if (!djinn) continue;

    const compatibility = getElementCompatibility(unit.element, djinn.element);
    const abilityGroup = djinn.grantedAbilities[unit.id];
    if (!abilityGroup) continue;

    // Counter abilities are granted on STANDBY, not SET
    if (compatibility === 'counter') continue;

    let abilitiesToGrant: string[] = [];

    switch (compatibility) {
      case 'same':
        // Same element: 2 abilities when SET
        abilitiesToGrant = abilityGroup.same.slice(0, 2);
        break;
      case 'neutral':
        // Neutral (adjacent) element: 1 ability when SET
        abilitiesToGrant = abilityGroup.neutral.slice(0, 1);
        break;
    }

    granted.push(...abilitiesToGrant);
  }

  // Counter elements: Grant STRONGER abilities when Djinn is STANDBY (used)
  // This creates strategic depth - use the Djinn to unlock counter abilities!
  for (const djinnId of standbyDjinnIds) {
    const djinn = DJINN[djinnId];
    if (!djinn) continue;

    const compatibility = getElementCompatibility(unit.element, djinn.element);
    const abilityGroup = djinn.grantedAbilities[unit.id];
    if (!abilityGroup) continue;

    // Only counter abilities unlock on Standby
    if (compatibility !== 'counter') continue;

    // Counter element: 2 STRONGER abilities when STANDBY
    const abilitiesToGrant = abilityGroup.counter.slice(0, 2);
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
