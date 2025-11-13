# Create Storyboard Mockups for Vale Chronicles V2 Game Screens

## Context

I'm working on **Vale Chronicles V2**, a Golden Sun-inspired tactical RPG built with React/TypeScript. I have a working sprite mockup system (`SpriteMockup.tsx`) that can render pixel-perfect battle scenes using **1,627 cataloged sprites** from Golden Sun assets.

**Current Sprite System:**
- `SimpleSprite` component for rendering sprites (flexible ID lookup)
- `BackgroundSprite` component for battle/overworld backgrounds
- Sprite catalog with **8 main categories**:
  - `battle-party` - Player character battle sprites
  - `battle-enemies` - Enemy battle sprites
  - `battle-bosses` - Boss enemy sprites
  - `backgrounds-gs1` - Golden Sun 1 backgrounds
  - `backgrounds-gs2` - Golden Sun 2 backgrounds
  - `icons-buttons` - UI button icons
  - `icons-items` - Item and equipment icons
  - `overworld-protagonists` - Overworld character sprites
- Pixel-perfect rendering with `imageRendering="pixelated"`
- Debug mode for sprite lookup verification

**Existing Components:**
- `QueueBattleView` - Queue-based battle system (planning/execution phases)
- `OverworldMap` - Top-down exploration with tile-based maps
- `RewardsScreen` - Post-battle rewards (XP, gold, equipment, level-ups)
- `ShopScreen` - Equipment shop with unlock system
- `DialogueBox` - NPC dialogue system
- `SaveMenu` - Save/load interface (3 slots)
- `SpriteMockup` - Current battle scene mockup (beach battle example)
- `VictoryOverlay` - Victory fanfare animation
- `PostBattleCutscene` - Post-battle cutscene messages

## Task

Create **storyboard-style mockup components** for each major game screen that showcase:

1. **Visual layout** - How the screen should look with actual sprites
2. **Sprite placement** - Where sprites should appear (positioned correctly)
3. **UI elements** - Menus, buttons, text overlays, panels
4. **Scene composition** - Background, foreground, character positioning
5. **Multiple states** - Different phases/states for each screen (where applicable)

These mockups will serve as **visual reference guides** for implementing the actual game screens, ensuring pixel-perfect Golden Sun aesthetic.

---

## Mockup Requirements

### 1. Battle Scene Storyboards

**A. Battle Planning Phase (Queue-Based)**

Layout:
- **Background**: Battle background (beach/forest/cave) using `BackgroundSprite`
- **Left Side**: 4 party members (Isaac, Garet, Ivan, Mia) positioned horizontally, aligned at bottom
  - Use `SimpleSprite` with IDs: `isaac-lblade-front`, `garet-axe-front`, `ivan-staff-front`, `mia-staff-front`
  - Each sprite 64x64px, 16px gap between units
  - Add subtle drop shadows beneath sprites
- **Right Side**: 1-3 enemies positioned on right side
  - Use enemy sprites from `battle-enemies` category
  - Vary sizes (48x48 for small, 64x64 for medium, 96x96 for large/boss)
  - Position floating enemies higher with shadows below
- **Top Bar**: Mana circles bar + Djinn bar
  - Dark blue panel (#1a2a4a) with border (#4a6a8a)
  - Mana circles (○○○○○) showing available mana
  - Djinn icons showing standby/ready/recovery states
- **Bottom Panel (Planning)**: Action Queue Panel + Command Panel
  - Action Queue: 4 slots showing queued actions (unit portrait + ability icon + target)
  - Command Panel: Ability list + Target selection + Queue Action button
- **Menu Bar (Bottom)**: Black bar (50px height) with buttons
  - Buttons: Fight, Psynergy, Djinn, Item, Run
  - White text, gold (#FFD700) on hover

**B. Battle Execution Phase**

Layout: Same battlefield positioning as Planning Phase, but:
- **Bottom Panel**: Replace command panel with **Battle Log**
  - Scrolling event log showing combat actions
  - Dark background with golden text
  - Recent events at bottom, scrolls up
- **Visual Effects** (optional): Add attack/ability animations
  - Damage numbers floating above targets
  - Flash effects for hits
  - Mana cost indicators

**C. Victory Scene**

Layout:
- **Victory Overlay**: Full-screen overlay
  - Flash effect (#FFD700 gradient)
  - "VICTORY!" text (large, bold, animated)
  - Stars/sparkles particles
- **Post-Battle Cutscene**: Message box overlay
  - Generic victory messages
  - Progress dots showing message 1/3, 2/3, 3/3
  - Continue button at bottom
- **Transition**: Show transition to Rewards Screen

---

### 2. Overworld Exploration Storyboard

Layout:
- **Background**: Tile-based map view (use CSS grid)
  - 15x15 visible grid (each tile 32x32px)
  - Grass, water, sand, stone, building tiles
  - Use sprite tiles or colored placeholders
- **Player Character**: Centered on map
  - Use `SimpleSprite` with ID: `isaac-overworld` or similar
  - 32x32px sprite
  - Drop shadow beneath player
- **NPCs**: Positioned on specific tiles
  - Use overworld protagonist sprites
  - Show trigger indicators (colored dots):
    - Red dot = Battle trigger
    - Orange dot = Shop trigger
    - Blue dot = NPC dialogue
    - Purple dot = Transition/door
- **Map Header**: Dark panel at top
  - Map name: "Vale Village" / "Forest Path"
  - Position: (x, y)
  - Step counter: "Steps: 42"
  - Encounter rate (if applicable): "Encounter: 5%"
- **Dialogue Box Overlay** (when talking to NPC):
  - Bottom third of screen
  - Speaker portrait on left (circular, 64x64px)
  - Dialogue text area
  - Continue prompt: "Press [SPACE] or [ENTER]"
- **Legend Panel**: Bottom right corner
  - Shows trigger color meanings
  - Small panel (semi-transparent)

---

### 3. Rewards Screen Storyboard

Layout:
- **Victory Banner**: Top of screen
  - Large "VICTORY!" text
  - Golden gradient background
  - Animated entrance (slide down)
- **Rewards Grid**: Center area
  - **XP Card**: Left side
    - Icon: ✦ (star/XP symbol)
    - Text: "+500 XP"
    - Subtext: "Split among 4 survivors"
  - **Gold Card**: Right side
    - Icon: ◉ (coin symbol)
    - Text: "+150 G"
- **Equipment Drops**: Below rewards grid
  - "ITEMS OBTAINED" header
  - Equipment icons in horizontal row
    - Use `EquipmentIcon` component
    - Show equipment tier colors (bronze/silver/gold borders)
    - Item name below icon
    - Quantity: "x1"
- **Level-Up Panel** (if applicable): Bottom area
  - "LEVEL UP!" header
  - Unit cards showing level-up animation
    - Unit sprite (48x48px)
    - "Lv 5 → Lv 6" arrow
    - Stat gains: "+5 HP, +2 ATK, +1 DEF, +2 MAG, +1 SPD"
    - Unlocked abilities: "Unlocked: Fireball, Heal"
- **Continue Button**: Bottom center
  - Large green button
  - Text: "CONTINUE"
  - Glowing/pulsing effect

---

### 4. Shop Screen Storyboard

Layout:
- **Overlay**: Semi-transparent dark background
- **Shop Panel**: Centered modal (80% viewport width/height)
  - **Header**: Shop name + Close button
    - "Vale Armory" / "Traveling Merchant"
    - Close button (×) top-right
  - **Gold Display**: Top right
    - "Gold: 1,250g" (large golden text)
  - **Equipment Grid**: Main content area
    - Grid of equipment cards (3-4 columns)
    - Each card shows:
      - Equipment icon (using `EquipmentIcon`, 48x48px)
      - Equipment name: "Iron Sword"
      - Stat bonuses: "+5 ATK" badges
      - Cost: "150g"
      - "Unlock Equipment" button (green if affordable, gray if not)
  - **Empty State** (if no items):
    - "No items available" placeholder
  - **Locked State** (if shop not unlocked):
    - "This shop is not yet available" message
    - Grayed-out items

---

### 5. Dialogue Scene Storyboard

**A. NPC Dialogue (Overworld)**

Layout:
- **Background**: Overworld map (slightly darkened)
- **NPC Sprite**: Left side of dialogue box
  - Circular portrait (64x64px)
  - Use overworld protagonist sprite or placeholder
  - Drop shadow
- **Dialogue Box**: Bottom third of screen
  - Dark panel (#2c3e50) with border
  - **Speaker Name**: Top left (golden text)
    - "Elder Marcus" / "Merchant Kate"
  - **Dialogue Text**: Center area
    - White text on dark background
    - 2-3 lines visible
  - **Continue Indicator** (if no choices):
    - "Press [SPACE] or [ENTER] to continue..." (bottom right)
  - **Choice Buttons** (if choices available):
    - Numbered buttons (1, 2, 3)
    - "1. Yes, I'll help!"
    - "2. Not right now."
    - "3. Tell me more."
  - **Close Hint**: "[ESC] to close" (top right, small)

**B. Cutscene Dialogue (Battle)**

Layout: Same as NPC dialogue, but:
- **Background**: Battle background
- **Speaker**: Enemy/boss portrait or player portrait
- **Dialogue**: Pre-battle taunt or post-battle victory message

---

### 6. Menu Screens Storyboard

**A. Save Menu**

Layout:
- **Overlay**: Semi-transparent dark background
- **Save Menu Panel**: Centered modal
  - **Header**: "Save / Load Game" + Close button (×)
  - **Action Buttons**: Top row
    - "New Save" button (active state: green border)
    - "Load Save" button
    - "Delete Save" button (red)
  - **Save Slots**: 3 vertical cards
    - **Slot Header**: "Slot 1", "Slot 2", "Slot 3"
    - **Slot Content** (if saved):
      - Date/Time: "Nov 13, 2025, 3:42 PM"
      - Playtime: "5:30" (hours:minutes)
      - Team Level: "Lv. 8"
      - Gold: "1,250g"
      - Chapter: "Chapter 2: The Forest Path"
    - **Empty Slot**:
      - "Empty Slot" placeholder (grayed out)
  - **Action Indicators**:
    - If "Save" selected: "Click to save" on each slot
    - If "Load" selected: "Click to load" on filled slots
  - **Delete Confirmation** (if deleting):
    - Modal overlay: "Are you sure you want to delete this save?"
    - Buttons: "Yes, Delete" (red), "Cancel"

**B. Main Menu** (if exists)

Layout:
- **Background**: Static background image (Vale village or title screen)
- **Game Title**: Top center
  - "VALE CHRONICLES V2" (large, stylized font)
  - Subtitle: "A Golden Sun-Inspired RPG"
- **Menu Buttons**: Center, vertical stack
  - "New Game" (pulsing/glowing)
  - "Continue" (if save exists)
  - "Options"
  - "Credits"
- **Footer**: Bottom center
  - Version number: "v0.1.0-alpha"
  - Controls hint: "Use arrow keys and ENTER"

---

## Implementation Guidelines

### Use Existing Components

Leverage components already in the codebase:
- `SimpleSprite` for character/enemy sprites (with flexible ID lookup)
- `BackgroundSprite` for backgrounds (supports `id="random"` with category)
- `EquipmentIcon` for equipment displays (with tier colors)
- Existing UI components where possible (don't recreate wheels)

### Create New Storyboard Components

File structure: `apps/vale-v2/src/ui/components/storyboards/`

Create:
- `BattleStoryboard.tsx` - Battle mockups (planning, execution, victory)
- `OverworldStoryboard.tsx` - Exploration mockups
- `RewardsStoryboard.tsx` - Rewards screen mockup
- `ShopStoryboard.tsx` - Shop screen mockup
- `DialogueStoryboard.tsx` - Dialogue mockup (NPC + cutscene)
- `MenuStoryboard.tsx` - Menu mockups (save menu, main menu)
- `StoryboardGallery.tsx` - Gallery component to view all storyboards

### Storyboard Structure Pattern

Each storyboard component should:

1. **Show the scene layout** (pixel-perfect positioning)
2. **Use actual sprites** from catalog (not placeholders)
3. **Display UI elements** (buttons, text, menus, panels)
4. **Be toggleable** (show/hide different phases/states via state)
5. **Include annotations** (optional comments explaining layout decisions)

Example structure:

```typescript
export function BattleStoryboard() {
  const [phase, setPhase] = useState<'planning' | 'execution' | 'victory'>('planning');
  
  return (
    <div className="storyboard-container">
      {/* Phase selector */}
      <div className="storyboard-controls">
        <button onClick={() => setPhase('planning')}>Planning</button>
        <button onClick={() => setPhase('execution')}>Execution</button>
        <button onClick={() => setPhase('victory')}>Victory</button>
      </div>
      
      {/* Storyboard content */}
      <div className="storyboard-scene">
        {phase === 'planning' && <BattlePlanningScene />}
        {phase === 'execution' && <BattleExecutionScene />}
        {phase === 'victory' && <VictoryScene />}
      </div>
      
      {/* Annotations (optional) */}
      <div className="storyboard-annotations">
        <p>Layout notes: Party on left, enemies on right...</p>
      </div>
    </div>
  );
}
```

### Visual Style Requirements

**Pixel-Perfect Rendering:**
- Use `imageRendering: 'pixelated'` on all sprites
- Avoid anti-aliasing on pixel art
- Integer pixel positions (no sub-pixel rendering)

**Golden Sun Aesthetic (16-bit GBA style):**
- Dark backgrounds (#1a1a2e, #2c3e50)
- Bright UI elements with golden accents (#FFD700, #FFD87F)
- Clear visual hierarchy (borders, panels, shadows)
- Consistent spacing and alignment (8px grid)
- Rounded corners (4px border-radius)

**Color Palette:**
```css
/* Backgrounds */
--bg-primary: #1a1a2e;
--bg-secondary: #2c3e50;
--bg-panel: #1a2a4a;

/* Borders */
--border-primary: #4a6a8a;
--border-gold: #FFD700;

/* Text */
--text-primary: #ffffff;
--text-gold: #FFD87F;
--text-muted: #888;

/* Actions */
--action-success: #4CAF50;
--action-danger: #e74c3c;
--action-warning: #f39c12;
--action-info: #3498db;
```

**Typography:**
- Use monospace fonts for pixel-perfect text
- Font sizes: 12px, 14px, 16px, 20px, 24px (even multiples)
- Line height: 1.5 for readability

---

## Deliverables

### 1. StoryboardGallery Component

Create: `apps/vale-v2/src/ui/components/storyboards/StoryboardGallery.tsx`

Features:
- Lists all storyboard mockups
- Navigation between different screens
- State toggles for each storyboard
- Fullscreen mode toggle
- Responsive layout

Example structure:

```typescript
export function StoryboardGallery() {
  const [currentScreen, setCurrentScreen] = useState<
    'battle' | 'overworld' | 'rewards' | 'shop' | 'dialogue' | 'menu'
  >('battle');
  
  const [battlePhase, setBattlePhase] = useState<'planning' | 'execution' | 'victory'>('planning');
  const [dialogueType, setDialogueType] = useState<'npc' | 'cutscene'>('npc');
  const [menuType, setMenuType] = useState<'save' | 'main'>('save');
  
  return (
    <div className="storyboard-gallery">
      {/* Screen selector (sidebar) */}
      <div className="gallery-sidebar">
        <h2>Storyboards</h2>
        <nav>
          <button onClick={() => setCurrentScreen('battle')}>Battle</button>
          <button onClick={() => setCurrentScreen('overworld')}>Overworld</button>
          <button onClick={() => setCurrentScreen('rewards')}>Rewards</button>
          <button onClick={() => setCurrentScreen('shop')}>Shop</button>
          <button onClick={() => setCurrentScreen('dialogue')}>Dialogue</button>
          <button onClick={() => setCurrentScreen('menu')}>Menus</button>
        </nav>
      </div>
      
      {/* Current storyboard */}
      <div className="gallery-viewport">
        {currentScreen === 'battle' && (
          <BattleStoryboard phase={battlePhase} setPhase={setBattlePhase} />
        )}
        {currentScreen === 'overworld' && <OverworldStoryboard />}
        {currentScreen === 'rewards' && <RewardsStoryboard />}
        {currentScreen === 'shop' && <ShopStoryboard />}
        {currentScreen === 'dialogue' && (
          <DialogueStoryboard type={dialogueType} setType={setDialogueType} />
        )}
        {currentScreen === 'menu' && (
          <MenuStoryboard type={menuType} setType={setMenuType} />
        )}
      </div>
    </div>
  );
}
```

### 2. Individual Storyboard Components

Create each storyboard component in `apps/vale-v2/src/ui/components/storyboards/`:
- `BattleStoryboard.tsx`
- `OverworldStoryboard.tsx`
- `RewardsStoryboard.tsx`
- `ShopStoryboard.tsx`
- `DialogueStoryboard.tsx`
- `MenuStoryboard.tsx`

### 3. CSS Files

Create accompanying CSS files for styling:
- `StoryboardGallery.css` - Gallery layout and sidebar
- `BattleStoryboard.css` - Battle scene styling
- `OverworldStoryboard.css` - Overworld styling
- (etc. for each storyboard)

Ensure pixel-perfect styling with:
- Fixed pixel dimensions (not %, em, rem)
- Integer positions (no fractional pixels)
- `imageRendering: pixelated` on all sprites

### 4. Integration

Add route or dev mode toggle to access storyboard gallery:

```typescript
// In App.tsx or similar
import { StoryboardGallery } from './ui/components/storyboards/StoryboardGallery';

// Add dev mode route or toggle
{import.meta.env.DEV && (
  <button onClick={() => setShowStoryboards(true)}>
    View Storyboards
  </button>
)}

{showStoryboards && <StoryboardGallery />}
```

---

## Success Criteria

✅ Each major game screen has a storyboard mockup  
✅ Uses actual sprites from catalog (not placeholders)  
✅ Shows realistic game layouts with pixel-perfect positioning  
✅ Pixel-perfect rendering (`imageRendering: pixelated`)  
✅ Toggleable states/phases for each screen  
✅ Can be used as reference for UI implementation  
✅ Matches Golden Sun visual style (16-bit GBA aesthetic)  
✅ StoryboardGallery component allows easy navigation  
✅ All sprites render correctly (no broken images)  
✅ Responsive layout works on different screen sizes  

---

## Reference Files

### Components
- `apps/vale-v2/src/ui/components/SpriteMockup.tsx` - Current battle mockup (example)
- `apps/vale-v2/src/ui/components/QueueBattleView.tsx` - Actual battle component
- `apps/vale-v2/src/ui/components/OverworldMap.tsx` - Actual overworld component
- `apps/vale-v2/src/ui/components/RewardsScreen.tsx` - Actual rewards component
- `apps/vale-v2/src/ui/components/ShopScreen.tsx` - Actual shop component
- `apps/vale-v2/src/ui/components/DialogueBox.tsx` - Actual dialogue component
- `apps/vale-v2/src/ui/components/SaveMenu.tsx` - Actual save menu component
- `apps/vale-v2/src/ui/components/VictoryOverlay.tsx` - Victory animation
- `apps/vale-v2/src/ui/components/PostBattleCutscene.tsx` - Post-battle cutscene
- `apps/vale-v2/src/ui/components/EquipmentIcon.tsx` - Equipment icon rendering

### Sprite System
- `apps/vale-v2/src/ui/sprites/SimpleSprite.tsx` - Sprite component
- `apps/vale-v2/src/ui/sprites/BackgroundSprite.tsx` - Background component
- `apps/vale-v2/src/ui/sprites/catalog.ts` - Sprite catalog API

### Sprite Catalog Functions
```typescript
// Get sprite by flexible ID
getSpriteById('isaac-lblade-front') // Returns sprite entry or null

// Search sprites by name
searchSprites('goblin') // Returns array of matching sprites

// Get sprites by category
getSpritesByCategory('battle-party') // Returns all party battle sprites

// Get random sprite from category
getRandomSprite('backgrounds-gs1') // Returns random GS1 background

// Get all categories
getCategories() // Returns ['battle-party', 'battle-enemies', ...]
```

---

## Notes

- **Focus on visual composition and sprite placement** - these are design references, not fully functional screens
- **Use debug mode** (`debug={true}`) on sprites during development to verify sprite lookups
- **Reuse existing CSS** from actual components where applicable (e.g., RewardsScreen.css, ShopScreen.css)
- **Don't recreate game logic** - storyboards are static mockups, not interactive components
- **Iterate incrementally** - start with BattleStoryboard, then add others one at a time
- **Test sprite paths** - ensure all sprite IDs resolve correctly using catalog
- **Document sprite choices** - add comments explaining which sprites were chosen and why

---

## Example Sprite Lookups

Here are some example sprite IDs to get started:

**Party Characters (Battle):**
- `isaac-lblade-front` - Isaac with light blade
- `garet-axe-front` - Garet with axe
- `ivan-staff-front` - Ivan with staff
- `mia-staff-front` - Mia with staff

**Enemies:**
- Search: `searchSprites('goblin')` - Find goblin sprites
- Search: `searchSprites('golem')` - Find golem sprites
- Search: `searchSprites('bat')` - Find bat/winged sprites

**Backgrounds:**
- `getRandomSprite('backgrounds-gs1')` - Random GS1 background
- Search: `searchSprites('forest')` - Find forest backgrounds
- Search: `searchSprites('beach')` - Find beach backgrounds

**Overworld:**
- Search: `searchSprites('isaac')` in `overworld-protagonists` category
- Use: `getSpritesByCategory('overworld-protagonists')`

Start by creating the `StoryboardGallery` component, then add storyboard mockups for each screen one at a time. Focus on visual composition and sprite placement - these are design references, not fully functional screens.
