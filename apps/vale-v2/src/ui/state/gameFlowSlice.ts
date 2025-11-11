import type { StateCreator } from 'zustand';
import type { MapTrigger } from '@/core/models/overworld';

export interface GameFlowSlice {
  mode: 'overworld' | 'battle' | 'rewards' | 'dialogue';
  lastTrigger: MapTrigger | null;
  setMode: (mode: GameFlowSlice['mode']) => void;
  handleTrigger: (trigger: MapTrigger | null) => void;
  resetLastTrigger: () => void;
}

export const createGameFlowSlice: StateCreator<GameFlowSlice> = (set) => ({
  mode: 'overworld',
  lastTrigger: null,
  setMode: (mode) => set({ mode }),
  handleTrigger: (trigger) => {
    if (!trigger) {
      set({ lastTrigger: null });
      return;
    }
    const nextMode = trigger.type === 'battle' ? 'battle' : 'overworld';
    set({ lastTrigger: trigger, mode: nextMode });
  },
  resetLastTrigger: () => set({ lastTrigger: null }),
});
