import { describe, test, expect, beforeEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import { applyDamage } from '@/core/algorithms/damage';
import { calculateMaxHp } from '@/core/models/Unit';
import { createBattleState } from '@/core/models/BattleState';
import { createTeam } from '@/core/models/Team';
import { BattleEvent } from '@/core/services/types';
import { executeRound } from '@/core/services/QueueBattleService';
import { mkEnemy, mkUnit } from '@/test/factories';
import { createStore } from '@/ui/state/store';
import { renderEventText } from '@/ui/utils/text';

vi.mock('@/core/services/QueueBattleService', async () => {
  const actual = await vi.importActual('@/core/services/QueueBattleService');
  return {
    ...actual,
    executeRound: vi.fn(),
  };
});

const executeRoundMock = executeRound as Mock;
const AUTO_HEAL_MESSAGE = 'All units restored to full health!';

const buildDamagedTeam = () => {
  const tank = applyDamage(mkUnit({ id: 'tank' }), 35);
  const bruiser = applyDamage(mkUnit({ id: 'bruiser' }), 25);
  const afflicted = {
    ...applyDamage(mkUnit({ id: 'healer' }), 15),
    statusEffects: [{ type: 'poison' as const, damagePerTurn: 8, duration: 3 }],
  };
  const ranger = mkUnit({ id: 'ranger' });
  return createTeam([tank, bruiser, afflicted, ranger]);
};

beforeEach(() => {
  executeRoundMock.mockReset();
});

describe('Auto-Heal Flow (Victory / Defeat)', () => {
  test('victory restores all units and logs event', () => {
    const team = buildDamagedTeam();
    const battle = {
      ...createBattleState(team, [mkEnemy()]),
      meta: { encounterId: 'training-dummy' },
    };

    const victoryState: BattleEvent = {
      type: 'battle-end',
      result: 'PLAYER_VICTORY',
    };

    executeRoundMock.mockReturnValueOnce({
      state: { ...battle, phase: 'victory', status: 'PLAYER_VICTORY' },
      events: [victoryState],
    });

    const store = createStore();
    store.getState().setTeam(team);
    store.getState().setBattle(battle, 1);

    store.getState().executeQueuedRound();

    const healedTeam = store.getState().team;
    expect(healedTeam).not.toBeNull();
    healedTeam?.units.forEach((unit) => {
      expect(unit.currentHp).toBe(calculateMaxHp(unit));
      expect(unit.statusEffects).toEqual([]);
    });

    const events = store.getState().events;
    expect(events).toEqual([
      victoryState,
      { type: 'auto-heal', message: AUTO_HEAL_MESSAGE },
    ]);
  });

  test('defeat still heals units and allows retry readiness', () => {
    const team = buildDamagedTeam();
    const battle = {
      ...createBattleState(team, [mkEnemy()]),
      meta: { encounterId: 'training-dummy' },
    };

    const defeatState: BattleEvent = {
      type: 'battle-end',
      result: 'PLAYER_DEFEAT',
    };

    executeRoundMock.mockReturnValueOnce({
      state: { ...battle, phase: 'defeat', status: 'PLAYER_DEFEAT' },
      events: [defeatState],
    });

    const store = createStore();
    store.getState().setTeam(team);
    store.getState().setBattle(battle, 2);

    store.getState().executeQueuedRound();

    const healedTeam = store.getState().team;
    expect(healedTeam).not.toBeNull();
    healedTeam?.units.forEach((unit) => {
      expect(unit.currentHp).toBe(calculateMaxHp(unit));
      expect(unit.statusEffects).toEqual([]);
    });

    const events = store.getState().events;
    expect(events).toEqual([
      defeatState,
      { type: 'auto-heal', message: AUTO_HEAL_MESSAGE },
    ]);
  });

  test('complete battle flow can win then lose with healed units', () => {
    const team = buildDamagedTeam();
    const firstBattle = {
      ...createBattleState(team, [mkEnemy()]),
      meta: { encounterId: 'training-dummy' },
    };
    const secondBattle = {
      ...createBattleState(team, [mkEnemy()]),
      meta: { encounterId: 'house-01' },
    };

    const victoryState: BattleEvent = {
      type: 'battle-end',
      result: 'PLAYER_VICTORY',
    };
    const defeatState: BattleEvent = {
      type: 'battle-end',
      result: 'PLAYER_DEFEAT',
    };

    executeRoundMock
      .mockReturnValueOnce({
        state: { ...firstBattle, phase: 'victory', status: 'PLAYER_VICTORY' },
        events: [victoryState],
      })
      .mockReturnValueOnce({
        state: { ...secondBattle, phase: 'defeat', status: 'PLAYER_DEFEAT' },
        events: [defeatState],
      });

    const store = createStore();
    store.getState().setTeam(team);
    store.getState().setBattle(firstBattle, 3);
    store.getState().executeQueuedRound();
    expect(store.getState().events.some((event) => event.type === 'auto-heal')).toBe(true);

    // Simulate second round (planning) after victory
    store.getState().setBattle(secondBattle, 4);
    store.getState().executeQueuedRound();

    const events = store.getState().events;
    expect(events.some((event) => event.type === 'auto-heal')).toBe(true);

    const healedTeam = store.getState().team;
    healedTeam?.units.forEach((unit) => {
      expect(unit.currentHp).toBe(calculateMaxHp(unit));
      expect(unit.statusEffects).toEqual([]);
    });
  });
});

describe('Battle log helper', () => {
  test('renders auto-heal message with sparkle', () => {
    const text = renderEventText({ type: 'auto-heal', message: AUTO_HEAL_MESSAGE });
    expect(text).toBe(`✨ ${AUTO_HEAL_MESSAGE}`);
  });
});
