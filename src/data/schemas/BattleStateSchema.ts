import { z } from 'zod';
import { TeamSchema } from './TeamSchema';
import { UnitSchema } from './UnitSchema';
import { MIN_PARTY_SIZE, MAX_PARTY_SIZE } from '../../core/constants';

/**
 * Zod schema for BattleResult
 */
export const BattleResultSchema = z.enum(['PLAYER_VICTORY', 'PLAYER_DEFEAT']);

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
  currentQueueIndex: z.number().int().min(0), // Max validated in superRefine
  queuedActions: z.array(QueuedActionSchema.nullable()).min(MIN_PARTY_SIZE).max(MAX_PARTY_SIZE), // 1-4 actions
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
  
  const teamSize = b.playerTeam.units.length;
  
  // Validate currentQueueIndex doesn't exceed team size
  if (b.currentQueueIndex >= teamSize) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      maximum: teamSize - 1,
      type: 'number',
      inclusive: true,
      path: ['currentQueueIndex'],
      message: `currentQueueIndex (${b.currentQueueIndex}) exceeds team size (${teamSize})`,
    });
  }
  
  // Validate queuedActions length matches team size
  if (b.queuedActions.length !== teamSize) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['queuedActions'],
      message: `queuedActions length (${b.queuedActions.length}) must match team size (${teamSize})`,
    });
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
    
    // Validate queuedActions reference valid unit indices
    if (action && i >= teamSize) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['queuedActions', i],
        message: `Queued action at index ${i} exceeds team size (${teamSize})`,
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

