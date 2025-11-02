import type { Element } from './Element';
import type { Stats, GrowthRates } from './Stats';
import type { Ability } from './Ability';
import type { Equipment, EquipmentLoadout } from './Equipment';
import type { Djinn, DjinnState } from './Djinn';
import { emptyLoadout } from './Equipment';
import { calculateDjinnSynergy } from './Djinn';
import { Ok, Err, type Result } from '@/utils/Result';

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

  // Progression
  level: number;
  xp: number;

  // Current state
  currentHp: number;
  currentPp: number;

  // Equipment and abilities
  equipment: EquipmentLoadout;
  djinn: Djinn[];
  djinnStates: Map<string, DjinnState>;
  abilities: Ability[];
  unlockedAbilityIds: Set<string>;

  // Battle state
  statusEffects: StatusEffect[];
  actionsTaken: number;

  constructor(definition: UnitDefinition, level: number = 1) {
    this.id = definition.id;
    this.name = definition.name;
    this.element = definition.element;
    this.role = definition.role;
    this.baseStats = definition.baseStats;
    this.growthRates = definition.growthRates;
    this.description = definition.description;

    this.level = Math.max(1, Math.min(5, level)); // Clamp to 1-5
    this.xp = 0;

    // Initialize equipment and djinn BEFORE calculating stats
    this.equipment = emptyLoadout();
    this.djinn = [];
    this.djinnStates = new Map();
    this.abilities = definition.abilities;
    this.unlockedAbilityIds = new Set();
    this.statusEffects = [];
    this.actionsTaken = 0;

    // Unlock abilities based on level
    this.updateUnlockedAbilities();

    // Calculate max HP/PP and set current to max
    const stats = this.calculateStats();
    this.currentHp = stats.hp;
    this.currentPp = stats.pp;
  }

  /**
   * Calculate final stats: base + level bonuses + equipment + Djinn synergy + buffs
   * Formula from GAME_MECHANICS.md Section 1.2 and 3.2
   */
  calculateStats(): Stats {
    // Base stats
    const base = { ...this.baseStats };

    // Level bonuses: growthRate * (level - 1)
    const levelBonuses: Stats = {
      hp: this.growthRates.hp * (this.level - 1),
      pp: this.growthRates.pp * (this.level - 1),
      atk: this.growthRates.atk * (this.level - 1),
      def: this.growthRates.def * (this.level - 1),
      mag: this.growthRates.mag * (this.level - 1),
      spd: this.growthRates.spd * (this.level - 1),
    };

    // Equipment bonuses
    const equipmentBonuses: Partial<Stats> = {};
    for (const item of Object.values(this.equipment)) {
      if (!item) continue;
      for (const [stat, value] of Object.entries(item.statBonus)) {
        if (value !== undefined && value !== null && typeof value === 'number') {
          const key = stat as keyof Stats;
          const currentValue = equipmentBonuses[key] as number | undefined;
          (equipmentBonuses as any)[key] = (currentValue || 0) + value;
        }
      }
    }

    // Djinn synergy bonuses (only count Set Djinn)
    // TODO: After Team Djinn refactor, this will read from team.equippedDjinn instead
    const setDjinn = this.djinn.filter(d =>
      this.djinnStates.get(d.id) !== 'Standby' && this.djinnStates.get(d.id) !== 'Recovery'
    );
    const djinnSynergy = calculateDjinnSynergy(setDjinn);

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

    // Calculate final stats
    const finalStats: Stats = {
      hp: base.hp + levelBonuses.hp + (equipmentBonuses.hp || 0),
      pp: base.pp + levelBonuses.pp + (equipmentBonuses.pp || 0),
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
   * Get maximum PP for current level
   */
  get maxPp(): number {
    return this.calculateStats().pp;
  }

  /**
   * Get current stats (includes all bonuses)
   */
  get stats(): Stats {
    return this.calculateStats();
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
   */
  canUseAbility(abilityId: string): boolean {
    if (!this.unlockedAbilityIds.has(abilityId)) {
      return false;
    }

    const ability = this.abilities.find(a => a.id === abilityId);
    if (!ability) {
      return false;
    }

    // Check PP cost
    if (ability.ppCost > this.currentPp) {
      return false;
    }

    return true;
  }

  /**
   * Equip an item
   */
  equipItem(slot: keyof EquipmentLoadout, item: Equipment): void {
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
   * Equip Djinn
   *
   * TODO (after Architect completes GAME_MECHANICS.md):
   * - Refactor Djinn from unit.djinn to team.equippedDjinn
   * - Djinn bonuses apply to ALL units in party
   * - Will need Team type and GameState changes
   * - Djinn are TEAM SLOTS, not per-unit!
   */
  equipDjinn(djinnList: Djinn[]): Result<this, string> {
    if (djinnList.length > 3) {
      return Err('Cannot equip more than 3 Djinn per unit');
    }
    this.djinn = djinnList;
    for (const d of djinnList) {
      this.djinnStates.set(d.id, 'Set');
    }
    return Ok(this);
  }

  /**
   * Activate Djinn (unleash in battle)
   */
  activateDjinn(djinnId: string): Result<this, string> {
    const djinn = this.djinn.find(d => d.id === djinnId);
    if (!djinn) {
      return Err(`Djinn ${djinnId} not equipped`);
    }
    this.djinnStates.set(djinnId, 'Standby');
    return Ok(this);
  }

  /**
   * Restore HP
   */
  heal(amount: number): number {
    const before = this.currentHp;
    this.currentHp = Math.min(this.maxHp, this.currentHp + amount);
    return this.currentHp - before;
  }

  /**
   * Take damage
   */
  takeDamage(amount: number): number {
    const before = this.currentHp;
    this.currentHp = Math.max(0, this.currentHp - amount);
    return before - this.currentHp;
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
      description: this.description,
    };

    const clone = new Unit(definition, this.level);
    clone.xp = this.xp;
    clone.currentHp = this.currentHp;
    clone.currentPp = this.currentPp;
    clone.equipment = { ...this.equipment };
    clone.djinn = [...this.djinn];
    clone.djinnStates = new Map(this.djinnStates);
    clone.statusEffects = [...this.statusEffects];

    return clone;
  }
}
