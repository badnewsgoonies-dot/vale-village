# 🏘️ OVERWORLD ENHANCEMENT - TECHNICAL SPECIFICATION
**Vale Village Professional Upgrade Using 25 Sprite Sheets**

**Date:** November 6, 2025
**Status:** 🟡 Planning Phase
**Role:** Graphics Integration (Role 5) + Architect Guidance
**Alignment:** Vale Chronicles Architecture + Story Theme + Coding Standards

---

## 📋 PREREQUISITES REVIEW

### ✅ **Architecture Alignment**
- **Project:** Vale Chronicles
- **Vision:** Golden Sun-inspired RPG with authentic GBA aesthetic
- **Setting:** Vale Village (peaceful mountain settlement)
- **Overworld System:** From `MetaPrompt/golden-sun` (NPC, movement, dialogue, shop)
- **Battle System:** From `NextEraGame` (tactical turn-based)
- **Sprites:** 2,553 authentic Golden Sun GIFs organized in 25 sprite sheets

### ✅ **Story Theme Alignment**
**From STORY_STRUCTURE.md:**
- **Location:** Vale Village at base of Mt. Aleph
- **Protection:** Sol Sanctum's ancient seal
- **Tone:** Peaceful place with hope, moments of darkness
- **NPCs:** 50 characters (10 battle NPCs, 40 dialogue/shop)
- **Buildings:** Inn, Shop (WepArm), Houses, Sanctum, Training areas

**Key Story Locations to Implement:**
1. Sol Sanctum entrance (north gate)
2. Vale buildings (Isaac's House, Jenna's House, Garet's House, Kraden's House)
3. Healing House (where Mia is)
4. Training Grounds (starter unit recruitment)
5. Village plaza (Elder, Dora)
6. Psynergy Stone (training/healing)
7. Bridge over stream
8. Bilibin Forest path (south)

### ✅ **Coding Standards Alignment**
- **TypeScript:** Strict type safety (0 errors policy)
- **React 18+:** Functional components with hooks
- **Component-Based:** Reusable, testable modules
- **CSS-in-JS:** Styled-components or CSS modules
- **Sprite Registry:** Centralized sprite management
- **Performance:** GPU-accelerated transforms, culling
- **Testing:** Context-aware integration tests (not trivial unit tests)

### ✅ **Role Boundaries**
**This is Role 5: Graphics Integration**
- ✅ Convert mockups to React components
- ✅ Integrate sprites from library
- ✅ Add animations and visual polish
- ✅ Create layering and depth
- ❌ DO NOT change game logic/systems
- ❌ DO NOT modify battle mechanics
- ❌ DO NOT alter save system

---

## 🎯 PROJECT GOALS

### **Primary Goal**
Transform Vale Village from basic prototype to professional Golden Sun-quality overworld using available sprite library.

### **Success Criteria**
1. **Visual Authenticity:** Matches Golden Sun GBA aesthetic
2. **Story Coherence:** Buildings/NPCs align with narrative
3. **Performance:** Smooth 60fps on modern browsers
4. **Code Quality:** TypeScript 0 errors, proper types
5. **Integration:** Works with existing systems (NPC, movement, dialogue)
6. **Testing:** All integration tests pass

---

## 📐 TECHNICAL ARCHITECTURE

### **Current Overworld System**
**File:** `src/components/overworld/OverworldScreen.tsx` (455 lines)

**Current Features:**
- ✅ Tile-based grid (20×15, 32px tiles)
- ✅ 8-directional movement (WASD + arrows)
- ✅ Running (Shift key)
- ✅ NPC entities (4 currently: elder, dora, 2 villagers)
- ✅ Collision detection
- ✅ Camera follow (centered on player)
- ✅ Y-sorting for depth
- ✅ Dialogue system
- ✅ Battle triggers

**Current Limitations:**
- ❌ Flat gradient background (no real terrain)
- ❌ Only 4 NPCs (need 50)
- ❌ No buildings (17 Vale buildings available)
- ❌ No vegetation (47 plant sprites available)
- ❌ No props/decorations
- ❌ No multi-zone system
- ❌ No building interiors

---

## 🏗️ ENHANCEMENT SYSTEMS

### **System 1: Tile-Based Terrain Engine**

**Purpose:** Replace gradient with authentic terrain tiles

**Components:**
```typescript
// New file: src/components/overworld/TerrainTile.tsx
interface TerrainTileProps {
  type: TerrainType;
  x: number;
  y: number;
  variant?: number; // For tile variety
}

enum TerrainType {
  GRASS_LIGHT = 'grass-light',
  GRASS_DARK = 'grass-dark',
  DIRT_PATH = 'dirt-path',
  STONE_PATH = 'stone-path',
  WATER = 'water',
  SAND = 'sand',
  CLIFF = 'cliff',
  BRIDGE = 'bridge',
  INDOOR_WOOD = 'indoor-wood',
  INDOOR_STONE = 'indoor-stone'
}
```

**Data Structure:**
```typescript
// New file: src/data/maps/valeVillage.ts
export const VALE_VILLAGE_MAP: TileMap = {
  width: 30,  // Expanded from 20
  height: 25, // Expanded from 15
  layers: {
    ground: TerrainType[][], // Base terrain (grass, dirt, water)
    path: TerrainType[][],   // Paths and roads
    detail: string[][],      // Grass tufts, flowers, etc.
  },
  collisionMap: boolean[][], // Walkable tiles
};
```

**Implementation:**
```typescript
// Modified: OverworldScreen.tsx
const renderTerrain = () => {
  return VALE_VILLAGE_MAP.layers.ground.map((row, y) =>
    row.map((tileType, x) => (
      <TerrainTile
        key={`${x}-${y}`}
        type={tileType}
        x={x}
        y={y}
      />
    ))
  );
};
```

**Sprite Usage:**
- **Outdoor Terrain:** 144 sprites from `sprite-sheets/12-terrain-outdoor.png`
- **Indoor Terrain:** 241 sprites from `sprite-sheets/13-terrain-indoor.png`

**Testing:**
```typescript
describe('Terrain System', () => {
  test('INTEGRATION: Player walks on grass, stone, bridge - all work', () => {
    const terrain = loadValeVillage();
    expect(terrain.canWalk(5, 5, 'grass')).toBe(true);
    expect(terrain.canWalk(10, 10, 'water')).toBe(false);
    expect(terrain.canWalk(12, 8, 'bridge')).toBe(true);
  });
});
```

---

### **System 2: Building Placement System**

**Purpose:** Add 17 Vale buildings from story locations

**Component:**
```typescript
// New file: src/components/overworld/Building.tsx
interface BuildingProps {
  id: string;
  type: BuildingType;
  x: number;
  y: number;
  width: number;  // in tiles
  height: number; // in tiles
  entrance?: { x: number; y: number }; // Entry point
  interior?: InteriorMap; // For building entry
}

enum BuildingType {
  ISAACS_HOUSE = 'isaacs-house',
  JENNAS_HOUSE = 'jennas-house',
  GARETS_HOUSE = 'garets-house',
  KRADENS_HOUSE = 'kradens-house',
  INN = 'inn',
  SHOP = 'weparm-shop',
  SANCTUM = 'sanctum',
  BRIDGE = 'bridge',
  PSYNERGY_STONE = 'psynergy-stone',
  GENERIC_BUILDING = 'building',
}
```

**Vale Building Layout:**
```typescript
// src/data/maps/valeBuildings.ts
export const VALE_BUILDINGS: Building[] = [
  {
    id: 'isaacs-house',
    type: BuildingType.ISAACS_HOUSE,
    sprite: '/sprites/scenery/buildings/Vale/Vale_Isaacs_House.gif',
    x: 12,
    y: 10,
    width: 2,
    height: 2,
    entrance: { x: 12, y: 12 },
    blocking: true,
    interior: ISAACS_HOUSE_INTERIOR,
  },
  {
    id: 'vale-sanctum',
    type: BuildingType.SANCTUM,
    sprite: '/sprites/scenery/buildings/Vale/Vale_Sanctum.gif',
    x: 14,
    y: 3,
    width: 3,
    height: 4,
    entrance: { x: 15, y: 7 },
    blocking: true,
  },
  {
    id: 'weparm-shop',
    type: BuildingType.SHOP,
    sprite: '/sprites/scenery/buildings/Vale/Vale_WepArm_Shop.gif',
    x: 8,
    y: 10,
    width: 2,
    height: 2,
    entrance: { x: 8, y: 12 },
    onEnter: () => openShop('weparm'),
  },
  // ... 14 more buildings
];
```

**Sprite Usage:**
- **Buildings:** 130 sprites from `sprite-sheets/09-buildings-all.png`
- **Vale Specific:** 17 sprites in `complete/scenery/buildings/Vale/`

**Story Alignment:**
- ✅ Isaac's House (player home base)
- ✅ Sanctum (Sol Sanctum entrance - north)
- ✅ Shop (weapon/armor purchases)
- ✅ Inn (healing/rest)
- ✅ Jenna's House, Garet's House, Kraden's House (NPC homes)
- ✅ Psynergy Stone (training area)

---

### **System 3: Layered Rendering Engine**

**Purpose:** Proper depth, occlusion, and visual hierarchy

**Layer System:**
```typescript
enum RenderLayer {
  GROUND_BASE = 0,      // Terrain tiles
  GROUND_DETAIL = 1,    // Grass tufts, flowers
  SHADOWS = 2,          // Building/tree shadows
  OBJECTS_BACK = 3,     // Building rear walls
  ENTITIES = 4,         // NPCs, player (Y-sorted)
  OBJECTS_FRONT = 5,    // Building front walls, roofs
  EFFECTS = 6,          // Psynergy effects, sparkles
  UI = 7                // Dialogue, menus
}
```

**Implementation:**
```typescript
// Modified: OverworldScreen.tsx
const renderScene = () => {
  return (
    <>
      <Layer zIndex={RenderLayer.GROUND_BASE}>
        {renderTerrain()}
      </Layer>
      <Layer zIndex={RenderLayer.GROUND_DETAIL}>
        {renderGrassDetails()}
      </Layer>
      <Layer zIndex={RenderLayer.SHADOWS}>
        {renderShadows()}
      </Layer>
      <Layer zIndex={RenderLayer.OBJECTS_BACK}>
        {renderBuildingsBack()}
      </Layer>
      <Layer zIndex={RenderLayer.ENTITIES}>
        {renderEntities()} {/* Y-sorted */}
      </Layer>
      <Layer zIndex={RenderLayer.OBJECTS_FRONT}>
        {renderBuildingsFront()}
      </Layer>
      <Layer zIndex={RenderLayer.EFFECTS}>
        {renderEffects()}
      </Layer>
      <Layer zIndex={RenderLayer.UI}>
        {renderUI()}
      </Layer>
    </>
  );
};
```

**Shadow System:**
```typescript
// New: src/components/overworld/Shadow.tsx
interface ShadowProps {
  parentX: number;
  parentY: number;
  parentWidth: number;
  parentHeight: number;
  direction: 'NE' | 'SE'; // Sun angle
  opacity: number;
}

// Renders darker terrain tiles under objects
```

---

### **System 4: Vegetation & Environment**

**Purpose:** Add natural borders, decoration, atmosphere

**Component:**
```typescript
// New: src/components/overworld/Vegetation.tsx
interface VegetationProps {
  type: VegetationType;
  x: number;
  y: number;
  blocking?: boolean;
  animated?: boolean;
}

enum VegetationType {
  TREE_1 = 'tree1',
  TREE_2 = 'tree2',
  BUSH = 'bush',
  FLOWER = 'flower',
  PALM = 'palm',
  SHRUB = 'shrub',
  // ... 47 total types
}
```

**Vale Village Vegetation Plan:**
```
[Forest Border - North]
🌳🌳🌳[Sanctum]🌳🌳🌳
🌳🌳    🛤️🛤️    🌳🌳

[Town Center - Paths lined with bushes]
🏠🌿🛤️🌿🏠🌿🛤️🌿🏠
  🌿🛤️🌿  [Plaza]  🌿🛤️🌿

[Stream with vegetation]
🌳💧💧[Bridge]💧💧🌳
🌴💧💧💧💧💧💧🌴

[Forest Path - South]
🌿🌳🌳🛤️🌳🌳🌿
  🌳🌳🛤️🌳🌳
```

**Sprite Usage:**
- **Plants/Trees:** 47 sprites from `sprite-sheets/10-plants-trees.png`
- **Vale specific:** Trees for forest border, bushes for paths, flowers for gardens

---

### **System 5: Props & Decorations**

**Purpose:** Add statues, gates, pillars, environmental detail

**Component:**
```typescript
// New: src/components/overworld/Prop.tsx
interface PropProps {
  type: PropType;
  x: number;
  y: number;
  blocking?: boolean;
  interactive?: boolean;
  onInteract?: () => void;
}

enum PropType {
  // From statues sprite sheet
  STATUE_GUARDIAN = 'statue-guardian',
  STATUE_ELEMENTAL = 'statue-elemental',

  // From outdoor props
  VALE_GATE = 'vale-gate',
  WATCH_TOWER = 'watch-tower',
  STONE_PILLAR = 'stone-pillar',
  HAYSTACK = 'haystack',
  TROUGH = 'trough',

  // Functional
  PSYNERGY_STONE = 'psynergy-stone', // Healing station
  CHEST = 'chest', // Treasure
}
```

**Story-Aligned Placements:**
```typescript
export const VALE_PROPS: Prop[] = [
  {
    type: PropType.VALE_GATE,
    x: 15,
    y: 2,
    blocking: false, // Can walk through
    description: 'Northern Gate - Path to Mt. Aleph',
  },
  {
    type: PropType.PSYNERGY_STONE,
    x: 10,
    y: 15,
    blocking: false,
    interactive: true,
    onInteract: () => healParty(),
    effect: 'sparkle', // Ambient animation
  },
  {
    type: PropType.STATUE_GUARDIAN,
    x: 14,
    y: 4,
    blocking: true,
    description: 'Guardian Statue protects the Sanctum',
  },
  // ... 20+ more props
];
```

**Sprite Usage:**
- **Statues:** 27 sprites from `sprite-sheets/11-statues.png`
- **Outdoor Props:** From `sprite-sheets/12-terrain-outdoor.png`

---

### **System 6: Environmental Effects**

**Purpose:** Add life and atmosphere (psynergy sparkles, wind, water effects)

**Component:**
```typescript
// New: src/components/overworld/EnvironmentalEffect.tsx
interface EffectProps {
  type: EffectType;
  x: number;
  y: number;
  loop?: boolean;
}

enum EffectType {
  SPARKLE = 'sparkle',              // Psynergy Stone
  PSYNERGY_RING = 'psynergy-ring',  // Magic circles
  DOUSE_CLOUD = 'douse-cloud',      // Mist over water
  WHIRLWIND_BUSH = 'whirlwind-bush',// Wind effects
  BLAZE_TORCH = 'blaze-torch',      // Lit torches
}
```

**Implementation:**
```typescript
// Ambient effects that loop
const VALE_EFFECTS: EnvironmentalEffect[] = [
  {
    type: EffectType.SPARKLE,
    x: 10,
    y: 15,
    loop: true,
    frames: 8,
    fps: 12,
  },
  {
    type: EffectType.DOUSE_CLOUD,
    x: 12,
    y: 20,
    loop: true,
    opacity: 0.6,
  },
];
```

**Sprite Usage:**
- **Psynergy Effects:** 49 sprites from `sprite-sheets/05-overworld-psynergy.png`

---

### **System 7: NPC Expansion**

**Purpose:** Expand from 4 NPCs to 50 NPCs as per story

**Data Structure:**
```typescript
// Modified: src/data/npcs/valeNPCs.ts
export const VALE_NPCS: NPC[] = [
  // Major NPCs (from story)
  {
    id: 'elder',
    name: 'Elder',
    sprite: '/sprites/overworld/majornpcs/Elder.gif',
    x: 14,
    y: 8,
    dialogue: getNPCDialogue('elder'), // From NPC_DIALOGUES.md
    type: 'major',
  },
  {
    id: 'dora',
    name: 'Dora',
    sprite: '/sprites/overworld/majornpcs/Dora.gif',
    x: 8,
    y: 11,
    dialogue: getNPCDialogue('dora'),
    type: 'shop',
    onInteract: () => openShop('potion'),
  },

  // Battle NPCs (10 total - recruitable units)
  {
    id: 'garet-trainer',
    name: 'Garet',
    sprite: '/sprites/overworld/protagonists/Garet_Walk.gif',
    x: 10,
    y: 16,
    type: 'battle',
    battleTeam: ['garet'],
    onDefeat: () => recruitUnit('garet'),
    dialogue: 'Want to test your strength? Let's spar!',
  },

  // Minor NPCs (40 total - dialogue/atmosphere)
  {
    id: 'villager-1',
    name: 'Villager',
    sprite: '/sprites/overworld/minornpcs/Villager-1.gif',
    x: 6,
    y: 9,
    dialogue: 'Strange tremors have been felt near Sol Sanctum...',
    type: 'minor',
  },
  // ... 47 more NPCs
];
```

**Story Alignment:**
- ✅ 10 Battle NPCs (recruitable units from RECRUITABLE_UNITS.md)
- ✅ 40 Dialogue NPCs (atmosphere, lore, hints)
- ✅ Named characters (Elder, Dora, Isaac's family, etc.)
- ✅ Proper placement per story beats

---

### **System 8: Multi-Zone System**

**Purpose:** Expand beyond single screen

**Zones:**
```typescript
enum GameZone {
  VALE_CENTER = 'vale-center',           // Current screen
  VALE_NORTH = 'vale-north',             // Sol Sanctum entrance
  VALE_SOUTH = 'vale-south',             // Bilibin Forest path
  VALE_EAST = 'vale-east',               // River/harbor
  VALE_WEST = 'vale-west',               // Training grounds
  SANCTUM_ENTRANCE = 'sanctum-entrance', // Dungeon entry
}
```

**Transition System:**
```typescript
// New: src/systems/zoneTransitionSystem.ts
export function checkZoneTransition(
  playerX: number,
  playerY: number,
  currentZone: GameZone
): ZoneTransition | null {
  // Check if player is at edge
  if (playerY === 0 && currentZone === GameZone.VALE_CENTER) {
    return {
      newZone: GameZone.VALE_NORTH,
      spawnX: playerX,
      spawnY: 24, // Bottom of new zone
      transition: 'slide-up',
    };
  }
  // ... other edges
}
```

**Implementation Priority:** Phase 3/4 (after base enhancements)

---

## 🎨 VISUAL POLISH SPECIFICATIONS

### **Authentic GBA Aesthetics**

**Sprite Rendering:**
```css
.sprite {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  width: 32px;
  height: 32px;
}
```

**Color Palette (Golden Sun Authentic):**
```css
:root {
  --grass-light: #6db054;
  --grass-dark: #5a9e3d;
  --dirt: #8b7355;
  --stone: #a0a0a0;
  --water: #5090d8;
  --shadow: rgba(0, 0, 0, 0.3);
}
```

**Animation Timing:**
```css
/* Sprite animations - GBA frame rate */
.sprite-animated {
  animation: sprite-walk 0.6s steps(4) infinite;
}

/* Ambient effects - slower */
.effect-sparkle {
  animation: sparkle 2s ease-in-out infinite;
}
```

### **Depth & Shadows**

**Shadow Rendering:**
```typescript
// Darker terrain tiles under objects
const renderShadow = (building: Building) => {
  const shadowTiles = calculateShadowTiles(building, sunAngle);
  return shadowTiles.map(({x, y}) => (
    <div
      key={`shadow-${x}-${y}`}
      className="shadow-overlay"
      style={{
        left: x * TILE_SIZE,
        top: y * TILE_SIZE,
        opacity: 0.3,
      }}
    />
  ));
};
```

**Parallax Background:**
```typescript
// Distant mountains with parallax
<div className="parallax-background"
  style={{
    transform: `translate(${cameraX * 0.3}px, ${cameraY * 0.3}px)`,
  }}
>
  <img src="/sprites/backgrounds/gs1/Vale.gif" />
</div>
```

---

## 📊 IMPLEMENTATION PHASES

### **Phase 1: Foundation (Week 1)**
**Goal:** Core systems, no visual fluff

**Tasks:**
1. ✅ Create TerrainTile component
2. ✅ Design VALE_VILLAGE_MAP (30×25 grid)
3. ✅ Implement tile rendering engine
4. ✅ Update collision detection for terrain
5. ✅ Test player movement on varied terrain
6. ✅ Add 5 terrain types (grass, dirt, stone, water, bridge)

**Deliverable:** Player walks on real terrain tiles (not gradient)

**Testing:**
```typescript
test('INTEGRATION: Player walks on all terrain types', () => {
  const scene = loadValeVillagePhase1();
  expect(scene.terrain[10][10]).toBe(TerrainType.GRASS_LIGHT);
  expect(canWalkOn(TerrainType.WATER)).toBe(false);
  expect(canWalkOn(TerrainType.BRIDGE)).toBe(true);
});
```

---

### **Phase 2: Buildings & Layout (Week 1-2)**
**Goal:** Add Vale buildings per story

**Tasks:**
1. ✅ Create Building component
2. ✅ Define VALE_BUILDINGS array (17 buildings)
3. ✅ Implement building collision
4. ✅ Add building entrance detection
5. ✅ Place buildings per story locations
6. ✅ Test story coherence (Isaac's House at correct position, etc.)

**Story Validation:**
- ✅ Sanctum in north (near Mt. Aleph)
- ✅ Isaac's House in center
- ✅ Shop accessible
- ✅ Inn near plaza
- ✅ Psynergy Stone at training area

**Testing:**
```typescript
test('STORY: Vale buildings match story locations', () => {
  const buildings = VALE_BUILDINGS;

  // Isaac's House is central
  const isaacs = buildings.find(b => b.id === 'isaacs-house');
  expect(isaacs.x).toBeGreaterThan(10);
  expect(isaacs.y).toBeGreaterThan(8);

  // Sanctum is north
  const sanctum = buildings.find(b => b.id === 'vale-sanctum');
  expect(sanctum.y).toBeLessThan(8);

  // Shop is accessible
  const shop = buildings.find(b => b.id === 'weparm-shop');
  expect(shop.entrance).toBeDefined();
});
```

---

### **Phase 3: Vegetation & Props (Week 2)**
**Goal:** Add environmental detail

**Tasks:**
1. ✅ Create Vegetation component
2. ✅ Create Prop component
3. ✅ Place trees around forest border
4. ✅ Add bushes along paths
5. ✅ Place statues near Sanctum
6. ✅ Add functional props (Psynergy Stone, chests)
7. ✅ Test interactions (healing at Psynergy Stone)

**Deliverable:** Vale looks alive with vegetation and detail

**Testing:**
```typescript
test('FUNCTIONAL: Psynergy Stone heals party', () => {
  const party = createParty([createUnit('Isaac', 5)]);
  party[0].currentHp = 10; // Damaged

  const stone = findProp(PropType.PSYNERGY_STONE);
  stone.onInteract();

  expect(party[0].currentHp).toBe(party[0].stats.hp); // Full HP
});
```

---

### **Phase 4: Layering & Depth (Week 2-3)**
**Goal:** Proper visual hierarchy

**Tasks:**
1. ✅ Implement RenderLayer system
2. ✅ Add shadow rendering
3. ✅ Split buildings into back/front layers
4. ✅ Implement Y-sorting for entities
5. ✅ Test occlusion (player walks behind buildings)
6. ✅ Add parallax background

**Deliverable:** Professional depth and occlusion

**Testing:**
```typescript
test('VISUAL: Player occludes behind building fronts', () => {
  const player = { x: 12, y: 10, layer: RenderLayer.ENTITIES };
  const buildingFront = { x: 12, y: 10, layer: RenderLayer.OBJECTS_FRONT };

  const zIndex = calculateZIndex(player, buildingFront);
  expect(zIndex.player).toBeLessThan(zIndex.buildingFront);
});
```

---

### **Phase 5: NPCs & Interactions (Week 3)**
**Goal:** Expand to 50 NPCs per story

**Tasks:**
1. ✅ Import NPC dialogues from NPC_DIALOGUES.md
2. ✅ Create 50 NPC entries
3. ✅ Place 10 battle NPCs (recruitable units)
4. ✅ Place 40 dialogue NPCs (atmosphere)
5. ✅ Test battle triggers
6. ✅ Test recruitment flow

**Story Alignment:**
- ✅ Elder gives quest context
- ✅ Garet is at Training Grounds (recruitable)
- ✅ Mia is at Healing House (recruitable)
- ✅ Shopkeepers at correct buildings

**Testing:**
```typescript
test('STORY: Battle NPC recruitment works', () => {
  const garet = findNPC('garet-trainer');
  expect(garet.type).toBe('battle');

  const party = createParty([createUnit('Isaac', 2)]);
  triggerBattle(garet, party);

  // After winning battle
  expect(party.length).toBe(2); // Garet joined
});
```

---

### **Phase 6: Effects & Polish (Week 3-4)**
**Goal:** Add ambient life and atmosphere

**Tasks:**
1. ✅ Create EnvironmentalEffect component
2. ✅ Add sparkles to Psynergy Stone
3. ✅ Add mist over water
4. ✅ Add wind effects in bushes
5. ✅ Add torch lighting (day/night prep)
6. ✅ Optimize performance (culling, sprite atlases)

**Deliverable:** Vale feels alive and atmospheric

---

### **Phase 7: Multi-Zone (Week 4+)**
**Goal:** Expand beyond single screen (OPTIONAL)

**Tasks:**
1. ✅ Create 5 additional zones
2. ✅ Implement zone transitions
3. ✅ Add Sol Sanctum entrance zone
4. ✅ Add Bilibin Forest path zone
5. ✅ Test seamless transitions

**Priority:** LOW (ship Phase 1-6 first)

---

## ✅ QUALITY GATES

### **After Phase 1:**
- [ ] Player walks on 5+ terrain types
- [ ] No gradient background visible
- [ ] TypeScript 0 errors
- [ ] Performance: 60fps

### **After Phase 2:**
- [ ] 17 Vale buildings placed
- [ ] All story locations present (Sanctum, Houses, Shop, Inn)
- [ ] Building collision works
- [ ] Can enter buildings (triggers shop/dialogue)

### **After Phase 3:**
- [ ] 20+ trees/vegetation placed
- [ ] 10+ props/decorations placed
- [ ] Psynergy Stone functional (heals party)
- [ ] Vale looks professional (not empty)

### **After Phase 4:**
- [ ] 8 render layers working
- [ ] Shadows render correctly
- [ ] Player occludes behind buildings
- [ ] Depth feels natural

### **After Phase 5:**
- [ ] 50 NPCs present
- [ ] 10 battle NPCs functional
- [ ] NPC dialogues from story docs work
- [ ] Recruitment flow tested

### **After Phase 6:**
- [ ] Ambient effects active
- [ ] Vale feels alive
- [ ] Performance optimized
- [ ] All integration tests pass

---

## 🧪 TESTING STRATEGY

### **Integration Tests (Primary)**
```typescript
describe('VALE VILLAGE OVERWORLD - Integration', () => {
  test('PLAYER JOURNEY: Spawn → Walk to Elder → Talk → Walk to Shop → Enter', () => {
    const game = createGame();
    const player = game.player;

    // Spawn in center
    expect(player.x).toBe(15);
    expect(player.y).toBe(12);

    // Walk to Elder
    moveTo(player, 14, 8);
    const elder = findNPCAt(14, 8);
    expect(elder.id).toBe('elder');

    // Interact
    const dialogue = elder.onInteract();
    expect(dialogue).toContain('Strange things have been happening');

    // Walk to shop
    moveTo(player, 8, 12);
    const shop = findBuildingAt(8, 11);
    expect(shop.type).toBe(BuildingType.SHOP);

    // Enter
    enterBuilding(shop);
    expect(game.screen).toBe('SHOP');
  });

  test('STORY: All recruitable units are accessible', () => {
    const vale = loadValeVillage();

    const recruitable = [
      'garet-trainer',
      'ivan-scholar',
      'mia-healer',
      // ... 7 more
    ];

    for (const id of recruitable) {
      const npc = vale.npcs.find(n => n.id === id);
      expect(npc).toBeDefined();
      expect(npc.type).toBe('battle');
      expect(canReachNPC(npc)).toBe(true); // Not blocked by obstacles
    }
  });

  test('PERFORMANCE: 50 NPCs + 17 buildings + vegetation = 60fps', () => {
    const vale = loadValeVillageComplete();

    const fps = measureFPS(vale, 5000); // 5 second test
    expect(fps).toBeGreaterThanOrEqual(60);

    const memoryUsage = measureMemory(vale);
    expect(memoryUsage).toBeLessThan(50 * 1024 * 1024); // <50MB
  });
});
```

### **Visual Regression Tests (Secondary)**
```typescript
test('VISUAL: Vale matches approved mockup', () => {
  const rendering = renderValeVillage();
  const mockup = loadApprovedMockup('vale-village.html');

  const diff = compareVisuals(rendering, mockup);
  expect(diff.score).toBeGreaterThan(0.95); // 95% match
});
```

---

## 📦 FILE STRUCTURE

### **New Files:**
```
src/
├── components/
│   └── overworld/
│       ├── TerrainTile.tsx         (NEW)
│       ├── Building.tsx            (NEW)
│       ├── Vegetation.tsx          (NEW)
│       ├── Prop.tsx                (NEW)
│       ├── EnvironmentalEffect.tsx (NEW)
│       ├── Shadow.tsx              (NEW)
│       ├── Layer.tsx               (NEW)
│       └── OverworldScreen.tsx     (MODIFIED - expanded)
│
├── data/
│   └── maps/
│       ├── valeVillage.ts          (NEW - terrain map)
│       ├── valeBuildings.ts        (NEW - building data)
│       ├── valeVegetation.ts       (NEW - plant placements)
│       ├── valeProps.ts            (NEW - decorations)
│       └── valeNPCs.ts             (MODIFIED - expanded to 50)
│
├── systems/
│   ├── terrainSystem.ts            (NEW)
│   ├── layerRenderingSystem.ts     (NEW)
│   └── zoneTransitionSystem.ts     (NEW - Phase 7)
│
└── types/
    ├── terrain.ts                  (NEW)
    ├── building.ts                 (NEW)
    └── vegetation.ts               (NEW)
```

### **Modified Files:**
```
src/
├── components/
│   └── overworld/
│       ├── OverworldScreen.tsx     (Add terrain, buildings, layers)
│       └── OverworldScreen.css     (Expand for new elements)
│
└── data/
    └── npcs/
        └── valeNPCs.ts             (Expand from 4 to 50 NPCs)
```

---

## 🎯 SUCCESS METRICS

### **Visual Quality:**
- [ ] Matches Golden Sun GBA aesthetic
- [ ] No gradient background visible
- [ ] Proper depth and occlusion
- [ ] Smooth animations (sprites, effects)

### **Story Coherence:**
- [ ] All 17 story buildings present
- [ ] Buildings in correct locations (Sanctum north, etc.)
- [ ] 50 NPCs with story-appropriate dialogue
- [ ] Functional locations (Shop, Inn, Psynergy Stone)

### **Performance:**
- [ ] 60fps with all elements
- [ ] <50MB memory usage
- [ ] Smooth camera follow
- [ ] No sprite flickering

### **Code Quality:**
- [ ] TypeScript 0 errors
- [ ] All integration tests pass
- [ ] Proper component structure
- [ ] Reusable systems

### **Integration:**
- [ ] Works with existing NPC system
- [ ] Works with movement system
- [ ] Works with dialogue system
- [ ] Works with battle triggers
- [ ] Doesn't break save system

---

## 🚀 NEXT STEPS

1. **Review this spec** with Story Director and Architect
2. **Get approval** on building placements and story alignment
3. **Begin Phase 1** - Terrain system
4. **Iterate** through phases 2-6
5. **Test** at each quality gate
6. **Ship** when all gates pass

---

## 📝 NOTES & CONSIDERATIONS

### **Performance Optimizations:**
- Use sprite atlases to reduce draw calls
- Implement camera frustum culling (only render visible tiles)
- Pool entity components (reuse, don't recreate)
- Use CSS transforms (GPU) not top/left (CPU)
- Lazy load zone data (don't load all zones at once)

### **Accessibility:**
- Keyboard navigation (already implemented)
- Screen reader support for building names
- High contrast mode (optional)
- Reduced motion option for effects

### **Future Enhancements (Post-Ship):**
- Day/night cycle (time-based lighting)
- Weather system (rain, snow, fog)
- Seasonal variations (winter trees, autumn leaves)
- Dynamic NPCs (wandering, schedules)
- Building interiors (separate scenes)

---

**Status:** 🟡 Ready for Implementation
**Estimated Time:** 3-4 weeks (Phases 1-6)
**Risk Level:** 🟢 LOW (using proven systems, existing sprites)
**Dependencies:** Sprite library (✅ complete), Current overworld system (✅ working)

---

**Prepared by:** AI Graphics Integration Role
**Aligned with:** Vale Chronicles Architecture, Story Structure, Coding Standards
**Sprite Sheets Used:** All 25 sprite sheets (1,426 sprites)
