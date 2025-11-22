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
        backgroundColor: '#1a1a1a',
        border: '2px solid #444',
        borderRadius: '0',
        padding: '1rem',
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '10px',
        ...style,
      }}
      role="region"
      aria-label="Action queue"
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: '1rem',
          fontSize: '8px',
          color: '#FFD87F',
          textAlign: 'center',
          textShadow: '1px 1px 0 #000',
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
                  backgroundColor: action ? 'rgba(76, 175, 80, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                  border: `2px solid ${action ? '#4CAF50' : '#444'}`,
                  borderRightColor: action ? '#66bb6a' : '#666',
                  borderBottomColor: action ? '#66bb6a' : '#666',
                borderRadius: '0',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'normal', color: '#fff', fontSize: '8px', textShadow: '1px 1px 0 #000' }}>
                  {index + 1}. {unit.name.toUpperCase()}:
                </div>
                {action ? (
                  <div style={{ fontSize: '8px', color: '#a0a0a0', marginTop: '0.25rem', textShadow: '1px 1px 0 #000' }}>
                    {ability ? ability.name.toUpperCase() : 'ATTACK'} [{action.manaCost}○]
                    {action.targetIds.length > 0 && (
                      <span style={{ color: '#888' }}>
                        {' → '}
                        {action.targetIds.length === 1
                          ? `TARGET ${action.targetIds[0]?.slice(0, 8).toUpperCase() || 'UNKNOWN'}`
                          : `${action.targetIds.length} TARGETS`}
                      </span>
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: '8px', color: '#666', fontStyle: 'normal' }}>
                    [EMPTY]
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
                    border: '2px solid #e57373',
                    borderRightColor: '#b71c1c',
                    borderBottomColor: '#b71c1c',
                    borderRadius: '0',
                    cursor: 'pointer',
                    fontSize: '8px',
                    fontFamily: "'Press Start 2P', monospace",
                    textShadow: '1px 1px 0 #000',
                  }}
                  aria-label={`Clear action for ${unit.name}`}
                >
                  CLEAR
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

