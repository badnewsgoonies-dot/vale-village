import React, { useEffect, useState } from 'react';
import type { Ability } from '@/types/Ability';
import './AbilityAnimation.css';

interface AbilityAnimationProps {
  ability: Ability;
  onComplete: () => void;
}

// Map ability IDs to sprite files
const ABILITY_SPRITES: Record<string, string> = {
  // Venus abilities
  'quake': 'Grand_Gaia.gif',
  'earthquake': 'Grand_Gaia.gif',
  'ragnarok': 'Grand_Gaia.gif',
  'spire': 'Nettle.gif',
  'thorn': 'Nettle.gif',

  // Mars abilities
  'flare': 'Inferno.gif',
  'inferno': 'Inferno.gif',
  'blast': 'Fiery_Blast.gif',
  'flame': 'Fume.gif',
  'volcano': 'Pyroclasm.gif',
  'fire': 'Dragon_Fire.gif',
  'heat_wave': 'Heat_Wave.gif',

  // Mercury abilities
  'ply': 'Froth_Spiral.gif',
  'ply_well': 'Froth_Spiral.gif',
  'douse': 'Froth_Spiral.gif',
  'drench': 'Deluge.gif',
  'frost': 'Glacier.gif',
  'ice': 'Ice_Missile.gif',
  'glacier': 'Glacier.gif',
  'ice_horn': 'Freeze_Prism.gif',

  // Jupiter abilities
  'gale': 'Tempest.gif',
  'whirlwind': 'Tempest.gif',
  'bolt': 'Blue_Bolt.gif',
  'ray': 'Destruct_Ray.gif',
  'slash': 'Sonic_Slash.gif',
  'plasma': 'Spark_Plasma.gif',
};

export const AbilityAnimation: React.FC<AbilityAnimationProps> = ({
  ability,
  onComplete,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);

  // Try to find sprite by ability ID (lowercase, remove spaces)
  const abilityKey = ability.id.toLowerCase().replace(/[_\s]/g, '_');
  const spriteName = ABILITY_SPRITES[abilityKey] || ABILITY_SPRITES[ability.name.toLowerCase().replace(/\s/g, '_')];

  // Fallback to element-based sprite if no specific sprite found
  const fallbackSprite = ability.element
    ? {
        Venus: 'Grand_Gaia.gif',
        Mars: 'Inferno.gif',
        Mercury: 'Glacier.gif',
        Jupiter: 'Tempest.gif',
        Neutral: 'Grand_Gaia.gif',
      }[ability.element]
    : null;

  const spritePath = spriteName
    ? `/sprites/psynergy/${spriteName}`
    : fallbackSprite
    ? `/sprites/psynergy/${fallbackSprite}`
    : null;

  useEffect(() => {
    // Auto-complete after 1 second (abilities are quicker than summons)
    const timer = setTimeout(() => {
      setIsPlaying(false);
      onComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Skip animation if no sprite available
  if (!spritePath || !isPlaying) return null;

  return (
    <div className="ability-animation-overlay">
      <div className="ability-container">
        <h3 className="ability-name">{ability.name}</h3>
        <img
          src={spritePath}
          alt={ability.name}
          className="ability-sprite"
          onError={(e) => {
            console.warn(`Failed to load ability sprite: ${spritePath}`);
            e.currentTarget.style.display = 'none';
            // Still complete animation even if sprite fails to load
            setTimeout(onComplete, 500);
          }}
        />
      </div>
    </div>
  );
};
