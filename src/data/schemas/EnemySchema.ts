import { z } from 'zod';
import { StatsSchema } from './StatsSchema';
import { ElementSchema } from './UnitSchema';
import { AbilitySchema } from './AbilitySchema';
import { EquipmentSchema } from './EquipmentSchema';

/**
 * Zod schema for Equipment drop
 */
export const EquipmentDropSchema = z.object({
  equipment: EquipmentSchema,
  chance: z.number().min(0).max(1), // 0.0 to 1.0 (0% to 100%)
});

/**
 * Zod schema for Enemy
 * Enemies are similar to Units but simpler:
 * - No equipment or Djinn
 * - Fixed stats (no growth rates)
 * - Reward data for XP and Gold
 * - Optional equipment drops with chances
 */
export const EnemySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  level: z.number().int().min(1).max(20),  // Levels 1-20
  stats: StatsSchema,
  abilities: z.array(AbilitySchema).min(1),  // At least 1 ability
  element: ElementSchema,
  baseXp: z.number().int().min(0),
  baseGold: z.number().int().min(0),
  drops: z.array(EquipmentDropSchema).optional(),
});

export type Enemy = z.infer<typeof EnemySchema>;
export type EquipmentDrop = z.infer<typeof EquipmentDropSchema>;

