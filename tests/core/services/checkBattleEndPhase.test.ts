import { describe, expect, test } from 'vitest';
import { mkBattle } from '../../../src/test/factories';
import { updateBattleState } from '../../../src/core/models/BattleState';
import { updateTeam } from '../../../src/core/models/Team';
import { queueBattleServiceInternals } from '../../../src/core/services/QueueBattleService';

const { checkBattleEndPhase } = queueBattleServiceInternals;

describe('checkBattleEndPhase', () => {
  const battle = mkBattle({});
  const alivePlayers = battle.playerTeam;
  const aliveEnemies = battle.enemies;

  test('returns victory when all enemies are KO', () => {
    const enemyKO = aliveEnemies.map(enemy => ({ ...enemy, currentHp: 0 }));
    const state = updateBattleState(battle, { enemies: enemyKO });
    expect(checkBattleEndPhase(state)).toBe('PLAYER_VICTORY');
  });

  test('returns defeat when all players are KO', () => {
    const playerKO = updateTeam(alivePlayers, {
      units: alivePlayers.units.map(unit => ({ ...unit, currentHp: 0 })),
    });
    const state = updateBattleState(battle, { playerTeam: playerKO });
    expect(checkBattleEndPhase(state)).toBe('PLAYER_DEFEAT');
  });

  test('treats simultaneous wipe-out as defeat', () => {
    const enemyKO = aliveEnemies.map(enemy => ({ ...enemy, currentHp: 0 }));
    const playerKO = updateTeam(alivePlayers, {
      units: alivePlayers.units.map(unit => ({ ...unit, currentHp: 0 })),
    });
    const state = updateBattleState(battle, {
      enemies: enemyKO,
      playerTeam: playerKO,
    });
    expect(checkBattleEndPhase(state)).toBe('PLAYER_DEFEAT');
  });

  test('returns null when battle is ongoing', () => {
    expect(checkBattleEndPhase(battle)).toBeNull();
  });
});
