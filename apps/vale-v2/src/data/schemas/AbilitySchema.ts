import { z } from 'zod';

/**
 * Zod schema for Ability validation
 * Single source of truth for ability data structure
 */
export const AbilitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(['physical', 'psynergy', 'healing', 'buff', 'debuff', 'summon']),
  element: z.enum(['Venus', 'Mars', 'Jupiter', 'Mercury', 'Neutral']).optional(),
  manaCost: z.number().int().min(0).max(10), // Cannot be negative!
  basePower: z.number().int().min(0), // Cannot be negative!
  targets: z.enum(['single-enemy', 'all-enemies', 'single-ally', 'all-allies', 'self']),
  unlockLevel: z.number().int().min(1).max(20),
  kind: z.enum(['attack', 'psynergy']).optional(),
  description: z.string(),
  
  // Optional properties
  chainDamage: z.boolean().optional(),
  revivesFallen: z.boolean().optional(),
  buffEffect: z.object({
    atk: z.number().optional(),
    def: z.number().optional(),
    mag: z.number().optional(),
    spd: z.number().optional(),
    evasion: z.number().optional(),
  }).optional(),
  duration: z.number().int().min(1).optional(),
  
  // AI hints (optional metadata for AI decision-making)
  aiHints: z.object({
    priority: z.number().min(0).max(3).optional(),
    target: z.enum(['weakest', 'random', 'lowestRes', 'healerFirst']).optional(),
    avoidOverkill: z.boolean().optional(),
    opener: z.boolean().optional(),
  }).optional(),
});

export type Ability = z.infer<typeof AbilitySchema>;

