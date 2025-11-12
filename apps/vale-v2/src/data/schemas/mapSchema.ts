import { z } from 'zod';

export const PositionSchema = z.object({
  x: z.number().int().nonnegative(),
  y: z.number().int().nonnegative(),
});

export const TileSchema = z.object({
  type: z.enum(['grass', 'path', 'water', 'wall', 'door', 'npc', 'trigger']),
  walkable: z.boolean(),
  spriteId: z.string().optional(),
  triggerId: z.string().optional(),
});

export const NPCSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: PositionSchema,
  spriteId: z.string(),
});

export const MapTriggerSchema = z.object({
  id: z.string(),
  position: PositionSchema,
  type: z.enum(['battle', 'npc', 'transition', 'story', 'shop']),
  data: z.record(z.unknown()),
});

export const MapSchema = z.object({
  id: z.string(),
  name: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  tiles: z.array(z.array(TileSchema)).refine((rows) => rows.length > 0, { message: 'Map must have at least one row' }),
  npcs: z.array(NPCSchema),
  triggers: z.array(MapTriggerSchema),
  spawnPoint: PositionSchema,
});

export type GameMap = z.infer<typeof MapSchema>;
export type Tile = z.infer<typeof TileSchema>;
export type MapTrigger = z.infer<typeof MapTriggerSchema>;
export type NPC = z.infer<typeof NPCSchema>;
export type Position = z.infer<typeof PositionSchema>;
