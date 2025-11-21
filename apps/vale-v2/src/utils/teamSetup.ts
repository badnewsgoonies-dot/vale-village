import { createTeam } from '@/core/models/Team';
import { createUnit } from '@/core/models/Unit';
import { UNIT_DEFINITIONS } from '@/data/definitions/units';
import { collectDjinn, equipDjinn } from '@/core/services/DjinnService';
import type { Team } from '@/core/models/Team';
import type { Unit } from '@/core/models/Unit';

function createIsaacUnit(level = 1, xp = 0): Unit {
  const adeptDefinition = UNIT_DEFINITIONS['adept'];
  if (!adeptDefinition) {
    throw new Error('Adept unit definition not found');
  }
  return createUnit(adeptDefinition, level, xp);
}

export function createBaseIsaacTeam(level = 1, xp = 0): { isaac: Unit; team: Team } {
  const isaac = createIsaacUnit(level, xp);
  const team = createTeam([isaac]);
  return { isaac, team };
}

export function createVs1IsaacTeam(): { isaac: Unit; team: Team } {
  const { isaac, team: baseTeam } = createBaseIsaacTeam();
  const flintCollectResult = collectDjinn(baseTeam, 'flint');
  if (!flintCollectResult.ok) {
    throw new Error(`Failed to collect Flint Djinn: ${flintCollectResult.error}`);
  }

  const flintEquipResult = equipDjinn(flintCollectResult.value, 'flint', 0);
  if (!flintEquipResult.ok) {
    throw new Error(`Failed to equip Flint Djinn: ${flintEquipResult.error}`);
  }

  return { isaac, team: flintEquipResult.value };
}
