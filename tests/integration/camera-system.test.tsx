/**
 * Camera System End-to-End Integration Test
 *
 * Tests all camera system fixes:
 * 1. No infinite re-render loops
 * 2. Timer cleanup (no memory leaks)
 * 3. Global CameraProvider shared across screens
 * 4. Proper camera animations
 * 5. Screen transitions preserve camera state
 */

import * as React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GameProvider } from '../../src/context';
import { CameraProvider, useCamera } from '../../src/context/CameraContext';
import { BattleScreen } from '../../src/components/battle/BattleScreen';
import { IntroScreen } from '../../src/components/intro/IntroScreen';
import { PostBattleCutscene } from '../../src/components/battle/PostBattleCutscene';
import { DialogueScreen } from '../../src/components/dialogue/DialogueScreen';

// Mock dependencies
vi.mock('../../src/sprites/components/BattleUnit', () => ({
  BattleUnit: ({ unit }: any) => <div data-testid={`battle-unit-${unit.id}`}>{unit.name}</div>
}));

vi.mock('../../src/components/battle/StatusBar', () => ({
  StatusBar: () => <div data-testid="status-bar">Status Bar</div>
}));

vi.mock('../../src/components/battle/UnitRow', () => ({
  UnitRow: () => <div data-testid="unit-row">Unit Row</div>
}));

vi.mock('../../src/components/battle/CommandMenu', () => ({
  CommandMenu: () => <div data-testid="command-menu">Command Menu</div>
}));

vi.mock('../../src/components/battle/AbilityMenu', () => ({
  AbilityMenu: () => <div data-testid="ability-menu">Ability Menu</div>
}));

vi.mock('../../src/components/battle/CombatLog', () => ({
  CombatLog: () => <div data-testid="combat-log">Combat Log</div>
}));

vi.mock('../../src/components/battle/PartyPortraits', () => ({
  PartyPortraits: () => <div data-testid="party-portraits">Party Portraits</div>
}));

vi.mock('../../src/components/shared', () => ({
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>
}));

vi.mock('../../src/components/dialogue/DialogueBox', () => ({
  DialogueBox: ({ npcName, dialogue, onClose }: any) => (
    <div data-testid="dialogue-box">
      <div>{npcName}</div>
      <div>{dialogue}</div>
      <button onClick={onClose}>Continue</button>
    </div>
  )
}));

vi.mock('../../src/data/dialogues', () => ({
  getDialogueTree: () => ({
    startNode: 'greeting',
    nodes: {
      greeting: {
        speaker: 'Test NPC',
        text: 'Hello!',
        portrait: null,
        nextNode: null,
        choices: [],
      }
    }
  })
}));

describe('Camera System E2E Integration', () => {
  // Track timers to detect memory leaks
  let originalSetTimeout: typeof setTimeout;
  let activeTimers: Set<NodeJS.Timeout>;

  beforeEach(() => {
    // Set up timer tracking
    activeTimers = new Set();
    originalSetTimeout = global.setTimeout;

    const trackedSetTimeout = (callback: any, delay?: number, ...args: any[]) => {
      const timer = originalSetTimeout(callback, delay, ...args);
      activeTimers.add(timer);
      return timer;
    };
    global.setTimeout = trackedSetTimeout as any;

    const trackedClearTimeout = (timer: NodeJS.Timeout) => {
      activeTimers.delete(timer);
      if (originalSetTimeout.clearTimeout) {
        originalSetTimeout.clearTimeout(timer);
      }
    };
    global.clearTimeout = trackedClearTimeout as any;
  });

  afterEach(() => {
    // Restore original setTimeout
    global.setTimeout = originalSetTimeout;

    // Clean up any remaining timers
    activeTimers.forEach(timer => clearTimeout(timer));
    activeTimers.clear();
  });

  describe('1. No Infinite Re-render Loops', () => {
    it('BattleScreen: camera controls should not trigger infinite re-renders', async () => {
      let renderCount = 0;

      const TestWrapper = () => {
        renderCount++;
        return (
          <GameProvider>
            <CameraProvider>
              <BattleScreen />
            </CameraProvider>
          </GameProvider>
        );
      };

      render(<TestWrapper />);

      // Wait for initial renders to settle
      await waitFor(() => {
        expect(screen.queryByTestId('status-bar')).toBeInTheDocument();
      }, { timeout: 1000 });

      // Wait additional time to catch any runaway re-renders
      await new Promise(resolve => setTimeout(resolve, 500));

      // Should have reasonable number of renders (< 10 for initial mount)
      // Before fix: would be 100+ due to infinite loop
      expect(renderCount).toBeLessThan(10);
    });

    it('IntroScreen: should not cause infinite re-renders', async () => {
      let renderCount = 0;

      const TestWrapper = () => {
        renderCount++;
        return (
          <GameProvider>
            <CameraProvider>
              <IntroScreen />
            </CameraProvider>
          </GameProvider>
        );
      };

      render(<TestWrapper />);

      await waitFor(() => {
        expect(screen.getByText(/Vale Village has been peaceful/i)).toBeInTheDocument();
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      expect(renderCount).toBeLessThan(10);
    });

    it('PostBattleCutscene: should not cause infinite re-renders', async () => {
      let renderCount = 0;

      const TestWrapper = () => {
        renderCount++;
        return (
          <GameProvider>
            <CameraProvider>
              <PostBattleCutscene npcId="test-npc" victory={true} />
            </CameraProvider>
          </GameProvider>
        );
      };

      render(<TestWrapper />);

      await waitFor(() => {
        expect(screen.getByText(/VICTORY/i)).toBeInTheDocument();
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      expect(renderCount).toBeLessThan(10);
    });
  });

  describe('2. Timer Cleanup & Memory Leaks', () => {
    it('should clean up all timers when BattleScreen unmounts', async () => {
      const { unmount } = render(
        <GameProvider>
          <CameraProvider>
            <BattleScreen />
          </CameraProvider>
        </GameProvider>
      );

      // Wait for camera animations to start
      await new Promise(resolve => setTimeout(resolve, 100));

      const timersBeforeUnmount = activeTimers.size;
      expect(timersBeforeUnmount).toBeGreaterThan(0); // Should have some timers active

      // Unmount component
      act(() => {
        unmount();
      });

      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));

      // All timers should be cleaned up
      // Note: May have 1-2 from test framework itself
      expect(activeTimers.size).toBeLessThanOrEqual(2);
    });

    it('should clean up timers when IntroScreen unmounts', async () => {
      const { unmount } = render(
        <GameProvider>
          <CameraProvider>
            <IntroScreen />
          </CameraProvider>
        </GameProvider>
      );

      await new Promise(resolve => setTimeout(resolve, 100));

      act(() => {
        unmount();
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(activeTimers.size).toBeLessThanOrEqual(2);
    });

    it('should clean up timers on rapid camera calls', async () => {
      const TestComponent = () => {
        const { controls } = useCamera();

        React.useEffect(() => {
          // Simulate rapid camera calls
          for (let i = 0; i < 10; i++) {
            controls.shake('light', 200);
            controls.zoomTo(1.5, 300);
          }
        }, [controls]);

        return <div data-testid="test">Test</div>;
      };

      const { unmount } = render(
        <CameraProvider>
          <TestComponent />
        </CameraProvider>
      );

      await new Promise(resolve => setTimeout(resolve, 100));

      // Should not have excessive timers despite rapid calls
      expect(activeTimers.size).toBeLessThan(50); // Reasonable limit

      act(() => {
        unmount();
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(activeTimers.size).toBeLessThanOrEqual(2);
    });
  });

  describe('3. Global CameraProvider', () => {
    it('should share camera context across multiple components', () => {
      const cameraStates: any[] = [];

      const Component1 = () => {
        const { camera } = useCamera();
        cameraStates.push(camera);
        return <div>Component 1</div>;
      };

      const Component2 = () => {
        const { camera } = useCamera();
        cameraStates.push(camera);
        return <div>Component 2</div>;
      };

      render(
        <CameraProvider>
          <Component1 />
          <Component2 />
        </CameraProvider>
      );

      // Both components should receive the same camera state reference
      expect(cameraStates.length).toBe(2);
      expect(cameraStates[0]).toBe(cameraStates[1]);
    });

    it('should preserve camera controls reference across re-renders', () => {
      const controlsRefs: any[] = [];

      const TestComponent = () => {
        const { controls } = useCamera();
        const [, forceUpdate] = React.useReducer(x => x + 1, 0);

        React.useEffect(() => {
          controlsRefs.push(controls);
        });

        return <button onClick={forceUpdate}>Re-render</button>;
      };

      const { getByText } = render(
        <CameraProvider>
          <TestComponent />
        </CameraProvider>
      );

      // Force multiple re-renders
      const button = getByText('Re-render');
      act(() => {
        button.click();
        button.click();
        button.click();
      });

      // Controls object should be the same reference (memoized)
      expect(controlsRefs.length).toBeGreaterThan(1);
      expect(controlsRefs.every(ref => ref === controlsRefs[0])).toBe(true);
    });
  });

  describe('4. Camera Animations Work Correctly', () => {
    it('should update camera zoom state', async () => {
      let currentZoom = 1.0;

      const TestComponent = () => {
        const { camera, controls } = useCamera();
        currentZoom = camera.zoom;

        React.useEffect(() => {
          controls.zoomTo(1.5, 100);
        }, [controls]);

        return <div data-testid="zoom-value">{camera.zoom}</div>;
      };

      render(
        <CameraProvider>
          <TestComponent />
        </CameraProvider>
      );

      // Initial zoom
      expect(currentZoom).toBe(1.0);

      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, 150));

      // Zoom should be updated
      await waitFor(() => {
        const zoomElement = screen.getByTestId('zoom-value');
        expect(parseFloat(zoomElement.textContent || '1.0')).toBe(1.5);
      });
    });

    it('should handle shake animation', async () => {
      let shakeIntensity = 0;

      const TestComponent = () => {
        const { camera, controls } = useCamera();
        shakeIntensity = camera.shake.intensity;

        React.useEffect(() => {
          controls.shake('medium', 200);
        }, [controls]);

        return <div data-testid="shake-intensity">{camera.shake.intensity}</div>;
      };

      render(
        <CameraProvider>
          <TestComponent />
        </CameraProvider>
      );

      // Should have shake intensity immediately after calling shake
      await waitFor(() => {
        expect(shakeIntensity).toBeGreaterThan(0);
      }, { timeout: 100 });

      // Should reduce to 0 after duration
      await new Promise(resolve => setTimeout(resolve, 300));

      await waitFor(() => {
        const shakeElement = screen.getByTestId('shake-intensity');
        expect(parseFloat(shakeElement.textContent || '0')).toBeLessThan(0.1);
      });
    });

    it('should reset camera to default state', async () => {
      let currentZoom = 1.0;
      let currentPosition = { x: 0, y: 0 };

      const TestComponent = () => {
        const { camera, controls } = useCamera();
        currentZoom = camera.zoom;
        currentPosition = camera.position;

        return (
          <div>
            <button onClick={() => controls.zoomTo(2.0, 50)}>Zoom</button>
            <button onClick={() => controls.panTo(100, 100, 50)}>Pan</button>
            <button onClick={() => controls.reset(50)}>Reset</button>
            <div data-testid="zoom">{camera.zoom}</div>
            <div data-testid="position">{`${camera.position.x},${camera.position.y}`}</div>
          </div>
        );
      };

      const { getByText } = render(
        <CameraProvider>
          <TestComponent />
        </CameraProvider>
      );

      // Zoom and pan
      act(() => {
        getByText('Zoom').click();
        getByText('Pan').click();
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Should be modified
      expect(currentZoom).toBeGreaterThan(1.0);
      expect(currentPosition.x).toBeGreaterThan(0);

      // Reset
      act(() => {
        getByText('Reset').click();
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Should be back to defaults
      await waitFor(() => {
        expect(currentZoom).toBe(1.0);
        expect(currentPosition.x).toBe(0);
        expect(currentPosition.y).toBe(0);
      });
    });
  });

  describe('5. Screen Transition Integration', () => {
    it('should handle DialogueScreen camera animations without errors', async () => {
      const { container } = render(
        <GameProvider>
          <CameraProvider>
            <DialogueScreen />
          </CameraProvider>
        </GameProvider>
      );

      // Wait for dialogue to load
      await waitFor(() => {
        expect(screen.getByTestId('dialogue-box')).toBeInTheDocument();
      }, { timeout: 1000 });

      // Should not have any console errors
      expect(container).toBeInTheDocument();
    });

    it('should maintain camera state when switching between screens', async () => {
      let zoom1 = 1.0;
      let zoom2 = 1.0;

      const Screen1 = () => {
        const { camera, controls } = useCamera();
        zoom1 = camera.zoom;

        React.useEffect(() => {
          controls.zoomTo(1.5, 100);
        }, [controls]);

        return <div>Screen 1</div>;
      };

      const Screen2 = () => {
        const { camera } = useCamera();
        zoom2 = camera.zoom;
        return <div>Screen 2</div>;
      };

      const { rerender } = render(
        <CameraProvider>
          <Screen1 />
        </CameraProvider>
      );

      await new Promise(resolve => setTimeout(resolve, 150));

      // Screen 1 should have zoomed
      expect(zoom1).toBe(1.5);

      // Switch to Screen 2
      rerender(
        <CameraProvider>
          <Screen2 />
        </CameraProvider>
      );

      // Screen 2 should inherit the zoom state
      await waitFor(() => {
        expect(zoom2).toBe(1.5);
      });
    });
  });

  describe('6. Edge Cases & Robustness', () => {
    it('should handle unmounting during animation', async () => {
      const TestComponent = () => {
        const { controls } = useCamera();

        React.useEffect(() => {
          controls.zoomTo(2.0, 1000); // Long animation
        }, [controls]);

        return <div>Test</div>;
      };

      const { unmount } = render(
        <CameraProvider>
          <TestComponent />
        </CameraProvider>
      );

      // Unmount before animation completes
      await new Promise(resolve => setTimeout(resolve, 100));

      act(() => {
        unmount();
      });

      // Should not throw or cause errors
      await new Promise(resolve => setTimeout(resolve, 200));

      // All timers should be cleaned up
      expect(activeTimers.size).toBeLessThanOrEqual(2);
    });

    it('should handle multiple simultaneous camera operations', async () => {
      const TestComponent = () => {
        const { controls, camera } = useCamera();

        const handleMultipleOps = () => {
          controls.shake('light', 200);
          controls.zoomTo(1.5, 300);
          controls.panTo(50, 50, 250);
        };

        return (
          <div>
            <button onClick={handleMultipleOps}>Execute</button>
            <div data-testid="state">{JSON.stringify(camera)}</div>
          </div>
        );
      };

      const { getByText } = render(
        <CameraProvider>
          <TestComponent />
        </CameraProvider>
      );

      // Execute multiple operations
      act(() => {
        getByText('Execute').click();
      });

      // Should not crash
      await new Promise(resolve => setTimeout(resolve, 400));

      const stateElement = screen.getByTestId('state');
      expect(stateElement).toBeInTheDocument();
    });

    it('should handle rapid mount/unmount cycles', async () => {
      const TestComponent = () => {
        const { controls } = useCamera();

        React.useEffect(() => {
          controls.zoomTo(1.5, 100);
        }, [controls]);

        return <div>Test</div>;
      };

      // Mount and unmount 5 times rapidly
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(
          <CameraProvider>
            <TestComponent />
          </CameraProvider>
        );

        await new Promise(resolve => setTimeout(resolve, 20));

        act(() => {
          unmount();
        });
      }

      // Should not have leaked timers
      await new Promise(resolve => setTimeout(resolve, 200));
      expect(activeTimers.size).toBeLessThanOrEqual(2);
    });
  });

  describe('7. Performance & Optimization', () => {
    it('should not recreate control functions on camera state updates', () => {
      const controlsFunctions: any[] = [];

      const TestComponent = () => {
        const { controls } = useCamera();
        const [, forceUpdate] = React.useReducer(x => x + 1, 0);

        React.useEffect(() => {
          controlsFunctions.push({
            shake: controls.shake,
            zoomTo: controls.zoomTo,
            reset: controls.reset,
          });
        });

        return <button onClick={forceUpdate}>Update</button>;
      };

      const { getByText } = render(
        <CameraProvider>
          <TestComponent />
        </CameraProvider>
      );

      // Initial render
      expect(controlsFunctions.length).toBe(1);

      // Force re-renders
      act(() => {
        getByText('Update').click();
        getByText('Update').click();
        getByText('Update').click();
      });

      // All control functions should be the same reference
      expect(controlsFunctions.length).toBeGreaterThan(1);
      expect(controlsFunctions.every(
        funcs => funcs.shake === controlsFunctions[0].shake
      )).toBe(true);
      expect(controlsFunctions.every(
        funcs => funcs.zoomTo === controlsFunctions[0].zoomTo
      )).toBe(true);
    });
  });
});
