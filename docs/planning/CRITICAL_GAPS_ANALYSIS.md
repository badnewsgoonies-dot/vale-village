# Critical Gaps Analysis - Vale Chronicles V2

**Date:** November 19, 2025  
**Focus:** Equipment Rewards, Shop/Equip Integration, Abilities/Djinn Updates

---

## 🚨 CRITICAL GAPS IDENTIFIED

### 1. Equipment Rewards: Missing 4 Unique Items

**Current State:**
- **Houses with equipment:** 13/20 (65%)
- **Houses with NO equipment:** 7/20 (35%)
  - House 1: None (Djinn only)
  - House 5: None (recruit only)
  - House 8: None (Djinn + recruit)
  - House 10: None (progression house)
  - House 12: None (Djinn only)
  - House 18: None (Djinn only)
  - Training Dummy: None (expected)

**Required:** 20 unique items (one per house)

**Current Equipment Distribution:**
```
Fixed Items (9):
- H2: bronze-sword
- H3: iron-armor
- H4: magic-rod
- H6: steel-helm
- H9: battle-axe
- H11: silver-armor
- H14: hyper-boots
- H16: mythril-blade
- H17: dragon-scales

Choice Items (5 houses):
- H7: steel-sword, battle-axe, crystal-rod (3 options)
- H13: silver-blade, great-axe, zodiac-wand (3 options)
- H15: tempest-spear, mythril-armor, elemental-star (3 options)
- H19: gaia-blade, titans-axe, staff-of-ages (3 options)
- H20: sol-blade, titans-axe, staff-of-ages, cosmos-shield (4 options)
```

**Missing Items Needed:**
- House 1: Need 1 item (starter weapon/armor)
- House 5: Need 1 item (mid-tier equipment)
- House 8: Need 1 item (mid-tier equipment)
- House 10: Need 1 item (mid-tier equipment)
- House 12: Need 1 item (high-tier equipment)
- House 18: Need 1 item (legendary equipment)

**Recommendations:**
```typescript
// House 1: Starter equipment (Isaac's first upgrade)
equipment: { type: 'fixed', itemId: 'wooden-sword' } // or 'leather-vest'

// House 5: Mid-tier weapon/armor
equipment: { type: 'fixed', itemId: 'iron-sword' } // or 'bronze-armor'

// House 8: Mid-tier equipment
equipment: { type: 'fixed', itemId: 'steel-armor' } // or 'iron-helm'

// House 10: Mid-tier equipment
equipment: { type: 'fixed', itemId: 'silver-circlet' } // or 'steel-greaves'

// House 12: High-tier equipment (T2 Djinn milestone)
equipment: { type: 'fixed', itemId: 'mythril-crown' } // or 'valkyrie-mail'

// House 18: Legendary equipment (T3 Djinn milestone)
equipment: { type: 'fixed', itemId: 'oracles-crown' } // or 'glory-helm'
```

**Action Items:**
1. ✅ Add equipment rewards to houses 1, 5, 8, 10, 12, 18
2. ✅ Verify all 20 items are unique (no duplicates)
3. ✅ Update encounter progression tests to validate equipment rewards
4. ✅ Ensure equipment progression makes sense (tier-appropriate)

---

### 2. Shop/Equip Screen Integration Issues

**Current Implementation:**
- ✅ `ShopEquipScreen` component exists (`ShopEquipScreen.tsx`)
- ✅ Shop tab integrated with `ShopService`
- ✅ Equip tab integrated with `updateTeamUnits`
- ✅ State management via Zustand store

**Potential Issues:**

#### 2.1 State Update Propagation

**Issue:** Equipment changes may not trigger UI updates properly

**Check Points:**
```typescript
// In ShopEquipScreen.tsx
const handleEquip = (slot: EquipmentSlot, item: Equipment | null) => {
  if (!selectedUnit) return;
  
  const updatedUnit = updateUnit(selectedUnit, {
    equipment: { ...selectedUnit.equipment, [slot]: item },
  });
  
  updateTeamUnits([updatedUnit]); // ✅ Updates Zustand store
  // ❓ Does this trigger React re-render?
  // ❓ Does UnitCard in battle update?
  // ❓ Do effective stats recalculate?
};
```

**Verification Needed:**
- [ ] Equipment changes in ShopEquipScreen update battle UI
- [ ] Unit stats recalculate when equipment changes
- [ ] Equipment changes persist across save/load
- [ ] Equipment changes reflect in battle (effective stats)

#### 2.2 Shop Integration with Game Flow

**Current Flow:**
```typescript
// App.tsx
{mode === 'shop' && (
  <ShopEquipScreen 
    shopId={currentShopId || undefined} 
    onClose={() => setMode('overworld')} 
  />
)}
```

**Issues:**
- ✅ Shop triggers work (`handleTrigger` in `gameFlowSlice.ts`)
- ✅ Shop mode sets correctly
- ❓ Shop items unlock based on story flags (needs verification)
- ❓ Shop items persist after purchase (needs verification)

**Action Items:**
1. ✅ Verify shop purchases update inventory
2. ✅ Verify shop purchases update gold
3. ✅ Verify shop items unlock correctly
4. ✅ Test shop → equip → battle flow

---

### 3. Abilities & Djinn Updates

**Current Implementation:**
- ✅ `mergeDjinnAbilitiesIntoUnit()` called on Djinn activation
- ✅ `mergeDjinnAbilitiesIntoUnit()` called on Djinn recovery
- ✅ `getDjinnGrantedAbilitiesForUnit()` filters by Djinn state
- ✅ `calculateEffectiveStats()` recalculates when Djinn state changes

**Potential Issues:**

#### 3.1 UI Ability List Updates

**Issue:** Battle UI may not show updated abilities when Djinn state changes

**Current Code:**
```typescript
// QueueBattleView.tsx
const lockedDjinnAbilitiesForCurrentUnit = currentUnit
  ? getLockedDjinnAbilityMetadataForUnit(currentUnit, battle.playerTeam)
  : [];

// UnitCard.tsx - Need to check if abilities list updates
const availableAbilities = unit.abilities.filter(ability => 
  unit.unlockedAbilityIds.includes(ability.id)
);
```

**Verification Needed:**
- [ ] When Djinn activated → abilities removed from UI immediately
- [ ] When Djinn recovers → abilities added back to UI
- [ ] Locked abilities show grayed out with tooltip
- [ ] Ability list updates without battle restart

#### 3.2 Effective Stats Updates

**Issue:** Stats may not update in UI when Djinn state changes

**Current Code:**
```typescript
// QueueBattleService.ts - Djinn activation
const unitsWithUpdatedAbilities = updatedTeam.units.map(unit =>
  mergeDjinnAbilitiesIntoUnit(unit, updatedTeam)
);

// UnitCard.tsx - Need to check if stats recalculate
const effectiveStats = calculateEffectiveStats(unit, battle.playerTeam);
```

**Verification Needed:**
- [ ] When Djinn activated → stats decrease in UI
- [ ] When Djinn recovers → stats increase in UI
- [ ] HP clamped correctly when max HP changes
- [ ] Stat changes visible in battle log

#### 3.3 Battle Log Events

**Issue:** Battle log may not show Djinn state change events

**Current Code:**
```typescript
// QueueBattleService.ts
const standbyEvents = buildDjinnStateChangeEvents(
  preBonuses,
  postBonuses,
  updatedTeam.units,
  'djinn-standby',
  state.queuedDjinn
);
events.push(...standbyEvents);
```

**Verification Needed:**
- [ ] Battle log shows "Djinn activated" messages
- [ ] Battle log shows stat change messages
- [ ] Battle log shows ability lock/unlock messages
- [ ] Battle log shows Djinn recovery messages

**Action Items:**
1. ✅ Test Djinn activation → verify abilities removed from UI
2. ✅ Test Djinn recovery → verify abilities added back
3. ✅ Test stat changes → verify UI updates
4. ✅ Test battle log → verify events shown
5. ✅ Add E2E test for Djinn ability updates

---

## 🔍 INTEGRATION VERIFICATION CHECKLIST

### Equipment System Integration

- [ ] **Shop → Inventory:** Purchases add to inventory
- [ ] **Inventory → Equip:** Items can be equipped from inventory
- [ ] **Equip → Stats:** Equipment changes update unit stats
- [ ] **Stats → Battle:** Effective stats used in battle
- [ ] **Battle → Rewards:** Equipment rewards added to inventory
- [ ] **Rewards → Equip:** Can equip rewards immediately
- [ ] **Save → Load:** Equipment persists across saves

### Djinn System Integration

- [ ] **Djinn → Abilities:** Set Djinn grant abilities
- [ ] **Activation → Abilities:** Standby Djinn remove abilities
- [ ] **Recovery → Abilities:** Recovered Djinn restore abilities
- [ ] **Djinn → Stats:** Set Djinn grant stat bonuses
- [ ] **Activation → Stats:** Standby Djinn remove stat bonuses
- [ ] **Recovery → Stats:** Recovered Djinn restore stat bonuses
- [ ] **UI Updates:** Battle UI reflects ability/stats changes
- [ ] **Battle Log:** Events shown for state changes

### Shop/Equip Screen Integration

- [ ] **Shop Trigger:** Overworld triggers open shop
- [ ] **Shop Purchase:** Purchases update gold and inventory
- [ ] **Equip Tab:** Can switch between shop and equip tabs
- [ ] **Equip Item:** Equipment changes update unit stats
- [ ] **Unequip Item:** Unequipped items return to inventory
- [ ] **Unit Selector:** Can select different units
- [ ] **Stat Preview:** Shows stat changes before equipping
- [ ] **Close → Overworld:** Returns to overworld correctly

---

## 📋 PRIORITY FIXES

### High Priority (This Week)

1. **Add Missing Equipment Rewards**
   - Add 6 items to houses 1, 5, 8, 10, 12, 18
   - Verify all 20 items are unique
   - Update encounter progression tests

2. **Verify Shop/Equip Integration**
   - Test shop purchases update inventory
   - Test equipment changes update stats
   - Test equipment persists across saves

3. **Verify Djinn Ability Updates**
   - Test abilities removed on activation
   - Test abilities restored on recovery
   - Test UI updates in real-time

### Medium Priority (Next Week)

4. **Add E2E Tests**
   - Test equipment reward flow
   - Test shop → equip → battle flow
   - Test Djinn ability updates in battle

5. **Improve UI Feedback**
   - Show locked abilities with tooltips
   - Show stat changes in battle log
   - Show Djinn recovery countdown

### Low Priority (Future)

6. **Performance Optimization**
   - Cache effective stats calculations
   - Optimize ability list rendering
   - Reduce unnecessary re-renders

---

## 🧪 TESTING REQUIREMENTS

### Equipment Rewards Tests

```typescript
test('all 20 houses have equipment rewards', () => {
  const houses = Object.keys(ENCOUNTERS).filter(id => id.startsWith('house-'));
  const equipmentRewards = houses.map(id => ENCOUNTERS[id].reward.equipment);
  
  // All houses should have equipment (not 'none')
  equipmentRewards.forEach((equipment, index) => {
    expect(equipment.type).not.toBe('none');
  });
  
  // All items should be unique
  const itemIds = equipmentRewards
    .map(eq => eq.type === 'fixed' ? eq.itemId : eq.options)
    .flat();
  expect(new Set(itemIds).size).toBe(itemIds.length);
});
```

### Shop/Equip Integration Tests

```typescript
test('equipment changes update battle stats', async ({ page }) => {
  // 1. Open shop
  // 2. Purchase item
  // 3. Equip item
  // 4. Start battle
  // 5. Verify stats updated
});
```

### Djinn Ability Update Tests

```typescript
test('Djinn activation removes abilities from UI', async ({ page }) => {
  // 1. Start battle with Djinn-equipped unit
  // 2. Verify abilities visible
  // 3. Activate Djinn
  // 4. Verify abilities removed from UI
  // 5. Wait for recovery
  // 6. Verify abilities restored
});
```

---

## 📊 METRICS TO TRACK

### Equipment Rewards
- **Current:** 13/20 houses have equipment (65%)
- **Target:** 20/20 houses have equipment (100%)
- **Unique Items:** Verify all 20 items are unique

### Shop/Equip Integration
- **Shop Purchases:** Test 10+ purchases
- **Equipment Changes:** Test 20+ equip/unequip operations
- **State Persistence:** Test save/load 5+ times

### Djinn Ability Updates
- **Activation Updates:** Test 10+ Djinn activations
- **Recovery Updates:** Test 10+ Djinn recoveries
- **UI Update Latency:** Measure time to update (<100ms target)

---

**Next Steps:**
1. Add missing equipment rewards to encounters.ts
2. Create integration tests for shop/equip flow
3. Create E2E tests for Djinn ability updates
4. Verify all systems "talking" properly

