import { z } from 'zod';

/**
 * Shop Schema
 * Validates shop definitions for the game
 */

export const ShopSchema = z.object({
  id: z.string().min(1).regex(/^[a-z-]+$/, 'Shop ID must be kebab-case'),
  name: z.string().min(1),
  availableItems: z.array(z.string().min(1)),
  // Note: unlockCondition is a function and cannot be validated by Zod
  // It will be preserved during runtime but not validated
});

export type Shop = z.infer<typeof ShopSchema>;

export const ShopsSchema = z.record(z.string(), ShopSchema);

export type Shops = z.infer<typeof ShopsSchema>;