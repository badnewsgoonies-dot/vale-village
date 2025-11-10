import { z } from 'zod';

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
 */
export const EquipmentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slot: EquipmentSlotSchema,
  tier: EquipmentTierSchema,
  cost: z.number().int().min(0),
  statBonus: z.object({
    hp: z.number().int().optional(),
    pp: z.number().int().optional(),
    atk: z.number().int().optional(),
    def: z.number().int().optional(),
    mag: z.number().int().optional(),
    spd: z.number().int().optional(),
  }),
  unlocksAbility: z.string().optional(),
  elementalResist: z.number().min(0).max(1).optional(), // 0-1 range (0% to 100%)
  evasion: z.number().min(0).max(100).optional(), // 0-100 percentage
  alwaysFirstTurn: z.boolean().optional(),
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

