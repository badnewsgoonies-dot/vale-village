import { z } from 'zod';
import { StatsSchema } from './StatsSchema';
import { EquipmentLoadoutSchema } from './EquipmentSchema';
import { AbilitySchema } from './AbilitySchema';
import { ContentAvailabilitySchema } from './ContentAvailabilitySchema';

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
 * Zod schema for StatKey
 */
const StatKeySchema = z.enum(['hp', 'pp', 'atk', 'def', 'mag', 'spd']);

/**
 * Zod schema for StatusEffect (discriminated union)
 */
export const StatusEffectSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('buff'),
    stat: StatKeySchema,
    modifier: z.number().positive(),
    duration: z.number().int().positive(),
  }),
  z.object({
    type: z.literal('debuff'),
    stat: StatKeySchema,
    modifier: z.number().negative(),
    duration: z.number().int().positive(),
  }),
  z.object({
    type: z.enum(['poison', 'burn']),
    damagePerTurn: z.number().int().positive(),
    duration: z.number().int().positive(),
  }),
  z.object({
    type: z.enum(['freeze', 'paralyze', 'stun']),
    duration: z.number().int().positive(),
  }),
  z.object({
    type: z.literal('healOverTime'),
    healPerTurn: z.number().int().positive(),
    duration: z.number().int().positive(),
  }),
  // Phase 2: Elemental resistance/weakness
  // Convention: modifier > 0 = resistance (reduces damage), modifier < 0 = weakness (increases damage)
  // Damage factor = 1 - modifier: 0.4 = 40% resist → damage × 0.6, -0.2 = 20% weakness → damage × 1.2
  z.object({
    type: z.literal('elementalResistance'),
    element: ElementSchema,
    modifier: z.number(), // Can be positive (resist) or negative (weakness)
    duration: z.number().int().positive(),
  }),
  // Phase 2: Global damage reduction
  z.object({
    type: z.literal('damageReduction'),
    percent: z.number().min(0).max(1), // 0-1, e.g. 0.3 = 30% reduction
    duration: z.number().int().positive(),
  }),
  // Phase 2: Hit-based shield
  z.object({
    type: z.literal('shield'),
    remainingCharges: z.number().int().min(0), // Consumed per hit
    duration: z.number().int().positive(),
  }),
  // Phase 2: Invulnerability (blocks damage only, NOT statuses)
  z.object({
    type: z.literal('invulnerable'),
    duration: z.number().int().positive(),
  }),
  // Phase 2: Status immunity
  z.object({
    type: z.literal('immunity'),
    all: z.boolean(), // If true, immune to all negative statuses
    types: z.array(z.enum(['poison', 'burn', 'freeze', 'paralyze', 'stun', 'debuff'])).optional(), // Specific immunities
    duration: z.number().int().positive(),
  }),
  // Phase 2: Auto-revive (uses-based, not time-based)
  z.object({
    type: z.literal('autoRevive'),
    hpPercent: z.number().min(0).max(1), // HP% restored when triggered
    usesRemaining: z.number().int().min(1), // Usually 1
  }),
]);

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
  autoAttackTiming: z.enum(['same-turn', 'next-turn']).optional(),
  availableIn: ContentAvailabilitySchema.optional().readonly(),
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
  level: z.number().int().min(1).max(20),
  xp: z.number().int().min(0),
  currentHp: z.number().int().min(0),
  autoAttackTiming: z.enum(['same-turn', 'next-turn']).optional(),
  equipment: EquipmentLoadoutSchema,
  storeUnlocked: z.boolean(),
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
}).superRefine((u, ctx) => {
  // Unit HP cannot exceed max HP
  const maxHp = u.baseStats.hp + (u.level - 1) * u.growthRates.hp;
  if (u.currentHp > maxHp) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `currentHp (${u.currentHp}) exceeds maxHp (${maxHp})`,
      path: ['currentHp'],
    });
  }
});

export type Unit = z.infer<typeof UnitSchema>;
export type UnitDefinition = z.infer<typeof UnitDefinitionSchema>;
export type StatusEffect = z.infer<typeof StatusEffectSchema>;
