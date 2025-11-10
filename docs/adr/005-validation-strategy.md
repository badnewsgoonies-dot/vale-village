# ADR 005: Validation Strategy

**Status:** Accepted  
**Date:** 2025-11-10  
**Deciders:** Architecture Team

## Context

Game data (abilities, equipment, units, enemies) must be validated to catch errors early and prevent runtime bugs.

## Decision

Use **Zod** as the single source of truth for data validity.

### Pattern

```typescript
// data/schemas/AbilitySchema.ts
export const AbilitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  manaCost: z.number().int().min(0), // Cannot be negative!
  basePower: z.number().int().min(0), // Cannot be negative!
  // ...
});

// core/validation/validateAll.ts
export function validateAllGameData(): void {
  const errors: string[] = [];
  
  Object.values(ABILITIES).forEach(ability => {
    const result = AbilitySchema.safeParse(ability);
    if (!result.success) {
      errors.push(`Ability ${ability.id}: ${result.error.message}`);
    }
  });
  
  if (errors.length) {
    throw new Error(`Data validation failed:\n${errors.join('\n')}`);
  }
}
```

### Rules

- Zod schemas in `data/schemas/`
- Validation runs at startup (dev) and in CI
- TypeScript types derived from schemas where possible
- Fail fast on invalid data

## Consequences

**Positive:**
- Catch data errors early
- Runtime safety
- Self-documenting schemas
- Type inference from schemas

**Negative:**
- Extra dependency (Zod)
- Must maintain schemas
- Runtime overhead (minimal)

## Alternatives Considered

- Manual validation (rejected - error-prone)
- TypeScript only (rejected - no runtime checks)
- Joi/Yup (rejected - Zod has better TS integration)

