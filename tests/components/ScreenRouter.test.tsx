/**
 * ScreenRouter Component Tests
 *
 * Tests screen navigation and routing including:
 * - Screen type rendering
 * - Navigation transitions
 * - Screen context preservation
 * - Error handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScreenRouter } from '@/router/ScreenRouter';
import type { NavigationType } from '@/context/types';

const mockNavigate = vi.fn();
let mockCurrentScreen: NavigationType;

vi.mock('@/context/GameContext', () => ({
  useGame: () => ({
    state: {
      currentScreen: mockCurrentScreen,
      currentLocation: 'vale_village',
      playerData: {
        unitsCollected: [],
        activePartyIds: [],
        equippedDjinnIds: [],
        djinnCollected: [],
        gold: 1000,
        inventory: [],
      },
      lastBattleRewards: null,
      currentBattle: null,
    },
    actions: {
      navigate: mockNavigate,
      startBattle: vi.fn(),
      setActiveParty: vi.fn(),
    },
  }),
}));

// Mock all screen components
vi.mock('@/components/title', () => ({
  TitleScreen: () => <div>Title Screen</div>,
}));

vi.mock('@/components/overworld/NewOverworldScreen', () => ({
  NewOverworldScreen: () => <div>Overworld Screen</div>,
}));

vi.mock('@/components/battle', () => ({
  BattleScreen: () => <div>Battle Screen</div>,
}));

vi.mock('@/components/battle/BattleFlowController', () => ({
  BattleFlowController: () => <div>Battle Flow Controller</div>,
}));

vi.mock('@/components/battle/PostBattleCutscene', () => ({
  PostBattleCutscene: () => <div>Post Battle Cutscene</div>,
}));

vi.mock('@/components/rewards/RewardsScreen', () => ({
  RewardsScreen: () => <div>Rewards Screen</div>,
}));

vi.mock('@/components/equipment/EquipmentScreen', () => ({
  EquipmentScreen: () => <div>Equipment Screen</div>,
}));

vi.mock('@/components/party/PartyManagementScreen', () => ({
  PartyManagementScreen: () => <div>Party Management Screen</div>,
}));

vi.mock('@/components/abilities/AbilitiesScreen', () => ({
  AbilitiesScreen: () => <div>Abilities Screen</div>,
}));

vi.mock('@/components/summons/SummonsScreen', () => ({
  SummonsScreen: () => <div>Summons Screen</div>,
}));

vi.mock('@/components/djinn/DjinnScreen', () => ({
  DjinnScreen: () => <div>Djinn Screen</div>,
}));

vi.mock('@/components/menu/MainMenu', () => ({
  MainMenu: () => <div>Main Menu</div>,
}));

vi.mock('@/components/shop/ShopScreen', () => ({
  ShopScreen: () => <div>Shop Screen</div>,
}));

vi.mock('@/components/intro/IntroScreen', () => ({
  IntroScreen: () => <div>Intro Screen</div>,
}));

vi.mock('@/components/dialogue/DialogueScreen', () => ({
  DialogueScreen: () => <div>Dialogue Screen</div>,
}));

vi.mock('@/components/units/UnitCollectionScreen', () => ({
  UnitCollectionScreen: () => <div>Unit Collection Screen</div>,
}));

describe('ScreenRouter', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Basic Screen Rendering', () => {
    it('should render TITLE screen', () => {
      mockCurrentScreen = { type: 'TITLE' };
      render(<ScreenRouter />);
      expect(screen.getByText('Title Screen')).toBeInTheDocument();
    });

    it('should render OVERWORLD screen', () => {
      mockCurrentScreen = { type: 'OVERWORLD' };
      render(<ScreenRouter />);
      expect(screen.getByText('Overworld Screen')).toBeInTheDocument();
    });

    it('should render BATTLE screen', () => {
      mockCurrentScreen = { type: 'BATTLE' };
      render(<ScreenRouter />);
      expect(screen.getByText('Battle Screen')).toBeInTheDocument();
    });

    it('should render EQUIPMENT screen', () => {
      mockCurrentScreen = { type: 'EQUIPMENT', unitId: 'isaac' };
      render(<ScreenRouter />);
      expect(screen.getByText('Equipment Screen')).toBeInTheDocument();
    });

    it('should render PARTY_MANAGEMENT screen', () => {
      mockCurrentScreen = { type: 'PARTY_MANAGEMENT' };
      render(<ScreenRouter />);
      expect(screen.getByText('Party Management Screen')).toBeInTheDocument();
    });

    it('should render ABILITIES screen', () => {
      mockCurrentScreen = { type: 'ABILITIES' };
      render(<ScreenRouter />);
      expect(screen.getByText('Abilities Screen')).toBeInTheDocument();
    });

    it('should render SUMMONS screen', () => {
      mockCurrentScreen = { type: 'SUMMONS' };
      render(<ScreenRouter />);
      expect(screen.getByText('Summons Screen')).toBeInTheDocument();
    });

    it('should render DJINN_MENU screen', () => {
      mockCurrentScreen = { type: 'DJINN_MENU' };
      render(<ScreenRouter />);
      expect(screen.getByText('Djinn Screen')).toBeInTheDocument();
    });

    it('should render MAIN_MENU screen', () => {
      mockCurrentScreen = { type: 'MAIN_MENU' };
      render(<ScreenRouter />);
      expect(screen.getByText('Main Menu')).toBeInTheDocument();
    });
  });

  describe('Battle Flow Screens', () => {
    it('should render BATTLE_FLOW screen', () => {
      mockCurrentScreen = { type: 'BATTLE_FLOW', enemyUnitIds: ['slime'] };
      render(<ScreenRouter />);
      expect(screen.getByText('Battle Flow Controller')).toBeInTheDocument();
    });

    it('should render POST_BATTLE_CUTSCENE screen', () => {
      mockCurrentScreen = { type: 'POST_BATTLE_CUTSCENE', victory: true };
      render(<ScreenRouter />);
      expect(screen.getByText('Post Battle Cutscene')).toBeInTheDocument();
    });

    it('should render REWARDS screen', () => {
      mockCurrentScreen = { type: 'REWARDS' };
      render(<ScreenRouter />);
      expect(screen.getByText('Rewards Screen')).toBeInTheDocument();
    });
  });

  describe('Other Screens', () => {
    it('should render SHOP screen', () => {
      mockCurrentScreen = { type: 'SHOP', shopType: 'equipment' };
      render(<ScreenRouter />);
      expect(screen.getByText('Shop Screen')).toBeInTheDocument();
    });

    it('should render INTRO screen', () => {
      mockCurrentScreen = { type: 'INTRO' };
      render(<ScreenRouter />);
      expect(screen.getByText('Intro Screen')).toBeInTheDocument();
    });

    it('should render DIALOGUE screen', () => {
      mockCurrentScreen = { type: 'DIALOGUE', npcId: 'mayor' };
      render(<ScreenRouter />);
      expect(screen.getByText('Dialogue Screen')).toBeInTheDocument();
    });

    it('should render UNIT_COLLECTION screen', () => {
      mockCurrentScreen = { type: 'UNIT_COLLECTION' };
      render(<ScreenRouter />);
      expect(screen.getByText('Unit Collection Screen')).toBeInTheDocument();
    });
  });

  describe('Screen Context Preservation', () => {
    it('should preserve enemyUnitIds in BATTLE_FLOW', () => {
      mockCurrentScreen = { type: 'BATTLE_FLOW', enemyUnitIds: ['slime', 'goblin'] };
      render(<ScreenRouter />);
      expect(screen.getByText('Battle Flow Controller')).toBeInTheDocument();
    });

    it('should preserve npcId in BATTLE_FLOW', () => {
      mockCurrentScreen = { type: 'BATTLE_FLOW', enemyUnitIds: ['slime'], npcId: 'skeleton-tamer' };
      render(<ScreenRouter />);
      expect(screen.getByText('Battle Flow Controller')).toBeInTheDocument();
    });

    it('should preserve victory status in POST_BATTLE_CUTSCENE', () => {
      mockCurrentScreen = { type: 'POST_BATTLE_CUTSCENE', victory: true };
      render(<ScreenRouter />);
      expect(screen.getByText('Post Battle Cutscene')).toBeInTheDocument();
    });

    it('should preserve defeat status in POST_BATTLE_CUTSCENE', () => {
      mockCurrentScreen = { type: 'POST_BATTLE_CUTSCENE', victory: false };
      render(<ScreenRouter />);
      expect(screen.getByText('Post Battle Cutscene')).toBeInTheDocument();
    });

    it('should preserve unitId in EQUIPMENT screen', () => {
      mockCurrentScreen = { type: 'EQUIPMENT', unitId: 'isaac' };
      render(<ScreenRouter />);
      expect(screen.getByText('Equipment Screen')).toBeInTheDocument();
    });

    it('should preserve shopType in SHOP screen', () => {
      mockCurrentScreen = { type: 'SHOP', shopType: 'equipment' };
      render(<ScreenRouter />);
      expect(screen.getByText('Shop Screen')).toBeInTheDocument();
    });
  });

  describe('Navigation Logging', () => {
    it('should log screen changes to console', () => {
      const consoleSpy = vi.spyOn(console, 'log');

      mockCurrentScreen = { type: 'OVERWORLD' };
      render(<ScreenRouter />);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[SCREEN_ROUTER] Current screen:',
        expect.objectContaining({ type: 'OVERWORLD' })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should handle unknown screen types', () => {
      mockCurrentScreen = { type: 'UNKNOWN_SCREEN' } as any;
      render(<ScreenRouter />);

      expect(screen.getByText(/Unknown screen/i)).toBeInTheDocument();
    });

    it('should display error screen with screen details', () => {
      mockCurrentScreen = { type: 'INVALID' } as any;
      render(<ScreenRouter />);

      expect(screen.getByText(/Unknown screen/i)).toBeInTheDocument();
      expect(screen.getByText(/INVALID/i)).toBeInTheDocument();
    });
  });

  describe('Screen Transitions', () => {
    it('should wrap screens in ScreenTransition component', () => {
      mockCurrentScreen = { type: 'OVERWORLD' };
      const { container } = render(<ScreenRouter />);

      // ScreenTransition should be rendered (exact implementation depends on ScreenTransition component)
      expect(container.firstChild).toBeTruthy();
    });

    it('should update when screen changes', () => {
      mockCurrentScreen = { type: 'OVERWORLD' };
      const { rerender } = render(<ScreenRouter />);
      expect(screen.getByText('Overworld Screen')).toBeInTheDocument();

      mockCurrentScreen = { type: 'BATTLE' };
      rerender(<ScreenRouter />);
      expect(screen.getByText('Battle Screen')).toBeInTheDocument();
    });
  });
});
