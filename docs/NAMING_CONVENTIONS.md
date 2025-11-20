# Naming Conventions - Vale Chronicles

This document defines the naming conventions used throughout the Vale Chronicles codebase to ensure consistency and maintainability.

## Object IDs

**Pattern:** `kebab-case`

IDs are used for data lookups and serialization. They should be lowercase with hyphens separating words.

**Examples:**

- `'iron-sword'` - Equipment ID
- `'clay-spire'` - Ability ID
- `'hermes-sandals'` - Equipment ID
- `'dragon-scales'` - Equipment ID

**Files:**

- [src/data/abilities.ts](../src/data/abilities.ts)
- [src/data/equipment.ts](../src/data/equipment.ts)
- [src/data/djinn.ts](../src/data/djinn.ts)
- [src/data/unitDefinitions.ts](../src/data/unitDefinitions.ts)

## Exported Constants (Data)

**Pattern:** `SCREAMING_SNAKE_CASE`

Data exports (abilities, equipment, djinn, units) use uppercase with underscores.

**Examples:**

```typescript
export const IRON_SWORD: Equipment = { id: 'iron-sword', ... };
export const CLAY_SPIRE: Ability = { id: 'clay-spire', ... };
export const FLINT: Djinn = { id: 'flint', ... };
export const ISAAC: UnitDefinition = { id: 'isaac', ... };
```

## Types & Interfaces

**Pattern:** `PascalCase`

Type names, interfaces, and classes use PascalCase.

**Examples:**

```typescript
export type Element = 'Venus' | 'Mars' | 'Mercury' | 'Jupiter';
export type EquipmentSlot = 'weapon' | 'armor' | 'helm' | 'boots';
export interface Unit { ... }
export interface BattleState { ... }
export interface Equipment { ... }
export class Team { ... }
```

## Functions

**Pattern:** `camelCase` (verb-based)

Functions start with a verb and use camelCase.

**Examples:**

```typescript
export function calculateTurnOrder(units: Unit[]): Unit[] { ... }
export function executeAbility(caster: Unit, ability: Ability): ActionResult { ... }
export function equipDjinn(team: Team, djinn: Djinn[]): Result<Team, string> { ... }
export function applyElementalMultiplier(damage: number, ...): number { ... }
```

## Variables & Properties

**Pattern:** `camelCase`

Local variables, parameters, and object properties use camelCase.

**Examples:**

```typescript
const playerTeam = new Team([isaac, garet]);
const currentTurn = 1;
const baseDamage = 50;
let abilityId: string;
```

## Boolean Properties

**Pattern:** `is/has/can` + `camelCase`

Boolean properties should use a prefix that indicates a true/false state.

**Examples:**

```typescript
get isKO(): boolean { ... }
canUseAbility(abilityId: string): boolean { ... }
canActivateDjinn(): boolean { ... }
hasEquipment: boolean;

// Equipment/Ability special properties
alwaysFirstTurn?: boolean;
revivesFallen?: boolean;
chainDamage?: boolean;
```

## Enum Values

**Pattern:** `SCREAMING_SNAKE_CASE`

Enum members use uppercase with underscores.

**Examples:**

```typescript
export enum BattleResult {
  PLAYER_VICTORY = 'PLAYER_VICTORY',
  PLAYER_DEFEAT = 'PLAYER_DEFEAT',
  PLAYER_FLEE = 'PLAYER_FLEE',
}

export enum DjinnState {
  SET = 'SET',
  ON_STANDBY = 'ON_STANDBY',
  RECOVERY = 'RECOVERY',
}
```

## File Names

### Type/Class Files

**Pattern:** `PascalCase`

Files that primarily export types, interfaces, or classes.

**Examples:**

- `Unit.ts`
- `Battle.ts`
- `Equipment.ts`
- `Djinn.ts`
- `Team.ts`

### Data Files

**Pattern:** `camelCase`

Files that primarily export data definitions.

**Examples:**

- `abilities.ts`
- `equipment.ts`
- `unitDefinitions.ts`
- `djinn.ts`

### Utility Files

**Pattern:** `camelCase`

Utility and helper files.

**Examples:**

- `rng.ts`
- `Result.ts`
- `battle.ts`

## Record/Dictionary Patterns

When creating lookup objects, use ID-based keys that match the object's `id` property:

**Correct Pattern:**

```typescript
export const ABILITIES: Record<string, Ability> = {
  'slash': SLASH,
  'clay-spire': CLAY_SPIRE,
  'iron-sword': IRON_SWORD,
};

// Allows ID-based lookup:
const ability = ABILITIES['clay-spire']; // ✓ Works!
const ability = ABILITIES[someAbility.id]; // ✓ Works!
```

**Incorrect Pattern (DO NOT USE):**

```typescript
// Old shorthand syntax - prevents ID lookups
export const ABILITIES: Record<string, Ability> = {
  SLASH,           // Key is 'SLASH', not the id
  CLAY_SPIRE,      // Key is 'CLAY_SPIRE', not 'clay-spire'
};

const ability = ABILITIES['clay-spire']; // ✗ undefined!
```

## Import Patterns

### Importing Constants

Import specific constants directly from data files:

```typescript
import { SLASH, CLAY_SPIRE, FIREBALL } from '@/data/abilities';
import { IRON_SWORD, SOL_BLADE } from '@/data/equipment';
import { ISAAC, GARET } from '@/data/unitDefinitions';
```

### Importing Types

Import types with the `type` keyword:

```typescript
import type { Ability } from '@/types/Ability';
import type { Equipment } from '@/types/Equipment';
import type { Unit, UnitDefinition } from '@/types/Unit';
```

## Special Cases

### Game World Naming Exception

**Areas, Quests, and Story Flags use `snake_case` instead of `kebab-case`.**

This exception exists for technical reasons:

#### 1. Object Keys

Area IDs are used as JavaScript object keys throughout the codebase:

```typescript
// GameState.areaStates uses area IDs as keys
areaStates: {
  vale_village: { openedChests: Set(), ... },    // ✓ Clean, no quotes needed
  forest_path: { openedChests: Set(), ... },
  ancient_ruins: { openedChests: Set(), ... },
}

// AREAS lookup object
export const AREAS: Record<AreaId, Area> = {
  vale_village: VALE_VILLAGE,    // ✓ Works as object key
  forest_path: FOREST_PATH,
  ancient_ruins: ANCIENT_RUINS,
};

// vs kebab-case (would require quotes):
areaStates: {
  'vale-village': { ... },    // ⚠️ Must quote keys
  'forest-path': { ... },
}
```

#### 2. Story Flags Are Interface Properties

Story flags are TypeScript interface properties and must be valid JavaScript identifiers:

```typescript
export interface StoryFlags {
  intro_seen: boolean;              // ✓ Valid property name
  quest_forest_complete: boolean;   // ✓ Dot notation works
  forest_path_unlocked: boolean;
}

// Accessed naturally with dot notation:
if (state.storyFlags.intro_seen) { ... }           // ✓ Clean
if (state.storyFlags.quest_forest_complete) { ... } // ✓ Clean

// vs kebab-case (would break):
export interface StoryFlags {
  'intro-seen': boolean;           // ⚠️ Must quote
  'quest-forest-complete': boolean;
}

// Requires ugly bracket notation:
if (state.storyFlags['intro-seen']) { ... }          // ⚠️ Verbose
if (state.storyFlags['quest-forest-complete']) { ... }
```

#### 3. Type Safety

All game world IDs are strongly typed with TypeScript string literal unions:

```typescript
// Type definitions in src/types/Area.ts
export type AreaId = 'vale_village' | 'forest_path' | 'ancient_ruins';
export type QuestId = 'quest_clear_forest' | 'quest_ancient_ruins' | ...;
export type BossId = 'alpha_wolf_boss' | 'golem_king_boss';
export type ChestId = `forest_chest_${1 | 2 | 3}` | 'village_starter_chest' | ...;

// Used in interfaces:
export interface Area {
  id: AreaId;  // ✓ Compile-time type checking
}

export interface Quest {
  id: QuestId;
  startsInLocation?: AreaId;
  completesInLocation?: AreaId;
}

export interface GameState {
  currentLocation: AreaId;           // ✓ Type-safe
  areaStates: Record<AreaId, AreaState>;  // ✓ Type-safe keys
}
```

**TypeScript catches typos at compile time:**

```typescript
// This will cause a TypeScript error:
const area = AREAS['vale_vilage'];  // ✗ Typo caught at compile time!
//                    ^^^^^^ Type '"vale_vilage"' is not assignable to type 'AreaId'
```

#### Examples

**Game World IDs (snake_case):**

- ✓ Area IDs: `vale_village`, `forest_path`, `ancient_ruins`
- ✓ Quest IDs: `quest_clear_forest`, `quest_ancient_ruins`
- ✓ Story Flags: `intro_seen`, `quest_forest_complete`, `forest_path_unlocked`
- ✓ Boss IDs: `alpha_wolf_boss`, `golem_king_boss`
- ✓ Chest IDs: `forest_chest_1`, `ruins_chest_2`, `village_starter_chest`

**Battle System IDs (kebab-case):**

- ✓ Equipment: `iron-sword`, `dragon-scales`, `hermes-sandals`
- ✓ Enemies: `wild-wolf`, `fire-sprite`, `earth-golem`
- ✓ Abilities: `slash`, `clay-spire`, `fireball`
- ✓ Djinn: `flint`, `granite`, `forge`

#### Rationale Summary

| Use Case | Pattern | Why |
|----------|---------|-----|
| **Battle IDs** | `kebab-case` | String literals, user-facing, never object keys |
| **Game World IDs** | `snake_case` | Object keys, interface properties, internal use |

Both are type-safe via TypeScript string literal unions, preventing typos at compile time.

**References:**

- Type definitions: [src/types/Area.ts](../src/types/Area.ts)
- Area data: [src/data/areas.ts](../src/data/areas.ts)
- Game state types: [src/context/types.ts](../src/context/types.ts)
- Quest data: [src/data/quests.ts](../src/data/quests.ts)

### "ID" vs "Id"

Use `Id` as a camelCase continuation (not `ID`):

**Correct:**

```typescript
abilityId: string;    // ✓
djinnId: string;      // ✓
unitId: string;       // ✓
targetIds: string[];  // ✓
```

**Incorrect:**

```typescript
abilityID: string;    // ✗
djinnID: string;      // ✗
unitID: string;       // ✗
```

### Multi-word Type Unions

Use PascalCase for each word:

```typescript
type TargetType = 'single-enemy' | 'all-enemies' | 'single-ally' | 'all-allies';
type AbilityType = 'physical' | 'psynergy' | 'healing' | 'buff' | 'debuff';
```

## Summary Table

| Element | Pattern | Examples |
|---------|---------|----------|
| Object IDs | `kebab-case` | `'iron-sword'`, `'clay-spire'`, `'dragon-scales'` |
| Constants (exported data) | `SCREAMING_SNAKE_CASE` | `IRON_SWORD`, `CLAY_SPIRE`, `ISAAC` |
| Types/Interfaces | `PascalCase` | `Unit`, `BattleState`, `Equipment` |
| Functions | `camelCase` (verb) | `calculateDamage()`, `equipItem()`, `canUseAbility()` |
| Variables | `camelCase` | `playerTeam`, `currentTurn`, `baseDamage` |
| Boolean properties | `is/has/can` + `camelCase` | `isKO`, `hasEquipment`, `canActivateDjinn` |
| Enum values | `SCREAMING_SNAKE_CASE` | `PLAYER_VICTORY`, `PLAYER_DEFEAT` |
| File names (types) | `PascalCase` | `Unit.ts`, `Battle.ts` |
| File names (data) | `camelCase` | `abilities.ts`, `equipment.ts` |

## References

These conventions are consistently applied throughout:

- Core type definitions: [src/types/](../src/types/)
- Data definitions: [src/data/](../src/data/)
- Battle system: [src/types/Battle.ts](../src/types/Battle.ts)
- Unit tests: [tests/unit/](../tests/unit/)

For questions or suggestions about naming conventions, please discuss with the team before making changes.
