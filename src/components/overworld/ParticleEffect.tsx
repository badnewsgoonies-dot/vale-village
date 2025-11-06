import React, { useEffect, useState } from 'react';
import './ParticleEffect.css';

export type ParticleType = 'psynergy' | 'sparkle' | 'water-ripple' | 'fire' | 'wind';

interface ParticleEffectProps {
  type: ParticleType;
  x: number;  // Grid position
  y: number;  // Grid position
  active?: boolean;  // Whether effect is currently active
}

const TILE_SIZE = 32;  // pixels

interface Particle {
  id: number;
  offsetX: number;
  offsetY: number;
  opacity: number;
  scale: number;
  hue: number;
}

/**
 * Renders animated particle effects for psynergy stones, water, etc.
 */
export const ParticleEffect: React.FC<ParticleEffectProps> = ({
  type,
  x,
  y,
  active = true,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setParticles(prev => {
        // Remove old particles
        const filtered = prev.filter(p => p.opacity > 0);

        // Add new particle
        if (filtered.length < 8) {
          const newParticle: Particle = {
            id: Date.now() + Math.random(),
            offsetX: (Math.random() - 0.5) * TILE_SIZE * 0.8,
            offsetY: (Math.random() - 0.5) * TILE_SIZE * 0.8,
            opacity: 1,
            scale: 0.3 + Math.random() * 0.5,
            hue: type === 'psynergy' ? 180 + Math.random() * 60 : Math.random() * 360,
          };
          return [...filtered, newParticle];
        }

        // Update existing particles
        return filtered.map(p => ({
          ...p,
          offsetY: p.offsetY - 0.5,  // Float upward
          opacity: p.opacity - 0.02,  // Fade out
          scale: p.scale * 1.01,  // Grow slightly
        }));
      });
    }, 50);

    return () => clearInterval(interval);
  }, [active, type]);

  if (!active) return null;

  return (
    <div
      className="particle-effect-container"
      style={{
        left: `${x * TILE_SIZE}px`,
        top: `${y * TILE_SIZE}px`,
        width: `${TILE_SIZE}px`,
        height: `${TILE_SIZE}px`,
      }}
    >
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`particle particle-${type}`}
          style={{
            left: `${TILE_SIZE / 2 + particle.offsetX}px`,
            top: `${TILE_SIZE / 2 + particle.offsetY}px`,
            opacity: particle.opacity,
            transform: `scale(${particle.scale})`,
            filter: `hue-rotate(${particle.hue}deg)`,
          }}
        />
      ))}
    </div>
  );
};
