/**
 * Z-Index Layer Constants for Overworld Rendering
 *
 * Defines the rendering order for all overworld elements.
 * Higher values render on top of lower values.
 */

export const LAYER_Z_INDEX = {
  // Base terrain layer
  TERRAIN: 0,

  // Terrain shadows (cast by buildings/props)
  TERRAIN_SHADOWS: 5,

  // Buildings and structures
  BUILDINGS: 10,
  BUILDING_SHADOWS: 8,

  // Vegetation and props
  PROPS: 15,
  PROPS_BLOCKING: 16,
  PROP_SHADOWS: 13,

  // Dynamic entities (sorted by Y position)
  ENTITIES_BASE: 20,
  PLAYER: 25,

  // Effects and overlays
  PARTICLE_EFFECTS: 30,
  WEATHER_EFFECTS: 35,

  // UI overlays (always on top)
  DIALOGUE_OVERLAY: 100,
  MENU_OVERLAY: 110,
} as const;

/**
 * Get entity z-index based on Y position for proper depth sorting
 */
export function getEntityZIndex(y: number): number {
  return LAYER_Z_INDEX.ENTITIES_BASE + y * 0.1;
}

/**
 * Get player z-index based on Y position
 */
export function getPlayerZIndex(y: number): number {
  return LAYER_Z_INDEX.PLAYER + y * 0.1;
}
