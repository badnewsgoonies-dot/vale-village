/**
 * AI Service
 * Deterministic AI decision-making for enemy units
 * Uses ability scoring and target selection based on tactical rules
 */

import type { Unit } from '../models/Unit';
import type { BattleState } from '../models/BattleState';
import type { Ability } from '../../data/schemas/AbilitySchema';
import type { PRNG } from '../random/prng';
import { isUnitKO } from '../models/Unit';
import { getElementModifier } from '../algorithms/damage';
import { resolveTargets } from '../algorithms/targeting';
import { calculateMaxHp } from '../models/Unit';

/**
 * AI hints for abilities (optional metadata)
 * Used to guide AI decision-making
 */
export interface AIHints {
  priority?: number; // Baseline weight (0-3, higher = prefer)
  target?: 'weakest' | 'random' | 'lowestRes' | 'healerFirst' | 'highestDef';
  avoidOverkill?: boolean; // Penalize heavy hits on low HP targets
  opener?: boolean; // Prefer in first N turns
}

/**
 * Decision made by AI
 */
export interface AIDecision {
  abilityId: string;
  targetIds: readonly string[];
}

/**
 * Score an ability for use by an enemy unit
 * Higher score = better choice
 */
function scoreAbility(
  ability: Ability,
  caster: Unit,
  state: BattleState
): number {
  let score = ability.aiHints?.priority ?? 1.0;

  // Get potential targets
  const potentialTargets = resolveTargets(
    ability,
    caster,
    state.playerTeam.units,
    state.enemies
  );
  const validTargets = potentialTargets.filter(t => !isUnitKO(t));

  if (validTargets.length === 0) {
    return -1000; // No valid targets
  }

  // Estimate damage/healing value
  let estimatedValue = 0;

  if (ability.type === 'physical' || ability.type === 'psynergy') {
    // Estimate damage using effective stats (simplified - doesn't account for crit/dodge variance)
    // Note: We need team for effective stats, but scoreAbility doesn't have it
    // For now, use base stats + level bonuses (equipment/Djinn/status will be handled in actual execution)
    // TODO: Pass team to scoreAbility for accurate effective stats
    const basePower = ability.basePower || 0;
    const casterStat = ability.type === 'physical' ? caster.baseStats.atk : caster.baseStats.mag;
    const avgTargetDef = validTargets.reduce((sum, t) => {
      const def = t.baseStats.def;
      return sum + def;
    }, 0) / validTargets.length;

    // Rough damage estimate (simplified formula)
    // Note: This is approximate - actual damage uses effective stats in BattleService
    const rawDamage = basePower + casterStat - avgTargetDef;
    const avgDamage = Math.max(1, rawDamage);

    // Apply element modifier if applicable
    if (ability.element) {
      const avgElementMod = validTargets.reduce((sum, t) => {
        return sum + getElementModifier(ability.element!, t.element);
      }, 0) / validTargets.length;
      estimatedValue = avgDamage * avgElementMod;
    } else {
      estimatedValue = avgDamage;
    }

    // Multi-target bonus
    if (ability.targets === 'all-enemies' || ability.targets === 'all-allies') {
      estimatedValue *= validTargets.length;
    }
  } else if (ability.type === 'healing') {
    // Estimate healing value
    const baseHeal = ability.basePower || 0;
    const casterMag = caster.baseStats.mag;
    const rawHeal = baseHeal + casterMag;
    estimatedValue = Math.max(1, rawHeal);

    // Multi-target bonus
    if (ability.targets === 'all-allies') {
      estimatedValue *= validTargets.length;
    }
  } else if (ability.type === 'buff' || ability.type === 'debuff') {
    // Status utility - value based on stat modifier
    if (ability.buffEffect) {
      const statMods = Object.values(ability.buffEffect).filter(v => typeof v === 'number');
      const totalMod = statMods.reduce((sum, mod) => sum + Math.abs(mod as number), 0);
      estimatedValue = totalMod * 2; // Status effects are valuable
    }
  }

  // Apply status utility weight
  score += estimatedValue * 0.1;

  // Opener bonus (prefer in early turns)
  // Note: turnNumber tracking would need to be added to BattleState if needed
  // For now, opener hint is ignored (can be added later)
  if (ability.aiHints?.opener) {
    score += 1.0; // Small bonus for opener abilities
  }

  return score;
}

/**
 * Select targets for an ability
 * Uses AI hints to choose optimal targets
 */
function selectTargets(
  ability: Ability,
  caster: Unit,
  state: BattleState,
  rng: PRNG
): readonly string[] {
  const potentialTargets = resolveTargets(
    ability,
    caster,
    state.playerTeam.units,
    state.enemies
  );
  const validTargets = potentialTargets.filter(t => !isUnitKO(t));

  if (validTargets.length === 0) {
    return [];
  }

  const targetHint = ability.aiHints?.target || 'weakest';

  switch (targetHint) {
    case 'weakest': {
      // Find weakest effective HP (HP × resist multiplier)
      const scored = validTargets.map(target => {
        const maxHp = calculateMaxHp(target);
        const currentHp = target.currentHp;
        const hpRatio = currentHp / maxHp;

        // Apply element resistance if ability has element
        let effectiveHp = currentHp;
        if (ability.element) {
          const resistMod = getElementModifier(ability.element, target.element);
          effectiveHp = currentHp / resistMod; // Lower effective HP = weaker
        }

        return { target, effectiveHp, hpRatio };
      });

      // Sort by effective HP (lowest first)
      scored.sort((a, b) => a.effectiveHp - b.effectiveHp);

      // Avoid overkill if hint says so
      if (ability.aiHints?.avoidOverkill) {
        // Prefer targets that won't be overkilled by estimated damage
        const estimatedDamage = (ability.basePower || 0) + 
          (ability.type === 'physical' ? caster.baseStats.atk : caster.baseStats.mag);
        
        // Filter out targets that would be overkilled by >50%
        const nonOverkill = scored.filter(s => {
          const overkill = estimatedDamage - s.effectiveHp;
          return overkill < s.effectiveHp * 0.5; // Don't overkill by more than 50% of remaining HP
        });

        if (nonOverkill.length > 0) {
          // Length check guarantees [0] exists
          return [nonOverkill[0]!.target.id];
        }
      }

      // Return weakest target(s)
      if (ability.targets === 'all-enemies' || ability.targets === 'all-allies') {
        return scored.map(s => s.target.id);
      }
      if (scored.length > 0) {
        // Length check guarantees [0] exists
        return [scored[0]!.target.id];
      }
      return [];
    }

    case 'lowestRes': {
      // Find target with lowest resistance to ability element
      if (!ability.element || validTargets.length === 0) {
        if (validTargets.length > 0) {
          // Length check guarantees [0] exists
          return [validTargets[0]!.id];
        }
        return [];
      }

      // ability.element is guaranteed to be defined here
      const abilityElement = ability.element;
      const scored = validTargets.map(target => {
        const resistMod = getElementModifier(abilityElement, target.element);
        return { target, resistMod };
      });

      scored.sort((a, b) => a.resistMod - b.resistMod); // Lower = weaker resistance
      if (scored.length > 0) {
        // Length check guarantees [0] exists
        return [scored[0]!.target.id];
      }
      return [];
    }

    case 'healerFirst': {
      // Target healers first (units with healing abilities)
      const healers = validTargets.filter(t => 
        t.abilities.some(a => a.type === 'healing')
      );
      if (healers.length > 0) {
        // Length check guarantees [0] exists
        return [healers[0]!.id];
      }
      if (validTargets.length > 0) {
        // Length check guarantees [0] exists
        return [validTargets[0]!.id];
      }
      return [];
    }

    case 'random': {
      // Random selection (deterministic via RNG)
      if (validTargets.length === 0) {
        return [];
      }
      // AoE abilities ignore random single-target selection and hit everyone
      if (ability.targets === 'all-enemies' || ability.targets === 'all-allies') {
        return validTargets.map(t => t.id);
      }
      const index = Math.floor(rng.next() * validTargets.length);
      // Index is guaranteed to be valid since 0 <= index < length
      return [validTargets[index]!.id];
    }

    case 'highestDef': {
      // Find target with highest DEF (single-target only)
      if (validTargets.length === 0) {
        return [];
      }
      
      const scored = validTargets.map(target => {
        // Use base DEF (AI doesn't have access to effective stats here)
        // Could be enhanced later to use effective DEF if team is passed
        const def = target.baseStats.def;
        return { target, def };
      });
      
      scored.sort((a, b) => b.def - a.def); // Highest DEF first
      if (scored.length > 0) {
        // Length check guarantees [0] exists
        return [scored[0]!.target.id];
      }
      return [];
    }

    default:
      if (validTargets.length > 0) {
        // Length check guarantees [0] exists
        return [validTargets[0]!.id];
      }
      return [];
  }
}

/**
 * Make an AI decision for an enemy unit
 * Returns the ability ID and target IDs to use
 */
export function makeAIDecision(
  state: BattleState,
  actorId: string,
  rng: PRNG
): AIDecision {
  // Find actor
  const allUnits = [...state.playerTeam.units, ...state.enemies];
  const actor = allUnits.find(u => u.id === actorId);
  if (!actor || isUnitKO(actor)) {
    throw new Error(`Invalid actor: ${actorId}`);
  }

  // Get available abilities (unlocked and with valid targets)
  const availableAbilities = actor.abilities.filter(ability => {
    // Check if ability is unlocked (simplified - assume all are unlocked for enemies)
    // In future, check unlockLevel vs actor.level

    // Check if ability has valid targets
    const potentialTargets = resolveTargets(
      ability,
      actor,
      state.playerTeam.units,
      state.enemies
    );
    const validTargets = potentialTargets.filter(t => !isUnitKO(t));
    return validTargets.length > 0;
  });

  if (availableAbilities.length === 0) {
    // Fallback: use first ability (shouldn't happen)
    throw new Error(`No available abilities for ${actorId}`);
  }

  // Score all abilities
  const scored = availableAbilities.map(ability => ({
    ability,
    score: scoreAbility(ability, actor, state),
  }));

  // Sort by score (highest first)
  scored.sort((a, b) => b.score - a.score);

  // Pick best ability (or randomize among top 2 if scores are close)
  if (scored.length === 0) {
    throw new Error(`No scored abilities for ${actorId}`);
  }

  // Length check guarantees [0] and potentially [1] exist
  let chosenAbility = scored[0]!.ability;

  if (scored.length > 1 && scored[0]!.score - scored[1]!.score < 2.0) {
    // Scores are close - randomize between top 2
    const topTwo = scored.slice(0, 2);
    const index = Math.floor(rng.next() * topTwo.length);
    chosenAbility = topTwo[index]!.ability;
  }

  // Select targets
  const targetIds = selectTargets(chosenAbility, actor, state, rng);

  return {
    abilityId: chosenAbility.id,
    targetIds,
  };
}

