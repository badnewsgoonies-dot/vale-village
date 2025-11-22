# VS1 Redesign Plan: Isaac vs Garet → Recruit Garet + Forge Djinn

## Original Goal

Transform VS1 from "bandit boss" battle to:
1. **Start:** Player has 1 unit (Isaac/Adept) + Venus Djinn (Flint)
2. **Battle:** Fight Garet (War Mage/Mars)
3. **After Victory:** Recruit Garet as second unit + Get Mars Djinn (Forge)

---

## Current State

### What Exists ✅
- ✅ VS1 encounter (`VS1_BANDITS`) - needs to change to Garet
- ✅ Djinn reward system (`RewardsService.processVictory()` handles `encounter.reward.djinn`)
- ✅ Unit definitions: `adept` (Isaac), `war-mage` (Garet)
- ✅ Encounter schema supports `unlockUnit` field
- ✅ Team roster system (`addUnitToRoster()` in `TeamSlice`)
- ✅ Initial team setup in `App.tsx` (currently uses `createTestBattle()`)

### What's Missing ❌
- ❌ Unit recruitment system (no processing of `encounter.reward.unlockUnit`)
- ❌ VS1 encounter needs to be changed to Garet
- ❌ Initial team setup needs to be 1 unit (Isaac) + Flint Djinn
- ❌ Garet enemy definition (need to create enemy version of war-mage)

---

## Implementation Steps

### Step 1: Create Garet Enemy Definition

**File:** `src/data/definitions/enemies.ts` (MODIFY)

**Changes:**
- Add `GARET_ENEMY` enemy definition
- Use war-mage stats but as enemy
- Level 2 (appropriate for VS1)
- Mars element
- Abilities: Strike, Fireball

**Code Pattern:**
```typescript
export const GARET_ENEMY: Enemy = {
  id: 'garet-enemy',
  name: 'Garet',
  level: 2,
  element: 'Mars',
  stats: {
    hp: 85,
    pp: 20,
    atk: 18,
    def: 12,
    mag: 14,
    spd: 10,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
  ],
  baseXp: 60,
  baseGold: 19,
};

// Add to ENEMIES export:
export const ENEMIES: Record<string, Enemy> = {
  // ... existing enemies
  'garet-enemy': GARET_ENEMY,
};
```

---

### Step 2: Update VS1 Encounter

**File:** `src/data/definitions/encounters.ts` (MODIFY)

**Changes:**
- Rename `VS1_BANDITS` to `VS1_GARET`
- Change enemies from bandits to `['garet-enemy']`
- Add `djinn: 'forge'` to rewards (Mars T1 Djinn)
- Add `unlockUnit: 'war-mage'` to rewards (recruit Garet)
- Update name to "VS1: Garet's Challenge"

**Code Pattern:**
```typescript
export const VS1_GARET: Encounter = {
  id: 'vs1-garet',
  name: 'VS1: Garet\'s Challenge',
  enemies: ['garet-enemy'],
  difficulty: 'medium',
  reward: {
    xp: 60,
    gold: 19,
    equipment: {
      type: 'none',
    },
    djinn: 'forge', // Mars T1 Djinn
    unlockUnit: 'war-mage', // Recruit Garet
  },
};

// Update ENCOUNTERS export:
export const ENCOUNTERS: Record<string, Encounter> = {
  // ... existing encounters
  'vs1-garet': VS1_GARET,
  // Remove: 'vs1-bandits': VS1_BANDITS,
};
```

**Also update:** `src/story/vs1Constants.ts`
```typescript
export const VS1_ENCOUNTER_ID = 'vs1-garet'; // Changed from 'vs1-bandits'
```

---

### Step 3: Implement Unit Recruitment System

**File:** `src/core/services/RewardsService.ts` (MODIFY)

**Changes:**
- Add unit recruitment processing after Djinn reward
- Check for `encounter.reward.unlockUnit`
- Create unit from definition and add to team roster
- Return recruitment info in distribution

**Code Pattern:**
```typescript
import { UNIT_DEFINITIONS } from '../../data/definitions/units';
import { createUnit } from '../models/Unit';

export function processVictory(
  battle: BattleState
): { distribution: RewardDistribution; updatedTeam: Team; recruitedUnit?: Unit } {
  const encounterId = getEncounterId(battle);
  if (!encounterId) {
    throw new Error('Cannot process victory without encounter ID');
  }

  const survivors = battle.playerTeam.units.filter(u => !isUnitKO(u));
  const rewards = calculateBattleRewards(encounterId, survivors.length);

  const distribution = distributeRewards(battle.playerTeam, rewards);
  const equipmentResolution = resolveEquipmentReward(rewards.equipmentReward);

  // Check for Djinn reward
  const encounter = ENCOUNTERS[encounterId];
  let updatedTeam = distribution.updatedTeam;
  if (encounter?.reward.djinn) {
    const djinnResult = collectDjinn(updatedTeam, encounter.reward.djinn);
    if (djinnResult.ok) {
      updatedTeam = djinnResult.value;
    }
  }

  // Check for unit recruitment
  let recruitedUnit: Unit | undefined;
  if (encounter?.reward.unlockUnit) {
    const unitDef = UNIT_DEFINITIONS[encounter.reward.unlockUnit];
    if (!unitDef) {
      console.error(`Unit definition ${encounter.reward.unlockUnit} not found`);
    } else {
      // Create unit at level 1 with 0 XP (or match encounter level)
      const enemyLevel = encounter.enemies.length > 0 
        ? ENEMIES[encounter.enemies[0]]?.level ?? 1
        : 1;
      recruitedUnit = createUnit(unitDef, enemyLevel, 0);
      
      // Add to team roster (will be handled by RewardsSlice)
      // Note: Don't add to active party automatically - let player choose
    }
  }

  const resolvedDistribution: RewardDistribution = {
    ...distribution,
    fixedEquipment: equipmentResolution.type === 'fixed' ? equipmentResolution.equipment : undefined,
    equipmentChoice: equipmentResolution.type === 'choice' ? equipmentResolution.options : undefined,
  };

  return {
    distribution: resolvedDistribution,
    updatedTeam,
    recruitedUnit, // New: return recruited unit
  };
}
```

**Update Type:** `src/core/models/Rewards.ts`
```typescript
export interface RewardDistribution {
  // ... existing fields
  recruitedUnit?: Unit; // New: recruited unit (if any)
}
```

---

### Step 4: Update RewardsSlice to Handle Recruitment

**File:** `src/ui/state/rewardsSlice.ts` (MODIFY)

**Changes:**
- Handle `recruitedUnit` from `processVictory()` result
- Add recruited unit to roster via `addUnitToRoster()`
- Update `RewardDistribution` type to include `recruitedUnit`

**Code Pattern:**
```typescript
processVictory: (battle) => {
  const result = rewardsServiceProcessVictory(battle);

  const { updateTeamUnits, addUnitToRoster } = get();
  updateTeamUnits(result.updatedTeam.units);

  // Handle unit recruitment
  if (result.recruitedUnit) {
    addUnitToRoster(result.recruitedUnit);
    console.log(`🎉 Recruited ${result.recruitedUnit.name}!`);
  }

  set({ lastBattleRewards: result.distribution });
},
```

---

### Step 5: Update Initial Team Setup for VS1

**File:** `src/App.tsx` (MODIFY)

**Changes:**
- Create initial team with 1 unit (Isaac/Adept)
- Equip Flint Djinn (Venus T1)
- Set team and roster appropriately

**Code Pattern:**
```typescript
import { UNIT_DEFINITIONS } from './data/definitions/units';
import { DJINN } from './data/definitions/djinn';
import { createUnit } from './core/models/Unit';
import { createTeam } from './core/models/Team';
import { collectDjinn } from './core/services/DjinnService';

// In App component, replace createTestBattle() initialization:
useEffect(() => {
  if (!team) {
    // Create Isaac (Adept) at level 1
    const isaac = createUnit(UNIT_DEFINITIONS['adept'], 1, 0);
    
    // Create initial team with just Isaac
    const initialTeam = createTeam({
      units: [isaac],
      djinnTrackers: {},
      collectedDjinn: [],
    });
    
    // Equip Flint Djinn (Venus T1)
    const flintResult = collectDjinn(initialTeam, 'flint');
    if (flintResult.ok) {
      const teamWithFlint = flintResult.value;
      
      // Set team and roster
      setTeam(teamWithFlint);
      setRoster([isaac]); // Roster starts with just Isaac
    } else {
      // Fallback if Djinn collection fails
      setTeam(initialTeam);
      setRoster([isaac]);
    }
  }
}, [team, setTeam, setRoster]);
```

---

### Step 6: Update VS1 Constants

**File:** `src/story/vs1Constants.ts` (MODIFY)

**Changes:**
- Update `VS1_ENCOUNTER_ID` to `'vs1-garet'`

**Code Pattern:**
```typescript
export const VS1_ENCOUNTER_ID = 'vs1-garet'; // Changed from 'vs1-bandits'
```

---

### Step 7: Update Dialogue (Optional)

**File:** `src/data/definitions/dialogues.ts` (MODIFY)

**Changes:**
- Update VS1 pre/post scenes to reference Garet instead of bandits
- Post-scene should mention recruiting Garet and getting Forge Djinn

---

## Testing Checklist

### Functional Tests
- [ ] VS1 encounter shows Garet as enemy
- [ ] Initial team has 1 unit (Isaac/Adept)
- [ ] Initial team has Flint Djinn equipped
- [ ] After VS1 victory, Garet is recruited to roster
- [ ] After VS1 victory, Forge Djinn is granted
- [ ] Roster contains both Isaac and Garet after battle
- [ ] Player can add Garet to active party from bench

### Visual Tests
- [ ] VS1 pre-scene dialogue mentions Garet
- [ ] VS1 post-scene dialogue mentions recruiting Garet
- [ ] Rewards screen shows "Recruited: Garet" message
- [ ] Rewards screen shows "Djinn Acquired: Forge" message

### Code Quality Tests
- [ ] TypeScript compiles without errors
- [ ] No linter errors
- [ ] Unit recruitment doesn't break if unit already in roster
- [ ] Djinn collection works correctly (already implemented)

---

## File Summary

**New Files:** None

**Modified Files (7):**
1. `src/data/definitions/enemies.ts` - Add Garet enemy
2. `src/data/definitions/encounters.ts` - Update VS1 encounter
3. `src/core/services/RewardsService.ts` - Add unit recruitment
4. `src/core/models/Rewards.ts` - Add `recruitedUnit` field
5. `src/ui/state/rewardsSlice.ts` - Handle recruitment
6. `src/App.tsx` - Update initial team setup
7. `src/story/vs1Constants.ts` - Update encounter ID

**Optional Files:**
8. `src/data/definitions/dialogues.ts` - Update VS1 dialogue

---

## Implementation Order

1. **Step 1** - Create Garet enemy definition
2. **Step 2** - Update VS1 encounter
3. **Step 6** - Update VS1 constants
4. **Step 3** - Implement unit recruitment in RewardsService
5. **Step 4** - Update RewardsSlice
6. **Step 5** - Update initial team setup
7. **Step 7** - Update dialogue (optional)

---

## Critical Notes

1. **Unit Recruitment:** Don't auto-add to active party - add to roster, let player choose
2. **Djinn Already Works:** Djinn reward system already implemented, just need to add `djinn: 'forge'` to encounter
3. **Initial Team:** Must start with 1 unit + Flint Djinn (not 4 units)
4. **Roster Sync:** Ensure roster is updated when Garet is recruited
5. **Backward Compatibility:** Old saves might have different team setup - handle gracefully

---

## Reference Files

- Unit definitions: `src/data/definitions/units.ts`
- Enemy definitions: `src/data/definitions/enemies.ts`
- Encounter definitions: `src/data/definitions/encounters.ts`
- Djinn definitions: `src/data/definitions/djinn.ts`
- RewardsService: `src/core/services/RewardsService.ts`
- TeamSlice: `src/ui/state/teamSlice.ts`
- VS1 Constants: `src/story/vs1Constants.ts`


