# Battle Grid Implementation Plan

## Overview
Refactor QueueBattleView from inline-styled flex layout to CSS grid-based component architecture matching `battle-screen-queue-based-final.html` mockup.

---

## Phase 1: CSS Foundation

### 1.1 Create `src/ui/styles/queue-battle-grid.css`

Copy styles directly from mockup, organized by section:

**Grid Layout:**
```css
.battle-screen {
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 200px 1fr;
  /* ... rest from mockup */
}
```

**Sections to include:**
- ✅ Root grid (`.battle-screen`)
- ✅ Top bar (`.top-bar`, `.mana-bar`, `.mana-circles`, `.djinn-menu`)
- ✅ Portrait panel (`.portrait-panel`, `.portrait-card`, `.portrait-expanded`, `.hp-bar`)
- ✅ Battlefield (`.battlefield`, `.enemy-area`, `.player-area`, `.enemy-card`, `.player-card`)
- ✅ Bottom panel (`.bottom-panel`, `.abilities-expanded`, `.ability-list`, `.ability-details`)
- ✅ Combat log (`.combat-log`, `.combat-log-entry`)
- ✅ Target overlay (`.target-overlay`)
- ✅ Animations (pulse, glow effects)

**File location:** `src/ui/styles/queue-battle-grid.css` (~1000 lines)

---

## Phase 2: Extract Presentational Components

Create `src/ui/components/battle/` directory with these components:

### 2.1 BattleTopBar.tsx

**Responsibilities:**
- Render mana circles (current + max + pending)
- Render Djinn icons (active/standby state)
- Djinn menu expansion on hover (optional for Phase 1)

**Props:**
```typescript
interface BattleTopBarProps {
  remainingMana: number;
  maxMana: number;
  queuedManaChange: number; // +1 from auto-attacks
  team: Team; // for Djinn access
  queuedDjinn: string[]; // IDs of Djinn queued for activation
  onDjinnClick: (djinnId: string) => void;
  disabled: boolean; // during execution
}
```

**Implementation:**
- Use `.top-bar`, `.mana-bar`, `.mana-circles` classes
- Map mana circles with `.filled`, `.pending` classes
- Render Djinn icons with `.djinn-icon`, `.active`, `.standby` classes
- Wire click handlers to `onDjinnClick`

**Reuses:** None (new component, replaces `ManaCirclesBar` + `DjinnBar` inline)

---

### 2.2 BattlePortraitPanel.tsx + PortraitCard.tsx

**Responsibilities:**
- Render party unit portraits in speed order
- Show HP bars with color coding (high/medium/low)
- Show status effects as badges
- Show queued action indicator (✓)
- Hover expansion with detailed stats

**Props:**
```typescript
interface BattlePortraitPanelProps {
  units: Unit[];
  team: Team;
  selectedUnitIndex: number | null;
  queuedActions: (QueuedAction | null)[];
  onSelectUnit: (index: number) => void;
  disabled: boolean;
}

interface PortraitCardProps {
  unit: Unit;
  team: Team;
  unitIndex: number;
  selected: boolean;
  hasQueuedAction: boolean;
  onClick: () => void;
  disabled: boolean;
}
```

**Implementation:**
- Use `.portrait-panel`, `.portrait-card` classes
- Add `.selected`, `.queued` classes based on state
- HP bar with `.hp-bar-fill`, `.medium`, `.low` classes
- Status badges with `.status-badge`
- Hover expansion with `.portrait-expanded`, `.expanded-section`, `.stat-row`

**Reuses:** `UnitCard` logic for stats calculation (can extract helpers)

---

### 2.3 Battlefield.tsx + EnemyCard.tsx + PlayerCard.tsx

**Responsibilities:**
- Render background GIF layer
- Render enemy sprites in top row
- Render player sprites in bottom row
- Highlight valid targets during target selection
- Show targeting indicators

**Props:**
```typescript
interface BattlefieldProps {
  enemies: Unit[];
  playerUnits: Unit[];
  validTargets: readonly { id: string; name: string }[];
  onTargetSelect: (targetId: string) => void;
  backgroundSrc?: string;
}

interface EnemyCardProps {
  enemy: Unit;
  index: number; // 1, 2, 3 for numbering
  isValidTarget: boolean;
  onClick: () => void;
}

interface PlayerCardProps {
  unit: Unit;
  // Just sprite display, no interaction
}
```

**Implementation:**
- Use `.battlefield`, `.battlefield-background` classes
- Enemy area: `.enemy-area`, `.enemy-card`, `.enemy-sprite`, `.enemy-number`
- Player area: `.player-area`, `.player-card`, `.player-sprite`
- Add `.valid-target` class when targeting
- Stagger player cards with `:nth-child` CSS

**Reuses:** `isUnitKO` from core models

---

### 2.4 BattleBottomPanel.tsx + AbilityList.tsx + AbilityDetails.tsx

**Responsibilities:**
- Show current unit indicator
- Show action queue summary line
- Render ability list (left column, 35%)
- Render ability details OR combat log (right column, 65%)
- Handle ability selection
- Execute round button

**Props:**
```typescript
interface BattleBottomPanelProps {
  phase: 'planning' | 'executing';
  currentUnit: Unit | null;
  currentUnitIndex: number | null;
  abilities: Ability[];
  unlockedAbilityIds: string[];
  lockedDjinnAbilities: LockedDjinnAbilityMetadata[];
  selectedAbilityId: string | null;
  onAbilitySelect: (abilityId: string | null) => void;
  queuedActions: (QueuedAction | null)[];
  remainingMana: number;
  isQueueComplete: boolean;
  onExecute: () => void;
  events: BattleEvent[]; // for log
}

interface AbilityListProps {
  abilities: Ability[];
  unlockedAbilityIds: string[];
  lockedDjinnAbilities: LockedDjinnAbilityMetadata[];
  selectedAbilityId: string | null;
  remainingMana: number;
  onAbilitySelect: (abilityId: string | null) => void;
}

interface AbilityDetailsProps {
  ability: Ability | null; // null = Basic Attack
  visible: boolean;
}
```

**Implementation:**
- Use `.bottom-panel`, `.panel-header`, `.current-unit` classes
- Queue display: `.action-queue`, `.queue-item`
- Two-column layout: `.abilities-expanded`, `.ability-list`, `.abilities-divider`
- Ability items: `.ability-list-item`, `.ability-icon`, `.ability-content`, `.selected`, `.locked`
- Right column: `.ability-details` OR `.combat-log` based on phase
- Execute button: styled button with disabled state

**Reuses:** `canAffordAction`, `DJINN_ABILITIES`, `DJINN` lookups, `BattleLog` component

---

### 2.5 BattleScreenLayout.tsx (Grid Wrapper)

**Responsibilities:**
- Own the `.battle-screen` grid container
- Accept subcomponents as props/children
- Apply execution indicator when phase is 'executing'

**Props:**
```typescript
interface BattleScreenLayoutProps {
  topBar: ReactNode;
  portraits: ReactNode;
  battlefield: ReactNode;
  bottomPanel: ReactNode;
  targetOverlay?: ReactNode;
  executionIndicator?: ReactNode;
}
```

**Implementation:**
```tsx
export function BattleScreenLayout({
  topBar,
  portraits,
  battlefield,
  bottomPanel,
  targetOverlay,
  executionIndicator,
}: BattleScreenLayoutProps) {
  return (
    <div className="battle-screen">
      <div className="top-bar">{topBar}</div>
      <aside className="portrait-panel">{portraits}</aside>
      <main className="battlefield">{battlefield}</main>
      <section className="bottom-panel">{bottomPanel}</section>
      {targetOverlay}
      {executionIndicator}
    </div>
  );
}
```

---

## Phase 3: Refactor QueueBattleView

### 3.1 Import New Components

```typescript
import { BattleScreenLayout } from './battle/BattleScreenLayout';
import { BattleTopBar } from './battle/BattleTopBar';
import { BattlePortraitPanel } from './battle/BattlePortraitPanel';
import { Battlefield } from './battle/Battlefield';
import { BattleBottomPanel } from './battle/BattleBottomPanel';
import '../styles/queue-battle-grid.css';
```

### 3.2 Keep All Existing Logic

**DO NOT CHANGE:**
- ✅ All `useState`, `useMemo`, `useEffect` hooks
- ✅ All Zustand selectors (`useStore`)
- ✅ All handler functions (`handleAbilitySelect`, `handleTargetSelect`, `handleExecute`)
- ✅ All computed values (`currentUnit`, `lockedDjinnAbilities`, `isPlanningLocked`, `isQueueComplete`)
- ✅ Post-battle state (`showCutscene`, `showVictoryOverlay`)
- ✅ Event queue processing

**ONLY CHANGE:**
- JSX structure (replace inline div soup with components)
- Remove inline `style={{...}}` props
- Pass state/handlers to new components as props

### 3.3 New JSX Structure

```tsx
export function QueueBattleView() {
  // ... all existing hooks, state, handlers (unchanged)

  if (!battle) return <div>Loading Battle...</div>;
  if (showCutscene) return <PostBattleCutscene ... />;
  if (showVictoryOverlay) return <VictoryOverlay ... />;

  return (
    <BattleScreenLayout
      topBar={
        <BattleTopBar
          remainingMana={battle.remainingMana}
          maxMana={battle.maxMana}
          queuedManaChange={/* calculate from queued actions */}
          team={battle.playerTeam}
          queuedDjinn={battle.queuedDjinn}
          onDjinnClick={(djinnId) => {
            if (battle.queuedDjinn.includes(djinnId)) {
              unqueueDjinnActivation(djinnId);
            } else {
              queueDjinnActivation(djinnId);
            }
          }}
          disabled={isPlanningLocked}
        />
      }
      portraits={
        <BattlePortraitPanel
          units={battle.playerTeam.units}
          team={battle.playerTeam}
          selectedUnitIndex={selectedUnitIndex}
          queuedActions={battle.queuedActions}
          onSelectUnit={(index) => {
            if (!isPlanningLocked) {
              setSelectedUnitIndex(index);
              setSelectedAbilityId(null);
            }
          }}
          disabled={isPlanningLocked}
        />
      }
      battlefield={
        <Battlefield
          enemies={battle.enemies}
          playerUnits={battle.playerTeam.units}
          validTargets={validTargets}
          onTargetSelect={handleTargetSelect}
        />
      }
      bottomPanel={
        <BattleBottomPanel
          phase={battle.phase}
          currentUnit={currentUnit}
          currentUnitIndex={selectedUnitIndex}
          abilities={currentUnit?.abilities || []}
          unlockedAbilityIds={currentUnit?.unlockedAbilityIds || []}
          lockedDjinnAbilities={lockedDjinnAbilities}
          selectedAbilityId={selectedAbilityId}
          onAbilitySelect={handleAbilitySelect}
          queuedActions={battle.queuedActions}
          remainingMana={battle.remainingMana}
          isQueueComplete={isQueueComplete}
          onExecute={handleExecute}
          events={events}
        />
      }
      targetOverlay={
        validTargets.length > 0 && (
          <div className="target-overlay">
            <div style={{ color: '#ffd700', fontWeight: 'bold' }}>
              SELECT TARGET
            </div>
            <div style={{ fontSize: '0.9rem', color: '#ccc' }}>
              Click a valid target to confirm action
            </div>
            <button onClick={() => setSelectedAbilityId(null)}>
              CANCEL
            </button>
          </div>
        )
      }
      executionIndicator={
        isExecuting && (
          <div className="execution-indicator">
            ⚔️ EXECUTING ROUND... ⚔️
          </div>
        )
      }
    />
  );
}
```

---

## Phase 4: Testing & Refinement

### 4.1 Visual Testing Checklist

- [ ] Grid layout matches mockup (200px portraits, flexible battlefield, full-width bottom)
- [ ] Top bar: Mana circles fill/unfill correctly
- [ ] Top bar: Djinn icons show active/standby states
- [ ] Portraits: HP bars color-coded (green/orange/red)
- [ ] Portraits: Queued checkmark appears when action set
- [ ] Portraits: Hover expansion shows stats
- [ ] Battlefield: Background GIF visible at 30% opacity
- [ ] Battlefield: Enemies numbered and clickable when valid
- [ ] Battlefield: Players staggered with CSS nth-child
- [ ] Bottom: Current unit label updates
- [ ] Bottom: Action queue line shows queued actions
- [ ] Bottom: Abilities in 35/65 two-column layout
- [ ] Bottom: Selected ability highlighted in gold
- [ ] Bottom: Ability details show on right when ability selected
- [ ] Bottom: Combat log shows on right during execution
- [ ] Bottom: Execute button enabled only when queue complete
- [ ] Target overlay appears when ability selected
- [ ] Execution indicator shown during execution phase

### 4.2 Functional Testing Checklist

- [ ] Click unit portrait → selects unit, updates ability list
- [ ] Click ability → selects ability, shows valid targets
- [ ] Click enemy → queues action, advances to next unit
- [ ] Click Djinn → toggles Djinn activation
- [ ] Click Execute → transitions to execution phase
- [ ] Events process with 450ms delay
- [ ] Battle log renders events with colors
- [ ] Post-battle cutscene triggers on victory
- [ ] Victory overlay shows after cutscene
- [ ] Rewards screen appears after victory overlay

### 4.3 Regression Testing

- [ ] Speed-based turn order still works (getPlanningTurnOrder)
- [ ] Mana calculation includes queued actions
- [ ] Djinn abilities lock/unlock based on Djinn state
- [ ] Status effects display correctly
- [ ] KO units grayed out and unselectable
- [ ] Round execution deterministic (seeded RNG)
- [ ] Event text rendering unchanged

---

## Phase 5: Cleanup & Polish

### 5.1 Remove Old Components

After confirming everything works:

- [ ] Delete `ManaCirclesBar.tsx` (replaced by BattleTopBar)
- [ ] Delete `DjinnBar.tsx` (replaced by BattleTopBar)
- [ ] Delete `ActionQueuePanel.tsx` (replaced by BattleBottomPanel queue line)
- [ ] Keep `UnitCard.tsx` for now (used elsewhere? check references)
- [ ] Keep `BattleLog.tsx` (reused in BattleBottomPanel)

### 5.2 Update Imports

Search for any other files importing deleted components and update them.

### 5.3 Add Type Safety

- [ ] Export all prop interfaces from component files
- [ ] Add JSDoc comments to main components
- [ ] Ensure no `any` types in battle/ components

---

## Implementation Order (Recommended)

1. **Phase 1 (CSS)** - Start here, ensures visual target is clear
2. **Phase 2.5 (BattleScreenLayout)** - Grid wrapper first, test with placeholder content
3. **Phase 2.1 (BattleTopBar)** - Simple, self-contained, easy win
4. **Phase 2.3 (Battlefield)** - Visual centerpiece, test sprites/background
5. **Phase 2.2 (PortraitPanel)** - More complex (HP bars, status, hover)
6. **Phase 2.4 (BottomPanel)** - Most complex (abilities, details, log toggle)
7. **Phase 3 (Refactor QueueBattleView)** - Wire everything together
8. **Phase 4 (Testing)** - Systematic validation
9. **Phase 5 (Cleanup)** - Remove old code

---

## Risk Mitigation

### Risk: State wiring breaks

**Mitigation:**
- Keep all existing state management code EXACTLY as-is
- Only change how components are rendered, not what they do
- Test after each component extraction

### Risk: CSS conflicts with existing styles

**Mitigation:**
- Use specific class names from mockup (`.battle-screen`, not `.screen`)
- Import new CSS file only in QueueBattleView
- Scope all styles to `.battle-screen` parent

### Risk: Event processing breaks

**Mitigation:**
- Don't touch event queue logic or BattleLog component
- Just move BattleLog into new BottomPanel structure

### Risk: Performance regression

**Mitigation:**
- No new re-renders (same state structure)
- CSS animations already GPU-accelerated
- Grid layout is performant (native browser feature)

---

## Success Criteria

✅ Visual match: Battle screen looks identical to `battle-screen-queue-based-final.html`
✅ Functional match: All existing features work unchanged
✅ Code quality: Components are < 200 lines, single responsibility
✅ Type safety: No `any` types, all props typed
✅ No regressions: All existing tests pass
✅ Performance: No noticeable slowdown

---

## Estimated Effort

- Phase 1 (CSS): 30 minutes (copy-paste + organize)
- Phase 2 (Components): 2-3 hours (5 components @ 30-45 min each)
- Phase 3 (Refactor): 1 hour (wire components, test locally)
- Phase 4 (Testing): 1 hour (systematic checklist)
- Phase 5 (Cleanup): 30 minutes (delete old, update imports)

**Total: ~5-6 hours**

Can be split into 2-3 sessions:
1. CSS + Layout + TopBar (visual foundation)
2. Battlefield + Portraits (core UI)
3. BottomPanel + Refactor + Test (complex logic)
