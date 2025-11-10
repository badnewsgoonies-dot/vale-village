import { Result, Ok, Err } from '@/utils/Result';
import type { Djinn } from '@/types/Djinn';
import { calculateDjinnSynergy, type DjinnSynergy } from '@/types/Djinn';

/**
 * Djinn Service - Pure business logic for Djinn operations
 */
export class DjinnService {
  /**
   * Equip Djinn to team (max 3)
   */
  static equipDjinn(
    djinnCollected: Djinn[],
    equippedDjinnIds: string[],
    djinnId: string
  ): Result<string[], string> {
    // Check if Djinn is collected
    const djinn = djinnCollected.find(d => d.id === djinnId);
    if (!djinn) {
      return Err(`Djinn ${djinnId} not collected`);
    }
    
    // Check if already equipped
    if (equippedDjinnIds.includes(djinnId)) {
      return Err(`Djinn ${djinnId} already equipped`);
    }
    
    // Check if max equipped (3)
    if (equippedDjinnIds.length >= 3) {
      return Err('Maximum 3 Djinn can be equipped');
    }
    
    return Ok([...equippedDjinnIds, djinnId]);
  }
  
  /**
   * Unequip Djinn from team
   */
  static unequipDjinn(
    equippedDjinnIds: string[],
    djinnId: string
  ): Result<string[], string> {
    if (!equippedDjinnIds.includes(djinnId)) {
      return Err(`Djinn ${djinnId} not equipped`);
    }
    
    return Ok(equippedDjinnIds.filter(id => id !== djinnId));
  }
  
  /**
   * Calculate Djinn synergy for equipped Djinn
   */
  static calculateSynergy(
    djinnCollected: Djinn[],
    equippedDjinnIds: string[]
  ): DjinnSynergy {
    const equippedDjinn = djinnCollected.filter(d => 
      equippedDjinnIds.includes(d.id)
    );
    
    return calculateDjinnSynergy(equippedDjinn);
  }
  
  /**
   * Give Djinn to player (add to collection)
   */
  static giveDjinn(
    djinnCollected: Djinn[],
    djinn: Djinn
  ): Result<Djinn[], string> {
    // Check if already collected
    if (djinnCollected.some(d => d.id === djinn.id)) {
      return Err(`Djinn ${djinn.id} already collected`);
    }
    
    return Ok([...djinnCollected, djinn]);
  }
}


