interface BattleManaBarProps {
  currentMana: number;
  maxMana: number;
  pendingThisRound: number;
  pendingNextRound: number;
}

/**
 * Dual-state mana bar matching bottom-layout spec:
 * solid = available, semi = pending this round, hollow = empty, ⤼ N = next-round pending.
 */
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
        gap: '0.5rem',
        fontFamily: 'monospace',
        color: '#f6e8b1',
      }}
      aria-label={`Mana ${currentMana}/${maxMana}`}
    >
      <div
        style={{
          display: 'flex',
          gap: '0.25rem',
          alignItems: 'center',
        }}
      >
        {circles.map((state, idx) => (
          <span
            key={idx}
            aria-hidden
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              display: 'inline-block',
              border: '1px solid rgba(255, 216, 127, 0.6)',
              backgroundColor:
                state === 'solid'
                  ? '#FFD54A'
                  : state === 'pending'
                    ? 'rgba(255, 213, 74, 0.35)'
                    : 'transparent',
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
        <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>⤼ {pendingNextRound}</span>
      )}
    </div>
  );
}
