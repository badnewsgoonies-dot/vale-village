/**
 * Utility to convert Enemy definitions to Unit instances for battle
 * Enemies are simpler data structures that get converted to full Unit objects
 */

import type { Enemy } from '../../data/schemas/EnemySchema';
import type { UnitDefinition } from '../../data/schemas/UnitSchema';
import { createUnit } from '../models/Unit';

/**
 * Convert an Enemy definition to a Unit instance for battle
 * Enemies have fixed stats (no growth rates) and simplified structure
 */
export function enemyToUnit(enemy: Enemy, level?: number): ReturnType<typeof createUnit> {
  const unitDef: UnitDefinition = {
    id: enemy.id,
    name: enemy.name,
    element: enemy.element,
    role: 'Pure DPS', // Enemies use generic role
    baseStats: enemy.stats,
    growthRates: {
      hp: 0,
      pp: 0,
      atk: 0,
      def: 0,
      mag: 0,
      spd: 0,
    }, // No growth for enemies
    abilities: enemy.abilities,
    manaContribution: 0, // Enemies don't contribute to player mana pool
    description: `A ${enemy.name} enemy`,
    autoAttackTiming: 'same-turn',
  };

  return createUnit(unitDef, level ?? enemy.level, 0);
}
