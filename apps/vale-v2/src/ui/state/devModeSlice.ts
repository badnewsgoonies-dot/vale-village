/**
 * Dev Mode State Slice
 * Manages development mode overlay for rapid house testing
 *
 * IMPORTANT: Dev mode is OFF by default and only activates via keyboard shortcut (Ctrl+D)
 */

import type { StateCreator } from 'zustand';

export interface DevModeSlice {
  /** Whether dev mode overlay is visible */
  devModeEnabled: boolean;

  /** Currently selected house for inspection (not used for now, future feature) */
  selectedHouseId: string | null;

  /** Toggle dev mode overlay on/off */
  toggleDevMode: () => void;

  /** Set dev mode enabled state */
  setDevModeEnabled: (enabled: boolean) => void;

  /** Set selected house */
  setSelectedHouse: (houseId: string | null) => void;
}

export const createDevModeSlice: StateCreator<
  DevModeSlice,
  [['zustand/devtools', never]],
  [],
  DevModeSlice
> = (set) => ({
  devModeEnabled: false,
  selectedHouseId: null,

  toggleDevMode: () => set((state) => ({
    devModeEnabled: !state.devModeEnabled
  })),

  setDevModeEnabled: (enabled) => set({ devModeEnabled: enabled }),

  setSelectedHouse: (houseId) => set({ selectedHouseId: houseId }),
});
