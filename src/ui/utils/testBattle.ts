/**
 * Test battle setup utility
 * Creates a simple test battle for development
 */

import { createUnit } from '../../core/models/Unit';
import { createTeam } from '../../core/models/Team';
import { startBattle } from '../../core/services/BattleService';
import { makePRNG } from '../../core/random/prng';
import type { UnitDefinition } from '../../data/schemas/UnitSchema';
import { STRIKE, FIREBALL, HEAL } from '../../data/definitions/abilities';
import { collectDjinn, equipDjinn } from '../../core/services/DjinnService';

// Simple test unit definition
const testUnitDef: UnitDefinition = {
  id: 'test-warrior',
  name: 'Test Warrior',
  element: 'Venus',
  role: 'Balanced Warrior',
  baseStats: {
    hp: 100,
    pp: 20,
    atk: 15,
    def: 10,
    mag: 5,
    spd: 12,
  },
  growthRates: {
    hp: 20,
    pp: 5,
    atk: 3,
    def: 2,
    mag: 2,
    spd: 1,
  },
  abilities: [STRIKE, FIREBALL, HEAL], // Give players some abilities
  manaContribution: 1,
  description: 'A test warrior',
  autoAttackTiming: 'same-turn',
};

// Simple test enemy unit definition (using UnitDefinition format)
const testEnemyDef: UnitDefinition = {
  id: 'test-goblin',
  name: 'Test Goblin',
  element: 'Neutral',
  role: 'Balanced Warrior',
  baseStats: {
    hp: 50,
    pp: 10,
    atk: 8,
    def: 5,
    mag: 2,
    spd: 8,
  },
  growthRates: {
    hp: 10,
    pp: 2,
    atk: 2,
    def: 1,
    mag: 1,
    spd: 1,
  },
  abilities: [STRIKE], // Give enemies basic strike ability
  manaContribution: 1,
  description: 'A test goblin',
  autoAttackTiming: 'same-turn',
};

export function createTestBattle() {
  // Create test units with unique IDs
  const unit1 = createUnit({ ...testUnitDef, id: 'test-warrior-1', name: 'Test Warrior' }, 1, 0);
  const unit2 = createUnit({ ...testUnitDef, id: 'test-warrior-2', name: 'Test Warrior 2' }, 1, 0);
  const unit3 = createUnit({ ...testUnitDef, id: 'test-warrior-3', name: 'Test Warrior 3' }, 1, 0);
  const unit4 = createUnit({ ...testUnitDef, id: 'test-warrior-4', name: 'Test Warrior 4' }, 1, 0);

  // Create test enemies
  const enemy1 = createUnit(
    {
      ...testEnemyDef,
      id: 'enemy-1',
      name: 'Goblin 1',
    },
    1,
    0
  );
  const enemy2 = createUnit(
    {
      ...testEnemyDef,
      id: 'enemy-2',
      name: 'Goblin 2',
    },
    1,
    0
  );

  // Create team
  const team = createTeam([unit1, unit2, unit3, unit4]);

  // Add test Djinn (Flint) for testing
  let teamWithDjinn = team;
  const collectResult = collectDjinn(teamWithDjinn, 'flint');
  if (collectResult.ok) {
    teamWithDjinn = collectResult.value;
    const equipResult = equipDjinn(teamWithDjinn, 'flint');
    if (equipResult.ok) {
      teamWithDjinn = equipResult.value;
    }
  }

  // Start battle
  const seed = 12345;
  const rng = makePRNG(seed);
  const battleState = startBattle(teamWithDjinn, [enemy1, enemy2], rng);

  return { battleState, seed };
}
