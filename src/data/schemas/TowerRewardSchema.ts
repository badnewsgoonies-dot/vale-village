import { z } from 'zod';

const TowerRewardTypeSchema = z.enum(['equipment', 'djinn', 'recruit']);

export const TowerRewardEntrySchema = z.object({
  type: TowerRewardTypeSchema,
  ids: z.array(z.string().min(1)).min(1),
  notes: z.string().optional(),
});

export const TowerRewardSchema = z.object({
  floorNumber: z.number().int().min(1),
  rewards: z.array(TowerRewardEntrySchema).min(1),
});

export type TowerRewardType = z.infer<typeof TowerRewardTypeSchema>;
export type TowerRewardEntry = z.infer<typeof TowerRewardEntrySchema>;
export type TowerReward = z.infer<typeof TowerRewardSchema>;

