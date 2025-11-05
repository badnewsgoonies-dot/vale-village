# IMPLEMENTATION PROMPTS FOR VALE CHRONICLES FEATURES

**Date:** November 4, 2025  
**Purpose:** Self-contained implementation instructions for each missing feature  
**Audience:** External coder implementing features independently  

---

## HOW TO USE THIS DOCUMENT

Each prompt is **completely self-contained** and can be sent to a coder as a standalone task. They include:

- **Context**: What exists and what's missing
- **Specification**: Exact behavior required
- **Files to modify**: Specific file paths and functions
- **Acceptance criteria**: How to verify it works
- **Estimated time**: Complexity assessment

---

## TIER 1: QUICK WINS (Ready to implement immediately)

### PROMPT 1: Critical Hit Visual Feedback

**Task**: Add visual feedback for critical hits in battle

**Context**:
Critical hits are already fully implemented in the codebase:
- `checkCriticalHit()` function exists in `src/types/Battle.ts` (line 128)
- 2.0x damage multiplier is applied (Battle.ts:260)
- `isCritical` flag is returned in `ActionResult`
- The ONLY missing piece is visual feedback in the UI

**What You Need to Do**:
1. Modify `src/components/battle/BattleScreen.tsx`:
   - When displaying combat log messages, check if action result has `critical: true`
   - Add "Critical Hit!" text in red/yellow color
   - Optional: Add screen shake effect (CSS animation)

2. Create or modify `src/components/battle/DamageNumber.tsx`:
   - Accept `isCritical` prop
   - If critical:
     - Make damage number larger (150% size)
     - Use red/orange color instead of white
     - Add pulsing animation

**Acceptance Criteria**:
- [ ] Critical hits show "Critical Hit!" message in combat log
- [ ] Critical damage numbers are visibly different (larger, colored)
- [ ] Normal hits remain unchanged
- [ ] Test with high SPD unit (higher crit chance) vs low SPD unit

**Files to Modify**:
- `src/components/battle/BattleScreen.tsx` (combat log display)
- `src/components/battle/DamageNumber.tsx` (if exists, or create it)
- `src/components/battle/BattleScreen.css` (add critical hit styling)

**Estimated Time**: 2-3 hours

---

### PROMPT 2: Element Advantage Messages

**Task**: Display "Super effective!" or "Not very effective" messages when element advantage applies

**Context**:
Element advantage system is 100% implemented:
- `getElementModifier()` exists in `src/types/Element.ts` (line 25)
- Already integrated into `calculatePsynergyDamage()` (Battle.ts:187)
- Returns 1.5x for advantage, 0.67x for disadvantage, 1.0x for neutral
- The ONLY missing piece is UI messaging

**Element Matchups** (from GAME_MECHANICS.md):
- Venus (Earth) → Jupiter (Wind): 1.5x (Strong)
- Mars (Fire) → Venus (Earth): 1.5x (Strong)
- Mercury (Water) → Mars (Fire): 1.5x (Strong)
- Jupiter (Wind) → Mercury (Water): 1.5x (Strong)
- Reverse matchups: 0.67x (Weak)

**What You Need to Do**:
1. Modify `src/types/Battle.ts` in the `executeAbility()` function:
   - After calculating damage with `calculatePsynergyDamage()`, check the element modifier
   - Add effectiveness text to the action result message

2. Update action result message based on modifier:
   ```typescript
   if (elementModifier > 1.0) {
     message += ' Super effective!';
   } else if (elementModifier < 1.0) {
     message += ' Not very effective...';
   }
   ```

3. Optional: Color-code messages in `BattleScreen.tsx`:
   - Green for super effective
   - Gray/blue for not very effective

**Acceptance Criteria**:
- [ ] Cast Venus ability on Jupiter enemy → Shows "Super effective!"
- [ ] Cast Venus ability on Mars enemy → Shows "Not very effective..."
- [ ] Cast Venus ability on Venus enemy → No message (neutral)
- [ ] Physical attacks (no element) → No message

**Files to Modify**:
- `src/types/Battle.ts` (executeAbility function, around line 253)
- `src/components/battle/BattleScreen.tsx` (optional: message coloring)

**Estimated Time**: 1-2 hours

---

### PROMPT 3: Battle Flee Button Hookup

**Task**: Wire up the Flee button in battle to actually attempt fleeing

**Context**:
Flee system is 90% complete:
- `attemptFlee()` function fully implemented in `src/types/Battle.ts` (line 378-417)
- Speed-based chance calculation works correctly
- Boss battle restriction works
- UI button exists but does nothing

**What You Need to Do**:
1. Modify `src/components/battle/BattleScreen.tsx`:
   - Find the Flee button in `CommandMenu` component
   - Add onClick handler that calls a new `handleFlee()` function

2. Implement `handleFlee()` function:
   ```typescript
   const handleFlee = () => {
     const battle = state.currentBattle;
     if (!battle) return;

     // Check if this is a boss battle (add flag to battle state if needed)
     const isBossBattle = false; // TODO: Get from battle state

     const result = attemptFlee(
       battle.playerTeam.units,
       battle.enemies,
       isBossBattle
     );

     if (result.isOk && result.value === true) {
       setCombatLog(prev => [...prev, 'Fled from battle!']);
       actions.navigate({ type: 'OVERWORLD' }); // Return to overworld
     } else if (result.isOk && result.value === false) {
       setCombatLog(prev => [...prev, 'Could not escape!']);
       advanceTurn(); // Failed flee ends player's turn
     } else if (result.isErr) {
       setCombatLog(prev => [...prev, result.error]); // "Cannot flee from boss!"
     }
   };
   ```

3. Add `isBossBattle` flag to battle state:
   - Modify `src/types/Battle.ts` BattleState interface
   - Add `isBossBattle?: boolean` property
   - Pass from boss encounter trigger in NewOverworldScreen.tsx

4. Disable Flee button visually if boss battle

**Acceptance Criteria**:
- [ ] Flee button works against normal enemies
- [ ] Success rate ~50% when speeds are equal
- [ ] Higher success rate when player is faster
- [ ] Shows "Fled from battle!" on success → returns to overworld
- [ ] Shows "Could not escape!" on failure → enemy gets turn
- [ ] Flee button disabled/grayed against boss
- [ ] Shows "Cannot flee from boss!" if clicked in boss battle

**Files to Modify**:
- `src/components/battle/BattleScreen.tsx` (add handleFlee function)
- `src/types/Battle.ts` (add isBossBattle to BattleState)
- `src/components/overworld/NewOverworldScreen.tsx` (pass isBossBattle flag)

**Estimated Time**: 3-4 hours

---

### PROMPT 4: Evasion & Dodge Mechanics

**Task**: Implement dodge chance calculation before damage is applied

**Context**:
Evasion properties exist but are never checked:
- `evasion` property defined on Equipment (Equipment.ts:29)
- Hyper Boots give +10 evasion
- Hermes' Sandals give +15 evasion
- NO dodge check happens anywhere in damage calculation

**Dodge Formula** (from GAME_MECHANICS.md):
```typescript
baseEvasion = 5%
equipmentEvasion = defender.equipment.boots?.evasion || 0
speedBonus = (defender.spd - attacker.spd) * 0.01  // 1% per SPD difference

totalEvasion = baseEvasion + (equipmentEvasion / 100) + speedBonus
finalEvasion = clamp(totalEvasion, 0%, 75%)  // Cap at 75% max

if (random() < finalEvasion) → DODGE! (no damage)
```

**What You Need to Do**:
1. Create `checkDodge()` function in `src/types/Battle.ts`:
   ```typescript
   export function checkDodge(
     attacker: Unit,
     defender: Unit,
     rng: RNG = globalRNG
   ): boolean {
     const BASE_EVASION = 0.05;
     const equipmentEvasion = defender.equipment.boots?.evasion || 0;
     const speedBonus = (defender.stats.spd - attacker.stats.spd) * 0.01;
     
     const totalEvasion = BASE_EVASION + (equipmentEvasion / 100) + speedBonus;
     const finalEvasion = Math.max(0, Math.min(0.75, totalEvasion));
     
     return rng.next() < finalEvasion;
   }
   ```

2. Integrate into `executeAbility()` function (Battle.ts):
   - BEFORE calculating damage, check dodge for each target
   - If dodged, return action result with `dodged: true` flag
   - Skip damage calculation for dodged targets

3. Update `ActionResult` interface:
   - Add `dodged?: boolean` property

4. Display "Miss!" message in BattleScreen.tsx when dodged

**Acceptance Criteria**:
- [ ] Units without boots have ~5% base dodge chance
- [ ] Hyper Boots (+10 evasion) → ~15% dodge (5% + 10%)
- [ ] Hermes' Sandals (+15 evasion) → ~20% dodge (5% + 15%)
- [ ] Fast units dodge more vs slow attackers
- [ ] Slow units dodge less vs fast attackers
- [ ] Dodge chance caps at 75% (can't reach 100%)
- [ ] Dodged attacks show "Miss!" message
- [ ] Dodged attacks deal 0 damage

**Files to Modify**:
- `src/types/Battle.ts` (add checkDodge, integrate into executeAbility)
- `src/components/battle/BattleScreen.tsx` (display "Miss!" message)

**Estimated Time**: 3-4 hours

---

### PROMPT 5: Status Effect Processing

**Task**: Implement poison/burn damage and freeze/paralyze turn effects

**Context**:
Status effect types exist but are never processed:
- `StatusEffect` interface defined (Unit.ts:54)
- `unit.statusEffects: StatusEffect[]` property exists
- Duration countdown exists (Battle.ts:436)
- NO damage/effect processing happens each turn

**Status Effect Specs** (from GAME_MECHANICS.md):
- **Poison**: 8% max HP damage per turn, lasts 5 turns, ticks at start of turn
- **Burn**: 10% max HP damage per turn, lasts 3 turns, ticks at start of turn
- **Freeze**: Skip turn, 30% break chance per turn, lasts until broken
- **Paralyze**: 50% chance action fails, lasts 2 turns, checked before action

**What You Need to Do**:
1. Create `processStatusEffects()` function in `src/types/Battle.ts`:
   ```typescript
   export function processStatusEffectTick(
     unit: Unit,
     rng: RNG = globalRNG
   ): { damage: number, messages: string[] } {
     let totalDamage = 0;
     const messages: string[] = [];

     for (const effect of unit.statusEffects) {
       if (effect.type === 'poison') {
         const damage = Math.floor(unit.maxHp * 0.08);
         unit.takeDamage(damage);
         totalDamage += damage;
         messages.push(`${unit.name} takes ${damage} poison damage!`);
       } else if (effect.type === 'burn') {
         const damage = Math.floor(unit.maxHp * 0.10);
         unit.takeDamage(damage);
         totalDamage += damage;
         messages.push(`${unit.name} takes ${damage} burn damage!`);
       } else if (effect.type === 'freeze') {
         const breakChance = 0.3;
         if (rng.next() < breakChance) {
           messages.push(`${unit.name} broke free from freeze!`);
           // Remove freeze effect (will happen in duration countdown)
           effect.duration = 0;
         } else {
           messages.push(`${unit.name} is frozen and cannot act!`);
         }
       }
     }

     return { damage: totalDamage, messages };
   }
   ```

2. Call `processStatusEffectTick()` in `BattleScreen.tsx`:
   - At start of each unit's turn (before they select action)
   - Display messages in combat log
   - If frozen, skip turn entirely

3. Add paralyze check before executing action:
   ```typescript
   function checkParalyzeFailure(unit: Unit, rng: RNG): boolean {
     const paralyzed = unit.statusEffects.find(e => e.type === 'paralyze');
     if (paralyzed && rng.next() < 0.5) {
       return true; // Action fails
     }
     return false;
   }
   ```

4. Update healing abilities to cure status effects:
   - Ply cures burn
   - Wish cures poison
   - Restore cures paralyze

**Acceptance Criteria**:
- [ ] Poisoned units take 8% max HP damage at start of their turn
- [ ] Burned units take 10% max HP damage at start of their turn
- [ ] Frozen units skip their turn completely
- [ ] Frozen units have 30% chance to break free each turn
- [ ] Paralyzed units have 50% chance action fails
- [ ] Status effects countdown and expire after duration
- [ ] Combat log shows all status effect messages
- [ ] Cure abilities remove appropriate status effects

**Files to Modify**:
- `src/types/Battle.ts` (add processStatusEffectTick, checkParalyzeFailure)
- `src/components/battle/BattleScreen.tsx` (call processing at turn start)
- `src/data/abilities.ts` (add cure properties to healing abilities)

**Estimated Time**: 6-8 hours

---

### PROMPT 6: PP Regeneration After Battle

**Task**: Ensure PP is restored to full after battle victory

**Context**:
PP restoration function exists but may not be called:
- `restorePPAfterBattle()` function exists (Battle.ts:482)
- Sets `unit.currentPp = unit.maxPp` for all units
- Called in `processBattleVictory()` (Battle.ts:529)
- Need to verify UI victory flow actually calls this

**What You Need to Do**:
1. Trace battle victory flow in `BattleScreen.tsx`:
   - Find where battle ends with victory
   - Ensure `processBattleVictory()` is called
   - Or manually call `restorePPAfterBattle(battle.playerTeam.units)`

2. Add console log to verify PP restoration:
   ```typescript
   console.log('Before victory:', units.map(u => `${u.name} PP: ${u.currentPp}/${u.maxPp}`));
   restorePPAfterBattle(units);
   console.log('After victory:', units.map(u => `${u.name} PP: ${u.currentPp}/${u.maxPp}`));
   ```

3. Test sequence:
   - Start battle with 4 units
   - Cast abilities to reduce PP
   - Win battle
   - Start next battle
   - Verify all units have full PP

4. If NOT being called, add call to victory handler

**Acceptance Criteria**:
- [ ] Win battle with depleted PP (units at 50% PP)
- [ ] After victory, all units have full PP
- [ ] Enter next battle → all units still have full PP
- [ ] HP does NOT restore (only PP)

**Files to Modify**:
- `src/components/battle/BattleScreen.tsx` (victory handler)
- Possibly `src/context/GameProvider.tsx` (if victory processed there)

**Estimated Time**: 1-2 hours (verification + potential fix)

---

### PROMPT 7: Equipment Special Effects

**Task**: Implement special equipment effects that aren't just stat bonuses

**Context**:
Equipment has special properties that aren't processed:
- `unlocksAbility` - Sol Blade grants "Megiddo" ability
- `elementalResist` - Dragon Scales reduce elemental damage by 20%
- `alwaysFirstTurn` - Hermes' Sandals (ALREADY WORKING)
- Equipment PP bonus - Oracle's Crown (+15 PP) not added to max PP

**What You Need to Do**:
1. **Ability Unlocking** - Modify `Unit.calculateStats()` or create separate function:
   ```typescript
   getAvailableAbilities(unit: Unit): Ability[] {
     const baseAbilities = unit.abilities.filter(a => 
       unit.unlockedAbilityIds.has(a.id)
     );
     
     // Add equipment-granted abilities
     const equipmentAbilities: Ability[] = [];
     for (const item of Object.values(unit.equipment)) {
       if (item?.unlocksAbility) {
         const ability = getAbilityById(item.unlocksAbility);
         if (ability) equipmentAbilities.push(ability);
       }
     }
     
     return [...baseAbilities, ...equipmentAbilities];
   }
   ```

2. **Elemental Resist** - Modify `calculatePsynergyDamage()` in Battle.ts:
   ```typescript
   // After calculating base damage:
   let damage = Math.floor(
     (basePower + magicPower - magicDefense) * elementModifier * getRandomMultiplier(rng)
   );
   
   // Apply elemental resist from armor
   const resist = defender.equipment.armor?.elementalResist || 0;
   if (ability.element && resist > 0) {
     damage = Math.floor(damage * (1 - resist));
   }
   ```

3. **PP Bonus** - Modify `Unit.calculateStats()` (Unit.ts ~line 170):
   ```typescript
   // After calculating equipment bonuses:
   const equipmentPPBonus = equipment.helm?.statBonus.pp || 0;
   
   // Add to final PP calculation
   const finalPP = Math.floor(
     (base.pp + levelBonuses.pp + equipmentBonuses.pp + equipmentPPBonus + djinnSynergy.pp) * ppMultiplier
   );
   ```

**Acceptance Criteria**:
- [ ] Equip Sol Blade → Unit can use "Megiddo" ability in battle
- [ ] Unequip Sol Blade → "Megiddo" removed from ability list
- [ ] Equip Dragon Scales → Elemental abilities deal 20% less damage
- [ ] Equip Oracle's Crown → Unit max PP increases by 15
- [ ] Hermes' Sandals still works (always first turn)

**Files to Modify**:
- `src/types/Unit.ts` (getAvailableAbilities, calculateStats for PP)
- `src/types/Battle.ts` (calculatePsynergyDamage for resist)
- `src/data/abilities.ts` (define Megiddo ability if doesn't exist)

**Estimated Time**: 4-5 hours

---

## TIER 2: NEEDS MINOR REFACTORING

### PROMPT 8: Shop Buy/Sell Refactoring

**Task**: Remove item/consumable code from shop and make equipment-only shop functional

**Context**:
Shop system is partially broken after removing consumable items:
- ShopScreen.tsx has references to removed ITEMS constant
- Quantity controls for items still exist (not needed for equipment)
- Buy/sell logic exists but may not work properly

**What You Need to Do**:
1. Refactor `ShopScreen.tsx` (296 lines):
   - Remove all `shopType === 'item'` conditionals
   - Remove quantity state (`const [quantity, setQuantity]`)
   - Remove `getItemById()` calls
   - Simplify to equipment-only logic

2. Update buy handler:
   ```typescript
   const handleBuy = () => {
     if (!selectedItem) return;
     
     const equipment = getEquipmentById(selectedItem);
     if (!equipment) return;
     
     if (state.playerData.gold < equipment.cost) {
       // Show error: not enough gold
       return;
     }
     
     actions.buyEquipment(equipment);
     setSelectedItem(null);
   };
   ```

3. Update sell handler:
   ```typescript
   const handleSell = () => {
     if (!selectedItem) return;
     
     const equipment = getEquipmentById(selectedItem);
     if (!equipment) return;
     
     const sellPrice = Math.floor(equipment.cost * 0.5); // 50% buyback
     actions.sellEquipment(selectedItem, sellPrice);
     setSelectedItem(null);
   };
   ```

4. Verify `buyEquipment` action in GameProvider:
   - Deducts gold
   - Adds equipment to inventory
   - Shows feedback

5. Verify `sellEquipment` action:
   - Removes equipment from inventory
   - Adds gold
   - Shows feedback

**Acceptance Criteria**:
- [ ] Shop displays only equipment (no items)
- [ ] Can buy equipment when have enough gold
- [ ] Gold is deducted on purchase
- [ ] Equipment appears in inventory
- [ ] Can sell equipment from inventory
- [ ] Get 50% of original cost back
- [ ] Can't buy if not enough gold (shows error)
- [ ] Can switch between Buy/Sell tabs

**Files to Modify**:
- `src/components/shop/ShopScreen.tsx` (major refactor, remove ~100 lines)
- `src/context/GameProvider.tsx` (verify buy/sell actions work)

**Estimated Time**: 4-6 hours

---

### PROMPT 9: NPC Dialogue Display Component

**Task**: Create a proper dialogue box UI for NPC conversations

**Context**:
Basic dialogue state exists but no UI:
- `showDialogue` state in NewOverworldScreen.tsx
- NPC interaction triggers dialogue
- Currently just displays as raw text or alert
- Need proper dialogue box with typewriter effect

**What You Need to Do**:
1. Create `src/components/overworld/DialogueBox.tsx`:
   ```typescript
   interface DialogueBoxProps {
     text: string;
     onClose: () => void;
     npcName?: string;
   }

   export const DialogueBox: React.FC<DialogueBoxProps> = ({ 
     text, 
     onClose,
     npcName 
   }) => {
     const [displayedText, setDisplayedText] = useState('');
     const [isComplete, setIsComplete] = useState(false);

     useEffect(() => {
       // Typewriter effect
       let index = 0;
       const interval = setInterval(() => {
         setDisplayedText(text.substring(0, index + 1));
         index++;
         if (index >= text.length) {
           clearInterval(interval);
           setIsComplete(true);
         }
       }, 30); // 30ms per character

       return () => clearInterval(interval);
     }, [text]);

     const handleClick = () => {
       if (!isComplete) {
         // Skip animation, show full text
         setDisplayedText(text);
         setIsComplete(true);
       } else {
         // Close dialogue
         onClose();
       }
     };

     return (
       <div className="dialogue-box-overlay" onClick={handleClick}>
         <div className="dialogue-box">
           {npcName && <div className="dialogue-npc-name">{npcName}</div>}
           <div className="dialogue-text">{displayedText}</div>
           {isComplete && (
             <div className="dialogue-continue-indicator">
               ▼ Click to continue
             </div>
           )}
         </div>
       </div>
     );
   };
   ```

2. Create `src/components/overworld/DialogueBox.css`:
   - Style dialogue box (positioned at bottom of screen)
   - Golden Sun-style brown box with border
   - White text, readable font
   - Pulsing continue indicator

3. Integrate into `NewOverworldScreen.tsx`:
   ```typescript
   return (
     <div className="overworld-screen">
       {/* Map rendering */}
       
       {showDialogue && (
         <DialogueBox 
           text={showDialogue}
           onClose={() => setShowDialogue(null)}
           npcName={currentNPC?.name}
         />
       )}
     </div>
   );
   ```

**Acceptance Criteria**:
- [ ] Dialogue appears in box at bottom of screen
- [ ] Text scrolls in typewriter style (30ms per char)
- [ ] Click once to skip animation (show full text)
- [ ] Click again to close dialogue
- [ ] Shows "▼ Click to continue" when animation complete
- [ ] NPC name displays if provided
- [ ] Dialogue box blocks input while active

**Files to Create**:
- `src/components/overworld/DialogueBox.tsx` (new component)
- `src/components/overworld/DialogueBox.css` (new styles)

**Files to Modify**:
- `src/components/overworld/NewOverworldScreen.tsx` (integrate component)

**Estimated Time**: 4-5 hours

---

### PROMPT 10: Treasure Chest System

**Task**: Implement treasure chest opening with gold and equipment rewards

**Context**:
State tracking exists but no content or UI:
- `openTreasureChest()` action in GameContext
- `openedChests: Set<ChestId>` in AreaState
- `isTreasureAtPosition()` helper exists
- NO chest data, NO opening UI, NO rewards

**What You Need to Do**:
1. Add chest data to areas in `src/data/areas.ts`:
   ```typescript
   treasureChests: [
     {
       id: 'vale_village_chest_1',
       position: { x: 15, y: 20 },
       contents: {
         gold: 100,
         equipment: ['wooden_sword'] // equipment ID
       }
     },
     {
       id: 'forest_chest_1',
       position: { x: 8, y: 12 },
       contents: {
         gold: 250,
       }
     },
     // etc.
   ]
   ```

2. Create `src/components/overworld/ChestOpenScreen.tsx`:
   ```typescript
   interface ChestOpenScreenProps {
     chestId: ChestId;
     contents: ChestContents;
     onClose: () => void;
   }

   export const ChestOpenScreen: React.FC<ChestOpenScreenProps> = ({
     chestId,
     contents,
     onClose
   }) => {
     const { actions } = useGame();

     useEffect(() => {
       // Add rewards to player
       if (contents.gold) {
         actions.addGold(contents.gold);
       }
       if (contents.equipment) {
         contents.equipment.forEach(eqId => {
           const eq = getEquipmentById(eqId);
           if (eq) actions.addToInventory(eq);
         });
       }

       // Mark chest as opened
       actions.openTreasureChest(chestId);
     }, []);

     return (
       <div className="chest-open-screen">
         <h2>Treasure Chest</h2>
         <div className="chest-contents">
           {contents.gold && <p>Found {contents.gold} gold!</p>}
           {contents.equipment && contents.equipment.map(eqId => (
             <p key={eqId}>Found {getEquipmentById(eqId)?.name}!</p>
           ))}
         </div>
         <button onClick={onClose}>Close</button>
       </div>
     );
   };
   ```

3. Integrate into NewOverworldScreen.tsx:
   - Detect when player walks on chest position
   - Check if chest already opened (areaState.openedChests)
   - If not opened, show ChestOpenScreen

4. Update GameProvider actions:
   - Add `addGold(amount)` action if doesn't exist
   - Add `addToInventory(equipment)` action if doesn't exist

**Acceptance Criteria**:
- [ ] Walk over chest → ChestOpenScreen appears
- [ ] Screen shows gold/equipment found
- [ ] Gold added to player total
- [ ] Equipment added to inventory
- [ ] Chest marked as opened
- [ ] Walk over same chest again → nothing happens
- [ ] Chest sprite changes to open state (if sprites exist)

**Files to Create**:
- `src/components/overworld/ChestOpenScreen.tsx`
- `src/components/overworld/ChestOpenScreen.css`

**Files to Modify**:
- `src/data/areas.ts` (add treasureChests data)
- `src/components/overworld/NewOverworldScreen.tsx` (detect chest interaction)
- `src/context/GameProvider.tsx` (add addGold, addToInventory actions)

**Estimated Time**: 5-6 hours

---

### PROMPT 11: Equipment Drops from Battles

**Task**: Add equipment drop calculation to battle rewards

**Context**:
Only gold/XP drops currently:
- `calculateBattleRewards()` exists but only calculates XP/gold
- RewardsScreen displays only XP/gold
- DROP_RATES specified in GAME_MECHANICS.md (30% common, 10% rare, 2% legendary)
- NO equipment drop logic exists

**Drop Rate Specs**:
- Common: 30% chance → Iron tier equipment
- Rare: 10% chance → Steel tier equipment
- Legendary: 2% chance → Legendary equipment
- Boss battles: 80% common, 50% rare, 15% legendary

**What You Need to Do**:
1. Extend `EnemyReward` type in `src/types/BattleRewards.ts`:
   ```typescript
   export interface EnemyReward {
     baseXp: number;
     baseGold: number;
     level: number;
     dropTable?: DropTable; // NEW
   }

   export interface DropTable {
     common: { chance: number, items: string[] }; // equipment IDs
     rare: { chance: number, items: string[] };
     legendary: { chance: number, items: string[] };
   }
   ```

2. Add drop calculation to `calculateBattleRewards()`:
   ```typescript
   function rollEquipmentDrops(
     dropTable: DropTable,
     isBossBattle: boolean,
     rng: RNG
   ): Equipment[] {
     const drops: Equipment[] = [];
     
     // Check each rarity tier
     const tiers: Array<keyof DropTable> = ['legendary', 'rare', 'common'];
     for (const tier of tiers) {
       const { chance, items } = dropTable[tier];
       const adjustedChance = isBossBattle ? chance * 2 : chance;
       
       if (rng.next() < adjustedChance) {
         const itemId = items[Math.floor(rng.next() * items.length)];
         const equipment = getEquipmentById(itemId);
         if (equipment) drops.push(equipment);
         break; // Only one drop per enemy
       }
     }
     
     return drops;
   }
   ```

3. Update `RewardDistribution` to include equipment:
   ```typescript
   export interface RewardDistribution {
     gold: number;
     levelUpEvents: LevelUpEvent[];
     equipmentDrops: Equipment[]; // NEW
   }
   ```

4. Display equipment in RewardsScreen.tsx:
   - Show "Equipment Obtained:" section
   - List each equipment drop with name and tier

5. Add to player inventory after battle

**Acceptance Criteria**:
- [ ] Defeat enemy → ~30% chance get common equipment drop
- [ ] Defeat enemy → ~10% chance get rare equipment drop
- [ ] Defeat enemy → ~2% chance get legendary equipment drop
- [ ] Defeat boss → Higher drop chances (80% / 50% / 15%)
- [ ] Rewards screen shows equipment drops
- [ ] Equipment added to inventory
- [ ] Multiple enemies = multiple drop chances

**Files to Modify**:
- `src/types/BattleRewards.ts` (add drop calculation)
- `src/components/battle/RewardsScreen.tsx` (display equipment)
- `src/data/enemies.ts` (add dropTable to enemy definitions)

**Estimated Time**: 5-7 hours

---

### PROMPT 12: Turn Order Display UI

**Task**: Create UI component showing upcoming turn order in battle

**Context**:
Turn order is calculated correctly but not displayed:
- `calculateTurnOrder()` returns sorted Unit array (Battle.ts:88)
- Order updates each round
- Players can't see who acts next

**What You Need to Do**:
1. Create `src/components/battle/TurnOrderDisplay.tsx`:
   ```typescript
   interface TurnOrderDisplayProps {
     turnOrder: Unit[];
     currentActorIndex: number;
   }

   export const TurnOrderDisplay: React.FC<TurnOrderDisplayProps> = ({
     turnOrder,
     currentActorIndex
   }) => {
     return (
       <div className="turn-order-display">
         <h4>Turn Order</h4>
         <div className="turn-order-list">
           {turnOrder.map((unit, index) => (
             <div 
               key={unit.id}
               className={`turn-order-unit ${index === currentActorIndex ? 'active' : ''}`}
             >
               <div className="unit-portrait">
                 {/* Unit portrait or icon */}
                 <span>{unit.name.charAt(0)}</span>
               </div>
               <span className="unit-name">{unit.name}</span>
               <span className="unit-spd">SPD: {unit.stats.spd}</span>
             </div>
           ))}
         </div>
       </div>
     );
   };
   ```

2. Add styling in `TurnOrderDisplay.css`:
   - Vertical list on right side of battle screen
   - Current actor highlighted (bright border)
   - Future actors dimmed slightly
   - Show SPD stat for each unit
   - Compact layout (don't cover battle)

3. Integrate into BattleScreen.tsx:
   ```typescript
   return (
     <div className="battle-screen">
       {/* Existing battle UI */}
       
       <TurnOrderDisplay 
         turnOrder={turnOrder}
         currentActorIndex={currentActorIndex}
       />
     </div>
   );
   ```

**Acceptance Criteria**:
- [ ] Turn order displays on right side of battle screen
- [ ] Units listed in order of action (top to bottom)
- [ ] Current actor highlighted
- [ ] Shows unit name and SPD stat
- [ ] Updates when new round starts
- [ ] KO'd units removed from display
- [ ] Doesn't block battle actions/UI

**Files to Create**:
- `src/components/battle/TurnOrderDisplay.tsx`
- `src/components/battle/TurnOrderDisplay.css`

**Files to Modify**:
- `src/components/battle/BattleScreen.tsx` (add component)

**Estimated Time**: 3-4 hours

---

## TIER 3: NEEDS MAJOR NEW SYSTEMS

### PROMPT 13: Camera Follow System

**Task**: Implement camera that follows player on large maps

**Context**:
Player can walk off screen on large maps:
- NewOverworldScreen.tsx renders full map
- No camera transform applied
- Player position tracked in state
- Maps can be 40×30 to 50×40 tiles (640×800px)

**Camera Behavior**:
- Center camera on player position
- Keep player in middle of viewport (unless near edge)
- Stay within map bounds (don't show black outside map)
- Smooth scrolling as player moves

**What You Need to Do**:
1. Create `src/utils/cameraSystem.ts`:
   ```typescript
   export interface CameraTransform {
     x: number; // Offset in pixels
     y: number;
   }

   export function calculateCameraOffset(
     playerPos: { x: number, y: number },
     tileSize: number,
     mapSize: { width: number, height: number },
     viewportSize: { width: number, height: number }
   ): CameraTransform {
     // Convert player tile position to pixels
     const playerPx = {
       x: playerPos.x * tileSize,
       y: playerPos.y * tileSize
     };

     // Calculate offset to center player
     let offsetX = viewportSize.width / 2 - playerPx.x;
     let offsetY = viewportSize.height / 2 - playerPx.y;

     // Clamp to map bounds
     const mapPx = {
       width: mapSize.width * tileSize,
       height: mapSize.height * tileSize
     };

     // Don't scroll past left/top edge
     offsetX = Math.min(0, offsetX);
     offsetY = Math.min(0, offsetY);

     // Don't scroll past right/bottom edge
     offsetX = Math.max(viewportSize.width - mapPx.width, offsetX);
     offsetY = Math.max(viewportSize.height - mapPx.height, offsetY);

     return { x: offsetX, y: offsetY };
   }
   ```

2. Apply transform in NewOverworldScreen.tsx:
   ```typescript
   const cameraOffset = calculateCameraOffset(
     playerPos,
     16, // tile size
     { width: area.width, height: area.height },
     { width: 640, height: 480 } // viewport size
   );

   return (
     <div className="overworld-screen">
       <div 
         className="map-container"
         style={{
           transform: `translate(${cameraOffset.x}px, ${cameraOffset.y}px)`,
           transition: 'transform 0.2s ease-out' // Smooth scrolling
         }}
       >
         {/* Map tiles, NPCs, player */}
       </div>
     </div>
   );
   ```

3. Update CSS to hide overflow:
   ```css
   .overworld-screen {
     width: 640px;
     height: 480px;
     overflow: hidden;
     position: relative;
   }

   .map-container {
     position: absolute;
     top: 0;
     left: 0;
   }
   ```

**Acceptance Criteria**:
- [ ] Player stays in center of screen when moving
- [ ] Camera stops at map edges (doesn't show black)
- [ ] Works on small maps (vale_village 40×30)
- [ ] Works on large maps (vale_outskirts 50×40)
- [ ] Smooth scrolling as player moves
- [ ] Player visible at all times
- [ ] No jitter or lag

**Files to Create**:
- `src/utils/cameraSystem.ts`

**Files to Modify**:
- `src/components/overworld/NewOverworldScreen.tsx` (apply transform)
- `src/components/overworld/NewOverworldScreen.css` (overflow hidden)

**Estimated Time**: 4-6 hours

---

### PROMPT 14: Battle Transition Animation

**Task**: Add swirl/fade transition when entering battles

**Context**:
Battles start instantly with no transition:
- NewOverworldScreen.tsx calls `actions.navigate({ type: 'BATTLE' })` immediately
- No animation between overworld and battle
- Jarring screen switch

**Transition Spec** (from GAME_MECHANICS.md):
- Duration: 2.3 seconds total
- Swirl/spiral effect (optional - can be simple fade)
- Overworld fades out (0.5s)
- Spiral animation (1.3s)
- Battle fades in (0.5s)

**What You Need to Do**:
1. Create `src/components/battle/BattleTransition.tsx`:
   ```typescript
   interface BattleTransitionProps {
     onComplete: () => void;
   }

   export const BattleTransition: React.FC<BattleTransitionProps> = ({
     onComplete
   }) => {
     const [phase, setPhase] = useState<'fadeOut' | 'swirl' | 'fadeIn'>('fadeOut');

     useEffect(() => {
       // Phase 1: Fade out (500ms)
       setTimeout(() => setPhase('swirl'), 500);
       
       // Phase 2: Swirl (1300ms)
       setTimeout(() => setPhase('fadeIn'), 1800);
       
       // Phase 3: Fade in + complete (500ms)
       setTimeout(() => onComplete(), 2300);
     }, []);

     return (
       <div className={`battle-transition ${phase}`}>
         <div className="transition-overlay">
           {phase === 'swirl' && (
             <div className="spiral-animation" />
           )}
         </div>
       </div>
     );
   };
   ```

2. Create `BattleTransition.css`:
   ```css
   .battle-transition {
     position: fixed;
     top: 0;
     left: 0;
     right: 0;
     bottom: 0;
     z-index: 1000;
   }

   .transition-overlay {
     width: 100%;
     height: 100%;
     background: black;
   }

   .fadeOut .transition-overlay {
     animation: fadeIn 0.5s ease-in;
   }

   .fadeIn .transition-overlay {
     animation: fadeOut 0.5s ease-out;
   }

   .spiral-animation {
     width: 200px;
     height: 200px;
     border: 4px solid white;
     border-radius: 50%;
     position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%);
     animation: spiral 1.3s linear;
   }

   @keyframes spiral {
     0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); }
     100% { transform: translate(-50%, -50%) scale(2) rotate(720deg); opacity: 0; }
   }
   ```

3. Integrate into game flow:
   - Add `showBattleTransition` state to GameProvider
   - When starting battle, show transition first
   - Call `navigate({ type: 'BATTLE' })` in onComplete

4. Simplify if swirl is too complex:
   - Just use black fade out → fade in (1 second total)
   - Still provides visual break between screens

**Acceptance Criteria**:
- [ ] Trigger battle → transition plays
- [ ] Screen fades to black
- [ ] (Optional) Spiral/swirl animation
- [ ] Battle screen fades in
- [ ] Total duration ~2 seconds
- [ ] Smooth, no flicker
- [ ] Works for all battle triggers (random, boss, NPC)

**Files to Create**:
- `src/components/battle/BattleTransition.tsx`
- `src/components/battle/BattleTransition.css`

**Files to Modify**:
- `src/context/GameProvider.tsx` (add transition state)
- `src/components/overworld/NewOverworldScreen.tsx` (trigger transition)

**Estimated Time**: 3-5 hours

---

### PROMPT 15: Save/Load System

**Task**: Implement game save to localStorage and load on startup

**Context**:
NO save system exists:
- Game state resets on page refresh
- Can't preserve progress
- Critical blocker for testing

**Save Data Structure**:
- All player data (units, gold, inventory, Djinn)
- Current location and position
- Story flags and area states
- Quest progress

**What You Need to Do**:
1. Create `src/utils/saveSystem.ts`:
   ```typescript
   export interface SaveData {
     version: string; // '1.0.0'
     timestamp: number;
     playerData: PlayerData;
     location: AreaId;
     position: { x: number, y: number };
     storyFlags: StoryFlags;
     areaStates: Record<AreaId, AreaState>;
     quests: Quest[];
   }

   export function saveGame(state: GameState): void {
     const saveData: SaveData = {
       version: '1.0.0',
       timestamp: Date.now(),
       playerData: state.playerData,
       location: state.currentLocation,
       position: state.playerPosition,
       storyFlags: state.storyFlags,
       areaStates: state.areaStates,
       quests: state.quests,
     };

     try {
       // Serialize to JSON
       const json = JSON.stringify(saveData);
       
       // Save to localStorage
       localStorage.setItem('vale_chronicles_save', json);
       
       console.log('Game saved successfully');
     } catch (error) {
       console.error('Failed to save game:', error);
     }
   }

   export function loadGame(): SaveData | null {
     try {
       const json = localStorage.getItem('vale_chronicles_save');
       if (!json) return null;

       const saveData: SaveData = JSON.parse(json);
       
       // Version check
       if (saveData.version !== '1.0.0') {
         console.warn('Save version mismatch');
         return null;
       }

       return saveData;
     } catch (error) {
       console.error('Failed to load game:', error);
       return null;
     }
   }

   export function deleteSave(): void {
     localStorage.removeItem('vale_chronicles_save');
   }
   ```

2. Add auto-save triggers:
   - After battle victory
   - After inn rest
   - After major story events
   - Add `autoSave()` function that calls `saveGame(state)`

3. Add load on startup:
   - In GameProvider initialization, call `loadGame()`
   - If save exists, restore state
   - If no save, start new game

4. Create SaveScreen.tsx (optional):
   - Manual save option in menu
   - Show save timestamp
   - Confirm overwrite

**Important**: Handle Units properly:
- Units are class instances, not plain objects
- Must recreate Unit instances from JSON:
  ```typescript
  function deserializeUnits(unitsData: any[]): Unit[] {
    return unitsData.map(data => {
      const def = UNIT_DEFINITIONS[data.id];
      const unit = new Unit(def, data.level, data.xp);
      unit.currentHp = data.currentHp;
      unit.currentPp = data.currentPp;
      // ... restore other properties
      return unit;
    });
  }
  ```

**Acceptance Criteria**:
- [ ] Game state saves to localStorage
- [ ] Refresh page → game loads from save
- [ ] Units retain levels, XP, HP, PP
- [ ] Equipment and inventory preserved
- [ ] Location and position preserved
- [ ] Story flags and quests preserved
- [ ] No save → starts new game normally
- [ ] Save file <1MB (check localStorage limits)

**Files to Create**:
- `src/utils/saveSystem.ts`
- `src/components/menu/SaveScreen.tsx` (optional)

**Files to Modify**:
- `src/context/GameProvider.tsx` (add save/load calls)

**Estimated Time**: 8-12 hours (complex due to Unit deserialization)

---

### PROMPT 16: Inn Rest System

**Task**: Create Inn screen where player can rest for 10 gold to restore HP/PP

**Context**:
NO Inn system exists at all

**Inn Specs** (from GAME_MECHANICS.md):
- Cost: 10 gold flat rate
- Restores: Full HP and PP for all units
- Cures: All status effects (poison, burn, freeze, paralyze)
- Triggers: Auto-save after rest
- Dialogue: "Welcome to the inn! Rest is 10 gold. Would you like to stay?"

**What You Need to Do**:
1. Create `src/components/overworld/InnScreen.tsx`:
   ```typescript
   export const InnScreen: React.FC = () => {
     const { state, actions } = useGame();
     const [showConfirm, setShowConfirm] = useState(true);
     const [showResult, setShowResult] = useState(false);

     const handleRest = () => {
       if (state.playerData.gold < 10) {
         alert('Not enough gold! Need 10 gold to rest.');
         return;
       }

       // Deduct gold
       actions.addGold(-10);

       // Restore HP/PP for all units
       state.playerData.unitsCollected.forEach(unit => {
         unit.currentHp = unit.maxHp;
         unit.currentPp = unit.maxPp;
         unit.statusEffects = []; // Clear all status effects
       });

       // Auto-save
       actions.saveGame();

       // Show success message
       setShowConfirm(false);
       setShowResult(true);

       // Return to overworld after 2 seconds
       setTimeout(() => {
         actions.navigate({ type: 'OVERWORLD' });
       }, 2000);
     };

     if (showResult) {
       return (
         <div className="inn-screen">
           <p>Have a good rest!</p>
           <p>HP/PP fully restored, game saved.</p>
         </div>
       );
     }

     return (
       <div className="inn-screen">
         <h2>Vale Inn</h2>
         <p>"Welcome to the inn! Rest is 10 gold. Would you like to stay?"</p>
         <div className="inn-buttons">
           <button onClick={handleRest} disabled={state.playerData.gold < 10}>
             Rest (10 gold)
           </button>
           <button onClick={() => actions.navigate({ type: 'OVERWORLD' })}>
             Leave
           </button>
         </div>
         <p>Your gold: {state.playerData.gold}</p>
       </div>
     );
   };
   ```

2. Add Inn NPC to Vale Village in areas.ts:
   ```typescript
   npcs: [
     {
       id: 'innkeeper',
       name: 'Innkeeper',
       position: { x: 25, y: 15 },
       dialogue: 'Welcome! Care for a rest?',
       onInteract: 'INN_SCREEN' // Trigger inn screen
     }
   ]
   ```

3. Handle inn trigger in NewOverworldScreen.tsx:
   ```typescript
   const handleInteract = () => {
     // ... existing NPC interaction code
     
     if (npc.onInteract === 'INN_SCREEN') {
       actions.navigate({ type: 'INN' });
     }
   };
   ```

4. Add INN screen type to Screen union:
   ```typescript
   type Screen = 
     | { type: 'TITLE' }
     | { type: 'OVERWORLD' }
     | { type: 'BATTLE' }
     | { type: 'INN' } // NEW
     // ... etc
   ```

**Acceptance Criteria**:
- [ ] Talk to Innkeeper → Inn screen appears
- [ ] Shows "Rest is 10 gold" message
- [ ] Rest button disabled if gold < 10
- [ ] Click Rest → deducts 10 gold
- [ ] All party HP/PP restored to full
- [ ] All status effects cleared
- [ ] Game auto-saves after rest
- [ ] Returns to overworld after rest
- [ ] Leave button returns without resting

**Files to Create**:
- `src/components/overworld/InnScreen.tsx`
- `src/components/overworld/InnScreen.css`

**Files to Modify**:
- `src/data/areas.ts` (add innkeeper NPC)
- `src/components/overworld/NewOverworldScreen.tsx` (handle inn trigger)
- `src/context/types.ts` (add INN to Screen type)
- `src/App.tsx` (route INN screen)

**Estimated Time**: 4-6 hours

---

### PROMPT 17: Party Management Screen

**Task**: Create UI to view all 10 recruited units and swap active party (4) vs bench (6)

**Context**:
Party data exists but no management UI:
- `activePartyIds: string[]` in PlayerData
- `setActiveParty()` action exists
- Max 10 total, max 4 active enforced
- Zero UI to access this

**What You Need to Do**:
1. Create `src/components/party/PartyManagementScreen.tsx`:
   ```typescript
   export const PartyManagementScreen: React.FC = () => {
     const { state, actions } = useGame();
     const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

     const activeUnits = state.playerData.unitsCollected.filter(u =>
       state.playerData.activePartyIds.includes(u.id)
     );

     const benchUnits = state.playerData.unitsCollected.filter(u =>
       !state.playerData.activePartyIds.includes(u.id)
     );

     const handleSwapToActive = (unit: Unit) => {
       if (activeUnits.length >= 4) {
         alert('Active party is full! Remove a unit first.');
         return;
       }
       
       actions.setActiveParty([
         ...state.playerData.activePartyIds,
         unit.id
       ]);
     };

     const handleSwapToBench = (unit: Unit) => {
       if (activeUnits.length <= 1) {
         alert('Must have at least 1 active unit!');
         return;
       }

       actions.setActiveParty(
         state.playerData.activePartyIds.filter(id => id !== unit.id)
       );
     };

     return (
       <div className="party-management-screen">
         <h2>Party Management</h2>
         
         <section className="active-party">
           <h3>Active Party ({activeUnits.length}/4)</h3>
           <div className="unit-grid">
             {activeUnits.map(unit => (
               <PartyMemberCard
                 key={unit.id}
                 unit={unit}
                 isActive={true}
                 onSelect={() => setSelectedUnit(unit)}
                 onSwap={() => handleSwapToBench(unit)}
               />
             ))}
           </div>
         </section>

         <section className="bench-party">
           <h3>Bench ({benchUnits.length}/6)</h3>
           <div className="unit-grid">
             {benchUnits.map(unit => (
               <PartyMemberCard
                 key={unit.id}
                 unit={unit}
                 isActive={false}
                 onSelect={() => setSelectedUnit(unit)}
                 onSwap={() => handleSwapToActive(unit)}
               />
             ))}
           </div>
         </section>

         {selectedUnit && (
           <section className="unit-details">
             <h3>{selectedUnit.name}</h3>
             <p>Level: {selectedUnit.level}</p>
             <p>HP: {selectedUnit.currentHp}/{selectedUnit.maxHp}</p>
             <p>PP: {selectedUnit.currentPp}/{selectedUnit.maxPp}</p>
             <p>ATK: {selectedUnit.stats.atk} | DEF: {selectedUnit.stats.def}</p>
             <p>MAG: {selectedUnit.stats.mag} | SPD: {selectedUnit.stats.spd}</p>
           </section>
         )}

         <button onClick={() => actions.navigate({ type: 'OVERWORLD' })}>
           Back
         </button>
       </div>
     );
   };
   ```

2. Create `src/components/party/PartyMemberCard.tsx`:
   ```typescript
   interface PartyMemberCardProps {
     unit: Unit;
     isActive: boolean;
     onSelect: () => void;
     onSwap: () => void;
   }

   export const PartyMemberCard: React.FC<PartyMemberCardProps> = ({
     unit,
     isActive,
     onSelect,
     onSwap
   }) => {
     return (
       <div 
         className={`party-member-card ${isActive ? 'active' : 'bench'}`}
         onClick={onSelect}
       >
         <div className="unit-portrait">
           {/* Unit portrait */}
           <span className="unit-level">Lv{unit.level}</span>
         </div>
         <div className="unit-info">
           <h4>{unit.name}</h4>
           <p className="unit-role">{unit.role}</p>
           <div className="hp-bar">
             <div 
               className="hp-fill"
               style={{ width: `${(unit.currentHp / unit.maxHp) * 100}%` }}
             />
           </div>
         </div>
         <button 
           className="swap-button"
           onClick={(e) => { e.stopPropagation(); onSwap(); }}
         >
           {isActive ? '→ Bench' : '→ Active'}
         </button>
       </div>
     );
   };
   ```

3. Add menu option to access party screen:
   - In overworld, press 'P' key → open party management
   - Or add button in UI

**Acceptance Criteria**:
- [ ] Shows all recruited units (up to 10)
- [ ] Clearly separates Active (4) from Bench (6)
- [ ] Can click unit to see detailed stats
- [ ] Can swap unit from active to bench
- [ ] Can swap unit from bench to active (if room)
- [ ] Can't remove last active unit (shows error)
- [ ] Can't add 5th active unit (shows error)
- [ ] Changes persist (units in correct group)
- [ ] Bench units don't gain XP in battles (verify existing)

**Files to Create**:
- `src/components/party/PartyManagementScreen.tsx`
- `src/components/party/PartyMemberCard.tsx`
- `src/components/party/PartyManagement.css`

**Files to Modify**:
- `src/components/overworld/NewOverworldScreen.tsx` (add 'P' key handler)
- `src/context/types.ts` (add PARTY_MANAGEMENT to Screen type)
- `src/App.tsx` (route party management screen)

**Estimated Time**: 8-10 hours

---

## Additional Prompts Available

I've created 17 detailed prompts covering all TIER 1-3 features. The remaining features (Class Changes, Djinn System full implementation) would require very large architectural prompts (15-20 hours each).

**Would you like me to create prompts for:**
- Class Change System (TIER 3, complex)
- Djinn System Full Implementation (TIER 3, very complex)
- Any specific feature in more detail?

---

## USAGE NOTES FOR EXTERNAL CODERS

1. **Each prompt is standalone** - Can be given to different coders
2. **Acceptance criteria are testable** - Clear pass/fail conditions
3. **File paths are specific** - No guessing where to make changes
4. **Context explains what exists** - Coders know what to build on vs build from scratch
5. **Estimated times are realistic** - Based on complexity assessment

**Recommended Assignment Order:**
- Start with TIER 1 (Quick Wins) - Build confidence, see progress
- Move to TIER 2 (Refactoring) - Clean up existing systems
- Tackle TIER 3 (New Systems) - When foundation is solid
