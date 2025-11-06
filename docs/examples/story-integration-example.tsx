/**
 * Example: Integrating Story System with Title Screen
 *
 * This shows how to add a "New Game" flow that plays the intro
 * scene before starting the game.
 */

import React from 'react';
import { useGame } from '@/context/GameContext';
import { StoryManager } from '@/services/StoryManager';

/**
 * EXAMPLE 1: Enhanced Title Screen with Story Intro
 */
export const TitleScreenWithIntro: React.FC = () => {
  const { state, actions } = useGame();

  const handleNewGame = () => {
    // Check if intro has been seen
    if (StoryManager.shouldShowIntro(state)) {
      // Show intro scene (will navigate to OVERWORLD after it ends)
      actions.navigate({ type: 'DIALOGUE', npcId: 'intro' });
    } else {
      // Skip intro, go straight to game
      actions.navigate({ type: 'OVERWORLD' });
    }
  };

  const handleContinue = () => {
    // Continue from where player left off
    actions.navigate({ type: 'OVERWORLD' });
  };

  return (
    <div className="title-screen">
      <h1>Vale Village</h1>
      <div className="menu">
        <button onClick={handleNewGame}>
          {state.storyFlags.intro_seen ? 'New Game' : 'Start Adventure'}
        </button>
        <button onClick={handleContinue}>Continue</button>
      </div>
    </div>
  );
};

/**
 * EXAMPLE 2: NPC with Chapter Trigger
 *
 * This shows how to add an NPC that triggers a chapter intro
 */
export const createChapterTriggerNPC = () => ({
  id: 'herald',
  x: 900,
  y: 700,
  sprite: '/sprites/overworld/majornpcs/Herald.gif',
  type: 'npc' as const,
  blocking: true,
  onInteract: () => {
    // This NPC triggers Chapter 2 when talked to
    return { type: 'DIALOGUE' as const, npcId: 'chapter-2' };
  },
});

/**
 * EXAMPLE 3: Battle Start with Story Context
 *
 * This shows how to wrap battle starting to include story scenes
 */
export const useBattleWithStory = () => {
  const { state, actions } = useGame();

  const startBattleWithStory = (
    enemyIds: string[],
    explicitContext?: 'training-match' | 'tournament' | 'sanctum-challenge'
  ) => {
    // Get appropriate battle intro scene
    const context = explicitContext ||
      StoryManager.inferBattleContext(enemyIds, state.storyFlags, state.currentLocation);

    const battleIntroId = StoryManager.getBattleIntroScene(context, state.storyFlags);

    if (battleIntroId) {
      // Show battle context story first
      // The story scene will start the battle via a dialogue action
      actions.navigate({ type: 'DIALOGUE', npcId: battleIntroId });
    } else {
      // No story context needed, start battle directly
      actions.startBattle(enemyIds);
    }
  };

  return { startBattleWithStory };
};

/**
 * EXAMPLE 4: NPC Dialogue That Leads to Battle with Story
 *
 * This shows how an NPC can trigger a battle intro scene
 */
export const garetWithBattleStory = {
  npcId: 'garet',
  startNode: 'greeting',
  nodes: {
    greeting: {
      id: 'greeting',
      speaker: 'Garet',
      text: 'Hey! Want to have a training match?',
      portrait: '/sprites/overworld/protagonists/Garet.gif',
      choices: [
        {
          text: 'Yes, let\'s battle!',
          nextNode: 'start-battle-with-story',
        },
        {
          text: 'Maybe later.',
          nextNode: 'goodbye',
          action: { type: 'END_DIALOGUE' as const },
        },
      ],
    },
    'start-battle-with-story': {
      id: 'start-battle-with-story',
      speaker: 'Garet',
      text: 'Alright! Let me prepare...',
      portrait: '/sprites/overworld/protagonists/Garet.gif',
      // Instead of directly starting battle, navigate to battle intro scene
      action: {
        type: 'NAVIGATE' as const,
        screen: 'DIALOGUE' as const,
        // This would need to be supported in the action type
        // Or use a custom action that the DialogueScreen handles
      },
      nextNode: 'battle-intro-trigger',
    },
    'battle-intro-trigger': {
      id: 'battle-intro-trigger',
      speaker: '',
      text: '', // Invisible node
      // This navigates to the training match intro
      // which then starts the battle
      action: {
        type: 'NAVIGATE' as const,
        screen: 'DIALOGUE' as const,
        // Alternative: trigger via custom logic
      },
    },
    goodbye: {
      id: 'goodbye',
      speaker: 'Garet',
      text: 'See you around!',
      portrait: '/sprites/overworld/protagonists/Garet.gif',
      action: { type: 'END_DIALOGUE' as const },
    },
  },
};

/**
 * EXAMPLE 5: Simple Story Scene Trigger from Overworld
 *
 * Add this to your overworld's mapEntities array
 */
export const storyBookInteractive = {
  id: 'story-book',
  x: 950,
  y: 320,
  sprite: '/sprites/interactive/book.gif',
  type: 'interactive' as const,
  blocking: true,
  label: 'Chronicle of Vale',
  onInteract: () => {
    // Clicking the book shows chapter 1
    return { type: 'DIALOGUE' as const, npcId: 'chapter-1' };
  },
};

/**
 * EXAMPLE 6: Testing Story Scenes
 *
 * Helper component for development/testing
 */
export const StorySceneTester: React.FC = () => {
  const { actions } = useGame();

  const testScenes = [
    { id: 'intro', name: 'Game Intro' },
    { id: 'chapter-1', name: 'Chapter 1' },
    { id: 'chapter-2', name: 'Chapter 2' },
    { id: 'chapter-3', name: 'Chapter 3' },
    { id: 'first-battle', name: 'First Battle Intro' },
    { id: 'training-match', name: 'Training Match Intro' },
    { id: 'tournament', name: 'Tournament Intro' },
    { id: 'sanctum-challenge', name: 'Sanctum Challenge Intro' },
  ];

  return (
    <div className="story-scene-tester" style={{
      position: 'fixed',
      top: 10,
      right: 10,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: 10,
      borderRadius: 5,
      zIndex: 9999,
    }}>
      <h3>Story Scene Tester</h3>
      {testScenes.map(scene => (
        <button
          key={scene.id}
          onClick={() => actions.navigate({ type: 'DIALOGUE', npcId: scene.id })}
          style={{
            display: 'block',
            margin: '5px 0',
            padding: '5px 10px',
          }}
        >
          {scene.name}
        </button>
      ))}
    </div>
  );
};

/**
 * EXAMPLE 7: Custom Hook for Story Management
 */
export const useStorySystem = () => {
  const { state, actions } = useGame();

  const showIntroIfNeeded = () => {
    if (StoryManager.shouldShowIntro(state)) {
      actions.navigate({ type: 'DIALOGUE', npcId: 'intro' });
      return true;
    }
    return false;
  };

  const showChapter = (chapterNum: 1 | 2 | 3) => {
    actions.navigate({ type: 'DIALOGUE', npcId: `chapter-${chapterNum}` });
  };

  const showBattleIntro = (
    context: 'first-battle' | 'training-match' | 'tournament' | 'sanctum-challenge'
  ) => {
    actions.navigate({ type: 'DIALOGUE', npcId: context });
  };

  return {
    showIntroIfNeeded,
    showChapter,
    showBattleIntro,
    hasSeenIntro: state.storyFlags.intro_seen,
  };
};

/**
 * USAGE in your components:
 *
 * const { showIntroIfNeeded, showChapter } = useStorySystem();
 *
 * // In title screen
 * const handleNewGame = () => {
 *   if (!showIntroIfNeeded()) {
 *     actions.navigate({ type: 'OVERWORLD' });
 *   }
 * };
 *
 * // Trigger chapter from NPC
 * const handleElderInteraction = () => {
 *   showChapter(2);
 * };
 */
