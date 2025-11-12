/**
 * Background Sprite Component
 * Renders battle/scene backgrounds
 */

import { getSpritesByCategory } from './catalog';

interface BackgroundSpriteProps {
  /** Background ID or 'random' */
  id?: string;
  
  /** Category to pick from if random */
  category?: 'backgrounds-gs1' | 'backgrounds-gs2';
  
  /** Custom className */
  className?: string;
  
  /** Custom style */
  style?: React.CSSProperties;
}

/**
 * Renders a battle/scene background
 */
export function BackgroundSprite({
  id,
  category = 'backgrounds-gs1',
  className,
  style,
}: BackgroundSpriteProps) {
  let backgroundPath: string;
  
  if (!id || id === 'random') {
    // Pick random background from category
    const backgrounds = getSpritesByCategory(category);
    if (backgrounds.length === 0) {
      backgroundPath = '';
    } else {
      const randomIndex = Math.floor(Math.random() * backgrounds.length);
      backgroundPath = backgrounds[randomIndex]!.path;
    }
  } else {
    // Use specific background
    backgroundPath = id.startsWith('/') ? id : `/sprites/backgrounds/${category.split('-')[1]}/${id}`;
  }
  
  if (!backgroundPath) {
    return (
      <div
        className={className}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#1a1a2e',
          ...style,
        }}
      />
    );
  }
  
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        backgroundImage: `url(${backgroundPath})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        ...style,
      }}
      role="img"
      aria-label="Battle background"
    />
  );
}
