import { z } from 'zod';
import { UnitSchema, DjinnStateSchema } from './UnitSchema';
import { EquipmentSchema } from './EquipmentSchema';
import { MIN_PARTY_SIZE, MAX_PARTY_SIZE } from '../../core/constants';

/**
 * Djinn Tracker schema for team-wide Djinn state
 */
const DjinnTrackerSchema = z.object({
  djinnId: z.string().min(1),
  state: DjinnStateSchema,
  lastActivatedTurn: z.number().int(),
});

/**
 * NPC State schema
 * Defines valid states for NPCs in the overworld
 */
const NPCStateSchema = z.object({
  defeated: z.boolean().optional(),
  dialogueSeen: z.boolean().optional(),
  questProgress: z.number().int().min(0).optional(),
  lastInteraction: z.number().int().optional(),
  customData: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
});

const TowerRecordSchema = z.object({
  highestFloorEver: z.number().int().min(0).default(0),
  totalRuns: z.number().int().min(0).default(0),
  bestRunTurns: z.number().int().min(0).nullable().default(null),
  bestRunDamageDealt: z.number().int().min(0).nullable().default(null),
});

/**
 * Save file version 1 schema
 * This is the initial save format for the v2 app
 */
export const SaveV1Schema = z.object({
  version: z.literal('1.0.0'),
  timestamp: z.number().int().positive(),
  chapter: z.number().int().min(1).default(1),  // Story chapter (defaults to 1 for backward compatibility)

  // Player progress
  playerData: z.object({
    unitsCollected: z.array(UnitSchema).max(10),  // Up to 10 units
    activeParty: z.array(z.string().min(1)).min(MIN_PARTY_SIZE).max(MAX_PARTY_SIZE),  // 1-4 unit IDs
    inventory: z.array(EquipmentSchema),  // Equipment inventory
    gold: z.number().int().min(0),
    djinnCollected: z.array(z.string().min(1)).max(12),  // Up to 12 Djinn IDs
    equippedDjinn: z.array(z.string().min(1)).max(3).optional(),  // Up to 3 equipped Djinn IDs
    djinnTrackers: z.record(z.string(), DjinnTrackerSchema).optional(),  // Djinn state tracking
    recruitmentFlags: z.record(z.string(), z.boolean()),
    storyFlags: z.record(z.string(), z.boolean()),
  }),

  // Overworld state
  overworldState: z.object({
    playerPosition: z.object({
      x: z.number(),
      y: z.number(),
    }),
    currentScene: z.string().min(1),
    npcStates: z.record(z.string(), NPCStateSchema),  // Properly typed NPC states
  }),

  // Statistics
  stats: z.object({
    battlesWon: z.number().int().min(0),
    battlesLost: z.number().int().min(0),
    totalDamageDealt: z.number().int().min(0),
    totalHealingDone: z.number().int().min(0),
    playtime: z.number().int().min(0),  // Seconds
  }),
  towerStats: TowerRecordSchema.optional(),
});

export type SaveV1 = z.infer<typeof SaveV1Schema>;

