/**
 * TeamBenchSection Component
 * Displays active party (2x2 grid) and bench units (vertical list)
 */

import type { Unit } from '@/core/models/Unit';
import { MAX_PARTY_SIZE } from '@/core/constants';

function getUnitPortrait(unit: Unit): string {
  const portraits: Record<string, string> = {
    adept: '/sprites/icons/characters/Isaac1.gif',
    'war-mage': '/sprites/icons/characters/Garet1.gif',
    mystic: '/sprites/icons/characters/Mia.gif',
    ranger: '/sprites/icons/characters/Ivan.gif',
  };

  const byElement: Record<string, string> = {
    Venus: '/sprites/icons/characters/Isaac1.gif',
    Mars: '/sprites/icons/characters/Garet1.gif',
    Mercury: '/sprites/icons/characters/Mia.gif',
    Jupiter: '/sprites/icons/characters/Ivan.gif',
  };

  return portraits[unit.id] ?? byElement[unit.element] ?? '/sprites/icons/characters/Isaac1.gif';
}

function getElementColor(element: string): string {
  const colors: Record<string, string> = {
    Venus: '#D1B354',
    Mars: '#E55B3C',
    Mercury: '#4CA3DD',
    Jupiter: '#8A5AD7',
  };
  return colors[element] ?? '#888';
}

interface TeamBenchSectionProps {
  activeParty: readonly (Unit | null)[];
  benchUnits: readonly Unit[];
  selectedSlotIndex: number | null;
  onSelectSlot: (index: number | null) => void;
  onAddToSlot: (slotIndex: number, unitId: string) => void;
}

export function TeamBenchSection({
  activeParty,
  benchUnits,
  selectedSlotIndex,
  onSelectSlot,
  onAddToSlot,
}: TeamBenchSectionProps) {
  const handleSlotClick = (index: number) => {
    onSelectSlot(index);
  };

  const handleBenchUnitClick = (unitId: string) => {
    if (selectedSlotIndex !== null) {
      onAddToSlot(selectedSlotIndex, unitId);
    }
  };

  // Create array of 4 slots (filled or empty)
  const filledUnitCount = activeParty.filter((unit): unit is Unit => Boolean(unit)).length;
  const slots = Array.from({ length: MAX_PARTY_SIZE }, (_, i) => ({
    index: i,
    unit: activeParty[i],
  }));

  return (
    <div className="section-card team-bench-section">
      <div className="current-party-panel">
        <div className="section-title">YOUR TEAM ({filledUnitCount}/{MAX_PARTY_SIZE})</div>
        <div className="current-party-grid">
          {slots.map(({ index, unit }) => (
            <div
              key={index}
              className={`party-slot ${unit ? 'filled' : 'empty'} ${
                selectedSlotIndex === index ? 'selected' : ''
              }`}
              onClick={() => handleSlotClick(index)}
            >
              {unit ? (
                <div style={{ textAlign: 'center', padding: '4px 2px' }}>
                  <img
                    src={getUnitPortrait(unit)}
                    alt={unit.name}
                    style={{
                      width: 48,
                      height: 48,
                      imageRendering: 'pixelated',
                      marginBottom: 4,
                    }}
                  />
                  <div className="unit-name">{unit.name}</div>
                  <div className="unit-level">Lv. {unit.level}</div>
                  <div className="unit-element" style={{ color: getElementColor(unit.element) }}>
                    {unit.element}
                  </div>
                </div>
              ) : (
                <div className="empty-slot-text">[+]</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bench-panel">
        <div className="section-title">BENCH UNITS</div>
        <div className="bench-grid">
          {benchUnits.length === 0 ? (
            <div className="empty-slot-text" style={{ textAlign: 'center', padding: '1rem' }}>
              No bench units available
            </div>
          ) : (
            benchUnits.slice(0, 4).map((unit) => (
              <div
                key={unit.id}
                className="bench-unit-compact"
                onClick={() => handleBenchUnitClick(unit.id)}
              >
                <img
                  src={getUnitPortrait(unit)}
                  alt={unit.name}
                  style={{
                    width: 48,
                    height: 48,
                    imageRendering: 'pixelated',
                    borderRadius: 6,
                    border: '1px solid #333',
                  }}
                />
                <div className="bench-unit-info">
                  <div className="unit-name">{unit.name}</div>
                  <div className="unit-level">Lv. {unit.level}</div>
                  <div className="unit-element" style={{ color: getElementColor(unit.element) }}>
                    {unit.element}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {benchUnits.length > 4 && (
          <div
            style={{
              fontSize: '0.7rem',
              color: '#666',
              textAlign: 'center',
              padding: '0.5rem',
              fontStyle: 'italic',
              marginTop: '0.25rem',
            }}
          >
            +{benchUnits.length - 4} more units in roster
          </div>
        )}
      </div>
    </div>
  );
}
