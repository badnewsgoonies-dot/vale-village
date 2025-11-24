import { z } from 'zod';
import { ElementSchema } from './UnitSchema';
import { ContentAvailabilitySchema } from './ContentAvailabilitySchema';

export const DjinnSummonEffectSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('damage'),
    description: z.string(),
    damage: z.number().int().min(0),
  }),
  z.object({
    type: z.literal('heal'),
    description: z.string(),
    healAmount: z.number().int().min(0),
  }),
  z.object({
    type: z.literal('buff'),
    description: z.string(),
    statBonus: z.object({
      atk: z.number().optional(),
      def: z.number().optional(),
      mag: z.number().optional(),
      spd: z.number().optional(),
    }),
  }),
  z.object({
    type: z.literal('special'),
    description: z.string(),
  }),
]);

export const DjinnGrantedAbilitiesSchema = z.object({
  same: z.array(z.string()).min(0).max(4),
  counter: z.array(z.string()).min(0).max(4),
  neutral: z.array(z.string()).min(0).max(4),
});
export const DjinnSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  element: ElementSchema,
  tier: z.enum(['1', '2', '3']),
  summonEffect: DjinnSummonEffectSchema,
  grantedAbilities: z.record(z.string().min(1), DjinnGrantedAbilitiesSchema),
  availableIn: ContentAvailabilitySchema.optional().readonly(),
});

export type Djinn = z.infer<typeof DjinnSchema>;
export type DjinnSummonEffect = z.infer<typeof DjinnSummonEffectSchema>;
