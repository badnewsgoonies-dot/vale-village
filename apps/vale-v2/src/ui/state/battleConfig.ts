import type { Team } from '@/core/models/Team';
import type { Unit } from '@/core/models/Unit';
import { MAX_PARTY_SIZE } from '@/core/constants';

export interface BattleSlotConfig {
  readonly slotIndex: number;
  readonly unitId: string | null;
  readonly metadata?: Record<string, unknown>;
}

export interface BattleConfig {
  readonly slots: readonly BattleSlotConfig[];
  readonly teamDjinn?: readonly string[];
  readonly metadata?: Record<string, unknown>;
}

export const DEFAULT_BATTLE_SLOT_COUNT = MAX_PARTY_SIZE;

function createBattleConfigFromUnits(units: readonly Unit[], slotCount = DEFAULT_BATTLE_SLOT_COUNT): BattleConfig {
  const slots: BattleSlotConfig[] = [];
  for (let index = 0; index < slotCount; index += 1) {
    slots.push({
      slotIndex: index,
      unitId: units[index]?.id ?? null,
    });
  }

  return { slots };
}

export function buildBattleConfigForNextBattle(team: Team | null, roster: readonly Unit[], slotCount = DEFAULT_BATTLE_SLOT_COUNT): BattleConfig {
  if (team && team.units.length > 0) {
    return createBattleConfigFromUnits(team.units, slotCount);
  }

  return createBattleConfigFromUnits(roster, slotCount);
}

export function getActiveSlotUnitIds(config: BattleConfig): readonly string[] {
  return config.slots
    .map((slot) => slot.unitId)
    .filter((unitId): unitId is string => Boolean(unitId));
}
