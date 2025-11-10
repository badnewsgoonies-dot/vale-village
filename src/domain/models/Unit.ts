import type { Element } from './Element';
import type { Stats, GrowthRates } from './Stats';
import type { Ability } from './Ability';
import type { Equipment, EquipmentLoadout } from './Equipment';
import type { Djinn, DjinnState } from './Djinn';
import { emptyLoadout } from './Equipment';
import { calculateDjinnSynergy } from './Djinn';
import { Ok, Err, type Result } from '@/utils/Result';
import { ABILITIES } from '@/data/abilities';

/**
 * XP curve from GAME_MECHANICS.md Section 1.1
 * Maps level → cumulative XP needed to reach that level
 */
const XP_CURVE: Record<number, number> = {
  1: 0,      // Starting XP
  2: 100,    // Level 1 → 2
  3: 350,    // Level 1 → 3  (100 + 250)
  4: 850,    // Level 1 → 4  (100 + 250 + 500)
  5: 1850    // Level 1 → 5  (100 + 250 + 500 + 1000)
};

/**
 * Unit role types
 */
export type UnitRole =
  | 'Balanced Warrior'
  | 'Pure DPS'
  | 'Elemental Mage'
  | 'Healer'
  | 'Rogue Assassin'
  | 'AoE Fire Mage'
  | 'Support Buffer'
  | 'Defensive Tank'
  | 'Versatile Scholar'
  | 'Master Warrior';

/**
 * Unit definition (base template)
 */
export interface UnitDefinition {
  id: string;
  name: string;
  element: Element;
  role: UnitRole;
  baseStats: Stats;
  growthRates: GrowthRates;
  abilities: Ability[];
  manaContribution: number;  // Base mana circles this unit provides to team pool
  description: string;
}

/**
 * Active status effect
 */
export interface StatusEffect {
  type: 'buff' | 'debuff' | 'poison' | 'burn' | 'freeze' | 'paralyze';
  stat?: keyof Stats;
  modifier?: number;
  damagePerTurn?: number;
  duration: number;
}

/**
 * Unit instance - represents a unit in the player's collection
 */
export class Unit {
  readonly id: string;
  readonly name: string;
  readonly element: Element;
  readonly role: UnitRole;
  readonly baseStats: Stats;
  readonly growthRates: GrowthRates;
  readonly description: string;

  // Mana contribution (can increase with levels/equipment)
  manaContribution: number;

  // Progression
  level: number;
  xp: number;

  // Current state (private with validated setters)
  private _currentHp: number;

  // Equipment and abilities
  equipment: EquipmentLoadout;
  djinn: Djinn[];
  djinnStates: Map<string, DjinnState>;
  abilities: Ability[];
  unlockedAbilityIds: Set<string>;

  // Battle state
  statusEffects: StatusEffect[];
  actionsTaken: number;
  battleStats: {
    damageDealt: number;
    damageTaken: number;
  };

  constructor(definition: UnitDefinition, level: number = 1, initialXp: number = 0) {
    this.id = definition.id;
    this.name = definition.name;
    this.element = definition.element;
    this.role = definition.role;
    this.baseStats = definition.baseStats;
    this.growthRates = definition.growthRates;
    this.description = definition.description;
    this.manaContribution = definition.manaContribution;

    this.level = Math.max(1, Math.min(5, level)); // Clamp to 1-5
    this.xp = initialXp;

    // Initialize equipment and djinn BEFORE calculating stats
    this.equipment = emptyLoadout();
    this.djinn = [];
    this.djinnStates = new Map();
    this.abilities = definition.abilities;
    this.unlockedAbilityIds = new Set();
    this.statusEffects = [];
    this.actionsTaken = 0;
    this.battleStats = {
      damageDealt: 0,
      damageTaken: 0,
    };

    // Unlock abilities based on level
    this.updateUnlockedAbilities();

    // Calculate max HP and set current to max
    // Initialize private fields directly (before setters are available)
    const stats = this.calculateStats();
    this._currentHp = stats.hp;
  }

  /**
   * Calculate final stats: base + level bonuses + equipment + Djinn synergy + buffs
   * Formula from GAME_MECHANICS.md Section 1.2 and 3.2
   *
   * @param team Optional team (for Djinn synergy bonuses). If provided, uses team's equipped Djinn.
   *             If not provided, falls back to per-unit Djinn (backward compatibility).
   */
  calculateStats(team?: { equippedDjinn: Djinn[], djinnStates: Map<string, DjinnState> }): Stats {
    // Base stats
    const base = { ...this.baseStats };

    // Level bonuses: growthRate * (level - 1)
    const levelBonuses: Stats = {
      hp: this.growthRates.hp * (this.level - 1),
      pp: 0,  // PP system removed - using mana circles instead
      atk: this.growthRates.atk * (this.level - 1),
      def: this.growthRates.def * (this.level - 1),
      mag: this.growthRates.mag * (this.level - 1),
      spd: this.growthRates.spd * (this.level - 1),
    };

    // Equipment bonuses
    const equipmentBonuses: Partial<Stats> = {};
    for (const item of Object.values(this.equipment)) {
      if (!item) continue;

      // CRITICAL: Handle malformed equipment with missing statBonus
      if (!item.statBonus || typeof item.statBonus !== 'object') continue;

      for (const [stat, value] of Object.entries(item.statBonus)) {
        if (value !== undefined && value !== null && typeof value === 'number') {
          const key = stat as keyof Stats;
          const currentValue = equipmentBonuses[key] as number | undefined;
          (equipmentBonuses as any)[key] = (currentValue || 0) + value;
        }
      }
    }

    // Djinn synergy bonuses (only count Set Djinn)
    // 🚨 REFACTORED: Now uses team.equippedDjinn if team provided
    // From GAME_MECHANICS.md Section 2.0: Team-wide Djinn system
    let djinnSynergy;
    if (team) {
      // Use team's Djinn (affects ALL units equally)
      const setDjinn = team.equippedDjinn.filter(d =>
        team.djinnStates.get(d.id) === 'Set'
      );
      djinnSynergy = calculateDjinnSynergy(setDjinn);
    } else {
      // Fallback to per-unit Djinn (backward compatibility)
      const setDjinn = this.djinn.filter(d =>
        this.djinnStates.get(d.id) !== 'Standby' && this.djinnStates.get(d.id) !== 'Recovery'
      );
      djinnSynergy = calculateDjinnSynergy(setDjinn);
    }

    // Status effect modifiers
    let atkMultiplier = 1.0;
    let defMultiplier = 1.0;
    let magMultiplier = 1.0;
    let spdMultiplier = 1.0;

    for (const effect of this.statusEffects) {
      if (effect.stat && effect.modifier) {
        switch (effect.stat) {
          case 'atk': atkMultiplier *= effect.modifier; break;
          case 'def': defMultiplier *= effect.modifier; break;
          case 'mag': magMultiplier *= effect.modifier; break;
          case 'spd': spdMultiplier *= effect.modifier; break;
        }
      }
    }

    // Clamp multipliers to prevent exploits (0.0× to 3.0×)
    atkMultiplier = Math.min(Math.max(atkMultiplier, 0.0), 3.0);
    defMultiplier = Math.min(Math.max(defMultiplier, 0.0), 3.0);
    magMultiplier = Math.min(Math.max(magMultiplier, 0.0), 3.0);
    spdMultiplier = Math.min(Math.max(spdMultiplier, 0.0), 3.0);

    // Calculate final stats
    const finalStats: Stats = {
      hp: base.hp + levelBonuses.hp + (equipmentBonuses.hp || 0),
      pp: 0,  // PP system removed - using mana circles instead
      atk: Math.floor(
        (base.atk + levelBonuses.atk + (equipmentBonuses.atk || 0) + djinnSynergy.atk) * atkMultiplier
      ),
      def: Math.floor(
        (base.def + levelBonuses.def + (equipmentBonuses.def || 0) + djinnSynergy.def) * defMultiplier
      ),
      mag: Math.floor(
        (base.mag + levelBonuses.mag + (equipmentBonuses.mag || 0)) * magMultiplier
      ),
      spd: Math.floor(
        (base.spd + levelBonuses.spd + (equipmentBonuses.spd || 0) + (djinnSynergy.spd || 0)) * spdMultiplier
      ),
    };

    return finalStats;
  }

  /**
   * Get maximum HP for current level
   */
  get maxHp(): number {
    return this.calculateStats().hp;
  }

  /**
   * Get current stats (includes all bonuses)
   */
  get stats(): Stats {
    return this.calculateStats();
  }

  /**
   * Get/Set current HP with validation (Bug #3, #4 fix)
   * Clamps between 0 and maxHp to prevent exploits
   */
  get currentHp(): number {
    return this._currentHp;
  }

  set currentHp(value: number) {
    // Clamp between 0 and maxHp
    this._currentHp = Math.max(0, Math.min(value, this.maxHp));
  }

  /**
   * Update unlocked abilities based on current level
   */
  private updateUnlockedAbilities(): void {
    this.unlockedAbilityIds.clear();
    for (const ability of this.abilities) {
      if (ability.unlockLevel <= this.level) {
        this.unlockedAbilityIds.add(ability.id);
      }
    }

    // Add abilities from legendary equipment
    for (const item of Object.values(this.equipment)) {
      if (item?.unlocksAbility) {
        this.unlockedAbilityIds.add(item.unlocksAbility);
      }
    }
  }

  /**
   * Get list of currently unlocked abilities
   */
  getUnlockedAbilities(): Ability[] {
    return this.abilities.filter(a => this.unlockedAbilityIds.has(a.id));
  }

  /**
   * Check if unit can use an ability
   * Note: Mana circle cost is checked at the team level, not per-unit
   */
  canUseAbility(abilityId: string): boolean {
    // Check if unit is knocked out
    if (this.isKO) {
      return false;
    }

    if (!this.unlockedAbilityIds.has(abilityId)) {
      return false;
    }

    const ability = this.abilities.find(a => a.id === abilityId);
    if (!ability) {
      return false;
    }

    // PP system removed - mana cost is checked at team level
    return true;
  }

  /**
   * Equip an item
   */
  equipItem(slot: keyof EquipmentLoadout, item: Equipment): void {
    // Validate slot matches item type
    if (item.slot !== slot) {
      throw new Error(`Cannot equip ${item.slot} in ${slot} slot`);
    }

    this.equipment[slot] = item;
    this.updateUnlockedAbilities();
  }

  /**
   * Unequip an item
   */
  unequipItem(slot: keyof EquipmentLoadout): Equipment | null {
    const item = this.equipment[slot];
    this.equipment[slot] = null;
    this.updateUnlockedAbilities();
    return item;
  }

  /**
   * @deprecated Use Team.equipDjinn() instead - Djinn are now team-wide, not per-unit
   * Kept for backward compatibility only
   */
  equipDjinn(djinnList: Djinn[]): Result<this, string> {
    if (djinnList.length > 3) {
      return Err('Cannot equip more than 3 Djinn per unit');
    }

    // CRITICAL: Check for duplicate Djinn
    const djinnIds = djinnList.map(d => d.id);
    const uniqueIds = new Set(djinnIds);
    if (djinnIds.length !== uniqueIds.size) {
      return Err('Cannot equip duplicate Djinn');
    }

    this.djinn = djinnList;
    for (const d of djinnList) {
      this.djinnStates.set(d.id, 'Set');
    }
    return Ok(this);
  }

  /**
   * @deprecated Use Team.activateDjinn() instead - Djinn activation is now team-wide
   * Kept for backward compatibility only
   */
  activateDjinn(djinnId: string): Result<this, string> {
    const djinn = this.djinn.find(d => d.id === djinnId);
    if (!djinn) {
      return Err(`Djinn ${djinnId} not equipped`);
    }

    // CRITICAL: Check if Djinn is already Standby or Recovery
    const currentState = this.djinnStates.get(djinnId);
    if (currentState === 'Standby') {
      return Err(`Djinn ${djinnId} is already in Standby state`);
    }
    if (currentState === 'Recovery') {
      return Err(`Djinn ${djinnId} is in Recovery state`);
    }

    this.djinnStates.set(djinnId, 'Standby');
    return Ok(this);
  }

  /**
   * Restore HP (Bug #6 fix)
   * Dead units cannot be healed - need revival first
   */
  heal(amount: number): number {
    // CRITICAL: Dead units can't be healed (need revival first)
    if (this.isKO) {
      return 0;
    }

    // Negative healing should not damage
    if (amount < 0) {
      console.warn(`heal() called with negative amount: ${amount}`);
      amount = 0;
    }

    const before = this.currentHp;
    this.currentHp = Math.min(this.maxHp, this.currentHp + amount);
    return this.currentHp - before;
  }

  /**
   * Take damage (and track it for Djinn activation)
   */
  takeDamage(amount: number): number {
    const actualDamage = Math.min(amount, this.currentHp);
    this.currentHp = Math.max(0, this.currentHp - amount);
    this.battleStats.damageTaken += actualDamage;
    return actualDamage;
  }

  /**
   * Record damage dealt (for Djinn activation threshold)
   */
  recordDamageDealt(amount: number): void {
    this.battleStats.damageDealt += amount;
  }

  /**
   * Get available abilities including equipment-granted abilities
   * From GAME_MECHANICS.md Section 7.2 (Equipment Special Effects)
   * Equipment like Sol Blade unlocks special abilities (e.g., Megiddo)
   */
  getAvailableAbilities(team?: { equippedDjinn: Djinn[], djinnStates: Map<string, DjinnState> }): Ability[] {
    const baseAbilities = [...this.abilities];
    const equipmentAbilities: Ability[] = [];

    // Check all equipment slots for ability unlocks
    for (const item of Object.values(this.equipment)) {
      if (item?.unlocksAbility) {
        const ability = ABILITIES[item.unlocksAbility];
        if (ability) {
          equipmentAbilities.push(ability);
        }
      }
    }

    // Djinn-granted abilities (only from Set Djinn)
    const djinnAbilities: Ability[] = [];
    if (team) {
      // Use team's Djinn (affects ALL units based on element compatibility)
      const setDjinn = team.equippedDjinn.filter(d =>
        team.djinnStates.get(d.id) === 'Set'
      );

      // Inline Djinn ability granting logic to avoid circular dependency
      const grantedAbilityIds: string[] = [];
      for (const djinn of setDjinn) {
        // Matching element grants matching ability
        if (this.element === djinn.element) {
          grantedAbilityIds.push(djinn.grantsAbilities.matching);
        }
        // Counter element grants counter ability
        else if (
          (this.element === 'Venus' && djinn.element === 'Mars') ||
          (this.element === 'Mars' && djinn.element === 'Venus') ||
          (this.element === 'Mercury' && djinn.element === 'Jupiter') ||
          (this.element === 'Jupiter' && djinn.element === 'Mercury')
        ) {
          grantedAbilityIds.push(djinn.grantsAbilities.counter);
        }
      }

      // Deduplicate and load abilities
      for (const abilityId of Array.from(new Set(grantedAbilityIds))) {
        const ability = ABILITIES[abilityId];
        if (ability) {
          djinnAbilities.push(ability);
        }
      }
    }

    return [...baseAbilities, ...equipmentAbilities, ...djinnAbilities];
  }

  /**
   * Check if unit can activate Djinn (30+ total damage threshold)
   */
  canActivateDjinn(): boolean {
    const totalDamage = this.battleStats.damageDealt + this.battleStats.damageTaken;
    return totalDamage >= 30;
  }

  /**
   * Reset battle stats (at start of new battle)
   */
  resetBattleStats(): void {
    this.battleStats.damageDealt = 0;
    this.battleStats.damageTaken = 0;
    this.actionsTaken = 0;
  }

  /**
   * Check if unit is knocked out
   */
  get isKO(): boolean {
    return this.currentHp <= 0;
  }

  /**
   * Clone this unit (for battle simulations)
   */
  clone(): Unit {
    const definition: UnitDefinition = {
      id: this.id,
      name: this.name,
      element: this.element,
      role: this.role,
      baseStats: this.baseStats,
      growthRates: this.growthRates,
      abilities: this.abilities,
      manaContribution: this.manaContribution,
      description: this.description,
    };

    const clone = new Unit(definition, this.level, this.xp);
    clone._currentHp = this._currentHp;
    clone.equipment = { ...this.equipment };
    clone.djinn = [...this.djinn];
    clone.djinnStates = new Map(this.djinnStates);
    clone.statusEffects = [...this.statusEffects];
    clone.actionsTaken = this.actionsTaken;
    clone.battleStats = {
      damageDealt: this.battleStats.damageDealt,
      damageTaken: this.battleStats.damageTaken,
    };

    return clone;
  }

  /**
   * Get XP needed to reach next level
   * Returns 0 if already at max level
   */
  xpToNextLevel(): number {
    if (this.level >= 5) {
      return 0;
    }
    return XP_CURVE[this.level + 1] - this.xp;
  }

  /**
   * Gain XP and level up if thresholds are met
   * From GAME_MECHANICS.md Section 1.1
   *
   * - Handles multiple level ups from single XP gain
   * - Caps at level 5
   * - Fully restores HP/PP on level up
   * - Updates unlocked abilities
   */
  gainXP(amount: number): void {
    if (amount <= 0) {
      return;
    }

    this.xp += amount;

    // Check for level ups (can be multiple!)
    while (this.level < 5 && this.xp >= XP_CURVE[this.level + 1]) {
      this.level++;
      this.updateUnlockedAbilities();

      // Fully restore HP to new max value on level up
      const newStats = this.calculateStats();
      this._currentHp = newStats.hp;
    }
  }
}
