/**
 * BackgroundSprite Component
 * 
 * Specialized component for rendering battle/overworld backgrounds.
 * Supports random selection, category filtering, and full-screen backgrounds.
 * 
 * @example
 * // Random background from category
 * <BackgroundSprite id="random" category="backgrounds-gs1" />
 * 
 * @example
 * // Specific background
 * <BackgroundSprite id="vale-forest" />
 * 
 * @example
 * // Full-screen background
 * <BackgroundSprite 
 *   id="random" 
 *   category="backgrounds-gs1"
 *   style={{ position: 'absolute', width: '100%', height: '100%' }}
 * />
 */

import { useState, useEffect, useMemo } from 'react';
import { 
  getSpritesByCategory, 
  getRandomSprite, 
  getSpriteById,
  getSpriteByPath,
  type SpriteEntry 
} from './catalog';

export interface BackgroundSpriteProps {
  /**
   * Background identifier:
   * - "random": Select random background from category
   * - Flexible ID: "vale-forest" (searches catalog)
   * - Direct path: "/sprites/backgrounds/gs1/Vale.gif"
   */
  id: string;
  
  /**
   * Category to filter backgrounds (required if id="random")
   * Examples: "backgrounds-gs1", "backgrounds-gs2"
   */
  category?: string;
  
  /** Optional custom CSS styles */
  style?: React.CSSProperties;
  
  /** Optional CSS class name */
  className?: string;
  
  /** 
   * Background size mode
   * - "cover": Fill container, maintain aspect ratio (default)
   * - "contain": Fit within container, maintain aspect ratio
   * - "fill": Stretch to fill container
   */
  sizeMode?: 'cover' | 'contain' | 'fill';
  
  /** 
   * Background position
   * Default: "center center"
   */
  position?: string;
  
  /** 
   * Background repeat
   * Default: "no-repeat"
   */
  repeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  
  /** Debug mode - shows background info */
  debug?: boolean;
  
  /** Callback when background loads */
  onLoad?: () => void;
  
  /** Callback when background fails to load */
  onError?: (error: string) => void;
}

/**
 * Find background sprite entry
 */
function findBackgroundSprite(
  id: string, 
  category?: string
): { entry: SpriteEntry | null; method: string } {
  // Random selection
  if (id.toLowerCase() === 'random') {
    if (!category) {
      console.warn('[BackgroundSprite] Random selection requires category prop');
      return { entry: null, method: 'none' };
    }
    
    const sprites = getSpritesByCategory(category);
    if (sprites.length === 0) {
      console.warn(`[BackgroundSprite] No sprites found in category: ${category}`);
      return { entry: null, method: 'none' };
    }
    
    const randomSprite = getRandomSprite(category);
    return { entry: randomSprite, method: 'random' };
  }
  
  // Direct path
  if (id.startsWith('/')) {
    const entry = getSpriteByPath(id);
    return { entry, method: 'path' };
  }
  
  // Catalog lookup
  const entry = getSpriteById(id);
  if (entry) {
    return { entry, method: 'catalog' };
  }
  
  return { entry: null, method: 'none' };
}

export function BackgroundSprite({
  id,
  category,
  style,
  className,
  sizeMode = 'cover',
  position = 'center center',
  repeat = 'no-repeat',
  debug = false,
  onLoad,
  onError,
}: BackgroundSpriteProps) {
  const [spriteEntry, setSpriteEntry] = useState<{ entry: SpriteEntry | null; method: string } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  // Lookup sprite (memoized for random to prevent re-rolling on every render)
  const lookupResult = useMemo(() => {
    return findBackgroundSprite(id, category);
  }, [id, category]);
  
  useEffect(() => {
    setSpriteEntry(lookupResult);
    setLoadError(null);
    setIsLoaded(false);
    
    if (debug && lookupResult.entry) {
      console.log(`[BackgroundSprite] Found background:`, {
        id,
        method: lookupResult.method,
        name: lookupResult.entry.name,
        path: lookupResult.entry.path,
        category: lookupResult.entry.category,
      });
    } else if (debug && !lookupResult.entry) {
      console.warn(`[BackgroundSprite] Background not found:`, {
        id,
        category,
        method: lookupResult.method,
      });
    }
  }, [lookupResult, debug, id, category]);
  
  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    setLoadError(null);
    onLoad?.();
  };
  
  const handleError = () => {
    const error = spriteEntry?.entry 
      ? `Failed to load: ${spriteEntry.entry.path}`
      : `Background not found: ${id}`;
    setLoadError(error);
    setIsLoaded(false);
    onError?.(error);
    
    if (debug) {
      console.error(`[BackgroundSprite] Load error:`, error);
    }
  };
  
  // Determine background path
  const backgroundPath = spriteEntry?.entry?.path || null;
  
  // Fallback if no background found
  if (!backgroundPath || loadError) {
    return (
      <div
        className={className}
        style={{
          backgroundColor: '#1a1a2e',
          backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          ...style,
        }}
        onMouseEnter={() => debug && setShowDebugInfo(true)}
        onMouseLeave={() => debug && setShowDebugInfo(false)}
        title={loadError || `Background not found: ${id}`}
      >
        {debug && showDebugInfo && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              color: '#fff',
              padding: '8px',
              borderRadius: '4px',
              fontSize: '12px',
              zIndex: 1000,
            }}
          >
            <div><strong>Background ID:</strong> {id}</div>
            {category && <div><strong>Category:</strong> {category}</div>}
            {spriteEntry && <div><strong>Lookup Method:</strong> {spriteEntry.method}</div>}
            {loadError && (
              <div style={{ color: '#ff6b6b' }}><strong>Error:</strong> {loadError}</div>
            )}
          </div>
        )}
      </div>
    );
  }
  
  // Render background
  return (
    <div
      className={className}
      style={{
        backgroundImage: `url(${backgroundPath})`,
        backgroundSize: sizeMode,
        backgroundPosition: position,
        backgroundRepeat: repeat,
        width: '100%',
        height: '100%',
        ...style,
      }}
      onMouseEnter={() => debug && setShowDebugInfo(true)}
      onMouseLeave={() => debug && setShowDebugInfo(false)}
    >
      {/* Preload image to detect load/error */}
      <img
        src={backgroundPath}
        alt={spriteEntry?.entry?.name || id}
        style={{ display: 'none' }}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* Debug info overlay */}
      {debug && showDebugInfo && spriteEntry && spriteEntry.entry && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: '#fff',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 1000,
            maxWidth: '300px',
          }}
        >
          <div><strong>Name:</strong> {spriteEntry.entry.name}</div>
          <div><strong>Path:</strong> {spriteEntry.entry.path}</div>
          <div><strong>Category:</strong> {spriteEntry.entry.category}</div>
          <div><strong>Lookup:</strong> {spriteEntry.method}</div>
          <div><strong>Status:</strong> {isLoaded ? '✅ Loaded' : '⏳ Loading...'}</div>
        </div>
      )}
    </div>
  );
}

