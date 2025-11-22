<!-- ecc0dfaa-1751-4124-9591-268062184e39 6dc2e851-57c2-46b2-81f4-1619c127625b -->
# Phase 4: Content & AI - Golden Path to Credits

## Strategy: Vertical Slice Approach

**Golden Path First**: Ship a finishable 3-chapter game (15 fights) before expanding to full content totals. This ensures a complete, testable game loop before adding breadth.

**Content Totals** (post-GP expansion):

- 50+ abilities (30 in GP, 20 post-credit)
- 20+ enemies (16 in GP, 8 post-credit)  
- 10 units (6 in GP, 4 post-credit)
- 8 Djinn (2 per element)
- 18-24 equipment items

---

## Vertical Slice 0: Golden Path MVP (Chapter 1)

**Goal**: Start → Beat Chapter 1 Boss → Credits → Replay works

### Content Creation

- **6 Units** (4 starters + 2 recruits):
  - Adept (Venus) - bruiser, guard break
  - War Mage (Mars) - nuker, burn DOT
  - Mystic (Mercury) - healer, cleanse
  - Ranger (Jupiter) - SPD leader, blind
  - Sentinel (Venus) - taunt, team DEF buff
  - Stormcaller (Jupiter) - chain-lightning AOE

- **8 Enemies** (5 normal + 1 mini-boss + 1 boss + 1 shard):
  - Tier 1: Slime, Wolf, Bandit, Sprite, Beetle
  - Mini-boss: Gladiator (priority boots)
  - Boss: Elemental Guardian (phase change at 50%)
  - Boss add: Guardian Shard

- **12 Abilities** (Chapter 1 set):
  - Physical: strike, heavy strike, guard break, precise jab
  - Psynergy: fireball, ice shard, quake, gust, chain lightning
  - Healing: heal, small party heal
  - Buffs: ATK↑, DEF↑
  - Debuffs: DEF↓, blind

- **5 Encounters** (Chapter 1):
  - 3 normal fights (Slime, Wolf, Bandit)
  - 1 mini-boss (Gladiator)
  - 1 boss (Elemental Guardian)

### AI Implementation

- **AI Service** (`src/core/services/AIService.ts`):
  - Ability scoring (damage estimate, element modifier, status utility)
  - Target selection (weakest effective HP, avoid overkill)
  - Deterministic decision-making (per-turn RNG substream)
  - AI hints per ability (`priority`, `target`, `avoidOverkill`, `opener`)

- **Integration**:
  - Wire AI into `ActionBar` for enemy turns
  - Auto-execute enemy actions with delay
  - Show AI decisions in battle log

### Sprite System

- **Sprite Atlas**: `assets/sprites/characters/{id}.png` (32×32 or 64×64 grid)
- **Sprite Maps**: `assets/sprites/characters/{id}.json` (frameWidth, frameHeight, idleFrames, hitFrames)
- **Sprite Component**: `<Sprite id="stormcaller" state="idle" frame={t % idleFrames} />`
- **Event Hooks**: Flash/tint on hit/crit, grayscale on KO (≤300ms animations)

### Battle Flow

- Ensure `performAction` → `events` → UI → `endTurn` → next turn works
- Chapter progression system
- Credits screen after Chapter 1 boss
- Save replay file (seed + decisions)

### Testing

- **Integration Test**: Scripted choices clear Chapter 1, replay produces identical `BattleEvent[]`
- **Unit Tests**: AI policy determinism, ability scoring, target selection

---

## Vertical Slice 1: Golden Path Extended (Chapters 2 & 3)

**Goal**: Complete 15-fight Golden Path finishable, replay verified

### Content Expansion

- **Chapters 2 & 3 Encounters**:
  - 6 normal fights (Sprite, Beetle, Wisp, Soldier, Shaman, Elemental Knight)
  - 2 mini-bosses (Elemental Knight, Trickster)
  - 2 bosses (Chapter 2 & 3 bosses)

- **Abilities to ~30**:
  - Add: flurry, sweeping slash, rend armor, intercept, finishing blow
  - Add: line/row AOEs, ice lance, magma burst, sand spike, tidal wave
  - Add: medium heal, regen, heal+cleanse
  - Add: SPD↑, ACC↑, RES↑, magic amp, guard stance
  - Add: ATK↓, SPD↓, ACC↓, silence, weaken, shock, bleed, mark

- **Equipment**: Add 12-18 more items (one per slot per tier)

### Testing

- **GP Smoke Test**: Run entire 15-fight Golden Path, assert same event sequence
- **Edge Cases**: Multi-hit, AOE heavy, revive path
- **Replay Test**: Serialize decisions, re-run, assert identical `BattleEvent[]`

---

## Vertical Slice 2: Post-Credit Expansion

**Goal**: Reach full content totals (1C), GP remains stable

### Content Addition

- **4 Post-Credit Units**:
  - Pyromancer (Mars) - ramping burn
  - Tide Sage (Mercury) - revive + big heal
  - Blade Dancer (Jupiter) - multi-hit flurry
  - Geomancer (Venus) - terrain effects

- **8 Post-Credit Enemies**:
  - Dragon, Lich, Golem, Siren, Warlock, Assassin, Chimera, Colossus

- **~30 Post-Credit Abilities**:
  - Remaining physical, psynergy, healing, buff, debuff abilities
  - Advanced abilities (revive, execute, counter, etc.)

- **Feature Flag**: `POST_CREDIT_CONTENT` gate to unlock new content

---

## Vertical Slice 3: Polish (Not Particles)

**Goal**: Functional polish without heavy animation systems

### Visual Improvements

- CSS transitions (opacity/translate for damage numbers, status icons)
- Damage number popups (fade up, fade out)
- Status effect icons with tooltips
- Subtle screen shake on crit (CSS transform)
- HP/PP bar smooth animations

### Accessibility

- ARIA live region improvements
- Keyboard navigation (arrows for targets, Enter to confirm, Esc to cancel)
- Focus management after battle-end
- Screen reader announcements throttled

---

## Testing Strategy

### Unit Tests

- Ability calculators (damage, psynergy, heal, buffs, debuffs) - property tests
- AI policy: deterministic decisions, avoid overkill, target priority
- Status engine: tick order determinism
- Turn order: priority tier > SPD > tie-break stability
- Save/load + migration: roundtrip with `SaveV1Schema`

### Integration Tests

- **GP Smoke**: Full 15-fight Golden Path from fixture decisions
- **Edge Fights**: Multi-hit, AOE heavy, revive path
- **Replay**: Serialize decisions, re-run, assert identical `BattleEvent[]`

### CI Guardrails

- Determinism check: Run GP replay, assert byte-identical `BattleEvent` JSON
- Schema lock: Changes require migration + replay test
- Content freeze: GP data locked after VS-1

---

## File Structure

```
src/
├── core/
│   └── services/
│       └── AIService.ts          # NEW - AI policy & decision-making
├── data/
│   ├── definitions/
│   │   ├── abilities.ts           # EXPAND - 30 GP + 30 post-credit
│   │   ├── enemies.ts             # EXPAND - 16 GP + 8 post-credit
│   │   ├── units.ts               # EXPAND - 6 GP + 4 post-credit
│   │   └── encounters.ts         # NEW - Chapter/encounter definitions
│   └── schemas/
│       └── EncounterSchema.ts     # NEW - Encounter validation
├── ui/
│   ├── components/
│   │   ├── Sprite.tsx             # NEW - Sprite renderer
│   │   └── CreditsScreen.tsx      # NEW - Credits after boss
│   └── assets/
│       └── sprites/
│           └── characters/       # NEW - Sprite atlases + JSON maps
└── tests/
    ├── integration/
    │   └── golden-path.test.ts    # NEW - Full GP smoke test
    └── core/services/
        └── ai.test.ts             # NEW - AI policy tests
```

---

## Acceptance Criteria

✅ **Golden Path Finishable**: Start → Credits achievable on fresh save

✅ **Replay Determinism**: Same seed + decisions → identical `BattleEvent[]`

✅ **No Soft-Locks**: Every encounter validates correctly

✅ **Accessibility**: Keyboard-only completion, ARIA announcements

✅ **Performance**: 60fps with sprites and transitions

✅ **Content Totals**: 50+ abilities, 20+ enemies, 10 units after expansion

✅ **AI Quality**: Enemies make tactical decisions (target weakest, avoid overkill)

✅ **Sprite Rendering**: Units/enemies display with idle/hit animations

---

## Implementation Order

1. **VS-0 Content**: 6 units, 8 enemies, 12 abilities, 5 encounters
2. **AI Service**: Policy implementation with scoring + target selection
3. **Sprite System**: Atlas + renderer + event hooks
4. **Battle Flow**: Chapter progression + credits screen
5. **VS-0 Testing**: Chapter 1 integration test + replay
6. **VS-1 Content**: Chapters 2 & 3 encounters + abilities to 30
7. **VS-1 Testing**: Full GP smoke test + replay verification
8. **VS-2 Content**: Post-credit units/enemies/abilities + feature flag
9. **VS-3 Polish**: CSS transitions + accessibility improvements

---

## Data Pack Examples

**Ability (Guard Break)**:

```typescript
{
  id: 'guard_break',
  name: 'Guard Break',
  type: 'physical',
  basePower: 18,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Strikes through defenses',
  aiHints: { priority: 2, target: 'weakest', avoidOverkill: false }
}
```

**Enemy (Wisp)**:

```typescript
{
  id: 'wisp',
  name: 'Wisp',
  level: 2,
  element: 'Jupiter',
  stats: { hp: 60, atk: 10, mag: 18, def: 8, spd: 20, pp: 15 },
  abilities: [{ id: 'gust', unlockLevel: 1 }, ...],
  baseXp: 25,
  baseGold: 12
}
```

**Encounter (Chapter 1 Boss)**:

```typescript
{
  id: 'c1_boss',
  name: 'Elemental Guardian',
  enemies: ['guardian_core', 'guardian_shard_fire', 'guardian_shard_water'],
  rules: {
    phaseChange: { hpPct: 0.5, addAbility: 'elemental_overload' },
    fleeDisabled: true
  },
  reward: { gold: 150, unlockUnit: 'stormcaller' }
}
```

### To-dos

- [ ] Create 6 GP units (4 starters + 2 recruits) with abilities, stats, growth rates
- [ ] Create 8 GP enemies (5 normal + 1 mini-boss + 1 boss + 1 shard) with abilities and stats
- [ ] Create 12 GP abilities covering physical, psynergy, healing, buffs, debuffs
- [ ] Create 5 Chapter 1 encounters (3 normal + 1 mini-boss + 1 boss) with encounter schema
- [ ] Implement AIService with ability scoring, target selection (weakest, avoid overkill), deterministic decisions
- [ ] Wire AI into ActionBar for enemy turns, auto-execute with delay, show decisions in log
- [ ] Create sprite atlas system: PNG files + JSON maps for 6 units + 8 enemies (idle/hit frames)
- [ ] Implement Sprite component with state (idle/hit), frame stepping, event hooks (flash/tint/grayscale)
- [ ] Implement chapter progression system: encounter sequence, boss detection, chapter completion
- [ ] Create CreditsScreen component shown after Chapter 1 boss defeat
- [ ] Implement replay file save (seed + decisions) after chapter completion
- [ ] Create Chapter 1 integration test: scripted choices clear boss, replay produces identical BattleEvent[]
- [ ] Create AI unit tests: deterministic decisions, avoid overkill rule, target priority
- [ ] Create Chapters 2 & 3 encounters (6 normal + 2 mini-bosses + 2 bosses)
- [ ] Expand abilities to ~30 total (add flurry, AOEs, advanced healing/buffs/debuffs)
- [ ] Add 12-18 equipment items (one per slot per tier along GP)
- [ ] Create full GP smoke test: run 15-fight Golden Path, assert same event sequence
- [ ] Create replay test: serialize decisions, re-run, assert identical BattleEvent[]
- [ ] Add 4 post-credit units (Pyromancer, Tide Sage, Blade Dancer, Geomancer)
- [ ] Add 8 post-credit enemies (Dragon, Lich, Golem, Siren, Warlock, Assassin, Chimera, Colossus)
- [ ] Add ~30 post-credit abilities to reach 50+ total
- [ ] Implement POST_CREDIT_CONTENT feature flag to gate new content
- [ ] Add CSS transitions: damage numbers, status icons, screen shake on crit, HP/PP bar animations
- [ ] Improve accessibility: ARIA live regions, keyboard navigation, focus management, throttled announcements
- [ ] Add CI job: run GP replay, assert byte-identical BattleEvent JSON