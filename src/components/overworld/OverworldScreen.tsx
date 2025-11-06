import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Unit } from '@/types/Unit';
import type { Screen } from '@/context/types';
import { VALE_VILLAGE_MAP } from '@/data/maps/valeVillage';
import { VALE_VILLAGE_BUILDINGS, getBuildingCollisionTiles } from '@/data/maps/valeVillageBuildings';
import { VALE_VILLAGE_PROPS, getPropCollisionTiles } from '@/data/maps/valeVillageVegetation';
import { VALE_VILLAGE_NPCS, getRandomNPCDialogue } from '@/data/npcs/valeVillageNPCs';
import { TerrainTile } from './TerrainTile';
import { BuildingSprite } from './BuildingSprite';
import { PropSprite } from './PropSprite';
import { ParticleEffect } from './ParticleEffect';
import './OverworldScreen.css';

interface OverworldScreenProps {
  playerParty: Unit[];
  onNavigate: (screen: Screen) => void;
  onStartBattle?: (enemyIds: string[]) => void;
}

interface Dialogue {
  speaker: string;
  text: string;
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
const MAP_WIDTH = 30;  // Updated for Vale Village terrain map
const MAP_HEIGHT = 25;  // Updated for Vale Village terrain map

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

// NPC dialogue is now handled by the valeVillageNPCs data file

// Get tile in front of player based on direction
const getFacingTile = (x: number, y: number, direction: Direction): Position => {
  switch (direction) {
  case 'N': return { x, y: y - 1 };
  case 'S': return { x, y: y + 1 };
  case 'E': return { x: x + 1, y };
  case 'W': return { x: x - 1, y };
  case 'NE': return { x: x + 1, y: y - 1 };
  case 'NW': return { x: x - 1, y: y - 1 };
  case 'SE': return { x: x + 1, y: y + 1 };
  case 'SW': return { x: x - 1, y: y + 1 };
  default: return { x, y };
  }
};

export const OverworldScreen: React.FC<OverworldScreenProps> = ({
  playerParty,
  onNavigate,
  onStartBattle,
}) => {
  // Player state
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 15, y: 5 });  // Central plaza on stone path
  const [playerDirection, setPlayerDirection] = useState<Direction>('S');
  const [isRunning, setIsRunning] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [dialogue, setDialogue] = useState<Dialogue | null>(null);

  // Building collision tiles (computed once)
  const buildingCollisionTiles = useMemo(() => getBuildingCollisionTiles(), []);

  // Prop collision tiles (computed once)
  const propCollisionTiles = useMemo(() => getPropCollisionTiles(), []);

  // Map entities (NPCs, scenery, triggers)
  const mapEntities: MapEntity[] = useMemo(() => [
    // Convert all Vale Village NPCs to MapEntity format
    ...VALE_VILLAGE_NPCS.map(npc => ({
      id: npc.id,
      x: npc.x,
      y: npc.y,
      sprite: npc.sprite,
      type: 'npc' as const,
      blocking: npc.blocking,
      interactable: npc.interactable,
    })),
    // Battle trigger zones (with visual markers for debugging)
    {
      id: 'battle_zone_1',
      x: 10,
      y: 12,
      sprite: '', // Will render a red marker via CSS
      type: 'trigger',
      blocking: false,
      onCollide: () => {
        console.log('Battle trigger hit at (10, 12)!');
        // Initialize battle with random enemies
        if (onStartBattle) {
          onStartBattle(['goblin', 'wild-wolf']);
        }
        onNavigate({ type: 'BATTLE' });
      },
    },
    {
      id: 'battle_zone_2',
      x: 15,
      y: 10,
      sprite: '', // Will render a red marker via CSS
      type: 'trigger',
      blocking: false,
      onCollide: () => {
        console.log('Battle trigger hit at (15, 10)!');
        // Initialize battle with different enemies
        if (onStartBattle) {
          onStartBattle(['slime', 'goblin', 'goblin']);
        }
        onNavigate({ type: 'BATTLE' });
      },
    },
  ], [onNavigate, onStartBattle]);

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

    // Check terrain collision (water, cliffs, etc.)
    if (!VALE_VILLAGE_MAP.collisionMap[y][x]) {
      return false;
    }

    // Check building collision
    if (buildingCollisionTiles.has(`${x},${y}`)) {
      return false;
    }

    // Check prop collision (trees, statues)
    if (propCollisionTiles.has(`${x},${y}`)) {
      return false;
    }

    // Check entity collisions
    return !mapEntities.some(entity =>
      entity.blocking && entity.x === x && entity.y === y
    );
  }, [mapEntities, buildingCollisionTiles, propCollisionTiles]);

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

  // Handle NPC interaction
  const handleInteract = useCallback(() => {
    // Check if player is facing an NPC
    const facingTile = getFacingTile(playerPosition.x, playerPosition.y, playerDirection);
    const npc = mapEntities.find(e =>
      e.type === 'npc' && e.x === facingTile.x && e.y === facingTile.y && e.interactable
    );

    if (npc) {
      console.log('Interacting with NPC:', npc.id);

      // Get NPC data for proper name display
      const npcData = VALE_VILLAGE_NPCS.find(n => n.id === npc.id);
      const npcName = npcData?.name || npc.id.charAt(0).toUpperCase() + npc.id.slice(1);

      setDialogue({
        speaker: npcName,
        text: getRandomNPCDialogue(npc.id),
      });

      // Call onInteract if defined
      if (npc.onInteract) {
        npc.onInteract();
      }
    }
  }, [playerPosition, playerDirection, mapEntities]);

  // Keyboard input handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't process movement if dialogue is open
      if (dialogue && e.key !== 'Escape') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          setDialogue(null); // Close dialogue
        }
        return;
      }

      // Prevent default for game controls
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'Shift', 'Escape', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
      }

      // Handle interaction
      if (e.key === ' ' || e.key === 'Enter') {
        handleInteract();
        return;
      }

      // Handle menu/escape
      if (e.key === 'Escape') {
        if (dialogue) {
          setDialogue(null); // Close dialogue
        } else {
          onNavigate({ type: 'UNIT_COLLECTION' });
        }
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
  }, [onNavigate, handleInteract, dialogue]);

  // Movement loop based on pressed keys
  useEffect(() => {
    // Don't move if dialogue is open
    if (dialogue) return;

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
  }, [pressedKeys, playerPosition, playerDirection, isRunning, handleMove, dialogue]);

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
        {/* Terrain layer */}
        <div className="overworld-terrain">
          {VALE_VILLAGE_MAP.layers.ground.map((row, rowIndex) =>
            row.map((terrainType, colIndex) => (
              <TerrainTile
                key={`terrain-${colIndex}-${rowIndex}`}
                type={terrainType}
                x={colIndex}
                y={rowIndex}
              />
            ))
          )}
        </div>

        {/* Buildings layer */}
        <div className="overworld-buildings">
          {VALE_VILLAGE_BUILDINGS.map(building => (
            <BuildingSprite
              key={building.id}
              type={building.type}
              x={building.x}
              y={building.y}
              width={building.width}
              height={building.height}
            />
          ))}
        </div>

        {/* Props/Vegetation layer */}
        <div className="overworld-props">
          {VALE_VILLAGE_PROPS.map(prop => (
            <PropSprite
              key={prop.id}
              type={prop.type}
              x={prop.x}
              y={prop.y}
              blocking={prop.blocking}
            />
          ))}
        </div>

        {/* Particle Effects layer */}
        <div className="overworld-effects">
          {/* Psynergy Stone effect (from building data) */}
          <ParticleEffect type="psynergy" x={11} y={2} active={true} />
        </div>

        {/* Entities and player layer (combined and sorted by Y) */}
        <div className="overworld-entities">
          {/* Render battle zone markers */}
          {mapEntities
            .filter(e => e.type === 'trigger')
            .map(trigger => (
              <div
                key={trigger.id}
                className="battle-zone-marker"
                style={{
                  left: `${trigger.x * TILE_SIZE}px`,
                  top: `${trigger.y * TILE_SIZE}px`,
                }}
                title={`Battle Zone at (${trigger.x}, ${trigger.y})`}
              />
            ))}

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
          <div>Space: Interact</div>
          <div>ESC: Menu</div>
          <div style={{ marginTop: '10px', color: '#ffff00', fontWeight: 'bold' }}>
            Position: ({playerPosition.x}, {playerPosition.y})
          </div>
        </div>
      </div>

      {/* Dialogue Box */}
      {dialogue && (
        <div className="dialogue-overlay">
          <div className="dialogue-box">
            <div className="dialogue-speaker">{dialogue.speaker}</div>
            <div className="dialogue-text">{dialogue.text}</div>
            <div className="dialogue-prompt">Press Space or Enter to close</div>
          </div>
        </div>
      )}
    </div>
  );
};
