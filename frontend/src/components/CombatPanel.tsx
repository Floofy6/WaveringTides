import React from 'react';
import { Enemy } from '../types';

interface CombatPanelProps {
  isFighting: boolean;
  currentEnemy?: Enemy;
  playerAttack: number;
  playerStrength: number;
  playerDefense: number;
  playerHitpoints: number;
  availableEnemies: Enemy[];
  onStartCombat: (enemyId: string) => void;
  onStopCombat: () => void;
}

const CombatPanel: React.FC<CombatPanelProps> = ({
  isFighting,
  currentEnemy,
  playerAttack,
  playerStrength,
  playerDefense,
  playerHitpoints,
  availableEnemies,
  onStartCombat,
  onStopCombat
}) => {
  const handleStartCombat = (enemyId: string) => {
    onStartCombat(enemyId);
  };

  const calculateHealthPercentage = (current: number, max: number): number => {
    return Math.floor((current / max) * 100);
  };

  return (
    <div className="combat-panel">
      <h2>Combat</h2>
      
      <div className="player-stats">
        <h3>Your Stats</h3>
        <div className="stats-grid">
          <div className="stat">
            <span className="stat-name">Attack:</span>
            <span className="stat-value">{playerAttack}</span>
          </div>
          <div className="stat">
            <span className="stat-name">Strength:</span>
            <span className="stat-value">{playerStrength}</span>
          </div>
          <div className="stat">
            <span className="stat-name">Defense:</span>
            <span className="stat-value">{playerDefense}</span>
          </div>
          <div className="stat">
            <span className="stat-name">Hitpoints:</span>
            <span className="stat-value">{playerHitpoints}</span>
          </div>
        </div>
      </div>
      
      {isFighting && currentEnemy ? (
        <div className="combat-active">
          <h3>Fighting {currentEnemy.name}</h3>
          
          <div className="enemy-health">
            <div className="health-bar">
              <div 
                className="health-progress" 
                style={{ 
                  width: `${calculateHealthPercentage(currentEnemy.health, currentEnemy.maxHealth)}%` 
                }}
              ></div>
            </div>
            <span className="health-text">
              {currentEnemy.health} / {currentEnemy.maxHealth} HP
            </span>
          </div>
          
          <div className="enemy-stats">
            <div className="stat">
              <span className="stat-name">Attack:</span>
              <span className="stat-value">{currentEnemy.attack}</span>
            </div>
            <div className="stat">
              <span className="stat-name">Defense:</span>
              <span className="stat-value">{currentEnemy.defense}</span>
            </div>
          </div>
          
          <button 
            className="combat-btn stop-btn"
            onClick={onStopCombat}
          >
            Flee
          </button>
        </div>
      ) : (
        <div className="combat-select">
          <h3>Select an Enemy</h3>
          <div className="enemy-list">
            {availableEnemies.map((enemy) => (
              <div key={enemy.id} className="enemy-card">
                <div className="enemy-info">
                  <span className="enemy-name">{enemy.name}</span>
                  <span className="enemy-level">
                    ATK: {enemy.attack} | DEF: {enemy.defense} | HP: {enemy.maxHealth}
                  </span>
                </div>
                <button 
                  className="combat-btn start-btn"
                  onClick={() => handleStartCombat(enemy.id)}
                >
                  Fight
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CombatPanel;