# Story System Integration Guide

This guide shows how to integrate the story narrator system into Vale Village's game flow.

## Quick Start

The story system is now fully integrated with the dialogue system. All story scenes can be triggered using:

```typescript
actions.navigate({ type: 'DIALOGUE', npcId: 'story-scene-id' });
```

## Available Story Scenes

### Game Intro
- **ID**: `'intro'`
- **When**: First time playing the game
- **Triggers**: Sets `intro_seen` flag

### Chapters
- **Chapter 1**: `'chapter-1'` - "The Adepts of Vale"
- **Chapter 2**: `'chapter-2'` - "Tournament of Elements"
- **Chapter 3**: `'chapter-3'` - "The Ancient Challenge"

### Battle Intros
- **First Battle**: `'first-battle'` - Tutorial battle context
- **Training Match**: `'training-match'` - Friendly sparring
- **Tournament**: `'tournament'` - Tournament battles
- **Sanctum Challenge**: `'sanctum-challenge'` - Guardian battles

## Integration Examples

### 1. Show Intro on First Game Start

In `GameProvider.tsx` or `TitleScreen.tsx`:

```typescript
import { StoryManager } from '@/services/StoryManager';

// When starting new game
const handleStartGame = () => {
  if (StoryManager.shouldShowIntro(state)) {
    // Show intro scene first
    actions.navigate({ type: 'DIALOGUE', npcId: 'intro' });
    // After intro, it will navigate to OVERWORLD via the scene's action
  } else {
    // Skip straight to gameplay
    actions.navigate({ type: 'OVERWORLD' });
  }
};
```

### 2. Trigger Chapter Intros

You can trigger chapters manually or based on game progression:

```typescript
// Manual trigger (e.g., from a button or after specific event)
actions.navigate({ type: 'DIALOGUE', npcId: 'chapter-1' });

// Or use StoryManager to auto-determine
const nextChapter = StoryManager.getNextChapterScene(state);
if (nextChapter) {
  actions.navigate({ type: 'DIALOGUE', npcId: nextChapter });
}
```

### 3. Show Battle Context Before Battles

**Option A: Automatic Context Detection**

```typescript
import { getPreBattleStoryScene } from '@/services/StoryManager';

// In your battle start function
const startBattleWithContext = (enemyIds: string[]) => {
  const battleIntro = getPreBattleStoryScene(enemyIds, state);

  if (battleIntro) {
    // Show battle context first, then battle starts via dialogue action
    actions.navigate({ type: 'DIALOGUE', npcId: battleIntro });
  } else {
    // No context needed, start battle directly
    actions.startBattle(enemyIds);
  }
};
```

**Option B: Explicit Context**

```typescript
import { getPreBattleStoryScene } from '@/services/StoryManager';

// When starting a tournament battle
const battleIntro = getPreBattleStoryScene(
  enemyIds,
  state,
  'tournament' // Explicit context
);

if (battleIntro) {
  actions.navigate({ type: 'DIALOGUE', npcId: battleIntro });
}
```

**Option C: Direct Scene ID**

```typescript
// Show specific battle intro
actions.navigate({ type: 'DIALOGUE', npcId: 'tournament' });
```

### 4. Chain Story Scenes with Battles

Story scenes can trigger battles using dialogue actions:

```typescript
// In a story scene (already done in battle-intros/*.ts)
{
  id: 'ready-for-battle',
  speaker: 'Elder',
  text: 'Your opponent awaits. Step into the arena!',
  action: {
    type: 'START_BATTLE',
    enemyUnitIds: ['garet'],
  },
}
```

### 5. NPC-Triggered Story Scenes

NPCs can trigger story scenes through their dialogue:

```typescript
// In NPC dialogue tree
{
  id: 'important-moment',
  speaker: 'Elder',
  text: 'It is time for the next chapter of your journey.',
  action: {
    type: 'NAVIGATE',
    screen: 'DIALOGUE',
    npcId: 'chapter-2', // Trigger a story scene
  },
}
```

## Story Scene Structure

All story scenes follow the DialogueTree structure:

```typescript
export const myStoryScene: DialogueTree = {
  npcId: 'my-scene-id',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: '', // Empty for pure narration
      text: 'Narrative text here...',
      nextNode: 'next', // Or use choices/actions
    },
    next: {
      id: 'next',
      speaker: 'Elder', // Can mix narration with NPC dialogue
      text: 'NPC dialogue here...',
      portrait: '/sprites/overworld/majornpcs/Elder.gif',
      action: {
        type: 'END_DIALOGUE', // Or START_BATTLE, SET_FLAG, etc.
      },
    },
  },
};
```

## Practical Implementation Locations

### Title Screen (`TitleScreen.tsx`)
```typescript
// Add "New Game" button that checks for intro
const handleNewGame = () => {
  if (!state.storyFlags.intro_seen) {
    actions.navigate({ type: 'DIALOGUE', npcId: 'intro' });
  } else {
    actions.navigate({ type: 'OVERWORLD' });
  }
};
```

### Overworld (`ValeVillageOverworld.tsx`)
```typescript
// Add an NPC or location that triggers chapters
{
  id: 'chapter-trigger',
  x: 900,
  y: 700,
  sprite: '/sprites/interactive/book.gif',
  type: 'interactive',
  onInteract: () => {
    actions.navigate({ type: 'DIALOGUE', npcId: 'chapter-2' });
  },
}
```

### Battle System (`GameContext.tsx` or `BattleScreen.tsx`)
```typescript
// Enhance startBattle to include story context
const enhancedStartBattle = (enemyIds: string[], context?: BattleContext) => {
  const battleIntro = getPreBattleStoryScene(enemyIds, state, context);

  if (battleIntro) {
    // Show story first, battle starts via dialogue action
    actions.navigate({ type: 'DIALOGUE', npcId: battleIntro });
  } else {
    // Direct battle
    originalStartBattle(enemyIds);
  }
};
```

## Testing the Story System

### 1. Test the Intro
```typescript
// In browser console or test file
actions.navigate({ type: 'DIALOGUE', npcId: 'intro' });
```

### 2. Test Chapters
```typescript
actions.navigate({ type: 'DIALOGUE', npcId: 'chapter-1' });
actions.navigate({ type: 'DIALOGUE', npcId: 'chapter-2' });
actions.navigate({ type: 'DIALOGUE', npcId: 'chapter-3' });
```

### 3. Test Battle Intros
```typescript
actions.navigate({ type: 'DIALOGUE', npcId: 'first-battle' });
actions.navigate({ type: 'DIALOGUE', npcId: 'training-match' });
actions.navigate({ type: 'DIALOGUE', npcId: 'tournament' });
actions.navigate({ type: 'DIALOGUE', npcId: 'sanctum-challenge' });
```

## Typewriter Effect

The enhanced DialogueBox automatically shows:
- Character-by-character text animation (40 chars/sec - Golden Sun speed)
- Blinking cursor during typing
- "Hold to Skip" prompt while typing
- "Space/Enter" prompt when text is complete

No additional setup needed - it works automatically for all dialogue!

## Best Practices

1. **Keep narration concise** - 2-4 sentences per node
2. **Use empty speaker for pure narration** - `speaker: ''`
3. **Mix narration with NPC dialogue** - Build atmosphere then let characters speak
4. **Set flags appropriately** - Track which scenes have been viewed
5. **End with clear actions** - END_DIALOGUE, START_BATTLE, or NAVIGATE
6. **Test the flow** - Make sure scenes chain correctly

## Adding New Story Content

1. Create file in `story/` directory
2. Export from `story/index.ts`
3. Use in game via `actions.navigate({ type: 'DIALOGUE', npcId: 'your-id' })`

See `story/README.md` for detailed instructions on creating new scenes.
