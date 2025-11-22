# Vale Chronicles Development Guidelines

## 🎯 Purpose
This document establishes clear development practices to prevent merge conflicts, maintain code quality, and ensure smooth collaboration.

## 📋 Table of Contents
1. [Git Workflow](#git-workflow)
2. [Branch Naming](#branch-naming)
3. [Commit Guidelines](#commit-guidelines)
4. [Code Ownership](#code-ownership)
5. [Testing Requirements](#testing-requirements)
6. [Documentation Standards](#documentation-standards)

## Git Workflow

### 1. Always Start Fresh
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### 2. Feature Branch Workflow
- Create feature branches from `main`
- Keep branches small and focused
- One feature = one branch
- Delete branches after merging

### 3. Before Starting Work
```bash
# Check if someone is working on similar files
git log --oneline -n 20 --all --grep="component-name"
git branch -r | grep "feature-area"
```

## Branch Naming

### ✅ Good Branch Names
- `feature/queue-battle-system`
- `fix/sprite-loading-error`
- `docs/battle-system-guide`
- `refactor/equipment-validation`
- `test/ability-calculations`

### ❌ Bad Branch Names
- `claude/fix-game-bugs-011CUueR1Yd6Hk5LFobwzVtw` (AI-generated)
- `my-branch`
- `stuff`
- `fix`

### Branch Prefixes
- `feature/` - New functionality
- `fix/` - Bug fixes
- `docs/` - Documentation only
- `refactor/` - Code improvements
- `test/` - Test additions/fixes
- `chore/` - Build, tooling, dependencies

## Commit Guidelines

### Commit Message Format
```
<type>: <subject>

<body>

<footer>
```

### Examples
```bash
feat: Add queue-based battle action system

- Implement action queuing for all player units
- Add mana cost validation
- Support Djinn activation queueing

Closes #123
```

### Commit Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `refactor:` - Code change that neither fixes a bug nor adds a feature
- `test:` - Adding missing tests
- `chore:` - Changes to build process or auxiliary tools

## Code Ownership

### Primary Ownership Areas

| Area | Primary Owner | Backup |
|------|---------------|---------|
| Battle System (`/core/services/BattleService`) | TBD | TBD |
| Queue Battle (`/ui/components/QueueBattleView`) | TBD | TBD |
| Overworld (`/ui/components/OverworldMap`) | TBD | TBD |
| State Management (`/ui/state/`) | TBD | TBD |
| Data Definitions (`/data/definitions/`) | TBD | TBD |

### Before Modifying Core Files
1. Check with primary owner
2. Create draft PR early
3. Communicate in daily standup

## Testing Requirements

### Before Merging
- [ ] Run `pnpm test` - All tests pass
- [ ] Run `pnpm typecheck` - No TypeScript errors
- [ ] Run `pnpm validate:data` - Data schemas valid
- [ ] Run `pnpm lint` - No linting errors
- [ ] Test manually in dev mode

### Test Coverage
- New features need tests
- Bug fixes need regression tests
- Keep test files next to implementation

## Documentation Standards

### Code Documentation
```typescript
/**
 * Calculates damage between attacker and defender
 * @param attacker - Unit performing the attack
 * @param defender - Unit receiving damage
 * @param ability - Ability being used (null for basic attack)
 * @param rng - Seeded random number generator
 * @returns Calculated damage amount
 */
export function calculateDamage(
  attacker: Unit,
  defender: Unit,
  ability: Ability | null,
  rng: PRNG
): number {
  // Implementation
}
```

### When to Document
- All exported functions
- Complex algorithms
- Non-obvious business logic
- Integration points

### Documentation Locations
- `/docs/app/` - Application guides
- `/docs/development/` - Development process
- `/docs/features/` - Feature specifications
- `/docs/planning/` - Planning documents
- Code comments - Implementation details

## Daily Workflow

### Morning
1. Pull latest `main`
2. Check Slack/Discord for updates
3. Review open PRs

### Before Starting Feature
1. Check existing branches
2. Communicate in standup
3. Create feature branch

### Before End of Day
1. Push WIP commits
2. Update status in team channel
3. Create draft PR if applicable

## Pull Request Process

### PR Title Format
Same as commit message format: `type: description`

### PR Description Template
```markdown
## Summary
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Testing
- [ ] Tests pass locally
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes
```

### Review Process
1. Create draft PR early
2. Request review when ready
3. Address feedback promptly
4. Squash commits before merging

## Handling Conflicts

### When You Have Conflicts
```bash
git checkout main
git pull origin main
git checkout your-branch
git rebase main
# Fix conflicts
git add .
git rebase --continue
```

### Preventing Conflicts
- Keep branches short-lived
- Communicate about shared files
- Rebase frequently
- Use feature flags for long-running work

## Emergency Procedures

### Accidental Commit to Main
```bash
# Create backup branch
git branch backup-main
# Reset main to origin
git reset --hard origin/main
# Cherry-pick your commit to feature branch
git checkout -b feature/your-feature
git cherry-pick backup-main
```

### Lost Work Recovery
```bash
# Check reflog
git reflog
# Find your commit
git checkout <commit-hash>
# Create branch from it
git checkout -b recovery-branch
```

---

**Remember:** Communication prevents conflicts. When in doubt, ask the team!