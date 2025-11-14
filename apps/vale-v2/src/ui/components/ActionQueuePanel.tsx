/**
 * Action Queue Panel Component
 * PR-QUEUE-BATTLE: Displays all 4 queued actions
 */

import * as React from 'react';
import type { BattleState } from '../../core/models/BattleState';
import { ABILITIES } from '../../data/definitions/abilities';
import { DJINN_ABILITIES } from '../../data/definitions/djinnAbilities';

interface ActionQueuePanelProps {
  battle: BattleState;
  onClearAction: (unitIndex: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function ActionQueuePanel({ battle, onClearAction, className, style }: ActionQueuePanelProps) {
  const { queuedActions, playerTeam } = battle;

  return (
    <div
      className={`action-queue-panel ${className || ''}`}
      style={{
        backgroundColor: '#1a2a4a',
        border: '2px solid #4a6a8a',
        borderRadius: '4px',
        padding: '1rem',
        ...style,
      }}
      role="region"
      aria-label="Action queue"
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: '1rem',
          fontSize: '1rem',
          color: '#FFD87F',
          textAlign: 'center',
        }}
      >
        ACTION QUEUE
      </h3>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        {queuedActions.map((action, index) => {
          const unit = playerTeam.units[index];
          if (!unit) return null;

          // Phase 3: Lookup ability from both ABILITIES and DJINN_ABILITIES
          const ability = action?.abilityId
            ? ABILITIES[action.abilityId] ?? DJINN_ABILITIES[action.abilityId] ?? null
            : null;

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem',
                backgroundColor: action ? 'rgba(74, 122, 184, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                border: `1px solid ${action ? '#6a8aab' : '#444'}`,
                borderRadius: '4px',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', color: '#e0e0e0' }}>
                  {index + 1}. {unit.name}:
                </div>
                {action ? (
                  <div style={{ fontSize: '0.85rem', color: '#a0a0a0', marginTop: '0.25rem' }}>
                    {ability ? ability.name : 'Attack'} [{action.manaCost}○]
                    {action.targetIds.length > 0 && (
                      <span style={{ color: '#888' }}>
                        {' → '}
                        {action.targetIds.length === 1
                          ? `Target ${action.targetIds[0]?.slice(0, 8) || 'unknown'}`
                          : `${action.targetIds.length} targets`}
                      </span>
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                    No action queued
                  </div>
                )}
              </div>
              {action && (
                <button
                  onClick={() => onClearAction(index)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#d32f2f',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                  }}
                  aria-label={`Clear action for ${unit.name}`}
                >
                  Clear
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

