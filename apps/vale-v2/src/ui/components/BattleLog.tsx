/**
 * Battle log component
 * Displays battle events as they occur
 */

import type { BattleEvent } from '../../core/services/types';

interface BattleLogProps {
  events: readonly BattleEvent[];
  renderText: (event: BattleEvent) => string;
}

export function BattleLog({ events, renderText }: BattleLogProps) {
  return (
    <div
      className="battle-log"
      style={{
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: '#1e1e1e',
        color: '#fff',
        borderRadius: '4px',
        maxHeight: '200px',
        overflowY: 'auto',
      }}
    >
      <h4 style={{ marginTop: 0 }}>Battle Log</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {events.length === 0 ? (
          <div style={{ color: '#888', fontStyle: 'italic' }}>No events yet...</div>
        ) : (
          events.map((event, index) => (
            <div
              key={index}
              style={{
                fontSize: '0.875rem',
                padding: '0.25rem',
                backgroundColor: index === 0 ? '#333' : 'transparent',
                borderRadius: '2px',
              }}
            >
              {renderText(event)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

