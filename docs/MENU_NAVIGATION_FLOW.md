# 🎮 Menu Navigation Flow - Vale Chronicles

**Status:** ✅ COMPLETE & IMPLEMENTED  
**Date:** November 3, 2025  
**Token Count:** ~957k remaining

---

## 🗺️ Complete Navigation Map

```
┌─────────────────────────────────────────────────────────────────┐
│                         TITLE SCREEN                             │
│                    [Press ENTER to start]                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                         INTRO SCREEN                             │
│                  (Story cutscene/dialogue)                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                       OVERWORLD SCREEN                           │
│                     (Main game screen)                           │
│                                                                   │
│  Controls:                                                        │
│  • WASD/Arrows: Move player                                      │
│  • SPACE: Interact with NPCs/objects                            │
│  • Q: Open Quest Log                                             │
│  • ESC: Open Main Menu ← NEW!                                   │
└─┬─────────┬─────────┬──────────┬─────────┬────────┬────────────┘
  │         │         │          │         │        │
  │(SPACE)  │(Q)      │(ESC)     │(Exit)   │(NPC)   │(Treasure)
  │on NPC   │         │          │trigger  │shop    │chest
  │         │         │          │         │        │
  ↓         ↓         ↓          ↓         ↓        ↓
DIALOGUE  QUEST   MAIN MENU   BATTLE    SHOP     [Inventory
          LOG                           SCREEN    updated]
          │         │          │         │
          │         │          │         │
          └─────────┴──────────┴─────────┘
                    │
              [RETURN button]
                    │
                    ↓
              OVERWORLD SCREEN
```

---

## 📋 Main Menu Hub (ESC Key)

**NEW FEATURE:** Pause menu accessible from overworld

```
┌───────────────────────────────────────────┐
│              MAIN MENU                     │
│  ┌─────────────────────────────────────┐  │
│  │ ✦ DJINN        [Manage Djinn]      │  │ → DJINN_MENU
│  │ ⚔ EQUIPMENT    [Equip Items]       │  │ → EQUIPMENT (1st unit)
│  │ ★ PARTY        [Manage Units]      │  │ → UNIT_COLLECTION
│  │ 📜 QUEST LOG   [View Quests]       │  │ → QUEST_LOG
│  │ ← RETURN       [Back to Game]      │  │ → OVERWORLD
│  └─────────────────────────────────────┘  │
└───────────────────────────────────────────┘
```

**Navigation:**
- All screens have **RETURN** button → back to OVERWORLD
- From EQUIPMENT → can switch units
- From UNIT_COLLECTION → can click "View Equipment" → EQUIPMENT

---

## 🎴 Djinn Menu

**Access:** Main Menu → DJINN or Direct keybind (could add)

```
┌─────────────────────────────────────────────┐
│  DJINN SCREEN                               │
│  ┌──────┬──────┬──────┬──────┐             │
│  │VENUS │ MARS │MERCU │JUPIT │             │
│  │  🪨  │  🔥  │  💧  │  ⚡  │             │
│  ├──────┼──────┼──────┼──────┤             │
│  │Flint │Corona│Fizz  │Breeze│             │
│  │Granite│Fury │Tonic │Squall│             │
│  └──────┴──────┴──────┴──────┘             │
│                                             │
│  [RETURN] → OVERWORLD/MAIN_MENU             │
└─────────────────────────────────────────────┘
```

**Features:**
- 4-column grid by element
- Party portraits show equipped Djinn
- Click to equip/unequip
- Psynergy lists update dynamically

---

## ⚔️ Equipment Screen

**Access:** Main Menu → EQUIPMENT

```
┌─────────────────────────────────────────────┐
│  EQUIPMENT SCREEN                           │
│  ┌─────────────┐  ┌──────────────────┐     │
│  │  Unit List  │  │  Equipment Slots │     │
│  │  • Isaac ✓  │  │  Weapon: [🗡️]   │     │
│  │  • Garet    │  │  Armor:  [🛡️]   │     │
│  │  • Ivan     │  │  Helm:   [⛑️]   │     │
│  │  • Mia      │  │  Boots:  [👢]   │     │
│  └─────────────┘  └──────────────────┘     │
│                                             │
│  [Stats Preview] ATK: +10  DEF: +5          │
│  [RETURN] → OVERWORLD                       │
└─────────────────────────────────────────────┘
```

**Features:**
- Click unit to switch
- Click equipment slot to unequip
- Click inventory item to equip
- Real-time stat preview
- Authentic equipment icons from `/sprites/icons/items/`

---

## 👥 Unit Collection (Party Management)

**Access:** Main Menu → PARTY

```
┌─────────────────────────────────────────────┐
│  PARTY MANAGEMENT                           │
│  Active Party: 4 / 10 units                 │
│  ┌────┬────┬────┬────┬────┐                │
│  │ 👤 │ 👤 │ 👤 │ 👤 │ 👤 │                │
│  │ ✓  │ ✓  │ ✓  │ ✓  │    │ ← Active      │
│  └────┴────┴────┴────┴────┘                │
│  ┌────┬────┬────┬────┬────┐                │
│  │ 👤 │ 👤 │ 👤 │ 👤 │ 👤 │                │
│  │    │    │    │    │    │ ← Bench        │
│  └────┴────┴────┴────┴────┘                │
│                                             │
│  [View Equipment] [RETURN]                  │
└─────────────────────────────────────────────┘
```

**Features:**
- Click unit to toggle active/bench (max 4 active)
- "View Equipment" → EQUIPMENT for selected unit
- Active party badge indicator
- Unit portraits with battle sprites

---

## 📜 Quest Log

**Access:** Q key from overworld OR Main Menu → QUEST LOG

```
┌─────────────────────────────────────────────┐
│  QUEST LOG                                  │
│  ┌──────────────────────────────────┐      │
│  │ • Wolf Pack (IN PROGRESS)        │      │
│  │   Defeat Alpha Wolf in forest    │      │
│  │                                   │      │
│  │ • Ancient Ruins (NOT STARTED)    │      │
│  │   Explore Sol Sanctum             │      │
│  │                                   │      │
│  │ • Mysterious Stranger (COMPLETE) │      │
│  │   Met Saturos in Vale             │      │
│  └──────────────────────────────────┘      │
│                                             │
│  [RETURN] → OVERWORLD                       │
└─────────────────────────────────────────────┘
```

---

## 🛒 Shop Screen

**Access:** Interact with shopkeeper NPC (SPACE)

```
┌─────────────────────────────────────────────┐
│  SHOP - Vale Village                        │
│  ┌──────────────┬──────────────────┐        │
│  │  BUY         │  SELL            │        │
│  │  🗡️ Sword 50g│  Iron Sword 25g │        │
│  │  🛡️ Shield 40│  Cloth 15g      │        │
│  │  💊 Herb 10g │                  │        │
│  └──────────────┴──────────────────┘        │
│                                             │
│  Gold: 100g                                 │
│  [RETURN] → OVERWORLD                       │
└─────────────────────────────────────────────┘
```

**Shop Types:**
- `item` - Consumables (herbs, potions)
- `equipment` - Weapons, armor
- `inn` - Rest & heal party

---

## ⚔️ Battle Screen

**Access:** Random encounter OR exit trigger on overworld

```
┌─────────────────────────────────────────────┐
│  BATTLE SCREEN                              │
│  [Background: Authentic GBA sprite]         │
│                                             │
│  ┌─ Enemies ────────────────────┐          │
│  │   🐺 Wolf    🐺 Wolf          │          │
│  └───────────────────────────────┘          │
│                                             │
│  ┌─ Party ──────────────────────┐          │
│  │   👤 Isaac  👤 Garet          │          │
│  └───────────────────────────────┘          │
│                                             │
│  [Combat Log]      [Action Menu]            │
│  Isaac attacks!    • ATTACK                 │
│  Wolf takes 25 HP  • PSYNERGY               │
│                    • DJINN                  │
│                    • DEFEND                 │
└─────────────────────────────────────────────┘
```

**Battle Flow:**
1. Turn order calculated (speed-based)
2. Player selects command → ability → target
3. Animation plays (damage numbers)
4. AI enemy turn
5. Repeat until victory/defeat
6. → REWARDS screen

**NEW:** Authentic backgrounds based on location:
- `vale_village` → Overworld.gif
- `forest_path` → Kolima_Forest.gif
- `ancient_ruins` → Sol_Sanctum.gif
- `desert` → Desert.gif
- `cave` → Cave.gif
- `boss_battle` → Final_Battle.gif

---

## 🎁 Rewards Screen

**Access:** After battle victory

```
┌─────────────────────────────────────────────┐
│  VICTORY!                                   │
│  ┌────────────────────────────────┐         │
│  │  💰 Gold:  50g                 │         │
│  │  ⭐ XP:    100                 │         │
│  │  🎁 Items: Herb x2             │         │
│  │                                │         │
│  │  LEVEL UP!                     │         │
│  │  Isaac reached Level 5!        │         │
│  │  • Learned: Ragnarok           │         │
│  │  • HP +12  ATK +3              │         │
│  └────────────────────────────────┘         │
│                                             │
│  [CONTINUE] → OVERWORLD                     │
└─────────────────────────────────────────────┘
```

**Animations:**
- Golden flash effect
- Level up celebration
- New ability reveal
- Sparkle particles

---

## 🎨 Sprite Integration Status

### ✅ IMPLEMENTED & VERIFIED

**Equipment Icons:**
- Path: `/sprites/icons/items/{category}/{name}.gif`
- Categories: armor, axes, boots, bracelets, circlets, crowns, gloves, helmets, light-blades, long-swords, maces, shields, staves
- Registry: `spriteRegistry.getEquipmentIcon(equipment)`
- Component: `<EquipmentIcon equipment={item} />`

**Battle Unit Sprites:**
- Path: `/sprites/battle/party/{unit}/{name}_{weapon}_{animation}.gif`
- Animations: Front, Back, Attack1, Attack2, CastFront1, CastBack1, DownedFront
- Registry: `spriteRegistry.getBattleSprite(unit, animation)`
- Component: `<BattleUnit unit={unit} animation="Front" />`

**Enemy Sprites:**
- Path: `/sprites/battle/enemies/{name}.gif`
- Single GIF per enemy (no animations)
- Auto-fallback in registry

**Djinn Icons:**
- Path: `/sprites/battle/djinn/{element}_Djinn_Front.gif`
- Elements: Venus, Mars, Mercury, Jupiter
- Registry: `spriteRegistry.getDjinnIcon(djinn)`

**Psynergy/Ability Icons:**
- Path: `/sprites/icons/psynergy/{ability}.gif`
- 100+ ability icons available
- Registry: `spriteRegistry.getAbilityIcon(abilityName)`

**Battle Backgrounds:**
- Path: `/sprites/backgrounds/gs1/{location}.gif`
- 72 authentic GBA backgrounds
- Applied via CSS `data-area` attribute

**Overworld Scenery:**
- Buildings: `/sprites/scenery/buildings/{town}/{name}.gif`
- Plants: `/sprites/scenery/plants/{name}.gif`
- Outdoor: `/sprites/scenery/outdoor/lg/{name}.gif`
- Applied via CSS background-image

---

## 🔧 Implementation Details

### Screen Router Configuration

**File:** `src/router/ScreenRouter.tsx`

```typescript
case 'MAIN_MENU':
  return (
    <MainMenu
      onNavigateToDjinn={() => actions.navigate({ type: 'DJINN_MENU' })}
      onNavigateToEquipment={() => {
        const firstUnitId = state.playerData.activePartyIds[0];
        actions.navigate({ type: 'EQUIPMENT', unitId: firstUnitId });
      }}
      onNavigateToParty={() => actions.navigate({ type: 'UNIT_COLLECTION' })}
      onNavigateToQuestLog={() => actions.navigate({ type: 'QUEST_LOG' })}
      onResume={() => actions.navigate({ type: 'OVERWORLD' })}
    />
  );
```

### Keyboard Controls

**Overworld Screen:**
```typescript
case 'Escape':
  if (showDialogue) {
    closeDialogue();
  } else {
    actions.navigate({ type: 'MAIN_MENU' }); // NEW!
  }
  break;
```

### Battle Background System

**CSS (BattleScreen.css):**
```css
.battle-screen[data-area="vale_village"] {
  background-image: url('/sprites/backgrounds/gs1/Overworld.gif');
}

.battle-screen[data-area="forest_path"] {
  background-image: url('/sprites/backgrounds/gs1/Kolima_Forest.gif');
}
```

**Component (BattleScreen.tsx):**
```tsx
<div 
  className="battle-screen"
  data-area={state.currentLocation || 'vale_village'}
>
```

---

## 📊 Navigation Statistics

**Total Screens:** 11
- Title
- Intro
- Overworld (hub)
- Main Menu (NEW!)
- Djinn Menu
- Equipment
- Unit Collection
- Quest Log
- Shop
- Battle
- Rewards

**Navigation Paths:** 18 unique routes
**Keyboard Shortcuts:**
- ESC → Main Menu (NEW!)
- Q → Quest Log
- SPACE → Interact/Select
- WASD/Arrows → Movement

**Return Points:** All screens navigate back to Overworld (central hub)

---

## 🎯 User Experience Flow

### **Typical Play Session:**

1. **Title Screen** → Press ENTER
2. **Intro** → Watch story (auto-advance)
3. **Overworld** → Explore Vale Village
4. Press **ESC** → **Main Menu** appears
5. Select **DJINN** → Equip Flint to Isaac
6. Press **RETURN** → Back to Overworld
7. Walk to NPC → Press **SPACE** → **Shop** opens
8. Buy healing herbs → **RETURN** to Overworld
9. Exit Vale → **Battle** triggers (random encounter)
10. Defeat enemies → **Rewards** screen
11. **CONTINUE** → Back to Overworld
12. Press **Q** → **Quest Log** (check objectives)
13. **RETURN** → Continue exploration

---

## ✅ Implementation Checklist

- [x] Main Menu component created
- [x] Main Menu CSS (Golden Sun style)
- [x] MAIN_MENU screen type added
- [x] Router integration complete
- [x] ESC key wired to open menu
- [x] All navigation callbacks implemented
- [x] Battle backgrounds added (72 GBA sprites)
- [x] data-area attribute applied
- [x] Equipment icons verified (registry working)
- [x] Ability icons verified (2500+ sprites available)
- [x] Build successful (0 errors)
- [x] Documentation complete

---

## 🚀 Next Steps (Future Enhancements)

**Potential Additions:**
1. **Save/Load Menu** - Add to Main Menu
2. **Settings Screen** - Audio, controls, display
3. **Djinn Hotkey** - Press "D" for quick access
4. **Equipment Hotkey** - Press "E" for quick access
5. **Battle Animations** - Screen shake, flash effects
6. **Psynergy Visual Effects** - Ability animations
7. **Transition Effects** - Battle swirl, screen wipes
8. **Sound Effects** - Menu beeps, battle whoosh
9. **Background Music** - Area themes, battle music
10. **Touch Controls** - Mobile support

---

**Status:** 🟢 FULLY OPERATIONAL  
**Build:** ✅ Compiles (496 modules, 340KB)  
**Token Budget:** 957k remaining  
**Commit Ready:** YES
