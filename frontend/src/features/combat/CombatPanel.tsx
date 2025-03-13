import React, { useState, useEffect } from 'react';
import { useGameContext } from '../../context/GameContext';
import { Enemy } from '../../types';
import './CombatPanel.css';

// Sample enemies data - in a real implementation, this would come from your game state
const enemies: Enemy[] = [
  {
    id: 'goblin',
    name: 'Goblin',
    attack: 5,
    defense: 3,
    health: 20,
    maxHealth: 20,
    lootTable: []
  },
  {
    id: 'wolf',
    name: 'Wolf',
    attack: 7,
    defense: 2,
    health: 15,
    maxHealth: 15,
    lootTable: []
  },
  {
    id: 'bandit',
    name: 'Bandit',
    attack: 8,
    defense: 5,
    health: 25,
    maxHealth: 25,
    lootTable: []
  }
];

/**
 * CombatPanel component - Handles combat UI and interactions
 */
const CombatPanel: React.FC = () => {
  const { gameState } = useGameContext();
  const [selectedEnemy, setSelectedEnemy] = useState<Enemy | null>(null);
  const [combatActive, setCombatActive] = useState(false);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [inCombat, setInCombat] = useState(false); // Track if player is actually fighting
  const [playerHealth, setPlayerHealth] = useState(100);
  const [playerMaxHealth, setPlayerMaxHealth] = useState(100);
  const [playerAttack, setPlayerAttack] = useState(10); // Default attack value
  
  // Reset enemy health when selecting a new one
  const resetSelectedEnemy = (enemy: Enemy) => {
    return {
      ...enemy,
      health: enemy.maxHealth // Reset to full health
    };
  };
  
  // Handle enemy selection
  const handleSelectEnemy = (enemy: Enemy) => {
    if (inCombat) return; // Prevent changing enemy during combat
    
    // Reset enemy health when selected
    const freshEnemy = resetSelectedEnemy(enemy);
    setSelectedEnemy(freshEnemy);
    setCombatActive(false); // Reset combat state when selecting a new enemy
    
    // Add selection to combat log
    addToCombatLog(`You've selected a ${freshEnemy.name} as your opponent.`);
  };
  
  // Handle starting combat
  const handleStartCombat = () => {
    if (!selectedEnemy) return;
    
    setCombatActive(true);
    addToCombatLog(`Combat with ${selectedEnemy.name} has begun!`);
  };
  
  // Calculate player damage against enemy
  const calculateDamage = () => {
    if (!selectedEnemy) return 0;
    
    // Base damage formula that considers player attack and enemy defense
    const baseDamage = Math.max(1, playerAttack - selectedEnemy.defense / 2);
    
    // Add some randomness (80% to 120% of base damage)
    const randomFactor = 0.8 + Math.random() * 0.4;
    
    // Calculate final damage
    const damage = Math.round(baseDamage * randomFactor);
    
    return Math.max(1, damage); // Always deal at least 1 damage
  };
  
  // Handle attacking the enemy
  const handleAttack = () => {
    if (!selectedEnemy || !combatActive) return;
    
    setInCombat(true);
    
    // Calculate damage
    const damage = calculateDamage();
    
    // Apply damage to enemy
    const updatedHealth = Math.max(0, selectedEnemy.health - damage);
    
    // Update enemy health
    setSelectedEnemy({
      ...selectedEnemy,
      health: updatedHealth
    });
    
    // Add attack message to combat log
    addToCombatLog(`You hit the ${selectedEnemy.name} for ${damage} damage!`);
    
    // Check if enemy is defeated
    if (updatedHealth <= 0) {
      handleEnemyDefeated();
    } else {
      // Enemy counterattack
      handleEnemyAttack();
    }
  };
  
  // Handle enemy counterattack
  const handleEnemyAttack = () => {
    if (!selectedEnemy) return;
    
    // Calculate enemy damage (simple formula for now)
    const baseDamage = Math.max(1, selectedEnemy.attack - 5);
    const randomFactor = 0.7 + Math.random() * 0.6;
    const damage = Math.max(1, Math.round(baseDamage * randomFactor));
    
    // Update player health
    const updatedHealth = Math.max(0, playerHealth - damage);
    setPlayerHealth(updatedHealth);
    
    // Add message to combat log
    addToCombatLog(`The ${selectedEnemy.name} hits you for ${damage} damage!`);
    
    // Check if player is defeated
    if (updatedHealth <= 0) {
      handlePlayerDefeated();
    }
  };
  
  // Handle enemy defeat
  const handleEnemyDefeated = () => {
    setCombatActive(false);
    setInCombat(false);
    
    // Add victory message
    addToCombatLog(`You have defeated the ${selectedEnemy?.name}!`);
    addToCombatLog(`Victory! You earned some XP and loot.`);
    
    // Reset player health after a short delay if needed
    setTimeout(() => {
      setPlayerHealth(playerMaxHealth);
    }, 2000);
    
    // Respawn the enemy after a short delay
    setTimeout(() => {
      if (selectedEnemy) {
        const respawnedEnemy = resetSelectedEnemy(selectedEnemy);
        setSelectedEnemy(respawnedEnemy);
        addToCombatLog(`A new ${respawnedEnemy.name} has appeared!`);
      }
    }, 3000);
  };
  
  // Handle player defeat
  const handlePlayerDefeated = () => {
    setCombatActive(false);
    setInCombat(false);
    
    // Add defeat message
    addToCombatLog(`You have been defeated by the ${selectedEnemy?.name}!`);
    
    // Reset player after a short delay
    setTimeout(() => {
      setPlayerHealth(playerMaxHealth);
    }, 2000);
  };
  
  // Handle stopping combat
  const handleStopCombat = () => {
    setCombatActive(false);
    setInCombat(false);
    addToCombatLog(`You've retreated from combat.`);
    
    // Reset enemy health
    if (selectedEnemy) {
      setSelectedEnemy(resetSelectedEnemy(selectedEnemy));
    }
  };
  
  // Add message to combat log
  const addToCombatLog = (message: string) => {
    setCombatLog(prev => [message, ...prev].slice(0, 50)); // Keep last 50 messages
  };
  
  // Reset player health when component mounts
  useEffect(() => {
    setPlayerHealth(playerMaxHealth);
  }, [playerMaxHealth]);
  
  return (
    <div className="combat-panel">
      <h2>Combat</h2>
      
      <div className="combat-container">
        <div className="enemy-selection">
          <h3>Choose an Enemy</h3>
          <div className="enemy-list">
            {enemies.map(enemy => (
              <div 
                key={enemy.id}
                className={`enemy-card ${selectedEnemy?.id === enemy.id ? 'selected' : ''}`}
                onClick={() => handleSelectEnemy(enemy)}
              >
                <div className="enemy-info">
                  <h4 className="enemy-name">{enemy.name}</h4>
                  <div className="enemy-stats">
                    <span className="stat">ATK: {enemy.attack}</span>
                    <span className="stat">DEF: {enemy.defense}</span>
                    <span className="stat">HP: {enemy.maxHealth}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="combat-status">
          <h3>Combat Status</h3>
          {selectedEnemy ? (
            <div className="selected-enemy-details">
              <h4>Fighting: {selectedEnemy.name}</h4>
              
              <div className="health-bars">
                <div className="health-bar-container">
                  <label>Enemy Health:</label>
                  <div className="health-bar">
                    <div 
                      className="health-fill enemy-health" 
                      style={{ width: `${(selectedEnemy.health / selectedEnemy.maxHealth) * 100}%` }}
                    ></div>
                  </div>
                  <div className="health-text">{selectedEnemy.health} / {selectedEnemy.maxHealth}</div>
                </div>
                
                <div className="health-bar-container">
                  <label>Your Health:</label>
                  <div className="health-bar">
                    <div 
                      className="health-fill player-health" 
                      style={{ width: `${(playerHealth / playerMaxHealth) * 100}%` }}
                    ></div>
                  </div>
                  <div className="health-text">{playerHealth} / {playerMaxHealth}</div>
                </div>
              </div>
              
              <div className="combat-controls">
                {!combatActive ? (
                  <button 
                    className="combat-btn start-combat" 
                    onClick={handleStartCombat}
                  >
                    Start Combat
                  </button>
                ) : (
                  <div className="combat-buttons-container">
                    <button 
                      className="combat-btn fight-btn" 
                      onClick={handleAttack}
                      disabled={selectedEnemy.health <= 0 || playerHealth <= 0}
                    >
                      Fight
                    </button>
                    <button 
                      className="combat-btn stop-combat" 
                      onClick={handleStopCombat}
                    >
                      Retreat
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="no-enemy-selected">
              <p>Select an enemy to begin combat</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="combat-log-container">
        <h3>Combat Log</h3>
        <div className="combat-log">
          {combatLog.length > 0 ? (
            <ul>
              {combatLog.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          ) : (
            <p className="empty-log">No combat activity yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CombatPanel; 