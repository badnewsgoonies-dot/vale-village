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
});

export type BattleState = z.infer<typeof BattleStateSchema>;
export type BattleResult = z.infer<typeof BattleResultSchema>;
export type BattleStatus = z.infer<typeof BattleStatusSchema>;

