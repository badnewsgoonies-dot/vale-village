import { z } from 'zod';
import { UnitSchema, DjinnStateSchema } from './UnitSchema';
import { MIN_PARTY_SIZE, MAX_PARTY_SIZE } from '../../core/constants';

/**
 * Zod schema for DjinnTracker
 */
export const DjinnTrackerSchema = z.object({
  djinnId: z.string().min(1),
  state: DjinnStateSchema,
  lastActivatedTurn: z.number().int().min(0),
});

/**
 * Zod schema for Team
 */
export const TeamSchema = z.object({
  equippedDjinn: z.array(z.string().min(1)).max(3),  // Up to 3 Djinn slots (can be empty initially)
  djinnTrackers: z.record(z.string(), DjinnTrackerSchema),
  units: z.array(UnitSchema).min(MIN_PARTY_SIZE).max(MAX_PARTY_SIZE),  // 1-4 units
  collectedDjinn: z.array(z.string().min(1)).max(12),  // Up to 12 Djinn
  currentTurn: z.number().int().min(0),
  activationsThisTurn: z.record(z.string(), z.number().int().min(0)),
  djinnStates: z.record(z.string(), DjinnStateSchema),
}).superRefine((t, ctx) => {
  // Team djinn sanity check
  if (t.equippedDjinn.length > 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      maximum: 3,
      type: 'array',
      inclusive: true,
      path: ['equippedDjinn'],
    });
  }
});

export type Team = z.infer<typeof TeamSchema>;
export type DjinnTracker = z.infer<typeof DjinnTrackerSchema>;

