/**
 * BattleFlowController Component Tests
 *
 * Tests the battle flow orchestration including:
 * - Team selection
 * - Djinn selection
 * - Battle initialization
 * - Navigation flow
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BattleFlowController } from '@/components/battle/BattleFlowController';
import { Unit } from '@/types/Unit';
import { STARTER_UNITS } from '@/data/units';

const mockNavigate = vi.fn();
const mockStartBattle = vi.fn();
const mockSetActiveParty = vi.fn();
const mockEquipDjinn = vi.fn();
const mockUnequipDjinn = vi.fn();
const mockGoBack = vi.fn();

let mockGameState: any;

vi.mock('@/context/GameContext', () => ({
  useGame: () => ({
    state: mockGameState,
    actions: {
      navigate: mockNavigate,
      startBattle: mockStartBattle,
      setActiveParty: mockSetActiveParty,
      equipDjinn: mockEquipDjinn,
      unequipDjinn: mockUnequipDjinn,
      goBack: mockGoBack,
    },
  }),
}));

describe('BattleFlowController', () => {
  beforeEach(() => {
    // Reset mocks
    mockNavigate.mockClear();
    mockStartBattle.mockClear();
    mockSetActiveParty.mockClear();
    mockEquipDjinn.mockClear();
    mockUnequipDjinn.mockClear();
    mockGoBack.mockClear();

    // Create test units
    const isaac = new Unit(STARTER_UNITS.isaac);
    const garet = new Unit(STARTER_UNITS.garet);
    const ivan = new Unit(STARTER_UNITS.ivan);
    const mia = new Unit(STARTER_UNITS.mia);

    mockGameState = {
      playerData: {
        unitsCollected: [isaac, garet, ivan, mia],
        activePartyIds: [isaac.id, garet.id],
        equippedDjinnIds: [],
        djinnCollected: [],
        gold: 1000,
        inventory: [],
      },
      currentScreen: { type: 'BATTLE_FLOW', enemyUnitIds: ['slime', 'goblin'] },
    };
  });

  describe('Team Selection Phase', () => {
    it('should start with team selection screen', () => {
      render(<BattleFlowController enemyUnitIds={['slime']} />);

      expect(screen.getByText(/select.*team/i)).toBeInTheDocument();
    });

    it('should show all available units', () => {
      render(<BattleFlowController enemyUnitIds={['slime']} />);

      expect(screen.getByText(/Isaac/i)).toBeInTheDocument();
      expect(screen.getByText(/Garet/i)).toBeInTheDocument();
      expect(screen.getByText(/Ivan/i)).toBeInTheDocument();
      expect(screen.getByText(/Mia/i)).toBeInTheDocument();
    });

    it('should allow confirming team selection', async () => {
      render(<BattleFlowController enemyUnitIds={['slime']} />);

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockSetActiveParty).toHaveBeenCalled();
      });
    });

    it('should allow canceling to return to overworld', () => {
      render(<BattleFlowController enemyUnitIds={['slime']} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('Djinn Selection Phase', () => {
    it('should show djinn selection after team confirmed', async () => {
      render(<BattleFlowController enemyUnitIds={['slime']} />);

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText(/select.*djinn/i)).toBeInTheDocument();
      });
    });

    it('should allow going back to team selection', async () => {
      render(<BattleFlowController enemyUnitIds={['slime']} />);

      // Advance to djinn selection
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        const backButton = screen.getByRole('button', { name: /back/i });
        fireEvent.click(backButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/select.*team/i)).toBeInTheDocument();
      });
    });

    it('should confirm djinn selection and start battle', async () => {
      render(<BattleFlowController enemyUnitIds={['slime']} />);

      // Advance to djinn selection
      fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

      await waitFor(async () => {
        const confirmDjinnButton = screen.getByRole('button', { name: /confirm/i });
        fireEvent.click(confirmDjinnButton);
      });

      await waitFor(() => {
        expect(mockStartBattle).toHaveBeenCalledWith(['slime'], undefined);
      });
    });
  });

  describe('Battle Initialization', () => {
    it('should pass enemyUnitIds to battle', async () => {
      const enemyIds = ['slime', 'goblin', 'skeleton'];
      render(<BattleFlowController enemyUnitIds={enemyIds} />);

      // Complete flow
      fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

      await waitFor(async () => {
        fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
      });

      await waitFor(() => {
        expect(mockStartBattle).toHaveBeenCalledWith(enemyIds, undefined);
      });
    });

    it('should pass npcId to battle when provided', async () => {
      render(<BattleFlowController enemyUnitIds={['slime']} npcId="skeleton-tamer" />);

      // Complete flow
      fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

      await waitFor(async () => {
        fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
      });

      await waitFor(() => {
        expect(mockStartBattle).toHaveBeenCalledWith(['slime'], 'skeleton-tamer');
      });
    });

    it('should navigate to BATTLE screen after initialization', async () => {
      render(<BattleFlowController enemyUnitIds={['slime']} />);

      // Complete flow
      fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

      await waitFor(async () => {
        fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
      });

      await waitFor(
        () => {
          expect(mockNavigate).toHaveBeenCalledWith({ type: 'BATTLE' });
        },
        { timeout: 2000 }
      );
    });
  });

  describe('Djinn Equipment', () => {
    it('should unequip previous djinn before equipping new ones', async () => {
      mockGameState.playerData.equippedDjinnIds = ['flint', 'granite'];

      render(<BattleFlowController enemyUnitIds={['slime']} />);

      // Complete flow
      fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

      await waitFor(async () => {
        fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
      });

      await waitFor(() => {
        expect(mockUnequipDjinn).toHaveBeenCalledWith('flint');
        expect(mockUnequipDjinn).toHaveBeenCalledWith('granite');
      });
    });
  });

  describe('Transition Phase', () => {
    it('should show transition screen before battle', async () => {
      render(<BattleFlowController enemyUnitIds={['slime']} />);

      // Complete flow
      fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

      await waitFor(async () => {
        fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
      });

      await waitFor(() => {
        expect(screen.getByText(/Battle Starting/i)).toBeInTheDocument();
      });
    });
  });

  describe('Callback Handling', () => {
    it('should call onBattleStart callback when provided', async () => {
      const onBattleStart = vi.fn();

      render(<BattleFlowController enemyUnitIds={['slime']} onBattleStart={onBattleStart} />);

      // Complete flow
      fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

      await waitFor(async () => {
        fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
      });

      await waitFor(() => {
        expect(onBattleStart).toHaveBeenCalled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty enemy array', () => {
      render(<BattleFlowController enemyUnitIds={[]} />);

      // Should still render team selection
      expect(screen.getByText(/select.*team/i)).toBeInTheDocument();
    });

    it('should handle single enemy', async () => {
      render(<BattleFlowController enemyUnitIds={['slime']} />);

      fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

      await waitFor(async () => {
        fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
      });

      await waitFor(() => {
        expect(mockStartBattle).toHaveBeenCalledWith(['slime'], undefined);
      });
    });

    it('should handle multiple enemies', async () => {
      const manyEnemies = ['slime', 'goblin', 'skeleton', 'zombie', 'imp'];

      render(<BattleFlowController enemyUnitIds={manyEnemies} />);

      fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

      await waitFor(async () => {
        fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
      });

      await waitFor(() => {
        expect(mockStartBattle).toHaveBeenCalledWith(manyEnemies, undefined);
      });
    });
  });
});
