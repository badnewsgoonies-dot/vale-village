# How to Share Vale Chronicles with Claude

This guide explains how to effectively work with Claude (the AI assistant at claude.ai) on the Vale Chronicles project.

## Quick Start

The Vale Chronicles project is configured to work seamlessly with Claude Code and the Claude AI assistant. All the necessary configuration is already in place!

## What's Already Set Up

### 1. `.claude/` Directory
The `.claude/` directory contains Claude-specific configuration:
- **`settings.local.json`** - Permissions for Claude Code to run commands safely

### 2. `CLAUDE.md` File
A comprehensive reference guide for Claude containing:
- Project architecture overview
- Coding conventions and patterns
- Common commands and workflows
- Testing philosophy
- Data validation rules

### 3. `.github/copilot-instructions.md`
Workspace instructions for AI agents working in this repository, including architecture boundaries and development workflows.

## Using Claude with This Project

### Option 1: Claude.ai Web/App (Manual Context Sharing)

When chatting with Claude at [claude.ai](https://claude.ai), you can share project context by:

1. **Share Key Documentation Files**
   Start by sharing these essential files with Claude in your conversation:
   - `CLAUDE.md` - Complete project reference
   - `README.md` - Project overview
   - `package.json` - Available commands
   - `.github/copilot-instructions.md` - AI workspace instructions

2. **Share Relevant Code**
   Attach or paste specific files you're working on:
   - For architecture questions: files from `src/core/`, `src/ui/`, `src/data/`
   - For testing: files from `tests/`
   - For specific features: the relevant component or service files

3. **Describe Your Task**
   Be specific about what you're trying to accomplish:
   - "I want to add a new unit to the game"
   - "I need help debugging the battle system"
   - "How do I add a new ability?"

### Option 2: Claude Code (Integrated Development)

If you're using Claude Code (the IDE integration), it already has access to your codebase and will automatically reference the configuration files.

## Essential Commands

When working with Claude on this project, these are the most important commands:

```bash
# Install dependencies (first time setup)
pnpm install

# Development server (starts the game)
pnpm dev

# Run all tests
pnpm test

# Run tests in watch mode (for development)
pnpm test:watch

# Run end-to-end tests
pnpm test:e2e

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Validate game data against schemas
pnpm validate:data

# Run all checks (before committing)
pnpm precommit

# Production build
pnpm build
```

## Project Structure Overview

```
vale-village/
├── .claude/                    # Claude-specific configuration
├── .github/                    # GitHub and AI workspace config
├── docs/                       # Comprehensive documentation
│   ├── app/                   # Core app documentation
│   ├── battle-system/         # Battle UI and mechanics
│   ├── development/           # Development guides
│   ├── features/              # Feature documentation
│   └── implementation/        # Implementation guides
├── src/
│   ├── core/                  # Pure TypeScript game logic
│   │   ├── algorithms/       # Mathematical calculations
│   │   ├── models/           # Data models (POJOs)
│   │   ├── services/         # Business logic services
│   │   └── random/           # Seeded RNG system
│   ├── ui/                    # React components and UI
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom React hooks
│   │   └── state/            # Zustand state management
│   ├── data/                  # Game content and schemas
│   │   ├── definitions/      # Game data (units, abilities, etc.)
│   │   └── schemas/          # Zod validation schemas
│   ├── infra/                 # Infrastructure (save system)
│   └── story/                 # Story and overworld content
└── tests/                     # Test files (mirrors src/ structure)
```

## Architecture Principles (For Claude)

When asking Claude to make changes, keep these principles in mind:

1. **Core is Pure**: `src/core/` contains no React, no side effects, fully deterministic
2. **No `any` Types**: Especially in `src/core/` - ESLint enforced
3. **No `Math.random()`**: Use the seeded PRNG from `core/random/prng.ts`
4. **Dependency Flow**: `UI → State (Zustand) → Services → Algorithms → Models`
5. **Zod Schemas**: All game data must validate against Zod schemas
6. **State Management**: Use Zustand slices, not React state for game logic

## Common Tasks with Claude

### Adding a New Unit
1. Share `CLAUDE.md` and the units definition file
2. Ask: "I want to add a new unit following the existing patterns"
3. Claude will guide you through:
   - Adding to `src/data/definitions/units.ts`
   - Updating Zod schema if needed
   - Running `pnpm validate:data`

### Adding a New Ability
1. Share the abilities definition and CLAUDE.md
2. Ask: "I need to add a new ability with [description]"
3. Claude will help with:
   - Ability definition
   - Schema validation
   - Testing the ability in battle

### Debugging Issues
1. Share the error message and relevant files
2. Share CLAUDE.md for context
3. Ask specific questions about the error
4. Claude can help trace through the architecture

### Understanding Game Mechanics
1. Share `CLAUDE.md` and ask about the specific mechanic
2. Reference `docs/app/GAME_MECHANICS_FLOW.md` for detailed flows
3. Ask Claude to explain how systems interact

## Tips for Working with Claude

### ✅ Do's
- **Be Specific**: "I want to add a Venus-element mage unit" vs "Add a unit"
- **Share Context**: Attach relevant files and CLAUDE.md
- **Reference Docs**: Mention specific docs like "according to docs/NAMING_CONVENTIONS.md"
- **Test Iteratively**: Ask Claude to help write tests first
- **Follow Patterns**: Ask Claude to follow existing code patterns

### ❌ Don'ts
- **Don't**: Ask Claude to refactor working code without a specific reason
- **Don't**: Ask for changes that violate architecture principles
- **Don't**: Skip validation commands (`pnpm validate:data`)
- **Don't**: Ignore ESLint errors
- **Don't**: Add `any` types or `Math.random()` in core code

## Getting Help

If you're stuck or Claude's suggestions don't work:

1. **Check Documentation**:
   - `CLAUDE.md` - Comprehensive reference
   - `docs/app/GAME_MECHANICS_FLOW.md` - Detailed game flow
   - `docs/NAMING_CONVENTIONS.md` - ID and naming rules

2. **Run Validation**:
   ```bash
   pnpm typecheck  # TypeScript errors
   pnpm lint       # Code quality
   pnpm test       # Unit tests
   pnpm validate:data  # Schema validation
   ```

3. **Ask Claude to Debug**:
   - Share the error output
   - Share the file where the error occurs
   - Ask Claude to explain the error in context of the architecture

## Example Claude Conversations

### Example 1: Adding a New Unit
```
You: I want to add a new Mercury-element healer unit named "Cleric" 
with healing abilities. Here's CLAUDE.md [attach file]

Claude: [Will guide you through the process following conventions]
```

### Example 2: Understanding Battle System
```
You: How does the turn order system work? Here's CLAUDE.md [attach]

Claude: [Explains queue-based system, speed calculations, tie-breaking]
```

### Example 3: Fixing a Bug
```
You: I'm getting a TypeScript error in BattleService.ts:
[paste error]
Here are the relevant files: [attach files]

Claude: [Analyzes error in context of architecture and suggests fix]
```

## Advanced: Claude Code Setup

If you're using Claude Code (IDE integration):

1. Claude Code will automatically detect `.claude/settings.local.json`
2. It will have permission to run the commands listed in the permissions
3. It can read and suggest changes to any file in the repository
4. It will follow the guidelines in `CLAUDE.md` automatically

## Summary

Working with Claude on Vale Chronicles is straightforward:
1. **Share `CLAUDE.md`** - The comprehensive reference guide
2. **Share specific files** - The code you're working with
3. **Be specific** - Clear task descriptions get better results
4. **Test frequently** - Use `pnpm test` and `pnpm validate:data`
5. **Follow patterns** - Claude will help maintain consistency

Happy coding with Claude! 🎮✨
