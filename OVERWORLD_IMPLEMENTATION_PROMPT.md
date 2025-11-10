# Overworld Implementation Prompt - Vale Chronicles V2

**Goal:** Build a Golden Sun-inspired overworld system for Vale Chronicles V2 that integrates with the existing battle system while following V2's clean architecture patterns.

---

## Current V2 State

### What Exists ✅
- **Battle System:** Complete (BattleView, BattleService, AI, turn-based combat)
- **Rewards Flow:** Working (post-battle XP, gold, equipment drops, level-ups)
- **Story System:** Chapter tracking, story progression
- **Save System:** Deterministic saves with migrations
- **Equipment System:** 58 items, 4-slot system (weapon/armor/helm/boots)
- **Technology Stack:** React + TypeScript + Zustand + Zod + framer-motion

### What's Missing ❌
- **No overworld rendering** (App.tsx just loops BattleView → RewardsScreen)
- **No overworld components** (no OverworldScreen, TileMap, Player, NPCs)
- **No overworld services** (no OverworldService, MovementSystem, NPCSystem)
- **No overworld state** (no overworldSlice in Zustand)
- **No overworld data** (empty `/src/data/definitions/overworld/` directory)
- **No map/NPC/encounter integration**

---

## Architecture Requirements (V2 Patterns)

### Directory Structure to Create
```
apps/vale-v2/
├── src/
│   ├── core/
│   │   ├── algorithms/
│   │   │   ├── movement.ts          # NEW: Movement logic (collision, 8-direction)
│   │   │   └── npcInteraction.ts    # NEW: Interaction zones, triggers
│   │   ├── services/
│   │   │   ├── OverworldService.ts  # NEW: Overworld orchestration
│   │   │   └── (existing services)
│   │   └── models/
│   │       ├── OverworldState.ts    # NEW: Overworld state model
│   │       └── NPC.ts               # NEW: NPC model
│   │
│   ├── ui/
│   │   ├── components/
│   │   │   ├── overworld/           # NEW: Overworld components
│   │   │   │   ├── OverworldScreen.tsx
│   │   │   │   ├── TileMap.tsx
│   │   │   │   ├── PlayerCharacter.tsx
│   │   │   │   ├── NPCCharacter.tsx
│   │   │   │   └── InteractionPrompt.tsx
│   │   │   └── (existing battle components)
│   │   └── state/
│   │       ├── overworldSlice.ts    # NEW: Overworld state management
│   │       └── (existing slices)
│   │
│   └── data/
│       ├── definitions/
│       │   └── overworld/           # NEW: Overworld data
│       │       ├── valeVillageMap.ts
│       │       ├── npcs.ts
│       │       └── encounters.ts (extend existing)
│       └── schemas/
│           ├── MapSchema.ts         # NEW: Zod schema for maps
│           └── NPCSchema.ts         # NEW: Zod schema for NPCs
```

### Key Architectural Rules
1. **No React in `core/`** - ESLint enforces this
2. **All logic in algorithms/services** - UI components are thin
3. **Immutable state** - Zustand slices use immutable updates
4. **Data-driven** - All maps, NPCs, encounters defined in data files
5. **Zod validation** - All data validates at startup (`pnpm validate:data`)
6. **Deterministic** - Use SeededRNG when needed

---

## Phase 1: MVP Overworld (Minimum Viable Product)

### Goal
Create a simple, functional overworld that connects to the existing battle system.

### Features
- ✅ Simple grid-based map (20x15 tiles, 32px per tile)
- ✅ Player character (single sprite, 8-direction movement)
- ✅ 3-5 static NPCs (sprites, interaction zones)
- ✅ 1 battle NPC (triggers encounter when interacted with)
- ✅ Battle transition (overworld → battle → rewards → overworld)
- ✅ Collision detection (walls, NPCs)
- ✅ Keyboard controls (WASD or arrow keys)

### Out of Scope for Phase 1
- ❌ Animated sprites (use static for now)
- ❌ Camera system (map fits on screen)
- ❌ Multiple maps/areas
- ❌ Dialogue system (simple placeholder text)
- ❌ Quest tracking
- ❌ Shops

---

## Component Specifications

### 1. OverworldScreen.tsx (Main Container)

**Purpose:** Top-level component that renders the overworld

**Responsibilities:**
- Render TileMap
- Render PlayerCharacter
- Render all NPCs
- Handle keyboard input
- Show InteractionPrompt when near NPC
- Trigger battle transitions

**State:** Uses `overworldSlice` from Zustand

**Example Structure:**
```tsx
export function OverworldScreen() {
  const { map, playerPosition, npcs } = useStore((s) => s.overworld);
  const { startBattle } = useStore((s) => s);

  useEffect(() => {
    // Keyboard listener for movement
  }, []);

  const handleInteraction = (npc: NPC) => {
    if (npc.type === 'battle') {
      // Trigger battle transition
      startBattle(npc.encounterId);
    } else {
      // Show dialogue (placeholder for Phase 1)
      alert(npc.dialogue);
    }
  };

  return (
    <div className="overworld-container">
      <TileMap map={map} />
      <PlayerCharacter position={playerPosition} />
      {npcs.map(npc => (
        <NPCCharacter key={npc.id} npc={npc} />
      ))}
      <InteractionPrompt />
    </div>
  );
}
```

### 2. TileMap.tsx (Grid Renderer)

**Purpose:** Render the tile-based map

**Approach:** CSS Grid or Canvas (CSS Grid simpler for MVP)

**Data Structure:**
```typescript
interface TileMap {
  width: number;      // 20 tiles
  height: number;     // 15 tiles
  tiles: Tile[][];    // 2D array of tiles
}

interface Tile {
  type: 'grass' | 'stone' | 'water' | 'wall';
  walkable: boolean;
  spriteX: number;    // For sprite sheet (Phase 2)
  spriteY: number;
}
```

**Rendering:**
- Use CSS Grid with `grid-template-columns: repeat(20, 32px)`
- Each tile is a `<div>` with background color (sprites in Phase 2)
- Grass = green, Stone = gray, Water = blue, Wall = brown

### 3. PlayerCharacter.tsx (Player Sprite)

**Purpose:** Render the player character

**Position:** Absolute positioning based on `playerPosition` from state

**Sprite:** Simple colored square for MVP (use Golden Sun sprites in Phase 2)

**Example:**
```tsx
export function PlayerCharacter({ position }: { position: { x: number; y: number } }) {
  return (
    <div
      className="player-character"
      style={{
        position: 'absolute',
        left: `${position.x * 32}px`,
        top: `${position.y * 32}px`,
        width: '32px',
        height: '32px',
        backgroundColor: '#4CAF50', // Green square
        border: '2px solid #2E7D32',
        zIndex: 10,
      }}
    />
  );
}
```

### 4. NPCCharacter.tsx (NPC Sprites)

**Purpose:** Render NPCs on the map

**Props:** NPC data (position, type, sprite)

**Interaction Zone:** Visual indicator (glow) when player is adjacent

**Example:**
```tsx
export function NPCCharacter({ npc }: { npc: NPC }) {
  const playerPosition = useStore((s) => s.overworld.playerPosition);
  const isNearby = isAdjacentTo(playerPosition, npc.position);

  return (
    <div
      className={`npc-character ${isNearby ? 'nearby' : ''}`}
      style={{
        position: 'absolute',
        left: `${npc.position.x * 32}px`,
        top: `${npc.position.y * 32}px`,
        width: '32px',
        height: '32px',
        backgroundColor: npc.type === 'battle' ? '#F44336' : '#2196F3', // Red for battle, blue for dialogue
        border: '2px solid #000',
        boxShadow: isNearby ? '0 0 10px yellow' : 'none', // Glow when nearby
        zIndex: 9,
      }}
    />
  );
}
```

### 5. InteractionPrompt.tsx (UI Overlay)

**Purpose:** Show "Press E to interact" when near NPC

**Visibility:** Only when player is adjacent to an NPC

**Example:**
```tsx
export function InteractionPrompt() {
  const nearbyNPC = useStore((s) => s.overworld.nearbyNPC);

  if (!nearbyNPC) return null;

  return (
    <div className="interaction-prompt">
      <p>Press <kbd>E</kbd> to interact with {nearbyNPC.name}</p>
    </div>
  );
}
```

---

## Core Logic Specifications

### 1. movement.ts (Algorithm)

**Purpose:** Pure functions for movement and collision

**Functions:**
```typescript
export function canMoveTo(
  position: { x: number; y: number },
  direction: Direction,
  map: TileMap,
  npcs: NPC[]
): boolean {
  const newPos = getNextPosition(position, direction);

  // Check bounds
  if (newPos.x < 0 || newPos.x >= map.width || newPos.y < 0 || newPos.y >= map.height) {
    return false;
  }

  // Check tile walkability
  const tile = map.tiles[newPos.y][newPos.x];
  if (!tile.walkable) {
    return false;
  }

  // Check NPC collision (can't walk through NPCs)
  const npcAtPosition = npcs.find(npc => npc.position.x === newPos.x && npc.position.y === newPos.y);
  if (npcAtPosition) {
    return false;
  }

  return true;
}

export function getNextPosition(
  position: { x: number; y: number },
  direction: Direction
): { x: number; y: number } {
  const { x, y } = position;
  switch (direction) {
    case 'up': return { x, y: y - 1 };
    case 'down': return { x, y: y + 1 };
    case 'left': return { x: x - 1, y };
    case 'right': return { x: x + 1, y };
    // ... handle 8 directions if desired
  }
}

type Direction = 'up' | 'down' | 'left' | 'right';
```

### 2. npcInteraction.ts (Algorithm)

**Purpose:** NPC interaction detection

**Functions:**
```typescript
export function getNearbyNPC(
  playerPosition: { x: number; y: number },
  npcs: NPC[]
): NPC | null {
  return npcs.find(npc =>
    isAdjacentTo(playerPosition, npc.position)
  ) || null;
}

export function isAdjacentTo(
  pos1: { x: number; y: number },
  pos2: { x: number; y: number }
): boolean {
  const dx = Math.abs(pos1.x - pos2.x);
  const dy = Math.abs(pos1.y - pos2.y);
  // Adjacent = within 1 tile (4-directional for simplicity)
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}
```

### 3. OverworldService.ts (Service)

**Purpose:** Orchestrate overworld logic

**Methods:**
```typescript
export class OverworldService {
  static movePlayer(
    state: OverworldState,
    direction: Direction
  ): OverworldState {
    const { playerPosition, map, npcs } = state;

    if (!canMoveTo(playerPosition, direction, map, npcs)) {
      return state; // No change if can't move
    }

    const newPosition = getNextPosition(playerPosition, direction);

    return {
      ...state,
      playerPosition: newPosition,
    };
  }

  static interactWithNPC(
    state: OverworldState,
    npcId: string
  ): { state: OverworldState; action: 'battle' | 'dialogue' | null } {
    const npc = state.npcs.find(n => n.id === npcId);
    if (!npc) return { state, action: null };

    if (npc.type === 'battle') {
      return { state, action: 'battle' };
    } else {
      return { state, action: 'dialogue' };
    }
  }
}
```

---

## State Management (Zustand Slice)

### overworldSlice.ts

```typescript
import { StateCreator } from 'zustand';
import type { TileMap, NPC, OverworldState } from '@/core/models/OverworldState';

export interface OverworldSlice {
  overworld: OverworldState;
  movePlayer: (direction: Direction) => void;
  interactWithNearbyNPC: () => void;
  initializeOverworld: (map: TileMap, npcs: NPC[]) => void;
}

export const createOverworldSlice: StateCreator<OverworldSlice> = (set, get) => ({
  overworld: {
    map: VALE_VILLAGE_MAP, // Default map
    playerPosition: { x: 10, y: 7 }, // Center of map
    npcs: VALE_VILLAGE_NPCS,
  },

  movePlayer: (direction) => {
    const { overworld } = get();
    const newState = OverworldService.movePlayer(overworld, direction);
    set({ overworld: newState });
  },

  interactWithNearbyNPC: () => {
    const { overworld, setBattle } = get();
    const nearbyNPC = getNearbyNPC(overworld.playerPosition, overworld.npcs);

    if (!nearbyNPC) return;

    if (nearbyNPC.type === 'battle') {
      // Trigger battle transition
      const encounter = ENCOUNTERS[nearbyNPC.encounterId];
      // Initialize battle with encounter data
      setBattle(/* ... */);
    } else {
      // Show dialogue (placeholder)
      alert(nearbyNPC.dialogue);
    }
  },

  initializeOverworld: (map, npcs) => {
    set({
      overworld: {
        map,
        playerPosition: map.spawnPoint || { x: 10, y: 7 },
        npcs,
      },
    });
  },
});
```

---

## Data Structures & Schemas

### 1. MapSchema.ts (Zod Validation)

```typescript
import { z } from 'zod';

export const TileSchema = z.object({
  type: z.enum(['grass', 'stone', 'water', 'wall']),
  walkable: z.boolean(),
  spriteX: z.number().optional(),
  spriteY: z.number().optional(),
});

export const TileMapSchema = z.object({
  id: z.string(),
  name: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  tiles: z.array(z.array(TileSchema)),
  spawnPoint: z.object({ x: z.number(), y: z.number() }).optional(),
});

export type TileMap = z.infer<typeof TileMapSchema>;
export type Tile = z.infer<typeof TileSchema>;
```

### 2. NPCSchema.ts (Zod Validation)

```typescript
import { z } from 'zod';

export const NPCSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['dialogue', 'battle', 'shop']),
  position: z.object({ x: z.number(), y: z.number() }),

  // For battle NPCs
  encounterId: z.string().optional(),

  // For dialogue NPCs
  dialogue: z.string().optional(),

  // Sprite info (Phase 2)
  spriteId: z.string().optional(),
});

export type NPC = z.infer<typeof NPCSchema>;
```

### 3. valeVillageMap.ts (Sample Data)

```typescript
import type { TileMap } from '../schemas/MapSchema';

export const VALE_VILLAGE_MAP: TileMap = {
  id: 'vale_village',
  name: 'Vale Village',
  width: 20,
  height: 15,
  spawnPoint: { x: 10, y: 7 },
  tiles: [
    // Row 0 (top edge - all walls)
    [
      { type: 'wall', walkable: false },
      { type: 'wall', walkable: false },
      // ... repeat 18 more times
    ],
    // Row 1
    [
      { type: 'wall', walkable: false },
      { type: 'grass', walkable: true },
      { type: 'grass', walkable: true },
      // ... fill out rest of row
    ],
    // ... repeat for 13 more rows
    // Row 14 (bottom edge - all walls)
    [
      { type: 'wall', walkable: false },
      { type: 'wall', walkable: false },
      // ... repeat 18 more times
    ],
  ],
};
```

### 4. npcs.ts (Sample Data)

```typescript
import type { NPC } from '../schemas/NPCSchema';

export const VALE_VILLAGE_NPCS: NPC[] = [
  // Battle NPC
  {
    id: 'guard_battle',
    name: 'Village Guard',
    type: 'battle',
    position: { x: 10, y: 5 },
    encounterId: 'c1_normal_1', // Links to ENCOUNTERS
  },

  // Dialogue NPCs
  {
    id: 'elder',
    name: 'Village Elder',
    type: 'dialogue',
    position: { x: 8, y: 7 },
    dialogue: 'Welcome to Vale Village! The guards have been reporting trouble near the forest...',
  },

  {
    id: 'merchant',
    name: 'Merchant',
    type: 'dialogue',
    position: { x: 12, y: 9 },
    dialogue: 'I sell wares, but my shop system isn\'t built yet!',
  },

  // Add 2-3 more dialogue NPCs
];
```

---

## Integration with Existing Battle System

### App.tsx Modification

**Current Flow:**
```
BattleView → RewardsScreen → (loops back to BattleView)
```

**New Flow:**
```
OverworldScreen → Battle Trigger → BattleView → RewardsScreen → OverworldScreen
```

**Implementation:**
```tsx
function App() {
  const currentScreen = useStore((s) => s.currentScreen);
  const battle = useStore((s) => s.battle);
  const showRewards = useStore((s) => s.showRewards);

  // Screen routing
  if (showRewards) {
    return <RewardsScreen onContinue={() => setScreen('overworld')} />;
  }

  if (battle) {
    return <BattleView />;
  }

  return <OverworldScreen />;
}
```

### Battle Transition Logic

**In overworldSlice.ts:**
```typescript
interactWithNearbyNPC: () => {
  const { overworld, setBattle } = get();
  const nearbyNPC = getNearbyNPC(overworld.playerPosition, overworld.npcs);

  if (nearbyNPC?.type === 'battle') {
    const encounter = ENCOUNTERS[nearbyNPC.encounterId];

    // Create battle from encounter
    const battleState = BattleService.createBattleFromEncounter(
      encounter,
      get().team, // Player team from teamSlice
      get().rngSeed
    );

    setBattle(battleState, newSeed);
  }
}
```

### Post-Battle Return

**After battle ends and rewards are claimed:**
```typescript
// In RewardsScreen
const handleContinue = () => {
  claimRewards(); // Add gold, equipment to inventory
  setCurrentScreen('overworld'); // Return to overworld
  // Player position is preserved in overworldSlice
};
```

---

## Testing Strategy

### Context-Aware Tests (Following V2 Pattern)

**Test movement and collision:**
```typescript
describe('OVERWORLD: Player Movement', () => {
  test('Player can move on grass tiles', () => {
    const state = createOverworldState();
    const newState = OverworldService.movePlayer(state, 'right');

    expect(newState.playerPosition.x).toBe(state.playerPosition.x + 1);
  });

  test('Player cannot move through walls', () => {
    const state = createOverworldState();
    // Position player next to wall
    state.playerPosition = { x: 0, y: 5 };

    const newState = OverworldService.movePlayer(state, 'left');

    expect(newState.playerPosition).toEqual(state.playerPosition); // Didn't move
  });

  test('Player cannot move through NPCs', () => {
    const state = createOverworldState();
    const npcPosition = { x: 11, y: 7 };
    state.npcs = [{ id: 'test', position: npcPosition, /* ... */ }];
    state.playerPosition = { x: 10, y: 7 };

    const newState = OverworldService.movePlayer(state, 'right');

    expect(newState.playerPosition.x).toBe(10); // Blocked by NPC
  });
});
```

**Test NPC interactions:**
```typescript
describe('OVERWORLD: NPC Interactions', () => {
  test('Player can interact with adjacent NPC', () => {
    const player = { x: 10, y: 7 };
    const npcs: NPC[] = [
      { id: 'guard', position: { x: 10, y: 6 }, type: 'battle', /* ... */ }
    ];

    const nearbyNPC = getNearbyNPC(player, npcs);

    expect(nearbyNPC).toBeDefined();
    expect(nearbyNPC?.id).toBe('guard');
  });

  test('Player cannot interact with distant NPC', () => {
    const player = { x: 10, y: 7 };
    const npcs: NPC[] = [
      { id: 'guard', position: { x: 15, y: 10 }, type: 'battle', /* ... */ }
    ];

    const nearbyNPC = getNearbyNPC(player, npcs);

    expect(nearbyNPC).toBeNull();
  });
});
```

**Test battle transition:**
```typescript
describe('OVERWORLD → BATTLE Integration', () => {
  test('Interacting with battle NPC starts correct encounter', () => {
    // Setup overworld with battle NPC
    const state = createOverworldState();
    state.npcs = [
      { id: 'guard', type: 'battle', encounterId: 'c1_normal_1', position: { x: 10, y: 6 } }
    ];
    state.playerPosition = { x: 10, y: 7 };

    // Interact with NPC
    const result = OverworldService.interactWithNPC(state, 'guard');

    expect(result.action).toBe('battle');
    // Verify battle gets created with correct encounter
  });
});
```

---

## Phase 2 & 3 Roadmap

### Phase 2: Enhanced Overworld
- **Animated sprites** (Golden Sun character sprites from migrated assets)
- **Camera system** (follow player, larger maps)
- **Multiple maps** (Vale Village, Forest, Cave)
- **Map transitions** (doors, exits to other areas)
- **Dialogue system** (proper UI, not alert boxes)
- **Shop system** (buy/sell equipment)

### Phase 3: Advanced Features
- **Quest tracking** (active quests in UI)
- **NPC schedules** (NPCs move at certain times)
- **Treasure chests** (find equipment in overworld)
- **Save points** (save anywhere or at specific locations)
- **Minimap** (corner of screen showing player position)

---

## Implementation Checklist

### Core Systems
- [ ] Create `core/algorithms/movement.ts`
- [ ] Create `core/algorithms/npcInteraction.ts`
- [ ] Create `core/services/OverworldService.ts`
- [ ] Create `core/models/OverworldState.ts`
- [ ] Create `core/models/NPC.ts`

### Data & Schemas
- [ ] Create `data/schemas/MapSchema.ts`
- [ ] Create `data/schemas/NPCSchema.ts`
- [ ] Create `data/definitions/overworld/valeVillageMap.ts`
- [ ] Create `data/definitions/overworld/npcs.ts`
- [ ] Add map/NPC validation to `validateAll.ts`

### UI Components
- [ ] Create `ui/components/overworld/OverworldScreen.tsx`
- [ ] Create `ui/components/overworld/TileMap.tsx`
- [ ] Create `ui/components/overworld/PlayerCharacter.tsx`
- [ ] Create `ui/components/overworld/NPCCharacter.tsx`
- [ ] Create `ui/components/overworld/InteractionPrompt.tsx`

### State Management
- [ ] Create `ui/state/overworldSlice.ts`
- [ ] Integrate overworldSlice into `store.ts`
- [ ] Add `currentScreen` state for routing

### Integration
- [ ] Modify `App.tsx` for screen routing
- [ ] Connect overworld → battle transitions
- [ ] Connect rewards → overworld return flow
- [ ] Test full loop: Overworld → Battle → Rewards → Overworld

### Testing
- [ ] Write movement tests
- [ ] Write collision tests
- [ ] Write NPC interaction tests
- [ ] Write battle transition tests
- [ ] Run `pnpm test` and verify all pass

### Validation
- [ ] Run `pnpm validate:data` (map & NPC schemas)
- [ ] Run `pnpm typecheck`
- [ ] Run `pnpm lint`
- [ ] Run `pnpm build`

---

## Success Criteria

**MVP is complete when:**
1. ✅ Player can move around a 20x15 tile map using keyboard
2. ✅ Player collides with walls and NPCs (can't walk through)
3. ✅ Player can interact with NPCs (press E when adjacent)
4. ✅ Interacting with battle NPC triggers battle transition
5. ✅ Battle completes, shows rewards, returns to overworld
6. ✅ Player position is preserved after returning from battle
7. ✅ All tests pass
8. ✅ All data validates (map, NPCs)
9. ✅ No TypeScript errors
10. ✅ Build succeeds

---

## Reference Materials

- **CAMERA_SYSTEM.md** - Camera patterns from legacy (in `docs/legacy/`)
- **CLAUDE.md** - V2 architecture guidelines
- **MIGRATION_COMPLETE.md** - Current V2 state
- **Existing battle flow** - Study `BattleView.tsx` and `battleSlice.ts` for patterns

---

## Notes

- **Keep it simple for MVP** - Use colored squares for sprites, basic CSS for rendering
- **Follow V2 patterns** - No React in core, Zustand for state, Zod for validation
- **Test as you go** - Write tests alongside features
- **Commit frequently** - Small, focused commits with clear messages
- **Don't over-engineer** - Camera, animations, dialogue can wait for Phase 2

---

**Good luck! You've got a solid battle system - now give it a world to explore!** 🗺️
