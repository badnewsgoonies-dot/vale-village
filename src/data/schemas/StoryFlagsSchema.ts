import { z } from 'zod';

/**
 * Story Flags Schema
 * Validates story flag mappings to units and Djinn
 */

// Schema for story flag to unit mapping
export const StoryFlagToUnitSchema = z.record(
  z.string().min(1),
  z.string().min(1).regex(/^[a-z-]+$/, 'Unit ID must be kebab-case')
);

// Schema for story flag to Djinn mapping
export const StoryFlagToDjinnSchema = z.record(
  z.string().min(1),
  z.string().min(1).regex(/^[a-z-]+$/, 'Djinn ID must be kebab-case')
);

export type StoryFlagToUnit = z.infer<typeof StoryFlagToUnitSchema>;
export type StoryFlagToDjinn = z.infer<typeof StoryFlagToDjinnSchema>;