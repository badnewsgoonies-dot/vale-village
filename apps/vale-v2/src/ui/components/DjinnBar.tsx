/**
 * Djinn Bar Component
 * PR-DJINN-CORE: Displays team Djinn and allows activation during planning
 */

import React from 'react';
import type { Team } from '../../core/models/Team';
import { canActivateDjinn } from '../../core/algorithms/djinn';

interface DjinnBarProps {
  team: Team;
  queuedDjinn: readonly string[];
  onDjinnClick: (djinnId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function DjinnBar({ team, queuedDjinn, onDjinnClick, className, style }: DjinnBarProps) {
  if (team.equippedDjinn.length === 0) {
    return (
      <div
        className={`djinn-bar ${className || ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem',
          color: '#888',
          ...style,
        }}
      >
        <span>DJINN:</span>
        <span>None equipped</span>
      </div>
    );
  }

  return (
    <div
      className={`djinn-bar ${className || ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.9rem',
        ...style,
      }}
      role="toolbar"
      aria-label="Djinn activation"
    >
      <span style={{ fontWeight: 'bold', color: '#FFD700' }}>DJINN:</span>
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        {team.equippedDjinn.map((djinnId) => {
          const tracker = team.djinnTrackers[djinnId];
          const state = tracker?.state || 'Set';
          const canActivate = canActivateDjinn(team, djinnId);
          const isQueued = queuedDjinn.includes(djinnId);

          let stateColor = '#4CAF50'; // Set (green)
          let stateText = 'Set';
          if (state === 'Standby') {
            stateColor = '#FF9800'; // Standby (orange)
            stateText = `CD:${tracker?.lastActivatedTurn ? '1' : '?'}`;
          } else if (state === 'Recovery') {
            stateColor = '#2196F3'; // Recovery (blue)
            stateText = 'Recovery';
          }

          return (
            <button
              key={djinnId}
              onClick={() => onDjinnClick(djinnId)}
              disabled={!canActivate && !isQueued}
              style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: isQueued ? '#4CAF50' : stateColor,
                color: '#fff',
                border: isQueued ? '2px solid #FFD700' : '1px solid #333',
                borderRadius: '4px',
                cursor: canActivate || isQueued ? 'pointer' : 'not-allowed',
                opacity: canActivate || isQueued ? 1 : 0.5,
                fontSize: '0.85rem',
                fontWeight: isQueued ? 'bold' : 'normal',
              }}
              title={
                isQueued
                  ? 'Click to unqueue'
                  : canActivate
                  ? 'Click to activate'
                  : `${stateText} - Cannot activate`
              }
              aria-label={`Djinn ${djinnId}, ${stateText}${isQueued ? ', queued' : ''}`}
            >
              {djinnId} [{stateText}]
            </button>
          );
        })}
      </div>
    </div>
  );
}

