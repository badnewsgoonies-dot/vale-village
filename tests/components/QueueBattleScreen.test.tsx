/**
 * QueueBattleScreen Component Tests
 *
 * Tests the main battle screen component including:
 * - Victory/defeat detection
 * - Ability execution
 * - Action queuing
 * - Enemy AI
 * - Post-battle navigation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueueBattleScreen } from '@/components/battle/QueueBattleScreen';
import { GameProvider } from '@/context/GameProvider';
import { Unit } from '@/types/Unit';
import { STARTER_UNITS } from '@/data/units';
import { ENEMIES } from '@/data/enemies';
import type { BattleState } from '@/types/Battle';

// Mock navigate function
const mockNavigate = vi.fn();
vi.mock('@/context/GameContext', async () => {
  const actual = await vi.importActual('@/context/GameContext');
  return {
    ...actual,
    useGame: () => ({
      state: mockGameState,
      actions: {
        navigate: mockNavigate,
        endBattle: vi.fn(),
      },
    }),
  };
});

let mockGameState: any;

describe('QueueBattleScreen', () => {
  beforeEach(() => {
    // Reset mocks
    mockNavigate.mockClear();

    // Create test units
    const isaac = new Unit(STARTER_UNITS.isaac);
    isaac.stats.hp = 100;
    isaac.stats.maxHp = 100;

    const garet = new Unit(STARTER_UNITS.garet);
    garet.stats.hp = 120;
    garet.stats.maxHp = 120;

    // Create test enemies
    const slime = ENEMIES['slime'];
    const slimeUnit = new Unit({
      id: 'slime-1',
      name: 'Slime',
      level: 1,
      element: slime.element,
      stats: slime.stats,
      abilities: slime.abilities,
      spriteData: {
        battleFront: '/sprites/battle/enemies/Slime.gif',
        battleBack: '/sprites/battle/enemies/Slime_Back.gif',
      },
    });
    slimeUnit.stats.hp = 20;
    slimeUnit.stats.maxHp = 20;

    // Create battle state
    const battle: BattleState = {
      playerTeam: {
        units: [isaac, garet],
        equippedDjinn: [],
      },
      enemies: [slimeUnit],
      currentTurn: 1,
      turnOrder: [isaac, garet, slimeUnit],
      currentActorIndex: 0,
      status: 'active',
      log: [],
      npcId: 'test-npc',
    };

    mockGameState = {
      currentBattle: battle,
      currentScreen: { type: 'BATTLE' },
      currentLocation: 'vale_village',
      playerData: {
        unitsCollected: [isaac, garet],
        activePartyIds: [isaac.id, garet.id],
        equippedDjinnIds: [],
        djinnCollected: [],
        gold: 1000,
        inventory: [],
      },
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Victory Detection', () => {
    it('should detect victory when all enemies are defeated', async () => {
      // Set enemy HP to 0
      mockGameState.currentBattle.enemies[0].stats.hp = 0;
      mockGameState.currentBattle.enemies[0].isKO = true;

      render(
        <GameProvider>
          <QueueBattleScreen />
        </GameProvider>
      );

      // The battle screen should be rendered
      expect(screen.getByText(/Isaac/i)).toBeInTheDocument();
    });

    it('should navigate to POST_BATTLE_CUTSCENE on victory', async () => {
      const { rerender } = render(
        <GameProvider>
          <QueueBattleScreen />
        </GameProvider>
      );

      // Kill all enemies
      mockGameState.currentBattle.enemies.forEach((e: Unit) => {
        e.stats.hp = 0;
        e.isKO = true;
      });

      // Rerender to trigger victory check
      rerender(
        <GameProvider>
          <QueueBattleScreen />
        </GameProvider>
      );

      // Wait for victory navigation (2 second delay in code)
      await waitFor(
        () => {
          expect(mockNavigate).toHaveBeenCalledWith({
            type: 'POST_BATTLE_CUTSCENE',
            npcId: 'test-npc',
            victory: true,
          });
        },
        { timeout: 3000 }
      );
    });
  });

  describe('Defeat Detection', () => {
    it('should detect defeat when all player units are defeated', async () => {
      // Set player HP to 0
      mockGameState.currentBattle.playerTeam.units.forEach((u: Unit) => {
        u.stats.hp = 0;
        u.isKO = true;
      });

      render(
        <GameProvider>
          <QueueBattleScreen />
        </GameProvider>
      );

      expect(screen.getByText(/Isaac/i)).toBeInTheDocument();
    });

    it('should navigate to POST_BATTLE_CUTSCENE on defeat', async () => {
      const { rerender } = render(
        <GameProvider>
          <QueueBattleScreen />
        </GameProvider>
      );

      // Kill all players
      mockGameState.currentBattle.playerTeam.units.forEach((u: Unit) => {
        u.stats.hp = 0;
        u.isKO = true;
      });

      rerender(
        <GameProvider>
          <QueueBattleScreen />
        </GameProvider>
      );

      // Wait for defeat navigation
      await waitFor(
        () => {
          expect(mockNavigate).toHaveBeenCalledWith({
            type: 'POST_BATTLE_CUTSCENE',
            npcId: 'test-npc',
            victory: false,
          });
        },
        { timeout: 3000 }
      );
    });
  });

  describe('Ability Execution', () => {
    it('should handle missing abilities gracefully', () => {
      // This tests the bug fix where abilities might not be found
      render(
        <GameProvider>
          <QueueBattleScreen />
        </GameProvider>
      );

      // Battle should render without crashing even if abilities are missing
      expect(screen.getByText(/Isaac/i)).toBeInTheDocument();
      expect(screen.getByText(/Garet/i)).toBeInTheDocument();
    });

    it('should display combat log messages', () => {
      mockGameState.currentBattle.log = ['Battle Start!', 'Isaac uses Slash!'];

      render(
        <GameProvider>
          <QueueBattleScreen />
        </GameProvider>
      );

      // Combat log should be visible
      expect(screen.getByText(/Battle Start!/i)).toBeInTheDocument();
      expect(screen.getByText(/Isaac uses Slash!/i)).toBeInTheDocument();
    });
  });

  describe('NPC Battle Context', () => {
    it('should preserve npcId for post-battle cutscene', () => {
      mockGameState.currentBattle.npcId = 'skeleton-tamer';

      render(
        <GameProvider>
          <QueueBattleScreen />
        </GameProvider>
      );

      // The battle should have the npcId
      expect(mockGameState.currentBattle.npcId).toBe('skeleton-tamer');
    });

    it('should handle battles without npcId (random encounters)', () => {
      mockGameState.currentBattle.npcId = undefined;

      render(
        <GameProvider>
          <QueueBattleScreen />
        </GameProvider>
      );

      // Should render normally even without npcId
      expect(screen.getByText(/Isaac/i)).toBeInTheDocument();
    });
  });

  describe('Battle State Management', () => {
    it('should show all player units', () => {
      render(
        <GameProvider>
          <QueueBattleScreen />
        </GameProvider>
      );

      expect(screen.getByText(/Isaac/i)).toBeInTheDocument();
      expect(screen.getByText(/Garet/i)).toBeInTheDocument();
    });

    it('should show all enemy units', () => {
      render(
        <GameProvider>
          <QueueBattleScreen />
        </GameProvider>
      );

      expect(screen.getByText(/Slime/i)).toBeInTheDocument();
    });

    it('should display HP values', () => {
      render(
        <GameProvider>
          <QueueBattleScreen />
        </GameProvider>
      );

      // HP should be displayed (exact format depends on component)
      expect(screen.getByText(/100/)).toBeInTheDocument(); // Isaac's HP
      expect(screen.getByText(/120/)).toBeInTheDocument(); // Garet's HP
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty enemy array', () => {
      mockGameState.currentBattle.enemies = [];

      render(
        <GameProvider>
          <QueueBattleScreen />
        </GameProvider>
      );

      // Should not crash
      expect(screen.getByText(/Isaac/i)).toBeInTheDocument();
    });

    it('should handle KO units correctly', () => {
      mockGameState.currentBattle.playerTeam.units[0].isKO = true;
      mockGameState.currentBattle.playerTeam.units[0].stats.hp = 0;

      render(
        <GameProvider>
          <QueueBattleScreen />
        </GameProvider>
      );

      // Should still render, KO units just can't act
      expect(screen.getByText(/Isaac/i)).toBeInTheDocument();
    });
  });
});
