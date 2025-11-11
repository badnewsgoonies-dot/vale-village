# Story System Integration Guide

This guide shows how to integrate the story narrator system into Vale Village's game flow.

## Quick Start

- Story scenes live in `story/index.ts` as plain `DialogueTree` objects (`storyScenes` export).
- `storySlice` (in `src/ui/state/storySlice.ts`) tracks chapter/flag state and exposes helpers such as `onBattleEvents` and `setShowCredits`.
- Your UI is responsible for rendering a Dialogue screen; feed it the `DialogueTree` for the desired scene ID.

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

In your title screen component:

```typescript
import { useStore } from '@/ui/state/store';
import { storyScenes } from '@/story';

const TitleScreen = () => {
  const story = useStore(s => s.story);
  const [screen, setScreen] = useScreenRouter(); // local router util

  const handleStartGame = () => {
    if (!story.flags.intro_seen) {
      setScreen({ type: 'dialogue', scene: storyScenes['intro'] });
    } else {
      setScreen({ type: 'queue-battle' });
    }
  };

  // ...
};
```

### 2. Trigger Chapter Intros

Trigger from any UI control once the relevant flag is set:

```typescript
const story = useStore(s => s.story);

const showNextChapter = () => {
  const map = { 1: 'chapter-1', 2: 'chapter-2', 3: 'chapter-3' } as const;
  const sceneId = map[story.chapter];
  if (sceneId) {
    setScreen({ type: 'dialogue', scene: storyScenes[sceneId] });
  }
};
```

### 3. Show Battle Context Before Battles

```typescript
const pickBattleScene = (encounterId: string): string | null => {
  if (encounterId.includes('boss')) return 'sanctum-challenge';
  if (encounterId.includes('tournament')) return 'tournament';
  return 'training-match';
};

const startBattleWithContext = (encounterId: string, enemyIds: string[]) => {
  const sceneId = pickBattleScene(encounterId);
  const scene = sceneId ? storyScenes[sceneId] : null;

  if (scene) {
    setScreen({
      type: 'dialogue',
      scene,
      onComplete: () => beginBattle(enemyIds),
    });
  } else {
    beginBattle(enemyIds);
  }
};
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

// Dialogue renderer example
if (action.type === 'NAVIGATE' && action.screen === 'DIALOGUE') {
  setScreen({ type: 'dialogue', scene: storyScenes[action.npcId] });
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

## State Hooks

- `src/ui/state/storySlice.ts` exposes `story`, `showCredits`, `setShowCredits`, and `onBattleEvents`.
- Call `useStore.getState().onBattleEvents(events)` whenever `QueueBattleService` emits `encounter-finished`/`battle-end` events (already wired inside the queue battle slice). This unlocks chapters automatically via `advanceChapter`.
- Use `story.flags` to gate UI (chapters, credits button, etc.).

## Practical Implementation Locations

### Title Screen (`TitleScreen.tsx`)
```typescript
const handleNewGame = () => {
  if (!story.flags.intro_seen) {
    setScreen({ type: 'dialogue', scene: storyScenes['intro'] });
  } else {
    setScreen({ type: 'queue-battle' });
  }
};
```

### Overworld (`ValeVillageOverworld.tsx`)
```typescript
const chapterTrigger = {
  id: 'chapter-trigger',
  x: 900,
  y: 700,
  sprite: '/sprites/interactive/book.gif',
  onInteract: () => {
    setScreen({ type: 'dialogue', scene: storyScenes['chapter-2'] });
  },
};
```

### Battle System (`QueueBattleView.tsx` integration)
```typescript
const startBattle = (encounterId: string, enemyIds: string[]) => {
  startBattleWithContext(encounterId, enemyIds); // helper from earlier section
};
```

## Testing the Story System

1. Render the dialogue UI with any scene ID:
   ```typescript
   setScreen({ type: 'dialogue', scene: storyScenes['intro'] });
   ```
2. Iterate through chapters:
   ```typescript
   ['chapter-1', 'chapter-2', 'chapter-3'].forEach(id => {
     setScreen({ type: 'dialogue', scene: storyScenes[id] });
   });
   ```
3. Verify battle intros by choosing each context scene:
   ```typescript
   ['first-battle', 'training-match', 'tournament', 'sanctum-challenge'].forEach(id => {
     setScreen({ type: 'dialogue', scene: storyScenes[id] });
   });
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
3. Use in game via `setScreen({ type: 'dialogue', scene: storyScenes['your-id'] })`

See `story/README.md` for detailed instructions on creating new scenes.
