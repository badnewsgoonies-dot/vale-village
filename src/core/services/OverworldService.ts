import { Result, Ok, Err } from '@/utils/Result';
import type { AreaId } from '@/types/Area';

/**
 * Overworld Service - Pure business logic for overworld operations
 */
export class OverworldService {
  /**
   * Validate area transition
   */
  static canEnterArea(
    areaId: AreaId,
    storyFlags: Record<string, boolean>
  ): Result<void, string> {
    // TODO: Add area unlock checks based on story flags
    // For now, all areas are accessible
    return Ok(undefined);
  }
  
  /**
   * Calculate random encounter chance
   */
  static calculateEncounterChance(steps: number): number {
    // 5% chance per step, capped at 50%
    return Math.min(0.05 * steps, 0.5);
  }
  
  /**
   * Check if random encounter should trigger
   */
  static shouldTriggerEncounter(steps: number, rng: () => number): boolean {
    const chance = this.calculateEncounterChance(steps);
    return rng() < chance;
  }
}


