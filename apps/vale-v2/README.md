# Vale Chronicles V2

Greenfield rebuild with clean architecture.

## Architecture

See `/docs/adr/` for Architecture Decision Records.

## Development

```bash
# Install dependencies
pnpm install

# Type check
pnpm typecheck

# Lint
pnpm lint

# Test
pnpm test

# Validate data
pnpm validate:data

# Dev server
pnpm dev
```

## Structure

```
apps/vale-v2/
├── src/
│   ├── core/           # React-free, deterministic
│   ├── state/          # Zustand slices + hooks
│   ├── ui/             # React components
│   └── data/           # Content + schemas
└── tests/              # Tests
```

## Guardrails

- No React in `core/**`
- No classes in `core/models/**`
- No `any` in `core/**`
- Seeded RNG only in core
- Zod is single source of truth
- State in Zustand, not components

