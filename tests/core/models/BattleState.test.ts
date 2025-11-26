import { describe, test, expect } from 'vitest';
import {
  createBattleState,
  updateBattleState,
  buildUnitIndex,
  calculateTeamManaPool,
  getEncounterId,
} from '../../../src/core/models/BattleState';
import { createTeam } from '../../../src/core/models/Team';
import { createUnit } from '../../../src/core/models/Unit';
import type { UnitDefinition } from '../../../src/core/models/Unit';
import { BattleStateSchema } from '../../../src/data/schemas/BattleStateSchema';

describe('BattleState Model', () => {
  const createSampleUnit = (id: string): ReturnType<typeof createUnit> => {
    const definition: UnitDefinition = {
      id,
      name: `Unit ${id}`,
      element: 'Venus',
      role: 'Balanced Warrior',
      baseStats: {
        hp: 100,
        pp: 20,
        atk: 10,
        def: 8,
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
      abilities: [],
      manaContribution: 1,
      description: 'A test unit',
    };

    return createUnit(definition, 1, 0);
  };

  test('should create battle state', () => {
    const playerUnits = [
      createSampleUnit('player1'),
      createSampleUnit('player2'),
      createSampleUnit('player3'),
      createSampleUnit('player4'),
    ];

    const enemyUnits = [createSampleUnit('enemy1')];

    const team = createTeam(playerUnits);
    const battleState = createBattleState(team, enemyUnits);

    expect(battleState.playerTeam).toEqual(team);
    expect(battleState.enemies).toHaveLength(1);
    expect(battleState.currentTurn).toBe(0);
    expect(battleState.currentActorIndex).toBe(0);
    expect(battleState.status).toBe('ongoing');
    expect(battleState.log).toEqual([]);
  });

  test('should update battle state immutably', () => {
    const playerUnits = [
      createSampleUnit('player1'),
      createSampleUnit('player2'),
      createSampleUnit('player3'),
      createSampleUnit('player4'),
    ];

    const enemyUnits = [createSampleUnit('enemy1')];
    const team = createTeam(playerUnits);
    const battleState = createBattleState(team, enemyUnits);

    const updated = updateBattleState(battleState, {
      status: 'PLAYER_VICTORY',
      currentTurn: 5,
    });

    expect(battleState.status).toBe('ongoing'); // Original unchanged
    expect(updated.status).toBe('PLAYER_VICTORY'); // New object updated
    expect(updated.currentTurn).toBe(5);
  });

  test('should validate battle state against schema', () => {
    const playerUnits = [
      createSampleUnit('player1'),
      createSampleUnit('player2'),
      createSampleUnit('player3'),
      createSampleUnit('player4'),
    ];

    const enemyUnits = [createSampleUnit('enemy1')];
    const team = createTeam(playerUnits);
    const battleState = createBattleState(team, enemyUnits, ['player1', 'enemy1']);

    const result = BattleStateSchema.safeParse(battleState);
    expect(result.success).toBe(true);
  });

  describe('buildUnitIndex', () => {
    test('should build index for player units', () => {
      const playerUnits = [createSampleUnit('player1'), createSampleUnit('player2')];
      const enemyUnits: ReturnType<typeof createUnit>[] = [];

      const index = buildUnitIndex(playerUnits, enemyUnits);

      expect(index.size).toBe(2);
      expect(index.get('player1')?.isPlayer).toBe(true);
      expect(index.get('player1')?.unit.id).toBe('player1');
      expect(index.get('player2')?.isPlayer).toBe(true);
    });

    test('should build index for enemy units', () => {
      const playerUnits: ReturnType<typeof createUnit>[] = [];
      const enemyUnits = [createSampleUnit('enemy1'), createSampleUnit('enemy2')];

      const index = buildUnitIndex(playerUnits, enemyUnits);

      expect(index.size).toBe(2);
      expect(index.get('enemy1')?.isPlayer).toBe(false);
      expect(index.get('enemy1')?.unit.id).toBe('enemy1');
      expect(index.get('enemy2')?.isPlayer).toBe(false);
    });

    test('should build index for mixed player and enemy units', () => {
      const playerUnits = [createSampleUnit('player1'), createSampleUnit('player2')];
      const enemyUnits = [createSampleUnit('enemy1'), createSampleUnit('enemy2')];

      const index = buildUnitIndex(playerUnits, enemyUnits);

      expect(index.size).toBe(4);
      expect(index.get('player1')?.isPlayer).toBe(true);
      expect(index.get('player2')?.isPlayer).toBe(true);
      expect(index.get('enemy1')?.isPlayer).toBe(false);
      expect(index.get('enemy2')?.isPlayer).toBe(false);
    });

    test('should return empty index for no units', () => {
      const index = buildUnitIndex([], []);

      expect(index.size).toBe(0);
    });

    test('should store unit reference in index', () => {
      const player = createSampleUnit('player1');
      const index = buildUnitIndex([player], []);

      expect(index.get('player1')?.unit).toBe(player);
    });
  });

  describe('calculateTeamManaPool', () => {
    test('should calculate mana pool from single unit', () => {
      const unit = createSampleUnit('unit1');
      const team = createTeam([unit]);

      const mana = calculateTeamManaPool(team);

      expect(mana).toBe(1); // Default manaContribution is 1
    });

    test('should calculate mana pool from multiple units', () => {
      const units = [
        createSampleUnit('unit1'),
        createSampleUnit('unit2'),
        createSampleUnit('unit3'),
        createSampleUnit('unit4'),
      ];
      const team = createTeam(units);

      const mana = calculateTeamManaPool(team);

      expect(mana).toBe(4); // 4 units × 1 mana each
    });

    test('should sum varied mana contributions', () => {
      const definition: UnitDefinition = {
        id: 'mage',
        name: 'Mage',
        element: 'Venus',
        role: 'Elemental Mage',
        baseStats: { hp: 80, pp: 40, atk: 5, def: 5, mag: 15, spd: 10 },
        growthRates: { hp: 15, pp: 8, atk: 2, def: 1, mag: 3, spd: 2 },
        abilities: [],
        manaContribution: 3, // High mana contribution
        description: 'A mage',
      };

      const mage = createUnit(definition, 1, 0);
      const warrior = createSampleUnit('warrior');
      const team = createTeam([mage, warrior]);

      const mana = calculateTeamManaPool(team);

      expect(mana).toBe(4); // 3 (mage) + 1 (warrior)
    });

    test('should return 0 for units with 0 mana contribution', () => {
      const definition: UnitDefinition = {
        id: 'no-mana',
        name: 'No Mana',
        element: 'Neutral',
        role: 'Balanced Warrior',
        baseStats: { hp: 100, pp: 0, atk: 10, def: 8, mag: 0, spd: 12 },
        growthRates: { hp: 20, pp: 0, atk: 3, def: 2, mag: 0, spd: 1 },
        abilities: [],
        manaContribution: 0,
        description: 'No mana',
      };

      const unit = createUnit(definition, 1, 0);
      const team = createTeam([unit]);

      const mana = calculateTeamManaPool(team);

      expect(mana).toBe(0);
    });
  });

  describe('getEncounterId', () => {
    test('should return canonical meta.encounterId when present', () => {
      const team = createTeam([createSampleUnit('player1')]);
      const battle = createBattleState(team, [createSampleUnit('enemy1')]);
      const withMeta = {
        ...battle,
        meta: { encounterId: 'house-1-battle' },
      };

      const encounterId = getEncounterId(withMeta);

      expect(encounterId).toBe('house-1-battle');
    });

    test('should fallback to deprecated encounterId when meta missing', () => {
      const team = createTeam([createSampleUnit('player1')]);
      const battle = createBattleState(team, [createSampleUnit('enemy1')]);
      const withDeprecated = {
        ...battle,
        encounterId: 'old-style-encounter',
      };

      const encounterId = getEncounterId(withDeprecated);

      expect(encounterId).toBe('old-style-encounter');
    });

    test('should prefer meta.encounterId over deprecated field', () => {
      const team = createTeam([createSampleUnit('player1')]);
      const battle = createBattleState(team, [createSampleUnit('enemy1')]);
      const withBoth = {
        ...battle,
        encounterId: 'old-style',
        meta: { encounterId: 'new-style' },
      };

      const encounterId = getEncounterId(withBoth);

      expect(encounterId).toBe('new-style'); // Prefers meta.encounterId
    });

    test('should return undefined when no encounterId present', () => {
      const team = createTeam([createSampleUnit('player1')]);
      const battle = createBattleState(team, [createSampleUnit('enemy1')]);

      const encounterId = getEncounterId(battle);

      expect(encounterId).toBeUndefined();
    });
  });

  describe('unit index rebuild on update', () => {
    test('should rebuild unit index when playerTeam changes', () => {
      const playerUnits = [createSampleUnit('player1')];
      const enemyUnits = [createSampleUnit('enemy1')];
      const team = createTeam(playerUnits);
      const battle = createBattleState(team, enemyUnits);

      const newPlayerUnits = [createSampleUnit('player1'), createSampleUnit('player2')];
      const newTeam = createTeam(newPlayerUnits);
      const updated = updateBattleState(battle, { playerTeam: newTeam });

      expect(updated.unitById.size).toBe(3); // 2 players + 1 enemy
      expect(updated.unitById.get('player2')).toBeDefined();
    });

    test('should rebuild unit index when enemies change', () => {
      const playerUnits = [createSampleUnit('player1')];
      const enemyUnits = [createSampleUnit('enemy1')];
      const team = createTeam(playerUnits);
      const battle = createBattleState(team, enemyUnits);

      const newEnemies = [createSampleUnit('enemy1'), createSampleUnit('enemy2')];
      const updated = updateBattleState(battle, { enemies: newEnemies });

      expect(updated.unitById.size).toBe(3); // 1 player + 2 enemies
      expect(updated.unitById.get('enemy2')).toBeDefined();
    });

    test('should not rebuild index when units unchanged', () => {
      const playerUnits = [createSampleUnit('player1')];
      const enemyUnits = [createSampleUnit('enemy1')];
      const team = createTeam(playerUnits);
      const battle = createBattleState(team, enemyUnits);

      const originalIndex = battle.unitById;
      const updated = updateBattleState(battle, { currentTurn: 5 });

      expect(updated.unitById).toBe(originalIndex); // Same reference, no rebuild
    });
  });

  describe('createBattleState mana initialization', () => {
    test('should initialize mana from team', () => {
      const units = [
        createSampleUnit('unit1'),
        createSampleUnit('unit2'),
        createSampleUnit('unit3'),
      ];
      const team = createTeam(units);
      const battle = createBattleState(team, [createSampleUnit('enemy1')]);

      expect(battle.maxMana).toBe(3);
      expect(battle.remainingMana).toBe(3);
    });

    test('should initialize battle with planning phase', () => {
      const team = createTeam([createSampleUnit('player1')]);
      const battle = createBattleState(team, [createSampleUnit('enemy1')]);

      expect(battle.phase).toBe('planning');
      expect(battle.status).toBe('ongoing');
      expect(battle.roundNumber).toBe(1);
    });

    test('should initialize empty queue matching team size', () => {
      const units = [createSampleUnit('unit1'), createSampleUnit('unit2')];
      const team = createTeam(units);
      const battle = createBattleState(team, [createSampleUnit('enemy1')]);

      expect(battle.queuedActions).toHaveLength(2);
      expect(battle.queuedActions[0]).toBeNull();
      expect(battle.queuedActions[1]).toBeNull();
      expect(battle.currentQueueIndex).toBe(0);
    });
  });
});

