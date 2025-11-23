import { z } from 'zod';
import { ContentAvailabilitySchema } from './ContentAvailabilitySchema';

/**
 * Element type for equipment restrictions
 * Defined here to avoid circular dependency with UnitSchema
 */
const ElementSchema = z.enum(['Venus', 'Mars', 'Mercury', 'Jupiter', 'Neutral']);

/**
 * Stat bonus schema for equipment (allows negative values for penalties)
 * Unlike StatsSchema, this allows negative values since equipment can have penalties
 */
export const EquipmentStatBonusSchema = z.object({
  hp: z.number().int(),
  pp: z.number().int(),
  atk: z.number().int(),
  def: z.number().int(),
  mag: z.number().int(),
  spd: z.number().int(),
}).partial();

/**
 * Zod schema for EquipmentSlot
 */
export const EquipmentSlotSchema = z.enum(['weapon', 'armor', 'helm', 'boots', 'accessory']);

/**
 * Zod schema for EquipmentTier
 */
export const EquipmentTierSchema = z.enum([
  'basic',
  'bronze',
  'iron',
  'steel',
  'silver',
  'mythril',
  'legendary',
  'artifact',
]);

/**
 * Zod schema for Equipment validation
 * CHANGED: allowedUnits → allowedElements for element-based equipment restrictions
 */
export const EquipmentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slot: EquipmentSlotSchema,
  tier: EquipmentTierSchema,
  cost: z.number().int().min(0),
  statBonus: EquipmentStatBonusSchema.default({}), // Default to empty object if missing
  allowedElements: z.array(ElementSchema).min(1).readonly(), // CHANGED: Make readonly for compatibility with Equipment type
  unlocksAbility: z.string().optional(),
  equipmentUnlocksPermanent: z.boolean().optional(),
  elementalResist: z.number().min(0).max(1).optional(), // 0-1 range (0% to 100%)
  alwaysFirstTurn: z.boolean().optional(),
  availableIn: ContentAvailabilitySchema.optional().readonly(),
});

export type Equipment = z.infer<typeof EquipmentSchema>;

/**
 * Zod schema for EquipmentLoadout
 */
export const EquipmentLoadoutSchema = z.object({
  weapon: EquipmentSchema.nullable(),
  armor: EquipmentSchema.nullable(),
  helm: EquipmentSchema.nullable(),
  boots: EquipmentSchema.nullable(),
  accessory: EquipmentSchema.nullable(),
});

export type EquipmentLoadout = z.infer<typeof EquipmentLoadoutSchema>;
