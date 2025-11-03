import React from 'react';
import type { Unit } from '@/types/Unit';

interface StatusBarProps {
  units: Unit[];
}

export const StatusBar: React.FC<StatusBarProps> = ({ units }) => {
  return (
    <div className="stat-bar">
      {units.map(unit => {
        const stats = unit.calculateStats();
        const hpPercent = (unit.currentHp / stats.hp) * 100;
        const ppPercent = (unit.currentPp / stats.pp) * 100;

        return (
          <div key={unit.id} className="hero-stat">
            <span className="name">{unit.name}</span>
            <div className="stat-line">
              <span className="stat-label">HP</span>
              <div className="bar">
                <div
                  className="bar-fill"
                  style={{ width: `${Math.max(0, Math.min(100, hpPercent))}%` }}
                />
              </div>
              <span className="stat-value">{unit.currentHp}/{stats.hp}</span>
            </div>
            <div className="stat-line">
              <span className="stat-label">PP</span>
              <div className="bar">
                <div
                  className="bar-fill pp"
                  style={{ width: `${Math.max(0, Math.min(100, ppPercent))}%` }}
                />
              </div>
              <span className="stat-value">{unit.currentPp}/{stats.pp}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
