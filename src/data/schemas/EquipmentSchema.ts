import { z } from 'zod';
import { StatsSchema } from './StatsSchema';

/**
 * Zod schema for Equipment validation
 */
export const EquipmentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slot: z.enum(['weapon', 'armor', 'helm', 'boots', 'accessory']),
  tier: z.enum(['basic', 'bronze', 'iron', 'steel', 'silver', 'mythril', 'legendary', 'artifact']),
  cost: z.number().int().min(0),
  
  // Stat bonuses (partial stats)
  statBonus: z.object({
    hp: z.number().int().optional(),
    pp: z.number().int().optional(),
    atk: z.number().int().optional(),
    def: z.number().int().optional(),
    mag: z.number().int().optional(),
    spd: z.number().int().optional(),
  }),
  
  // Optional properties
  unlocksAbility: z.string().optional(),
  elementalResist: z.number().min(0).max(1).optional(),
  evasion: z.number().min(0).max(100).optional(),
  alwaysFirstTurn: z.boolean().optional(),
});

export type ValidatedEquipment = z.infer<typeof EquipmentSchema>;


