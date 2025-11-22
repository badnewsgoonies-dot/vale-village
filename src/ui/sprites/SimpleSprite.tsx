/**
 * SimpleSprite Component
 * 
 * A flexible, easy-to-use sprite component optimized for mockups and scene redesigns.
 * Automatically handles sprite lookup via catalog, GIF animation, and fallbacks.
 * 
 * @example
 * // Basic usage
 * <SimpleSprite id="isaac-lblade-front" width={64} height={64} />
 * 
 * @example
 * // With custom styling
 * <SimpleSprite 
 *   id="goblin" 
 *   width={48} 
 *   height={48}
 *   style={{ border: '1px solid #ccc' }}
 * />
 * 
 * @example
 * // Direct path (bypasses catalog)
 * <SimpleSprite 
 *   id="/sprites/battle/party/isaac/Isaac_lBlade_Front.gif"
 *   width={64}
 *   height={64}
 * />
 * 
 * @example
 * // Debug mode (shows sprite info on hover)
 * <SimpleSprite 
 *   id="isaac-battle-idle"
 *   width={64}
 *   height={64}
 *   debug={true}
 * />
 */

import { useState, useEffect } from 'react';
import { getSpriteById, getSpriteByPath, type SpriteEntry } from './catalog';

export interface SimpleSpriteProps {
  /**
   * Sprite identifier - can be:
   * - Flexible ID: "isaac-lblade-front" (searches catalog by keywords)
   * - Direct path: "/sprites/battle/party/isaac/Isaac_lBlade_Front.gif"
   * - Exact name: "Isaac lBlade Front" (case-insensitive)
   */
  id: string;
  
  /** Width in pixels */
  width: number;
  
  /** Height in pixels */
  height: number;
  
  /** Optional custom CSS styles */
  style?: React.CSSProperties;
  
  /** Optional CSS class name */
  className?: string;
  
  /** 
   * Debug mode - shows sprite info on hover and logs lookups
   * Useful for mockup/design work to see what sprite was found
   */
  debug?: boolean;
  
  /** 
   * Fallback component when sprite not found
   * Default: colored placeholder with sprite ID
   */
  fallback?: React.ReactNode;
  
  /** Alt text for accessibility */
  alt?: string;
  
  /** 
   * Image rendering mode
   * - "pixelated": Crisp pixel art (default for sprites)
   * - "auto": Browser default
   * - "smooth": Smooth scaling
   */
  imageRendering?: 'pixelated' | 'auto' | 'smooth';
  
  /** 
   * Object fit mode
   * - "contain": Fit within bounds, maintain aspect ratio
   * - "cover": Fill bounds, maintain aspect ratio
   * - "fill": Stretch to fill bounds
   */
  objectFit?: 'contain' | 'cover' | 'fill';
  
  /** Callback when sprite loads successfully */
  onLoad?: () => void;
  
  /** Callback when sprite fails to load */
  onError?: (error: string) => void;
}

/**
 * Generate a colored placeholder based on sprite ID
 * Useful for debugging and fallbacks
 */
function generatePlaceholder(id: string, width: number, height: number): React.ReactNode {
  // Generate a consistent color from the ID
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  const saturation = 40 + (Math.abs(hash) % 30); // 40-70%
  const lightness = 60 + (Math.abs(hash) % 20); // 60-80%
  
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Math.min(width, height) / 4,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '4px',
        border: '2px dashed rgba(0,0,0,0.3)',
        boxSizing: 'border-box',
      }}
      title={`Placeholder: ${id}`}
    >
      <div style={{ wordBreak: 'break-word', lineHeight: 1 }}>
        {id.length > 10 ? id.substring(0, 10) + '...' : id}
      </div>
    </div>
  );
}

/**
 * Find sprite entry using flexible lookup
 */
function findSprite(id: string): { entry: SpriteEntry | null; method: string } {
  // Method 1: Direct path (starts with /)
  if (id.startsWith('/')) {
    const entry = getSpriteByPath(id);
    return { entry, method: 'path' };
  }
  
  // Method 2: Catalog lookup (flexible ID matching)
  const entry = getSpriteById(id);
  if (entry) {
    return { entry, method: 'catalog' };
  }
  
  return { entry: null, method: 'none' };
}

export function SimpleSprite({
  id,
  width,
  height,
  style,
  className,
  debug = false,
  fallback,
  alt,
  imageRendering = 'pixelated',
  objectFit = 'contain',
  onLoad,
  onError,
}: SimpleSpriteProps) {
  const [spriteEntry, setSpriteEntry] = useState<{ entry: SpriteEntry | null; method: string } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  // Lookup sprite on mount/id change
  useEffect(() => {
    const result = findSprite(id);
    setSpriteEntry(result);
    setLoadError(null);
    setIsLoaded(false);
    
    if (debug && result.entry) {
      console.log(`[SimpleSprite] Found sprite:`, {
        id,
        method: result.method,
        name: result.entry.name,
        path: result.entry.path,
        category: result.entry.category,
      });
    } else if (debug && !result.entry) {
      console.warn(`[SimpleSprite] Sprite not found:`, {
        id,
        method: result.method,
        suggestion: id.includes('-') 
          ? `Try searching catalog for: ${id.split('-').join(' ')}`
          : `Try using direct path or check catalog`,
      });
    }
  }, [id, debug]);
  
  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    setLoadError(null);
    onLoad?.();
  };
  
  const handleError = () => {
    const error = spriteEntry?.entry 
      ? `Failed to load: ${spriteEntry.entry.path}`
      : `Sprite not found: ${id}`;
    setLoadError(error);
    setIsLoaded(false);
    onError?.(error);
    
    if (debug) {
      console.error(`[SimpleSprite] Load error:`, error);
    }
  };
  
  // Determine sprite path
  const spritePath = spriteEntry?.entry?.path || null;
  
  // Show fallback if no sprite found or error loading
  if (!spritePath || loadError) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div
        className={className}
        style={{
          width,
          height,
          ...style,
        }}
        onMouseEnter={() => debug && setShowDebugInfo(true)}
        onMouseLeave={() => debug && setShowDebugInfo(false)}
      >
        {generatePlaceholder(id, width, height)}
        {debug && showDebugInfo && (
          <div
            style={{
              position: 'absolute',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              color: '#fff',
              padding: '8px',
              borderRadius: '4px',
              fontSize: '12px',
              zIndex: 1000,
              marginTop: '4px',
              maxWidth: '300px',
            }}
          >
            <div><strong>Sprite ID:</strong> {id}</div>
            {spriteEntry && (
              <div><strong>Lookup Method:</strong> {spriteEntry.method}</div>
            )}
            {loadError && (
              <div style={{ color: '#ff6b6b' }}><strong>Error:</strong> {loadError}</div>
            )}
            {!spritePath && (
              <div style={{ color: '#ffd93d' }}>
                <strong>Tip:</strong> Sprite not found in catalog. Try:
                <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                  <li>Using direct path: <code>/sprites/...</code></li>
                  <li>Checking catalog: <code>searchSprites(&apos;{id.split(&apos;-&apos;)[0]}&apos;)</code></li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  
  // Render sprite
  return (
    <div
      className={className}
      style={{
        width,
        height,
        position: 'relative',
        display: 'inline-block',
        ...style,
      }}
      onMouseEnter={() => debug && setShowDebugInfo(true)}
      onMouseLeave={() => debug && setShowDebugInfo(false)}
    >
      <img
        src={spritePath}
        alt={alt || spriteEntry?.entry?.name || id}
        width={width}
        height={height}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          imageRendering: imageRendering as React.CSSProperties['imageRendering'],
          display: 'block',
        }}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* Debug info overlay */}
      {debug && showDebugInfo && spriteEntry && spriteEntry.entry && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: '#fff',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 1000,
            marginBottom: '4px',
            maxWidth: '300px',
            whiteSpace: 'nowrap',
          }}
        >
          <div><strong>Name:</strong> {spriteEntry.entry.name}</div>
          <div><strong>Path:</strong> {spriteEntry.entry.path}</div>
          <div><strong>Category:</strong> {spriteEntry.entry.category}</div>
          {spriteEntry.entry.subcategory && (
            <div><strong>Subcategory:</strong> {spriteEntry.entry.subcategory}</div>
          )}
          <div><strong>Lookup:</strong> {spriteEntry.method}</div>
          <div><strong>Status:</strong> {isLoaded ? '✅ Loaded' : '⏳ Loading...'}</div>
        </div>
      )}
    </div>
  );
}

