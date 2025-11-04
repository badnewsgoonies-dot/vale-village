import React, { useRef, useEffect } from 'react';

interface CombatLogProps {
  messages: string[];
}

/**
 * Format combat log message with special styling
 * Detects keywords and applies appropriate CSS classes
 */
const formatMessage = (msg: string): { text: string; className: string } => {
  // Check for critical hits
  if (msg.includes('Critical hit!')) {
    return { text: msg, className: 'log-entry critical-hit' };
  }
  
  // Check for element advantage
  if (msg.includes('Super effective!')) {
    return { text: msg, className: 'log-entry super-effective' };
  }
  
  if (msg.includes('Not very effective...')) {
    return { text: msg, className: 'log-entry not-effective' };
  }
  
  // Check for victory/defeat
  if (msg.includes('VICTORY')) {
    return { text: msg, className: 'log-entry victory' };
  }
  
  if (msg.includes('DEFEAT')) {
    return { text: msg, className: 'log-entry defeat' };
  }
  
  // Default
  return { text: msg, className: 'log-entry' };
};

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
        messages.map((msg, idx) => {
          const { text, className } = formatMessage(msg);
          return (
            <div key={idx} className={className}>
              &gt; {text}
            </div>
          );
        })
      )}
    </div>
  );
};
