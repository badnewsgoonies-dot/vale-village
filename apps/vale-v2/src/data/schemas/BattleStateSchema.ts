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
 * Zod schema for BattleState
 */
export const BattleStateSchema = z.object({
  playerTeam: TeamSchema,
  enemies: z.array(UnitSchema).min(1),  // At least 1 enemy
  currentTurn: z.number().int().min(0),
  turnOrder: z.array(z.string().min(1)),  // Array of unit IDs
  currentActorIndex: z.number().int().min(0),
  status: BattleStatusSchema,
  log: z.array(z.string()),
  isBossBattle: z.boolean().optional(),
  npcId: z.string().optional(),
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
});

export type BattleState = z.infer<typeof BattleStateSchema>;
export type BattleResult = z.infer<typeof BattleResultSchema>;
export type BattleStatus = z.infer<typeof BattleStatusSchema>;

