# Implementation Prompt: Pre-Battle Team Selection Screen (Final Design)

## Context

You are implementing a pre-battle team selection screen for Vale Chronicles V2. This screen allows players to:
1. Select 1-4 units from roster for active party
2. Manage equipment for each unit (5 slots: Weapon/Armor/Helm/Boots/Accessory)
3. Manage Djinn for each unit (3 slots max)
4. View minimal enemy information (portal tile)
5. Start battle with selected team

**Critical Requirements:**
- **NO SCROLLING** - Everything must fit in viewport (fixed heights, compact spacing)
- **Single screen** - All information visible at once
- **Responsive** - Scales to different viewport sizes using `clamp()` for fonts

**Reference Files:**
- Visual mockup: `apps/vale-v2/mockups/pre-battle-team-select-final.html`
- Design doc: `apps/vale-v2/docs/IMPROVED_PRE_BATTLE_DESIGN.md`
- Architecture: `apps/vale-v2/CLAUDE.md`

---

## Quality Guidelines (MUST FOLLOW)

### 1. Clean Architecture
- **UI components** go in `src/ui/components/`
- **State management** uses Zustand slices in `src/ui/state/`
- **Core logic** (if any) goes in `src/core/services/` (NO React in core)
- **Types** defined in component files or `src/core/models/`

### 2. TypeScript Standards
- **No `any` types** - Use proper types or `unknown`
- **Strict null checks** - Handle `undefined`/`null` properly
- **Readonly arrays** - Use `readonly Unit[]` for immutable data
- **Type imports** - Use `import type { ... }` for type-only imports

### 3. React Patterns
- **Functional components** - No class components
- **Hooks** - Use `useState`, `useEffect`, `useCallback` appropriately
- **Props interfaces** - Define clear prop types
- **Event handlers** - Use proper typing (`onClick: () => void`)

### 4. State Management
- **Zustand slices** - Access state via `useStore((s) => s.property)`
- **Immutable updates** - Never mutate state directly
- **Actions** - Call slice methods for state updates

### 5. Styling
- **CSS Modules** or **CSS files** - One CSS file per component
- **Responsive fonts** - Use `clamp(min, preferred, max)` for all font sizes
- **Fixed heights** - Use fixed heights with `flex-shrink: 0` to prevent scrolling
- **CSS Grid/Flexbox** - Use modern layout techniques

### 6. Code Organization
- **File naming** - PascalCase for components (`PreBattleTeamSelectScreen.tsx`)
- **Exports** - Named exports for components
- **Imports** - Use path aliases (`@/` maps to `src/`)

---

## Implementation Steps

### Step 1: Update GameFlowSlice for Team Selection Mode

**File:** `apps/vale-v2/src/ui/state/gameFlowSlice.ts`

**Changes:**
1. Add `'team-select'` to `mode` union type
2. Add `pendingBattleEncounterId: string | null` to interface
3. Add `setPendingBattle: (encounterId: string | null) => void` method
4. Modify `handleTrigger()` for battle type to set `mode: 'team-select'` instead of creating battle immediately
5. Add `confirmBattleTeam: (team: Team) => void` method that:
   - Creates battle from `pendingBattleEncounterId`
   - Sets battle state
   - Transitions to `mode: 'battle'`
   - Clears `pendingBattleEncounterId`

**Code Pattern:**
```typescript
export interface GameFlowSlice {
  mode: 'overworld' | 'battle' | 'rewards' | 'dialogue' | 'shop' | 'team-select';
  pendingBattleEncounterId: string | null;
  // ... existing fields
  setPendingBattle: (encounterId: string | null) => void;
  confirmBattleTeam: (team: Team) => void;
}

// In handleTrigger() for battle type:
if (trigger.type === 'battle') {
  const encounterId = (trigger.data as { encounterId?: string }).encounterId;
  if (!encounterId) {
    console.error('Battle trigger missing encounterId');
    return;
  }
  
  set({
    mode: 'team-select',
    pendingBattleEncounterId: encounterId,
    lastTrigger: trigger,
  });
  return;
}

// New method:
confirmBattleTeam: (team: Team) => {
  const { pendingBattleEncounterId } = get();
  if (!pendingBattleEncounterId) {
    console.error('No pending battle encounter');
    return;
  }
  
  const encounter = ENCOUNTERS[pendingBattleEncounterId];
  if (!encounter) {
    console.error(`Encounter ${pendingBattleEncounterId} not found`);
    return;
  }
  
  // Save pre-battle position
  const { currentMapId, playerPosition } = get();
  const preBattlePosition = {
    mapId: currentMapId,
    position: { x: playerPosition.x, y: playerPosition.y },
  };
  
  // Create battle with selected team
  const seed = Date.now();
  const rng = makePRNG(seed);
  const result = createBattleFromEncounter(pendingBattleEncounterId, team, rng);
  
  if (!result || !result.battle) {
    console.error(`Failed to create battle from encounter ${pendingBattleEncounterId}`);
    return;
  }
  
  get().setBattle(result.battle, seed);
  get().setTeam(team);
  
  set({
    currentEncounter: encounter,
    mode: 'battle',
    preBattlePosition,
    pendingBattleEncounterId: null,
  });
},
```

**Validation:**
- [ ] TypeScript compiles without errors
- [ ] No linter errors
- [ ] Battle triggers now show team selection screen
- [ ] `confirmBattleTeam` creates battle correctly

---

### Step 2: Create Main Component Structure

**File:** `apps/vale-v2/src/ui/components/PreBattleTeamSelectScreen.tsx` (NEW)

**Structure:**
```typescript
import { useState } from 'react';
import { useStore } from '../state/store';
import type { Team } from '@/core/models/Team';
import type { Unit } from '@/core/models/Unit';
import type { EquipmentSlot } from '@/core/models/Equipment';
import { ENCOUNTERS } from '@/data/definitions/encounters';
import { MIN_PARTY_SIZE, MAX_PARTY_SIZE } from '@/core/constants';
import './PreBattleTeamSelectScreen.css';

interface PreBattleTeamSelectScreenProps {
  encounterId: string;
  onConfirm: (team: Team) => void;
  onCancel: () => void;
}

export function PreBattleTeamSelectScreen({
  encounterId,
  onConfirm,
  onCancel,
}: PreBattleTeamSelectScreenProps) {
  const { roster, team, swapPartyMember, updateTeam } = useStore();
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(0);
  const [selectedEquipmentSlot, setSelectedEquipmentSlot] = useState<EquipmentSlot | null>(null);
  const [selectedDjinnSlot, setSelectedDjinnSlot] = useState<number | null>(null);
  
  const encounter = ENCOUNTERS[encounterId];
  if (!encounter) {
    return <div>Error: Encounter not found</div>;
  }
  
  // Get current active party (1-4 units)
  const activeParty = team?.units || [];
  
  // Get bench units (roster units not in active party)
  const benchUnits = roster.filter(
    unit => !activeParty.some(active => active.id === unit.id)
  );
  
  // Get selected unit for equipment/Djinn management
  const selectedUnit = selectedSlotIndex !== null ? activeParty[selectedSlotIndex] : null;
  
  // Handle adding unit to slot
  const handleAddToSlot = (slotIndex: number, unitId: string) => {
    swapPartyMember(slotIndex, unitId);
    setSelectedSlotIndex(slotIndex);
  };
  
  // Handle removing unit from party
  const handleRemoveFromParty = (slotIndex: number) => {
    const newUnits = activeParty.filter((_, i) => i !== slotIndex);
    if (newUnits.length === 0) {
      // Can't have empty team
      return;
    }
    updateTeam({ units: newUnits });
    setSelectedSlotIndex(null);
  };
  
  // Handle start battle
  const handleStartBattle = () => {
    if (!team || team.units.length < MIN_PARTY_SIZE) {
      alert(`Team must have at least ${MIN_PARTY_SIZE} unit`);
      return;
    }
    if (team.units.length > MAX_PARTY_SIZE) {
      alert(`Team cannot exceed ${MAX_PARTY_SIZE} units`);
      return;
    }
    onConfirm(team);
  };
  
  return (
    <div className="pre-battle-overlay">
      <div className="pre-battle-container">
        {/* Header */}
        <div className="pre-battle-header">
          <div>
            <div className="header-title">PRE-BATTLE PREPARATION</div>
            <div className="header-info">
              {encounter.name} | Difficulty: {encounter.difficulty} | 
              Rewards: {encounter.reward.xp} XP, {encounter.reward.gold} Gold
            </div>
          </div>
          <button className="close-btn" onClick={onCancel} aria-label="Close">×</button>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Left Column */}
          <div className="left-column">
            {/* Team & Bench Section */}
            <TeamBenchSection
              activeParty={activeParty}
              benchUnits={benchUnits}
              selectedSlotIndex={selectedSlotIndex}
              onSelectSlot={setSelectedSlotIndex}
              onAddToSlot={handleAddToSlot}
              onRemoveFromParty={handleRemoveFromParty}
            />

            {/* Equipment Section */}
            {selectedUnit && (
              <EquipmentSection
                unit={selectedUnit}
                team={team!}
                selectedSlot={selectedEquipmentSlot}
                onSelectSlot={setSelectedEquipmentSlot}
              />
            )}

            {/* Djinn Section */}
            {selectedUnit && (
              <DjinnSection
                unit={selectedUnit}
                team={team!}
                selectedSlot={selectedDjinnSlot}
                onSelectSlot={setSelectedDjinnSlot}
              />
            )}
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Enemies Portal Tile */}
            <EnemyPortalTile encounterId={encounterId} />
          </div>
        </div>

        {/* Actions */}
        <div className="actions-section">
          <button className="cancel-btn-action" onClick={onCancel}>Cancel</button>
          <button
            className="start-battle-btn"
            onClick={handleStartBattle}
            disabled={!team || team.units.length < MIN_PARTY_SIZE}
          >
            Start Battle
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Sub-components to create:**
- `TeamBenchSection` - Team slots + bench units (side by side)
- `EquipmentSection` - Equipment slots + compendium
- `DjinnSection` - Djinn slots + abilities panel
- `EnemyPortalTile` - Minimal enemy display

**Validation:**
- [ ] Component renders without errors
- [ ] TypeScript types are correct
- [ ] No linter errors
- [ ] Props are properly typed

---

### Step 3: Create CSS File

**File:** `apps/vale-v2/src/ui/components/PreBattleTeamSelectScreen.css` (NEW)

**Requirements:**
- Fixed heights for all sections (NO scrolling)
- Responsive fonts using `clamp()`
- CSS Grid for layout
- Compact spacing (0.5rem gaps)
- Thin borders (1px)

**Key CSS:**
```css
.pre-battle-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* NO SCROLLING */
  padding: 0.5rem;
}

.pre-battle-container {
  width: 100%;
  height: 100%;
  max-width: 1600px;
  max-height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow: hidden; /* NO SCROLLING */
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* Fixed heights - NO SCROLLING */
.pre-battle-header { height: 60px; flex-shrink: 0; }
.team-bench-section { height: 180px; flex-shrink: 0; }
.equipment-section { height: 200px; flex-shrink: 0; }
.djinn-section { height: 200px; flex-shrink: 0; }
.actions-section { height: 60px; flex-shrink: 0; }

/* Responsive fonts */
.header-title { font-size: clamp(1.1rem, 1.8vw, 1.3rem); }
.unit-name { font-size: clamp(0.75rem, 1vw, 0.9rem); }
.unit-level { font-size: clamp(0.65rem, 0.9vw, 0.75rem); }
```

**Reference:** See `apps/vale-v2/mockups/pre-battle-team-select-final.html` for complete CSS.

**Validation:**
- [ ] No vertical scrolling
- [ ] Layout fits in viewport
- [ ] Fonts scale responsively
- [ ] All sections have fixed heights

---

### Step 4: Create TeamBenchSection Component

**File:** `apps/vale-v2/src/ui/components/TeamBenchSection.tsx` (NEW)

**Props:**
```typescript
interface TeamBenchSectionProps {
  activeParty: readonly Unit[];
  benchUnits: readonly Unit[];
  selectedSlotIndex: number | null;
  onSelectSlot: (index: number | null) => void;
  onAddToSlot: (slotIndex: number, unitId: string) => void;
  onRemoveFromParty: (slotIndex: number) => void;
}
```

**Layout:**
- Left: 2x2 grid of party slots (4 slots)
- Right: Vertical list of bench units (NO scrolling - limit visible items)

**Features:**
- Click slot to select
- Click bench unit to add to selected slot
- Show selected state (blue border)
- Empty slots show "[+]"

**Validation:**
- [ ] Team slots display correctly (1-4 units)
- [ ] Bench units display correctly
- [ ] Click handlers work
- [ ] Selected state visual feedback

---

### Step 5: Create EquipmentSection Component

**File:** `apps/vale-v2/src/ui/components/EquipmentSection.tsx` (NEW)

**Props:**
```typescript
interface EquipmentSectionProps {
  unit: Unit;
  team: Team;
  selectedSlot: EquipmentSlot | null;
  onSelectSlot: (slot: EquipmentSlot | null) => void;
}
```

**Layout:**
```
┌─────────────────────────────────────────┐
│ Helm (full width)                       │
├──────────────────┬──────────────────────┤
│ Weapon │ Armor   │  Full Compendium     │
├──────────────────┤  of Items            │
│ Boots │ Accessory│  (organized tabs)   │
└──────────────────┴──────────────────────┘
```

**Left Panel:**
- Equipment slots in grid layout (Helm full width, Weapon/Armor row, Boots/Accessory row)
- Click slot to select
- Show current equipment or "[None]"
- Show stat bonuses if equipped

**Right Panel:**
- Tabs for each equipment type (Weapon/Armor/Helm/Boots/Accessory)
- List of available equipment from inventory
- Filter by slot type and unit compatibility
- Click item to equip
- NO SCROLLING - limit visible items

**Validation:**
- [ ] Equipment slots display correctly
- [ ] Compendium tabs work
- [ ] Equipment list filters correctly
- [ ] Equip functionality works
- [ ] No scrolling in compendium

---

### Step 6: Create DjinnSection Component

**File:** `apps/vale-v2/src/ui/components/DjinnSection.tsx` (NEW)

**Props:**
```typescript
interface DjinnSectionProps {
  unit: Unit;
  team: Team;
  selectedSlot: number | null;
  onSelectSlot: (slot: number | null) => void;
}
```

**Layout:**
- Left: 3 Djinn slots in horizontal row
- Right: Granted abilities panel

**Left Panel:**
- 3 slots for Djinn
- Show Djinn sprite/icon
- Show Djinn name and element
- Show state ([Set]/[Standby]/[Recovering])
- Click slot to select

**Right Panel:**
- Title: "GRANTED ABILITIES"
- List abilities granted by equipped Djinn
- Show ability name and source (Djinn name + compatibility)
- NO SCROLLING - limit visible abilities

**Validation:**
- [ ] Djinn slots display correctly
- [ ] Abilities panel shows correct abilities
- [ ] Djinn sprites/icons display
- [ ] No scrolling in abilities panel

---

### Step 7: Create EnemyPortalTile Component

**File:** `apps/vale-v2/src/ui/components/EnemyPortalTile.tsx` (NEW)

**Props:**
```typescript
interface EnemyPortalTileProps {
  encounterId: string;
}
```

**Design:**
- Illustrative portal tile (not informational)
- Animated glow effect
- Icon (⚔️)
- Title "ENEMIES"
- Enemy names (comma-separated: "Garet • Bandit • Captain")
- Click to view (optional - can be decorative)

**Implementation:**
- Load encounter from `ENCOUNTERS[encounterId]`
- Get enemy names from `encounter.enemies`
- Display in portal tile format

**Validation:**
- [ ] Portal tile displays correctly
- [ ] Enemy names show correctly
- [ ] Visual design matches mockup
- [ ] No detailed stats/intelligence

---

### Step 8: Integrate into App.tsx

**File:** `apps/vale-v2/src/App.tsx` (MODIFY)

**Changes:**
1. Import `PreBattleTeamSelectScreen`
2. Get state: `pendingBattleEncounterId`, `confirmBattleTeam`, `setPendingBattle`
3. Add conditional rendering for `mode === 'team-select'`

**Code Pattern:**
```typescript
import { PreBattleTeamSelectScreen } from './ui/components/PreBattleTeamSelectScreen';

// In App component:
const mode = useStore((s) => s.mode);
const pendingBattleEncounterId = useStore((s) => s.pendingBattleEncounterId);
const confirmBattleTeam = useStore((s) => s.confirmBattleTeam);
const setPendingBattle = useStore((s) => s.setPendingBattle);
const setMode = useStore((s) => s.setMode);

// In render:
{mode === 'team-select' && pendingBattleEncounterId && (
  <PreBattleTeamSelectScreen
    encounterId={pendingBattleEncounterId}
    onConfirm={(team) => {
      confirmBattleTeam(team);
    }}
    onCancel={() => {
      setPendingBattle(null);
      setMode('overworld');
    }}
  />
)}
```

**Validation:**
- [ ] Screen appears when battle trigger occurs
- [ ] Cancel returns to overworld
- [ ] Confirm starts battle
- [ ] No console errors

---

## Testing Checklist

### Functional Tests
- [ ] Team selection works (1-4 units)
- [ ] Bench units can be added to party
- [ ] Units can be removed from party
- [ ] Equipment can be changed
- [ ] Djinn can be equipped/unequipped
- [ ] Abilities display correctly from Djinn
- [ ] Enemy portal tile displays correctly
- [ ] "Start Battle" validates team size (1-4 units)
- [ ] "Cancel" returns to overworld
- [ ] Battle starts with selected team

### Visual Tests
- [ ] No vertical scrolling (test at 1920x1080, 1366x768, 1280x720)
- [ ] Layout fits in viewport
- [ ] Fonts scale responsively
- [ ] All sections have fixed heights
- [ ] Equipment layout matches mockup (Helm full width, etc.)
- [ ] Djinn layout matches mockup (3 slots + abilities)
- [ ] Enemy portal tile matches mockup

### Code Quality Tests
- [ ] TypeScript compiles without errors
- [ ] No linter errors
- [ ] No `any` types
- [ ] Proper null/undefined handling
- [ ] Immutable state updates
- [ ] Clean architecture boundaries respected

---

## File Summary

**New Files (6):**
1. `apps/vale-v2/src/ui/components/PreBattleTeamSelectScreen.tsx`
2. `apps/vale-v2/src/ui/components/PreBattleTeamSelectScreen.css`
3. `apps/vale-v2/src/ui/components/TeamBenchSection.tsx`
4. `apps/vale-v2/src/ui/components/EquipmentSection.tsx`
5. `apps/vale-v2/src/ui/components/DjinnSection.tsx`
6. `apps/vale-v2/src/ui/components/EnemyPortalTile.tsx`

**Modified Files (2):**
1. `apps/vale-v2/src/ui/state/gameFlowSlice.ts`
2. `apps/vale-v2/src/App.tsx`

---

## Implementation Order

1. **Step 1** - Update `gameFlowSlice.ts` (foundation)
2. **Step 2** - Create main component structure
3. **Step 3** - Create CSS file
4. **Step 4** - Create `TeamBenchSection`
5. **Step 5** - Create `EquipmentSection`
6. **Step 6** - Create `DjinnSection`
7. **Step 7** - Create `EnemyPortalTile`
8. **Step 8** - Integrate into `App.tsx`

---

## Critical Notes

1. **NO SCROLLING** - Use fixed heights, `overflow: hidden`, limit visible items
2. **Responsive fonts** - Use `clamp()` for all font sizes
3. **Type safety** - No `any` types, proper null handling
4. **Clean architecture** - UI components only, no core logic in components
5. **State management** - Use Zustand slices, immutable updates
6. **Visual reference** - Follow `pre-battle-team-select-final.html` mockup exactly

---

## Reference Files

- Visual mockup: `apps/vale-v2/mockups/pre-battle-team-select-final.html`
- Design doc: `apps/vale-v2/docs/IMPROVED_PRE_BATTLE_DESIGN.md`
- Architecture: `apps/vale-v2/CLAUDE.md`
- Constants: `apps/vale-v2/src/core/constants.ts` (MIN_PARTY_SIZE, MAX_PARTY_SIZE)
- Encounters: `apps/vale-v2/src/data/definitions/encounters.ts`
- Team model: `apps/vale-v2/src/core/models/Team.ts`
- Unit model: `apps/vale-v2/src/core/models/Unit.ts`

