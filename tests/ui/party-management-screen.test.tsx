import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PartyManagementScreen } from '../../src/components/party/PartyManagementScreen';
import { GameProvider } from '../../src/context';

// Mock BattleUnit component since it may have complex sprite dependencies
vi.mock('../../src/sprites/components/BattleUnit', () => ({
  BattleUnit: ({ unit }: any) => <div data-testid={`battle-unit-${unit.id}`}>{unit.name}</div>
}));

describe('PartyManagementScreen UI', () => {
  it('renders party management header', async () => {
    render(
      <GameProvider>
        <PartyManagementScreen />
      </GameProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('PARTY MANAGEMENT')).toBeInTheDocument();
    });
  });

  it('displays active party section with 4 units', async () => {
    render(
      <GameProvider>
        <PartyManagementScreen />
      </GameProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('ACTIVE PARTY')).toBeInTheDocument();
    });

    // Should show 4 / 4 slots
    const sectionCount = screen.getByText(/4 \/ 4 slots/i);
    expect(sectionCount).toBeInTheDocument();
  });

  it('displays bench section', async () => {
    render(
      <GameProvider>
        <PartyManagementScreen />
      </GameProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('BENCH')).toBeInTheDocument();
    });
  });

  it('shows return button', async () => {
    render(
      <GameProvider>
        <PartyManagementScreen />
      </GameProvider>
    );

    await waitFor(() => {
      const returnButton = screen.getByRole('button', { name: /return/i });
      expect(returnButton).toBeInTheDocument();
    });
  });

  it('displays unit cards with swap buttons', async () => {
    render(
      <GameProvider>
        <PartyManagementScreen />
      </GameProvider>
    );

    // Wait for screen to render
    await waitFor(() => {
      expect(screen.getByText('PARTY MANAGEMENT')).toBeInTheDocument();
    });

    // Should have swap buttons (→ Bench for active units)
    const swapButtons = screen.getAllByRole('button', { name: /bench/i });
    expect(swapButtons.length).toBeGreaterThan(0);
  });

  it('shows empty bench message when all units are active', async () => {
    render(
      <GameProvider>
        <PartyManagementScreen />
      </GameProvider>
    );

    await waitFor(() => {
      // With initial 4 units all active, bench should be empty
      expect(screen.getByText(/All recruited units are in the active party/i)).toBeInTheDocument();
    });
  });
});
