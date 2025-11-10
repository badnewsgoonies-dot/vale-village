/**
 * Turn order display component
 * Shows current turn order and highlights active unit
 */

import type { BattleState } from '../../core/models/BattleState';

interface TurnOrderStripProps {
  state: BattleState;
}

export function TurnOrderStrip({ state }: TurnOrderStripProps) {
  const allUnits = [...state.playerTeam.units, ...state.enemies];
  const unitMap = new Map(allUnits.map(u => [u.id, u]));

  return (
    <div className="turn-order-strip" style={{ 
      display: 'flex', 
      gap: '0.5rem', 
      padding: '0.5rem',
      backgroundColor: '#f0f0f0',
      borderRadius: '4px',
      marginBottom: '1rem'
    }}>
      <span style={{ fontWeight: 'bold' }}>Turn Order:</span>
      {state.turnOrder.map((unitId, index) => {
        const unit = unitMap.get(unitId);
        const isActive = index === state.currentActorIndex;
        
        if (!unit) return null;
        
        return (
          <span
            key={unitId}
            style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: isActive ? '#4CAF50' : '#fff',
              color: isActive ? '#fff' : '#000',
              borderRadius: '4px',
              fontWeight: isActive ? 'bold' : 'normal',
            }}
          >
            {unit.name} (Turn {state.currentTurn})
          </span>
        );
      })}
    </div>
  );
}

