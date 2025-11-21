/**
 * Base types for models
 * These are shared across all models and must be POJOs (no classes)
 */

/**
 * Four elemental types from Golden Sun + Neutral
 */
export type Element = 'Venus' | 'Mars' | 'Mercury' | 'Jupiter' | 'Neutral';

/**
 * Base stats for units
 */
export interface Stats {
  hp: number;    // Hit Points
  pp: number;    // Psynergy Points (mana)
  atk: number;   // Attack (physical damage)
  def: number;   // Defense (physical and magic resistance)
  mag: number;   // Magic (elemental damage and healing)
  spd: number;   // Speed (turn order)
}

/**
 * Growth rates - how much each stat increases per level
 */
export type GrowthRates = Stats;

/**
 * Unit role types
 */
export type UnitRole =
  | 'Balanced Warrior'
  | 'Pure DPS'
  | 'Elemental Mage'
  | 'Healer'
  | 'Rogue Assassin'
  | 'AoE Fire Mage'
  | 'Support Buffer'
  | 'Defensive Tank'
  | 'Versatile Scholar'
  | 'Master Warrior';

/**
 * Active status effect
 * Re-exported from UnitSchema to ensure single source of truth with Zod validation
 */
export type { StatusEffect } from '../../data/schemas/UnitSchema';

/**
 * Djinn states during battle
 */
export type DjinnState = 'Set' | 'Standby' | 'Recovery'; // Recovery state exists for compatibility but current flow is Set ↔ Standby

export interface Position {
  x: number;
  y: number;
}
