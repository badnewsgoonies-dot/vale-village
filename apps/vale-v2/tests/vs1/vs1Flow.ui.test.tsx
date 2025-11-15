import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '@/App';
import { useStore } from '@/ui/state/store';
import { VS1_SCENE_POST, VS1_SCENE_PRE } from '@/story/vs1Constants';
import { executeRound } from '@/core/services/QueueBattleService';
import type { BattleState } from '@/core/models/BattleState';

vi.mock('@/core/services/QueueBattleService', async () => {
  const actual = await vi.importActual<typeof import('@/core/services/QueueBattleService')>(
    '@/core/services/QueueBattleService'
  );
  return { ...actual, executeRound: vi.fn() };
});
const executeRoundMock = executeRound as Mock;

describe('VS1 demo flow (UI, happy-dom)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('clicking Play VS1 Demo starts pre-scene dialogue', () => {
    render(<App />);

    // Find and click the VS1 button
    const vs1Button = screen.getByRole('button', { name: /Play VS1 Demo/i });
    fireEvent.click(vs1Button);

    // Should start with pre-scene
    const state = useStore.getState();
    expect(state.mode).toBe('dialogue');
    expect(state.currentDialogueTree?.id).toBe(VS1_SCENE_PRE);
  });

  it('rewards Continue button triggers post-scene dialogue for VS1', async () => {
    render(<App />);

    // Directly trigger VS1 battle via store (skip dialogue for simplicity)
    const store = useStore.getState();
    store.handleTrigger({
      id: 'vs1-start',
      type: 'battle',
      position: { x: 0, y: 0 },
      data: { encounterId: 'vs1-bandits' },
    });

    // Wait for battle to start
    await waitFor(() => {
      expect(useStore.getState().mode).toBe('battle');
    });

    const battle = useStore.getState().battle;

    // Mock executeRound to return victory
    if (battle) {
      executeRoundMock.mockReturnValue({
        state: { ...battle, phase: 'victory', status: 'PLAYER_VICTORY' } as BattleState,
        events: [{ type: 'battle-end', result: 'PLAYER_VICTORY' }],
      });

      // Execute round to trigger victory
      store.executeQueuedRound();

      // Wait for rewards screen
      await waitFor(() => {
        expect(useStore.getState().mode).toBe('rewards');
        expect(useStore.getState().showRewards).toBe(true);
      });

      // Find and click Continue button on rewards screen
      const continueBtn = await screen.findByRole('button', { name: /Continue/i });
      fireEvent.click(continueBtn);

      // Should show post-scene dialogue
      await waitFor(() => {
        const postState = useStore.getState();
        expect(postState.currentDialogueTree?.id).toBe(VS1_SCENE_POST);
        expect(postState.mode).toBe('dialogue');
      });
    }
  });
});
