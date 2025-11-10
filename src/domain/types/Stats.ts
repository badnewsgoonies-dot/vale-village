/**
 * Base stats for units
 * All stats from GAME_MECHANICS.md Section 1
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
 * Create empty stats (all zeros)
 */
export function emptyStats(): Stats {
  return { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 };
}

/**
 * Add two stat objects together
 */
export function addStats(a: Stats, b: Stats): Stats {
  return {
    hp: a.hp + b.hp,
    pp: a.pp + b.pp,
    atk: a.atk + b.atk,
    def: a.def + b.def,
    mag: a.mag + b.mag,
    spd: a.spd + b.spd,
  };
}

/**
 * Multiply stats by a scalar
 */
export function multiplyStats(stats: Stats, multiplier: number): Stats {
  return {
    hp: Math.floor(stats.hp * multiplier),
    pp: Math.floor(stats.pp * multiplier),
    atk: Math.floor(stats.atk * multiplier),
    def: Math.floor(stats.def * multiplier),
    mag: Math.floor(stats.mag * multiplier),
    spd: Math.floor(stats.spd * multiplier),
  };
}
