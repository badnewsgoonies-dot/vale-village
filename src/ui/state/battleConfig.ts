import type { Team } from '@/core/models/Team';
import type { Unit } from '@/core/models/Unit';
import { MIN_PARTY_SIZE, MAX_PARTY_SIZE } from '@/core/constants';
import type { EquipmentLoadout, Equipment } from '@/core/models/Equipment';
import { createEmptyLoadout } from '@/core/models/Equipment';

export interface BattleSlotConfig {
  readonly slotIndex: number;
  readonly unitId: string | null;
  readonly equipmentLoadout: EquipmentLoadout;
  readonly metadata?: Record<string, unknown>;
}

export interface BattleConfig {
  readonly slots: readonly BattleSlotConfig[];
  readonly djinnSlots: readonly (string | null)[];
  readonly metadata?: Record<string, unknown>;
}

export const DEFAULT_BATTLE_SLOT_COUNT = MAX_PARTY_SIZE;
export const DEFAULT_DJINN_SLOT_COUNT = 3;

export function cloneEquipmentLoadout(loadout: EquipmentLoadout): EquipmentLoadout {
  return {
    weapon: loadout.weapon ?? null,
    armor: loadout.armor ?? null,
    helm: loadout.helm ?? null,
    boots: loadout.boots ?? null,
    accessory: loadout.accessory ?? null,
  };
}

function getDefaultEquipmentLoadoutForUnit(unit?: Unit): EquipmentLoadout {
  if (!unit) {
    return createEmptyLoadout();
  }

  return cloneEquipmentLoadout(unit.equipment);
}

export function createDefaultDjinnSlots(selectedDjinn?: readonly string[]): readonly (string | null)[] {
  const slots: (string | null)[] = [];
  for (let index = 0; index < DEFAULT_DJINN_SLOT_COUNT; index += 1) {
    slots.push(selectedDjinn?.[index] ?? null);
  }
  return slots;
}

function createBattleConfigFromUnits(
  units: readonly Unit[],
  slotCount = DEFAULT_BATTLE_SLOT_COUNT,
  initialDjinn?: readonly string[]
): BattleConfig {
  const slots: BattleSlotConfig[] = [];
  for (let index = 0; index < slotCount; index += 1) {
    const unit = units[index];
    slots.push({
      slotIndex: index,
      unitId: unit?.id ?? null,
      equipmentLoadout: getDefaultEquipmentLoadoutForUnit(unit),
    });
  }

  return { slots, djinnSlots: createDefaultDjinnSlots(initialDjinn) };
}

export function buildBattleConfigForNextBattle(team: Team | null, roster: readonly Unit[], slotCount = DEFAULT_BATTLE_SLOT_COUNT): BattleConfig {
  const initialDjinn = team?.equippedDjinn;
  if (team && team.units.length > 0) {
    return createBattleConfigFromUnits(team.units, slotCount, initialDjinn);
  }

  return createBattleConfigFromUnits(roster, slotCount, initialDjinn);
}

export function getActiveSlotUnitIds(config: BattleConfig): readonly string[] {
  return config.slots
    .map((slot) => slot.unitId)
    .filter((unitId): unitId is string => Boolean(unitId));
}

export function getEquipmentLoadoutForSlot(config: BattleConfig, slotIndex: number): EquipmentLoadout {
  const slot = config.slots.find((entry) => entry.slotIndex === slotIndex);
  return slot ? cloneEquipmentLoadout(slot.equipmentLoadout) : createEmptyLoadout();
}

export function updateDjinnSlots(slots: readonly (string | null)[], slotIndex: number, djinnId: string | null): readonly (string | null)[] {
  const next = [...slots];
  next[slotIndex] = djinnId;
  return next;
}

export interface BattleConfigValidationResult {
  readonly valid: boolean;
  readonly message?: string;
}

export function validateBattleConfig(
  config: BattleConfig,
  inventory: readonly Equipment[],
  roster: readonly Unit[],
  team: Team | null
): BattleConfigValidationResult {
  if (!team) {
    return { valid: false, message: 'Team data is missing' };
  }

  const filledUnitIds = getActiveSlotUnitIds(config);
  if (filledUnitIds.length < MIN_PARTY_SIZE) {
    return { valid: false, message: `Select at least ${MIN_PARTY_SIZE} units before starting the battle` };
  }

  const inventoryCounts = new Map<string, number>();
  for (const item of inventory) {
    inventoryCounts.set(item.id, (inventoryCounts.get(item.id) ?? 0) + 1);
  }

  const equipmentUsage = new Map<string, number>();

  for (const slot of config.slots) {
    if (!slot.unitId) continue;

    const unit = roster.find((candidate) => candidate.id === slot.unitId) ??
      team.units.find((candidate) => candidate.id === slot.unitId);
    if (!unit) {
      return { valid: false, message: `Unit ${slot.unitId} is unavailable for this slot` };
    }

    const loadoutEntries = Object.values(slot.equipmentLoadout) as (Equipment | null)[];
    for (const equipment of loadoutEntries) {
      if (!equipment) continue;

      if (equipment.allowedElements.length > 0 && !equipment.allowedElements.includes(unit.element)) {
        return { valid: false, message: `${unit.name} cannot equip ${equipment.name}` };
      }

      const used = equipmentUsage.get(equipment.id) ?? 0;
      equipmentUsage.set(equipment.id, used + 1);
    }
  }

  for (const [equipmentId, used] of equipmentUsage.entries()) {
    const available = inventoryCounts.get(equipmentId) ?? 0;
    if (used > available) {
      return { valid: false, message: `Not enough copies of ${equipmentId} in your inventory` };
    }
  }

  const selectedDjinn = config.djinnSlots.filter((djinnId): djinnId is string => Boolean(djinnId));
  for (const djinnId of selectedDjinn) {
    if (!team.collectedDjinn.includes(djinnId)) {
      return { valid: false, message: `You do not own the ${djinnId} Djinn` };
    }
  }

  return { valid: true };
}
