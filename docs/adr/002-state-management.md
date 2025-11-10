# ADR 002: State Management

**Status:** Accepted  
**Date:** 2025-11-10  
**Deciders:** Architecture Team

## Context

We need a state management solution that:
- Works with React
- Supports feature-based slices
- Doesn't require excessive boilerplate
- Enables time-travel debugging (optional)

## Decision

Use **Zustand** with feature-based slices.

### Pattern

```typescript
// state/slices/equipmentSlice.ts
export const createEquipmentSlice = (set, get) => ({
  selectedUnitId: null,
  selectUnit: (id) => set({ selectedUnitId: id }),
  // ... other state
});

// state/store.ts
export const useStore = create<Store>()((...a) => ({
  ...createEquipmentSlice(...a),
  ...createPartySlice(...a),
  // ... other slices
}));
```

### Rules

- State slices contain only state and simple setters
- Business logic lives in `core/services/`
- Hooks in `state/hooks/` bridge services to UI
- No business logic in slices

## Consequences

**Positive:**
- Minimal boilerplate
- Feature-based organization
- Easy to test slices independently
- Good performance (only affected components re-render)

**Negative:**
- Learning curve for team
- Must be disciplined about not putting logic in slices

## Alternatives Considered

- Redux Toolkit (rejected - more boilerplate)
- Context API (rejected - performance issues, no devtools)
- Jotai (rejected - atomic approach doesn't fit our model)

