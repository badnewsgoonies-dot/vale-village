import { z } from 'zod';

/**
 * Zod schema for Stats validation
 */
export const StatsSchema = z.object({
  hp: z.number().int().min(0),
  pp: z.number().int().min(0),
  atk: z.number().int().min(0),
  def: z.number().int().min(0),
  mag: z.number().int().min(0),
  spd: z.number().int().min(0),
});

export type Stats = z.infer<typeof StatsSchema>;

