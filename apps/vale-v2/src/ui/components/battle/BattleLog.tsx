/**
 * Battle Log Component
 *
 * Displays scrollable battle event log.
 */

import React from 'react';
import type { BattleLogProps } from './types';

export function BattleLog({ entries }: BattleLogProps): JSX.Element {
  const logRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new entries added
  React.useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className="battle-log" ref={logRef}>
      <div className="battle-log-title">Battle Log</div>
      {entries.map((entry) => (
        <div key={entry.id} className="battle-log-entry">
          {entry.text}
        </div>
      ))}
      {entries.length === 0 && (
        <div className="battle-log-entry" style={{ color: '#888' }}>
          Battle started...
        </div>
      )}
    </div>
  );
}
