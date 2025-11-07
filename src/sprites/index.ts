/**
 * Vale Chronicles - Sprite Registry Module
 *
 * This module provides infrastructure for mapping game objects
 * (units, equipment, abilities, Djinn) to sprite file paths.
 */

// Main registry singleton
export { spriteRegistry } from './registry';

// Types
export type {
  WeaponType,
  AnimationState,
  UnitSpriteMapping,
  BattleSprite,
  EquipmentIcon as EquipmentIconType,
  AbilityIcon
} from './types';

// React components
export { BattleUnit } from './components/BattleUnit';
export { EquipmentIcon } from './components/EquipmentIcon';

// Utility functions
export { normalizeWeaponType, UNIT_SPRITE_MAPPING } from './mappings/unitToSprite';
export { getEquipmentIconCategory, getEquipmentIconFilename } from './mappings/equipmentPaths';
