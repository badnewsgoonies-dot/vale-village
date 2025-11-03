import type { Element } from './Element';

/**
 * Ability types from GAME_MECHANICS.md Section 5.1
 */
export type AbilityType =
  | 'physical'   // Physical attack using ATK stat
  | 'psynergy'   // Psynergy attack using MAG stat, costs PP
  | 'healing'    // Healing using MAG stat, costs PP
  | 'buff'       // Buff allies, costs PP
  | 'debuff'     // Debuff enemies, costs PP
  | 'summon';    // Summon (requires Djinn), costs PP

/**
 * Target types for abilities
 */
export type AbilityTarget =
  | 'single-enemy'
  | 'all-enemies'
  | 'single-ally'
  | 'all-allies'
  | 'self';

/**
 * Ability definition
 */
export interface Ability {
  id: string;
  name: string;
  type: AbilityType;
  element?: Element;
  ppCost: number;
  basePower: number;
  targets: AbilityTarget;
  unlockLevel: number;
  description: string;

  // Special properties
  chainDamage?: boolean;        // For Plasma (hits chain)
  revivesFallen?: boolean;      // For Glacial Blessing
  buffEffect?: {
    atk?: number;
    def?: number;
    mag?: number;
    spd?: number;
    evasion?: number;
  };
  duration?: number;            // For buffs/debuffs (turns)
}

/**
 * Create a basic physical attack ability
 */
export function createPhysicalAttack(name: string): Ability {
  return {
    id: name.toLowerCase(),
    name,
    type: 'physical',
    ppCost: 0,
    basePower: 0, // Uses unit's ATK
    targets: 'single-enemy',
    unlockLevel: 1,
    description: 'Basic physical attack',
  };
}
