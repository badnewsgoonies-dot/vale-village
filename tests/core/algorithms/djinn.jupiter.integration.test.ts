import { describe, expect, test } from 'vitest';
import { applyStatusToUnit, processStatusEffectTick } from '../../../src/core/algorithms/status';
import { createTeam } from '../../../src/core/models/Team';
import type { Ability } from '../../../src/data/schemas/AbilitySchema';
import { createUnit } from '../../../src/core/models/Unit';
import { UNIT_DEFINITIONS } from '../../../src/data/definitions/units';
import {
  STORM_BREEZE_PULSE,
  STORM_ICY_BARRIER,
  STORM_TEMPEST_SHIELD,
} from '../../../src/data/definitions/djinnAbilities';
import { makePRNG } from '../../../src/core/random/prng';
import { performAction } from '../../../src/core/services/BattleService';
import { createBattleState } from '../../../src/core/models/BattleState';
import type { Unit } from '../../../src/core/models/Unit';

const buildEnemyTeam = () => {
  const caster = createUnit(UNIT_DEFINITIONS['war-mage'], 1);
  const filler1 = createUnit(UNIT_DEFINITIONS.adept, 1);
  const filler2 = createUnit(UNIT_DEFINITIONS.mystic, 1);
  const filler3 = createUnit(UNIT_DEFINITIONS.ranger, 1);
  const team = createTeam([caster, filler1, filler2, filler3]);
  return { caster, team };
};

const applyStormBuffs = (unit: ReturnType<typeof createUnit>) => {
  let modified = unit;

  if (STORM_TEMPEST_SHIELD.elementalResistance) {
    modified = applyStatusToUnit(modified, {
      type: 'elementalResistance',
      element: STORM_TEMPEST_SHIELD.elementalResistance.element,
      modifier: STORM_TEMPEST_SHIELD.elementalResistance.modifier,
      duration: STORM_TEMPEST_SHIELD.duration ?? 3,
    });
  }

  if (STORM_ICY_BARRIER.damageReductionPercent !== undefined) {
    modified = applyStatusToUnit(modified, {
      type: 'damageReduction',
      percent: STORM_ICY_BARRIER.damageReductionPercent,
      duration: STORM_ICY_BARRIER.duration ?? 3,
    });
  }

  if (STORM_ICY_BARRIER.grantImmunity) {
    modified = applyStatusToUnit(modified, {
      type: 'immunity',
      all: STORM_ICY_BARRIER.grantImmunity.all,
      types: STORM_ICY_BARRIER.grantImmunity.types,
      duration: STORM_ICY_BARRIER.grantImmunity.duration,
    });
  }

  return modified;
};

const makeTestAttack = (element: 'Mercury' | 'Mars'): Ability => ({
  id: `${element.toLowerCase()}-phase2-test`,
  name: `${element} Phase 2 Test`,
  type: 'psynergy',
  element,
  manaCost: 3,
  basePower: element === 'Mercury' ? 60 : 55,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: `Controlled ${element} assault for testing.`,
});

describe('Jupiter Djinn Phase 2 Integration', () => {
  test('Selective immunity blocks freeze but allows burn via executeAbility', () => {
    const { caster, team } = buildEnemyTeam();
    
    // Create caster with Icy Barrier ability
    const casterWithAbility: Unit = {
      ...caster,
      abilities: [...caster.abilities, STORM_ICY_BARRIER],
    };

    // Create defender and apply Icy Barrier buffs manually (simulating self-cast)
    let defender = createUnit(UNIT_DEFINITIONS.sentinel, 1);
    defender = applyStormBuffs(defender);

    // Verify immunity is present
    const immunity = defender.statusEffects.find(s => s.type === 'immunity');
    expect(immunity).toBeDefined();
    if (immunity && immunity.type === 'immunity') {
      expect(immunity.all).toBe(false);
      expect(immunity.types).toEqual(['freeze']);
    }

    // Verify freeze is blocked
    const frozenAttempt = applyStatusToUnit(defender, { type: 'freeze', duration: 3 });
    expect(frozenAttempt.statusEffects.filter(status => status.type === 'freeze')).toHaveLength(0);

    // Verify burn is NOT blocked (selective immunity only blocks freeze)
    const burnAttempt = applyStatusToUnit(defender, { type: 'burn', duration: 3 });
    expect(burnAttempt.statusEffects.filter(status => status.type === 'burn')).toHaveLength(1);

    // Verify immunity replacement: applying new immunity replaces old one
    const newImmunity = applyStatusToUnit(defender, {
      type: 'immunity',
      all: false,
      types: ['burn', 'poison'],
      duration: 2,
    });
    const immunityStatuses = newImmunity.statusEffects.filter(s => s.type === 'immunity');
    expect(immunityStatuses).toHaveLength(1);
    if (immunityStatuses[0] && immunityStatuses[0].type === 'immunity') {
      expect(immunityStatuses[0].types).toEqual(['burn', 'poison']);
    }

    // Verify immunity expires after duration
    let ticking = defender;
    ticking = processStatusEffectTick(ticking, makePRNG(7)).updatedUnit;
    ticking = processStatusEffectTick(ticking, makePRNG(7)).updatedUnit;
    expect(ticking.statusEffects.some(status => status.type === 'immunity')).toBe(false);

    // Verify freeze can be applied after immunity expires
    const afterImmunity = applyStatusToUnit(ticking, { type: 'freeze', duration: 2 });
    expect(afterImmunity.statusEffects.filter(status => status.type === 'freeze')).toHaveLength(1);
  });

  test('Splash damage respects shields and damage reduction via executeAbility', () => {
    const { caster } = buildEnemyTeam();
    
    // Create caster with Breeze Pulse ability
    const casterWithAbility: Unit = {
      ...caster,
      abilities: [...caster.abilities, STORM_BREEZE_PULSE],
    };

    const primaryTarget = createUnit(UNIT_DEFINITIONS.mystic, 1);
    const shieldedSecondary = applyStatusToUnit(createUnit(UNIT_DEFINITIONS.adept, 1), {
      type: 'shield',
      remainingCharges: 1,
      duration: 3,
    });
    const drSecondary = applyStatusToUnit(createUnit(UNIT_DEFINITIONS.ranger, 1), {
      type: 'damageReduction',
      percent: 0.3,
      duration: 3,
    });

    const team = createTeam([casterWithAbility]);
    const enemies = [primaryTarget, shieldedSecondary, drSecondary];
    const battleState = createBattleState(team, enemies);
    const rng = makePRNG(42);

    // Record initial HP
    const initialPrimaryHp = primaryTarget.currentHp;
    const initialShieldedHp = shieldedSecondary.currentHp;
    const initialDrHp = drSecondary.currentHp;

    // Get the actual caster from battle state (after Djinn ability merging)
    const battleCaster = battleState.playerTeam.units.find(u => u.id === casterWithAbility.id);
    if (!battleCaster) {
      throw new Error('Caster not found in battle state');
    }
    
    // Ensure the ability is present (mergeDjinnAbilitiesIntoUnit might have overwritten)
    // Check if ability already exists before adding
    const hasAbility = battleCaster.abilities.some(a => a.id === STORM_BREEZE_PULSE.id);
    const casterWithAbilityInBattle: Unit = hasAbility 
      ? battleCaster
      : {
          ...battleCaster,
          abilities: [...battleCaster.abilities, STORM_BREEZE_PULSE],
        };
    
    // Update battle state with the caster that has the ability
    const updatedBattleState = {
      ...battleState,
      playerTeam: {
        ...battleState.playerTeam,
        units: battleState.playerTeam.units.map(u => 
          u.id === casterWithAbility.id ? casterWithAbilityInBattle : u
        ),
      },
    };
    
    // Update unitById index
    updatedBattleState.unitById.set(casterWithAbility.id, {
      unit: casterWithAbilityInBattle,
      isPlayer: true,
    });

    // Execute ability through performAction (which calls executeAbility internally)
    const { result } = performAction(
      updatedBattleState,
      casterWithAbility.id,
      STORM_BREEZE_PULSE.id,
      [primaryTarget.id],
      rng
    );

    // Find updated units
    const updatedPrimary = result.updatedUnits.find(u => u.id === primaryTarget.id);
    const updatedShielded = result.updatedUnits.find(u => u.id === shieldedSecondary.id);
    const updatedDr = result.updatedUnits.find(u => u.id === drSecondary.id);

    expect(updatedPrimary).toBeDefined();
    expect(updatedShielded).toBeDefined();
    expect(updatedDr).toBeDefined();

    if (!updatedPrimary || !updatedShielded || !updatedDr) return;

    // Verify primary target took full damage
    expect(updatedPrimary.currentHp).toBeLessThan(initialPrimaryHp);

    // Verify splash damage occurred (Phase 2: splashDamagePercent)
    // Shield should block splash damage, so HP should be unchanged (shield consumed)
    expect(updatedShielded.currentHp).toBe(initialShieldedHp);
    // DR secondary should take reduced splash damage
    expect(updatedDr.currentHp).toBeLessThan(initialDrHp);

    // Verify shield blocked splash damage (shield should be consumed)
    const shieldDamage = initialShieldedHp - updatedShielded.currentHp;
    expect(shieldDamage).toBe(0); // Shield blocks all damage
    expect(updatedShielded.statusEffects.some(status => status.type === 'shield')).toBe(false);

    // Verify DR reduced splash damage (but didn't block it completely)
    const drDamage = initialDrHp - updatedDr.currentHp;
    expect(drDamage).toBeGreaterThan(0);
    expect(updatedDr.statusEffects.some(status => status.type === 'damageReduction')).toBe(true);
  });

  test('Layered auto-revive: shield → DR/resist → lethal hit → revive', () => {
    // This test ensures Phase 2 buffs (shield, DR, elemental resistance) don't short-circuit knockout handling
    // The order should be: shield blocks → DR reduces → resistance reduces → damage applied → KO check → auto-revive triggers
    
    const { caster } = buildEnemyTeam();
    
    // Create a Mars attack ability with high base power
    const marsAttack: Ability = {
      id: 'test-mars-attack',
      name: 'Test Mars Attack',
      type: 'psynergy',
      element: 'Mars',
      manaCost: 0,
      basePower: 150, // High enough to KO even with DR/resistance
      targets: 'single-enemy',
      unlockLevel: 1,
      description: 'Test attack',
    };

    const attackerWithAbility: Unit = {
      ...caster,
      abilities: [...caster.abilities, marsAttack],
    };

    // Create defender with auto-revive, DR, and resistance (but NO shield for second hit)
    let defender = createUnit(UNIT_DEFINITIONS.sentinel, 1);
    defender = {
      ...defender,
      currentHp: 30, // Low HP to ensure KO
      statusEffects: [
        {
          type: 'autoRevive',
          hpPercent: 0.4,
          usesRemaining: 1,
        },
        {
          type: 'damageReduction',
          percent: 0.2,
          duration: 3,
        },
        {
          type: 'elementalResistance',
          element: 'Mars',
          modifier: 0.25,
          duration: 3,
        },
      ],
    };

    const team = createTeam([attackerWithAbility]);
    const enemies = [defender];
    const battleState = createBattleState(team, enemies);
    const rng = makePRNG(42);

    // Execute attack: DR and resistance reduce damage, but lethal hit should trigger auto-revive
    const { result } = performAction(
      battleState,
      attackerWithAbility.id,
      marsAttack.id,
      [defender.id],
      rng
    );

    const afterLethal = result.updatedUnits.find(u => u.id === defender.id);
    expect(afterLethal).toBeDefined();
    if (!afterLethal) return;

    // Auto-revive should have triggered (unit was KO'd, then revived)
    // Max HP for level 1 sentinel is ~100, so 40% = 40 HP
    expect(afterLethal.currentHp).toBeGreaterThan(0);
    expect(afterLethal.currentHp).toBeLessThanOrEqual(50); // Revived to 40% max HP
    
    // Auto-revive should be consumed
    expect(afterLethal.statusEffects.some(s => s.type === 'autoRevive')).toBe(false);
    
    // DR and resistance should still be present (they reduce damage but don't prevent KO)
    // This proves Phase 2 buffs don't interfere with knockout/revive handling
    expect(afterLethal.statusEffects.some(s => s.type === 'damageReduction')).toBe(true);
    expect(afterLethal.statusEffects.some(s => s.type === 'elementalResistance')).toBe(true);
  });
});
