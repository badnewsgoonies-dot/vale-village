# NO ITEMS DESIGN DECISION

**Date:** November 3, 2025  
**Status:** ✅ Final Design  
**Impact:** Architecture simplification

---

## DECISION

**No consumable items in Vale Chronicles.**

Shops sell **equipment only** (Weapons, Armor, Helms, Boots).

---

## RATIONALE

### Items Are Redundant

Items provide effects that **abilities already provide**:

| Item Effect | Ability Equivalent |
|-------------|-------------------|
| Herb (HP restore) | **Ply** (Mercury healing spell) |
| Potion (HP + PP) | **Wish** (Mercury group heal) |
| Antidote (cure poison) | **Cure** (Mercury status cure) |
| Elixir (full restore) | **Glacial Blessing** (Mercury ultimate heal) |

### Design Benefits

1. **Simpler systems** - No inventory management UI
2. **Strategic depth** - PP management matters more
3. **Clear roles** - Healers are essential (can't just buy potions)
4. **Less grinding** - Don't need gold for consumables
5. **Faster battles** - No item menu to navigate

---

## WHAT THIS MEANS

### ✅ INCLUDED
- **Equipment shops** - Buy/sell weapons, armor, helms, boots
- **Healing abilities** - Ply, Wish, Glacial Blessing
- **Status cure abilities** - Cure, Wish, Restore
- **Inn system** - Full HP/PP restore for 10 gold

### ❌ REMOVED
- ~~Item shops~~ (no consumables to buy)
- ~~Battle "Items" menu~~ (no items to use)
- ~~Inventory system~~ (equipment only, no item stacks)
- ~~Item drops from enemies~~ (equipment drops only)

---

## DOCUMENTATION UPDATES

Updated the following files:

1. **GAME_MECHANICS.md**
   - Section 14: Shop System (removed Item Shop, only Equipment Shop)
   - Section 4.3: Drop Rates (equipment only)
   - Section 5.2.6: PP Regen (removed item restoration)
   - Section 9.5: Status Effects (ability cures only)

2. **VICTORY_SUMMARY.md**
   - Architecture notes: "NO items in game" ✅

3. **NO_ITEMS_DESIGN_DECISION.md** (this document)

---

## HEALING BALANCE

### During Battle
- **Ply** (4 PP) - Single ally ~50 HP
- **Wish** (15 PP) - All allies ~90 HP
- **Glacial Blessing** (35 PP) - All allies ~140 HP + revive

### After Battle
- **Auto-restore** - Full PP (HP stays as-is)
- **Inn rest** - 10 gold for full HP/PP + status cure

### Strategic Impact
- Healers (Mia, Sheba) are **essential party members**
- Can't brute force with items - must manage PP strategically
- Long dungeon runs require careful resource management
- Inn placement becomes important game design decision

---

## IMPLEMENTATION STATUS

- [x] GAME_MECHANICS.md updated
- [x] VICTORY_SUMMARY.md updated
- [ ] Remove `src/types/Item.ts` (if exists)
- [ ] Remove item definitions from `src/data/shops.ts`
- [ ] Ensure battle UI has no "Items" button
- [ ] Verify shops only show equipment
- [ ] Update any mockups/UI designs

---

**This is a final design decision. Items will not be added to the game.**
