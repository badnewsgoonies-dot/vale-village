/**
 * RewardsScreen Component
 * Displays post-battle rewards: XP, gold, equipment, level-ups
 */

import type { RewardDistribution } from '../../core/models/Rewards';
import type { Team } from '../../core/models/Team';
import type { Equipment } from '../../data/schemas/EquipmentSchema';
import { BattleUnitSprite } from './BattleUnitSprite';
import { EquipmentIcon } from './EquipmentIcon';
import { EquipmentChoicePicker } from './EquipmentChoicePicker';
import './RewardsScreen.css';

interface RewardsScreenProps {
  rewards: RewardDistribution;
  team: Team;
  onContinue: () => void;
  onSelectEquipment: (equipment: Equipment) => void;
}

export function RewardsScreen({ rewards, team, onContinue, onSelectEquipment }: RewardsScreenProps) {
  // Look up units for level-ups
  const levelUpUnits = rewards.levelUps
    .map(levelUp => {
      const unit = team.units.find(u => u.id === levelUp.unitId);
      if (!unit) {
        if (import.meta.env.DEV) {
          console.warn(`Unit not found for level-up: ${levelUp.unitId}`);
        }
        return null;
      }
      return {
        unit,
        oldLevel: levelUp.oldLevel,
        newLevel: levelUp.newLevel,
        statGains: levelUp.statGains,
        unlockedAbilities: levelUp.newAbilitiesUnlocked,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const hasPendingChoice = rewards.equipmentChoice && !rewards.choiceSelected;
  const obtainedEquipment = rewards.choiceSelected
    ? [rewards.choiceSelected]
    : rewards.fixedEquipment
      ? [rewards.fixedEquipment]
      : [];

  return (
    <div className="rewards-screen">
      <div className="rewards-container">
        {/* Victory Banner */}
        <div className="victory-banner" role="banner">
          <h1>VICTORY!</h1>
        </div>

        {/* Rewards Grid (XP + Money) */}
        <div className="rewards-grid">
          {/* XP Gained */}
          <div className="reward-card" role="article" aria-label={`${rewards.rewards.totalXp} experience points gained`}>
            <div className="reward-icon" aria-hidden="true">✦</div>
            <div className="reward-details">
              <div className="reward-label">Experience</div>
              <div className="reward-value highlight">+{rewards.rewards.totalXp} XP</div>
              {rewards.rewards.survivorCount > 0 && (
                <div className="reward-subtext">Split among {rewards.rewards.survivorCount} survivors</div>
              )}
            </div>
          </div>

          {/* Money Gained */}
          <div className="reward-card" role="article" aria-label={`${rewards.goldEarned} gold coins gained`}>
            <div className="reward-icon" aria-hidden="true">◉</div>
            <div className="reward-details">
              <div className="reward-label">Gold</div>
              <div className="reward-value highlight">+{rewards.goldEarned} G</div>
            </div>
          </div>
        </div>

        {hasPendingChoice && (
          <EquipmentChoicePicker
            options={rewards.equipmentChoice!}
            onSelect={onSelectEquipment}
          />
        )}

        {obtainedEquipment.length > 0 && (
          <section className="items-panel" aria-label="Equipment obtained">
            <h2>EQUIPMENT OBTAINED</h2>
            <div className="items-grid">
              {obtainedEquipment.map(item => (
                <div key={item.id} className="item-card">
                  <EquipmentIcon equipment={item} size="small" className="item-icon" />
                  <div className="item-name">{item.name}</div>
                  <div className="item-quantity">x1</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Level Up Notification */}
        {levelUpUnits.length > 0 && (
          <section className="level-up-panel" role="alert" aria-label={`${levelUpUnits.length} units leveled up`}>
            <h2>LEVEL UP!</h2>
            <div className="level-up-units">
              {levelUpUnits.map((levelUp, index) => (
                <div key={levelUp.unit.id} className="level-up-unit" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                  <div className="level-up-sprite">
                    <BattleUnitSprite unitId={levelUp.unit.id} state="idle" size="medium" />
                  </div>
                  <div className="level-up-name">{levelUp.unit.name}</div>
                  <div className="level-up-arrow">Lv {levelUp.oldLevel} → Lv {levelUp.newLevel}</div>
                  <div className="level-up-stats">
                    {levelUp.statGains.hp > 0 && <span>+{levelUp.statGains.hp} HP</span>}
                    {levelUp.statGains.atk > 0 && <span>+{levelUp.statGains.atk} ATK</span>}
                    {levelUp.statGains.def > 0 && <span>+{levelUp.statGains.def} DEF</span>}
                    {levelUp.statGains.mag > 0 && <span>+{levelUp.statGains.mag} MAG</span>}
                    {levelUp.statGains.spd > 0 && <span>+{levelUp.statGains.spd} SPD</span>}
                  </div>
                  {levelUp.unlockedAbilities.length > 0 && (
                    <div className="level-up-abilities">
                      Unlocked: {levelUp.unlockedAbilities.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Continue Button */}
        <div className="continue-container">
          <button
            onClick={onContinue}
            className="continue-btn"
            aria-label="Continue to next screen"
            disabled={hasPendingChoice && !rewards.choiceSelected}
            style={{
              opacity: hasPendingChoice && !rewards.choiceSelected ? 0.5 : 1,
              cursor: hasPendingChoice && !rewards.choiceSelected ? 'not-allowed' : 'pointer',
            }}
          >
            {hasPendingChoice && !rewards.choiceSelected ? 'SELECT EQUIPMENT FIRST' : 'CONTINUE'}
          </button>
        </div>
      </div>
    </div>
  );
}
