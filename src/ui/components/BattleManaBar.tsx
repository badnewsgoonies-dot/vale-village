interface BattleManaBarProps {
  currentMana: number;
  maxMana: number;
  pendingThisRound: number;
  pendingNextRound: number;
}

export function BattleManaBar({
  currentMana,
  maxMana,
  pendingThisRound,
  pendingNextRound,
}: BattleManaBarProps) {
  const circles = Array.from({ length: maxMana }, (_, idx) => {
    if (idx < currentMana) return 'solid' as const;
    if (idx < currentMana + pendingThisRound) return 'pending' as const;
    return 'empty' as const;
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'rgba(0,0,0,0.7)',
        padding: '6px 12px',
        borderRadius: 6,
        border: '2px solid rgba(255,215,0,0.5)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
      }}
      aria-label={`Mana ${currentMana}/${maxMana}`}
    >
      <span style={{ 
        color: '#ffd87f', 
        fontSize: '0.75rem', 
        fontWeight: 700,
        textShadow: '1px 1px 2px #000',
        letterSpacing: '0.5px',
      }}>
        MANA
      </span>
      <div
        style={{
          display: 'flex',
          gap: 4,
          alignItems: 'center',
        }}
      >
        {circles.map((state, idx) => (
          <div
            key={idx}
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              border: '2px solid rgba(255, 215, 0, 0.7)',
              backgroundColor:
                state === 'solid'
                  ? '#FFD54A'
                  : state === 'pending'
                    ? 'rgba(255, 213, 74, 0.4)'
                    : 'rgba(0,0,0,0.5)',
              boxShadow: state === 'solid' 
                ? '0 0 6px rgba(255,215,0,0.8), inset 0 -2px 4px rgba(0,0,0,0.3)' 
                : state === 'pending'
                  ? '0 0 4px rgba(255,215,0,0.4)'
                  : 'inset 0 2px 4px rgba(0,0,0,0.5)',
              transition: 'all 0.2s ease',
            }}
            title={
              state === 'solid'
                ? 'Available mana'
                : state === 'pending'
                  ? 'Pending this round'
                  : 'Empty'
            }
          />
        ))}
      </div>
      {pendingNextRound > 0 && (
        <span style={{ 
          fontSize: '0.75rem', 
          color: '#90EE90',
          fontWeight: 600,
          textShadow: '1px 1px 2px #000',
        }}>
          +{pendingNextRound}
        </span>
      )}
    </div>
  );
}
