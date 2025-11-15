# Implementation Prompt: Pre-Battle Team Selection Screen

## Objective
Create a single-screen, no-scrolling pre-battle team selection UI that allows players to:
1. Select 1-4 units from roster for active party
2. Manage equipment for each unit
3. Manage Djinn for each unit
4. View enemy intelligence before battle
5. Start battle with selected team

**Critical Requirement:** All information must fit on ONE screen with NO scrolling. Layout must scale responsively.

---

## Step 1: Update GameFlowSlice for Team Selection Mode

**File:** `apps/vale-v2/src/ui/state/gameFlowSlice.ts`

**Changes:**
1. Add `pendingBattleEncounterId: string | null` to `GameFlowSlice` interface
2. Add `setPendingBattle(encounterId: string | null)` method
3. Modify `handleTrigger()` for battle type:
   - Instead of immediately creating battle, set `mode: 'team-select'` and `pendingBattleEncounterId`
   - Save encounter ID for later use
4. Add `confirmBattleTeam()` method:
   - Takes selected team
   - Creates battle from `pendingBattleEncounterId`
   - Sets `mode: 'battle'`
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
  
  // Set team selection mode instead of creating battle immediately
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
  get().setTeam(team); // Update team state
  
  set({
    currentEncounter: encounter,
    mode: 'battle',
    preBattlePosition,
    pendingBattleEncounterId: null,
  });
},
```

---

## Step 2: Create PreBattleTeamSelectScreen Component

**File:** `apps/vale-v2/src/ui/components/PreBattleTeamSelectScreen.tsx` (NEW)

**Requirements:**
- Single screen layout (no scrolling)
- Left panel: Enemy intelligence (30% width)
- Right panel: Team management (70% width)
- Responsive scaling using CSS Grid and `clamp()`

**Component Structure:**
```typescript
import { useState } from 'react';
import { useStore } from '../state/store';
import { ENCOUNTERS } from '@/data/definitions/encounters';
import { ENEMIES } from '@/data/definitions/enemies';
import { createTeam } from '@/core/models/Team';
import { MIN_PARTY_SIZE, MAX_PARTY_SIZE } from '@/core/constants';
import './PreBattleTeamSelectScreen.css';

interface PreBattleTeamSelectScreenProps {
  encounterId: string;
  onCancel: () => void;
  onConfirm: (team: Team) => void;
}

export function PreBattleTeamSelectScreen({
  encounterId,
  onCancel,
  onConfirm,
}: PreBattleTeamSelectScreenProps) {
  const { roster, team, swapPartyMember, updateTeam } = useStore();
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [showDjinnModal, setShowDjinnModal] = useState(false);
  
  const encounter = ENCOUNTERS[encounterId];
  if (!encounter) {
    return <div>Error: Encounter not found</div>;
  }
  
  // Get enemy data for intelligence panel
  const enemyData = encounter.enemies.map(id => ENEMIES[id]).filter(Boolean);
  
  // Get current active party (1-4 units)
  const activeParty = team?.units || [];
  
  // Get bench units (roster units not in active party)
  const benchUnits = roster.filter(
    unit => !activeParty.some(active => active.id === unit.id)
  );
  
  // Handle adding unit to slot
  const handleAddToSlot = (slotIndex: number, unitId: string) => {
    swapPartyMember(slotIndex, unitId);
    setSelectedSlotIndex(slotIndex);
  };
  
  // Handle removing unit from party
  const handleRemoveFromParty = (slotIndex: number) => {
    const newUnits = activeParty.filter((_, i) => i !== slotIndex);
    if (newUnits.length === 0) {
      // Can't have empty team, keep at least 1 unit
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
    <div className="pre-battle-team-select">
      <div className="pre-battle-header">
        <h1>Pre-Battle Team Selection</h1>
        <button className="close-btn" onClick={onCancel}>×</button>
      </div>
      
      <div className="pre-battle-content">
        {/* Left Panel: Enemy Intelligence */}
        <div className="enemy-intelligence-panel">
          <h2>{encounter.name}</h2>
          <div className="difficulty-badge">{encounter.difficulty}</div>
          
          <div className="enemy-list">
            {enemyData.map((enemy, idx) => (
              <div key={enemy.id} className="enemy-card">
                <h3>{enemy.name}</h3>
                <div className="enemy-element">{enemy.element}</div>
                <div className="enemy-stats">
                  <div>Level {enemy.level}</div>
                  <div>HP: {enemy.stats.hp}</div>
                  <div>ATK: {enemy.stats.atk} | DEF: {enemy.stats.def}</div>
                  <div>MAG: {enemy.stats.mag} | SPD: {enemy.stats.spd}</div>
                </div>
                <div className="enemy-abilities">
                  {enemy.abilities.slice(0, 3).map(ability => (
                    <span key={ability.id} className="ability-tag">
                      {ability.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="threat-assessment">
            <h3>Threat Assessment</h3>
            {/* Add elemental analysis, weaknesses, etc. */}
          </div>
        </div>
        
        {/* Right Panel: Team Management */}
        <div className="team-management-panel">
          {/* Active Party Slots */}
          <div className="active-party-slots">
            <h2>Active Party ({activeParty.length}/{MAX_PARTY_SIZE})</h2>
            <div className="party-slots-grid">
              {Array.from({ length: MAX_PARTY_SIZE }).map((_, idx) => {
                const unit = activeParty[idx];
                const isSelected = selectedSlotIndex === idx;
                
                return (
                  <div
                    key={idx}
                    className={`party-slot ${isSelected ? 'selected' : ''} ${unit ? 'filled' : 'empty'}`}
                    onClick={() => setSelectedSlotIndex(isSelected ? null : idx)}
                  >
                    {unit ? (
                      <>
                        <div className="unit-name">{unit.name}</div>
                        <div className="unit-level">Lv. {unit.level}</div>
                        <div className="unit-element">{unit.element}</div>
                      </>
                    ) : (
                      <div className="empty-slot-text">Click to add</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Unit Details Panel (expands when unit selected) */}
          {selectedSlotIndex !== null && activeParty[selectedSlotIndex] && (
            <div className="unit-details-panel">
              {(() => {
                const unit = activeParty[selectedSlotIndex];
                return (
                  <>
                    <div className="unit-header">
                      <h3>{unit.name} ({unit.role})</h3>
                      <button onClick={() => handleRemoveFromParty(selectedSlotIndex)}>
                        Remove
                      </button>
                    </div>
                    
                    <div className="unit-stats">
                      <div>HP: {unit.currentHp}/{unit.maxHp}</div>
                      <div>PP: {unit.currentPp}/{unit.maxPp}</div>
                      <div>ATK: {unit.stats.atk} | DEF: {unit.stats.def}</div>
                      <div>MAG: {unit.stats.mag} | SPD: {unit.stats.spd}</div>
                    </div>
                    
                    <div className="equipment-section">
                      <h4>Equipment</h4>
                      {/* Equipment slots */}
                    </div>
                    
                    <div className="djinn-section">
                      <h4>Djinn (3 slots max)</h4>
                      {/* Djinn slots */}
                    </div>
                    
                    <div className="abilities-section">
                      <h4>Granted Abilities</h4>
                      {/* Abilities from Djinn */}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
          
          {/* Bench Units */}
          <div className="bench-section">
            <h3>Bench Units</h3>
            <div className="bench-grid">
              {benchUnits.map(unit => (
                <div key={unit.id} className="bench-unit-card">
                  <div className="unit-name">{unit.name}</div>
                  <div className="unit-level">Lv. {unit.level}</div>
                  <div className="unit-element">{unit.element}</div>
                  <button
                    onClick={() => {
                      // Find first empty slot or replace selected slot
                      const targetSlot = selectedSlotIndex !== null
                        ? selectedSlotIndex
                        : activeParty.length < MAX_PARTY_SIZE
                        ? activeParty.length
                        : 0;
                      handleAddToSlot(targetSlot, unit.id);
                    }}
                    disabled={activeParty.length >= MAX_PARTY_SIZE && selectedSlotIndex === null}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="pre-battle-actions">
        <button className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button
          className="start-battle-btn"
          onClick={handleStartBattle}
          disabled={!team || team.units.length < MIN_PARTY_SIZE}
        >
          Start Battle
        </button>
      </div>
    </div>
  );
}
```

---

## Step 3: Create CSS for Single-Screen Layout

**File:** `apps/vale-v2/src/ui/components/PreBattleTeamSelectScreen.css` (NEW)

**Requirements:**
- No scrolling (`overflow: hidden` on container)
- Responsive scaling using `clamp()` for fonts
- CSS Grid for layout
- Max height constraints to prevent overflow

**Key CSS:**
```css
.pre-battle-team-select {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #1a1a1a;
  color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* NO SCROLLING */
  z-index: 1000;
}

.pre-battle-content {
  display: grid;
  grid-template-columns: 30fr 70fr; /* 30% enemy, 70% team */
  gap: 1rem;
  padding: 1rem;
  flex: 1;
  overflow: hidden; /* NO SCROLLING */
  min-height: 0; /* Allows flex children to shrink */
}

.enemy-intelligence-panel,
.team-management-panel {
  overflow-y: auto; /* Only internal scrolling if needed */
  max-height: 100%;
}

/* Responsive font sizes */
.pre-battle-header h1 {
  font-size: clamp(1.5rem, 3vw, 2rem);
}

.unit-name {
  font-size: clamp(0.875rem, 1.5vw, 1rem);
}

/* Party slots grid - scales with viewport */
.party-slots-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  max-height: 20vh; /* Constrain height */
}

.party-slot {
  aspect-ratio: 1;
  border: 2px solid #444;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.party-slot.selected {
  border-color: #4a9eff;
  box-shadow: 0 0 10px rgba(74, 158, 255, 0.5);
}

/* Bench grid - horizontal scroll if needed */
.bench-grid {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto; /* Horizontal scroll OK */
  overflow-y: hidden;
  max-height: 15vh;
}

/* Unit details panel - accordion style, max height */
.unit-details-panel {
  max-height: 40vh;
  overflow-y: auto; /* Internal scroll OK */
  border: 1px solid #444;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

/* Responsive breakpoints */
@media (max-width: 1366px) {
  .pre-battle-content {
    grid-template-columns: 25fr 75fr; /* Narrower enemy panel */
  }
}

@media (max-width: 1280px) {
  .pre-battle-content {
    grid-template-columns: 20fr 80fr; /* Even narrower */
  }
  
  .party-slots-grid {
    grid-template-columns: repeat(2, 1fr); /* 2x2 grid on small screens */
  }
}
```

---

## Step 4: Integrate into App.tsx

**File:** `apps/vale-v2/src/App.tsx`

**Changes:**
1. Import `PreBattleTeamSelectScreen`
2. Add conditional rendering for `mode === 'team-select'`
3. Pass `pendingBattleEncounterId` to component
4. Handle `onCancel` (return to overworld)
5. Handle `onConfirm` (call `confirmBattleTeam`)

**Code Pattern:**
```typescript
import { PreBattleTeamSelectScreen } from './ui/components/PreBattleTeamSelectScreen';

// In App component:
const mode = useStore((s) => s.mode);
const pendingBattleEncounterId = useStore((s) => s.pendingBattleEncounterId);
const confirmBattleTeam = useStore((s) => s.confirmBattleTeam);
const returnToOverworld = useStore((s) => s.returnToOverworld);

// In render:
{mode === 'team-select' && pendingBattleEncounterId && (
  <PreBattleTeamSelectScreen
    encounterId={pendingBattleEncounterId}
    onCancel={() => {
      returnToOverworld();
    }}
    onConfirm={(team) => {
      confirmBattleTeam(team);
    }}
  />
)}
```

---

## Step 5: Equipment Management Modal

**File:** `apps/vale-v2/src/ui/components/EquipmentSelectModal.tsx` (NEW or extend existing)

**Requirements:**
- Overlay modal (not part of main screen)
- Show available equipment from inventory
- Filter by equipment slot type (Weapon/Armor/Helm/Boots/Accessory)
- Filter by unit compatibility (unit-locked equipment)
- Select equipment to equip

**Integration:**
- Called from `PreBattleTeamSelectScreen` when "Change" clicked on equipment slot
- Updates team via `updateTeam()` with new equipment

---

## Step 6: Djinn Management Modal

**File:** `apps/vale-v2/src/ui/components/DjinnSelectModal.tsx` (NEW or extend existing)

**Requirements:**
- Overlay modal (not part of main screen)
- Show available Djinn from team's Djinn collection
- Show Djinn state (Set/Standby/Recovering)
- Select Djinn to equip (max 3 per team, no duplicates)
- Show granted abilities preview

**Integration:**
- Called from `PreBattleTeamSelectScreen` when "Add Djinn" clicked
- Updates team via `updateTeam()` with new Djinn configuration

---

## Step 7: Sync PartyManagementScreen with Roster

**File:** `apps/vale-v2/src/ui/components/PartyManagementScreen.tsx`

**Changes:**
- Update to use `roster` from state instead of `UNIT_DEFINITIONS`
- Bench calculation: Filter `roster` units not in `activeParty`
- Bench rendering: Use actual `roster` unit data (levels, stats)

**Code Pattern:**
```typescript
const { roster, team } = useStore((s) => ({
  roster: s.roster,
  team: s.team,
}));

const activeParty = team?.units || [];
const benchUnits = roster.filter(
  unit => !activeParty.some(active => active.id === unit.id)
);

// Render benchUnits instead of creating from UNIT_DEFINITIONS
```

---

## Step 8: Testing Checklist

- [ ] Team selection screen appears when battle trigger occurs
- [ ] Can select 1-4 units from roster
- [ ] Can remove units from party
- [ ] Equipment modal opens and allows equipment changes
- [ ] Djinn modal opens and allows Djinn management
- [ ] Enemy intelligence displays correctly
- [ ] "Start Battle" validates team size (1-4 units)
- [ ] "Cancel" returns to overworld
- [ ] Layout fits on screen without scrolling (test at 1920x1080, 1366x768, 1280x720)
- [ ] Responsive scaling works correctly
- [ ] Roster syncs correctly with active party
- [ ] VS1 battle triggers team selection screen

---

## Implementation Order

1. **Step 1** - Update `gameFlowSlice.ts` (foundation)
2. **Step 2** - Create `PreBattleTeamSelectScreen.tsx` (basic structure)
3. **Step 3** - Create `PreBattleTeamSelectScreen.css` (layout)
4. **Step 4** - Integrate into `App.tsx` (routing)
5. **Step 5** - Equipment modal (if needed)
6. **Step 6** - Djinn modal (if needed)
7. **Step 7** - Sync `PartyManagementScreen.tsx` (consistency)
8. **Step 8** - Testing

---

## Critical Notes

1. **NO SCROLLING** - Use `overflow: hidden` on main container, only allow internal scrolling in panels if absolutely necessary
2. **Responsive scaling** - Use `clamp()` for fonts, CSS Grid with `fr` units, `max-height` constraints
3. **Team validation** - Enforce 1-4 units before allowing battle start
4. **Roster sync** - Always use `roster` from state, not `UNIT_DEFINITIONS`
5. **State management** - Use `pendingBattleEncounterId` to track which encounter is pending team selection

---

## Reference Files

- Mockup: `apps/vale-v2/docs/PRE_BATTLE_TEAM_SELECT_MOCKUP.md`
- GameFlowSlice: `apps/vale-v2/src/ui/state/gameFlowSlice.ts`
- TeamSlice: `apps/vale-v2/src/ui/state/teamSlice.ts`
- Encounters: `apps/vale-v2/src/data/definitions/encounters.ts`
- Enemies: `apps/vale-v2/src/data/definitions/enemies.ts`
- Constants: `apps/vale-v2/src/core/constants.ts` (MIN_PARTY_SIZE, MAX_PARTY_SIZE)

