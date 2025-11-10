import { Result, Ok, Err } from '@/utils/Result';
import type { BattleState } from '@/types/Battle';
import type { Team } from '@/types/Team';
import type { Unit } from '@/types/Unit';
import { createBattleState } from '@/types/Battle';

/**
 * Battle Service - Pure business logic for battle operations
 * This will be expanded as we extract battle logic from components
 */
export class BattleService {
  /**
   * Initialize a new battle
   */
  static initializeBattle(
    playerTeam: Team,
    enemies: Unit[]
  ): Result<BattleState, string> {
    if (enemies.length === 0) {
      return Err('Cannot start battle with no enemies');
    }
    
    if (playerTeam.units.length === 0) {
      return Err('Cannot start battle with no party members');
    }
    
    const battleState = createBattleState(playerTeam, enemies);
    
    return Ok(battleState);
  }
  
  /**
   * Validate battle action
   * TODO: Expand this as we extract more battle logic
   */
  static validateAction(
    battle: BattleState,
    action: unknown
  ): Result<void, string> {
    // Placeholder - will be expanded
    return Ok(undefined);
  }
}


