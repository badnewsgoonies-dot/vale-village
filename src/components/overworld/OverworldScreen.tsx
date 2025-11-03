import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Unit } from '@/types/Unit';
import type { Screen } from '@/context/types';
import './OverworldScreen.css';

interface OverworldScreenProps {
  playerParty: Unit[];
  onNavigate: (screen: Screen) => void;
}

type Direction = 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW';

interface MapEntity {
  id: string;
  x: number;
  y: number;
  sprite: string;
  type: 'npc' | 'scenery' | 'trigger';
  blocking: boolean;
  interactable?: boolean;
  onInteract?: () => void;
  onCollide?: () => void;
}

interface Position {
  x: number;
  y: number;
}

const TILE_SIZE = 32;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 15;

// Direction to sprite suffix mapping
const directionToSpriteMap: Record<Direction, string> = {
  'N': 'Up',
  'S': '',  // Default walk down (no suffix)
  'E': 'Right',
  'W': 'Left',
  'NE': 'NE',
  'NW': 'NW',
  'SE': 'SE',
  'SW': 'SW',
};

export const OverworldScreen: React.FC<OverworldScreenProps> = ({
  playerParty,
  onNavigate,
}) => {
  // Player state
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 10, y: 10 });
  const [playerDirection, setPlayerDirection] = useState<Direction>('S');
  const [isRunning, setIsRunning] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  // Map entities (NPCs, scenery, triggers)
  const mapEntities: MapEntity[] = useMemo(() => [
    // Major NPCs
    {
      id: 'elder',
      x: 8,
      y: 5,
      sprite: '/sprites/overworld/majornpcs/Elder.gif',
      type: 'npc',
      blocking: true,
      interactable: true,
    },
    {
      id: 'dora',
      x: 12,
      y: 5,
      sprite: '/sprites/overworld/majornpcs/Dora.gif',
      type: 'npc',
      blocking: true,
      interactable: true,
    },
    // Minor NPCs
    {
      id: 'villager1',
      x: 6,
      y: 8,
      sprite: '/sprites/overworld/minornpcs/Villager-1.gif',
      type: 'npc',
      blocking: true,
      interactable: true,
    },
    {
      id: 'villager2',
      x: 14,
      y: 8,
      sprite: '/sprites/overworld/minornpcs/Villager-2.gif',
      type: 'npc',
      blocking: true,
      interactable: true,
    },
    // Battle trigger zones
    {
      id: 'battle_zone_1',
      x: 10,
      y: 12,
      sprite: '',
      type: 'trigger',
      blocking: false,
      onCollide: () => {
        onNavigate({ type: 'BATTLE' });
      },
    },
    {
      id: 'battle_zone_2',
      x: 15,
      y: 10,
      sprite: '',
      type: 'trigger',
      blocking: false,
      onCollide: () => {
        onNavigate({ type: 'BATTLE' });
      },
    },
  ], [onNavigate]);

  // Get player sprite based on direction and running state
  const getPlayerSprite = useCallback((direction: Direction, running: boolean): string => {
    const action = running ? 'Run' : 'Walk';
    const dirSuffix = directionToSpriteMap[direction];
    const separator = dirSuffix ? '_' : '';

    // Use first party member's name, or default to Isaac
    const characterName = playerParty.length > 0 ? playerParty[0].name : 'Isaac';
    return `/sprites/overworld/protagonists/${characterName}_${action}${separator}${dirSuffix}.gif`;
  }, [playerParty]);

  // Check if a position is walkable
  const canMoveTo = useCallback((x: number, y: number): boolean => {
    // Check map bounds
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) {
      return false;
    }

    // Check entity collisions
    return !mapEntities.some(entity =>
      entity.blocking && entity.x === x && entity.y === y
    );
  }, [mapEntities]);

  // Handle player movement
  const handleMove = useCallback((newX: number, newY: number, newDirection: Direction) => {
    // Update direction even if we can't move
    setPlayerDirection(newDirection);

    // Check if we can move to the new position
    if (canMoveTo(newX, newY)) {
      setPlayerPosition({ x: newX, y: newY });

      // Check for trigger collisions
      const trigger = mapEntities.find(
        e => e.type === 'trigger' && e.x === newX && e.y === newY
      );

      if (trigger?.onCollide) {
        trigger.onCollide();
      }
    }
  }, [canMoveTo, mapEntities]);

  // Calculate camera offset to center on player
  const cameraOffset = useMemo(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;

    return {
      x: centerX - (playerPosition.x * TILE_SIZE) - TILE_SIZE / 2,
      y: centerY - (playerPosition.y * TILE_SIZE) - TILE_SIZE / 2,
    };
  }, [playerPosition]);

  // Keyboard input handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for game controls
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'Shift', 'Escape'].includes(e.key)) {
        e.preventDefault();
      }

      // Handle menu/escape
      if (e.key === 'Escape') {
        onNavigate({ type: 'UNIT_COLLECTION' });
        return;
      }

      // Update running state
      if (e.key === 'Shift') {
        setIsRunning(true);
      }

      // Add key to pressed keys
      setPressedKeys(prev => new Set(prev).add(e.key.toLowerCase()));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsRunning(false);
      }

      // Remove key from pressed keys
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(e.key.toLowerCase());
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onNavigate]);

  // Movement loop based on pressed keys
  useEffect(() => {
    const moveInterval = setInterval(() => {
      if (pressedKeys.size === 0) return;

      let newX = playerPosition.x;
      let newY = playerPosition.y;
      let newDirection = playerDirection;

      // Check for diagonal movement first
      const up = pressedKeys.has('arrowup') || pressedKeys.has('w');
      const down = pressedKeys.has('arrowdown') || pressedKeys.has('s');
      const left = pressedKeys.has('arrowleft') || pressedKeys.has('a');
      const right = pressedKeys.has('arrowright') || pressedKeys.has('d');

      // Diagonal movements
      if (up && right) {
        newY -= 1;
        newX += 1;
        newDirection = 'NE';
      } else if (up && left) {
        newY -= 1;
        newX -= 1;
        newDirection = 'NW';
      } else if (down && right) {
        newY += 1;
        newX += 1;
        newDirection = 'SE';
      } else if (down && left) {
        newY += 1;
        newX -= 1;
        newDirection = 'SW';
      }
      // Cardinal directions
      else if (up) {
        newY -= 1;
        newDirection = 'N';
      } else if (down) {
        newY += 1;
        newDirection = 'S';
      } else if (left) {
        newX -= 1;
        newDirection = 'W';
      } else if (right) {
        newX += 1;
        newDirection = 'E';
      }

      // Only move if position changed
      if (newX !== playerPosition.x || newY !== playerPosition.y) {
        handleMove(newX, newY, newDirection);
      }
    }, isRunning ? 100 : 200); // Faster movement when running

    return () => clearInterval(moveInterval);
  }, [pressedKeys, playerPosition, playerDirection, isRunning, handleMove]);

  // Sort entities by Y position for proper depth rendering
  const sortedEntities = useMemo(() => {
    return [...mapEntities]
      .filter(e => e.sprite) // Filter out invisible triggers
      .sort((a, b) => a.y - b.y);
  }, [mapEntities]);

  const playerSprite = getPlayerSprite(playerDirection, isRunning);

  return (
    <div className="overworld-container">
      {/* Map viewport */}
      <div
        className="overworld-viewport"
        style={{
          transform: `translate(${cameraOffset.x}px, ${cameraOffset.y}px)`,
        }}
      >
        {/* Background layer */}
        <div className="overworld-background" />

        {/* Entities and player layer (combined and sorted by Y) */}
        <div className="overworld-entities">
          {/* Render all entities and player sorted by Y position */}
          {[...sortedEntities, { id: 'player', x: playerPosition.x, y: playerPosition.y, sprite: playerSprite, type: 'player' as const }]
            .sort((a, b) => a.y - b.y)
            .map(entity => (
              <img
                key={entity.id}
                src={entity.sprite}
                className={entity.id === 'player' ? 'overworld-player' : 'overworld-entity'}
                style={{
                  left: `${entity.x * TILE_SIZE}px`,
                  top: `${entity.y * TILE_SIZE}px`,
                }}
                alt={entity.id}
              />
            ))}
        </div>
      </div>

      {/* UI Overlay */}
      <div className="overworld-ui">
        <button className="menu-button" onClick={() => onNavigate({ type: 'UNIT_COLLECTION' })}>
          Menu (ESC)
        </button>
        <div className="controls-hint">
          <div>WASD / Arrows: Move</div>
          <div>Shift: Run</div>
          <div>ESC: Menu</div>
        </div>
      </div>
    </div>
  );
};
