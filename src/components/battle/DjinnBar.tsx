import React from 'react';
import type { Djinn, DjinnState } from '@/types/Djinn';
import './DjinnBar.css';

interface DjinnBarProps {
  equippedDjinn: Djinn[];
  djinnStates: Map<string, DjinnState>;
  selectedDjinn: string[]; // IDs of Djinn selected for summon
  djinnRecoveryTimers?: Map<string, number>; // Turns until recovery for Standby Djinn
  onDjinnToggle: (djinnId: string) => void;
  disabled?: boolean;
}

export const DjinnBar: React.FC<DjinnBarProps> = ({
  equippedDjinn,
  djinnStates,
  selectedDjinn,
  djinnRecoveryTimers,
  onDjinnToggle,
  disabled = false,
}) => {
  return (
    <div className="djinn-bar">
      <span className="djinn-label">DJINN:</span>
      <div className="djinn-slots">
        {equippedDjinn.map(djinn => {
          const state = djinnStates.get(djinn.id) || 'Set';
          const isSelected = selectedDjinn.includes(djinn.id);
          const canActivate = state === 'Set' && !disabled;
          const recoveryTimer = djinnRecoveryTimers?.get(djinn.id);

          return (
            <button
              key={djinn.id}
              onClick={() => canActivate && onDjinnToggle(djinn.id)}
              className={`djinn-slot ${state.toLowerCase()} ${isSelected ? 'selected' : ''}`}
              disabled={!canActivate}
              title={`${djinn.name} (${state}${recoveryTimer ? ` - ${recoveryTimer} turns` : ''})`}
            >
              <span className="djinn-name">{djinn.name}</span>
              <span className="djinn-state">
                {state === 'Set' && '✓'}
                {state === 'Standby' && (recoveryTimer ? `${recoveryTimer}` : '○')}
              </span>
            </button>
          );
        })}
      </div>
      {selectedDjinn.length > 0 && (
        <span className="summon-indicator">
          {selectedDjinn.length === 1 && 'Individual'}
          {selectedDjinn.length === 2 && 'Medium Summon'}
          {selectedDjinn.length === 3 && 'MEGA SUMMON'}
        </span>
      )}
    </div>
  );
};
