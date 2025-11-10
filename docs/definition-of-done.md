# Definition of Done

## Code Review Checklist

- [ ] No React imports in `core/**`
- [ ] No classes in `core/models/**`
- [ ] No `any` types in `core/**`
- [ ] Services return `Result<T, E>` (no thrown errors)
- [ ] Data validated in CI
- [ ] Tests: unit + (if applicable) property/golden
- [ ] Perf smoke passes; bundle budget not exceeded
- [ ] Docs updated (ADR or API notes)

## Quality Gates

### Type Safety
- `pnpm typecheck` passes (strict mode)
- No `any` types in core code
- All imports resolve correctly

### Linting
- `pnpm lint` passes
- ESLint boundaries enforced
- No console.* in production code

### Testing
- `pnpm test` passes
- Coverage ≥ 80% in `core/**`
- Golden tests for deterministic features
- Property-based tests for invariants

### Validation
- `pnpm validate:data` passes
- All data files validated
- Invalid data caught in CI

### Performance
- Battle turn < 5ms on CI hardware
- Bundle size within budget
- No memory leaks

### Documentation
- ADRs updated if architecture changes
- API docs for public services
- README updated if needed

## CI Pipeline

All gates must pass before merge:

1. Typecheck
2. Lint
3. Tests (with coverage)
4. Data validation
5. Bundle size check
6. Perf smoke test

## Exceptions

Exceptions require:
- Written justification
- Timeline for fixing
- Approval from tech lead

