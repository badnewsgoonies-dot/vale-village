import { z } from 'zod';

/**
 * Tower floor types
 */
export const TowerFloorTypeSchema = z.enum(['normal', 'rest', 'boss']);

/**
 * Base metadata shared by every tower floor entry
 */
const TowerFloorBaseSchema = z.object({
  id: z.string().min(1),
  floorNumber: z.number().int().min(1),
  difficultyTier: z.number().int().min(1).optional(),
  tags: z.array(z.string().min(1)).default([]).readonly(),
});

const BattleFloorSchema = TowerFloorBaseSchema.extend({
  type: z.union([z.literal('normal'), z.literal('boss')]),
  encounterId: z.string().min(1),
});

const RestFloorSchema = TowerFloorBaseSchema.extend({
  type: z.literal('rest'),
  encounterId: z.null().optional(),
  rest: z
    .object({
      allowLoadoutChange: z.boolean().default(true),
      healFractionOverride: z.number().min(0).max(1).optional(),
    })
    .default({ allowLoadoutChange: true })
    .readonly(),
});

export const TowerFloorSchema = z.discriminatedUnion('type', [BattleFloorSchema, RestFloorSchema]);

export type TowerFloor = z.infer<typeof TowerFloorSchema>;

