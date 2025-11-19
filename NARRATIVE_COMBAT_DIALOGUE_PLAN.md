# Narrative & Combat Dialogue Implementation Plan

**Focus:** Narrative dialogues (story, NPCs) + Combat context messages (tactical hints)

---

## 🎯 What You Need

### 1. **Narrative Dialogues** ✅ (Your System is Ready!)

**What you have:**
- ✅ `DialogueBox` component (perfect for story scenes)
- ✅ `DialogueTree` structure (supports choices, effects, portraits)
- ✅ Story flag integration (can gate dialogues)
- ✅ Effects system (recruit units, grant djinn, trigger battles)

**What to do:** Just write dialogue content! No code changes needed.

**Types of narrative dialogues to create:**

1. **Chapter Introductions**
   ```typescript
   CHAPTER_1_INTRO: DialogueTree = {
     // Narration + character dialogue
     // Sets story flags
   }
   ```

2. **Pre-Battle Scenes**
   ```typescript
   HOUSE_01_PRE_BATTLE: DialogueTree = {
     // Story context before battle
     // Ends with: effects: { startBattle: 'house-01' }
   }
   ```

3. **Post-Battle Scenes**
   ```typescript
   HOUSE_01_POST_BATTLE: DialogueTree = {
     // Victory dialogue
     // Recruitment: effects: { recruitUnit: 'garet' }
   }
   ```

4. **NPC Conversations**
   ```typescript
   VILLAGER_DIALOGUE: DialogueTree = {
     // Quest givers, shopkeepers, story NPCs
     // Can have choices, conditions
   }
   ```

**Action:** Create these dialogue trees in `src/data/definitions/dialogues.ts`

---

### 2. **Combat Context Messages** ⚠️ (Need to Build)

**What you need:** Lightweight messages during battle (not full dialogue boxes)

**Examples:**
- "Isaac is low on HP!" (when HP < 30%)
- "Enemy is charging a powerful attack!" (when enemy uses high-power ability)
- "Move Isaac away from the enemy!" (tactical hint)

**Why separate from DialogueBox:**
- Non-blocking (doesn't pause battle)
- Auto-dismisses (2-3 seconds)
- Multiple can appear simultaneously
- Smaller, less intrusive

**What to build:**

1. **CombatMessageSlice** (Zustand state)
   ```typescript
   interface CombatMessageSlice {
     activeMessages: Array<{
       id: string;
       text: string;
       position: { x: number; y: number } | 'center' | 'top';
       duration: number;
     }>;
     showMessage: (text: string, position: Position, duration?: number) => void;
     dismissMessage: (id: string) => void;
   }
   ```

2. **CombatMessageOverlay** (React component)
   - Renders messages positioned on screen
   - Auto-dismisses after duration
   - Can stack multiple messages

3. **Integration Points**
   - In `QueueBattleView.tsx`: Check battle state, show messages
   - In battle events: Trigger messages on specific conditions

**Action:** Build this system (see implementation details below)

---

## 📋 Implementation Steps

### Step 1: Narrative Dialogues (No Code!)

**Priority:** HIGH  
**Effort:** Low (just writing)  
**Code Changes:** None

1. **Create chapter intro dialogues**
   - Chapter 1: "The Adepts of Vale"
   - Chapter 2: "Tournament of Elements"  
   - Chapter 3: "The Ancient Challenge"

2. **Create pre-battle scenes**
   - For each house encounter (1-20)
   - Story context before battle
   - Can reuse existing VS1 pattern

3. **Create post-battle scenes**
   - Victory reactions
   - Recruitment dialogues (you have some, add more)
   - Djinn granting scenes

4. **Create NPC dialogues**
   - Vale Village villagers
   - Quest givers
   - Shopkeepers (you have one, add more)

**Where to add:** `src/data/definitions/dialogues.ts`

**Example:**
```typescript
export const CHAPTER_1_INTRO: DialogueTree = {
  id: 'chapter-1-intro',
  name: 'Chapter 1: The Adepts of Vale',
  startNodeId: 'narration',
  nodes: [
    {
      id: 'narration',
      speaker: '', // Empty = narration box
      text: 'The sun rises over Vale Village, home to the Adepts of Weyard...',
      nextNodeId: 'isaac-speaks'
    },
    {
      id: 'isaac-speaks',
      speaker: 'Isaac',
      text: 'Today is the day I prove myself.',
      portrait: 'isaac',
      nextNodeId: 'garet-responds'
    },
    {
      id: 'garet-responds',
      speaker: 'Garet',
      text: "Let's do this, Isaac!",
      portrait: 'garet',
      effects: { 'chapter-1-started': true }
    }
  ]
};
```

**Triggering:**
- Chapter intros: Check `story.chapter` in title screen or overworld
- Pre-battle: Trigger before battle starts (in `gameFlowSlice.ts`)
- Post-battle: Already handled via recruitment dialogues
- NPCs: Already handled via map triggers

---

### Step 2: Combat Messages (New Component)

**Priority:** HIGH  
**Effort:** Medium  
**Code Changes:** New component + battle integration

#### 2.1 Create CombatMessageSlice

**File:** `src/ui/state/combatMessageSlice.ts`

```typescript
import type { StateCreator } from 'zustand';

export interface CombatMessage {
  id: string;
  text: string;
  position: { x: number; y: number } | 'center' | 'top';
  duration: number;
  createdAt: number;
}

export interface CombatMessageSlice {
  activeMessages: CombatMessage[];
  showMessage: (text: string, position: CombatMessage['position'], duration?: number) => void;
  dismissMessage: (id: string) => void;
  clearAllMessages: () => void;
}

export const createCombatMessageSlice: StateCreator<CombatMessageSlice> = (set) => ({
  activeMessages: [],
  
  showMessage: (text, position, duration = 3000) => {
    const id = `msg-${Date.now()}-${Math.random()}`;
    const message: CombatMessage = {
      id,
      text,
      position,
      duration,
      createdAt: Date.now(),
    };
    
    set((state) => ({
      activeMessages: [...state.activeMessages, message],
    }));
    
    // Auto-dismiss
    setTimeout(() => {
      set((state) => ({
        activeMessages: state.activeMessages.filter((m) => m.id !== id),
      }));
    }, duration);
  },
  
  dismissMessage: (id) => {
    set((state) => ({
      activeMessages: state.activeMessages.filter((m) => m.id !== id),
    }));
  },
  
  clearAllMessages: () => {
    set({ activeMessages: [] });
  },
});
```

#### 2.2 Create CombatMessageOverlay Component

**File:** `src/ui/components/battle/CombatMessageOverlay.tsx`

```typescript
import { useStore } from '../state/store';
import './CombatMessageOverlay.css';

export function CombatMessageOverlay() {
  const messages = useStore((s) => s.activeMessages);
  
  if (messages.length === 0) return null;
  
  return (
    <div className="combat-message-container">
      {messages.map((msg, idx) => {
        const getPosition = () => {
          if (typeof msg.position === 'string') {
            if (msg.position === 'center') {
              return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
            }
            if (msg.position === 'top') {
              return { top: '20%', left: '50%', transform: 'translateX(-50%)' };
            }
          }
          return {
            top: `${msg.position.y}px`,
            left: `${msg.position.x}px`,
            transform: 'translate(-50%, -50%)',
          };
        };
        
        return (
          <div
            key={msg.id}
            className="combat-message"
            style={{
              ...getPosition(),
              zIndex: 1000 + idx,
            }}
          >
            {msg.text}
          </div>
        );
      })}
    </div>
  );
}
```

**File:** `src/ui/components/battle/CombatMessageOverlay.css`

```css
.combat-message-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}

.combat-message {
  position: absolute;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  animation: combatMessageFadeInOut 3s ease-in-out;
  pointer-events: none;
}

@keyframes combatMessageFadeInOut {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  10% {
    opacity: 1;
    transform: translateY(0);
  }
  90% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}
```

#### 2.3 Add to Store

**File:** `src/ui/state/store.ts`

```typescript
// Add CombatMessageSlice to store
import { createCombatMessageSlice } from './combatMessageSlice';

export const useStore = create<Store>()(
  // ... existing slices
  createCombatMessageSlice,
);
```

#### 2.4 Integrate into Battle View

**File:** `src/ui/components/QueueBattleView.tsx`

```typescript
import { CombatMessageOverlay } from './battle/CombatMessageOverlay';

export function QueueBattleView() {
  // ... existing code
  
  const showMessage = useStore((s) => s.showMessage);
  
  // Example: Check for low HP
  useEffect(() => {
    if (!battle || battle.phase !== 'planning') return;
    
    battle.playerTeam.units.forEach((unit) => {
      const hpPercent = unit.currentHp / unit.maxHp;
      if (hpPercent < 0.3 && hpPercent > 0) {
        showMessage(
          `${unit.name} is low on HP!`,
          'top',
          3000
        );
      }
    });
  }, [battle?.playerTeam.units, battle?.phase, showMessage]);
  
  return (
    <div className="queue-battle-view">
      {/* ... existing battle UI */}
      <CombatMessageOverlay />
    </div>
  );
}
```

#### 2.5 Add Message Triggers

**Where to add triggers:**

1. **Low HP Warning** (in QueueBattleView)
   ```typescript
   if (unit.currentHp / unit.maxHp < 0.3) {
     showMessage(`${unit.name} is low on HP!`, 'top');
   }
   ```

2. **Enemy Attack Warning** (in battle events)
   ```typescript
   if (event.type === 'ability-used' && event.power > 50) {
     showMessage(`${event.attacker.name} is charging a powerful attack!`, 'center');
   }
   ```

3. **Tactical Hints** (when player selects unit near danger)
   ```typescript
   if (unitNearEnemy(selectedUnit, enemies)) {
     showMessage(`Move ${selectedUnit.name} away from the enemy!`, getUnitPosition(selectedUnit));
   }
   ```

---

## 🎨 Visual Design

### Narrative Dialogues (Current System)
- ✅ Full-screen overlay
- ✅ Character portraits
- ✅ Speaker names
- ✅ Choices
- **Keep as-is!**

### Combat Messages (New System)
- Small, semi-transparent box
- Positioned dynamically (near unit or center)
- Auto-dismiss after 2-4 seconds
- Can stack multiple messages
- No portrait (too small)

---

## ✅ Checklist

### Narrative Dialogues
- [ ] Write Chapter 1 intro dialogue
- [ ] Write Chapter 2 intro dialogue
- [ ] Write Chapter 3 intro dialogue
- [ ] Write pre-battle scenes for houses 1-5
- [ ] Write post-battle recruitment scenes (if missing)
- [ ] Write NPC dialogues for Vale Village
- [ ] Test dialogue flow end-to-end

### Combat Messages
- [ ] Create `combatMessageSlice.ts`
- [ ] Create `CombatMessageOverlay.tsx` component
- [ ] Create `CombatMessageOverlay.css`
- [ ] Add slice to store
- [ ] Integrate into `QueueBattleView.tsx`
- [ ] Add low HP warning trigger
- [ ] Add enemy attack warning trigger
- [ ] Add tactical hint triggers
- [ ] Test messages appear and dismiss correctly

---

## 🚀 Quick Start

**For Narrative Dialogues:**
1. Open `src/data/definitions/dialogues.ts`
2. Add a new dialogue tree (copy existing pattern)
3. Trigger it via story flags or map triggers
4. **Done!**

**For Combat Messages:**
1. Create the slice and component (see code above)
2. Add to store
3. Add to QueueBattleView
4. Add one trigger (low HP) to test
5. **Done!**

---

## 📝 Notes

- **Narrative dialogues:** Your system is ready - just write content!
- **Combat messages:** Simple addition, don't over-engineer
- **Skip UI tooltips:** You said you don't want these
- **Skip system notifications:** Not critical for your focus

**Focus on narrative first** - it has the biggest impact with zero code changes!
