import { useEffect, useState } from 'react';
import type { Unit } from '@/types/Unit';

/**
 * Auto-selects the first unit from a list if no unit is currently selected.
 * Commonly used in menu screens to ensure a unit is always selected.
 */
export function useAutoSelectUnit(units: Unit[], initialUnit: Unit | null = null) {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(initialUnit);

  useEffect(() => {
    if (!selectedUnit && units.length > 0) {
      setSelectedUnit(units[0]);
    }
  }, [units, selectedUnit]);

  return [selectedUnit, setSelectedUnit] as const;
}
