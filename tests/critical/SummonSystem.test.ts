import { describe, test, expect } from 'vitest';
import { Unit } from '@/types/Unit';
import { createTeam, equipDjinn, executeSummon, activateDjinn, advanceTurn, getStandbyDjinn, getSetDjinn } from '@/types/Team';
import { ISAAC, GARET, MIA } from '@/data/unitDefinitions';
import { FLINT, GRANITE, BANE, FORGE, CORONA, FURY, FIZZ, TONIC, CRYSTAL } from '@/data/djinn';
import { isOk, isErr } from '@/utils/Result';

/**
 * CRITICAL: Summon System Has MINIMAL Test Coverage
 *
 * Summons are a MAJOR gameplay feature but barely tested.
 * These tests check if the summon mechanics actually work.
 */
describe('CRITICAL: Summon System Mechanics', () => {

  test('✅ Titan summon (3 Venus Djinn) deals correct damage', () => {
    const isaac = new Unit(ISAAC, 5);
    const garet = new Unit(GARET, 5);
    const mia = new Unit(MIA, 5);

    // Enable Djinn activation for all units
    isaac.recordDamageDealt(100);
    garet.recordDamageDealt(100);
    mia.recordDamageDealt(100);

    let team = createTeam([isaac, garet, mia]);
    team.collectedDjinn = [FLINT, GRANITE, BANE];

    const equipped = equipDjinn(team, [FLINT, GRANITE, BANE]);
    expect(isOk(equipped)).toBe(true);

    if (isOk(equipped)) {
      team = equipped.value;

      // Activate all 3 using different units (1 per unit per turn)
      const result1 = activateDjinn(team, 'flint', isaac);
      expect(isOk(result1)).toBe(true);
      if (isOk(result1)) team = result1.value;

      const result2 = activateDjinn(team, 'granite', garet);
      expect(isOk(result2)).toBe(true);
      if (isOk(result2)) team = result2.value;

      const result3 = activateDjinn(team, 'bane', mia);
      expect(isOk(result3)).toBe(true);
      if (isOk(result3)) team = result3.value;

      const standby = getStandbyDjinn(team);
      expect(standby).toHaveLength(3);

      // Execute Titan summon
      const summonResult = executeSummon(team, 'Titan', isaac.stats.mag);
      expect(isOk(summonResult)).toBe(true);

      if (isOk(summonResult)) {
        const { damage, summonName } = summonResult.value;

        // Titan base damage: 250
        // Tier bonus: (1 + 2 + 3) × 20 = 120
        // MAG bonus: isaac.stats.mag × 0.5 = 20 × 0.5 = 10
        // Total: 250 + 120 + 10 = 380
        const expectedDamage = 250 + ((1 + 2 + 3) * 20) + Math.floor(isaac.stats.mag * 0.5);

        expect(summonName).toBe('Titan');
        expect(damage).toBe(expectedDamage);
      }
    }
  });

  test('✅ Phoenix summon (3 Mars Djinn) deals correct damage', () => {
    const garet = new Unit(GARET, 5);
    garet.recordDamageDealt(100);

    let team = createTeam([garet]);
    team.collectedDjinn = [FORGE, CORONA, FURY];

    const equipped = equipDjinn(team, [FORGE, CORONA, FURY]);
    expect(isOk(equipped)).toBe(true);

    if (isOk(equipped)) {
      team = equipped.value;

      const r1 = activateDjinn(team, 'forge', garet);
      if (isOk(r1)) team = r1.value;

      const r2 = activateDjinn(team, 'corona', garet);
      if (isOk(r2)) team = r2.value;

      const r3 = activateDjinn(team, 'fury', garet);
      if (isOk(r3)) team = r3.value;

      const summonResult = executeSummon(team, 'Phoenix', garet.stats.mag);
      expect(isOk(summonResult)).toBe(true);

      if (isOk(summonResult)) {
        const { damage, summonName } = summonResult.value;

        // Phoenix base damage: 280
        // Tier bonus: (1 + 2 + 3) × 20 = 120
        // MAG bonus: garet.stats.mag × 0.5
        const expectedDamage = 280 + 120 + Math.floor(garet.stats.mag * 0.5);

        expect(summonName).toBe('Phoenix');
        expect(damage).toBe(expectedDamage);
      }
    }
  });

  test('✅ Kraken summon (3 Mercury Djinn) deals correct damage', () => {
    const mia = new Unit(MIA, 5);
    mia.recordDamageDealt(100);

    let team = createTeam([mia]);
    team.collectedDjinn = [FIZZ, TONIC, CRYSTAL];

    const equipped = equipDjinn(team, [FIZZ, TONIC, CRYSTAL]);
    expect(isOk(equipped)).toBe(true);

    if (isOk(equipped)) {
      team = equipped.value;

      const r1 = activateDjinn(team, 'fizz', mia);
      if (isOk(r1)) team = r1.value;

      const r2 = activateDjinn(team, 'tonic', mia);
      if (isOk(r2)) team = r2.value;

      const r3 = activateDjinn(team, 'crystal', mia);
      if (isOk(r3)) team = r3.value;

      const summonResult = executeSummon(team, 'Kraken', mia.stats.mag);
      expect(isOk(summonResult)).toBe(true);

      if (isOk(summonResult)) {
        const { damage } = summonResult.value;

        // Kraken base damage: 220 (lowest)
        const expectedDamage = 220 + 120 + Math.floor(mia.stats.mag * 0.5);

        expect(damage).toBe(expectedDamage);
      }
    }
  });

  test('✅ After summon, all 3 Djinn go to Recovery state', () => {
    const isaac = new Unit(ISAAC, 5);
    isaac.recordDamageDealt(100);

    let team = createTeam([isaac]);
    team.collectedDjinn = [FLINT, GRANITE, BANE];

    const equipped = equipDjinn(team, [FLINT, GRANITE, BANE]);
    if (isOk(equipped)) {
      team = equipped.value;

      const r1 = activateDjinn(team, 'flint', isaac);
      if (isOk(r1)) team = r1.value;

      const r2 = activateDjinn(team, 'granite', isaac);
      if (isOk(r2)) team = r2.value;

      const r3 = activateDjinn(team, 'bane', isaac);
      if (isOk(r3)) team = r3.value;

      expect(getStandbyDjinn(team)).toHaveLength(3);

      const summonResult = executeSummon(team, 'Titan', isaac.stats.mag);
      expect(isOk(summonResult)).toBe(true);

      if (isOk(summonResult)) {
        const newTeam = summonResult.value.team;

        // All 3 should be in Recovery
        expect(getStandbyDjinn(newTeam)).toHaveLength(0);

        const tracker1 = newTeam.djinnTrackers.get('flint');
        const tracker2 = newTeam.djinnTrackers.get('granite');
        const tracker3 = newTeam.djinnTrackers.get('bane');

        expect(tracker1?.state).toBe('Recovery');
        expect(tracker2?.state).toBe('Recovery');
        expect(tracker3?.state).toBe('Recovery');
      }
    }
  });
});

describe('EDGE CASES: Summon System Failures', () => {

  test('❌ FAIL: Cannot summon with only 2 Djinn in Standby', () => {
    const isaac = new Unit(ISAAC, 5);
    isaac.recordDamageDealt(100);

    let team = createTeam([isaac]);
    team.collectedDjinn = [FLINT, GRANITE];

    const equipped = equipDjinn(team, [FLINT, GRANITE]);
    if (isOk(equipped)) {
      team = equipped.value;

      const r1 = activateDjinn(team, 'flint', isaac);
      if (isOk(r1)) team = r1.value;

      const r2 = activateDjinn(team, 'granite', isaac);
      if (isOk(r2)) team = r2.value;

      expect(getStandbyDjinn(team)).toHaveLength(2);

      const summonResult = executeSummon(team, 'Titan', isaac.stats.mag);
      expect(isErr(summonResult)).toBe(true);

      if (isErr(summonResult)) {
        expect(summonResult.error).toContain('Need 3 Standby Djinn');
        expect(summonResult.error).toContain('currently have 2');
      }
    }
  });

  test('❌ FAIL: Cannot summon with 0 Djinn in Standby', () => {
    const isaac = new Unit(ISAAC, 5);
    const team = createTeam([isaac]);

    const summonResult = executeSummon(team, 'Titan', isaac.stats.mag);
    expect(isErr(summonResult)).toBe(true);

    if (isErr(summonResult)) {
      expect(summonResult.error).toContain('Need 3 Standby Djinn');
      expect(summonResult.error).toContain('currently have 0');
    }
  });

  test('❌ FAIL: Cannot summon Titan with 3 Mars Djinn (wrong element)', () => {
    const isaac = new Unit(ISAAC, 5);
    isaac.recordDamageDealt(100);

    let team = createTeam([isaac]);
    team.collectedDjinn = [FORGE, CORONA, FURY];

    const equipped = equipDjinn(team, [FORGE, CORONA, FURY]);
    if (isOk(equipped)) {
      team = equipped.value;

      const r1 = activateDjinn(team, 'forge', isaac);
      if (isOk(r1)) team = r1.value;

      const r2 = activateDjinn(team, 'corona', isaac);
      if (isOk(r2)) team = r2.value;

      const r3 = activateDjinn(team, 'fury', isaac);
      if (isOk(r3)) team = r3.value;

      expect(getStandbyDjinn(team)).toHaveLength(3);

      const summonResult = executeSummon(team, 'Titan', isaac.stats.mag);
      expect(isErr(summonResult)).toBe(true);

      if (isErr(summonResult)) {
        expect(summonResult.error).toContain('Titan requires 3 Venus Djinn');
      }
    }
  });

  test('❌ FAIL: Cannot summon with mixed elements (2 Venus + 1 Mars)', () => {
    const isaac = new Unit(ISAAC, 5);
    isaac.recordDamageDealt(100);

    let team = createTeam([isaac]);
    team.collectedDjinn = [FLINT, GRANITE, FORGE]; // 2 Venus, 1 Mars

    const equipped = equipDjinn(team, [FLINT, GRANITE, FORGE]);
    if (isOk(equipped)) {
      team = equipped.value;

      const r1 = activateDjinn(team, 'flint', isaac);
      if (isOk(r1)) team = r1.value;

      const r2 = activateDjinn(team, 'granite', isaac);
      if (isOk(r2)) team = r2.value;

      const r3 = activateDjinn(team, 'forge', isaac);
      if (isOk(r3)) team = r3.value;

      expect(getStandbyDjinn(team)).toHaveLength(3);

      const summonResult = executeSummon(team, 'Titan', isaac.stats.mag);
      expect(isErr(summonResult)).toBe(true);

      if (isErr(summonResult)) {
        expect(summonResult.error).toContain('requires 3 Venus Djinn');
      }
    }
  });
});

describe('CRITICAL: Summon Recovery Mechanics', () => {

  test('✅ Djinn return to Set after 3 turns in Recovery', () => {
    const isaac = new Unit(ISAAC, 5);
    isaac.recordDamageDealt(100);

    let team = createTeam([isaac]);
    team.collectedDjinn = [FLINT, GRANITE, BANE];

    const equipped = equipDjinn(team, [FLINT, GRANITE, BANE]);
    if (isOk(equipped)) {
      team = equipped.value;

      const r1 = activateDjinn(team, 'flint', isaac);
      if (isOk(r1)) team = r1.value;

      const r2 = activateDjinn(team, 'granite', isaac);
      if (isOk(r2)) team = r2.value;

      const r3 = activateDjinn(team, 'bane', isaac);
      if (isOk(r3)) team = r3.value;

      const summonResult = executeSummon(team, 'Titan', isaac.stats.mag);
      expect(isOk(summonResult)).toBe(true);

      if (isOk(summonResult)) {
        team = summonResult.value.team;

        // Turn 0: All in Recovery
        expect(getStandbyDjinn(team)).toHaveLength(0);

        // Turn 1
        team = advanceTurn(team);
        expect(getStandbyDjinn(team)).toHaveLength(0);

        // Turn 2
        team = advanceTurn(team);
        expect(getStandbyDjinn(team)).toHaveLength(0);

        // Turn 3: All return to Set
        team = advanceTurn(team);

        const setDjinn = getSetDjinn(team);
        expect(setDjinn).toHaveLength(3);

        const tracker1 = team.djinnTrackers.get('flint');
        const tracker2 = team.djinnTrackers.get('granite');
        const tracker3 = team.djinnTrackers.get('bane');

        expect(tracker1?.state).toBe('Set');
        expect(tracker2?.state).toBe('Set');
        expect(tracker3?.state).toBe('Set');
      }
    }
  });
});

describe('BROKEN?: Summon System Exploits', () => {

  test('EXPLOIT: What if caster has 0 MAG? (summon still works?)', () => {
    const isaac = new Unit(ISAAC, 5);
    isaac.recordDamageDealt(100);

    let team = createTeam([isaac]);
    team.collectedDjinn = [FLINT, GRANITE, BANE];

    const equipped = equipDjinn(team, [FLINT, GRANITE, BANE]);
    if (isOk(equipped)) {
      team = equipped.value;

      const r1 = activateDjinn(team, 'flint', isaac);
      if (isOk(r1)) team = r1.value;

      const r2 = activateDjinn(team, 'granite', isaac);
      if (isOk(r2)) team = r2.value;

      const r3 = activateDjinn(team, 'bane', isaac);
      if (isOk(r3)) team = r3.value;

      // Execute summon with 0 MAG
      const summonResult = executeSummon(team, 'Titan', 0);
      expect(isOk(summonResult)).toBe(true);

      if (isOk(summonResult)) {
        const { damage } = summonResult.value;

        // Damage: 250 + 120 + 0 = 370
        expect(damage).toBe(370);

        // Summon should still work (MAG just reduces damage)
      }
    }
  });

  test('EXPLOIT: What if caster has NEGATIVE MAG?', () => {
    const isaac = new Unit(ISAAC, 5);
    isaac.recordDamageDealt(100);

    let team = createTeam([isaac]);
    team.collectedDjinn = [FLINT, GRANITE, BANE];

    const equipped = equipDjinn(team, [FLINT, GRANITE, BANE]);
    if (isOk(equipped)) {
      team = equipped.value;

      const r1 = activateDjinn(team, 'flint', isaac);
      if (isOk(r1)) team = r1.value;

      const r2 = activateDjinn(team, 'granite', isaac);
      if (isOk(r2)) team = r2.value;

      const r3 = activateDjinn(team, 'bane', isaac);
      if (isOk(r3)) team = r3.value;

      // Execute summon with negative MAG
      const summonResult = executeSummon(team, 'Titan', -100);
      expect(isOk(summonResult)).toBe(true);

      if (isOk(summonResult)) {
        const { damage } = summonResult.value;

        // Damage: 250 + 120 + floor(-100 × 0.5) = 250 + 120 - 50 = 320
        expect(damage).toBe(320);

        // ⚠️ Negative MAG REDUCES summon damage!
      }
    }
  });

  test('EXPLOIT: What if caster has MASSIVE MAG? (overflow?)', () => {
    const isaac = new Unit(ISAAC, 5);
    isaac.recordDamageDealt(100);

    let team = createTeam([isaac]);
    team.collectedDjinn = [FLINT, GRANITE, BANE];

    const equipped = equipDjinn(team, [FLINT, GRANITE, BANE]);
    if (isOk(equipped)) {
      team = equipped.value;

      const r1 = activateDjinn(team, 'flint', isaac);
      if (isOk(r1)) team = r1.value;

      const r2 = activateDjinn(team, 'granite', isaac);
      if (isOk(r2)) team = r2.value;

      const r3 = activateDjinn(team, 'bane', isaac);
      if (isOk(r3)) team = r3.value;

      // Execute summon with absurd MAG
      const summonResult = executeSummon(team, 'Titan', 10000);
      expect(isOk(summonResult)).toBe(true);

      if (isOk(summonResult)) {
        const { damage } = summonResult.value;

        // Damage: 250 + 120 + 5000 = 5370
        expect(damage).toBe(5370);

        // ⚠️ No damage cap! Summon can deal infinite damage!
      }
    }
  });
});

describe('CORRECTNESS: Summon Damage Formulas', () => {

  test('Phoenix (280 base) deals more damage than Titan (250 base)', () => {
    const isaac = new Unit(ISAAC, 5);
    const garet = new Unit(GARET, 5);
    isaac.recordDamageDealt(100);
    garet.recordDamageDealt(100);

    let team1 = createTeam([isaac]);
    team1.collectedDjinn = [FLINT, GRANITE, BANE];

    let team2 = createTeam([garet]);
    team2.collectedDjinn = [FORGE, CORONA, FURY];

    const equipped1 = equipDjinn(team1, [FLINT, GRANITE, BANE]);
    const equipped2 = equipDjinn(team2, [FORGE, CORONA, FURY]);

    if (isOk(equipped1) && isOk(equipped2)) {
      team1 = equipped1.value;
      team2 = equipped2.value;

      // Activate Titan's Djinn
      const t1 = activateDjinn(team1, 'flint', isaac);
      if (isOk(t1)) team1 = t1.value;
      const t2 = activateDjinn(team1, 'granite', isaac);
      if (isOk(t2)) team1 = t2.value;
      const t3 = activateDjinn(team1, 'bane', isaac);
      if (isOk(t3)) team1 = t3.value;

      // Activate Phoenix's Djinn
      const p1 = activateDjinn(team2, 'forge', garet);
      if (isOk(p1)) team2 = p1.value;
      const p2 = activateDjinn(team2, 'corona', garet);
      if (isOk(p2)) team2 = p2.value;
      const p3 = activateDjinn(team2, 'fury', garet);
      if (isOk(p3)) team2 = p3.value;

      const titanResult = executeSummon(team1, 'Titan', isaac.stats.mag);
      const phoenixResult = executeSummon(team2, 'Phoenix', garet.stats.mag);

      if (isOk(titanResult) && isOk(phoenixResult)) {
        const titanDamage = titanResult.value.damage;
        const phoenixDamage = phoenixResult.value.damage;

        // Phoenix should deal more (280 vs 250 base)
        expect(phoenixDamage).toBeGreaterThan(titanDamage);

        // Difference should be ~30 (base diff) but MAG bonuses may vary by ±1
        expect(phoenixDamage - titanDamage).toBeGreaterThanOrEqual(29);
      }
    }
  });

  test('MAG scaling: 100 MAG adds 50 damage to summon', () => {
    const isaac = new Unit(ISAAC, 5);
    isaac.recordDamageDealt(100);

    let team = createTeam([isaac]);
    team.collectedDjinn = [FLINT, GRANITE, BANE];

    const equipped = equipDjinn(team, [FLINT, GRANITE, BANE]);
    if (isOk(equipped)) {
      team = equipped.value;

      const r1 = activateDjinn(team, 'flint', isaac);
      if (isOk(r1)) team = r1.value;

      const r2 = activateDjinn(team, 'granite', isaac);
      if (isOk(r2)) team = r2.value;

      const r3 = activateDjinn(team, 'bane', isaac);
      if (isOk(r3)) team = r3.value;

      const lowMagResult = executeSummon(team, 'Titan', 20);
      const highMagResult = executeSummon(team, 'Titan', 120);

      if (isOk(lowMagResult) && isOk(highMagResult)) {
        const lowDamage = lowMagResult.value.damage;
        const highDamage = highMagResult.value.damage;

        // Difference: floor(120 × 0.5) - floor(20 × 0.5) = 60 - 10 = 50
        expect(highDamage - lowDamage).toBe(50);
      }
    }
  });
});
