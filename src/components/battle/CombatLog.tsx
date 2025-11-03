import React, { useRef, useEffect } from 'react';

interface CombatLogProps {
  messages: string[];
}

export const CombatLog: React.FC<CombatLogProps> = ({ messages }) => {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="combat-log" ref={logRef}>
      {messages.length === 0 ? (
        <div className="log-entry">Battle Start!</div>
      ) : (
        messages.map((msg, idx) => (
          <div key={idx} className="log-entry">
            &gt; {msg}
          </div>
        ))
      )}
    </div>
  );
};
