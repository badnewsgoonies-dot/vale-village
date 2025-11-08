import React, { useEffect, useState, useRef } from 'react';
import './GameViewport.css';

export interface GameViewportProps {
  children: React.ReactNode;
  aspectRatio?: number; // width/height ratio (default 16/10 = 1.6, like Golden Sun)
  baseWidth?: number; // Base resolution width (default 800)
  baseHeight?: number; // Base resolution height (calculated from aspect ratio)
  integerScaling?: boolean; // Use integer scaling for pixel-perfect rendering
  minScale?: number; // Minimum scale factor (default 0.5)
  maxScale?: number; // Maximum scale factor (default 4.0)
}

export const GameViewport: React.FC<GameViewportProps> = ({
  children,
  aspectRatio = 1.6, // 16:10 like Golden Sun
  baseWidth = 800,
  baseHeight,
  integerScaling = false,
  minScale = 0.5,
  maxScale = 4.0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Calculate base height from aspect ratio if not provided
  const actualBaseHeight = baseHeight || baseWidth / aspectRatio;

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Calculate scale to fit window while maintaining aspect ratio
      const scaleX = windowWidth / baseWidth;
      const scaleY = windowHeight / actualBaseHeight;
      let newScale = Math.min(scaleX, scaleY);

      // Clamp to min/max scale
      newScale = Math.max(minScale, Math.min(maxScale, newScale));

      // Round to integer scale if pixel-perfect mode enabled
      if (integerScaling) {
        newScale = Math.floor(newScale);
        if (newScale < 1) newScale = 1; // Minimum 1x scale for pixel-perfect
      }

      setScale(newScale);

      // Calculate centered offset (for letterboxing/pillarboxing)
      const scaledWidth = baseWidth * newScale;
      const scaledHeight = actualBaseHeight * newScale;
      const offsetX = (windowWidth - scaledWidth) / 2;
      const offsetY = (windowHeight - scaledHeight) / 2;

      setOffset({ x: offsetX, y: offsetY });
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [baseWidth, actualBaseHeight, aspectRatio, integerScaling, minScale, maxScale]);

  return (
    <div className="game-viewport-container" ref={containerRef}>
      {/* Letterbox/Pillarbox background (black bars) */}
      <div className="viewport-letterbox" />

      {/* Scaled game content */}
      <div
        className="game-viewport-content"
        style={{
          width: `${baseWidth}px`,
          height: `${actualBaseHeight}px`,
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
};
