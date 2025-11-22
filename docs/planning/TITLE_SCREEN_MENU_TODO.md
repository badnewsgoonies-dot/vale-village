# Title Screen & Menu System - TODO List

**Goal:** Create entry screen → menu → intro flow for game startup

---

## 🎯 Phase 1: Title Screen (Entry Screen)

### 1.1 Create Title Screen Component
- [ ] Create `TitleScreen.tsx` component
- [ ] Create `TitleScreen.css` styling
- [ ] Display game name/logo ("Vale Chronicles V2" or similar)
- [ ] Add visual effects (fade-in, subtle animation)
- [ ] Golden Sun-style aesthetic

### 1.2 Title Screen Interaction
- [ ] Detect any button/key press to advance
- [ ] Show "Press any key to continue" prompt (pulsing animation)
- [ ] On key/click → transition to menu screen
- [ ] Smooth fade transition between screens

### 1.3 Title Screen State Management
- [ ] Add `titleScreen` mode to `GameFlowSlice` (or create separate mode)
- [ ] Set initial mode to `'title-screen'` on game start
- [ ] Handle transition: `title-screen` → `main-menu`

---

## 🎯 Phase 2: Main Menu Screen

### 2.1 Create Main Menu Component
- [ ] Create `MainMenu.tsx` component
- [ ] Create `MainMenu.css` styling
- [ ] Golden Sun-style menu design
- [ ] Menu options layout:
  - New Game
  - Continue (conditional - only if save exists)
  - Compendium (placeholder, disabled/grayed out)

### 2.2 Menu Options Implementation

#### New Game Option
- [ ] Click "New Game" → transition to intro screen
- [ ] Clear any existing save data (if needed)
- [ ] Initialize fresh game state

#### Continue Option
- [ ] Check if save file exists (`SaveService.hasSave()`)
- [ ] Show "Continue" only if save exists
- [ ] Hide/gray out if no save
- [ ] Click "Continue" → load save → transition to overworld

#### Compendium Option
- [ ] Show "Compendium" option (always visible)
- [ ] Gray out/disable for now (not implemented)
- [ ] Show tooltip: "Coming soon" or similar
- [ ] Click does nothing (placeholder)

### 2.3 Menu Navigation
- [ ] Keyboard navigation (arrow keys, Enter to select)
- [ ] Mouse click support
- [ ] Visual highlight for selected option
- [ ] Smooth transitions

### 2.4 Menu State Management
- [ ] Add `main-menu` mode to `GameFlowSlice`
- [ ] Handle transitions:
  - `title-screen` → `main-menu`
  - `main-menu` → `intro` (New Game)
  - `main-menu` → `overworld` (Continue)
  - `main-menu` → `title-screen` (ESC to go back?)

---

## 🎯 Phase 3: Intro Screen (Placeholder)

### 3.1 Create Intro Screen Component
- [ ] Create `IntroScreen.tsx` component
- [ ] Create `IntroScreen.css` styling
- [ ] Simple welcome message layout

### 3.2 Intro Content (Placeholder)
- [ ] Display welcome text: "Welcome to Vale Chronicles" or similar
- [ ] Brief placeholder story intro
- [ ] Can be dialogue-style or simple text screen
- [ ] "Press any key to continue" prompt

### 3.3 Intro Screen Interaction
- [ ] Any key/click → transition to overworld
- [ ] Skip intro option (ESC or hold key?)
- [ ] Smooth fade transition

### 3.4 Intro State Management
- [ ] Add `intro` mode to `GameFlowSlice`
- [ ] Handle transition: `intro` → `overworld`
- [ ] Set story flag: `intro_seen: true` (for future: skip intro on subsequent plays)

---

## 🎯 Phase 4: Integration & Flow

### 4.1 App.tsx Integration
- [ ] Update `App.tsx` to show TitleScreen when mode is `title-screen`
- [ ] Update `App.tsx` to show MainMenu when mode is `main-menu`
- [ ] Update `App.tsx` to show IntroScreen when mode is `intro`
- [ ] Ensure proper mode transitions

### 4.2 Game Startup Flow
- [ ] On initial load → `title-screen` mode
- [ ] Title screen → Main menu
- [ ] Main menu → Intro (New Game) OR Overworld (Continue)
- [ ] Intro → Overworld (start playing)

### 4.3 Save System Integration
- [ ] Check for save on menu load
- [ ] Show/hide Continue option based on save existence
- [ ] Load save when Continue is clicked
- [ ] Handle save loading errors gracefully

---

## 🎯 Phase 5: Polish & UX

### 5.1 Visual Polish
- [ ] Add fade transitions between screens
- [ ] Add subtle animations (title screen logo, menu highlights)
- [ ] Golden Sun-style visual design
- [ ] Consistent color scheme

### 5.2 Sound & Effects (Optional)
- [ ] Menu navigation sound effects (optional)
- [ ] Screen transition sound (optional)
- [ ] Background music for title screen (optional)

### 5.3 Accessibility
- [ ] Keyboard navigation works
- [ ] Clear visual feedback for selections
- [ ] Screen reader friendly (if needed)

---

## 📋 Implementation Checklist Summary

### High Priority (Core Functionality)
- [ ] TitleScreen component + CSS
- [ ] MainMenu component + CSS
- [ ] IntroScreen component + CSS (placeholder)
- [ ] Mode management (`title-screen`, `main-menu`, `intro`)
- [ ] New Game flow (menu → intro → overworld)
- [ ] Continue flow (menu → overworld, if save exists)
- [ ] Save detection for Continue option

### Medium Priority (Polish)
- [ ] Smooth transitions
- [ ] Keyboard navigation
- [ ] Visual feedback/highlights
- [ ] Golden Sun aesthetic

### Low Priority (Nice-to-Have)
- [ ] Sound effects
- [ ] Background music
- [ ] Advanced animations
- [ ] Compendium placeholder (already planned)

---

## 🏗️ Architecture Notes

### New Modes Needed
```typescript
type GameMode = 
  | 'title-screen'  // NEW
  | 'main-menu'     // NEW
  | 'intro'         // NEW
  | 'overworld'
  | 'battle'
  | 'rewards'
  | 'dialogue'
  | 'shop'
  | 'team-select';
```

### Component Structure
```
App.tsx
├── TitleScreen.tsx (mode: 'title-screen')
├── MainMenu.tsx (mode: 'main-menu')
├── IntroScreen.tsx (mode: 'intro')
├── OverworldMap.tsx (mode: 'overworld')
├── QueueBattleView.tsx (mode: 'battle')
└── ... (other screens)
```

### State Management
- Use existing `GameFlowSlice` for mode management
- Use `SaveSlice` for save detection
- Add story flag `intro_seen` for future intro skipping

---

## 🎨 Design Notes

### Title Screen
- Large game title/logo
- Subtle background animation (particles, fade, etc.)
- "Press any key to continue" prompt (pulsing)
- Golden Sun-style golden/yellow theme

### Main Menu
- Vertical menu list
- Golden Sun-style menu box
- Selected option highlighted
- Continue option grayed out if no save
- Compendium option grayed out (placeholder)

### Intro Screen
- Simple text layout (or dialogue-style)
- Welcome message
- Placeholder story intro
- "Press any key to continue"

---

## 🚀 Implementation Order

1. **Title Screen** (simplest, good starting point)
2. **Main Menu** (core functionality)
3. **Intro Screen** (placeholder, quick)
4. **Integration** (wire everything together)
5. **Polish** (transitions, animations)

---

## 📝 Notes

- **Compendium:** Placeholder for now, will be encyclopedia feature later
- **Intro:** Placeholder text for now, can be expanded later
- **Save Detection:** Use existing `SaveService` to check for saves
- **Mode Management:** Extend existing `GameFlowSlice` with new modes
- **Transitions:** Use CSS transitions or React transitions for smooth fades

---

**Status:** Ready for implementation. Start with Title Screen, then Main Menu, then Intro.
