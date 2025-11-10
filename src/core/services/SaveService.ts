import { Result, Ok, Err } from '@/utils/Result';
import type { GameState } from '@/context/types';

/**
 * Save Service - Handles game save/load operations
 */
export class SaveService {
  private static readonly SAVE_KEY = 'vale_chronicles_save';
  
  /**
   * Save game state to localStorage
   */
  static save(state: GameState): Result<void, string> {
    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem(this.SAVE_KEY, serialized);
      return Ok(undefined);
    } catch (error) {
      return Err(`Failed to save game: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Load game state from localStorage
   */
  static load(): Result<GameState, string> {
    try {
      const serialized = localStorage.getItem(this.SAVE_KEY);
      if (!serialized) {
        return Err('No save file found');
      }
      
      const state = JSON.parse(serialized) as GameState;
      return Ok(state);
    } catch (error) {
      return Err(`Failed to load game: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Check if save file exists
   */
  static hasSave(): boolean {
    return localStorage.getItem(this.SAVE_KEY) !== null;
  }
  
  /**
   * Delete save file
   */
  static deleteSave(): Result<void, string> {
    try {
      localStorage.removeItem(this.SAVE_KEY);
      return Ok(undefined);
    } catch (error) {
      return Err(`Failed to delete save: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}


