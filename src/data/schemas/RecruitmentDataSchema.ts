import { z } from 'zod';

/**
 * Recruitment Data Schema
 * Validates encounter to recruitment dialogue mappings
 */

// Schema for encounter ID to recruitment dialogue ID mapping
export const EncounterToRecruitmentDialogueSchema = z.record(
  z.string().min(1).regex(/^[a-z0-9-]+$/, 'Encounter ID must be kebab-case'),
  z.string().min(1).regex(/^[a-z0-9-]+$/, 'Dialogue ID must be kebab-case')
);

export type EncounterToRecruitmentDialogue = z.infer<typeof EncounterToRecruitmentDialogueSchema>;