/**
 * TeamBenchSection Component
 * Displays active party (2x2 grid) and bench units (vertical list)
 */

import type { Unit } from '@/core/models/Unit';
import { MAX_PARTY_SIZE } from '@/core/constants';
import { SimpleSprite } from '../sprites/SimpleSprite';
import { getPortraitSprite } from '../sprites/mappings';

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
                <>
                  <div className="unit-portrait">
                    <SimpleSprite
                      id={getPortraitSprite(unit.id)}
                      width={56}
                      height={56}
                      alt={`${unit.name} portrait`}
                    />
                  </div>
                  <div className="unit-name">{unit.name}</div>
                  <div className="unit-level">Lv. {unit.level}</div>
                  <div className="unit-element">{unit.element}</div>
                </>
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
                <div className="bench-portrait">
                  <SimpleSprite
                    id={getPortraitSprite(unit.id)}
                    width={44}
                    height={44}
                    alt={`${unit.name} portrait`}
                  />
                </div>
                <div className="bench-unit-info">
                  <div className="unit-name">{unit.name}</div>
                  <div className="unit-level">Lv. {unit.level}</div>
                  <div className="unit-element">{unit.element}</div>
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

