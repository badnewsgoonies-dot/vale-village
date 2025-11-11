# Story Narrator System

This directory contains all story content for Vale Village - the narrative that provides context for battles and training.

## Directory Structure

```
story/
├── narrator.ts              # Narrator character definitions
├── intro.ts                 # Game opening sequence
├── index.ts                 # Central registry of all scenes
├── chapters/                # Chapter introduction scenes
│   ├── chapter1.ts         # "The Adepts of Vale"
│   ├── chapter2.ts         # "Tournament of Elements"
│   └── chapter3.ts         # "The Ancient Challenge"
└── battle-intros/           # Pre-battle narrative scenes
    ├── first-battle.ts     # Tutorial battle context
    ├── training-match.ts   # Friendly sparring context
    ├── tournament.ts       # Tournament battle context
    └── sanctum-challenge.ts # Guardian battle context
```

## Philosophy

Vale Village is a **battle simulator**, not a quest-driven RPG. The story provides **context** for why battles happen:

- **Training**: Warriors honing their skills
- **Tournaments**: Competitive matches for glory
- **Challenges**: Testing yourself against ancient guardians
- **Sparring**: Learning from fellow Adepts

The narrative explains *why these warriors are fighting* without turning it into fetch quests.

## Usage

### Showing the Game Intro

```typescript
import { useStore } from '@/ui/state/store';
import { storyScenes } from '@/story';

const story = useStore(s => s.story);

if (!story.flags.intro_seen) {
  setScreen({ type: 'dialogue', scene: storyScenes['intro'] });
}
```

### Showing a Chapter Introduction

```typescript
const story = useStore(s => s.story);
const chapters: Record<number, string> = {
  1: 'chapter-1',
  2: 'chapter-2',
  3: 'chapter-3',
};

const nextScene = chapters[story.chapter];
if (nextScene) {
  setScreen({ type: 'dialogue', scene: storyScenes[nextScene] });
}
```

### Showing Pre-Battle Story

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
    setScreen({ type: 'dialogue', scene, onComplete: () => beginBattle(enemyIds) });
  } else {
    beginBattle(enemyIds);
  }
};
```

### Battle Contexts

The system recognizes different battle contexts:

- `'first-battle'` - Tutorial battle (only shows once)
- `'training-match'` - Friendly sparring
- `'tournament'` - Tournament matches
- `'sanctum-challenge'` - Guardian battles
- `'none'` - Skip battle intro

### Adding New Story Content

1. **Create the story file** in the appropriate directory:
   ```typescript
   // story/chapters/chapter4.ts
   import type { DialogueTree } from '@/types/Dialogue';

   export const chapter4Intro: DialogueTree = {
     npcId: 'chapter4-intro',
     startNode: 'start',
     nodes: {
       start: {
         id: 'start',
         speaker: '',
         text: '═══ Chapter 4: Your Chapter Title ═══',
         nextNode: 'next',
       },
       // ... more nodes
     },
   };
   ```

2. **Export from index.ts**:
   ```typescript
   import { chapter4Intro } from './chapters/chapter4';

   export const storyScenes: Record<string, DialogueTree> = {
     // ...existing scenes
     'chapter-4': chapter4Intro,
   };
   ```

3. **Add metadata** (optional):
   ```typescript
   export const sceneMetadata: StorySceneMetadata[] = [
     // ...existing metadata
     {
       id: 'chapter-4',
       type: 'chapter',
       title: 'Chapter 4: Your Title',
       description: 'Description of the chapter',
     },
   ];
   ```

4. **Trigger it** in your game code:
   ```typescript
   setScreen({ type: 'dialogue', scene: storyScenes['chapter-4'] });
   ```

## Integration with Dialogue System

Story scenes use the **same DialogueTree system** as NPC dialogues. This means:

- ✅ All dialogue features work (choices, branching, conditions, actions)
- ✅ Story scenes can trigger battles, set flags, give items
- ✅ Typewriter effect works automatically
- ✅ Same UI components (DialogueBox, DialogueScreen)

The only difference is **speaker name**:
- NPCs have speaker names: `speaker: 'Elder'`
- Narration has empty speaker: `speaker: ''`

## Typewriter Effect

The enhanced DialogueBox now includes:

- **Typewriter animation**: Text appears character-by-character (40 chars/sec)
- **Skip functionality**: Press Space/Enter to instantly show full text
- **Visual feedback**: Blinking cursor during typing
- **Smooth experience**: Same controls for both typing and advancing

To disable typewriter for specific dialogue:
```typescript
<DialogueBox
  dialogue="Instant text"
  enableTypewriter={false}
  // ...other props
/>
```

## Examples

See the existing files for examples:
- `intro.ts` - Sequential narration with flag setting
- `chapters/chapter1.ts` - Mix of narration and NPC dialogue
- `battle-intros/tournament.ts` - Build atmosphere before battles
