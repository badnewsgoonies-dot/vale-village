import type { Element } from '@/types/Element';
import type { Stats, GrowthRates } from '@/types/Stats';
import type { Ability } from '@/types/Ability';
import type { Equipment, EquipmentLoadout } from '@/types/Equipment';
import type { Djinn, DjinnState } from '@/types/Djinn';
import type { StatusEffect } from '@/types/Unit';
import { emptyLoadout } from '@/types/Equipment';

/**
 * Plain object Unit model (immutable)
 * This replaces the Unit class for better serialization and immutability
 */
export interface UnitModel {
  // Immutable properties
  readonly id: string;
  readonly name: string;
  readonly element: Element;
  readonly role: string;
  readonly baseStats: Stats;
  readonly growthRates: GrowthRates;
  readonly description: string;
  
  // Mutable properties (but we create new objects instead of mutating)
  manaContribution: number;
  level: number;
  xp: number;
  currentHp: number;
  
  // Equipment and abilities
  equipment: EquipmentLoadout;
  djinn: Djinn[];
  djinnStates: Record<string, DjinnState>; // Plain object instead of Map
  abilities: Ability[];
  unlockedAbilityIds: string[]; // Array instead of Set
  
  // Battle state
  statusEffects: StatusEffect[];
  actionsTaken: number;
  battleStats: {
    damageDealt: number;
    damageTaken: number;
  };
}

/**
 * Create a new UnitModel from definition
 */
export function createUnitModel(
  definition: {
    id: string;
    name: string;
    element: Element;
    role: string;
    baseStats: Stats;
    growthRates: GrowthRates;
    abilities: Ability[];
    manaContribution: number;
    description: string;
  },
  level: number = 1,
  initialXp: number = 0
): UnitModel {
  // Calculate initial unlocked abilities
  const unlockedAbilityIds = definition.abilities
    .filter(a => a.unlockLevel <= level)
    .map(a => a.id);
  
  // Calculate initial HP
  const levelBonuses: Stats = {
    hp: definition.growthRates.hp * (level - 1),
    pp: 0,
    atk: definition.growthRates.atk * (level - 1),
    def: definition.growthRates.def * (level - 1),
    mag: definition.growthRates.mag * (level - 1),
    spd: definition.growthRates.spd * (level - 1),
  };
  const initialHp = definition.baseStats.hp + levelBonuses.hp;
  
  return {
    id: definition.id,
    name: definition.name,
    element: definition.element,
    role: definition.role,
    baseStats: definition.baseStats,
    growthRates: definition.growthRates,
    description: definition.description,
    manaContribution: definition.manaContribution,
    level: Math.max(1, Math.min(5, level)),
    xp: initialXp,
    currentHp: initialHp,
    equipment: emptyLoadout(),
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
 * Convert Unit class instance to UnitModel
 */
export function unitToModel(unit: { 
  id: string;
  name: string;
  element: Element;
  role: string;
  baseStats: Stats;
  growthRates: GrowthRates;
  description: string;
  manaContribution: number;
  level: number;
  xp: number;
  currentHp: number;
  equipment: EquipmentLoadout;
  djinn: Djinn[];
  djinnStates: Map<string, DjinnState> | Record<string, DjinnState>;
  abilities: Ability[];
  unlockedAbilityIds: Set<string> | string[];
  statusEffects: StatusEffect[];
  actionsTaken: number;
  battleStats: { damageDealt: number; damageTaken: number };
}): UnitModel {
  // Convert Map to plain object
  const djinnStates: Record<string, DjinnState> = {};
  if (unit.djinnStates instanceof Map) {
    for (const [id, state] of unit.djinnStates.entries()) {
      djinnStates[id] = state;
    }
  } else {
    Object.assign(djinnStates, unit.djinnStates);
  }
  
  // Convert Set to array
  const unlockedAbilityIds = unit.unlockedAbilityIds instanceof Set
    ? Array.from(unit.unlockedAbilityIds)
    : unit.unlockedAbilityIds;
  
  return {
    id: unit.id,
    name: unit.name,
    element: unit.element,
    role: unit.role,
    baseStats: unit.baseStats,
    growthRates: unit.growthRates,
    description: unit.description,
    manaContribution: unit.manaContribution,
    level: unit.level,
    xp: unit.xp,
    currentHp: unit.currentHp,
    equipment: { ...unit.equipment },
    djinn: [...unit.djinn],
    djinnStates,
    abilities: [...unit.abilities],
    unlockedAbilityIds: [...unlockedAbilityIds],
    statusEffects: [...unit.statusEffects],
    actionsTaken: unit.actionsTaken,
    battleStats: { ...unit.battleStats },
  };
}

/**
 * Create a copy of UnitModel (for immutability)
 */
export function cloneUnitModel(unit: UnitModel): UnitModel {
  return {
    ...unit,
    equipment: { ...unit.equipment },
    djinn: [...unit.djinn],
    djinnStates: { ...unit.djinnStates },
    abilities: [...unit.abilities],
    unlockedAbilityIds: [...unit.unlockedAbilityIds],
    statusEffects: [...unit.statusEffects],
    battleStats: { ...unit.battleStats },
  };
}


