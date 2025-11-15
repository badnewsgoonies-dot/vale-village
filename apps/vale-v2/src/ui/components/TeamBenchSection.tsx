/**
 * TeamBenchSection Component
 * Displays active party (2x2 grid) and bench units (vertical list)
 */

import type { Unit } from '@/core/models/Unit';

interface TeamBenchSectionProps {
  activeParty: readonly Unit[];
  benchUnits: readonly Unit[];
  selectedSlotIndex: number | null;
  onSelectSlot: (index: number | null) => void;
  onAddToSlot: (slotIndex: number, unitId: string) => void;
  onRemoveFromParty: (slotIndex: number) => void;
}

export function TeamBenchSection({
  activeParty,
  benchUnits,
  selectedSlotIndex,
  onSelectSlot,
  onAddToSlot,
  onRemoveFromParty,
}: TeamBenchSectionProps) {
  const handleSlotClick = (index: number) => {
    if (activeParty[index]) {
      // Slot has unit - select it
      onSelectSlot(index);
    } else {
      // Empty slot - select it for adding
      onSelectSlot(index);
    }
  };

  const handleBenchUnitClick = (unitId: string) => {
    if (selectedSlotIndex !== null) {
      onAddToSlot(selectedSlotIndex, unitId);
    }
  };

  // Create array of 4 slots (filled or empty)
  const slots = Array.from({ length: 4 }, (_, i) => ({
    index: i,
    unit: activeParty[i],
  }));

  return (
    <div className="section-card team-bench-section">
      <div className="current-party-panel">
        <div className="section-title">YOUR TEAM ({activeParty.length}/4)</div>
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

