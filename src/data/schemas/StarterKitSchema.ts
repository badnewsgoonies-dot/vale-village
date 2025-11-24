import { z } from 'zod';
import { ElementSchema } from './UnitSchema';

/**
 * Starter Kit Schema
 * Validates starter kit definitions for each element
 */

export const StarterKitSchema = z.object({
  element: ElementSchema,
  name: z.string().min(1),
  cost: z.number().int().min(0),
  equipment: z.object({
    weapon: z.string().min(1),
    armor: z.string().min(1),
    helm: z.string().min(1),
    boots: z.string().min(1),
    accessory: z.string().min(1),
  }),
});

export type StarterKit = z.infer<typeof StarterKitSchema>;

export const StarterKitsSchema = z.record(ElementSchema, StarterKitSchema);

export type StarterKits = z.infer<typeof StarterKitsSchema>;