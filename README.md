# 🎮 Vale Chronicles V2

**Golden Sun-inspired Tactical RPG**

A clean architecture rebuild with React, TypeScript, Zustand, and Zod.

---

## 🚀 QUICK START

### **Development:**

```bash
cd apps/vale-v2
pnpm dev              # Start dev server
pnpm test             # Run tests
pnpm validate:data    # Validate game data
pnpm typecheck        # Type check
pnpm lint             # Lint code
```

### **For New Contributors:**

Read `apps/vale-v2/CLAUDE.md` for complete architecture guide and development workflow.

---

## 📚 DOCUMENTATION

### **Architecture:**
- `apps/vale-v2/CLAUDE.md` - Complete architecture guide and onboarding
- `VALE_CHRONICLES_ARCHITECTURE.md` - System architecture overview
- `ARCHITECTURE_REBUILD_SUMMARY.md` - Migration status

### **Design Docs:**
- `apps/vale-v2/docs/legacy/` - Archived design patterns
- `docs/adr/` - Architecture Decision Records
- `docs/architect/` - Technical specifications

---

## 🎯 GAME DESIGN

**Core Features:**
- **Battles:** 4v4 turn-based combat with elemental advantages
- **Units:** 10 recruitable, Levels 1-5, ability unlocks
- **Djinn:** 12 collectible (3 per element), team synergy bonuses
- **Equipment:** 4 slots (Weapon/Armor/Helm/Boots) - 58 items available
- **Progression:** XP-based leveling with curve [0, 100, 350, 850, 1850]

---

## 🧪 TESTING PHILOSOPHY

**Context-Aware Testing:**

```typescript
// ✅ GOOD TEST (Proves game works)
test('Level 1 loses to Boss, Level 5 wins', () => {
  // Tests real progression
});

// ❌ BAD TEST (Tests nothing)
test('function returns number', () => {
  // Useless!
});
```

---

## 📊 PROJECT STATUS

**Current Status:** Core systems (battle, progression, equipment, djinn) are functional.

**Migration Status:** ~80% complete - GameProvider → Zustand migration ongoing.

**Recent Work:** Post-battle rewards system, victory flow UI, battle turn handling improvements.

---

## 🏗️ ARCHITECTURE

**Clean Architecture with Strict Boundaries:**
- `apps/vale-v2/src/core/` - Pure TypeScript, no React
- `apps/vale-v2/src/ui/` - React components and UI logic
- `apps/vale-v2/src/data/` - Game data with Zod schemas
- `apps/vale-v2/src/infra/` - Infrastructure (save system)

**Key Principles:**
- No React in `core/**` (ESLint enforced)
- No `any` types in `core/**` (ESLint error level)
- Seeded RNG only (deterministic, reproducible)
- Zod is single source of truth for data validation

---

## 📦 ASSETS

**Sprites:** 2,572 sprites migrated to `apps/vale-v2/public/sprites/`
**Sprite Sheets:** 25 PNG sheets in `apps/vale-v2/sprite-sheets/`

---

## 📞 QUESTIONS?

See `apps/vale-v2/CLAUDE.md` for complete architectural guidance and development workflow.

---

**Built with clean architecture and context-aware testing**
