import { useMemo } from 'react';
import { useGame } from '@/context/GameContext';

/**
 * Hook that provides commonly needed unit lists across menu screens.
 * Memoized to avoid recalculating on every render.
 */
export function useUnitLists() {
  const { state } = useGame();

  const allUnits = state.playerData.unitsCollected;
  const activePartyIds = state.playerData.activePartyIds;

  const { activeUnits, benchUnits } = useMemo(() => {
    const active = allUnits.filter(u => activePartyIds.includes(u.id));
    const bench = allUnits.filter(u => !activePartyIds.includes(u.id));
    return { activeUnits: active, benchUnits: bench };
  }, [allUnits, activePartyIds]);

  return {
    allUnits,
    activeUnits,
    benchUnits,
    activePartyIds,
  };
}

/**
 * Hook that provides equipped Djinn list.
 */
export function useEquippedDjinn() {
  const { state } = useGame();

  return useMemo(() => {
    return state.playerData.djinnCollected.filter(d =>
      state.playerData.equippedDjinnIds.includes(d.id)
    );
  }, [state.playerData.djinnCollected, state.playerData.equippedDjinnIds]);
}
