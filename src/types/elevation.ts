/**
 * Elevation System for Vale Village
 * Creates pseudo-3D depth with multiple ground levels
 */

export enum ElevationLevel {
  LOWER = 0,  // Lower Plaza (-32px visual offset)
  MAIN = 1,   // Main Village (0px reference)
  UPPER = 2,  // Sacred Heights (+64px visual offset)
}

export interface ElevationConfig {
  level: ElevationLevel;
  visualOffset: number;  // Y-axis rendering offset in pixels
  lightingTint: string;  // CSS filter for lighting
  name: string;
}

export interface TransitionZone {
  id: string;
  type: 'stairs' | 'ladder';
  x: number;
  y: number;
  width: number;
  height: number;
  fromLevel: ElevationLevel;
  toLevel: ElevationLevel;
  sprite: string;
  interactionRange: number;
}

export interface ElevationEntity {
  id: string;
  x: number;
  y: number;
  elevation: ElevationLevel;
  sprite: string;
  type: 'building' | 'npc' | 'scenery' | 'interactive';
  blocking?: boolean;
  label?: string;
  onInteract?: () => void;
}

// Elevation configurations
export const ELEVATION_CONFIGS: Record<ElevationLevel, ElevationConfig> = {
  [ElevationLevel.LOWER]: {
    level: ElevationLevel.LOWER,
    visualOffset: -32,
    lightingTint: 'brightness(0.85) saturate(0.9)',
    name: 'Lower Plaza',
  },
  [ElevationLevel.MAIN]: {
    level: ElevationLevel.MAIN,
    visualOffset: 0,
    lightingTint: 'brightness(1.0) saturate(1.0)',
    name: 'Main Village',
  },
  [ElevationLevel.UPPER]: {
    level: ElevationLevel.UPPER,
    visualOffset: 64,
    lightingTint: 'brightness(1.15) saturate(1.1)',
    name: 'Sacred Heights',
  },
};
