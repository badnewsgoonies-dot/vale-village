# ADR 003: Model Conventions

**Status:** Accepted  
**Date:** 2025-11-10  
**Deciders:** Architecture Team

## Context

We need models that are:
- Serializable (for save/load)
- Immutable (for React)
- Testable (no side effects)
- Type-safe

## Decision

Use **plain objects (POJOs)** with readonly properties and factory functions.

### Pattern

```typescript
// core/models/Unit.ts
export interface Unit {
  readonly id: string;
  readonly name: string;
  level: number;
  xp: number;
  // ... other properties
}

export function createUnit(definition: UnitDefinition, level: number): Unit {
  return {
    id: definition.id,
    name: definition.name,
    level,
    xp: 0,
    // ... initialize all fields
  };
}

export function updateUnit(unit: Unit, updates: Partial<Unit>): Unit {
  return { ...unit, ...updates };
}
```

### Rules

- No classes in `core/models/`
- All properties readonly where possible
- Factory functions for creation
- Update functions return new objects (immutability)
- IDs are strings (no UUIDs needed for game entities)

## Consequences

**Positive:**
- Easy to serialize/deserialize
- Works perfectly with React
- No hidden state or side effects
- Easy to test

**Negative:**
- More verbose than classes
- Must remember to use update functions
- No inheritance (use composition instead)

## Alternatives Considered

- Classes (rejected - serialization issues, harder to test)
- Records/structs (rejected - TypeScript doesn't have native records)
- Immutable.js (rejected - extra dependency, learning curve)

