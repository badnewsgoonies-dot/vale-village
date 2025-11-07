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
  const [nearBuilding, setNearBuilding] = useState<ElevationEntity | null>(null);

  // Demo mode state
  const [demoMode, setDemoMode] = useState(false);
  const [demoAnnouncement, setDemoAnnouncement] = useState<string | null>(null);
  const demoWaypointIndexRef = React.useRef(0);
  const demoWaitTimerRef = React.useRef(0);
  const demoTargetRef = React.useRef<Position | null>(null);

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

  // Check for nearby interactive buildings
  const checkBuildingProximity = useCallback(() => {
    const interactiveBuildings = visibleEntities.filter(
      entity => entity.type === 'building' && entity.onInteract
    );

    for (const building of interactiveBuildings) {
      const dx = Math.abs(playerPos.x - building.x);
      const dy = Math.abs(playerPos.y - building.y);
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Interaction range for buildings (slightly larger than collision box)
      if (distance < 60) {
        setNearBuilding(building);
        return;
      }
    }
    setNearBuilding(null);
  }, [playerPos, visibleEntities]);

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

  // Demo mode waypoints and actions
  const demoSequence = useMemo(() => [
    // Start in Main Village
    { action: 'announce', text: 'Vale Village - Multi-Level Overworld System', duration: 3 },
    { action: 'walk', target: { x: 350, y: 400 }, elevation: ElevationLevel.MAIN },

    // Show building interaction
    { action: 'announce', text: 'Building Entry System', duration: 2 },
    { action: 'walk', target: { x: 750, y: 550 }, elevation: ElevationLevel.MAIN }, // Equipment Shop
    { action: 'wait', duration: 1 },

    // Show elevation transition
    { action: 'announce', text: 'Elevation Transitions - Going Up', duration: 2 },
    { action: 'walk', target: { x: 500, y: 280 }, elevation: ElevationLevel.MAIN }, // Stairs
    { action: 'transition', toLevel: ElevationLevel.UPPER },
    { action: 'walk', target: { x: 700, y: 120 }, elevation: ElevationLevel.UPPER }, // Sol Sanctum
    { action: 'wait', duration: 1.5 },

    // Explore upper level
    { action: 'announce', text: 'Upper Level - Sacred Heights', duration: 2 },
    { action: 'walk', target: { x: 450, y: 220 }, elevation: ElevationLevel.UPPER }, // Elder's House

    // Go back down
    { action: 'announce', text: 'Returning to Main Village', duration: 2 },
    { action: 'walk', target: { x: 500, y: 280 }, elevation: ElevationLevel.UPPER },
    { action: 'transition', toLevel: ElevationLevel.MAIN },

    // Show menus
    { action: 'announce', text: 'Menu System - Abilities Screen', duration: 2 },
    { action: 'menu', screen: { type: 'ABILITIES' }, duration: 3 },

    { action: 'announce', text: 'Menu System - Summons Screen', duration: 2 },
    { action: 'menu', screen: { type: 'SUMMONS' }, duration: 3 },

    { action: 'announce', text: 'Menu System - Equipment Screen', duration: 2 },
    { action: 'menu', screen: { type: 'EQUIPMENT' }, duration: 3 },

    { action: 'announce', text: 'Menu System - Party Management', duration: 2 },
    { action: 'menu', screen: { type: 'PARTY_MANAGEMENT' }, duration: 3 },

    { action: 'announce', text: 'Menu System - Djinn Menu', duration: 2 },
    { action: 'menu', screen: { type: 'DJINN_MENU' }, duration: 3 },

    // Final showcase
    { action: 'announce', text: 'Smooth 60 FPS Movement System', duration: 2 },
    { action: 'walk', target: { x: 800, y: 600 }, elevation: ElevationLevel.MAIN, run: true },
    { action: 'walk', target: { x: 400, y: 700 }, elevation: ElevationLevel.MAIN, run: true },

    { action: 'announce', text: 'Demo Complete - Looping...', duration: 2 },
  ], []);

  // Handle building interaction
  const handleBuildingInteraction = useCallback(() => {
    if (!nearBuilding) return;

    // Handle different building types
    switch (nearBuilding.id) {
      case 'equipment-shop':
        actions.navigate({ type: 'SHOP', shopType: 'equipment' });
        break;

      case 'sol-sanctum':
        // TODO: Navigate to Sol Sanctum dungeon when implemented
        console.log('Sol Sanctum dungeon coming soon!');
        break;

      case 'elders-house':
      case 'isaacs-house':
      case 'garets-house':
      case 'training-grounds':
      case 'vale-house-1':
      case 'vale-house-2':
      case 'vale-house-3':
      case 'vale-house-4':
        // For now, show a simple message (TODO: Create interior screens)
        console.log(`Entering ${nearBuilding.label}...`);
        // Future: actions.navigate({ type: 'INTERIOR', buildingId: nearBuilding.id });
        break;

      default:
        // Fallback to onInteract if defined
        if (nearBuilding.onInteract) {
          nearBuilding.onInteract();
        }
    }
  }, [nearBuilding, actions]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', 'shift', 'escape', ' ', 'enter', 'e', 'j', 'p'].includes(key)) {
        e.preventDefault();
      }

      // Interaction / Transition (SPACE or ENTER only)
      if (e.key === ' ' || e.key === 'Enter') {
        if (nearTransition) {
          handleTransition();
          return;
        }
        if (nearBuilding) {
          handleBuildingInteraction();
          return;
        }
      }

      // Demo mode toggle
      if (key === 'd') {
        setDemoMode(prev => !prev);
        if (!demoMode) {
          demoWaypointIndexRef.current = 0;
          demoWaitTimerRef.current = 0;
          setDemoAnnouncement('Demo Mode Activated');
          setTimeout(() => setDemoAnnouncement(null), 2000);
        } else {
          setDemoAnnouncement(null);
        }
        return;
      }

      // Skip demo mode controls if in demo mode
      if (demoMode) return;

      // Menu shortcuts
      if (e.key === 'Escape') {
        actions.navigate({ type: 'MAIN_MENU' });
        return;
      }

      if (key === 'j') {
        actions.navigate({ type: 'DJINN_MENU' });
        return;
      }

      if (key === 'p') {
        actions.navigate({ type: 'PARTY_MANAGEMENT' });
        return;
      }

      if (key === 'e') {
        actions.navigate({ type: 'EQUIPMENT' });
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
  }, [handleTransition, handleBuildingInteraction, nearTransition, nearBuilding, actions]);

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

  // Demo mode execution loop
  useEffect(() => {
    if (!demoMode) {
      demoTargetRef.current = null;
      return;
    }

    const interval = setInterval(() => {
      const currentStep = demoSequence[demoWaypointIndexRef.current];
      if (!currentStep) {
        // Loop back to start
        demoWaypointIndexRef.current = 0;
        return;
      }

      // Handle different action types
      switch (currentStep.action) {
        case 'announce':
          setDemoAnnouncement(currentStep.text);
          demoWaitTimerRef.current = currentStep.duration * 1000;
          demoWaypointIndexRef.current++;
          break;

        case 'walk':
          if (demoWaitTimerRef.current > 0) {
            demoWaitTimerRef.current -= 100;
            return;
          }

          const target = currentStep.target;
          const dx = target.x - playerPos.x;
          const dy = target.y - playerPos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 20) {
            // Reached waypoint
            demoWaypointIndexRef.current++;
            demoTargetRef.current = null;
            setIsRunning(false);
          } else {
            // Move towards target
            demoTargetRef.current = target;
            setIsRunning(currentStep.run || false);

            // Simulate key presses
            keysRef.current.clear();
            if (Math.abs(dx) > 10) {
              keysRef.current.add(dx > 0 ? 'd' : 'a');
            }
            if (Math.abs(dy) > 10) {
              keysRef.current.add(dy > 0 ? 's' : 'w');
            }
          }
          break;

        case 'wait':
          if (demoWaitTimerRef.current === 0) {
            demoWaitTimerRef.current = currentStep.duration * 1000;
          }
          if (demoWaitTimerRef.current > 0) {
            demoWaitTimerRef.current -= 100;
            if (demoWaitTimerRef.current <= 0) {
              demoWaypointIndexRef.current++;
            }
          }
          break;

        case 'transition':
          if (nearTransition) {
            handleTransition();
            demoWaypointIndexRef.current++;
            demoWaitTimerRef.current = 500; // Small delay after transition
          }
          break;

        case 'menu':
          if (demoWaitTimerRef.current === 0) {
            actions.navigate(currentStep.screen);
            demoWaitTimerRef.current = currentStep.duration * 1000;
          } else if (demoWaitTimerRef.current > 0) {
            demoWaitTimerRef.current -= 100;
            if (demoWaitTimerRef.current <= 0) {
              actions.navigate({ type: 'OVERWORLD' });
              demoWaypointIndexRef.current++;
              demoWaitTimerRef.current = 500; // Small delay after menu
            }
          }
          break;
      }

      // Clear announcement after duration
      if (demoAnnouncement && currentStep.action === 'announce' && demoWaitTimerRef.current <= 0) {
        setDemoAnnouncement(null);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [demoMode, demoSequence, playerPos, nearTransition, demoAnnouncement, handleTransition, actions]);

  // Check for transitions
  useEffect(() => {
    checkTransitions();
  }, [checkTransitions]);

  // Check for nearby buildings
  useEffect(() => {
    checkBuildingProximity();
  }, [checkBuildingProximity]);

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
            Press [SPACE] or [ENTER] to use {nearTransition.type}
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

      {/* Building interaction prompt */}
      {!nearTransition && nearBuilding && (
        <div className="transition-prompt">
          <div className="prompt-text">
            Press [SPACE] or [ENTER] to enter
          </div>
          <div className="prompt-destination">
            → {nearBuilding.label || 'Building'}
          </div>
        </div>
      )}

      {/* Demo Mode Announcement */}
      {demoAnnouncement && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.95)',
          border: '4px solid #FFD700',
          borderRadius: '12px',
          padding: '32px 48px',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#FFD700',
          textAlign: 'center',
          zIndex: 10000,
          boxShadow: '0 8px 32px rgba(255, 215, 0, 0.5)',
          animation: 'fadeInOut 0.5s ease-in-out',
          fontFamily: 'monospace',
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}>
          {demoAnnouncement}
        </div>
      )}

      {/* Demo Mode Indicator */}
      {demoMode && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 0, 0, 0.9)',
          border: '2px solid #FF0000',
          borderRadius: '20px',
          padding: '8px 24px',
          fontSize: '14px',
          fontWeight: 'bold',
          color: 'white',
          zIndex: 9999,
          animation: 'pulse 2s infinite',
          fontFamily: 'monospace'
        }}>
          🎮 DEMO MODE ACTIVE • Press D to Exit
        </div>
      )}

      {/* Controls */}
      <div className="vale-controls">
        <div><span className="key">WASD</span> / <span className="key">↑↓←→</span> Move</div>
        <div><span className="key">SHIFT</span> Run</div>
        <div><span className="key">SPACE/ENTER</span> Interact</div>
        <div><span className="key">J</span> Djinn | <span className="key">P</span> Party | <span className="key">E</span> Equipment</div>
        <div><span className="key">D</span> Demo Mode</div>
        <div><span className="key">ESC</span> Menu</div>
      </div>
    </div>
  );
};
