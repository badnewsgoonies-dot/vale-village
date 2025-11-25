interface DjinnAdvisorPanelProps {
  tutorialMessage?: string | null;
  onClick?: () => void;
}

const djinnSprites = [
  { id: 'venus', name: 'Flint', path: '/sprites/battle/djinn/Venus_Djinn_Front.gif' },
  { id: 'mars', name: 'Granite', path: '/sprites/battle/djinn/Mars_Djinn_Front.gif' },
  { id: 'mercury', name: 'Echo', path: '/sprites/battle/djinn/Mercury_Djinn_Front.gif' },
];

export function DjinnAdvisorPanel({ tutorialMessage, onClick }: DjinnAdvisorPanelProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(0,0,0,0.35)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 8,
        padding: '8px 10px',
        width: 180,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {tutorialMessage && (
        <div
          style={{
            background: '#fff',
            color: '#000',
            padding: '6px 8px',
            borderRadius: 6,
            border: '1px solid #000',
            position: 'relative',
            marginBottom: 8,
            fontSize: '0.85rem',
          }}
        >
          {tutorialMessage}
          <div
            style={{
              position: 'absolute',
              left: 12,
              bottom: -6,
              width: 10,
              height: 10,
              background: '#fff',
              borderLeft: '1px solid #000',
              borderBottom: '1px solid #000',
              transform: 'rotate(45deg)',
            }}
          />
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
        {djinnSprites.map((djinn) => (
          <div key={djinn.id} style={{ textAlign: 'center', width: 50 }}>
            <img
              src={djinn.path}
              alt={djinn.name}
              width={50}
              height={50}
              style={{ imageRendering: 'pixelated' }}
            />
            <div style={{ color: '#f6e8b1', fontSize: '0.75rem', marginTop: 4 }}>{djinn.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
