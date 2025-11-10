import { z } from 'zod';

/**
 * Zod schema for Encounter rules
 * Encounters can have special rules like phase changes, flee restrictions, etc.
 */
export const EncounterRulesSchema = z.object({
  phaseChange: z
    .object({
      hpPct: z.number().min(0).max(1), // HP percentage threshold (0.0 to 1.0)
      addAbility: z.string().min(1), // Ability ID to add at phase change
    })
    .optional(),
  fleeDisabled: z.boolean().optional(),
});

/**
 * Zod schema for Encounter rewards
 */
export const EncounterRewardSchema = z.object({
  gold: z.number().int().min(0).optional(),
  unlockUnit: z.string().min(1).optional(), // Unit ID to unlock
  unlockAbility: z.string().min(1).optional(), // Ability ID to unlock for all units
});

/**
 * Zod schema for Encounter
 * Defines a battle encounter with enemies and special rules
 */
export const EncounterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  enemies: z.array(z.string().min(1)).min(1), // Array of enemy IDs
  rules: EncounterRulesSchema.optional(),
  reward: EncounterRewardSchema.optional(),
});

export type Encounter = z.infer<typeof EncounterSchema>;
export type EncounterRules = z.infer<typeof EncounterRulesSchema>;
export type EncounterReward = z.infer<typeof EncounterRewardSchema>;

