/**
 * Sprite System Types
 * Decoupled from domain - UI layer only
 */

/**
 * Sprite ID format: `unit:${id}` | `enemy:${id}` | `fx:${id}`
 */
export type SpriteId = `unit:${string}` | `enemy:${string}` | `fx:${string}`;

/**
 * Sprite definition
 */
export interface SpriteDef {
  /** Path to sprite asset or atlas key */
  src: string;
  
  /** Number of frames (or per-state map) */
  frames: number | Partial<Record<'idle' | 'attack' | 'hurt' | 'cast' | 'downed', number[]>>;
  
  /** Frames per second for animation */
  fps?: number;
  
  /** Pivot point for rendering */
  pivot?: { x: number; y: number };
  
  /** Frame width (if using sprite sheet) */
  frameWidth?: number;
  
  /** Frame height (if using sprite sheet) */
  frameHeight?: number;
}

/**
 * Sprite state for animation
 */
export type SpriteState = 'idle' | 'attack' | 'hurt' | 'cast' | 'downed';

