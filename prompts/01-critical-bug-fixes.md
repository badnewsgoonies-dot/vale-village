# Fix Critical Bugs in Vale Chronicles V2

## Context
You are working on Vale Chronicles V2, a Golden Sun-inspired tactical RPG built with clean architecture. The codebase uses TypeScript, React, Zustand, and follows strict architectural boundaries.

## Current State
The game has several critical bugs that need immediate fixing:
1. HP can be set to negative values or exceed maxHP
2. Dead units can be healed without proper checks
3. Negative healing values cause damage instead of being rejected
4. PRNG accepts negative seeds and returns negative values
5. Duplicate Djinn can be equipped on the same team
6. Equipment validation crashes on missing statBonus

## Architecture Constraints
- Core logic (`src/core/`) must remain React-free
- All models are POJOs with factory functions (no classes)
- Use Result types for error handling where appropriate
- Follow existing patterns in the codebase
- All changes must include tests

## Tasks

### Task 1: Fix HP Validation
**File:** `src/core/models/Unit.ts`
- Add validation in `applyDamage()` to clamp HP to [0, maxHP]
- Add validation in `applyHealing()` to:
  - Reject negative healing values (return error)
  - Check if unit is KO'd and ability doesn't have `revivesFallen`
  - Clamp healing to maxHP (prevent overheal)
- Update `createUnit()` to ensure initial HP is valid

**Test Requirements:**
- Test negative HP is clamped to 0
- Test overheal is clamped to maxHP
- Test healing KO'd unit without revivesFallen returns error
- Test negative healing value is rejected

### Task 2: Fix PRNG Negative Seeds
**File:** `src/core/random/prng.ts`
- Validate seed is non-negative in constructor
- Throw error or convert negative seeds to positive (document decision)
- Ensure `next()` always returns [0, 1)

**Test Requirements:**
- Test negative seed is rejected or converted
- Test all PRNG methods return valid ranges

### Task 3: Fix Duplicate Djinn Equip
**File:** `src/core/models/Team.ts`
- Add validation in Djinn equip function to check for duplicates
- Return Result type with error if duplicate detected

**Test Requirements:**
- Test equipping same Djinn twice returns error
- Test equipping different Djinn works normally

### Task 4: Fix Equipment Validation
**File:** `src/data/schemas/EquipmentSchema.ts`
- Ensure statBonus is required or has default empty object
- Add validation to prevent crashes on malformed data

**Test Requirements:**
- Test equipment with missing statBonus doesn't crash
- Test validation catches malformed equipment

## Success Criteria
- All bugs fixed with proper validation
- All tests pass
- No regressions in existing functionality
- Code follows existing patterns and conventions
- All error cases return Result types or throw appropriately

## Files to Review
- `src/core/models/Unit.ts`
- `src/core/models/Team.ts`
- `src/core/random/prng.ts`
- `src/data/schemas/EquipmentSchema.ts`
- `tests/core/models/Unit.test.ts`
- `tests/core/random/prng.test.ts`

## Recommended Model
**Claude 3.5 Sonnet** (200k context) - Sufficient for straightforward bug fixes


