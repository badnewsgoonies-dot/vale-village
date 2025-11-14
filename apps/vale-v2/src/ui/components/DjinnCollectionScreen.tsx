/**
 * DjinnCollectionScreen Component
 * Displays all collected Djinn in a grid layout
 */

import { useState } from 'react';
import { useStore } from '../state/store';
import { DJINN } from '@/data/definitions/djinn';
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

  return (
    <div className="djinn-collection-overlay" onClick={onClose}>
      <div className="djinn-collection-container" onClick={(e) => e.stopPropagation()}>
        <div className="djinn-collection-header">
          <h1>Djinn Collection</h1>
          <button className="close-btn" onClick={onClose} aria-label="Close Djinn collection">
            ×
          </button>
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
                          <span className="djinn-initial">{djinn.name[0]}</span>
                        </div>
                        <div className="djinn-info">
                          <div className="djinn-name">{djinn.name}</div>
                          <div className="djinn-tier">Tier {djinn.tier}</div>
                          {isEquipped && (
                            <div className="djinn-status">Equipped ({state})</div>
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

