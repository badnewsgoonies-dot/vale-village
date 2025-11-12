# 🚀 START HERE - Vale Chronicles V2

**Quick start guide for Vale Chronicles V2**

---

## 📍 REPOSITORY

```
/home/geni/Documents/vale-village
```

**Project root. All development happens in `apps/vale-v2/`**

---

## 🚀 QUICK START

### **1. Navigate to V2:**

```bash
cd apps/vale-v2
```

### **2. Install Dependencies:**

```bash
pnpm install
```

### **3. Start Development:**

```bash
pnpm dev   # boots the queue battle sandbox via createTestBattle()
```

### **4. Run Tests:**

```bash
pnpm test  # executes suites under apps/vale-v2/tests
```

### **5. Validate Data:**

```bash
pnpm validate:data
```

---

## 📚 ONBOARDING

**Read this first:** `apps/vale-v2/CLAUDE.md`

This file contains:
- Complete architecture overview
- Development commands
- Testing philosophy
- Critical guardrails
- Game systems documentation
- Common development tasks

---

## 🎯 PROJECT STRUCTURE

```
vale-village/
├── apps/vale-v2/          # Main codebase
│   ├── src/
│   │   ├── core/          # Pure game logic (NO React)
│   │   ├── ui/            # React components
│   │   ├── data/          # Game data + Zod schemas
│   │   └── infra/         # Infrastructure
│   ├── public/            # Sprites and assets
│   ├── tests/             # Test suite
│   └── CLAUDE.md          # Architecture guide
├── docs/                  # Documentation
├── story/                 # Story content
└── mockups/               # Design mockups
```

---

## 🧪 TESTING

**Context-aware testing** - Tests prove gameplay works, not isolated unit tests.

```bash
pnpm test                  # Run all tests
pnpm test:watch           # Watch mode
```

---

## 📊 CURRENT STATUS

- ✅ Queue battle sandbox exercising battle/progression/equipment/djinn systems via Zustand slices
- ✅ Assets migrated (2,572 sprites, 25 sprite sheets)
- ✅ Equipment + data schemas validated (58 items)
- 🧭 Overworld/story screens are staged separately; the shipped app focuses on deterministic battle iteration
- 📝 Recent: Queue planning/execution flow, deterministic previews, storySlice event hooks, post-battle rewards UX

---

## 🎮 GAME FEATURES

- 10 recruitable units (Levels 1-20)
- 12 Djinn (3 per element)
- 58 equipment items (5 slots, unit-locked)
- Turn-based tactical combat
- Elemental advantages
- XP-based progression

---

**Ready to code? Read `apps/vale-v2/CLAUDE.md` for complete guidance!**
