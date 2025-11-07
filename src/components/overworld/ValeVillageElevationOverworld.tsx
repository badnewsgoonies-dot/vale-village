import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useGame } from '@/context/GameContext';
import {
  ElevationLevel,
  ELEVATION_CONFIGS,
  ElevationEntity,
  TransitionZone
} from '@/types/elevation';
import { VALE_ENTITIES, VALE_TRANSITIONS, CLIFF_EDGES } from '@/data/maps/valeVillageElevation';
import './ValeVillageOverworld.css';

interface Position {
  x: number;
  y: number;
}

const WORLD_WIDTH = 1200;
const WORLD_HEIGHT = 1500;
const VIEWPORT_WIDTH = 960;
const VIEWPORT_HEIGHT = 640;

export const ValeVillageElevationOverworld: React.FC = () => {
  const { state, actions } = useGame();

  // Player state
  const [playerPos, setPlayerPos] = useState<Position>({ x: 600, y: 600 });
  const [playerElevation, setPlayerElevation] = useState<ElevationLevel>(ElevationLevel.MAIN);
  const [playerDirection, setPlayerDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [isRunning, setIsRunning] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [nearTransition, setNearTransition] = useState<TransitionZone | null>(null);

  // Filter entities by current elevation
  const visibleEntities = useMemo(() => {
    return VALE_ENTITIES.filter(entity => entity.elevation === playerElevation);
  }, [playerElevation]);

  // Filter transitions available at current elevation
  const availableTransitions = useMemo(() => {
    return VALE_TRANSITIONS.filter(
      t => t.fromLevel === playerElevation || t.toLevel === playerElevation
    );
  }, [playerElevation]);

  // Check if position would cross a cliff edge
  const isCliffBlocked = useCallback((x: number, y: number): boolean => {
    for (const cliff of CLIFF_EDGES) {
      const crossingCliff = Math.abs(y - cliff.y) < 20;
      const withinXRange = x >= cliff.xStart && x <= cliff.xEnd;

      if (crossingCliff && withinXRange) {
        // Check if trying to cross from wrong side
        if (playerElevation === cliff.blocksFrom && y > cliff.y) return true;
        if (playerElevation === cliff.blocksTo && y < cliff.y) return true;
      }
    }
    return false;
  }, [playerElevation]);

  // Check if position is walkable
  const canMoveTo = useCallback((x: number, y: number): boolean => {
    // World bounds
    if (x < 50 || x > WORLD_WIDTH - 50 || y < 50 || y > WORLD_HEIGHT - 50) {
      return false;
    }

    // Cliff edges
    if (isCliffBlocked(x, y)) {
      return false;
    }

    // Entity collisions (only check entities at current elevation)
    return !visibleEntities.some(entity => {
      if (!entity.blocking) return false;

      const entityLeft = entity.x - 16;
      const entityRight = entity.x + 16;
      const entityTop = entity.y - 24;
      const entityBottom = entity.y + 24;

      return x >= entityLeft && x <= entityRight && y >= entityTop && y <= entityBottom;
    });
  }, [visibleEntities, isCliffBlocked]);

  // Check for nearby transitions
  const checkTransitions = useCallback(() => {
    for (const transition of availableTransitions) {
      const dx = Math.abs(playerPos.x - transition.x);
      const dy = Math.abs(playerPos.y - transition.y);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < transition.interactionRange) {
        setNearTransition(transition);
        return;
      }
    }
    setNearTransition(null);
  }, [playerPos, availableTransitions]);

  // Handle elevation transition
  const handleTransition = useCallback(() => {
    if (!nearTransition) return;

    // Determine which elevation to transition to
    const newElevation = nearTransition.fromLevel === playerElevation
      ? nearTransition.toLevel
      : nearTransition.fromLevel;

    setPlayerElevation(newElevation);

    // Adjust player position slightly to clear the transition
    const offsetY = newElevation > playerElevation ? 30 : -30;
    setPlayerPos(prev => ({ ...prev, y: prev.y + offsetY }));
  }, [nearTransition, playerElevation]);

  // Keyboard controls
  useEffect(() => {
    const keys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'Shift', 'Escape', ' ', 'Enter', 'e'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }

      // Interaction / Transition
      if ((e.key === ' ' || e.key === 'Enter' || e.key.toLowerCase() === 'e') && nearTransition) {
        handleTransition();
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
  }, [playerPos, isRunning, canMoveTo, handleTransition, nearTransition, actions]);

  // Check for transitions
  useEffect(() => {
    checkTransitions();
  }, [checkTransitions]);

  // Camera calculation
  const cameraOffset = useMemo(() => {
    let cameraX = playerPos.x - VIEWPORT_WIDTH / 2;
    let cameraY = playerPos.y - VIEWPORT_HEIGHT / 2;

    cameraX = Math.max(0, Math.min(WORLD_WIDTH - VIEWPORT_WIDTH, cameraX));
    cameraY = Math.max(0, Math.min(WORLD_HEIGHT - VIEWPORT_HEIGHT, cameraY));

    return { x: -cameraX, y: -cameraY };
  }, [playerPos]);

  // Get player sprite
  const getPlayerSprite = () => {
    const characterName = state.playerData.unitsCollected[0]?.name || 'Isaac';
    const action = isMoving ? (isRunning ? 'Run' : 'Walk') : '';

    const getDirection = () => {
      if (playerDirection === 'up') {
        return action ? 'Up' : 'Back';
      }
      if (playerDirection === 'down') {
        return '';
      }
      return playerDirection.charAt(0).toUpperCase() + playerDirection.slice(1);
    };

    const dirSuffix = getDirection();
    let path = characterName;
    if (action) path += `_${action}`;
    if (dirSuffix) path += `_${dirSuffix}`;

    return `/sprites/overworld/protagonists/${path}.gif`;
  };

  // Get elevation config
  const currentElevationConfig = ELEVATION_CONFIGS[playerElevation];

  // Calculate visual offset for current elevation
  const elevationOffset = currentElevationConfig.visualOffset;

  return (
    <div className="vale-village-container">
      {/* Viewport */}
      <div className="vale-viewport">
        {/* World */}
        <div
          className="vale-world"
          style={{
            transform: `translate(${cameraOffset.x}px, ${cameraOffset.y}px)`,
            width: `${WORLD_WIDTH}px`,
            height: `${WORLD_HEIGHT}px`,
          }}
        >
          {/* Terrain layer with elevation tint */}
          <div
            className="terrain-layer"
            style={{
              filter: currentElevationConfig.lightingTint,
            }}
          />

          {/* Cliff edges visualization */}
          {CLIFF_EDGES.map((cliff, idx) => (
            <div
              key={`cliff-${idx}`}
              style={{
                position: 'absolute',
                left: `${cliff.xStart}px`,
                top: `${cliff.y}px`,
                width: `${cliff.xEnd - cliff.xStart}px`,
                height: '4px',
                background: 'linear-gradient(90deg, rgba(80,60,40,0.3), rgba(100,80,60,0.5), rgba(80,60,40,0.3))',
                pointerEvents: 'none',
                zIndex: 5,
              }}
            />
          ))}

          {/* Transitions (stairs and ladders) */}
          {availableTransitions.map(transition => (
            <div
              key={transition.id}
              className="vale-entity interactive"
              style={{
                left: `${transition.x}px`,
                top: `${transition.y + elevationOffset}px`,
                zIndex: 10,
              }}
            >
              <img
                src={transition.sprite}
                alt={transition.type}
                style={{
                  filter: nearTransition?.id === transition.id
                    ? 'brightness(1.3) drop-shadow(0 0 10px yellow)'
                    : undefined
                }}
              />
            </div>
          ))}

          {/* Entities and player, sorted by Y for depth */}
          {[...visibleEntities, {
            id: 'player',
            x: playerPos.x,
            y: playerPos.y,
            elevation: playerElevation,
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
                  top: `${entity.y + elevationOffset}px`,
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
        <div className="location-name">
          VALE VILLAGE - {currentElevationConfig.name.toUpperCase()}
        </div>
        <div className="player-stats">
          <div>COINS: {state.playerData.gold}</div>
          <div>LV: {state.playerData.unitsCollected[0]?.level || 1}</div>
          <div>ELEV: L{playerElevation}</div>
        </div>
      </div>

      {/* Transition prompt */}
      {nearTransition && (
        <div className="transition-prompt">
          <div className="prompt-text">
            Press [SPACE] or [E] to use {nearTransition.type}
          </div>
          <div className="prompt-destination">
            → {ELEVATION_CONFIGS[
              nearTransition.fromLevel === playerElevation
                ? nearTransition.toLevel
                : nearTransition.fromLevel
            ].name}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="vale-controls">
        <div><span className="key">WASD</span> / <span className="key">↑↓←→</span> Move</div>
        <div><span className="key">SHIFT</span> Run</div>
        <div><span className="key">SPACE/E</span> Use Transition</div>
        <div><span className="key">ESC</span> Menu</div>
      </div>
    </div>
  );
};
