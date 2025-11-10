# ADR 004: RNG & Determinism Policy

**Status:** Accepted  
**Date:** 2025-11-10  
**Deciders:** Architecture Team

## Context

Game logic must be deterministic for:
- Replayability
- Testing (golden tests)
- Save/load consistency
- Bug reproduction

## Decision

Use **seeded PRNG** exclusively in core logic.

### Pattern

```typescript
// core/random/prng.ts
export interface PRNG {
  next(): number; // Returns [0, 1)
  clone(): PRNG;  // For branching
}

// All core functions accept PRNG
export function calculateDamage(
  attacker: Unit,
  defender: Unit,
  rng: PRNG
): number {
  const roll = rng.next();
  // ... deterministic calculation
}
```

### Rules

- All randomness in `core/**` uses seeded PRNG
- UI can use `Math.random()` for visual effects only
- Battle state includes seed for replay
- Save files include RNG state

## Consequences

**Positive:**
- Deterministic battles (replayable)
- Golden tests possible
- Easy to reproduce bugs
- Consistent save/load

**Negative:**
- Must pass RNG through function calls
- Cannot use Math.random() in core
- More complex than non-deterministic code

## Alternatives Considered

- Math.random() (rejected - non-deterministic)
- External RNG library (rejected - want control, keep it simple)
- No randomness (rejected - battles need variance)

