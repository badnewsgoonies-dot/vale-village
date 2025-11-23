# Vale Chronicles V2

Greenfield rebuild with clean architecture.

## Documentation

- **[CLAUDE_USAGE_GUIDE.md](CLAUDE_USAGE_GUIDE.md)** - Guide for using Claude AI with this project
- **[CLAUDE.md](CLAUDE.md)** - Comprehensive reference for Claude Code
- **[/docs/](docs/)** - Complete project documentation

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
src/
├── core/           # React-free, deterministic
├── ui/             # React components and Zustand slices
└── data/           # Content + schemas
tests/              # Tests
```

## Guardrails

- No React in `core/**`
- No classes in `core/models/**`
- No `any` in `core/**`
- Seeded RNG only in core
- Zod is single source of truth
- State in Zustand, not components

