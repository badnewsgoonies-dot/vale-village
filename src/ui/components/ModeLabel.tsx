interface ModeLabelProps {
  /** 'story' | 'tower' | 'demo' */
  battleType: string;
  /** e.g. "Vale Village - House 01" or "Battle Tower" */
  locationName: string;
  /** Only for tower mode */
  floorNumber?: number;
}

export function ModeLabel({ battleType, locationName, floorNumber }: ModeLabelProps) {
  const isTower = battleType === 'tower';
  const label = isTower && floorNumber ? `Battle Tower - Floor ${floorNumber}` : locationName;

  return (
    <div
      style={{
        position: 'absolute',
        top: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.75)',
        border: '2px solid rgba(255,215,0,0.65)',
        borderRadius: 8,
        padding: '6px 12px',
        color: '#ffd87f',
        fontWeight: 700,
        letterSpacing: 0.5,
        textShadow: '1px 1px 2px #000',
        zIndex: 60,
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <span
        style={{
          padding: '2px 6px',
          borderRadius: 4,
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,215,0,0.5)',
          color: '#ffe9a1',
          fontSize: '0.8rem',
        }}
      >
        {battleType === 'tower' ? 'Battle Tower' : battleType === 'demo' ? 'Demo' : 'Story Battle'}
      </span>
      <span style={{ fontSize: '0.9rem' }}>{label}</span>
    </div>
  );
}
