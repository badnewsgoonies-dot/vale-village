# Houses 1-5 Dialogue Integration Plan

**Goal:** Integrate pre-battle and post-battle dialogues for the first 5 houses to make them fully functional and testable.

---

## 📋 Current State

### What Already Works ✅

1. **Post-Battle Recruitment Dialogues**
   - Houses 1, 2, 3, 5 have recruitment dialogues
   - Triggered via `handleRewardsContinue()` in `App.tsx`
   - Work correctly after battle victory

2. **Pre-Battle Dialogue Content**
   - Liberation dialogues exist in `liberationDialogues.ts`
   - Houses 1-5 have pre-battle dialogue content
   - **BUT:** Not being triggered before battles

3. **VS1 Special Handling**
   - VS1 (House 1 demo) has pre-scene and post-scene
   - Pre-scene triggers before battle
   - Post-scene triggers after rewards

### What's Missing ⚠️

1. **Pre-Battle Dialogue Integration**
   - Liberation dialogues exist but aren't triggered
   - Need to show pre-battle dialogue BEFORE team-select
   - Pre-battle dialogue should end with battle trigger

2. **House 4 Post-Battle Dialogue**
   - House 4 has liberation dialogue but no recruitment dialogue
   - Should still show post-battle dialogue (even without recruitment)

---

## 🏗️ Integration Architecture

### Flow for Houses 1-5

```
1. Player walks to house trigger (overworld)
   ↓
2. Check: Does house have pre-battle dialogue?
   ↓ YES
3. Show pre-battle dialogue
   ↓
4. Pre-battle dialogue ends with: effects: { startBattle: 'house-XX' }
   ↓
5. Trigger battle (team-select → battle)
   ↓
6. Battle victory → Rewards screen
   ↓
7. Player clicks "Continue" → handleRewardsContinue()
   ↓
8. Check: Does house have recruitment dialogue?
   ↓ YES
9. Show recruitment dialogue
   ↓
10. Recruitment dialogue ends → Overworld
```

---

## 🔧 Implementation Plan

### Step 1: Create Pre-Battle Dialogue System

**File:** `src/data/definitions/preBattleDialogues.ts`

```typescript
import type { DialogueTree } from '@/core/models/dialogue';
import { HOUSE_01_DIALOGUE, HOUSE_02_DIALOGUE, HOUSE_03_DIALOGUE, HOUSE_04_DIALOGUE, HOUSE_05_DIALOGUE } from './liberationDialogues';

/**
 * Map encounter IDs to pre-battle dialogue IDs
 */
export const ENCOUNTER_TO_PRE_BATTLE_DIALOGUE: Record<string, string> = {
  'house-01': 'house-01-liberation',
  'house-02': 'house-02-flint',
  'house-03': 'house-03-ice',
  'house-04': 'house-04-breeze',
  'house-05': 'house-05-escalation',
};

/**
 * Get pre-battle dialogue for an encounter ID
 */
export function getPreBattleDialogue(encounterId: string): DialogueTree | null {
  const dialogueId = ENCOUNTER_TO_PRE_BATTLE_DIALOGUE[encounterId];
  if (!dialogueId) return null;
  
  // Map dialogue IDs to actual dialogue trees
  const dialogueMap: Record<string, DialogueTree> = {
    'house-01-liberation': HOUSE_01_DIALOGUE,
    'house-02-flint': HOUSE_02_DIALOGUE,
    'house-03-ice': HOUSE_03_DIALOGUE,
    'house-04-breeze': HOUSE_04_DIALOGUE,
    'house-05-escalation': HOUSE_05_DIALOGUE,
  };
  
  return dialogueMap[dialogueId] || null;
}

/**
 * Check if an encounter has a pre-battle dialogue
 */
export function hasPreBattleDialogue(encounterId: string): boolean {
  return encounterId in ENCOUNTER_TO_PRE_BATTLE_DIALOGUE;
}
```

### Step 2: Modify Liberation Dialogues to Trigger Battles

**File:** `src/data/definitions/liberationDialogues.ts`

**Current structure:** Pre-battle dialogues end without triggering battle.

**Needed change:** Add `effects: { startBattle: 'house-XX' }` to the last node of each pre-battle dialogue.

**Example for House 1:**
```typescript
export const HOUSE_01_DIALOGUE: DialogueTree = {
  id: 'house-01-liberation',
  name: 'House 1: The First Cage',
  startNodeId: 'pre-battle',
  nodes: [
    {
      id: 'pre-battle',
      speaker: 'Earth Scout',
      text: '*laughs* Another fool thinking they can stop us? This wolf here has more bite than you, kid.',
      portrait: 'enemy-scout',
      nextNodeId: 'isaac-response',
    },
    {
      id: 'isaac-response',
      speaker: 'Isaac',
      text: 'Let\'s see how confident you are after I free that wolf from your control.',
      portrait: 'isaac',
      effects: { startBattle: 'house-01' }, // ✅ ADD THIS
    },
  ],
};
```

**Do this for all 5 houses:**
- House 1: `effects: { startBattle: 'house-01' }`
- House 2: `effects: { startBattle: 'house-02' }`
- House 3: `effects: { startBattle: 'house-03' }`
- House 4: `effects: { startBattle: 'house-04' }`
- House 5: `effects: { startBattle: 'house-05' }`

### Step 3: Integrate Pre-Battle Dialogue into Game Flow

**File:** `src/ui/state/gameFlowSlice.ts`

**Current behavior:** When battle trigger is encountered, immediately go to team-select.

**New behavior:** Check for pre-battle dialogue first, show it, then go to team-select.

**Modification:**
```typescript
// In handleTrigger function, for battle triggers:
if (trigger.type === 'battle') {
  const encounterId = (trigger.data as { encounterId?: string }).encounterId;
  if (!encounterId) {
    console.error('Battle trigger missing encounterId');
    return;
  }

  const encounter = ENCOUNTERS[encounterId];
  if (!encounter) {
    console.error(`Encounter ${encounterId} not found in ENCOUNTERS`);
    return;
  }

  // ✅ NEW: Check for pre-battle dialogue
  const preBattleDialogue = getPreBattleDialogue(encounterId);
  if (preBattleDialogue) {
    // Show pre-battle dialogue first
    // The dialogue will trigger the battle via effects.startBattle
    get().startDialogueTree(preBattleDialogue);
    set({ lastTrigger: trigger });
    return;
  }

  // No pre-battle dialogue: go straight to team-select (existing behavior)
  set({
    mode: 'team-select',
    pendingBattleEncounterId: encounterId,
    lastTrigger: trigger,
  });
  return;
}
```

### Step 4: Handle Battle Trigger from Dialogue Effects

**File:** `src/ui/state/dialogueSlice.ts`

**Current behavior:** Dialogue effects can trigger battles via `effects.startBattle`.

**Check:** Does `processDialogueEffects` handle `startBattle` correctly?

**Current code:**
```typescript
if (typeof effects.startBattle === 'string') {
  const encounterId = effects.startBattle;
  console.warn(`Starting battle from dialogue: ${encounterId}`);
  store.handleTrigger({
    id: 'dialogue-battle',
    type: 'battle',
    position: { x: 0, y: 0 },
    data: { encounterId },
  });
}
```

**Issue:** This calls `handleTrigger` again, which might show pre-battle dialogue again (infinite loop).

**Fix:** Need to skip pre-battle dialogue check when triggered from dialogue.

**Solution:** Add a flag to `handleTrigger` to skip pre-battle dialogue:

```typescript
// In gameFlowSlice.ts
handleTrigger: (trigger, skipPreBattleDialogue = false) => {
  // ... existing code ...
  
  if (trigger.type === 'battle') {
    // ... existing code ...
    
    // ✅ NEW: Skip pre-battle dialogue if triggered from dialogue
    if (!skipPreBattleDialogue) {
      const preBattleDialogue = getPreBattleDialogue(encounterId);
      if (preBattleDialogue) {
        get().startDialogueTree(preBattleDialogue);
        set({ lastTrigger: trigger });
        return;
      }
    }
    
    // Go to team-select
    set({
      mode: 'team-select',
      pendingBattleEncounterId: encounterId,
      lastTrigger: trigger,
    });
    return;
  }
}

// In dialogueSlice.ts
if (typeof effects.startBattle === 'string') {
  const encounterId = effects.startBattle;
  store.handleTrigger({
    id: 'dialogue-battle',
    type: 'battle',
    position: { x: 0, y: 0 },
    data: { encounterId },
  }, true); // ✅ Pass true to skip pre-battle dialogue
}
```

### Step 5: Add House 4 Post-Battle Dialogue (Optional)

**File:** `src/data/definitions/recruitmentDialogues.ts`

House 4 doesn't have a recruitment dialogue, but it should still have a post-battle dialogue.

**Option 1:** Use liberation dialogue's post-battle node (if it exists)

**Option 2:** Create a simple post-battle dialogue for House 4

**Recommendation:** Option 2 - create a simple dialogue:

```typescript
export const HOUSE_04_POST_BATTLE: DialogueTree = {
  id: 'house-04-post',
  name: 'House 4: Victory',
  startNodeId: 'victory',
  nodes: [
    {
      id: 'victory',
      speaker: 'Isaac',
      text: 'Another house freed. The villagers are grateful.',
      portrait: 'isaac',
    },
  ],
};
```

Then add to `ENCOUNTER_TO_RECRUITMENT_DIALOGUE`:
```typescript
export const ENCOUNTER_TO_RECRUITMENT_DIALOGUE: Record<string, string> = {
  // ... existing ...
  'house-04': 'house-04-post', // ✅ ADD THIS
};
```

---

## 📝 Summary of Changes

### Files to Create:
1. `src/data/definitions/preBattleDialogues.ts` - Pre-battle dialogue mapping

### Files to Modify:
1. `src/data/definitions/liberationDialogues.ts` - Add `startBattle` effects to last nodes
2. `src/ui/state/gameFlowSlice.ts` - Check for pre-battle dialogue before team-select
3. `src/ui/state/dialogueSlice.ts` - Skip pre-battle dialogue when triggering from dialogue
4. `src/data/definitions/recruitmentDialogues.ts` - Add House 4 post-battle dialogue (optional)
5. `src/data/definitions/recruitmentData.ts` - Add House 4 to mapping (optional)

---

## ✅ Testing Checklist

After implementation, test:

1. **House 1:**
   - [ ] Pre-battle dialogue shows before team-select
   - [ ] Pre-battle dialogue triggers battle
   - [ ] Post-battle recruitment dialogue shows after rewards
   - [ ] Garet is recruited

2. **House 2:**
   - [ ] Pre-battle dialogue shows
   - [ ] Post-battle recruitment dialogue shows
   - [ ] Mystic is recruited

3. **House 3:**
   - [ ] Pre-battle dialogue shows
   - [ ] Post-battle recruitment dialogue shows
   - [ ] Ranger is recruited

4. **House 4:**
   - [ ] Pre-battle dialogue shows
   - [ ] Post-battle dialogue shows (even without recruitment)
   - [ ] No infinite loops

5. **House 5:**
   - [ ] Pre-battle dialogue shows
   - [ ] Post-battle recruitment dialogue shows
   - [ ] Blaze is recruited

6. **Edge Cases:**
   - [ ] No infinite dialogue loops
   - [ ] Dialogue can be skipped (ESC key)
   - [ ] Battle triggers correctly from dialogue effects

---

## 🎯 Implementation Priority

1. **HIGH:** Modify liberation dialogues to add `startBattle` effects
2. **HIGH:** Integrate pre-battle dialogue check in `gameFlowSlice.ts`
3. **HIGH:** Fix dialogue → battle trigger to skip pre-battle dialogue
4. **MEDIUM:** Create pre-battle dialogue mapping file
5. **LOW:** Add House 4 post-battle dialogue (nice-to-have)

---

## 📌 Notes

- **VS1** already has pre-battle dialogue working (special case)
- **Post-battle recruitment dialogues** already work (no changes needed)
- **Pre-battle dialogues** just need to be integrated into the flow
- **Main challenge:** Preventing infinite loops when dialogue triggers battle

---

**Status:** Ready for implementation. The architecture is clear, and the changes are minimal.
