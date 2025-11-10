# ADR 001: Layering & Boundaries

**Status:** Accepted  
**Date:** 2025-11-10  
**Deciders:** Architecture Team

## Context

The codebase needs clear architectural boundaries to prevent coupling, enable testing, and support deterministic game logic.

## Decision

We adopt a strict layered architecture with enforced boundaries:

### Layers (bottom to top)

1. **core/** - React-free, deterministic code only
   - `models/` - Plain object types + factories (no classes)
   - `algorithms/` - Pure functions (damage, turn order, buffs, RNG math)
   - `services/` - Orchestration (equip, djinn, battle turn)
   - `random/` - Seeded PRNG + helpers
   - `validation/` - Validates content using data/schemas

2. **state/** - Zustand slices + hooks; no business logic
   - `slices/` - Feature-based state slices
   - `hooks/` - React hooks that bridge services to UI
   - `store.ts` - Central Zustand store

3. **ui/** - React components only
   - `screens/` - Full-screen views
   - `features/` - Feature-specific components
   - `shared/` - Reusable UI components

4. **data/** - Static game content
   - `definitions/` - Content (abilities, equipment, units, enemies)
   - `schemas/` - Zod schemas (single source of truth)

### Enforcement

- ESLint `import/no-restricted-paths` enforces boundaries
- CI rejects if `core/**` imports React
- UI cannot import `core/algorithms` directly (must go via `core/services`)
- State only talks to services, not algorithms

## Consequences

**Positive:**
- Core logic is testable without React
- Deterministic game logic (seeded RNG)
- Clear separation of concerns
- Easy to port to different UI frameworks

**Negative:**
- More files and indirection
- Must be disciplined about boundaries
- Initial setup overhead

## Alternatives Considered

- Monolithic structure (rejected - too coupled)
- Redux instead of Zustand (rejected - more boilerplate)
- Classes in core (rejected - harder to serialize/test)

