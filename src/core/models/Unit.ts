/**
 * Unit model (POJO)
 * Following ADR 003: Plain objects with readonly properties where possible
 */

import type { Element, Stats, GrowthRates, UnitRole, StatusEffect } from './types';
import type { EquipmentLoadout } from './Equipment';
import type { Ability } from '../../data/schemas/AbilitySchema';

/**
 * Unit definition (base template - immutable)
 */
export interface UnitDefinition {
  readonly id: string;
  readonly name: string;
  readonly element: Element;
  readonly role: UnitRole;
  readonly baseStats: Stats;
  readonly growthRates: GrowthRates;
  readonly abilities: readonly Ability[];
  readonly manaContribution: number;  // Base mana circles this unit provides to team pool
  readonly description: string;
  readonly autoAttackTiming?: 'same-turn' | 'next-turn';
}

/**
 * Unit instance - represents a unit in the player's collection or battle
 * Mutable properties are for runtime state (HP, XP, etc.)
 */
export interface Unit {
  // Immutable properties
  readonly id: string;
  readonly name: string;
  readonly element: Element;
  readonly role: UnitRole;
  readonly baseStats: Stats;
  readonly growthRates: GrowthRates;
  readonly description: string;
  readonly autoAttackTiming?: 'same-turn' | 'next-turn';

  // Mutable properties (but we create new objects instead of mutating)
  manaContribution: number;
  level: number;
  xp: number;
  currentHp: number;

  // Equipment and abilities
  equipment: EquipmentLoadout;
  djinn: readonly string[];  // Djinn IDs (plain array instead of Djinn objects)
  djinnStates: Record<string, 'Set' | 'Standby' | 'Recovery'>; // Plain object instead of Map
  abilities: readonly Ability[];
  unlockedAbilityIds: readonly string[]; // Array instead of Set
  storeUnlocked: boolean;

  // Battle state
  statusEffects: readonly StatusEffect[];
  actionsTaken: number;
  battleStats: {
    damageDealt: number;
    damageTaken: number;
  };
}

/**
 * Calculate max HP for a unit based on level and base stats
 */
export function calculateMaxHp(unit: Unit): number {
  const levelBonus = (unit.level - 1) * unit.growthRates.hp;
  return unit.baseStats.hp + levelBonus;
}

/**
 * Check if unit is KO'd
 */
export function isUnitKO(unit: Unit): boolean {
  return unit.currentHp <= 0;
}

/**
 * Create a new Unit from definition
 */
export function createUnit(
  definition: UnitDefinition,
  level: number = 1,
  initialXp: number = 0
): Unit {
  const maxHp = definition.baseStats.hp + (level - 1) * definition.growthRates.hp;

  // Auto-unlock abilities based on level
  const unlockedAbilityIds = definition.abilities
    .filter(ability => level >= (ability.unlockLevel ?? 1))
    .map(ability => ability.id);

  return {
    id: definition.id,
    name: definition.name,
    element: definition.element,
    role: definition.role,
    baseStats: definition.baseStats,
    growthRates: definition.growthRates,
    description: definition.description,
    autoAttackTiming: definition.autoAttackTiming ?? 'same-turn',
    manaContribution: definition.manaContribution,
    level,
    xp: initialXp,
    currentHp: maxHp,
    equipment: {
      weapon: null,
      armor: null,
      helm: null,
      boots: null,
      accessory: null,
    },
    storeUnlocked: false,
    djinn: [],
    djinnStates: {},
    abilities: definition.abilities,
    unlockedAbilityIds,
    statusEffects: [],
    actionsTaken: 0,
    battleStats: {
      damageDealt: 0,
      damageTaken: 0,
    },
  };
}

/**
 * Update unit (returns new object - immutability)
 * Handles nested objects properly
 */
export function updateUnit(unit: Unit, updates: Partial<Unit>): Unit {
  return {
    ...unit,
    ...updates,
    equipment: updates.equipment ? { ...unit.equipment, ...updates.equipment } : unit.equipment,
    battleStats: updates.battleStats ? { ...unit.battleStats, ...updates.battleStats } : unit.battleStats,
  };
}
