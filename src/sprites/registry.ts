import { UNIT_SPRITE_MAPPING, normalizeWeaponType } from './mappings/unitToSprite';
import { getEquipmentIconCategory, getEquipmentIconFilename } from './mappings/equipmentPaths';
import type { Unit } from '../types/Unit';
import type { Equipment } from '../types/Equipment';
import type { Djinn } from '../types/Djinn';
import type { AnimationState } from './types';

class SpriteRegistry {
  private baseUrl = '/sprites';

  /**
   * Get battle sprite path for a unit
   *
   * @param unit - The Unit instance
   * @param animation - Animation state (Front, Attack1, CastFront1, etc.)
   * @returns Full path to sprite file
   *
   * @example
   * const isaac = createUnit(UNIT_DEFINITIONS.isaac);
   * const path = spriteRegistry.getBattleSprite(isaac, 'Front');
   * // Returns: "/sprites/battle/party/isaac/Isaac_lSword_Front.gif"
   */
  getBattleSprite(unit: Unit, animation: AnimationState): string {
    const unitId = unit.id.toLowerCase();
    const mapping = UNIT_SPRITE_MAPPING[unitId];

    // Check if this is an enemy (no mapping = enemy)
    if (!mapping) {
      // Enemy sprites are simple: just the enemy name as a single GIF
      // Convert ID format: "wild-wolf" or "goblin" → "Wild_Wolf.gif" or "Goblin.gif"
      const enemyName = unit.name.replace(/ /g, '_');
      const path = `${this.baseUrl}/battle/enemies/${enemyName}.gif`;
      return path;
    }

    // Party member sprite logic
    // Determine weapon type from equipped weapon
    let weapon = normalizeWeaponType(unit.equipment.weapon);

    // Check if weapon is available for this unit
    if (!mapping.weapons.includes(weapon)) {
      console.warn(`Unit ${unitId} doesn't have ${weapon} sprites, using ${mapping.weapons[0]}`);
      weapon = mapping.weapons[0];
    }

    // Handle Jenna fallback for missing front-cast animations
    let folder = mapping.folder;
    if (unitId === 'jenna' && animation.startsWith('CastFront')) {
      folder = mapping.fallback || 'jenna';
    }

    // Build filename: Isaac_Axe_Front.gif
    const characterName = this.capitalize(folder === 'jenna_gs2' ? 'Jenna' : unitId);
    const filename = `${characterName}_${weapon}_${animation}.gif`;
    const path = `${this.baseUrl}/battle/party/${folder}/${filename}`;

    return path;
  }

  /**
   * Get equipment icon path
   *
   * @param equipment - The Equipment instance
   * @returns Full path to equipment icon
   *
   * @example
   * const gaiaBlade = { name: 'Gaia Blade', slot: 'weapon' };
   * const path = spriteRegistry.getEquipmentIcon(gaiaBlade);
   * // Returns: "/sprites/icons/items/long-swords/Gaia_Blade.gif"
   */
  getEquipmentIcon(equipment: Equipment): string {
    const category = getEquipmentIconCategory(equipment);
    const filename = getEquipmentIconFilename(equipment);

    return `${this.baseUrl}/icons/items/${category}/${filename}`;
  }

  /**
   * Get ability/Psynergy icon path
   *
   * @param abilityName - Name of the ability (e.g., "Ragnarok", "Cure")
   * @returns Full path to ability icon
   *
   * @example
   * const path = spriteRegistry.getAbilityIcon('Ragnarok');
   * // Returns: "/sprites/icons/psynergy/Ragnarok.gif"
   */
  getAbilityIcon(abilityName: string): string {
    const filename = abilityName.replace(/ /g, '_') + '.gif';
    return `${this.baseUrl}/icons/psynergy/${filename}`;
  }

  /**
   * Get Djinn icon path (uses element-based fallback)
   *
   * @param djinn - The Djinn instance
   * @returns Full path to Djinn sprite
   *
   * @example
   * const flint = { name: 'Flint', element: 'Venus' };
   * const path = spriteRegistry.getDjinnIcon(flint);
   * // Returns: "/sprites/battle/djinn/Venus_Djinn_Front.gif"
   */
  getDjinnIcon(djinn: Djinn): string {
    // Individual Djinn sprites don't exist, use element-based fallback
    const element = djinn.element;
    return `${this.baseUrl}/battle/djinn/${element}_Djinn_Front.gif`;
  }

  /**
   * Get Summon sprite path
   *
   * @param summonName - Name of the summon (e.g., "Titan", "Phoenix")
   * @param _element - Element of the summon (reserved for future use, fallback handled in component)
   * @returns Full path to summon sprite
   *
   * @example
   * const path = spriteRegistry.getSummonSprite('Titan', 'Venus');
   * // Returns: "/sprites/battle/summons/Titan.gif"
   * // Falls back to: "/sprites/battle/djinn/Venus_Djinn_Front.gif"
   */
  getSummonSprite(summonName: string, _element: string): string {
    // Try summon-specific sprite first
    const summonPath = `${this.baseUrl}/battle/summons/${summonName}.gif`;
    return summonPath;
    // Note: Fallback to element Djinn is handled in component via onError
  }

  /**
   * Preload sprites for a team (useful before battle)
   *
   * @param units - Array of units to preload
   * @returns Promise that resolves when all sprites are loaded
   */
  async preloadTeamSprites(units: Unit[]): Promise<void> {
    const promises: Promise<void>[] = [];

    for (const unit of units) {
      // Preload key animations
      const animations: AnimationState[] = ['Front', 'Back', 'Attack1', 'CastFront1', 'DownedFront'];

      for (const animation of animations) {
        const path = this.getBattleSprite(unit, animation);
        promises.push(this.preloadImage(path));
      }
    }

    await Promise.all(promises);
  }

  /**
   * Preload a single image
   */
  private preloadImage(src: string): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => {
        console.warn(`Failed to load sprite: ${src}`);
        resolve(); // Don't reject, just warn
      };
      img.src = src;
    });
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Singleton instance
export const spriteRegistry = new SpriteRegistry();
