/**
 * Content Balance Validation
 * Validates game content for balance issues
 *
 * Checks:
 * - Enemy stat reasonableness (ATK/HP/DEF ratios)
 * - Encounter difficulty (total enemy power)
 * - Ability balance (damage vs cost)
 * - Equipment stat totals
 *
 * Integrated into validateAll.ts to run at startup
 */

import type { Enemy } from '../../data/schemas/EnemySchema';
import type { Ability } from '../../data/schemas/AbilitySchema';
import type { Equipment } from '../../data/schemas/EquipmentSchema';
import type { Encounter } from '../../data/schemas/EncounterSchema';
// Unused import: import type { Unit } from .../models/Unit

/**
 * Balance warning
 */
export interface BalanceWarning {
  type: 'enemy' | 'ability' | 'equipment' | 'encounter';
  id: string;
  severity: 'minor' | 'moderate' | 'severe';
  issue: string;
  details?: Record<string, unknown>;
}

/**
 * Validate all content balance
 * Returns array of warnings (empty if no issues)
 */
export function validateContentBalance(content: {
  enemies: Record<string, Enemy>;
  abilities: Record<string, Ability>;
  equipment: Record<string, Equipment>;
  encounters?: Record<string, Encounter>;
}): BalanceWarning[] {
  const warnings: BalanceWarning[] = [];

  // Validate enemies
  for (const [id, enemy] of Object.entries(content.enemies)) {
    warnings.push(...validateEnemyBalance(id, enemy));
  }

  // Validate abilities
  for (const [id, ability] of Object.entries(content.abilities)) {
    warnings.push(...validateAbilityBalance(id, ability));
  }

  // Validate equipment
  for (const [id, equipment] of Object.entries(content.equipment)) {
    warnings.push(...validateEquipmentBalance(id, equipment));
  }

  // Validate encounters (if provided)
  if (content.encounters) {
    for (const [id, encounter] of Object.entries(content.encounters)) {
      warnings.push(...validateEncounterBalance(id, encounter, content.enemies));
    }
  }

  return warnings;
}

/**
 * Validate enemy balance
 */
function validateEnemyBalance(id: string, enemy: Enemy): BalanceWarning[] {
  const warnings: BalanceWarning[] = [];

  // ATK too high relative to HP (glass cannon)
  if (enemy.stats.atk > enemy.stats.hp * 0.5) {
    warnings.push({
      type: 'enemy',
      id,
      severity: 'minor',
      issue: 'Very high ATK relative to HP (glass cannon)',
      details: {
        hp: enemy.stats.hp,
        atk: enemy.stats.atk,
        ratio: (enemy.stats.atk / enemy.stats.hp).toFixed(2),
      },
    });
  }

  // ATK extremely low (can't hurt player)
  if (enemy.stats.atk < 5 && enemy.level > 3) {
    warnings.push({
      type: 'enemy',
      id,
      severity: 'moderate',
      issue: 'Very low ATK for level (no threat)',
      details: {
        level: enemy.level,
        atk: enemy.stats.atk,
      },
    });
  }

  // DEF too high relative to ATK (unkillable)
  if (enemy.stats.def > enemy.stats.atk * 2) {
    warnings.push({
      type: 'enemy',
      id,
      severity: 'moderate',
      issue: 'Very high DEF relative to ATK (slow fight)',
      details: {
        atk: enemy.stats.atk,
        def: enemy.stats.def,
        ratio: (enemy.stats.def / enemy.stats.atk).toFixed(2),
      },
    });
  }

  // HP extremely low (one-shot)
  if (enemy.stats.hp < 10 && enemy.level > 1) {
    warnings.push({
      type: 'enemy',
      id,
      severity: 'minor',
      issue: 'Very low HP (may die in one hit)',
      details: {
        level: enemy.level,
        hp: enemy.stats.hp,
      },
    });
  }

  // HP extremely high (tedious fight)
  if (enemy.stats.hp > 500) {
    warnings.push({
      type: 'enemy',
      id,
      severity: 'minor',
      issue: 'Very high HP (potentially tedious)',
      details: {
        hp: enemy.stats.hp,
      },
    });
  }

  // No abilities (boring fight)
  if (enemy.abilities.length === 0) {
    warnings.push({
      type: 'enemy',
      id,
      severity: 'minor',
      issue: 'No abilities (only basic attacks)',
      details: {
        abilityCount: 0,
      },
    });
  }

  // Too many abilities (complexity)
  if (enemy.abilities.length > 6) {
    warnings.push({
      type: 'enemy',
      id,
      severity: 'minor',
      issue: 'Many abilities (AI may not use effectively)',
      details: {
        abilityCount: enemy.abilities.length,
      },
    });
  }

  // SPD extremely low (always acts last)
  if (enemy.stats.spd < 5) {
    warnings.push({
      type: 'enemy',
      id,
      severity: 'minor',
      issue: 'Very low SPD (always acts last)',
      details: {
        spd: enemy.stats.spd,
      },
    });
  }

  // SPD extremely high (always acts first)
  if (enemy.stats.spd > 30) {
    warnings.push({
      type: 'enemy',
      id,
      severity: 'minor',
      issue: 'Very high SPD (always acts first)',
      details: {
        spd: enemy.stats.spd,
      },
    });
  }

  return warnings;
}

/**
 * Validate ability balance
 */
function validateAbilityBalance(id: string, ability: Ability): BalanceWarning[] {
  const warnings: BalanceWarning[] = [];

  // Physical/Psynergy abilities
  if (ability.type === 'physical' || ability.type === 'psynergy') {
    // High damage for free (mana cost 0)
    if (ability.basePower > 25 && ability.manaCost === 0) {
      warnings.push({
        type: 'ability',
        id,
        severity: 'moderate',
        issue: 'High damage for zero mana cost',
        details: {
          basePower: ability.basePower,
          manaCost: ability.manaCost,
        },
      });
    }

    // High mana cost but low damage (inefficient)
    if (ability.manaCost > 5 && ability.basePower < ability.manaCost * 5) {
      warnings.push({
        type: 'ability',
        id,
        severity: 'minor',
        issue: 'High mana cost relative to damage',
        details: {
          basePower: ability.basePower,
          manaCost: ability.manaCost,
          efficiency: (ability.basePower / ability.manaCost).toFixed(2),
        },
      });
    }

    // Very low damage for high unlock level
    if (ability.basePower < 10 && ability.unlockLevel > 10) {
      warnings.push({
        type: 'ability',
        id,
        severity: 'moderate',
        issue: 'Low damage for high unlock level',
        details: {
          basePower: ability.basePower,
          unlockLevel: ability.unlockLevel,
        },
      });
    }
  }

  // Healing abilities
  if (ability.type === 'healing') {
    // Healing has no base power
    if (!ability.basePower || ability.basePower === 0) {
      warnings.push({
        type: 'ability',
        id,
        severity: 'severe',
        issue: 'Healing ability has no basePower',
        details: {
          basePower: ability.basePower,
        },
      });
    }

    // Free healing (mana cost 0)
    if (ability.manaCost === 0) {
      warnings.push({
        type: 'ability',
        id,
        severity: 'moderate',
        issue: 'Healing ability costs no mana',
        details: {
          manaCost: ability.manaCost,
        },
      });
    }
  }

  // Buff/Debuff abilities
  if (ability.buffEffect) {
    const buffTotal = Math.abs(ability.buffEffect.atk ?? 0) +
                     Math.abs(ability.buffEffect.def ?? 0) +
                     Math.abs(ability.buffEffect.spd ?? 0);

    // Very large stat changes
    if (buffTotal > 20) {
      warnings.push({
        type: 'ability',
        id,
        severity: 'moderate',
        issue: 'Very large stat buff/debuff',
        details: {
          buffEffect: ability.buffEffect,
          total: buffTotal,
        },
      });
    }

    // Permanent buff (no duration)
    if (!ability.duration || ability.duration === 0) {
      warnings.push({
        type: 'ability',
        id,
        severity: 'severe',
        issue: 'Buff has no duration (permanent?)',
        details: {
          buffEffect: ability.buffEffect,
          duration: ability.duration,
        },
      });
    }
  }

  // Unlock level out of range
  if (ability.unlockLevel < 1 || ability.unlockLevel > 20) {
    warnings.push({
      type: 'ability',
      id,
      severity: 'severe',
      issue: 'Unlock level out of valid range (1-20)',
      details: {
        unlockLevel: ability.unlockLevel,
      },
    });
  }

  return warnings;
}

/**
 * Validate equipment balance
 */
function validateEquipmentBalance(id: string, equipment: Equipment): BalanceWarning[] {
  const warnings: BalanceWarning[] = [];

  const statBonus = equipment.statBonus ?? {};
  const totalStats = (statBonus.hp ?? 0) +
                    (statBonus.atk ?? 0) +
                    (statBonus.def ?? 0) +
                    (statBonus.spd ?? 0);

  // Very high total stat bonus
  if (totalStats > 50) {
    warnings.push({
      type: 'equipment',
      id,
      severity: 'moderate',
      issue: 'Very high total stat bonus',
      details: {
        statBonus,
        total: totalStats,
      },
    });
  }

  // No stat bonus (useless equipment)
  if (totalStats === 0 && !equipment.unlocksAbility) {
    warnings.push({
      type: 'equipment',
      id,
      severity: 'minor',
      issue: 'Equipment has no stat bonus or unlocked ability',
      details: {
        statBonus,
      },
    });
  }

  // Individual stat extremely high
  if ((statBonus.hp ?? 0) > 30) {
    warnings.push({
      type: 'equipment',
      id,
      severity: 'minor',
      issue: 'Very high HP bonus',
      details: { hp: statBonus.hp },
    });
  }

  if ((statBonus.atk ?? 0) > 15) {
    warnings.push({
      type: 'equipment',
      id,
      severity: 'minor',
      issue: 'Very high ATK bonus',
      details: { atk: statBonus.atk },
    });
  }

  if ((statBonus.def ?? 0) > 15) {
    warnings.push({
      type: 'equipment',
      id,
      severity: 'minor',
      issue: 'Very high DEF bonus',
      details: { def: statBonus.def },
    });
  }

  if ((statBonus.spd ?? 0) > 15) {
    warnings.push({
      type: 'equipment',
      id,
      severity: 'minor',
      issue: 'Very high SPD bonus',
      details: { spd: statBonus.spd },
    });
  }

  return warnings;
}

/**
 * Validate encounter balance
 */
function validateEncounterBalance(
  id: string,
  encounter: Encounter,
  enemyDefinitions: Record<string, Enemy>
): BalanceWarning[] {
  const warnings: BalanceWarning[] = [];

  // Calculate total encounter power
  let totalPower = 0;
  for (const enemyId of encounter.enemies) {
    const enemyDef = enemyDefinitions[enemyId];
    if (enemyDef) {
      const power = enemyDef.stats.hp + enemyDef.stats.atk + enemyDef.stats.def;
      totalPower += power;
    }
  }

  // Very weak encounter
  if (totalPower < 50) {
    warnings.push({
      type: 'encounter',
      id,
      severity: 'minor',
      issue: 'Very weak encounter (trivial fight)',
      details: {
        totalPower,
        enemyCount: encounter.enemies.length,
      },
    });
  }

  // Very strong encounter
  if (totalPower > 1000) {
    warnings.push({
      type: 'encounter',
      id,
      severity: 'moderate',
      issue: 'Very strong encounter (potentially unwinnable)',
      details: {
        totalPower,
        enemyCount: encounter.enemies.length,
      },
    });
  }

  // Many enemies (complexity)
  if (encounter.enemies.length > 5) {
    warnings.push({
      type: 'encounter',
      id,
      severity: 'minor',
      issue: 'Many enemies (complex battle)',
      details: {
        enemyCount: encounter.enemies.length,
      },
    });
  }

  // No enemies (invalid)
  if (encounter.enemies.length === 0) {
    warnings.push({
      type: 'encounter',
      id,
      severity: 'severe',
      issue: 'Encounter has no enemies',
      details: {
        enemyCount: 0,
      },
    });
  }

  return warnings;
}

/**
 * Format balance warnings for display
 */
export function formatBalanceWarnings(warnings: BalanceWarning[]): string {
  if (warnings.length === 0) {
    return '✅ No balance issues detected';
  }

  const grouped = {
    severe: warnings.filter(w => w.severity === 'severe'),
    moderate: warnings.filter(w => w.severity === 'moderate'),
    minor: warnings.filter(w => w.severity === 'minor'),
  };

  const lines: string[] = [];

  if (grouped.severe.length > 0) {
    lines.push(`🔴 SEVERE (${grouped.severe.length}):`);
    for (const w of grouped.severe) {
      lines.push(`  - [${w.type}] ${w.id}: ${w.issue}`);
    }
  }

  if (grouped.moderate.length > 0) {
    lines.push(`🟡 MODERATE (${grouped.moderate.length}):`);
    for (const w of grouped.moderate) {
      lines.push(`  - [${w.type}] ${w.id}: ${w.issue}`);
    }
  }

  if (grouped.minor.length > 0) {
    lines.push(`🟢 MINOR (${grouped.minor.length}):`);
    for (const w of grouped.minor.slice(0, 10)) {
      // Limit minor warnings
      lines.push(`  - [${w.type}] ${w.id}: ${w.issue}`);
    }
    if (grouped.minor.length > 10) {
      lines.push(`  ... and ${grouped.minor.length - 10} more minor warnings`);
    }
  }

  return lines.join('\n');
}
