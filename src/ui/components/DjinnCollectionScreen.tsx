/**
 * DjinnCollectionScreen Component
 * Displays all collected Djinn in a grid layout
 */

import { useState } from 'react';
import { useStore } from '../state/store';
import { DJINN } from '@/data/definitions/djinn';
import { SimpleSprite } from '../sprites/SimpleSprite';
import { DjinnDetailModal } from './DjinnDetailModal';
import './DjinnCollectionScreen.css';

interface DjinnCollectionScreenProps {
  onClose: () => void;
}

export function DjinnCollectionScreen({ onClose }: DjinnCollectionScreenProps) {
  const { team } = useStore((s) => ({
    team: s.team,
  }));

  const [selectedDjinnId, setSelectedDjinnId] = useState<string | null>(null);

  if (!team) {
    return (
      <div className="djinn-collection-overlay" onClick={onClose}>
        <div className="djinn-collection-container" onClick={(e) => e.stopPropagation()}>
          <div className="djinn-error">No team data available</div>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const collectedDjinn = team.collectedDjinn || [];
  const equippedDjinn = team.equippedDjinn || [];

  // Group Djinn by element
  const djinnByElement: Record<string, typeof DJINN[string][]> = {
    Venus: [],
    Mars: [],
    Mercury: [],
    Jupiter: [],
  };

  collectedDjinn.forEach((djinnId) => {
    const djinn = DJINN[djinnId];
    if (djinn) {
      const elementList = djinnByElement[djinn.element];
      if (elementList) {
        elementList.push(djinn);
      }
    }
  });

  // Sort by tier within each element (convert string tier to number for comparison)
  Object.keys(djinnByElement).forEach((element) => {
    const elementList = djinnByElement[element];
    if (elementList) {
      elementList.sort((a, b) => parseInt(a.tier, 10) - parseInt(b.tier, 10));
    }
  });

  const getElementColor = (element: string): string => {
    switch (element) {
      case 'Venus': return '#8B4513'; // Brown
      case 'Mars': return '#DC143C'; // Crimson
      case 'Mercury': return '#1E90FF'; // Dodger Blue
      case 'Jupiter': return '#32CD32'; // Lime Green
      default: return '#666';
    }
  };

  const getDjinnSprite = (element: string): string => {
    // Map element to Djinn sprite (using Front variant)
    const elementLower = element.toLowerCase();
    return `${elementLower}-djinn-front`;
  };

  return (
    <div className="djinn-collection-overlay" onClick={onClose}>
      <div className="djinn-collection-container" onClick={(e) => e.stopPropagation()}>
        <div className="djinn-collection-header">
          <h1>Djinn Collection</h1>
          <button className="close-btn" onClick={onClose} aria-label="Close Djinn collection">
            ×
          </button>
        </div>

        <div className="djinn-collection-note" style={{ padding: '0 1rem', fontSize: '0.85rem', color: '#ccc' }}>
          Your collected Djinn live in a global 3-slot team configuration. Use the Pre-Battle screen to lock in which
          Djinn you want active for the upcoming fight—the bonuses apply to every unit at once.
        </div>

        <div className="djinn-stats">
          <div className="stat-item">
            <span className="stat-label">Collected:</span>
            <span className="stat-value">{collectedDjinn.length} / 12</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Equipped:</span>
            <span className="stat-value">{equippedDjinn.length} / 3</span>
          </div>
        </div>

        <div className="djinn-collection-subnote" style={{ fontSize: '0.8rem', color: '#888', textAlign: 'center', marginBottom: '0.25rem' }}>
          Equipped Djinn occupy the shared team slots; swapping them is done here, but final confirmation happens pre-battle.
        </div>

        <div className="djinn-collection-content">
          {Object.entries(djinnByElement).map(([element, djinnList]) => (
            <div key={element} className="djinn-element-section">
              <h2 className="element-header" style={{ color: getElementColor(element) }}>
                {element} Djinn
              </h2>
              {djinnList.length === 0 ? (
                <div className="no-djinn-message">No {element} Djinn collected yet</div>
              ) : (
                <div className="djinn-grid">
                  {djinnList.map((djinn) => {
                    const isEquipped = equippedDjinn.includes(djinn.id);
                    const tracker = team.djinnTrackers[djinn.id];
                    const state = tracker?.state || 'Set';

                    return (
                      <div
                        key={djinn.id}
                        className={`djinn-card ${isEquipped ? 'equipped' : ''} ${state.toLowerCase()}`}
                        onClick={() => setSelectedDjinnId(djinn.id)}
                      >
                        <div className="djinn-icon" style={{ backgroundColor: getElementColor(element) + '40' }}>
                          <SimpleSprite
                            id={getDjinnSprite(element)}
                            width={48}
                            height={48}
                            style={{ filter: state === 'Standby' ? 'brightness(0.6)' : 'none' }}
                          />
                        </div>
                        <div className="djinn-info">
                          <div className="djinn-name">{djinn.name}</div>
                          <div className="djinn-tier">Tier {djinn.tier}</div>
                          {isEquipped && (
                            <div className="djinn-status">Equipped · Team Slot ({state})</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedDjinnId && (
          <DjinnDetailModal
            djinnId={selectedDjinnId}
            onClose={() => setSelectedDjinnId(null)}
          />
        )}
      </div>
    </div>
  );
}

