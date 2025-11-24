import { describe, test, expect } from 'vitest';
import { MAPS } from '@/data/definitions/maps';
import { canMoveTo, processMovement } from '@/core/services/OverworldService';

describe('OverworldService', () => {
  const map = MAPS['vale-village'];

  test('allows movement on walkable tiles', () => {
    const start = { x: 15, y: 2 };
    const result = processMovement(map, start, 'up');
    expect(result.blocked).toBe(false);
    expect(result.newPos.y).toBe(start.y - 1);
  });

  test('blocks movement into walls', () => {
    const wallPos = { x: 5, y: 3 };
    const result = processMovement(map, { x: 5, y: 4 }, 'up');
    expect(result.blocked).toBe(true);
    expect(result.newPos).toEqual({ x: 5, y: 4 });
  });

  test('returns battle trigger when stepping on battle tile', () => {
    const source = { x: 5, y: 2 };
    const result = processMovement(map, source, 'right');
    expect(result.blocked).toBe(false);
    expect(result.trigger).toBeDefined();
    expect(result.trigger?.type).toBe('battle');
  });

  test('prevents movement where NPCs stand', () => {
    const npc = map.npcs[0];
    expect(canMoveTo(map, npc.position)).toBe(false);
  });

  test('blocks movement outside map bounds', () => {
    const start = { x: 0, y: 0 };
    const result = processMovement(map, start, 'up');
    expect(result.blocked).toBe(true);
  });
});
