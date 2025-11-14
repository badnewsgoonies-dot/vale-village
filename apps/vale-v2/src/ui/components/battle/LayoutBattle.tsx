/**
 * Layout Battle Component
 *
 * Optional layout wrapper for the battle screen.
 * Could be extended with phase transitions, animations, etc.
 */

import React from 'react';
import type { LayoutBattleProps } from './types';

export function LayoutBattle({ children, phase }: LayoutBattleProps): JSX.Element {
  return (
    <div className="game-root" data-battle-phase={phase}>
      <div className="battle-screen">
        {children}
      </div>
    </div>
  );
}
