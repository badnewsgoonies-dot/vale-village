/**
 * Sprite Manifest
 * Registry of all sprite definitions
 * Placeholder entries for VS-0 entities
 */

import type { SpriteDef } from './types';

/**
 * Sprite manifest
 * Maps sprite IDs to definitions
 */
export const SPRITES: Record<string, SpriteDef> = {
  // Player Units (6 GP units)
  'unit:adept': {
    src: '/sprites/placeholders/adept.png',
    frames: 8,
    fps: 12,
    frameWidth: 32,
    frameHeight: 32,
  },
  'unit:war-mage': {
    src: '/sprites/placeholders/war_mage.png',
    frames: 8,
    fps: 12,
    frameWidth: 32,
    frameHeight: 32,
  },
  'unit:mystic': {
    src: '/sprites/placeholders/mystic.png',
    frames: 8,
    fps: 12,
    frameWidth: 32,
    frameHeight: 32,
  },
  'unit:ranger': {
    src: '/sprites/placeholders/ranger.png',
    frames: 8,
    fps: 12,
    frameWidth: 32,
    frameHeight: 32,
  },
  'unit:sentinel': {
    src: '/sprites/placeholders/sentinel.png',
    frames: 8,
    fps: 12,
    frameWidth: 32,
    frameHeight: 32,
  },
  'unit:stormcaller': {
    src: '/sprites/placeholders/stormcaller.png',
    frames: 8,
    fps: 12,
    frameWidth: 32,
    frameHeight: 32,
  },

  // Enemies (8 GP enemies)
  'enemy:slime': {
    src: '/sprites/placeholders/slime.png',
    frames: 6,
    fps: 10,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:wolf': {
    src: '/sprites/placeholders/wolf.png',
    frames: 6,
    fps: 10,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:bandit': {
    src: '/sprites/placeholders/bandit.png',
    frames: 6,
    fps: 10,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:sprite': {
    src: '/sprites/placeholders/sprite.png',
    frames: 6,
    fps: 10,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:beetle': {
    src: '/sprites/placeholders/beetle.png',
    frames: 6,
    fps: 10,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:gladiator': {
    src: '/sprites/placeholders/gladiator.png',
    frames: 8,
    fps: 12,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:elemental_guardian': {
    src: '/sprites/placeholders/elemental_guardian.png',
    frames: 8,
    fps: 12,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:guardian_shard_fire': {
    src: '/sprites/placeholders/guardian_shard_fire.png',
    frames: 4,
    fps: 8,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:guardian_shard_water': {
    src: '/sprites/placeholders/guardian_shard_water.png',
    frames: 4,
    fps: 8,
    frameWidth: 32,
    frameHeight: 32,
  },
};

/**
 * Get sprite definition by ID
 */
export function getSpriteDef(id: string): SpriteDef | null {
  return SPRITES[id] ?? null;
}

/**
 * Check if sprite exists in manifest
 */
export function hasSprite(id: string): boolean {
  return id in SPRITES;
}

