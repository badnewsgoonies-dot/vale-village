/**
 * PostBattleCutscene Component Tests
 *
 * Tests the post-battle cutscene component including:
 * - Victory/defeat messaging
 * - Message progression
 * - Navigation to rewards screen
 * - NPC-specific dialogue
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PostBattleCutscene } from '@/components/battle/PostBattleCutscene';

const mockNavigate = vi.fn();
vi.mock('@/context/GameContext', () => ({
  useGame: () => ({
    actions: {
      navigate: mockNavigate,
    },
  }),
}));

describe('PostBattleCutscene', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Victory Cutscene', () => {
    it('should display victory message', () => {
      render(<PostBattleCutscene victory={true} />);

      expect(screen.getByText(/VICTORY/i)).toBeInTheDocument();
    });

    it('should show generic victory messages when no NPC', () => {
      render(<PostBattleCutscene victory={true} />);

      expect(screen.getByText(/enemies have been defeated/i)).toBeInTheDocument();
    });

    it('should show NPC-specific victory messages', () => {
      render(<PostBattleCutscene victory={true} npcId="skeleton-tamer" />);

      expect(screen.getByText(/proven your strength/i)).toBeInTheDocument();
    });

    it('should navigate to REWARDS screen after messages', async () => {
      render(<PostBattleCutscene victory={true} />);

      // Click through messages
      const continueButton = screen.getByRole('button', { name: /continue/i });
      fireEvent.click(continueButton);

      await waitFor(() => {
        const claimButton = screen.getByRole('button', { name: /claim rewards/i });
        fireEvent.click(claimButton);
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({ type: 'REWARDS' });
      });
    });
  });

  describe('Defeat Cutscene', () => {
    it('should display defeat message', () => {
      render(<PostBattleCutscene victory={false} />);

      expect(screen.getByText(/DEFEAT/i)).toBeInTheDocument();
    });

    it('should show generic defeat messages when no NPC', () => {
      render(<PostBattleCutscene victory={false} />);

      expect(screen.getByText(/party has been defeated/i)).toBeInTheDocument();
    });

    it('should show NPC-specific defeat messages', () => {
      render(<PostBattleCutscene victory={false} npcId="skeleton-tamer" />);

      expect(screen.getByText(/battle was too much/i)).toBeInTheDocument();
    });

    it('should navigate to OVERWORLD screen on defeat', async () => {
      render(<PostBattleCutscene victory={false} />);

      // Click through messages
      const continueButton = screen.getByRole('button', { name: /continue/i });
      fireEvent.click(continueButton);

      await waitFor(() => {
        const returnButton = screen.getByRole('button', { name: /return/i });
        fireEvent.click(returnButton);
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({ type: 'OVERWORLD' });
      });
    });
  });

  describe('Message Navigation', () => {
    it('should show progress indicators', () => {
      render(<PostBattleCutscene victory={true} />);

      const dots = screen.getAllByRole('presentation'); // Progress dots
      expect(dots.length).toBeGreaterThan(0);
    });

    it('should advance messages on button click', async () => {
      render(<PostBattleCutscene victory={true} />);

      const continueButton = screen.getByRole('button', { name: /continue/i });
      fireEvent.click(continueButton);

      // Should show next message
      await waitFor(() => {
        expect(screen.getByText(/Victory is yours/i)).toBeInTheDocument();
      });
    });

    it('should advance messages on Enter key', async () => {
      render(<PostBattleCutscene victory={true} />);

      fireEvent.keyDown(window, { key: 'Enter' });

      await waitFor(() => {
        expect(screen.getByText(/Victory is yours/i)).toBeInTheDocument();
      });
    });

    it('should advance messages on Space key', async () => {
      render(<PostBattleCutscene victory={true} />);

      fireEvent.keyDown(window, { key: ' ' });

      await waitFor(() => {
        expect(screen.getByText(/Victory is yours/i)).toBeInTheDocument();
      });
    });
  });

  describe('UI Elements', () => {
    it('should show continue hint', () => {
      render(<PostBattleCutscene victory={true} />);

      expect(screen.getByText(/Press.*ENTER.*SPACE/i)).toBeInTheDocument();
    });

    it('should change button text on last message', async () => {
      render(<PostBattleCutscene victory={true} />);

      // Click through to last message
      const continueButton = screen.getByRole('button', { name: /continue/i });
      fireEvent.click(continueButton); // Message 2

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /claim rewards/i })).toBeInTheDocument();
      });
    });
  });

  describe('NPC Context', () => {
    it('should handle undefined npcId gracefully', () => {
      render(<PostBattleCutscene victory={true} npcId={undefined} />);

      // Should show generic messages
      expect(screen.getByText(/enemies have been defeated/i)).toBeInTheDocument();
    });

    it('should include npcId in messages when provided', () => {
      render(<PostBattleCutscene victory={true} npcId="zombie-keeper" />);

      expect(screen.getByText(/zombie-keeper/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button labels', () => {
      render(<PostBattleCutscene victory={true} />);

      const continueButton = screen.getByRole('button', { name: /continue/i });
      expect(continueButton).toHaveAttribute('aria-label');
    });

    it('should support keyboard navigation', () => {
      render(<PostBattleCutscene victory={true} />);

      // Should respond to keyboard events
      fireEvent.keyDown(window, { key: 'Enter' });
      expect(screen.getByText(/Victory is yours/i)).toBeInTheDocument();
    });
  });
});
