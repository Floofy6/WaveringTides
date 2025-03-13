import React, { useState, useEffect } from 'react';
import { useCombat } from '../../hooks/useCombat';
import { Enemy } from '../../types';
import CombatLog from './CombatLog';
import EnemyDisplay from './EnemyDisplay';
import PlayerCombatStats from './PlayerCombatStats';

/**
 * CombatPanel component - Handles combat interactions between player and enemies
 */
const CombatPanel: React.FC = () => {
  const { 
    enemies, 
    currentEnemy, 
    isFighting, 
    playerHealth, 
    playerMaxHealth,
    startCombat, 
    attackEnemy, 
    fleeCombat,
    combatLog
  } = useCombat();
  
  const [selectedEnemyId, setSelectedEnemyId] = useState<string | null>(null);
  
  // Auto-select first enemy if none selected
  useEffect(() => {
    if (!selectedEnemyId && enemies.length > 0) {
      setSelectedEnemyId(enemies[0].id);
    }
  }, [enemies, selectedEnemyId]);
  
  const handleSelectEnemy = (enemyId: string) => {
    setSelectedEnemyId(enemyId);
  };
  
  const handleStartCombat = () => {
    if (selectedEnemyId) {
      startCombat(selectedEnemyId);
    }
  };
  
  const handleAttack = () => {
    if (isFighting && currentEnemy) {
      attackEnemy();
    }
  };
  
  const handleFlee = () => {
    if (isFighting) {
      fleeCombat();
    }
  };
  
  // Find the selected enemy from the list
  const selectedEnemy = enemies.find(enemy => enemy.id === selectedEnemyId);
  
  return (
    <div className="combat-panel">
      <h2>Combat</h2>
      
      <div className="combat-container">
        <div className="enemy-selection">
          <h3>Choose an Enemy</h3>
          <div className="enemy-list">
            {enemies.map((enemy: Enemy) => (
              <div 
                key={enemy.id}
                className={`enemy-item ${selectedEnemyId === enemy.id ? 'selected' : ''}`}
                onClick={() => handleSelectEnemy(enemy.id)}
              >
                <div className="enemy-name">{enemy.name}</div>
                <div className="enemy-stats">
                  <span>ATK: {enemy.attack}</span>
                  <span>DEF: {enemy.defense}</span>
                  <span>HP: {enemy.health}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="combat-area">
          {isFighting && currentEnemy ? (
            <>
              <EnemyDisplay enemy={currentEnemy} />
              
              <div className="combat-actions">
                <button 
                  className="attack-button"
                  onClick={handleAttack}
                >
                  Attack
                </button>
                <button 
                  className="flee-button"
                  onClick={handleFlee}
                >
                  Flee
                </button>
              </div>
            </>
          ) : (
            <>
              {selectedEnemy && (
                <div className="selected-enemy-preview">
                  <h3>{selectedEnemy.name}</h3>
                  <div className="enemy-stats">
                    <p>Attack: {selectedEnemy.attack}</p>
                    <p>Defense: {selectedEnemy.defense}</p>
                    <p>Health: {selectedEnemy.health}</p>
                  </div>
                  
                  <button 
                    className="start-combat-button"
                    onClick={handleStartCombat}
                  >
                    Start Combat
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="combat-status">
          <PlayerCombatStats 
            health={playerHealth}
            maxHealth={playerMaxHealth}
          />
          
          <CombatLog logs={combatLog} />
        </div>
      </div>
    </div>
  );
};

export default CombatPanel; 