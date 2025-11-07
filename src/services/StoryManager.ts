/**
 * Story Manager Service
 *
 * Orchestrates story scenes and narrative flow.
 * Determines when to show story content based on game state and events.
 *
 * Usage:
 * - StoryManager.shouldShowIntro(state) - Check if intro should play
 * - StoryManager.getBattleIntroScene(context) - Get appropriate battle intro
 * - StoryManager.getNextChapterScene(state) - Get next chapter to show
 */

import type { GameState, StoryFlags } from '@/context/types';
import { getStoryScene, sceneMetadata } from '../../story';

export type BattleContext =
  | 'first-battle'
  | 'training-match'
  | 'tournament'
  | 'sanctum-challenge'
  | 'none';

export class StoryManager {
  /**
   * Check if the game intro should be shown
   */
  static shouldShowIntro(state: GameState): boolean {
    return !state.storyFlags.intro_seen;
  }

  /**
   * Get the intro scene ID if it should be shown
   */
  static getIntroSceneId(state: GameState): string | null {
    return this.shouldShowIntro(state) ? 'intro' : null;
  }

  /**
   * Determine which battle intro scene to show based on context
   */
  static getBattleIntroScene(
    context: BattleContext,
    flags: StoryFlags
  ): string | null {
    switch (context) {
    case 'first-battle':
      // Show first battle tutorial only if not completed
      return !flags.tutorial_battle_complete ? 'first-battle' : null;

    case 'training-match':
      return 'training-match';

    case 'tournament':
      return 'tournament';

    case 'sanctum-challenge':
      return 'sanctum-challenge';

    case 'none':
    default:
      return null;
    }
  }

  /**
   * Determine which chapter intro should be shown next
   */
  static getNextChapterScene(state: GameState): string | null {
    const { storyFlags } = state;

    // Chapter 1: Beginning (after intro)
    if (storyFlags.intro_seen && !storyFlags.talked_to_elder_first_time) {
      return 'chapter-1';
    }

    // Chapter 2: Tournament (after some progress)
    // Could be triggered by a specific flag or event
    // For now, we'll leave this for manual triggering

    // Chapter 3: Ancient Challenge (late game)
    // Triggered when player is ready for sanctum

    return null;
  }

  /**
   * Check if a specific story scene has been viewed
   * (This would require adding viewed scenes to game state)
   */
  static hasViewedScene(sceneId: string, viewedScenes: Set<string>): boolean {
    return viewedScenes.has(sceneId);
  }

  /**
   * Get story scene by ID (wrapper around story index)
   */
  static getScene(sceneId: string) {
    return getStoryScene(sceneId);
  }

  /**
   * Get all available chapter scenes
   */
  static getChapterScenes() {
    return sceneMetadata.filter(scene => scene.type === 'chapter');
  }

  /**
   * Get all battle context scenes
   */
  static getBattleContextScenes() {
    return sceneMetadata.filter(scene => scene.type === 'battle-context');
  }

  /**
   * Infer battle context from enemy IDs or other parameters
   * This helps automatically select the right narrative
   */
  static inferBattleContext(
    _enemyIds: string[],
    flags: StoryFlags,
    location?: string
  ): BattleContext {
    // First battle (tutorial)
    if (!flags.tutorial_battle_complete) {
      return 'first-battle';
    }

    // Sanctum battles
    if (location === 'sol_sanctum') {
      return 'sanctum-challenge';
    }

    // Check if this is a tournament battle
    // (You could add a tournament_active flag)
    // if (flags.tournament_active) {
    //   return 'tournament';
    // }

    // Default to training match for friendly battles
    return 'training-match';
  }
}

/**
 * Helper function to trigger a story scene
 * Call this before showing dialogue to check if a story scene should play first
 */
export function getPreDialogueStoryScene(
  npcId: string,
  state: GameState
): string | null {
  // If talking to Elder for the first time, show Chapter 1
  if (npcId === 'elder' && !state.storyFlags.talked_to_elder_first_time) {
    // Don't auto-show chapter here - let the NPC dialogue handle it
    // Or return 'chapter-1' if you want it to auto-play
    return null;
  }

  // Add more NPC-specific story triggers here

  return null;
}

/**
 * Helper function to get battle intro scene
 */
export function getPreBattleStoryScene(
  enemyIds: string[],
  state: GameState,
  explicitContext?: BattleContext
): string | null {
  const context = explicitContext ||
    StoryManager.inferBattleContext(enemyIds, state.storyFlags, state.currentLocation);

  return StoryManager.getBattleIntroScene(context, state.storyFlags);
}
