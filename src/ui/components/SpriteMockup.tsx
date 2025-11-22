/**
 * Sprite Mockup Component
 * Battle Scene Mockup - Beach Battle Layout
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite, searchSprites, getSpritesByCategory, getSpriteById } from '../sprites';

export function SpriteMockup() {
  const [showBattleScene, setShowBattleScene] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('battle-party');
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = [
    'battle-party',
    'battle-enemies',
    'battle-bosses',
    'backgrounds-gs1',
    'backgrounds-gs2',
    'icons-buttons',
    'icons-items',
    'overworld-protagonists',
  ];
  
  const sprites = searchQuery 
    ? searchSprites(searchQuery)
    : getSpritesByCategory(selectedCategory);

  // Battle scene sprites - try to find matching sprites
  const isaacSprite = getSpriteById('isaac-lblade-front') || getSpriteById('isaac-front');
  const garetSprite = getSpriteById('garet-axe-front') || getSpriteById('garet-front');
  const ivanSprite = getSpriteById('ivan-staff-front') || getSpriteById('ivan-lblade-front') || getSpriteById('ivan-front');
  const miaSprite = getSpriteById('mia-staff-front') || getSpriteById('mia-mace-front') || getSpriteById('mia-front');
  
  // Try to find enemy sprites
  const golemSprite = searchSprites('golem')[0] || searchSprites('armor')[0] || getSpritesByCategory('battle-enemies')[0];
  const wingedEnemySprite = searchSprites('winged')[0] || searchSprites('bat')[0] || getSpritesByCategory('battle-enemies')[1];
  
  if (showBattleScene) {
    return (
      <div style={{ 
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#87CEEB', // Sky blue fallback
        imageRendering: 'pixelated', // Pixel-perfect rendering
      }}>
        {/* Beach Battle Background - Use shore/beach background */}
        <BackgroundSprite 
          id="/sprites/backgrounds/gs1/World_Map_Shore.gif"
          style={{
            position: 'absolute',
            width: '100%',
            height: 'calc(100% - 50px)', // Leave room for menu bar
            top: 0,
            left: 0,
            zIndex: 0,
          }}
          sizeMode="cover"
        />
        
        {/* Battle Scene Container - Pixel-perfect positioning */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: 'calc(100% - 50px)',
          bottom: '50px',
          left: 0,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          paddingLeft: '5%',
          paddingRight: '5%',
          paddingBottom: '8%',
          zIndex: 1,
        }}>
          {/* Player Party (Left Side) - Horizontal line, all aligned at bottom */}
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-end',
            height: '100%',
          }}>
            {/* Isaac - Blond swordsman (far left) */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              position: 'relative',
            }}>
              <SimpleSprite
                id={isaacSprite?.path || '/sprites/battle/party/isaac/Isaac_lBlade_Front.gif'}
                width={64}
                height={64}
                imageRendering="pixelated"
              />
            </div>
            
            {/* Garet - Orange-haired warrior with axe */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              position: 'relative',
            }}>
              <SimpleSprite
                id={garetSprite?.path || '/sprites/battle/party/garet/Garet_Axe_Front.gif'}
                width={64}
                height={64}
                imageRendering="pixelated"
              />
            </div>
            
            {/* Ivan - Blond mage with staff */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              position: 'relative',
            }}>
              <SimpleSprite
                id={ivanSprite?.path || '/sprites/battle/party/ivan/Ivan_Staff_Front.gif'}
                width={64}
                height={64}
                imageRendering="pixelated"
              />
            </div>
            
            {/* Mia - Blue-haired healer with staff (far right of party) */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              position: 'relative',
            }}>
              <SimpleSprite
                id={miaSprite?.path || '/sprites/battle/party/mia/Mia_Staff_Front.gif'}
                width={64}
                height={64}
                imageRendering="pixelated"
              />
            </div>
          </div>
          
          {/* Enemy Party (Right Side) - Golem center-right, winged enemies floating */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            gap: '0px',
            height: '100%',
            position: 'relative',
          }}>
            {/* Large Golem (Center-Right) - Standing on sand with shadow */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              position: 'relative',
              marginBottom: '0px',
            }}>
              {/* Shadow on sand */}
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '90px',
                height: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '50%',
                zIndex: 0,
              }} />
              <SimpleSprite
                id={golemSprite?.path || getSpritesByCategory('battle-enemies')[0]?.path || '/sprites/battle/enemies/golem.gif'}
                width={96}
                height={96}
                imageRendering="pixelated"
                style={{
                  position: 'relative',
                  zIndex: 1,
                }}
              />
            </div>
            
            {/* Two Winged Enemies (Floating above golem, to the right) */}
            <div style={{
              display: 'flex',
              gap: '12px',
              position: 'absolute',
              right: '-40px',
              top: '20%',
              alignItems: 'flex-start',
            }}>
              {/* First winged enemy */}
              <div style={{ position: 'relative' }}>
                {/* Shadow on sand (smaller, oval) */}
                <div style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '32px',
                  height: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '50%',
                  zIndex: 0,
                }} />
                <SimpleSprite
                  id={wingedEnemySprite?.path || getSpritesByCategory('battle-enemies')[1]?.path || '/sprites/battle/enemies/winged.gif'}
                  width={48}
                  height={48}
                  imageRendering="pixelated"
                  style={{
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
              </div>
              
              {/* Second winged enemy */}
              <div style={{ position: 'relative' }}>
                {/* Shadow on sand (smaller, oval) */}
                <div style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '32px',
                  height: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '50%',
                  zIndex: 0,
                }} />
                <SimpleSprite
                  id={wingedEnemySprite?.path || getSpritesByCategory('battle-enemies')[2]?.path || '/sprites/battle/enemies/winged.gif'}
                  width={48}
                  height={48}
                  imageRendering="pixelated"
                  style={{
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Battle Menu Bar (Bottom) - Pixel-perfect black bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '50px',
          backgroundColor: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 10,
          borderTop: 'none',
        }}>
          {['Fight', 'Psynergy', 'Djimi', 'Item', 'Run'].map((option) => (
            <button
              key={option}
              style={{
                color: '#FFFFFF',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '16px',
                fontFamily: 'monospace',
                cursor: 'pointer',
                padding: '0',
                textTransform: 'none',
                letterSpacing: '0px',
                transition: 'none',
                fontWeight: 'normal',
                flex: '1',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FFD700';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#FFFFFF';
              }}
            >
              {option}
            </button>
          ))}
        </div>
        
        {/* Toggle Button */}
        <button
          onClick={() => setShowBattleScene(false)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '8px 16px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#fff',
            border: '1px solid #fff',
            borderRadius: '2px',
            cursor: 'pointer',
            fontSize: '12px',
            zIndex: 20,
            fontFamily: 'monospace',
          }}
        >
          Gallery
        </button>
      </div>
    );
  }
  
  // Gallery Mode (original)
  return (
    <div style={{ 
      padding: '2rem', 
      backgroundColor: '#1a1a1a',
      minHeight: '100vh',
      color: '#fff',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>🎨 Sprite Mockup - Debug Mode</h1>
        <button
          onClick={() => setShowBattleScene(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Show Battle Scene
        </button>
      </div>
      
      {/* Controls */}
      <div style={{ 
        marginBottom: '2rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <div>
          <label style={{ marginRight: '0.5rem' }}>Category:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSearchQuery('');
            }}
            style={{ padding: '0.5rem', fontSize: '1rem' }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label style={{ marginRight: '0.5rem' }}>Search:</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sprites..."
            style={{ padding: '0.5rem', fontSize: '1rem', minWidth: '200px' }}
          />
        </div>
        
        <div style={{ color: '#aaa' }}>
          Showing {sprites.length} sprites
        </div>
      </div>
      
      {/* Background Example */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>Background Example</h2>
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          height: '300px',
          border: '2px solid #444',
          borderRadius: '8px',
          overflow: 'hidden',
        }}>
          <BackgroundSprite 
            id="random"
            category="backgrounds-gs1"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
            debug={true}
          />
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            color: '#fff',
          }}>
            Random GS1 Background (hover for debug info)
          </div>
        </div>
      </div>
      
      {/* Sprite Grid */}
      <div>
        <h2>Sprite Gallery ({selectedCategory})</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '1rem',
          marginTop: '1rem',
        }}>
          {sprites.slice(0, 50).map((sprite) => (
            <div
              key={sprite.path}
              style={{
                padding: '1rem',
                backgroundColor: '#2a2a2a',
                borderRadius: '8px',
                border: '1px solid #444',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <SimpleSprite
                id={sprite.path}
                width={64}
                height={64}
                debug={true}
                style={{
                  border: '1px solid #555',
                  borderRadius: '4px',
                  backgroundColor: '#1a1a1a',
                }}
              />
              <div style={{
                fontSize: '0.75rem',
                textAlign: 'center',
                color: '#aaa',
                wordBreak: 'break-word',
                maxWidth: '100%',
              }}>
                {sprite.name.length > 20 
                  ? sprite.name.substring(0, 20) + '...' 
                  : sprite.name}
              </div>
            </div>
          ))}
        </div>
        {sprites.length > 50 && (
          <div style={{ marginTop: '1rem', color: '#aaa' }}>
            Showing first 50 of {sprites.length} sprites
          </div>
        )}
      </div>
      
      {/* Instructions */}
      <div style={{
        marginTop: '3rem',
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderRadius: '8px',
        border: '1px solid #444',
      }}>
        <h3>💡 Instructions</h3>
        <ul style={{ color: '#aaa', lineHeight: '1.8' }}>
          <li><strong>Hover over sprites</strong> to see debug info (name, path, category)</li>
          <li><strong>Search</strong> for sprites by name (e.g., &quot;isaac&quot;, &quot;goblin&quot;)</li>
          <li><strong>Select category</strong> to browse sprites by type</li>
          <li>All sprites are <strong>GIFs</strong> and animate automatically</li>
          <li>Use <code>debug={true}</code> prop to see sprite information</li>
        </ul>
      </div>
    </div>
  );
}

