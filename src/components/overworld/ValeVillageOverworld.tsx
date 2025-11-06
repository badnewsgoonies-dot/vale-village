import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useGame } from '@/context/GameContext';
import './ValeVillageOverworld.css';

interface Position {
  x: number;
  y: number;
}

interface MapEntity {
  id: string;
  x: number;
  y: number;
  sprite: string;
  type: 'npc' | 'building' | 'scenery' | 'interactive';
  blocking?: boolean;
  label?: string;
  onInteract?: () => void;
}

const WORLD_SIZE = 1920; // 120 tiles × 16px
const VIEWPORT_WIDTH = 960;  // 4x scale from 240px GBA
const VIEWPORT_HEIGHT = 640; // 4x scale from 160px GBA

export const ValeVillageOverworld: React.FC = () => {
  const { state, actions } = useGame();

  // Player state
  const [playerPos, setPlayerPos] = useState<Position>({ x: 960, y: 960 });
  const [playerDirection, setPlayerDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [isRunning, setIsRunning] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  // Vale Village map entities (based on vale-village-authentic.html)
  const mapEntities: MapEntity[] = useMemo(() => [
    // ===== BUILDINGS =====
    // Sol Sanctum (top area)
    {
      id: 'sol-sanctum',
      x: 850,
      y: 100,
      sprite: '/sprites/scenery/buildings/Vale/Vale_Sanctum.gif',
      type: 'building',
      blocking: true,
      label: 'Sol Sanctum',
    },

    // Kraden's House
    {
      id: 'kradens-house',
      x: 450,
      y: 250,
      sprite: '/sprites/scenery/buildings/Vale/Vale_Kradens_House.gif',
      type: 'building',
      blocking: true,
      label: "Kraden's Cottage",
    },

    // Isaac's House
    {
      id: 'isaacs-house',
      x: 1100,
      y: 380,
      sprite: '/sprites/scenery/buildings/Vale/Vale_Isaacs_House.gif',
      type: 'building',
      blocking: true,
      label: "Isaac's House",
    },

    // Garet's House
    {
      id: 'garets-house',
      x: 350,
      y: 550,
      sprite: '/sprites/scenery/buildings/Vale/Vale_Garets_House.gif',
      type: 'building',
      blocking: true,
      label: "Garet's House",
    },

    // Jenna's House
    {
      id: 'jennas-house',
      x: 750,
      y: 650,
      sprite: '/sprites/scenery/buildings/Vale/Vale_Jennas_House.gif',
      type: 'building',
      blocking: true,
      label: "Jenna's House",
    },

    // Weapon & Armor Shop
    {
      id: 'weapon-shop',
      x: 1350,
      y: 1150,
      sprite: '/sprites/scenery/buildings/Vale/Vale_WepArm_Shop.gif',
      type: 'building',
      blocking: true,
      label: 'Weapon & Armor Shop',
    },

    // Inn
    {
      id: 'vale-inn',
      x: 1450,
      y: 650,
      sprite: '/sprites/scenery/buildings/Vale/Vale_Inn.gif',
      type: 'building',
      blocking: true,
      label: 'Vale Inn',
    },

    // Generic buildings
    {
      id: 'building-1',
      x: 500,
      y: 900,
      sprite: '/sprites/scenery/buildings/Vale/Vale_Building1.gif',
      type: 'building',
      blocking: true,
    },
    {
      id: 'building-2',
      x: 1200,
      y: 850,
      sprite: '/sprites/scenery/buildings/Vale/Vale_Building2.gif',
      type: 'building',
      blocking: true,
    },
    {
      id: 'building-3',
      x: 300,
      y: 1100,
      sprite: '/sprites/scenery/buildings/Vale/Vale_Building3.gif',
      type: 'building',
      blocking: true,
    },

    // ===== INTERACTIVES =====
    // Psynergy Stone (sacred)
    {
      id: 'psynergy-stone-sanctum',
      x: 920,
      y: 230,
      sprite: '/sprites/scenery/buildings/Vale/Vale_Psynergy_Stone.gif',
      type: 'interactive',
      blocking: true,
      onInteract: () => {
        // TODO: Restore PP
        console.log('Psynergy Stone: PP restored!');
      },
    },

    // Great Psynergy Stone (plaza)
    {
      id: 'psynergy-stone-plaza',
      x: 900,
      y: 700,
      sprite: '/sprites/scenery/buildings/Vale/Vale_Psynergy_Stone.gif',
      type: 'interactive',
      blocking: true,
      onInteract: () => {
        console.log('Great Psynergy Stone: Ancient energy...');
      },
    },

    // ===== NPCS =====
    // Elder (near sanctum)
    {
      id: 'elder',
      x: 900,
      y: 280,
      sprite: '/sprites/overworld/majornpcs/Elder.gif',
      type: 'npc',
      blocking: true,
      onInteract: () => {
        actions.navigate({ type: 'DIALOGUE', npcId: 'elder' });
      },
    },

    // Innkeeper
    {
      id: 'innkeeper',
      x: 1500,
      y: 740,
      sprite: '/sprites/overworld/majornpcs/Innkeeper.gif',
      type: 'npc',
      blocking: true,
      onInteract: () => {
        actions.navigate({ type: 'DIALOGUE', npcId: 'innkeeper' });
      },
    },

    // Weaponshop Owner
    {
      id: 'weaponshop-owner',
      x: 1400,
      y: 1250,
      sprite: '/sprites/overworld/majornpcs/Weaponshop_Owner.gif',
      type: 'npc',
      blocking: true,
      onInteract: () => {
        actions.navigate({ type: 'DIALOGUE', npcId: 'weaponshop-owner' });
      },
    },

    // Garet (walking around)
    {
      id: 'garet',
      x: 400,
      y: 620,
      sprite: '/sprites/overworld/protagonists/Garet.gif',
      type: 'npc',
      blocking: true,
      onInteract: () => {
        actions.navigate({ type: 'DIALOGUE', npcId: 'garet' });
      },
    },

    // Jenna (near her house)
    {
      id: 'jenna',
      x: 820,
      y: 710,
      sprite: '/sprites/overworld/protagonists/Jenna.gif',
      type: 'npc',
      blocking: true,
      onInteract: () => {
        actions.navigate({ type: 'DIALOGUE', npcId: 'jenna' });
      },
    },

    // Kraden (outside cottage)
    {
      id: 'kraden',
      x: 500,
      y: 310,
      sprite: '/sprites/overworld/protagonists/Kraden.gif',
      type: 'npc',
      blocking: true,
      onInteract: () => {
        actions.navigate({ type: 'DIALOGUE', npcId: 'kraden' });
      },
    },

    // Minor villagers
    {
      id: 'villager-1',
      x: 750,
      y: 850,
      sprite: '/sprites/overworld/minornpcs/Villager-1.gif',
      type: 'npc',
      blocking: true,
      onInteract: () => {
        actions.navigate({ type: 'DIALOGUE', npcId: 'villager-1' });
      },
    },
    {
      id: 'villager-2',
      x: 550,
      y: 650,
      sprite: '/sprites/overworld/minornpcs/Villager-2.gif',
      type: 'npc',
      blocking: true,
      onInteract: () => {
        actions.navigate({ type: 'DIALOGUE', npcId: 'villager-2' });
      },
    },

    // ===== NATURAL SCENERY =====
    // Trees - Northern forest area (near Sol Sanctum)
    {
      id: 'tree-n1',
      x: 650,
      y: 150,
      sprite: '/sprites/scenery/plants/Tree.gif',
      type: 'scenery',
      blocking: true,
    },
    {
      id: 'tree-n2',
      x: 720,
      y: 180,
      sprite: '/sprites/scenery/plants/Tree.gif',
      type: 'scenery',
      blocking: true,
    },
    {
      id: 'tree-n3',
      x: 1050,
      y: 160,
      sprite: '/sprites/scenery/plants/Tree.gif',
      type: 'scenery',
      blocking: true,
    },
    {
      id: 'tree-n4',
      x: 1130,
      y: 200,
      sprite: '/sprites/scenery/plants/Tree.gif',
      type: 'scenery',
      blocking: true,
    },

    // Trees - Western edge
    {
      id: 'tree-w1',
      x: 150,
      y: 400,
      sprite: '/sprites/scenery/plants/Tree.gif',
      type: 'scenery',
      blocking: true,
    },
    {
      id: 'tree-w2',
      x: 180,
      y: 520,
      sprite: '/sprites/scenery/plants/Tree.gif',
      type: 'scenery',
      blocking: true,
    },
    {
      id: 'tree-w3',
      x: 160,
      y: 680,
      sprite: '/sprites/scenery/plants/Tree.gif',
      type: 'scenery',
      blocking: true,
    },
    {
      id: 'tree-w4',
      x: 140,
      y: 850,
      sprite: '/sprites/scenery/plants/Tree.gif',
      type: 'scenery',
      blocking: true,
    },

    // Trees - Eastern edge
    {
      id: 'tree-e1',
      x: 1650,
      y: 450,
      sprite: '/sprites/scenery/plants/Tree.gif',
      type: 'scenery',
      blocking: true,
    },
    {
      id: 'tree-e2',
      x: 1700,
      y: 600,
      sprite: '/sprites/scenery/plants/Tree.gif',
      type: 'scenery',
      blocking: true,
    },
    {
      id: 'tree-e3',
      x: 1680,
      y: 780,
      sprite: '/sprites/scenery/plants/Tree.gif',
      type: 'scenery',
      blocking: true,
    },

    // Trees - Southern area (decorative)
    {
      id: 'tree-s1',
      x: 400,
      y: 1250,
      sprite: '/sprites/scenery/plants/Tree.gif',
      type: 'scenery',
      blocking: true,
    },
    {
      id: 'tree-s2',
      x: 650,
      y: 1300,
      sprite: '/sprites/scenery/plants/Tree.gif',
      type: 'scenery',
      blocking: true,
    },
    {
      id: 'tree-s3',
      x: 1000,
      y: 1280,
      sprite: '/sprites/scenery/plants/Tree.gif',
      type: 'scenery',
      blocking: true,
    },

    // Rocks and boulders
    {
      id: 'rock-1',
      x: 280,
      y: 350,
      sprite: '/sprites/scenery/outdoor/sm/boulder.gif',
      type: 'scenery',
      blocking: true,
    },
    {
      id: 'rock-2',
      x: 600,
      y: 480,
      sprite: '/sprites/scenery/outdoor/sm/boulder.gif',
      type: 'scenery',
      blocking: true,
    },
    {
      id: 'rock-3',
      x: 1300,
      y: 500,
      sprite: '/sprites/scenery/outdoor/sm/boulder.gif',
      type: 'scenery',
      blocking: true,
    },
    {
      id: 'rock-4',
      x: 850,
      y: 1100,
      sprite: '/sprites/scenery/outdoor/sm/boulder.gif',
      type: 'scenery',
      blocking: true,
    },
    {
      id: 'rock-5',
      x: 1550,
      y: 1050,
      sprite: '/sprites/scenery/outdoor/sm/boulder.gif',
      type: 'scenery',
      blocking: true,
    },

    // Bridge (removed river tiles as Water.gif sprite doesn't exist)
    {
      id: 'bridge-1',
      x: 1590,
      y: 1020,
      sprite: '/sprites/scenery/outdoor/lg/log_bridge.gif',
      type: 'scenery',
      blocking: false, // Can walk over bridge
    },

    // Flowers and decorative bushes
    {
      id: 'flowers-1',
      x: 800,
      y: 500,
      sprite: '/sprites/scenery/plants/Flowers.gif',
      type: 'scenery',
      blocking: false,
    },
    {
      id: 'flowers-2',
      x: 1000,
      y: 600,
      sprite: '/sprites/scenery/plants/Flowers.gif',
      type: 'scenery',
      blocking: false,
    },
    {
      id: 'flowers-3',
      x: 650,
      y: 750,
      sprite: '/sprites/scenery/plants/Flowers.gif',
      type: 'scenery',
      blocking: false,
    },
    {
      id: 'bush-1',
      x: 450,
      y: 800,
      sprite: '/sprites/scenery/plants/Bush.gif',
      type: 'scenery',
      blocking: true,
    },
    {
      id: 'bush-2',
      x: 1100,
      y: 950,
      sprite: '/sprites/scenery/plants/Bush.gif',
      type: 'scenery',
      blocking: true,
    },

    // Fences around houses
    {
      id: 'fence-1',
      x: 380,
      y: 500,
      sprite: '/sprites/scenery/outdoor/sm/Fence_HorizSeg.gif',
      type: 'scenery',
      blocking: true,
    },
    {
      id: 'fence-2',
      x: 1050,
      y: 330,
      sprite: '/sprites/scenery/outdoor/sm/Fence_HorizSeg.gif',
      type: 'scenery',
      blocking: true,
    },

    // Signs
    {
      id: 'sign-sanctum',
      x: 900,
      y: 320,
      sprite: '/sprites/scenery/outdoor/sm/sign.gif',
      type: 'interactive',
      blocking: false,
      onInteract: () => {
        console.log('Sign: ↑ Sol Sanctum - Sacred Ground');
      },
    },
    {
      id: 'sign-shops',
      x: 1250,
      y: 1050,
      sprite: '/sprites/scenery/outdoor/sm/sign.gif',
      type: 'interactive',
      blocking: false,
      onInteract: () => {
        console.log('Sign: → Shops & Inn');
      },
    },
  ], []);

  // Check if position is walkable
  const canMoveTo = useCallback((x: number, y: number): boolean => {
    // Check world bounds
    if (x < 100 || x > WORLD_SIZE - 100 || y < 100 || y > WORLD_SIZE - 100) {
      return false;
    }

    // Check entity collisions
    return !mapEntities.some(entity => {
      if (!entity.blocking) return false;

      // Simple box collision (entities are roughly 32×48px)
      const entityLeft = entity.x;
      const entityRight = entity.x + 32;
      const entityTop = entity.y;
      const entityBottom = entity.y + 48;

      return x >= entityLeft && x <= entityRight && y >= entityTop && y <= entityBottom;
    });
  }, [mapEntities]);

  // Get NPC at position (for interaction)
  const getNPCAtPosition = useCallback((x: number, y: number): MapEntity | null => {
    return mapEntities.find(entity => {
      if (entity.type !== 'npc' && entity.type !== 'interactive') return false;

      const dx = Math.abs(entity.x - x);
      const dy = Math.abs(entity.y - y);

      // Check if within interaction range (60px)
      return dx < 60 && dy < 60;
    }) || null;
  }, [mapEntities]);

  // Handle interaction (Space/Enter)
  const handleInteract = useCallback(() => {
    const npc = getNPCAtPosition(playerPos.x, playerPos.y);
    if (npc && npc.onInteract) {
      npc.onInteract();
    }
  }, [playerPos, getNPCAtPosition]);

  // Keyboard controls
  useEffect(() => {
    const keys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for game controls
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'Shift', 'Escape', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
      }

      // Interaction
      if (e.key === ' ' || e.key === 'Enter') {
        handleInteract();
        return;
      }

      // Menu
      if (e.key === 'Escape') {
        actions.navigate({ type: 'MAIN_MENU' });
        return;
      }

      // Running
      if (e.key === 'Shift') {
        setIsRunning(true);
      }

      keys.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsRunning(false);
      }
      keys.delete(e.key.toLowerCase());
    };

    // Movement loop
    const moveInterval = setInterval(() => {
      if (keys.size === 0) {
        setIsMoving(false);
        return;
      }

      let dx = 0;
      let dy = 0;
      const speed = isRunning ? 4 : 2;

      const up = keys.has('w') || keys.has('arrowup');
      const down = keys.has('s') || keys.has('arrowdown');
      const left = keys.has('a') || keys.has('arrowleft');
      const right = keys.has('d') || keys.has('arrowright');

      if (up) {
        dy -= speed;
        setPlayerDirection('up');
      }
      if (down) {
        dy += speed;
        setPlayerDirection('down');
      }
      if (left) {
        dx -= speed;
        setPlayerDirection('left');
      }
      if (right) {
        dx += speed;
        setPlayerDirection('right');
      }

      if (dx !== 0 || dy !== 0) {
        const newX = playerPos.x + dx;
        const newY = playerPos.y + dy;

        if (canMoveTo(newX, newY)) {
          setPlayerPos({ x: newX, y: newY });
          setIsMoving(true);
        } else {
          setIsMoving(false);
        }
      }
    }, 50);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      clearInterval(moveInterval);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playerPos, isRunning, canMoveTo, handleInteract, actions]);

  // Calculate camera offset (center on player)
  const cameraOffset = useMemo(() => {
    let cameraX = playerPos.x - VIEWPORT_WIDTH / 2;
    let cameraY = playerPos.y - VIEWPORT_HEIGHT / 2;

    // Clamp to world bounds
    cameraX = Math.max(0, Math.min(WORLD_SIZE - VIEWPORT_WIDTH, cameraX));
    cameraY = Math.max(0, Math.min(WORLD_SIZE - VIEWPORT_HEIGHT, cameraY));

    return { x: -cameraX, y: -cameraY };
  }, [playerPos]);

  // Get player sprite
  const getPlayerSprite = () => {
    const characterName = state.playerData.unitsCollected[0]?.name || 'Isaac';
    const action = isMoving ? (isRunning ? 'Run' : 'Walk') : '';
    const dirMap = {
      up: 'Up',
      down: '',
      left: 'Left',
      right: 'Right',
    };
    const dirSuffix = dirMap[playerDirection];

    // Build path: Isaac_Walk_Left.gif or Isaac_Left.gif or Isaac.gif
    let path = characterName;
    if (action) path += `_${action}`;
    if (dirSuffix) path += `_${dirSuffix}`;

    return `/sprites/overworld/protagonists/${path}.gif`;
  };

  // Minimap position
  const minimapPos = useMemo(() => ({
    x: (playerPos.x / WORLD_SIZE) * 120,
    y: (playerPos.y / WORLD_SIZE) * 120,
  }), [playerPos]);

  return (
    <div className="vale-village-container">
      {/* Viewport */}
      <div className="vale-viewport">
        {/* World (scrolls with camera) */}
        <div
          className="vale-world"
          style={{
            transform: `translate(${cameraOffset.x}px, ${cameraOffset.y}px)`,
          }}
        >
          {/* Terrain layer */}
          <div className="terrain-layer" />

          {/* Render all entities and player, sorted by Y position for depth */}
          {[...mapEntities, {
            id: 'player',
            x: playerPos.x,
            y: playerPos.y,
            sprite: getPlayerSprite(),
            type: 'npc' as const,
          }]
            .sort((a, b) => a.y - b.y)
            .map(entity => (
              <div
                key={entity.id}
                className={`vale-entity ${entity.type} ${entity.id === 'player' ? 'player' : ''}`}
                style={{
                  left: `${entity.x}px`,
                  top: `${entity.y}px`,
                }}
              >
                <img src={entity.sprite} alt={entity.id} />
                {entity.label && (
                  <div className="location-label">{entity.label}</div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* HUD */}
      <div className="vale-hud">
        <div className="location-name">VALE VILLAGE</div>
        <div className="player-stats">
          <div>COINS: {state.playerData.gold}</div>
          <div>LV: {state.playerData.unitsCollected[0]?.level || 1}</div>
        </div>
      </div>

      {/* Minimap */}
      <div className="vale-minimap">
        <div className="minimap-world">
          <div
            className="minimap-player"
            style={{
              left: `${minimapPos.x}px`,
              top: `${minimapPos.y}px`,
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="vale-controls">
        <div><span className="key">WASD</span> / <span className="key">↑↓←→</span> Move</div>
        <div><span className="key">SHIFT</span> Run</div>
        <div><span className="key">SPACE</span> Interact</div>
        <div><span className="key">ESC</span> Menu</div>
      </div>
    </div>
  );
};
