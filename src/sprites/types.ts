export type WeaponType = 'Axe' | 'lBlade' | 'lSword' | 'Mace' | 'Staff' | 'Ankh';

export type AnimationState =
  | 'Front' | 'Back'
  | 'Attack1' | 'Attack2'
  | 'CastFront1' | 'CastFront2' | 'CastBack1' | 'CastBack2'
  | 'HitFront' | 'HitBack'
  | 'DownedFront' | 'DownedBack';

export interface UnitSpriteMapping {
  folder: string;
  weapons: WeaponType[];
  animations: number;
  fallback?: string; // For Jenna GS1 → GS2 fallback
}

export interface BattleSprite {
  character: string;
  weapon: WeaponType;
  animation: AnimationState;
  path: string;
}

export interface EquipmentIcon {
  name: string;
  category: string;
  path: string;
}

export interface AbilityIcon {
  name: string;
  path: string;
}
