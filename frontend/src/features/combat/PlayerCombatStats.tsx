import React from 'react';

interface PlayerCombatStatsProps {
  health: number;
  maxHealth: number;
}

/**
 * PlayerCombatStats component - Displays player's health and combat stats
 */
const PlayerCombatStats: React.FC<PlayerCombatStatsProps> = ({ health, maxHealth }) => {
  // Calculate health percentage for the health bar
  const healthPercentage = Math.max(0, Math.min(100, (health / maxHealth) * 100));
  
  return (
    <div className="player-combat-stats">
      <h3>Your Stats</h3>
      
      <div className="player-health">
        <div className="health-bar">
          <div 
            className="health-fill"
            style={{ width: `${healthPercentage}%` }} 
          />
        </div>
        <div className="health-text">
          {health} / {maxHealth} HP
        </div>
      </div>
    </div>
  );
};

export default PlayerCombatStats; 