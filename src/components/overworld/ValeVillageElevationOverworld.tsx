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

  // Smooth movement state
  const velocityRef = React.useRef<Position>({ x: 0, y: 0 });
  const lastFrameTimeRef = React.useRef<number>(performance.now());
  const keysRef = React.useRef(new Set<string>());
  const [cameraPos, setCameraPos] = useState<Position>({ x: 0, y: 0 });

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
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', 'shift', 'escape', ' ', 'enter', 'e'].includes(key)) {
        e.preventDefault();
      }

      // Interaction / Transition
      if ((e.key === ' ' || e.key === 'Enter' || key === 'e') && nearTransition) {
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

      keysRef.current.add(key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (e.key === 'Shift') {
        setIsRunning(false);
      }
      keysRef.current.delete(key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleTransition, nearTransition, actions]);

  // Smooth movement loop with requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;

    const WALK_SPEED = 140; // pixels per second
    const RUN_SPEED = 240;   // pixels per second
    const ACCELERATION = 800; // pixels per second squared
    const DECELERATION = 1200; // pixels per second squared

    const gameLoop = () => {
      const currentTime = performance.now();
      const deltaTime = Math.min((currentTime - lastFrameTimeRef.current) / 1000, 0.1); // Cap at 100ms
      lastFrameTimeRef.current = currentTime;

      const keys = keysRef.current;
      const targetSpeed = isRunning ? RUN_SPEED : WALK_SPEED;

      // Calculate input direction
      let inputX = 0;
      let inputY = 0;

      const up = keys.has('w') || keys.has('arrowup');
      const down = keys.has('s') || keys.has('arrowdown');
      const left = keys.has('a') || keys.has('arrowleft');
      const right = keys.has('d') || keys.has('arrowright');

      if (up) inputY -= 1;
      if (down) inputY += 1;
      if (left) inputX -= 1;
      if (right) inputX += 1;

      // Normalize diagonal movement (prevent faster diagonal speed)
      const inputMagnitude = Math.sqrt(inputX * inputX + inputY * inputY);
      if (inputMagnitude > 0) {
        inputX /= inputMagnitude;
        inputY /= inputMagnitude;
      }

      // Update player direction based on last input
      if (inputY < 0) setPlayerDirection('up');
      else if (inputY > 0) setPlayerDirection('down');
      else if (inputX < 0) setPlayerDirection('left');
      else if (inputX > 0) setPlayerDirection('right');

      // Calculate target velocity
      const targetVelX = inputX * targetSpeed;
      const targetVelY = inputY * targetSpeed;

      // Apply acceleration/deceleration
      const accel = inputMagnitude > 0 ? ACCELERATION : DECELERATION;

      const velDiffX = targetVelX - velocityRef.current.x;
      const velDiffY = targetVelY - velocityRef.current.y;
      const velDiffMag = Math.sqrt(velDiffX * velDiffX + velDiffY * velDiffY);

      if (velDiffMag > 0) {
        const maxChange = accel * deltaTime;
        const change = Math.min(maxChange, velDiffMag);
        const changeRatio = change / velDiffMag;

        velocityRef.current.x += velDiffX * changeRatio;
        velocityRef.current.y += velDiffY * changeRatio;
      }

      // Apply velocity to position
      const moving = Math.abs(velocityRef.current.x) > 1 || Math.abs(velocityRef.current.y) > 1;
      setIsMoving(moving);

      if (moving) {
        const newX = playerPos.x + velocityRef.current.x * deltaTime;
        const newY = playerPos.y + velocityRef.current.y * deltaTime;

        // Check collision
        if (canMoveTo(newX, newY)) {
          setPlayerPos({ x: newX, y: newY });
        } else {
          // Try sliding along walls
          if (canMoveTo(newX, playerPos.y)) {
            setPlayerPos(prev => ({ ...prev, x: newX }));
            velocityRef.current.y = 0;
          } else if (canMoveTo(playerPos.x, newY)) {
            setPlayerPos(prev => ({ ...prev, y: newY }));
            velocityRef.current.x = 0;
          } else {
            // Full stop
            velocityRef.current.x = 0;
            velocityRef.current.y = 0;
          }
        }
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [playerPos, isRunning, canMoveTo]);

  // Check for transitions
  useEffect(() => {
    checkTransitions();
  }, [checkTransitions]);

  // Smooth camera following
  useEffect(() => {
    let animationFrameId: number;

    const smoothCamera = () => {
      // Target camera position (centered on player)
      let targetX = playerPos.x - VIEWPORT_WIDTH / 2;
      let targetY = playerPos.y - VIEWPORT_HEIGHT / 2;

      // Clamp to world bounds
      targetX = Math.max(0, Math.min(WORLD_WIDTH - VIEWPORT_WIDTH, targetX));
      targetY = Math.max(0, Math.min(WORLD_HEIGHT - VIEWPORT_HEIGHT, targetY));

      // Smooth easing (lerp with factor 0.15 for smooth follow)
      const CAMERA_SMOOTHING = 0.15;
      const newX = cameraPos.x + (targetX - cameraPos.x) * CAMERA_SMOOTHING;
      const newY = cameraPos.y + (targetY - cameraPos.y) * CAMERA_SMOOTHING;

      // Only update if there's meaningful change (avoid jitter)
      if (Math.abs(newX - cameraPos.x) > 0.01 || Math.abs(newY - cameraPos.y) > 0.01) {
        setCameraPos({ x: newX, y: newY });
      }

      animationFrameId = requestAnimationFrame(smoothCamera);
    };

    animationFrameId = requestAnimationFrame(smoothCamera);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [playerPos, cameraPos]);

  // Camera offset for rendering
  const cameraOffset = useMemo(() => {
    return { x: -cameraPos.x, y: -cameraPos.y };
  }, [cameraPos]);

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
