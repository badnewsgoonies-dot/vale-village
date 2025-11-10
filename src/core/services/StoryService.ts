import { Result, Ok, Err } from '@/utils/Result';
import type { StoryFlags } from '@/context/types';

/**
 * Story Service - Pure business logic for story progression
 */
export class StoryService {
  /**
   * Set a story flag
   */
  static setStoryFlag(
    flags: StoryFlags,
    flagName: keyof StoryFlags,
    value: boolean
  ): Result<StoryFlags, string> {
    if (!(flagName in flags)) {
      return Err(`Story flag ${String(flagName)} does not exist`);
    }
    
    return Ok({
      ...flags,
      [flagName]: value,
    });
  }
  
  /**
   * Check if story flag is set
   */
  static hasStoryFlag(
    flags: StoryFlags,
    flagName: keyof StoryFlags
  ): boolean {
    return flags[flagName] === true;
  }
  
  /**
   * Check if multiple story flags are all set
   */
  static hasAllStoryFlags(
    flags: StoryFlags,
    flagNames: (keyof StoryFlags)[]
  ): boolean {
    return flagNames.every(name => flags[name] === true);
  }
  
  /**
   * Check if any story flag is set
   */
  static hasAnyStoryFlag(
    flags: StoryFlags,
    flagNames: (keyof StoryFlags)[]
  ): boolean {
    return flagNames.some(name => flags[name] === true);
  }
}


