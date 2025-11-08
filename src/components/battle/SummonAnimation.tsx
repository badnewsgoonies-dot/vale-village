import React, { useEffect, useState } from 'react';
import type { Element } from '@/types/Element';
import './SummonAnimation.css';

interface SummonAnimationProps {
  djinnCount: number;
  element: Element;
  onComplete: () => void;
}

// Map summon types to sprite files
const SUMMON_SPRITES = {
  // 3 Djinn (Mega Summons)
  Venus_3: 'Judgment.gif',
  Mars_3: 'Meteor.gif',
  Mercury_3: 'Neptune.gif',
  Jupiter_3: 'Thor.gif',

  // 2 Djinn (Medium Summons)
  Venus_2: 'Ramses.gif',
  Mars_2: 'Tiamat.gif',
  Mercury_2: 'Nereid.gif',
  Jupiter_2: 'Procne.gif',

  // 1 Djinn (Individual attacks - use psynergy effects)
  Venus_1: 'Grand_Gaia.gif',
  Mars_1: 'Inferno.gif',
  Mercury_1: 'Glacier.gif',
  Jupiter_1: 'Tempest.gif',
};

const SUMMON_NAMES = {
  Venus_3: 'Judgment',
  Mars_3: 'Meteor',
  Mercury_3: 'Neptune',
  Jupiter_3: 'Thor',
  Venus_2: 'Ramses',
  Mars_2: 'Tiamat',
  Mercury_2: 'Nereid',
  Jupiter_2: 'Procne',
  Venus_1: 'Earth Attack',
  Mars_1: 'Fire Attack',
  Mercury_1: 'Ice Attack',
  Jupiter_1: 'Wind Attack',
};

export const SummonAnimation: React.FC<SummonAnimationProps> = ({
  djinnCount,
  element,
  onComplete,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);

  const summonKey = `${element}_${djinnCount}` as keyof typeof SUMMON_SPRITES;
  const spritePath = djinnCount === 1
    ? `/sprites/psynergy/${SUMMON_SPRITES[summonKey]}`
    : `/sprites/battle/summons/${SUMMON_SPRITES[summonKey]}`;
  const summonName = SUMMON_NAMES[summonKey];

  useEffect(() => {
    // Auto-complete after animation duration
    const duration = djinnCount === 3 ? 3000 : djinnCount === 2 ? 2500 : 2000;
    const timer = setTimeout(() => {
      setIsPlaying(false);
      onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [djinnCount, onComplete]);

  if (!isPlaying) return null;

  return (
    <div className="summon-animation-overlay">
      <div className="summon-container">
        <h2 className="summon-name">{summonName}</h2>
        <img
          src={spritePath}
          alt={summonName}
          className="summon-sprite"
          onError={(e) => {
            console.error(`Failed to load summon sprite: ${spritePath}`);
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      <div className="summon-skip-hint">
        <span>Press SPACE to skip</span>
      </div>
    </div>
  );
};
