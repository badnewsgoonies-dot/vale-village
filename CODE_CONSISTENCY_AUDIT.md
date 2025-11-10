# Code Consistency Audit Report
**Date:** 2025-01-27  
**Scope:** Full codebase audit for coding style, syntax, and naming consistency

## Executive Summary

This audit examines the codebase for consistency in:
- Naming conventions (variables, functions, types, IDs)
- Code structure patterns (classes vs functions)
- File organization
- Import patterns
- Type definitions

**Key Findings:**
- ✅ **Consistent:** ID naming (abilityId, unitId, djinnId), import patterns, file naming
- ⚠️ **Inconsistent:** Service patterns (classes vs functions), ability ID formats (kebab-case vs snake_case)
- ❌ **Issues:** Duplicate type definitions, mixed service patterns

---

## 1. Naming Conventions

### ✅ Consistent Patterns

#### ID Variables (camelCase with lowercase "id")
Both codebases consistently use:
- `abilityId` (not `abilityID`)
- `unitId` (not `unitID`)
- `djinnId` (not `djinnID`)

**Examples:**
```typescript
// src/context/GameProvider.tsx
const equipItem = useCallback((unitId: string, slot: string, equipment: Equipment) => {
  // ...
});

// apps/vale-v2/src/core/services/BattleService.ts
export function performAction(
  state: BattleState,
  actorId: string,
  abilityId: string,
  targetIds: readonly string[],
  rng: PRNG
)
```

**Status:** ✅ **CONSISTENT** - Matches naming conventions document

#### File Naming
- Type files: `PascalCase.ts` (e.g., `Unit.ts`, `Battle.ts`, `Equipment.ts`)
- Data files: `camelCase.ts` (e.g., `abilities.ts`, `equipment.ts`)
- Service files: `PascalCase.ts` (e.g., `BattleService.ts`, `EquipmentService.ts`)

**Status:** ✅ **CONSISTENT**

#### Import Patterns
Both codebases consistently use `import type` for type-only imports:

```typescript
// src/data/abilities.ts
import type { Ability } from '@/types/Ability';

// apps/vale-v2/src/core/services/BattleService.ts
import type { Unit } from '../models/Unit';
import type { BattleState } from '../models/BattleState';
```

**Status:** ✅ **CONSISTENT**

---

## 2. Critical Inconsistencies

### ❌ **CRITICAL: Ability ID Format Mismatch**

**Issue:** Two different ID formats are used for abilities:

#### `src/data/abilities.ts` (Main codebase)
Uses **kebab-case** (matches naming conventions):
```typescript
export const CLAY_SPIRE: Ability = {
  id: 'clay-spire',  // ✅ kebab-case
  // ...
};

export const IRON_SWORD: Ability = {
  id: 'iron-sword',  // ✅ kebab-case
  // ...
};
```

#### `apps/vale-v2/src/data/definitions/abilities.ts` (Vale-v2)
Uses **snake_case** (violates naming conventions):
```typescript
export const HEAVY_STRIKE: Ability = {
  id: 'heavy_strike',  // ❌ snake_case (should be 'heavy-strike')
  // ...
};

export const GUARD_BREAK: Ability = {
  id: 'guard_break',  // ❌ snake_case (should be 'guard-break')
  // ...
};
```

**Impact:** 
- Violates documented naming conventions (`docs/NAMING_CONVENTIONS.md`)
- Creates confusion when migrating between codebases
- Potential runtime errors if IDs are used for lookups

**Recommendation:** 
1. Update `apps/vale-v2/src/data/definitions/abilities.ts` to use kebab-case
2. Update any references to these IDs throughout vale-v2
3. Add validation to enforce kebab-case for ability IDs

---

### ⚠️ **Service Pattern Inconsistency**

**Issue:** Two different patterns for organizing service code:

#### `src/core/services/` (Main codebase)
Uses **static class methods**:
```typescript
// src/core/services/EquipmentService.ts
export class EquipmentService {
  static equipItem(
    unit: Unit | UnitModel,
    slot: EquipmentSlot,
    item: Equipment
  ): Result<Unit | UnitModel, string> {
    // ...
  }
}

// Usage:
EquipmentService.equipItem(unit, slot, item);
```

#### `apps/vale-v2/src/core/services/` (Vale-v2)
Uses **exported functions**:
```typescript
// apps/vale-v2/src/core/services/BattleService.ts
export function startBattle(
  playerTeam: Team,
  enemies: readonly Unit[],
  rng: PRNG
): BattleState {
  // ...
}

export function performAction(
  state: BattleState,
  actorId: string,
  abilityId: string,
  targetIds: readonly string[],
  rng: PRNG
): { state: BattleState; result: ActionResult; events: readonly BattleEvent[] } {
  // ...
}

// Usage:
startBattle(team, enemies, rng);
performAction(state, actorId, abilityId, targetIds, rng);
```

**Impact:**
- Different mental models for developers
- Inconsistent code organization
- ADR 000 suggests plain functions are preferred (no classes in core/)

**Recommendation:**
- **Align on function-based services** (matches ADR 000: "Plain Object Models (No Classes)")
- Migrate `src/core/services/*` from classes to functions
- Update documentation to reflect function-based pattern

---

### ❌ **Duplicate Type Definitions**

**Issue:** Types are defined in multiple locations:

1. `src/types/` - Contains 15 type files
2. `src/domain/types/` - Contains identical 15 type files

**Examples:**
- `src/types/Unit.ts` and `src/domain/types/Unit.ts`
- `src/types/Battle.ts` and `src/domain/types/Battle.ts`
- `src/types/Equipment.ts` and `src/domain/types/Equipment.ts`

**Impact:**
- Code duplication
- Risk of divergence
- Confusion about which to import
- Increased maintenance burden

**Recommendation:**
1. Audit which location is actively used
2. Remove duplicate definitions
3. Consolidate to single source of truth
4. Update all imports to use consolidated location

---

## 3. Type Definition Patterns

### Interface vs Type Usage

#### `src/types/` (Main codebase)
Mixed usage of `interface` and `type`:
```typescript
// src/types/Unit.ts
export type UnitRole = 'Balanced Warrior' | 'Pure DPS' | ...;
export interface UnitDefinition { ... }
export interface StatusEffect { ... }

// src/types/Battle.ts
export type BattleStatus = 'ongoing' | BattleResult;
export interface ActionResult { ... }
export interface BattleState { ... }
```

#### `apps/vale-v2/src/data/schemas/` (Vale-v2)
Uses `type` exclusively (from Zod inference):
```typescript
// apps/vale-v2/src/data/schemas/UnitSchema.ts
export type Element = z.infer<typeof ElementSchema>;
export type UnitRole = z.infer<typeof UnitRoleSchema>;
export type Unit = z.infer<typeof UnitSchema>;
```

**Status:** ⚠️ **ACCEPTABLE** - Different approaches, but both valid. Vale-v2's Zod-based approach provides runtime validation.

**Recommendation:** Document preferred pattern. Vale-v2's Zod approach is more robust for runtime validation.

---

## 4. Code Structure Patterns

### ✅ Consistent: Result Pattern
Both codebases use the `Result<T, E>` pattern consistently:
```typescript
import { Result, Ok, Err } from '@/utils/Result';

// Both codebases use this pattern
return Ok(value);
return Err('error message');
```

**Status:** ✅ **CONSISTENT**

### ✅ Consistent: Constant Exports
Both use `SCREAMING_SNAKE_CASE` for exported constants:
```typescript
// src/data/abilities.ts
export const CLAY_SPIRE: Ability = { ... };
export const IRON_SWORD: Ability = { ... };

// apps/vale-v2/src/data/definitions/abilities.ts
export const STRIKE: Ability = { ... };
export const HEAVY_STRIKE: Ability = { ... };
```

**Status:** ✅ **CONSISTENT**

---

## 5. Recommendations Summary

### Priority 1: Critical Fixes

1. **Fix Ability ID Format** ⚠️ **HIGH PRIORITY**
   - Update `apps/vale-v2/src/data/definitions/abilities.ts` to use kebab-case
   - Add validation to enforce kebab-case
   - Update all references

2. **Remove Duplicate Types** ⚠️ **HIGH PRIORITY**
   - Consolidate `src/types/` and `src/domain/types/`
   - Remove duplicates
   - Update imports

### Priority 2: Consistency Improvements

3. **Align Service Patterns** ⚠️ **MEDIUM PRIORITY**
   - Migrate `src/core/services/` from classes to functions
   - Matches ADR 000 (no classes in core/)
   - Update documentation

4. **Document Type Patterns** ℹ️ **LOW PRIORITY**
   - Document when to use `interface` vs `type`
   - Document Zod-based type inference pattern (vale-v2)

---

## 6. Positive Findings

### ✅ Well-Maintained Consistency

1. **ID Naming:** Consistent camelCase with lowercase "id" throughout
2. **File Naming:** Consistent PascalCase for types, camelCase for data
3. **Import Patterns:** Consistent use of `import type`
4. **Constant Exports:** Consistent SCREAMING_SNAKE_CASE
5. **Result Pattern:** Consistent error handling pattern

---

## 7. Action Items

### Immediate (This Sprint)
- [ ] Fix ability ID format in vale-v2 (kebab-case)
- [ ] Audit and remove duplicate type definitions
- [ ] Add validation for ability ID format

### Short-term (Next Sprint)
- [ ] Migrate service classes to functions (align with ADR 000)
- [ ] Update documentation with preferred patterns
- [ ] Add ESLint rules to enforce naming conventions

### Long-term (Backlog)
- [ ] Consolidate type definitions
- [ ] Create style guide document
- [ ] Add pre-commit hooks for consistency checks

---

## Appendix: Files Examined

### Main Codebase (`src/`)
- `src/data/abilities.ts` - Ability definitions (kebab-case IDs ✅)
- `src/data/equipment.ts` - Equipment definitions
- `src/types/Unit.ts` - Unit type definitions
- `src/core/services/BattleService.ts` - Class-based service
- `src/core/services/EquipmentService.ts` - Class-based service
- `src/context/GameProvider.tsx` - Context provider

### Vale-v2 Codebase (`apps/vale-v2/src/`)
- `apps/vale-v2/src/data/definitions/abilities.ts` - Ability definitions (snake_case IDs ❌)
- `apps/vale-v2/src/core/services/BattleService.ts` - Function-based service
- `apps/vale-v2/src/core/algorithms/damage.ts` - Pure functions
- `apps/vale-v2/src/data/schemas/UnitSchema.ts` - Zod-based types

---

**Report Generated:** 2025-01-27  
**Auditor:** AI Code Review  
**Next Review:** After fixes applied

