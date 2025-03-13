import { useState, useCallback, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { useInventory } from './useInventory';
import { Enemy } from '../types';

/**
 * useCombat hook - Manages combat-related state and operations
 */
export const useCombat = () => {
  const { gameState, updateGameState } = useGameContext();
  const { addItem } = useInventory();
  
  // Mock enemies for now - in a real app, these would come from the game state
  const [enemies] = useState<Enemy[]>([
    {
      id: 'enemy_goblin',
      name: 'Goblin',
      attack: 5,
      defense: 3,
      health: 20,
      maxHealth: 20,
      lootTable: [
        { itemId: 'item_gold_coin', quantity: 5, chance: 1.0 },
        { itemId: 'item_goblin_ear', quantity: 1, chance: 0.5 }
      ]
    },
    {
      id: 'enemy_wolf',
      name: 'Wolf',
      attack: 7,
      defense: 2,
      health: 15,
      maxHealth: 15,
      lootTable: [
        { itemId: 'item_wolf_pelt', quantity: 1, chance: 0.8 },
        { itemId: 'item_wolf_fang', quantity: 1, chance: 0.3 }
      ]
    },
    {
      id: 'enemy_bandit',
      name: 'Bandit',
      attack: 8,
      defense: 5,
      health: 25,
      maxHealth: 25,
      lootTable: [
        { itemId: 'item_gold_coin', quantity: 10, chance: 1.0 },
        { itemId: 'item_dagger', quantity: 1, chance: 0.2 }
      ]
    }
  ]);
  
  // Local state for combat
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [isFighting, setIsFighting] = useState(false);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [playerMaxHealth, setPlayerMaxHealth] = useState(100);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  
  // Reset player health when not in combat
  useEffect(() => {
    if (!isFighting) {
      setPlayerHealth(playerMaxHealth);
    }
  }, [isFighting, playerMaxHealth]);
  
  /**
   * Add a message to the combat log
   */
  const addLogMessage = useCallback((message: string) => {
    setCombatLog(prevLog => [...prevLog, message]);
  }, []);
  
  /**
   * Start combat with an enemy
   */
  const startCombat = useCallback((enemyId: string) => {
    const enemy = enemies.find(e => e.id === enemyId);
    if (!enemy) return;
    
    // Clone the enemy to avoid modifying the original
    const enemyClone: Enemy = {
      ...enemy,
      health: enemy.maxHealth // Reset health
    };
    
    setCurrentEnemy(enemyClone);
    setIsFighting(true);
    setCombatLog([`Combat started with ${enemyClone.name}!`]);
  }, [enemies]);
  
  /**
   * Attack the current enemy
   */
  const attackEnemy = useCallback(() => {
    if (!currentEnemy || !isFighting) return;
    
    // Calculate player damage (simplified formula)
    const playerAttack = 10; // This would come from player stats + equipment
    const damageToEnemy = Math.max(1, playerAttack - currentEnemy.defense);
    
    // Update enemy health
    const updatedEnemy = {
      ...currentEnemy,
      health: Math.max(0, currentEnemy.health - damageToEnemy)
    };
    
    addLogMessage(`You hit ${currentEnemy.name} for ${damageToEnemy} damage!`);
    setCurrentEnemy(updatedEnemy);
    
    // Check if enemy is defeated
    if (updatedEnemy.health <= 0) {
      handleEnemyDefeated(updatedEnemy);
      return;
    }
    
    // Enemy counterattack
    const enemyDamage = Math.max(1, currentEnemy.attack - 5); // 5 is player defense
    setPlayerHealth(prev => Math.max(0, prev - enemyDamage));
    addLogMessage(`${currentEnemy.name} hits you for ${enemyDamage} damage!`);
    
    // Check if player is defeated
    if (playerHealth - enemyDamage <= 0) {
      handlePlayerDefeated();
    }
  }, [currentEnemy, isFighting, playerHealth, addLogMessage]);
  
  /**
   * Handle enemy defeat and loot
   */
  const handleEnemyDefeated = useCallback((enemy: Enemy) => {
    addLogMessage(`You defeated ${enemy.name}!`);
    
    // Process loot drops
    enemy.lootTable.forEach(loot => {
      if (Math.random() <= loot.chance) {
        addLogMessage(`You found ${loot.quantity} ${loot.itemId}!`);
        // In a real app, you would look up the item details
        addItem({
          id: loot.itemId,
          name: loot.itemId.replace('item_', '').replace('_', ' '),
          quantity: loot.quantity,
          type: 'resource',
          sellPrice: 5 // Mock value
        });
      }
    });
    
    // End combat
    setIsFighting(false);
    setCurrentEnemy(null);
  }, [addLogMessage, addItem]);
  
  /**
   * Handle player defeat
   */
  const handlePlayerDefeated = useCallback(() => {
    addLogMessage('You have been defeated!');
    setIsFighting(false);
    setCurrentEnemy(null);
  }, [addLogMessage]);
  
  /**
   * Flee from combat
   */
  const fleeCombat = useCallback(() => {
    if (!isFighting) return;
    
    // 70% chance to successfully flee
    if (Math.random() <= 0.7) {
      addLogMessage('You successfully fled from combat!');
      setIsFighting(false);
      setCurrentEnemy(null);
    } else {
      addLogMessage('You failed to flee!');
      
      // Enemy gets a free attack
      if (currentEnemy) {
        const enemyDamage = Math.max(1, currentEnemy.attack - 5);
        setPlayerHealth(prev => Math.max(0, prev - enemyDamage));
        addLogMessage(`${currentEnemy.name} hits you for ${enemyDamage} damage!`);
        
        // Check if player is defeated
        if (playerHealth - enemyDamage <= 0) {
          handlePlayerDefeated();
        }
      }
    }
  }, [isFighting, currentEnemy, playerHealth, addLogMessage, handlePlayerDefeated]);
  
  return {
    enemies,
    currentEnemy,
    isFighting,
    playerHealth,
    playerMaxHealth,
    combatLog,
    startCombat,
    attackEnemy,
    fleeCombat
  };
}; 