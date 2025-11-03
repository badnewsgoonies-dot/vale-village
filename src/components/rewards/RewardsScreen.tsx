import React from 'react';
import { Button } from '../shared';
import './RewardsScreen.css';

interface RewardItem {
  id: string;
  name: string;
  icon: string;
  quantity: number;
}

interface LevelUpUnit {
  id: string;
  name: string;
  oldLevel: number;
  newLevel: number;
  sprite: string;
}

interface RecruitedUnit {
  name: string;
  class: string;
  sprite: string;
}

interface RewardsScreenProps {
  xp: number;
  gold: number;
  items: RewardItem[];
  levelUpUnits?: LevelUpUnit[];
  recruitedUnit?: RecruitedUnit;
  onContinue: () => void;
}

export const RewardsScreen: React.FC<RewardsScreenProps> = ({
  xp,
  gold,
  items,
  levelUpUnits = [],
  recruitedUnit,
  onContinue
}) => {
  return (
    <div className="rewards-container">
      {/* Victory Banner */}
      <div className="victory-banner" role="banner">
        <h1>VICTORY!</h1>
      </div>

      {/* Rewards Grid (XP + Money) */}
      <div className="rewards-grid">
        {/* XP Gained */}
        <div className="reward-card" role="article" aria-label={`${xp} experience points gained`}>
          <div className="reward-icon" aria-hidden="true">✦</div>
          <div className="reward-details">
            <div className="reward-label">Experience</div>
            <div className="reward-value highlight">+{xp} XP</div>
          </div>
        </div>

        {/* Money Gained */}
        <div className="reward-card" role="article" aria-label={`${gold} gold coins gained`}>
          <div className="reward-icon" aria-hidden="true">◉</div>
          <div className="reward-details">
            <div className="reward-label">Gold</div>
            <div className="reward-value highlight">+{gold} G</div>
          </div>
        </div>
      </div>

      {/* Items Dropped */}
      {items.length > 0 && (
        <section className="items-panel" aria-label="Items obtained">
          <h2>ITEMS OBTAINED</h2>
          <div className="items-grid">
            {items.map(item => (
              <div key={item.id} className="item-card">
                <div className="item-icon" aria-hidden="true">{item.icon}</div>
                <div className="item-name">{item.name}</div>
                <div className="item-quantity">x{item.quantity}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Unit Recruitment (Special Event) */}
      {recruitedUnit && (
        <section className="recruitment-panel" role="alert" aria-label={`${recruitedUnit.name} has joined your party`}>
          <div className="recruitment-badge">★ NEW RECRUIT ★</div>
          <div className="recruitment-sprite">
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            {recruitedUnit.sprite}
          </div>
          <div className="recruitment-name">{recruitedUnit.name}</div>
          <div className="recruitment-class">{recruitedUnit.class} has joined your party!</div>
        </section>
      )}

      {/* Level Up Notification */}
      {levelUpUnits.length > 0 && (
        <section className="level-up-panel" role="alert" aria-label={`${levelUpUnits.length} units leveled up`}>
          <h2>LEVEL UP!</h2>
          <div className="level-up-units">
            {levelUpUnits.map((unit, index) => (
              <div key={unit.id} className="level-up-unit" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                <div className="level-up-sprite">{unit.sprite}</div>
                <div className="level-up-name">{unit.name}</div>
                <div className="level-up-arrow">Lv {unit.oldLevel} → Lv {unit.newLevel}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Continue Button */}
      <div className="continue-container">
        <Button
          variant="primary"
          onClick={onContinue}
          ariaLabel="Continue to next screen"
          className="continue-btn"
        >
          CONTINUE
        </Button>
      </div>
    </div>
  );
};
