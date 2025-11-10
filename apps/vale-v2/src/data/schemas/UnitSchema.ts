import { z } from 'zod';
import { StatsSchema } from './StatsSchema';
import { EquipmentLoadoutSchema } from './EquipmentSchema';
import { AbilitySchema } from './AbilitySchema';

/**
 * Zod schema for Element
 */
export const ElementSchema = z.enum(['Venus', 'Mars', 'Mercury', 'Jupiter', 'Neutral']);

export type Element = z.infer<typeof ElementSchema>;

/**
 * Zod schema for UnitRole
 */
export const UnitRoleSchema = z.enum([
  'Balanced Warrior',
  'Pure DPS',
  'Elemental Mage',
  'Healer',
  'Rogue Assassin',
  'AoE Fire Mage',
  'Support Buffer',
  'Defensive Tank',
  'Versatile Scholar',
  'Master Warrior',
]);

export type UnitRole = z.infer<typeof UnitRoleSchema>;

/**
 * Zod schema for DjinnState
 */
export const DjinnStateSchema = z.enum(['Set', 'Standby', 'Recovery']);

export type DjinnState = z.infer<typeof DjinnStateSchema>;

/**
 * Zod schema for StatusEffect
 */
export const StatusEffectSchema = z.object({
  type: z.enum(['buff', 'debuff', 'poison', 'burn', 'freeze', 'paralyze']),
  stat: z.enum(['hp', 'pp', 'atk', 'def', 'mag', 'spd']).optional(),
  modifier: z.number().optional(),
  damagePerTurn: z.number().int().min(0).optional(),
  duration: z.number().int().min(0),
});

/**
 * Zod schema for UnitDefinition
 */
export const UnitDefinitionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  element: ElementSchema,
  role: UnitRoleSchema,
  baseStats: StatsSchema,
  growthRates: StatsSchema,
  abilities: z.array(AbilitySchema),
  manaContribution: z.number().int().min(0),
  description: z.string(),
});

/**
 * Zod schema for Unit
 */
export const UnitSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  element: ElementSchema,
  role: UnitRoleSchema,
  baseStats: StatsSchema,
  growthRates: StatsSchema,
  description: z.string(),
  manaContribution: z.number().int().min(0),
  level: z.number().int().min(1).max(5),
  xp: z.number().int().min(0),
  currentHp: z.number().int().min(0),
  equipment: EquipmentLoadoutSchema,
  djinn: z.array(z.string().min(1)),
  djinnStates: z.record(z.string(), DjinnStateSchema),
  abilities: z.array(AbilitySchema),
  unlockedAbilityIds: z.array(z.string().min(1)),
  statusEffects: z.array(StatusEffectSchema),
  actionsTaken: z.number().int().min(0),
  battleStats: z.object({
    damageDealt: z.number().int().min(0),
    damageTaken: z.number().int().min(0),
  }),
});

export type Unit = z.infer<typeof UnitSchema>;
export type UnitDefinition = z.infer<typeof UnitDefinitionSchema>;
export type StatusEffect = z.infer<typeof StatusEffectSchema>;

