import React from 'react';
import { Button } from '../shared';
import { BattleUnit } from '@/sprites/components/BattleUnit';
import { EquipmentIcon } from '@/sprites/components/EquipmentIcon';
import type { Unit } from '@/types/Unit';
import type { Equipment } from '@/types/Equipment';
import './RewardsScreen.css';

interface RewardsScreenProps {
  xp: number;
  gold: number;
  items: Equipment[];
  levelUps: Array<{ unit: Unit; oldLevel: number; newLevel: number }>;
  onContinue: () => void;
}

export const RewardsScreen: React.FC<RewardsScreenProps> = ({
  xp,
  gold,
  items,
  levelUps,
  onContinue
}) => {
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
                <EquipmentIcon equipment={item} size="small" className="item-icon" />
                <div className="item-name">{item.name}</div>
                <div className="item-quantity">x1</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Level Up Notification */}
      {levelUps.length > 0 && (
        <section className="level-up-panel" role="alert" aria-label={`${levelUps.length} units leveled up`}>
          <h2>LEVEL UP!</h2>
          <div className="level-up-units">
            {levelUps.map((levelUp, index) => (
              <div key={levelUp.unit.id} className="level-up-unit" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                <div className="level-up-sprite">
                  <BattleUnit unit={levelUp.unit} animation="Front" />
                </div>
                <div className="level-up-name">{levelUp.unit.name}</div>
                <div className="level-up-arrow">Lv {levelUp.oldLevel} → Lv {levelUp.newLevel}</div>
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
    </div>
  );
};
