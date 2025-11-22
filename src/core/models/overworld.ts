import type { GameMap as SchemaGameMap, MapTrigger as SchemaMapTrigger, NPC as SchemaNPC, Tile as SchemaTile, Position as SchemaPosition } from '@/data/schemas/mapSchema';

export type Position = SchemaPosition;
export type Tile = SchemaTile;
export type MapTrigger = SchemaMapTrigger;
export type NPC = SchemaNPC;
export type GameMap = SchemaGameMap;
