/**
 * Queue Panel Component
 *
 * Displays the action queue, mana status, and execute button.
 * Central command hub for queue-based battle planning.
 */

import React from 'react';
import type { QueuePanelProps } from './types';

export function QueuePanel({
  roundNumber,
  queueSlots,
  mana,
  canExecute,
  targetingMode,
  onSelectSlot,
  onClearSlot,
  onPrevUnit,
  onNextUnit,
  onExecuteRound,
}: QueuePanelProps): JSX.Element {
  return (
    <div className="queue-mana-panel">
      {/* Header with navigation */}
      <div className="queue-header">
        <span>Action Queue – Round {roundNumber}</span>
        <div className="queue-nav">
          <button className="queue-nav-button" onClick={onPrevUnit}>
            [Q] Prev Unit
          </button>
          <button className="queue-nav-button" onClick={onNextUnit}>
            [E] Next Unit
          </button>
        </div>
      </div>

      {/* Action Queue Slots */}
      <div className="action-queue">
        {queueSlots.map((slot) => {
          const classes = [
            'action-slot',
            slot.isEmpty ? 'action-slot--empty' : 'action-slot--filled',
            slot.isCurrent ? 'action-slot--current' : '',
            slot.isKo ? 'action-slot--ko' : '',
          ].filter(Boolean).join(' ');

          return (
            <div
              key={slot.unitId}
              className={classes}
              onClick={() => onSelectSlot(slot.unitId)}
            >
              <div className="action-slot__unit">{slot.unitName}</div>
              <div className="action-slot__summary">{slot.summary}</div>
              {!slot.isEmpty && !slot.isKo && (
                <div className="action-slot__meta">
                  <span>{slot.manaCost} mana</span>
                  <span
                    className="action-slot__clear"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearSlot(slot.unitId);
                    }}
                  >
                    × Clear
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mana Display */}
      <div className="mana-row">
        <div className="mana-orbs">
          {Array.from({ length: mana.max }, (_, i) => (
            <div
              key={i}
              className={`mana-orb ${i < mana.current ? 'mana-orb--filled' : ''}`}
            />
          ))}
        </div>
        <div className={`mana-display ${mana.overBudget ? 'mana-display--over-budget' : ''}`}>
          Mana: {mana.current} / {mana.max}
        </div>
      </div>

      {/* Targeting Mode Banner */}
      {targetingMode && (
        <div className="execute-row">
          <span className="target-mode-banner">
            Select Target: Use arrow keys or click on a unit
          </span>
        </div>
      )}

      {/* Execute Button */}
      <div className="execute-row">
        <button
          className={`execute-button ${!canExecute ? 'execute-button--disabled' : ''}`}
          onClick={onExecuteRound}
          disabled={!canExecute}
        >
          Execute Round
        </button>
      </div>
    </div>
  );
}
