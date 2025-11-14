import { z } from 'zod';

/**
 * Zod schema for Equipment validation
 * Validates all equipment definitions at runtime
 */

const EquipmentSlotSchema = z.enum([
  'weapon',
  'armor',
  'helm',
  'boots',
  'accessory',
]);

const EquipmentTierSchema = z.enum([
  'basic',
  'bronze',
  'iron',
  'steel',
  'silver',
  'mythril',
  'legendary',
  'artifact',
]);

const StatsSchema = z.object({
  hp: z.number().optional(),
  atk: z.number().optional(),
  def: z.number().optional(),
  spd: z.number().optional(),
  luck: z.number().optional(),
});

export const EquipmentSchema = z.object({
  id: z.string().min(1, 'Equipment ID cannot be empty'),
  name: z.string().min(1, 'Equipment name cannot be empty'),
  slot: EquipmentSlotSchema,
  tier: EquipmentTierSchema,
  cost: z.number().min(0, 'Equipment cost cannot be negative'),

  // Stat bonuses
  statBonus: StatsSchema,

  // Optional special properties
  unlocksAbility: z.string().optional(),
  elementalResist: z.number().min(0).max(1).optional(), // 0-100% as 0-1
  evasion: z.number().min(0).max(100).optional(), // 0-100%
  alwaysFirstTurn: z.boolean().optional(),
});

export type ValidatedEquipment = z.infer<typeof EquipmentSchema>;
