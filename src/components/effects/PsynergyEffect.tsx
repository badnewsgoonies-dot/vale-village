import React, { useEffect, useState } from 'react';
import './PsynergyEffect.css';

interface PsynergyEffectProps {
  abilityName: string;
  element: 'Venus' | 'Mars' | 'Mercury' | 'Jupiter';
  position: { x: number; y: number };
  onComplete?: () => void;
}

export const PsynergyEffect: React.FC<PsynergyEffectProps> = ({
  abilityName,
  element,
  position,
  onComplete
}) => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActive(false);
      onComplete?.();
    }, 1200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!active) return null;

  // Get effect type based on ability name
  const getEffectType = () => {
    if (abilityName.toLowerCase().includes('ragnarok')) return 'sword-rain';
    if (abilityName.toLowerCase().includes('cure')) return 'heal-sparkle';
    if (abilityName.toLowerCase().includes('fireball') || abilityName.toLowerCase().includes('blast')) return 'fireball';
    if (abilityName.toLowerCase().includes('spire') || abilityName.toLowerCase().includes('quake')) return 'earth-spike';
    if (abilityName.toLowerCase().includes('bolt') || abilityName.toLowerCase().includes('thunder')) return 'lightning';
    if (abilityName.toLowerCase().includes('ice')) return 'ice-shard';
    return 'generic-burst';
  };

  const effectType = getEffectType();

  return (
    <div 
      className={`psynergy-effect psynergy-${effectType} element-${element.toLowerCase()}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      {effectType === 'sword-rain' && (
        <>
          <div className="sword sword-1">⚔️</div>
          <div className="sword sword-2">⚔️</div>
          <div className="sword sword-3">⚔️</div>
          <div className="sword sword-4">⚔️</div>
          <div className="sword sword-5">⚔️</div>
        </>
      )}
      {effectType === 'heal-sparkle' && (
        <>
          <div className="sparkle sparkle-1">✨</div>
          <div className="sparkle sparkle-2">✨</div>
          <div className="sparkle sparkle-3">✨</div>
          <div className="sparkle sparkle-4">✨</div>
          <div className="sparkle sparkle-5">✨</div>
          <div className="sparkle sparkle-6">✨</div>
        </>
      )}
      {effectType === 'fireball' && (
        <div className="fireball">🔥</div>
      )}
      {effectType === 'earth-spike' && (
        <>
          <div className="spike spike-1">▲</div>
          <div className="spike spike-2">▲</div>
          <div className="spike spike-3">▲</div>
        </>
      )}
      {effectType === 'lightning' && (
        <div className="lightning">⚡</div>
      )}
      {effectType === 'ice-shard' && (
        <>
          <div className="shard shard-1">❄️</div>
          <div className="shard shard-2">❄️</div>
          <div className="shard shard-3">❄️</div>
        </>
      )}
      {effectType === 'generic-burst' && (
        <div className="burst">💥</div>
      )}
    </div>
  );
};
