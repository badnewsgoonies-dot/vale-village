import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GameProvider, useGame } from '../../src/context';
import type { GameContextValue } from '../../src/context';

// Mock BattleUnit to avoid sprite dependencies
vi.mock('../../src/sprites/components/BattleUnit', () => ({
  BattleUnit: ({ unit }: any) => <div data-testid={`battle-unit-${unit.id}`}>{unit.name}</div>
}));

// Test component that renders party info and provides swap actions
const TestPartyManager: React.FC = () => {
  const { state, actions } = useGame();
  const [error, setError] = React.useState<string | null>(null);

  const activeUnits = state.playerData.unitsCollected.filter(u =>
    state.playerData.activePartyIds.includes(u.id)
  );
  const benchUnits = state.playerData.unitsCollected.filter(u =>
    !state.playerData.activePartyIds.includes(u.id)
  );

  const handleSwapToActive = (unitId: string) => {
    if (activeUnits.length >= 4) {
      setError('Active party is full!');
      return;
    }
    actions.setActiveParty([...state.playerData.activePartyIds, unitId]);
    setError(null);
  };

  const handleSwapToBench = (unitId: string) => {
    if (activeUnits.length <= 1) {
      setError('Must have at least 1 active unit!');
      return;
    }
    actions.setActiveParty(state.playerData.activePartyIds.filter(id => id !== unitId));
    setError(null);
  };

  return (
    <div>
      <h1>Party Management Test</h1>
      {error && <div role="alert">{error}</div>}
      
      <section data-testid="active-section">
        <h2>Active Party</h2>
        <span data-testid="active-count">{activeUnits.length} / 4</span>
        {activeUnits.map(unit => (
          <div key={unit.id} data-testid={`active-unit-${unit.id}`}>
            <span>{unit.name}</span>
            <button onClick={() => handleSwapToBench(unit.id)}>→ Bench</button>
          </div>
        ))}
      </section>

      <section data-testid="bench-section">
        <h2>Bench</h2>
        <span data-testid="bench-count">{benchUnits.length}</span>
        {benchUnits.map(unit => (
          <div key={unit.id} data-testid={`bench-unit-${unit.id}`}>
            <span>{unit.name}</span>
            <button onClick={() => handleSwapToActive(unit.id)}>→ Active</button>
          </div>
        ))}
      </section>
    </div>
  );
};

describe('Party Management UI Interactions', () => {
  it('allows moving a unit from active to bench', async () => {
    const user = userEvent.setup();
    
    render(
      <GameProvider>
        <TestPartyManager />
      </GameProvider>
    );

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByTestId('active-count')).toHaveTextContent('4 / 4');
    });

    // Get the first active unit's bench button
    const benchButtons = screen.getAllByRole('button', { name: /→ Bench/i });
    expect(benchButtons.length).toBe(4); // All 4 active units should have bench buttons

    // Click to move first unit to bench
    await user.click(benchButtons[0]);

    // Verify active party reduced to 3
    await waitFor(() => {
      expect(screen.getByTestId('active-count')).toHaveTextContent('3 / 4');
    });

    // Verify bench now has 1 unit
    await waitFor(() => {
      expect(screen.getByTestId('bench-count')).toHaveTextContent('1');
    });
  });

  it('prevents removing the last active unit', async () => {
    const user = userEvent.setup();
    
    render(
      <GameProvider>
        <TestPartyManager />
      </GameProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Active Party/i)).toBeInTheDocument();
    });

    // Move 3 units to bench, leaving only 1 active
    // Click the first bench button three times (re-querying each time)
    await user.click(screen.getAllByRole('button', { name: /→ Bench/i })[0]);
    await waitFor(() => {
      expect(screen.getByTestId('active-count')).toHaveTextContent('3 / 4');
    });

    await user.click(screen.getAllByRole('button', { name: /→ Bench/i })[0]);
    await waitFor(() => {
      expect(screen.getByTestId('active-count')).toHaveTextContent('2 / 4');
    });

    await user.click(screen.getAllByRole('button', { name: /→ Bench/i })[0]);
    await waitFor(() => {
      expect(screen.getByTestId('active-count')).toHaveTextContent('1 / 4');
    });

    // Try to remove the last unit
    const lastBenchButton = screen.getByRole('button', { name: /→ Bench/i });
    await user.click(lastBenchButton);

    // Should show error
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Must have at least 1 active unit/i);
    });

    // Active party should still have 1 unit
    expect(screen.getByTestId('active-count')).toHaveTextContent('1 / 4');
  });

  it('prevents adding a 5th active unit', async () => {
    const user = userEvent.setup();
    
    // We need to recruit a 5th unit first
    const TestWithExtraUnit: React.FC = () => {
      const { actions } = useGame();
      
      React.useEffect(() => {
        // Recruit Jenna to have 5 total units
        actions.recruitUnit('jenna');
      }, [actions]);

      return <TestPartyManager />;
    };

    render(
      <GameProvider>
        <TestWithExtraUnit />
      </GameProvider>
    );

    // Wait for 5th unit to be recruited (should be on bench)
    await waitFor(() => {
      expect(screen.getByTestId('bench-count')).toHaveTextContent('1');
    }, { timeout: 3000 });

    // Active party should be full (4/4)
    expect(screen.getByTestId('active-count')).toHaveTextContent('4 / 4');

    // Try to add the benched unit to active party
    const activeButton = screen.getByRole('button', { name: /→ Active/i });
    await user.click(activeButton);

    // Should show error
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Active party is full/i);
    });

    // Active party should still be 4/4
    expect(screen.getByTestId('active-count')).toHaveTextContent('4 / 4');
    expect(screen.getByTestId('bench-count')).toHaveTextContent('1');
  });

  it('allows swapping units between active and bench', async () => {
    const user = userEvent.setup();
    
    const TestWithExtraUnit: React.FC = () => {
      const { actions } = useGame();
      
      React.useEffect(() => {
        actions.recruitUnit('jenna');
      }, [actions]);

      return <TestPartyManager />;
    };

    render(
      <GameProvider>
        <TestWithExtraUnit />
      </GameProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('bench-count')).toHaveTextContent('1');
    });

    // Move one active unit to bench
    const benchButtons = screen.getAllByRole('button', { name: /→ Bench/i });
    await user.click(benchButtons[0]);

    // Now we should have 3 active, 2 bench
    await waitFor(() => {
      expect(screen.getByTestId('active-count')).toHaveTextContent('3 / 4');
      expect(screen.getByTestId('bench-count')).toHaveTextContent('2');
    });

    // Move one bench unit to active
    const activeButtons = screen.getAllByRole('button', { name: /→ Active/i });
    await user.click(activeButtons[0]);

    // Back to 4 active, 1 bench
    await waitFor(() => {
      expect(screen.getByTestId('active-count')).toHaveTextContent('4 / 4');
      expect(screen.getByTestId('bench-count')).toHaveTextContent('1');
    });
  });

  it('displays unit names correctly', async () => {
    render(
      <GameProvider>
        <TestPartyManager />
      </GameProvider>
    );

    await waitFor(() => {
      // The initial party has Isaac, Garet, Ivan, Mia
      expect(screen.getByText('Isaac')).toBeInTheDocument();
      expect(screen.getByText('Garet')).toBeInTheDocument();
      expect(screen.getByText('Ivan')).toBeInTheDocument();
      expect(screen.getByText('Mia')).toBeInTheDocument();
    });
  });
});
