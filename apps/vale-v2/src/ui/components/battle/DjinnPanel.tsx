/**
 * Djinn Panel Component
 *
 * Displays Djinn available for activation/summon.
 * Shows current state (SET/STANDBY/RECOVERY) and recovery timers.
 */

import React from 'react';
import type { DjinnPanelProps } from './types';

export function DjinnPanel({ djinns, onSelectDjinn }: DjinnPanelProps): JSX.Element {
  return (
    <div className="djinn-popup">
      <div className="djinn-popup-title">Djinn – Activation</div>
      <div className="djinn-list">
        {djinns.map((djinn) => {
          const classes = [
            'djinn-entry',
            !djinn.isSelectable ? 'djinn-entry--disabled' : '',
          ].filter(Boolean).join(' ');

          const stateLabel =
            djinn.state === 'set' ? '[SET]' :
            djinn.state === 'standby' ? `[STANDBY – ${djinn.turnsRemaining} turns]` :
            `[RECOVERY – ${djinn.turnsRemaining} turns]`;

          const stateClass =
            djinn.state === 'set' ? 'djinn-state--set' :
            djinn.state === 'standby' ? 'djinn-state--standby' :
            'djinn-state--recovery';

          return (
            <div
              key={djinn.id}
              className={classes}
              onClick={() => djinn.isSelectable && onSelectDjinn(djinn.id)}
            >
              <div className="djinn-entry-header">
                <span className="djinn-name">{djinn.name}</span>
                <span className={stateClass}>{stateLabel}</span>
              </div>
              <div className="djinn-effect">{djinn.summonDescription}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
