import { z } from 'zod';

export const ContentAvailabilitySchema = z.array(z.enum(['campaign', 'tower'])).min(1);

export type ContentAvailability = z.infer<typeof ContentAvailabilitySchema>;

