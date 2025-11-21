import { z } from 'zod';
import { BattleStateSchema } from './BattleStateSchema';
import { TeamSchema } from './TeamSchema';

/**
 * Save Version Schema
 */
export const SaveVersionSchema = z.object({
  major: z.number().int().min(0),
  minor: z.number().int().min(0),
});

/**
 * Story State Schema
 * Matches StoryState interface from core/models/story.ts
 */
const StoryStateSchema = z.object({
  chapter: z.number().int().min(1),
  flags: z.record(z.string(), z.union([z.boolean(), z.number()])),
});

/**
 * Game State Snapshot Schema
 */
const GameStateSnapshotSchema = z.object({
  battle: BattleStateSchema.nullable(),
  team: TeamSchema,
  story: StoryStateSchema,
  gold: z.number().int().min(0),
  unitsCollected: z.array(z.string()),
});

/**
 * Save Envelope Schema
 */
export const SaveEnvelopeSchema = z.object({
  version: SaveVersionSchema,
  seed: z.number().int(),
  timestamp: z.number().int().positive(),
  state: GameStateSnapshotSchema,
  notes: z.string().optional(),
});

/**
 * Player Command Schema
 */
const PlayerCommandSchema = z.object({
  type: z.enum(['ability', 'end-turn', 'flee']),
  turn: z.number().int().min(0),
  actorId: z.string().min(1),
  abilityId: z.string().optional(),
  targetIds: z.array(z.string()).optional(),
});

/**
 * System Tick Schema
 */
const SystemTickSchema = z.object({
  type: z.enum(['status-tick', 'ai-action']),
  turn: z.number().int().min(0),
  actorId: z.string().min(1),
  abilityId: z.string().optional(),
  targetIds: z.array(z.string()).optional(),
});

/**
 * Replay Tape Schema
 */
export const ReplayTapeSchema = z.object({
  seed: z.number().int(),
  initial: GameStateSnapshotSchema,
  inputs: z.array(z.union([PlayerCommandSchema, SystemTickSchema])),
  engineVersion: SaveVersionSchema,
  dataVersion: SaveVersionSchema,
});

export type ValidatedReplayTape = z.infer<typeof ReplayTapeSchema>;
export type ValidatedSaveEnvelope = z.infer<typeof SaveEnvelopeSchema>;
