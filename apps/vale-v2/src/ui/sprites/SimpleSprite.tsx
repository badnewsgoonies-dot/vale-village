/**
 * Simple Sprite Image Component
 * Renders GIF sprites directly from catalog
 */

import { getSpriteByPath, getSpriteById, type SpriteEntry } from './catalog';

interface SimpleSpriteProps {
  /** Sprite ID or path */
  id: string;
  
  /** Custom className */
  className?: string;
  
  /** Custom style */
  style?: React.CSSProperties;
  
  /** Alt text */
  alt?: string;
  
  /** Width override */
  width?: number | string;
  
  /** Height override */
  height?: number | string;
}

/**
 * Simple sprite component - renders GIF directly
 * GIFs have built-in animation, so no frame control needed
 */
export function SimpleSprite({
  id,
  className,
  style,
  alt,
  width,
  height,
}: SimpleSpriteProps) {
  // Try to find sprite in catalog
  const sprite: SpriteEntry | null = id.startsWith('/') 
    ? getSpriteByPath(id)
    : getSpriteById(id);
  
  if (!sprite) {
    // Sprite not found - show placeholder
    return (
      <div
        className={className}
        style={{
          width: width ?? 64,
          height: height ?? 64,
          backgroundColor: '#333',
          border: '2px dashed #666',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          color: '#999',
          ...style,
        }}
        title={`Sprite not found: ${id}`}
      >
        {id.split('/').pop()?.slice(0, 10) ?? '?'}
      </div>
    );
  }
  
  // Render the GIF sprite
  return (
    <img
      src={sprite.path}
      alt={alt ?? sprite.name}
      className={className}
      style={{
        imageRendering: 'pixelated', // Crisp pixel art
        width: width,
        height: height,
        ...style,
      }}
      title={sprite.name}
      draggable={false}
    />
  );
}
