/**
 * Command Panel Component
 *
 * Displays command buttons and the ability panel for the current unit.
 */

import React from 'react';
import { AbilityPanel } from './AbilityPanel';
import type { CommandPanelProps } from './types';

export function CommandPanel({
  currentUnit,
  selectedCommand,
  coreAbilities,
  djinnAbilities,
  onCommandSelect,
  onSelectAbility,
}: CommandPanelProps): JSX.Element {
  return (
    <div className="command-bar">
      {/* Header */}
      <div className="command-header">
        {currentUnit ? (
          <>
            Current Unit: <strong>{currentUnit.name} ({currentUnit.element} Adept)</strong>
          </>
        ) : (
          'Waiting...'
        )}
      </div>

      {/* Command Buttons */}
      <div className="command-buttons">
        <div
          className="command-button"
          onClick={() => onCommandSelect('attack')}
        >
          [A] Attack
        </div>
        <div
          className="command-button"
          onClick={() => onCommandSelect('psynergy')}
        >
          [S] Psynergy
        </div>
        <div
          className="command-button"
          onClick={() => onCommandSelect('djinn')}
        >
          [D] Djinn
        </div>
        <div
          className="command-button"
          onClick={() => onCommandSelect('abilities')}
        >
          [F] Abilities
        </div>
      </div>

      {/* Ability Panel */}
      <AbilityPanel
        coreAbilities={coreAbilities}
        djinnAbilities={djinnAbilities}
        onSelectAbility={onSelectAbility}
      />
    </div>
  );
}
