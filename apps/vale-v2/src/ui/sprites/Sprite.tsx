/**
 * Sprite Component
 * Renders a sprite with animation support
 */

import { useEffect, useState, useRef } from 'react';
import { loadSprite } from './loader';
import { getSpriteDef } from './manifest';
import type { SpriteState } from './types';

interface SpriteProps {
  /** Sprite ID (e.g., 'unit:adept' or 'enemy:slime') */
  id: string;
  
  /** Current animation state */
  state?: SpriteState;
  
  /** Current frame (0-based) */
  frame?: number;
  
  /** Whether to auto-animate */
  animate?: boolean;
  
  /** Custom className */
  className?: string;
  
  /** Custom style */
  style?: React.CSSProperties;
  
  /** Event handlers */
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Sprite component with animation support
 */
export function Sprite({
  id,
  state = 'idle',
  frame: controlledFrame,
  animate = true,
  className,
  style,
  onLoad,
  onError,
}: SpriteProps) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [internalFrame, setInternalFrame] = useState(0);
  const frameRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  
  const def = getSpriteDef(id);
  const fps = def?.fps ?? 12;
  const totalFrames = typeof def?.frames === 'number' ? def.frames : 8;
  
  // Use controlled frame if provided, otherwise use internal frame
  const currentFrame = controlledFrame ?? internalFrame;
  
  // Load sprite on mount/id change
  useEffect(() => {
    let cancelled = false;
    
    loadSprite(id)
      .then((loadedImg) => {
        if (!cancelled) {
          setImg(loadedImg);
          onLoad?.();
        }
      })
      .catch(() => {
        if (!cancelled) {
          onError?.();
        }
      });
    
    return () => {
      cancelled = true;
    };
  }, [id, onLoad, onError]);
  
  // Animation loop (if animate is true and frame is not controlled)
  useEffect(() => {
    if (!animate || controlledFrame !== undefined) {
      return;
    }
    
    const interval = 1000 / fps;
    const startTime = performance.now();
    
    const animateFrame = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const newFrame = Math.floor((elapsed / interval) % totalFrames);
      
      if (newFrame !== frameRef.current) {
        frameRef.current = newFrame;
        setInternalFrame(newFrame);
      }
      
      animationRef.current = requestAnimationFrame(animateFrame);
    };
    
    animationRef.current = requestAnimationFrame(animateFrame);
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, controlledFrame, fps, totalFrames]);
  
  if (!img) {
    // Loading state - show placeholder
    return (
      <div
        className={className}
        style={{
          width: def?.frameWidth ?? 32,
          height: def?.frameHeight ?? 32,
          backgroundColor: '#555',
          display: 'inline-block',
          ...style,
        }}
        aria-label={`Loading sprite: ${id}`}
      />
    );
  }
  
  // Calculate sprite sheet position
  const frameWidth = def?.frameWidth ?? 32;
  const frameHeight = def?.frameHeight ?? 32;
  const cols = Math.floor(img.width / frameWidth);
  const row = Math.floor(currentFrame / cols);
  const col = currentFrame % cols;
  
  return (
    <div
      className={className}
      style={{
        width: frameWidth,
        height: frameHeight,
        display: 'inline-block',
        overflow: 'hidden',
        ...style,
      }}
      aria-label={`Sprite: ${id}, state: ${state}, frame: ${currentFrame}`}
    >
      <img
        src={img.src}
        alt={id}
        style={{
          width: img.width,
          height: img.height,
          objectFit: 'none',
          transform: `translate(-${col * frameWidth}px, -${row * frameHeight}px)`,
          imageRendering: 'pixelated', // For pixel art
        }}
        draggable={false}
      />
    </div>
  );
}

