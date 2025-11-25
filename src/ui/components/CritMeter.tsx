interface CritMeterProps {
  /** Sum of all party crit counters, or single team counter */
  currentHits: number;
  /** Team-wide threshold */
  threshold: number;
  /** True when next hit will crit */
  critReady: boolean;
}

export function CritMeter({ currentHits, threshold, critReady }: CritMeterProps) {
  const clampedThreshold = threshold > 0 ? threshold : 1;
  const progress = Math.min(1, currentHits / clampedThreshold);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'rgba(0,0,0,0.7)',
        padding: '6px 10px',
        borderRadius: 6,
        border: '2px solid rgba(255,215,0,0.5)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        minWidth: 150,
      }}
    >
      <span
        style={{
          color: '#ffd87f',
          fontWeight: 700,
          letterSpacing: 0.5,
          textShadow: '1px 1px 2px #000',
          fontSize: '0.75rem',
        }}
      >
        CRIT
      </span>
      <div
        style={{
          flex: 1,
          height: 12,
          background: 'rgba(0,0,0,0.45)',
          borderRadius: 6,
          border: '1px solid rgba(255,215,0,0.35)',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
        }}
        aria-label={`Crit progress ${Math.round(progress * 100)}%`}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            background: critReady
              ? 'linear-gradient(90deg, #ffeb3b, #ffa000)'
              : 'linear-gradient(90deg, #7fffd4, #4caf50)',
            boxShadow: critReady
              ? '0 0 10px rgba(255,215,0,0.8)'
              : '0 0 6px rgba(255,215,0,0.5)',
            transition: 'width 0.2s ease',
          }}
        />
      </div>
      <span
        style={{
          color: critReady ? '#ffeb3b' : '#eaeaea',
          fontWeight: 700,
          fontSize: '0.8rem',
          minWidth: 36,
          textAlign: 'right',
          textShadow: '1px 1px 2px #000',
        }}
      >
        {currentHits}/{clampedThreshold}
      </span>
    </div>
  );
}
