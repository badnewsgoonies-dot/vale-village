import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/context/GameContext';
import { getAreaById } from '@/data/areas';
import {
  isInExitZone,
  isNPCAtPosition,
  isTreasureAtPosition,
  isBossAtPosition,
  getRandomEnemyGroup,
  type NPC,
} from '@/types/Area';
import './NewOverworldScreen.css';

export const NewOverworldScreen: React.FC = () => {
  const { state, actions } = useGame();
  const [showDialogue, setShowDialogue] = useState<string | null>(null);
  const [currentNPC, setCurrentNPC] = useState<NPC | null>(null);

  const area = getAreaById(state.currentLocation);
  const areaState = state.areaStates[state.currentLocation];
  const playerPos = state.playerPosition;

  if (!area || !areaState) {
    return <div>Error: Area not found</div>;
  }

  // Handle movement
  const handleMove = useCallback(
    (dx: number, dy: number) => {
      const newX = playerPos.x + dx;
      const newY = playerPos.y + dy;

      // Check bounds
      if (newX < 0 || newX >= area.width || newY < 0 || newY >= area.height) {
        return;
      }

      // Check NPC collision
      const blockingNPC = area.npcs.find(
        (npc) => npc.blocking && npc.position.x === newX && npc.position.y === newY
      );
      if (blockingNPC) {
        return;
      }

      // Move player
      actions.movePlayer(dx, dy);

      // Check for exits
      const exit = area.exits.find((e) => isInExitZone({ x: newX, y: newY }, e));
      if (exit) {
        // Check if exit requires a story flag
        if (exit.requiredFlag && !state.storyFlags[exit.requiredFlag as keyof typeof state.storyFlags]) {
          setShowDialogue('This path is blocked. You must complete other tasks first.');
          return;
        }
        actions.changeArea(exit.targetArea, exit.targetPosition);
        return;
      }

      // Check for boss encounter
      const boss = area.bosses.find(
        (b) => !areaState.defeatedBosses.has(b.id) && isBossAtPosition({ x: newX, y: newY }, b)
      );
      if (boss) {
        if (boss.dialogue?.before) {
          setShowDialogue(boss.dialogue.before);
          setTimeout(() => {
            setShowDialogue(null);
            actions.startBattle(boss.enemyIds);
          }, 3000);
        } else {
          actions.startBattle(boss.enemyIds);
        }
        return;
      }

      // Random encounters in dungeons
      if (area.hasRandomEncounters && area.encounterRate && area.enemyPools) {
        actions.incrementStepCounter();
        const newStepCount = areaState.stepCounter + 1;

        if (newStepCount >= area.encounterRate && Math.random() < 0.3) {
          const enemyGroup = getRandomEnemyGroup(area.enemyPools);
          actions.startBattle(enemyGroup);
          // Reset step counter (will be done in game provider)
          // actions.resetStepCounter(); // TODO: Add this action if needed
        }
      }
    },
    [playerPos, area, areaState, actions, state.storyFlags]
  );

  // Handle interaction (Space key)
  const handleInteract = useCallback(() => {
    // Check for NPC in front of player (adjacent positions)
    const adjacentPositions = [
      { x: playerPos.x, y: playerPos.y - 1 }, // Up
      { x: playerPos.x, y: playerPos.y + 1 }, // Down
      { x: playerPos.x - 1, y: playerPos.y }, // Left
      { x: playerPos.x + 1, y: playerPos.y }, // Right
    ];

    for (const pos of adjacentPositions) {
      const npc = area.npcs.find((n) => isNPCAtPosition(pos, n));
      if (npc) {
        // Get dynamic dialogue based on story flags
        let dialogue = '';
        if (typeof npc.dialogue === 'string') {
          dialogue = npc.dialogue;
        } else {
          // Check for specific story flag dialogue
          const flagKeys = Object.keys(state.storyFlags);
          for (const key of flagKeys) {
            if (state.storyFlags[key as keyof typeof state.storyFlags] && npc.dialogue[key]) {
              dialogue = npc.dialogue[key];
              break;
            }
          }
          if (!dialogue) {
            dialogue = npc.dialogue.default || 'Hello!';
          }
        }

        setCurrentNPC(npc);
        setShowDialogue(dialogue);
        return;
      }
    }

    // Check for treasure chest at player position
    const treasure = area.treasures.find(
      (t) => !areaState.openedChests.has(t.id) && isTreasureAtPosition(playerPos, t)
    );
    if (treasure) {
      let message = 'You found: ';
      const rewards: string[] = [];

      if (treasure.contents.gold) {
        rewards.push(`${treasure.contents.gold} Gold`);
        // Add gold to player (needs action)
        // actions.addGold(treasure.contents.gold);
      }
      if (treasure.contents.items) {
        rewards.push(...treasure.contents.items.map((i) => i.name));
      }
      if (treasure.contents.equipment) {
        rewards.push(...treasure.contents.equipment.map((e) => e.name));
      }

      setShowDialogue(message + rewards.join(', '));
      actions.openTreasureChest(treasure.id);
      return;
    }
  }, [playerPos, area, areaState, actions, state.storyFlags]);

  // Close dialogue and handle NPC shops
  const closeDialogue = useCallback(() => {
    if (currentNPC?.shopType) {
      actions.navigate({ type: 'SHOP', shopType: currentNPC.shopType });
    }
    setShowDialogue(null);
    setCurrentNPC(null);
  }, [currentNPC, actions]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          handleMove(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          handleMove(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          handleMove(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          handleMove(1, 0);
          break;
        case ' ':
        case 'Enter':
          if (showDialogue) {
            closeDialogue();
          } else {
            handleInteract();
          }
          break;
        case 'q':
        case 'Q':
          actions.navigate({ type: 'QUEST_LOG' });
          break;
        case 'Escape':
          if (showDialogue) {
            closeDialogue();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleMove, handleInteract, showDialogue, closeDialogue, actions]);

  return (
    <div
      className="overworld-screen"
      data-area={state.currentLocation}
      style={{ backgroundColor: area.backgroundColor || '#4a7c4e' }}
    >
      <div className="overworld-hud">
        <div className="area-name">{area.name}</div>
        <div className="player-gold">Gold: {state.playerData.gold} G</div>
      </div>

      <div className="map-container">
        <div
          className="map"
          style={{
            width: `${area.width * 32}px`,
            height: `${area.height * 32}px`,
          }}
        >
          {/* Render grid */}
          <div className="grid">
            {Array.from({ length: area.height }).map((_, y) =>
              Array.from({ length: area.width }).map((_, x) => (
                <div
                  key={`${x},${y}`}
                  className="tile"
                  style={{
                    left: `${x * 32}px`,
                    top: `${y * 32}px`,
                  }}
                />
              ))
            )}
          </div>

          {/* Render NPCs */}
          {area.npcs.map((npc) => (
            <div
              key={npc.id}
              className="npc"
              style={{
                left: `${npc.position.x * 32}px`,
                top: `${npc.position.y * 32}px`,
              }}
            >
              <img
                src={`/sprites/overworld/minornpcs/${npc.id}.gif`}
                alt={npc.name}
                className="npc-sprite"
                onError={(e) => {
                  // Fallback to text if sprite not found
                  e.currentTarget.style.display = 'none';
                  const textNode = e.currentTarget.nextSibling;
                  if (textNode) (textNode as HTMLElement).style.display = 'block';
                }}
              />
              <span className="npc-fallback" style={{ display: 'none' }}>
                {npc.name[0]}
              </span>
            </div>
          ))}

          {/* Render treasure chests */}
          {area.treasures
            .filter((t) => !areaState.openedChests.has(t.id))
            .map((treasure) => (
              <div
                key={treasure.id}
                className="treasure"
                style={{
                  left: `${treasure.position.x * 32}px`,
                  top: `${treasure.position.y * 32}px`,
                }}
              >
                <img
                  src="/sprites/scenery/chest.gif"
                  alt="Treasure Chest"
                  className="treasure-sprite"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const textNode = e.currentTarget.nextSibling;
                    if (textNode) (textNode as HTMLElement).style.display = 'block';
                  }}
                />
                <span className="treasure-fallback" style={{ display: 'none' }}>
                  💰
                </span>
              </div>
            ))}

          {/* Render exits */}
          {area.exits.map((exit) => (
            <div
              key={exit.id}
              className="exit"
              style={{
                left: `${exit.position.x * 32}px`,
                top: `${exit.position.y * 32}px`,
                width: `${exit.width * 32}px`,
                height: `${exit.height * 32}px`,
              }}
            />
          ))}

          {/* Render player */}
          <div
            className="player"
            style={{
              left: `${playerPos.x * 32}px`,
              top: `${playerPos.y * 32}px`,
            }}
          >
            <img
              src="/sprites/overworld/protagonists/Isaac.gif"
              alt="Player"
              className="player-sprite"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const textNode = e.currentTarget.nextSibling;
                if (textNode) (textNode as HTMLElement).style.display = 'block';
              }}
            />
            <span className="player-fallback" style={{ display: 'none' }}>
              @
            </span>
          </div>
        </div>
      </div>

      {/* Dialogue box */}
      {showDialogue && (
        <div className="dialogue-box">
          <div className="dialogue-content">
            {currentNPC && <div className="dialogue-speaker">{currentNPC.name}:</div>}
            <p>{showDialogue}</p>
          </div>
          <div className="dialogue-prompt">Press Space or Enter to continue...</div>
        </div>
      )}

      {/* Controls */}
      <div className="controls-hud">
        <p>WASD/Arrows: Move | Space: Interact | Q: Quest Log | ESC: Menu</p>
      </div>

      {/* Active quests mini-display */}
      <div className="active-quests">
        {state.quests
          .filter((q) => q.status === 'active')
          .slice(0, 2)
          .map((quest) => (
            <div key={quest.id} className="mini-quest">
              <strong>{quest.title}</strong>
              <div className="mini-objectives">
                {quest.objectives.slice(0, 2).map((obj) => (
                  <div key={obj.id} className={obj.completed ? 'completed' : ''}>
                    {obj.completed ? '☑' : '☐'} {obj.text}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
