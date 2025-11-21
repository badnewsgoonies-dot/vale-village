/**
 * Command Panel Component
 *
 * Displays command buttons and the ability panel for the current unit.
 */

import { AbilityPanel } from './AbilityPanel';
import type { CommandPanelProps, CommandType } from './types';

export function CommandPanel({
  currentUnit,
  selectedCommand,
  coreAbilities,
  djinnAbilities,
  onCommandSelect,
  onSelectAbility,
}: CommandPanelProps): JSX.Element {
  const renderCommandButton = (command: CommandType, label: string) => (
    <div
      className={`command-button${selectedCommand === command ? ' selected' : ''}`}
      onClick={() => onCommandSelect(command)}
    >
      {label}
    </div>
  );

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
        {renderCommandButton('attack', '[A] Attack')}
        {renderCommandButton('psynergy', '[S] Psynergy')}
        {renderCommandButton('djinn', '[D] Djinn')}
        {renderCommandButton('abilities', '[F] Abilities')}
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
