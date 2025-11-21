# Coding Conventions Summary

This document summarizes the coding conventions discovered and documented for Vale Chronicles V2.

## What Was Fixed

### 1. Schema File Naming ✅
- **Fixed**: Renamed `mapSchema.ts` → `MapSchema.ts` (PascalCase)
- **Updated**: Import in `src/core/models/overworld.ts`

### 2. Unit ID Formatting ✅
- **Fixed**: Changed `war_mage` (snake_case) → `war-mage` (kebab-case)
- **Updated**: All references in:
  - `src/data/definitions/units.ts`
  - `src/ui/sprites/manifest.ts`
  - All test files (15+ files)

### 3. Test Function Naming 🔄 (In Progress)
- **Standardizing**: Converting `it()` → `test()` for consistency
- **Status**: Some files converted, remaining files need conversion

## What Was Documented

### Function Naming Prefixes
- `create*` - Production factories
- `mk*` - Test factories
- `make*` - Utility factories
- `calculate*` - Math computations
- `check*` - Boolean predicates
- `get*` - Accessors
- `apply*` - State transformers
- `is*` - Type guards
- `can*` - Permission checks

### File Naming Rules
- PascalCase: Models, Components, Schemas
- kebab-case: Algorithms, Services
- camelCase: Utilities
- Slice suffix: State slices

### Type vs Interface
- `interface` for objects
- `type` for unions/literals
- Never use `enum`

### Parameter Ordering
Subject → Context → Ability → RNG (always last)

### Import Ordering
1. Type imports
2. Value imports
3. Constants
4. Algorithms/services

### JSDoc Pattern
Every exported function should document:
- What it does
- References to specs
- Formulas/edge cases

### Test Conventions
- Use `test()` not `it()`
- Test factories use `mk*` prefix
- Located in `src/test/factories.ts`

## Scripts Created

1. **`scripts/fix-conventions.ts`** - Finds and fixes inconsistencies
2. **`scripts/standardize-tests.ts`** - Converts `it()` → `test()`

## Remaining Work

- [ ] Convert remaining test files from `it()` to `test()`
- [ ] Run full test suite to verify all changes
- [ ] Update any documentation that references old patterns

## References

- **CLAUDE.md** - Full coding conventions documentation
- **docs/NAMING_CONVENTIONS.md** - Detailed naming rules
- **scripts/fix-conventions.ts** - Automated fix script

