# Dry Run Analysis: Ability ID Conversion

## Summary

**Found 9 ability IDs that need conversion from snake_case to kebab-case**

## Changes Required

### 1. Ability Definition IDs (9 changes)

| Current (snake_case) | Should Be (kebab-case) | Line |
|---------------------|----------------------|------|
| `heavy_strike` | `heavy-strike` | 30 |
| `guard_break` | `guard-break` | 41 |
| `precise_jab` | `precise-jab` | 56 |
| `ice_shard` | `ice-shard` | 83 |
| `chain_lightning` | `chain-lightning` | 119 |
| `party_heal` | `party-heal` | 147 |
| `boost_atk` | `boost-atk` | 162 |
| `boost_def` | `boost-def` | 177 |
| `weaken_def` | `weaken-def` | 196 |

### 2. ABILITIES Record Keys (9 changes)

The ABILITIES Record uses unquoted keys that also need updating:

```typescript
// Current (lines 229-250):
export const ABILITIES: Record<string, Ability> = {
  strike: STRIKE,
  heavy_strike: HEAVY_STRIKE,      // ❌ needs: 'heavy-strike'
  guard_break: GUARD_BREAK,         // ❌ needs: 'guard-break'
  precise_jab: PRECISE_JAB,         // ❌ needs: 'precise-jab'
  fireball: FIREBALL,
  ice_shard: ICE_SHARD,             // ❌ needs: 'ice-shard'
  quake: QUAKE,
  gust: GUST,
  chain_lightning: CHAIN_LIGHTNING, // ❌ needs: 'chain-lightning'
  heal: HEAL,
  party_heal: PARTY_HEAL,           // ❌ needs: 'party-heal'
  boost_atk: BOOST_ATK,             // ❌ needs: 'boost-atk'
  boost_def: BOOST_DEF,             // ❌ needs: 'boost-def'
  weaken_def: WEAKEN_DEF,           // ❌ needs: 'weaken-def'
  blind: BLIND,
};
```

### 3. References in Other Files

Need to check for references to these IDs in:
- Equipment definitions (`unlocksAbility`)
- Unit definitions (ability arrays)
- Test files
- Story/encounter data
- Service files

## Impact Assessment

### ✅ **Worth Fixing** - Here's Why:

1. **Consistency**: Main codebase (`src/data/abilities.ts`) uses kebab-case
2. **Documentation**: Naming conventions document specifies kebab-case
3. **Prevention**: Adding validation prevents future inconsistencies
4. **Low Risk**: Only 9 IDs, script handles all changes automatically
5. **High Value**: Establishes consistent pattern going forward

### ⚠️ **Considerations**:

1. **Breaking Changes**: If these IDs are used in save files or external APIs, migration needed
2. **Test Updates**: Any tests referencing these IDs need updates
3. **Documentation**: Update any docs that reference these IDs

## Recommendation

**✅ YES, it's worth fixing**

**Reasons:**
- Small scope (only 9 IDs)
- Automated script handles everything
- Establishes consistency
- Prevents future issues
- Aligns with documented conventions

**Estimated Effort:**
- Script execution: 2 minutes
- Review & testing: 10 minutes
- Total: ~15 minutes

**Risk Level:** Low (automated, reversible)

## Next Steps

1. Run the conversion script (dry-run first)
2. Review changes
3. Run tests to verify
4. Update Zod schema for validation
5. Commit changes

## Files That Will Change

1. `apps/vale-v2/src/data/definitions/abilities.ts` - Main changes
2. `apps/vale-v2/src/data/schemas/AbilitySchema.ts` - Add validation
3. Any files referencing these ability IDs (if found)

## Verification

After conversion, verify:
- ✅ All IDs are kebab-case
- ✅ ABILITIES Record keys match IDs
- ✅ TypeScript compiles
- ✅ Tests pass
- ✅ No broken references

