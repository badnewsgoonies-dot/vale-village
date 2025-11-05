import React from 'react';
import type { Unit } from '@/types/Unit';

interface CommandMenuProps {
  unit: Unit;
  onSelectCommand: (command: 'attack' | 'psynergy' | 'djinn' | 'defend' | 'flee') => void;
  isBossBattle?: boolean;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ unit, onSelectCommand, isBossBattle = false }) => {
  return (
    <div className="action-menu">
      <h3 className="menu-title">{unit.name}'s Turn</h3>
      <div className="action-buttons">
        <button
          className="action-button"
          onClick={() => onSelectCommand('attack')}
        >
          ATTACK
        </button>
        <button
          className="action-button"
          onClick={() => onSelectCommand('psynergy')}
        >
          PSYNERGY
        </button>
        <button
          className="action-button"
          onClick={() => onSelectCommand('djinn')}
          disabled={unit.djinn.length === 0}
        >
          DJINN
        </button>
        <button
          className="action-button"
          onClick={() => onSelectCommand('defend')}
        >
          DEFEND
        </button>
        <button
          className="action-button flee-button"
          onClick={() => onSelectCommand('flee')}
          disabled={isBossBattle}
          title={isBossBattle ? "Cannot flee from boss battle!" : "Flee from battle"}
        >
          FLEE
        </button>
      </div>
    </div>
  );
};
