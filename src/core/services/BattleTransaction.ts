/**
 * BattleTransaction - Simple transaction support for battle state
 * Allows rollback of state changes when operations fail
 */

import type { BattleState } from '../models/BattleState';

/**
 * Transaction class for managing battle state changes
 * Provides commit/rollback functionality
 */
export class BattleTransaction {
  private snapshot: BattleState | null = null;

  /**
   * Begin a new transaction by saving current state
   * @param state - The current battle state to snapshot
   */
  begin(state: BattleState): void {
    // State is immutable, so we can safely store a reference
    this.snapshot = state;
  }

  /**
   * Rollback to the saved state
   * @returns The original state or null if no transaction
   */
  rollback(): BattleState | null {
    return this.snapshot;
  }

  /**
   * Commit the transaction by clearing the snapshot
   * Called when operation succeeds
   */
  commit(): void {
    this.snapshot = null;
  }

  /**
   * Check if a transaction is active
   */
  hasSnapshot(): boolean {
    return this.snapshot !== null;
  }
}