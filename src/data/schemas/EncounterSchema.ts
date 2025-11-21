import { z } from 'zod';

/**
 * Zod schema for Encounter rules
 * Encounters can have special rules like phase changes, etc.
 */
export const EncounterRulesSchema = z.object({
  phaseChange: z
    .object({
      hpPct: z.number().min(0).max(1), // HP percentage threshold (0.0 to 1.0)
      addAbility: z.string().min(1), // Ability ID to add at phase change
    })
    .optional(),
});

const equipmentOptionsUnique = (options: readonly string[]) => new Set(options).size === options.length;

export const EquipmentRewardSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('none'),
  }),
  z.object({
    type: z.literal('fixed'),
    itemId: z.string().min(1),
  }),
  z.object({
    type: z.literal('choice'),
    options: z
      .array(z.string().min(1))
      .length(3)
      .refine(equipmentOptionsUnique, {
        message: 'Choice options must be unique',
      }),
  }),
]);

export const EncounterRewardsSchema = z.object({
  xp: z.number().int().min(0),
  gold: z.number().int().min(0),
  equipment: EquipmentRewardSchema,
  djinn: z.string().min(1).optional(), // Djinn ID to award
  unlockUnit: z.string().min(1).optional(),
  unlockAbility: z.string().min(1).optional(), // Future: apply unlocks in RewardsService/Store
});

export const EncounterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  enemies: z.array(z.string().min(1)).min(1),
  difficulty: z.enum(['easy', 'medium', 'hard', 'boss']).optional(),
  rules: EncounterRulesSchema.optional(),
  reward: EncounterRewardsSchema,
});

export type Encounter = z.infer<typeof EncounterSchema>;
export type EncounterRules = z.infer<typeof EncounterRulesSchema>;
export type EncounterRewards = z.infer<typeof EncounterRewardsSchema>;
export type EquipmentReward = z.infer<typeof EquipmentRewardSchema>;
