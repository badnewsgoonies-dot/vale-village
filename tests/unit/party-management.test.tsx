import * as React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { GameProvider, useGame } from '../../src/context';

// A small consumer to expose state/actions to the test via closure
let captured: { state: any | null; actions: any | null };

const Consumer: React.FC = () => {
  const { state, actions } = useGame();
  React.useEffect(() => {
    captured = { state, actions };
  }, [state, actions]);
  return <div data-testid="game-provider-ready" />;
};

describe('Party management (GameProvider)', () => {
  beforeEach(() => {
    captured = { state: null, actions: null };
  });

  it('initial active party has 4 units', async () => {
    render(
      <GameProvider>
        <Consumer />
      </GameProvider>
    );

    await waitFor(() => expect(captured.actions).toBeTruthy());
    expect(captured.state.playerData.activePartyIds.length).toBe(4);
  });

  it('setActiveParty rejects arrays with length < 1 or > 4', async () => {
    render(
      <GameProvider>
        <Consumer />
      </GameProvider>
    );

    await waitFor(() => expect(captured.actions).toBeTruthy());

    // Try with 0 units
    await act(async () => {
      captured.actions.setActiveParty([]);
    });
    await waitFor(() => expect(captured.state.error).toBe('Active party must have 1-4 units'));
    expect(captured.state.playerData.activePartyIds.length).toBe(4); // Unchanged

    // Try with 5 units (need to have Jenna recruited first)
    const allIds = captured.state.playerData.unitsCollected.map((u: any) => u.id);
    if (allIds.length >= 5) {
      await act(async () => {
        captured.actions.setActiveParty(allIds.slice(0, 5));
      });
      await waitFor(() => expect(captured.state.error).toBe('Active party must have 1-4 units'));
      expect(captured.state.playerData.activePartyIds.length).toBe(4); // Still 4
    }
  });

  it('setActiveParty accepts valid 1-4 unit ids', async () => {
    render(
      <GameProvider>
        <Consumer />
      </GameProvider>
    );

    await waitFor(() => expect(captured.actions).toBeTruthy());

    // Test with 2 units
    const twoIds = captured.state.playerData.unitsCollected.slice(0, 2).map((u: any) => u.id);
    await act(async () => {
      captured.actions.setActiveParty(twoIds);
    });
    await waitFor(() => expect(captured.state.error).toBeNull());
    expect(captured.state.playerData.activePartyIds).toEqual(twoIds);

    // Test with 3 units
    const threeIds = captured.state.playerData.unitsCollected.slice(0, 3).map((u: any) => u.id);
    await act(async () => {
      captured.actions.setActiveParty(threeIds);
    });
    await waitFor(() => expect(captured.state.error).toBeNull());
    expect(captured.state.playerData.activePartyIds).toEqual(threeIds);

    // Test with 4 units (reordered)
    const ids = captured.state.playerData.unitsCollected.map((u: any) => u.id).slice(0, 4).reverse();
    await act(async () => {
      captured.actions.setActiveParty(ids);
    });
    await waitFor(() => expect(captured.state.error).toBeNull());
    expect(captured.state.playerData.activePartyIds).toEqual(ids);
  });

  it('setActiveParty rejects unknown unit ids', async () => {
    render(
      <GameProvider>
        <Consumer />
      </GameProvider>
    );

    await waitFor(() => expect(captured.actions).toBeTruthy());

    await act(async () => {
      captured.actions.setActiveParty(['nope-1', 'nope-2', 'nope-3', 'nope-4']);
    });

    await waitFor(() => expect(captured.state.error).toBe('One or more units not found in collection'));
  });
});
