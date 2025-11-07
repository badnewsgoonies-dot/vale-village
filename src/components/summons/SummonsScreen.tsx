import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Button, ElementIcon } from '../shared';
import type { Djinn } from '@/types/Djinn';
import { SummonIcon } from '@/sprites/components/SummonIcon';
import { DjinnIcon } from '@/sprites/components/DjinnIcon';
import type { Element } from '@/types/Element';
import './SummonsScreen.css';

type SummonType = 'Titan' | 'Phoenix' | 'Kraken' | 'Thunderbird';

interface SummonInfo {
  name: SummonType;
  element: Element;
  requiredDjinn: number;
  baseDamage: number;
  description: string;
  lore: string;
}

const SUMMONS: SummonInfo[] = [
  {
    name: 'Titan',
    element: 'Venus',
    requiredDjinn: 3,
    baseDamage: 250,
    description: 'Mighty earth spirit that crushes all enemies with devastating force',
    lore: 'The ultimate Venus summon, Titan calls forth the power of the earth itself',
  },
  {
    name: 'Phoenix',
    element: 'Mars',
    requiredDjinn: 3,
    baseDamage: 280,
    description: 'Legendary firebird that engulfs all foes in blazing flames',
    lore: 'Born from eternal flames, Phoenix brings purifying fire to the battlefield',
  },
  {
    name: 'Kraken',
    element: 'Mercury',
    requiredDjinn: 3,
    baseDamage: 220,
    description: 'Ancient sea monster that drowns enemies in tidal waves',
    lore: 'From the depths of the ocean, Kraken rises to unleash watery devastation',
  },
  {
    name: 'Thunderbird',
    element: 'Jupiter',
    requiredDjinn: 3,
    baseDamage: 260,
    description: 'Celestial bird that strikes with thunderous electrical storms',
    lore: 'Soaring through storm clouds, Thunderbird commands the fury of lightning',
  },
];

export const SummonsScreen: React.FC = () => {
  const { state, actions } = useGame();
  const [selectedSummon, setSelectedSummon] = useState<SummonInfo | null>(null);

  // Get all collected Djinn
  const collectedDjinn = state.playerData.djinnCollected;

  // Count Djinn by element
  const djinnByElement: Record<Element, Djinn[]> = {
    Venus: collectedDjinn.filter(d => d.element === 'Venus'),
    Mars: collectedDjinn.filter(d => d.element === 'Mars'),
    Mercury: collectedDjinn.filter(d => d.element === 'Mercury'),
    Jupiter: collectedDjinn.filter(d => d.element === 'Jupiter'),
    Neutral: [],
  };

  const handleReturn = () => {
    actions.goBack();
  };

  const canSummon = (summon: SummonInfo): boolean => {
    const elementDjinn = djinnByElement[summon.element];
    return elementDjinn.length >= summon.requiredDjinn;
  };

  const calculateSummonDamage = (summon: SummonInfo): { min: number; max: number } => {
    const elementDjinn = djinnByElement[summon.element];
    
    if (elementDjinn.length < 3) {
      return { min: 0, max: 0 };
    }

    // Use first 3 Djinn for calculation
  const djinnToUse = elementDjinn.slice(0, 3);

  // Tier bonus: +20 per tier level
  const tierBonus = djinnToUse.reduce((sum: number, d: Djinn) => sum + (d.tier * 20), 0);
    
    // MAG bonus: Assume min/max MAG from party
    const party = state.playerData.unitsCollected.filter(u => 
      state.playerData.activePartyIds.includes(u.id)
    );
    
    const minMag = party.length > 0 ? Math.min(...party.map(u => u.calculateStats().mag)) : 10;
    const maxMag = party.length > 0 ? Math.max(...party.map(u => u.calculateStats().mag)) : 20;
    
    const minMagBonus = Math.floor(minMag * 0.5);
    const maxMagBonus = Math.floor(maxMag * 0.5);
    
    return {
      min: summon.baseDamage + tierBonus + minMagBonus,
      max: summon.baseDamage + tierBonus + maxMagBonus,
    };
  };

  return (
    <div className="summons-screen">
      <div className="summons-container">
        {/* Header */}
        <header className="summons-header">
          <div className="header-content">
            <h1>SUMMONS</h1>
            <p className="header-subtitle">Unleash the power of Djinn spirits</p>
          </div>
          <Button onClick={handleReturn} ariaLabel="Return to previous menu">
            RETURN
          </Button>
        </header>

        {/* Info Panel */}
        <section className="summons-info-panel">
          <div className="info-content">
            <h2>How Summons Work</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-icon">🔮</span>
                <div>
                  <strong>Requirement:</strong> 3 Djinn in Standby state of matching element
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">⚔️</span>
                <div>
                  <strong>In Battle:</strong> Activate 3 Djinn (Set → Standby) before summoning
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">💥</span>
                <div>
                  <strong>Power:</strong> Base damage + tier bonuses + 50% caster's MAG
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">⏱️</span>
                <div>
                  <strong>Recovery:</strong> Used Djinn enter Recovery (3 turns to return to Set)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Summons Grid */}
        <section className="summons-grid">
          {SUMMONS.map(summon => {
            const canUse = canSummon(summon);
            const damage = calculateSummonDamage(summon);
            const elementDjinn = djinnByElement[summon.element];
            const isSelected = selectedSummon?.name === summon.name;

            return (
              <div
                key={summon.name}
                className={`summon-card ${summon.element.toLowerCase()} ${canUse ? 'available' : 'locked'} ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedSummon(summon)}
                role="button"
                tabIndex={0}
                aria-label={`${summon.name} summon - ${canUse ? 'Available' : 'Locked'}`}
              >
                <div className="summon-header">
                  <div className="summon-name-section">
                    <h3 className="summon-name">{summon.name}</h3>
                    <ElementIcon element={summon.element} size="medium" />
                  </div>
                  {!canUse && <div className="lock-icon">🔒</div>}
                </div>

                <div className="summon-image">
                  <SummonIcon
                    summonName={summon.name}
                    element={summon.element}
                    size="large"
                    className="summon-sprite"
                  />
                </div>

                <div className="summon-stats">
                  <div className="stat-row">
                    <span className="stat-label">Element:</span>
                    <span className="stat-value">{summon.element}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Required:</span>
                    <span className={`stat-value ${elementDjinn.length >= summon.requiredDjinn ? 'available' : 'locked'}`}>
                      {elementDjinn.length} / {summon.requiredDjinn} Djinn
                    </span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Base Power:</span>
                    <span className="stat-value">{summon.baseDamage}</span>
                  </div>
                  {canUse && damage.min > 0 && (
                    <div className="stat-row damage-estimate">
                      <span className="stat-label">Damage:</span>
                      <span className="stat-value damage-range">{damage.min} - {damage.max}</span>
                    </div>
                  )}
                </div>

                <p className="summon-description">{summon.description}</p>
              </div>
            );
          })}
        </section>

        {/* Selected Summon Details */}
        {selectedSummon && (
          <aside className="summon-details-panel">
            <div className="details-header">
              <h2>{selectedSummon.name}</h2>
              <ElementIcon element={selectedSummon.element} size="large" />
            </div>

            <div className="details-content">
              <div className="detail-section">
                <h3>Lore</h3>
                <p className="lore-text">{selectedSummon.lore}</p>
              </div>

              <div className="detail-section">
                <h3>Power Calculation</h3>
                <div className="calculation-breakdown">
                  <div className="calc-row">
                    <span>Base Damage:</span>
                    <span className="calc-value">{selectedSummon.baseDamage}</span>
                  </div>
                  <div className="calc-row">
                    <span>+ Tier Bonuses (3 Djinn):</span>
                    <span className="calc-value">+{djinnByElement[selectedSummon.element].slice(0, 3).reduce((sum: number, d: Djinn) => sum + (d.tier * 20), 0)}</span>
                  </div>
                  <div className="calc-row">
                    <span>+ 50% Caster's MAG:</span>
                    <span className="calc-value">varies</span>
                  </div>
                  <div className="calc-row total">
                    <span>Total Damage Range:</span>
                    <span className="calc-value">
                      {calculateSummonDamage(selectedSummon).min} - {calculateSummonDamage(selectedSummon).max}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Available {selectedSummon.element} Djinn</h3>
                <div className="djinn-list">
                  {djinnByElement[selectedSummon.element].map((djinn: Djinn, index: number) => (
                    <div key={djinn.id} className="djinn-item">
                      <DjinnIcon
                        djinn={djinn}
                        size="small"
                        className="djinn-mini-sprite"
                      />
                      <div className="djinn-mini-info">
                        <span className="djinn-mini-name">{djinn.name}</span>
                        <span className="djinn-mini-tier">Tier {djinn.tier}</span>
                      </div>
                      {index < 3 && <span className="used-indicator">✓ Used</span>}
                    </div>
                  ))}
                </div>
              </div>

              {!canSummon(selectedSummon) && (
                <div className="detail-section requirement-notice">
                  <h3>⚠️ Requirements Not Met</h3>
                  <p>
                    You need {selectedSummon.requiredDjinn} {selectedSummon.element} Djinn to summon {selectedSummon.name}.
                    Currently collected: {djinnByElement[selectedSummon.element].length}
                  </p>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
