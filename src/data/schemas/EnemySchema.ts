import { z } from 'zod';

/**
 * Zod schema for Enemy validation
 * Validates all enemy definitions at runtime
 */

const ElementSchema = z.enum([
  'Fire',
  'Water',
  'Earth',
  'Wind',
  'Neutral',
]);

const StatsSchema = z.object({
  hp: z.number().positive('HP must be positive'),
  pp: z.number().min(0, 'PP cannot be negative'),
  atk: z.number().min(0, 'ATK cannot be negative'),
  def: z.number().min(0, 'DEF cannot be negative'),
  mag: z.number().min(0, 'MAG cannot be negative'),
  spd: z.number().min(0, 'SPD cannot be negative'),
});

const AbilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  ppCost: z.number().min(0),
  power: z.number(),
  element: ElementSchema,
  target: z.enum(['single', 'all']),
  type: z.enum(['damage', 'healing', 'buff', 'debuff']),
});

const EquipmentDropSchema = z.object({
  equipment: z.any(), // Equipment object (complex validation)
  chance: z.number()
    .min(0, 'Drop chance cannot be negative')
    .max(1, 'Drop chance cannot exceed 1.0 (100%)'),
});

export const EnemySchema = z.object({
  id: z.string().min(1, 'Enemy ID cannot be empty'),
  name: z.string().min(1, 'Enemy name cannot be empty'),
  level: z.number()
    .int('Enemy level must be an integer')
    .min(1, 'Enemy level must be at least 1')
    .max(99, 'Enemy level cannot exceed 99'),
  stats: StatsSchema,
  abilities: z.array(AbilitySchema).min(1, 'Enemy must have at least 1 ability'),
  element: ElementSchema,
  baseXp: z.number()
    .min(0, 'Base XP cannot be negative')
    .max(9999, 'Base XP too high'),
  baseGold: z.number()
    .min(0, 'Base Gold cannot be negative')
    .max(9999, 'Base Gold too high'),
  drops: z.array(EquipmentDropSchema).optional(),
});

export type ValidatedEnemy = z.infer<typeof EnemySchema>;
