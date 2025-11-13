import type { Equipment } from '../../data/schemas/EquipmentSchema';
import { EquipmentIcon } from './EquipmentIcon';

interface EquipmentChoicePickerProps {
  options: Equipment[];
  onSelect: (equipment: Equipment) => void;
}

export function EquipmentChoicePicker({ options, onSelect }: EquipmentChoicePickerProps) {
  return (
    <div
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: '2rem',
        borderRadius: '8px',
        border: '2px solid gold',
        marginTop: '1.5rem',
        textAlign: 'center',
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <h3 style={{ color: '#FFD700', marginBottom: '1.5rem' }}>🏆 Choose Your Reward! 🏆</h3>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {options.map((equipment) => (
          <button
            key={equipment.id}
            onClick={() => onSelect(equipment)}
            style={{
              padding: '1rem',
              backgroundColor: '#2c2c2c',
              border: '2px solid #FFD700',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minWidth: '200px',
              maxWidth: '260px',
              color: '#fff',
              textAlign: 'left',
            }}
            onMouseEnter={(event) => {
              const target = event.currentTarget;
              target.style.transform = 'scale(1.05)';
              target.style.backgroundColor = '#3c3c3c';
              target.style.borderColor = '#FFA500';
            }}
            onMouseLeave={(event) => {
              const target = event.currentTarget;
              target.style.transform = 'scale(1)';
              target.style.backgroundColor = '#2c2c2c';
              target.style.borderColor = '#FFD700';
            }}
          >
            <EquipmentIcon equipment={equipment} size="medium" />
            <div style={{ marginTop: '0.5rem' }}>
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  color: getTierColor(equipment.tier),
                }}
              >
                {equipment.name}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '0.25rem' }}>
                {equipment.slot.toUpperCase()}
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#fff' }}>
                {formatStatBonus(equipment.statBonus)}
              </div>
              {equipment.unlocksAbility && (
                <div
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.75rem',
                    color: '#FFD700',
                    fontStyle: 'italic',
                  }}
                >
                  Unlocks: {equipment.unlocksAbility}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function getTierColor(tier: Equipment['tier']) {
  const colors: Record<Equipment['tier'], string> = {
    basic: '#999999',
    bronze: '#CD7F32',
    iron: '#C0C0C0',
    steel: '#B0C4DE',
    silver: '#E8E8E8',
    mythril: '#9370DB',
    legendary: '#FFD700',
    artifact: '#FF1493',
  };
  return colors[tier] ?? '#fff';
}

function formatStatBonus(statBonus: Partial<Record<string, number>>): string {
  const parts: string[] = [];
  if (statBonus.atk) parts.push(`+${statBonus.atk} ATK`);
  if (statBonus.def) parts.push(`+${statBonus.def} DEF`);
  if (statBonus.hp) parts.push(`+${statBonus.hp} HP`);
  if (statBonus.mag) parts.push(`+${statBonus.mag} MAG`);
  if (statBonus.spd) parts.push(`+${statBonus.spd} SPD`);
  return parts.length > 0 ? parts.join(' • ') : 'No stat bonus';
}
