# Create Storyboard Mockups for Vale Chronicles V2 Game Screens

## Context

I'm working on **Vale Chronicles V2**, a Golden Sun-inspired tactical RPG built with React/TypeScript. I have a working sprite mockup system (`SpriteMockup.tsx`) that can render pixel-perfect battle scenes using 1,627 cataloged sprites from Golden Sun assets.

**Current Sprite System:**
- `SimpleSprite` component for rendering sprites
- `BackgroundSprite` component for battle/overworld backgrounds
- Sprite catalog with categories: battle-party, battle-enemies, backgrounds-gs1/gs2, overworld-protagonists, icons-items, etc.
- Pixel-perfect rendering with `imageRendering="pixelated"`

**Game Screens Available:**
- `QueueBattleView` - Queue-based battle system (planning/execution phases)
- `OverworldMap` - Top-down exploration with tile-based maps
- `RewardsScreen` - Post-battle rewards (XP, gold, equipment, level-ups)
- `ShopScreen` - Equipment shop with unlock system
- `DialogueBox` - NPC dialogue system
- `SaveMenu` - Save/load interface
- `SpriteMockup` - Current battle scene mockup (beach battle example)

## Task

Create **storyboard-style mockup components** for each major game screen that showcase:
1. **Visual layout** - How the screen should look
2. **Sprite placement** - Where sprites should appear
3. **UI elements** - Menus, buttons, text overlays
4. **Scene composition** - Background, foreground, character positioning

## Mockup Requirements

### 1. Battle Scene Storyboards

**A. Battle Planning Phase (Queue-Based)**
- Show 4 party members on left (Isaac, Garet, Ivan, Mia)
- Show 1-3 enemies on right
- Display action queue panel (4 slots)
- Show mana circles bar
- Show Djinn bar
- Battle background (beach/forest/cave)
- Menu bar at bottom: Fight, Psynergy, Djimi, Item, Run

**B. Battle Execution Phase**
- Same layout but with action animations
- Battle log showing events
- Turn order indicator
- Unit cards showing HP/PP/status

**C. Victory Scene**
- Victory overlay
- Post-battle cutscene placeholder
- Transition to rewards screen

### 2. Overworld Exploration Storyboard

- Top-down tile-based map view
- Player character sprite (Isaac) centered
- NPC sprites positioned on map
- Buildings/scenery sprites
- Dialogue box overlay (when talking to NPC)
- Map name indicator
- Step counter (for random encounters)

### 3. Rewards Screen Storyboard

- Victory banner at top
- XP distribution cards (per unit)
- Gold reward display
- Equipment rewards grid (with icons)
- Level-up notifications (if any)
- Equipment choice picker (for boss battles - 3 options)
- Continue button

### 4. Shop Screen Storyboard

- Shopkeeper NPC sprite
- Equipment grid (weapons, armor, accessories)
- Equipment icons with stat bonuses
- Gold display
- "Unlock Equipment" button (no selling)
- Close button

### 5. Dialogue Scene Storyboard

- NPC sprite (left or right side)
- Dialogue box at bottom
- Character name label
- Text content area
- Continue/choice buttons
- Background (overworld or interior)

### 6. Menu Screens Storyboard

**A. Save Menu**
- Save slot list (3-5 slots)
- Slot info (chapter, playtime, timestamp)
- Save/Load buttons
- Close button

**B. Main Menu** (if exists)
- Game title
- New Game, Continue, Options, Credits
- Background image

## Implementation Guidelines

**Use Existing Components:**
- `SimpleSprite` for character/enemy sprites
- `BackgroundSprite` for backgrounds
- `EquipmentIcon` for equipment displays
- Existing UI components where possible

**Create New Storyboard Components:**
- `BattleSceneStoryboard.tsx` - Battle mockups
- `OverworldStoryboard.tsx` - Exploration mockups
- `RewardsStoryboard.tsx` - Rewards screen mockup
- `ShopStoryboard.tsx` - Shop screen mockup
- `DialogueStoryboard.tsx` - Dialogue mockup
- `MenuStoryboard.tsx` - Menu mockups

**Storyboard Structure:**
Each storyboard component should:
1. Show the scene layout (pixel-perfect)
2. Use actual sprites from catalog
3. Display UI elements (buttons, text, menus)
4. Be toggleable (show/hide different phases/states)
5. Include annotations/comments explaining layout decisions

**Visual Style:**
- Pixel-perfect rendering (`imageRendering="pixelated"`)
- Golden Sun aesthetic (16-bit GBA style)
- Dark backgrounds with bright UI elements
- Clear visual hierarchy
- Consistent spacing and alignment

## Deliverables

Create a new component `StoryboardGallery.tsx` that:
- Lists all storyboard mockups
- Allows switching between different screens
- Shows multiple states/phases for each screen
- Uses the existing sprite system
- Renders pixel-perfect mockups

**Example Structure:**
```typescript
export function StoryboardGallery() {
  const [currentScreen, setCurrentScreen] = useState<'battle' | 'overworld' | 'rewards' | 'shop' | 'dialogue' | 'menu'>('battle');
  const [battlePhase, setBattlePhase] = useState<'planning' | 'execution' | 'victory'>('planning');
  
  return (
    <div>
      {/* Screen selector */}
      {/* Current storyboard */}
      {/* Phase/state toggles */}
    </div>
  );
}
```

## Success Criteria

✅ Each major game screen has a storyboard mockup
✅ Uses actual sprites from catalog (not placeholders)
✅ Shows realistic game layouts
✅ Pixel-perfect rendering
✅ Toggleable states/phases
✅ Can be used as reference for UI implementation
✅ Matches Golden Sun visual style

## Reference Files

- `apps/vale-v2/src/ui/components/SpriteMockup.tsx` - Current battle mockup
- `apps/vale-v2/src/ui/sprites/SimpleSprite.tsx` - Sprite component
- `apps/vale-v2/src/ui/sprites/BackgroundSprite.tsx` - Background component
- `apps/vale-v2/src/ui/sprites/catalog.ts` - Sprite catalog API
- `apps/vale-v2/src/ui/components/QueueBattleView.tsx` - Actual battle component
- `apps/vale-v2/src/ui/components/OverworldMap.tsx` - Actual overworld component
- `apps/vale-v2/src/ui/components/RewardsScreen.tsx` - Actual rewards component

Start by creating the `StoryboardGallery` component, then add storyboard mockups for each screen one at a time. Focus on visual composition and sprite placement - these are design references, not fully functional screens.











