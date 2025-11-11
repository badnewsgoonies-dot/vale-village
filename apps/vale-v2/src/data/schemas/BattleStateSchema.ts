import { z } from 'zod';
import { TeamSchema } from './TeamSchema';
import { UnitSchema } from './UnitSchema';

/**
 * Zod schema for BattleResult
 */
export const BattleResultSchema = z.enum(['PLAYER_VICTORY', 'PLAYER_DEFEAT', 'PLAYER_FLEE']);

/**
 * Zod schema for BattleStatus
 */
export const BattleStatusSchema = z.union([
  z.literal('ongoing'),
  BattleResultSchema,
]);

/**
 * Zod schema for QueuedAction
 */
export const QueuedActionSchema = z.object({
  unitId: z.string().min(1),
  abilityId: z.string().nullable(),
  targetIds: z.array(z.string().min(1)),
  manaCost: z.number().int().min(0).max(10),
});

/**
 * Zod schema for BattlePhase
 */
export const BattlePhaseSchema = z.enum(['planning', 'executing', 'victory', 'defeat']);

/**
 * Zod schema for BattleState
 * PR-QUEUE-BATTLE: Extended with queue-based battle system fields
 */
export const BattleStateSchema = z.object({
  playerTeam: TeamSchema,
  enemies: z.array(UnitSchema).min(1),  // At least 1 enemy
  currentTurn: z.number().int().min(0),
  roundNumber: z.number().int().min(1),
  phase: BattlePhaseSchema,
  turnOrder: z.array(z.string().min(1)),  // Array of unit IDs
  currentActorIndex: z.number().int().min(0),
  status: BattleStatusSchema,
  log: z.array(z.string()),
  
  // Queue-based battle system fields
  currentQueueIndex: z.number().int().min(0).max(3),
  queuedActions: z.array(QueuedActionSchema.nullable()).length(4),
  queuedDjinn: z.array(z.string().min(1)),
  remainingMana: z.number().int().min(0),
  maxMana: z.number().int().min(0),
  executionIndex: z.number().int().min(0),
  djinnRecoveryTimers: z.record(z.string(), z.number().int().min(0)),
  
  // Legacy fields
  isBossBattle: z.boolean().optional(),
  npcId: z.string().optional(),
  encounterId: z.string().optional(),
  meta: z.object({
    encounterId: z.string(),
    difficulty: z.enum(['normal', 'elite', 'boss']).optional(),
  }).optional(),
}).superRefine((b, ctx) => {
  // BattleState turn order IDs must exist
  const teamIds = b.playerTeam.units.map(u => u.id);
  const enemyIds = b.enemies.map(u => u.id);
  const known = new Set([...teamIds, ...enemyIds]);
  
  for (const [i, id] of b.turnOrder.entries()) {
    if (!known.has(id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['turnOrder', i],
        message: `Unknown actor id: ${id}`,
      });
    }
  }
  
  // Validate queued actions reference valid unit IDs
  for (const [i, action] of b.queuedActions.entries()) {
    if (action && !teamIds.includes(action.unitId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['queuedActions', i, 'unitId'],
        message: `Queued action references unknown unit: ${action.unitId}`,
      });
    }
  }
  
  // Validate remainingMana doesn't exceed maxMana
  if (b.remainingMana > b.maxMana) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['remainingMana'],
      message: `remainingMana (${b.remainingMana}) exceeds maxMana (${b.maxMana})`,
    });
  }
});

export type BattleState = z.infer<typeof BattleStateSchema>;
export type BattleResult = z.infer<typeof BattleResultSchema>;
export type BattleStatus = z.infer<typeof BattleStatusSchema>;

