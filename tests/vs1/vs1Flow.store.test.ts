import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import { createStore } from '@/ui/state/store';
import { VS1_ENCOUNTER_ID, VS1_SCENE_PRE, VS1_SCENE_POST } from '@/story/vs1Constants';
import { DIALOGUES } from '@/data/definitions/dialogues';
import { executeRound } from '@/core/services/QueueBattleService';
import type { BattleState } from '@/core/models/BattleState';
import { createVs1IsaacTeam } from '@/utils/teamSetup';

vi.mock('@/core/services/QueueBattleService', async () => {
  const actual = await vi.importActual<typeof import('@/core/services/QueueBattleService')>(
    '@/core/services/QueueBattleService'
  );
  return { ...actual, executeRound: vi.fn() };
});
const executeRoundMock = executeRound as Mock;

const battleEnd = (result: 'PLAYER_VICTORY' | 'PLAYER_DEFEAT') => ({
  type: 'battle-end' as const,
  result,
});

describe('VS1 demo flow (store-only)', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    vi.resetAllMocks();
    store = createStore();

    // Initialize team exactly like App.tsx (Isaac + Flint)
    const { isaac, team } = createVs1IsaacTeam();
    store.getState().setTeam(team);
    store.getState().setRoster([isaac]);
  });

  it('happy path: pre(dialogue) → battle → rewards (post-scene is App responsibility)', () => {
    // 1) Start pre scene (same as App.startVS1Game)
    store.getState().startDialogueTree(DIALOGUES[VS1_SCENE_PRE]);
    expect(store.getState().mode).toBe('dialogue');
    expect(store.getState().currentDialogueTree?.id).toBe(VS1_SCENE_PRE);

    // 2) Dialogue effect would start battle; we simulate the same trigger
    store.getState().handleTrigger({
      id: 'vs1-start',
      type: 'battle',
      position: { x: 0, y: 0 },
      data: { encounterId: VS1_ENCOUNTER_ID },
    });
    expect(store.getState().mode).toBe('team-select');
    const selectedTeam = store.getState().team;
    expect(selectedTeam).toBeTruthy();
    if (!selectedTeam) return;
    store.getState().confirmBattleTeam();

    expect(store.getState().mode).toBe('battle');
    const b = store.getState().battle;
    expect(b && (b.encounterId === VS1_ENCOUNTER_ID || b.meta?.encounterId === VS1_ENCOUNTER_ID)).toBe(true);

    // 3) Force victory via repo-standard service mock
    if (b) {
      executeRoundMock.mockReturnValueOnce({
        state: { ...b, phase: 'victory', status: 'PLAYER_VICTORY' } as BattleState,
        events: [battleEnd('PLAYER_VICTORY')],
      });
    }
    store.getState().executeQueuedRound();

    // → rewards shown by slice
    expect(store.getState().mode).toBe('rewards');
    expect(store.getState().showRewards).toBe(true);
    expect(store.getState().lastBattleRewards).toBeTruthy();

    // 4) Store only clears rewards; App is responsible for post scene
    store.getState().claimRewards();
    expect(store.getState().showRewards).toBe(false);
    expect(store.getState().lastBattleRewards).toBeNull();

    // (Optional) Simulate App handler to verify post-scene data exists
    store.getState().startDialogueTree(DIALOGUES[VS1_SCENE_POST]);
    store.getState().setMode('dialogue');
    expect(store.getState().currentDialogueTree?.id).toBe(VS1_SCENE_POST);
  });

  it('defeat path: VS1 defeat → retry pre-scene (handled in queueBattleSlice)', () => {
    // Enter battle directly
    store.getState().handleTrigger({
      id: 'vs1-start',
      type: 'battle',
      position: { x: 0, y: 0 },
      data: { encounterId: VS1_ENCOUNTER_ID },
    });
    expect(store.getState().mode).toBe('team-select');
    const selectedTeam = store.getState().team;
    expect(selectedTeam).toBeTruthy();
    if (!selectedTeam) return;
    store.getState().confirmBattleTeam();

    const b = store.getState().battle;
    expect(store.getState().mode).toBe('battle');

    // Force defeat
    if (b) {
      executeRoundMock.mockReturnValueOnce({
        state: { ...b, phase: 'defeat', status: 'PLAYER_DEFEAT' } as BattleState,
        events: [battleEnd('PLAYER_DEFEAT')],
      });
    }
    store.getState().executeQueuedRound();

    // Slice auto-heals and re-enters pre-scene dialogue for VS1
    expect(store.getState().mode).toBe('dialogue');
    expect(store.getState().currentDialogueTree?.id).toBe(VS1_SCENE_PRE);
  });
});
