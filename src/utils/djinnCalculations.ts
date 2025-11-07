import type { Djinn } from '@/types/Djinn';
import type { Unit } from '@/types/Unit';
import type { Element } from '@/types/Element';

/**
 * Centralized djinn bonus values (single source-of-truth for tests & tuning)
 */
export const DJINN_BONUS_VALUES = {
  matching: { atk: 5, def: 3 },
  counter: { atk: -3, def: -2 },
  neutral: { atk: 2, def: 1 },
} as const;

type Relation = 'matching' | 'counter' | 'neutral';

const COUNTER_ELEMENTS: Partial<Record<Element, Element>> = {
  Venus: 'Mars',
  Mars: 'Venus',
  Mercury: 'Jupiter',
  Jupiter: 'Mercury',
};

function getRelation(unitElement: Element, djinnElement: Element): Relation {
  if (unitElement === djinnElement) return 'matching';
  if (COUNTER_ELEMENTS[djinnElement] === unitElement) return 'counter';
  return 'neutral';
}

/**
 * Calculate aggregated ATK/DEF bonuses a unit would receive from the provided equipped Djinn.
 * Effects stack linearly per Djinn.
 */
export function calculateDjinnStatBonuses(unit: Unit, equippedDjinn: Djinn[]) {
  let atk = 0;
  let def = 0;

  for (const djinn of equippedDjinn) {
    const rel = getRelation(unit.element, djinn.element);
    const bonus = DJINN_BONUS_VALUES[rel];
    atk += bonus.atk;
    def += bonus.def;
  }

  return { atk, def };
}

/**
 * Return a deduplicated list of ability IDs the unit would gain from the equipped Djinn.
 * Matching -> grants matching ability, Counter -> grants counter ability. Neutral -> none.
 */
export function getDjinnGrantedAbilities(unit: Unit, equippedDjinn: Djinn[]): string[] {
  const granted: string[] = [];

  for (const djinn of equippedDjinn) {
    const rel = getRelation(unit.element, djinn.element);
    if (rel === 'matching') granted.push(djinn.grantsAbilities.matching);
    if (rel === 'counter') granted.push(djinn.grantsAbilities.counter);
  }

  return Array.from(new Set(granted));
}

/**
 * For UI: return each Djinn's per-unit impact (relationship + per-Djinn bonus + granted ability)
 */
export interface DjinnImpact {
  djinn: Djinn;
  relationship: Relation;
  atkBonus: number;
  defBonus: number;
  grantedAbility: string | null;
}

export function getDjinnImpactOnUnit(unit: Unit, equippedDjinn: Djinn[]): DjinnImpact[] {
  return equippedDjinn.map(djinn => {
    const relationship = getRelation(unit.element, djinn.element);
    const bonuses = DJINN_BONUS_VALUES[relationship];
    return {
      djinn,
      relationship,
      atkBonus: bonuses.atk,
      defBonus: bonuses.def,
      grantedAbility: relationship === 'matching' ? djinn.grantsAbilities.matching : (relationship === 'counter' ? djinn.grantsAbilities.counter : null),
    };
  });
}

export function wouldDjinnBenefitUnit(unit: Unit, djinn: Djinn): boolean {
  const rel = getRelation(unit.element, djinn.element);
  return rel === 'matching' || rel === 'neutral';
}

export function getCounterElement(element: Element): Element | undefined {
  return COUNTER_ELEMENTS[element];
}

