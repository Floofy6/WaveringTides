import React from 'react';
import { Enemy } from '../../types';

interface EnemyDisplayProps {
  enemy: Enemy;
}

/**
 * EnemyDisplay component - Displays an enemy with health bar and stats
 */
const EnemyDisplay: React.FC<EnemyDisplayProps> = ({ enemy }) => {
  // Calculate health percentage for the health bar
  const healthPercentage = Math.max(0, Math.min(100, (enemy.health / enemy.maxHealth) * 100));
  
  return (
    <div className="enemy-display">
      <h3>{enemy.name}</h3>
      
      <div className="enemy-health">
        <div className="health-bar">
          <div 
            className="health-fill"
            style={{ width: `${healthPercentage}%` }} 
          />
        </div>
        <div className="health-text">
          {enemy.health} / {enemy.maxHealth} HP
        </div>
      </div>
      
      <div className="enemy-stats">
        <div className="stat">
          <span className="stat-label">Attack:</span>
          <span className="stat-value">{enemy.attack}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Defense:</span>
          <span className="stat-value">{enemy.defense}</span>
        </div>
      </div>
    </div>
  );
};

export default EnemyDisplay; 