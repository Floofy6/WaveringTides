import { useState, useCallback, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { useInventory } from './useInventory';
import { Enemy } from '../types';
import { SKILL_IDS, ENEMIES, ITEM_IDS, ITEMS } from '../constants';

/**
 * useCombat hook - Manages combat-related state and operations
 */
export const useCombat = () => {
  const { gameState, updateGameState } = useGameContext();
  const { addItem } = useInventory();
  
  // Use enemies from constants rather than mock data
  const [enemies] = useState<Enemy[]>(Object.values(ENEMIES));
  
  // Local state for combat
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [combatInterval, setCombatInterval] = useState<NodeJS.Timeout | null>(null);
  const [combatTick, setCombatTick] = useState<number>(0); // Used to trigger combat animations
  
  // Track separate timers for player and enemy attacks
  const [lastPlayerAttack, setLastPlayerAttack] = useState<number>(0);
  const [lastEnemyAttack, setLastEnemyAttack] = useState<number>(0);
  const [playerAttackTimer, setPlayerAttackTimer] = useState<NodeJS.Timeout | null>(null);
  const [enemyAttackTimer, setEnemyAttackTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Compute player stats from the game state
  const getPlayerStats = useCallback(() => {
    if (!gameState?.player) return { attack: 1, strength: 1, defense: 1, health: 10, maxHealth: 10 };
    
    const attack = gameState.player.skills[SKILL_IDS.ATTACK]?.level || 1;
    const strength = gameState.player.skills[SKILL_IDS.STRENGTH]?.level || 1;
    const defense = gameState.player.skills[SKILL_IDS.DEFENCE]?.level || 1;
    
    // Health is stored as XP in hitpoints skill
    // If not defined or <= 0, default to 10 (minimum health)
    const health = Math.max(10, gameState.player.skills[SKILL_IDS.HITPOINTS]?.xp || 10);
    
    // Max health calculation: 10 base + 4 per hitpoints level
    const hitpointsLevel = gameState.player.skills[SKILL_IDS.HITPOINTS]?.level || 1;
    const maxHealth = 10 + (hitpointsLevel * 4);
    
    // Add equipment bonuses
    const attackBonus = gameState.player.equipment.weapon?.stats?.attackBonus || 0;
    const strengthBonus = gameState.player.equipment.weapon?.stats?.strengthBonus || 0;
    const defenseBonus = gameState.player.equipment.armor?.stats?.defenseBonus || 0;
    
    return {
      attack: attack + attackBonus,
      strength: strength + strengthBonus,
      defense: defense + defenseBonus,
      health,
      maxHealth
    };
  }, [gameState]);
  
  // Calculate combat stats
  const playerStats = getPlayerStats();
  
  /**
   * Add a message to the combat log
   */
  const addLogMessage = useCallback((message: string) => {
    setCombatLog(prevLog => [message, ...prevLog].slice(0, 50)); // Keep last 50 messages
  }, []);
  
  /**
   * Calculate damage based on attacker and defender stats
   * Improved formula for more balanced combat
   */
  const calculateDamage = useCallback((attackerAttack: number, attackerStrength: number, defenderDefense: number) => {
    try {
      // Calculate hit chance - improved formula
      // Higher attack vs defense = better chance to hit
      const effectiveAttack = attackerAttack + 10; // Increased base value for better early game hit chance
      const hitChance = Math.min(0.95, Math.max(0.2, effectiveAttack / (effectiveAttack + defenderDefense * 0.7)));
      const didHit = Math.random() < hitChance;
      
      if (!didHit) return 0;
      
      // Base damage calculation - improved for more consistent damage
      // Higher strength = higher potential damage
      const maxHit = Math.floor(1 + (attackerStrength * 0.15)); // Increased base damage multiplier
      const damageVariation = 0.7; // 70% variation to make damage more consistent
      const minDamage = Math.max(1, Math.floor(maxHit * (1 - damageVariation)));
      const damage = Math.floor(minDamage + Math.random() * (maxHit - minDamage + 1));
      
      return Math.max(1, damage); // Always hit at least 1 if the attack lands
    } catch (error) {
      console.error('Error calculating damage:', error);
      return 1; // Fallback to minimum damage on error
    }
  }, []);
  
  /**
   * Calculate XP required for next level using OSRS-inspired formula
   */
  const calculateXpForNextLevel = useCallback((level: number): number => {
    return Math.floor(100 * (level ** 1.5));
  }, []);
  
  /**
   * Handle enemy defeat and loot
   */
  const handleEnemyDefeated = useCallback((enemy: Enemy) => {
    console.log("Handling enemy defeat:", enemy.name);
    
    // Stop combat loop
    if (combatInterval) {
      console.log("Clearing combat interval");
      clearInterval(combatInterval);
      setCombatInterval(null);
    }
    
    // Stop attack timers
    if (playerAttackTimer) {
      console.log("Clearing player attack timer");
      clearTimeout(playerAttackTimer);
      setPlayerAttackTimer(null);
    }
    
    if (enemyAttackTimer) {
      console.log("Clearing enemy attack timer");
      clearTimeout(enemyAttackTimer);
      setEnemyAttackTimer(null);
    }
    
    addLogMessage(`You defeated the ${enemy.name}!`);
    
    // Process loot drops
    const lootMessages: string[] = [];
    const lootItems: any[] = [];
    
    enemy.lootTable.forEach(loot => {
      if (Math.random() <= loot.chance) {
        lootMessages.push(`You received ${loot.quantity} ${loot.itemId}!`);
        
        // Use the item constants directly
        const itemName = ITEMS[loot.itemId]?.name || loot.itemId;
        
        lootItems.push({
          id: loot.itemId,
          name: itemName,
          quantity: loot.quantity,
          type: ITEMS[loot.itemId]?.type || 'resource',
          sellPrice: ITEMS[loot.itemId]?.sellPrice || 5,
          stats: ITEMS[loot.itemId]?.stats
        });
      }
    });
    
    // Award gold
    const goldAmount = Math.floor(Math.random() * (enemy.maxHealth / 2)) + 5;
    lootMessages.push(`You found ${goldAmount} gold!`);
    
    // Update player state with loot and gold
    updateGameState(prevState => {
      if (!prevState) return prevState;
      
      const newState = JSON.parse(JSON.stringify(prevState));
      
      // Add gold
      newState.player.gold += goldAmount;
      
      // Add items to inventory - directly update inventory in the state
      lootItems.forEach(item => {
        if (newState.player.inventory[item.id]) {
          newState.player.inventory[item.id].quantity += item.quantity;
        } else {
          newState.player.inventory[item.id] = item;
        }
      });
      
      // Reset combat state
      newState.player.combat = {
        isFighting: false,
        currentEnemy: undefined
      };
      
      return newState;
    });
    
    // Display loot messages
    lootMessages.forEach(msg => addLogMessage(msg));
    
    // Reset current enemy
    console.log("Resetting current enemy to null");
    setCurrentEnemy(null);
  }, [combatInterval, playerAttackTimer, enemyAttackTimer, addLogMessage, updateGameState]);
  
  /**
   * Handle player defeat
   */
  const handlePlayerDefeated = useCallback(() => {
    console.log("Handling player defeat");
    
    // Stop combat loop
    if (combatInterval) {
      console.log("Clearing combat interval");
      clearInterval(combatInterval);
      setCombatInterval(null);
    }
    
    // Stop attack timers
    if (playerAttackTimer) {
      console.log("Clearing player attack timer");
      clearTimeout(playerAttackTimer);
      setPlayerAttackTimer(null);
    }
    
    if (enemyAttackTimer) {
      console.log("Clearing enemy attack timer");
      clearTimeout(enemyAttackTimer);
      setEnemyAttackTimer(null);
    }
    
    addLogMessage('You have been defeated!');
    
    // Update player state - reset combat and restore some health
    updateGameState(prevState => {
      if (!prevState) return prevState;
      
      const newState = JSON.parse(JSON.stringify(prevState));
      
      // Reset combat state
      newState.player.combat = {
        isFighting: false,
        currentEnemy: undefined
      };
      
      // Restore some hitpoints - 25% of max health
      if (newState.player.skills[SKILL_IDS.HITPOINTS]) {
        const hitpointsLevel = newState.player.skills[SKILL_IDS.HITPOINTS].level || 1;
        const maxHealth = 10 + (hitpointsLevel * 4);
        newState.player.skills[SKILL_IDS.HITPOINTS].xp = Math.floor(maxHealth * 0.25);
        addLogMessage('You wake up with some health restored.');
      }
      
      return newState;
    });
    
    // Reset current enemy
    console.log("Resetting current enemy to null");
    setCurrentEnemy(null);
  }, [combatInterval, playerAttackTimer, enemyAttackTimer, addLogMessage, updateGameState]);
  
  /**
   * Calculate player's attack speed in milliseconds
   * Lower numbers mean faster attacks
   */
  const getPlayerAttackSpeed = useCallback(() => {
    // Base attack speed
    let attackSpeed = 2000; // Base: 2 seconds between attacks
    
    // Factor in weapon type
    if (gameState?.player?.equipment?.weapon) {
      const weapon = gameState.player.equipment.weapon;
      console.log("Player weapon found:", weapon.name);
      
      // Different weapons have different speeds
      if (weapon.id === ITEM_IDS.BRONZE_SWORD) {
        attackSpeed = 1800; // Swords are faster
        console.log("Sword equipped - base speed is now 1800ms");
      }
      
      // Weapon quality can further improve speed
      if (weapon.stats?.attackBonus) {
        // Each point of attack bonus reduces attack time by 50ms
        const reduction = weapon.stats.attackBonus * 50;
        attackSpeed -= reduction;
        console.log(`Weapon bonus reduces attack time by ${reduction}ms`);
      }
    }
    
    // Factor in skills - higher attack level = faster attacks
    const attackLevel = gameState?.player?.skills[SKILL_IDS.ATTACK]?.level || 1;
    // Each level above 1 reduces attack time by 20ms
    const levelReduction = (attackLevel - 1) * 20;
    attackSpeed -= levelReduction;
    console.log(`Attack level ${attackLevel} reduces attack time by ${levelReduction}ms`);
    
    // Ensure attack speed doesn't go below minimum (very fast)
    const finalSpeed = Math.max(800, attackSpeed);
    console.log(`Final player attack speed: ${finalSpeed}ms`);
    return finalSpeed;
  }, [gameState]);
  
  /**
   * Process player attack
   */
  const processPlayerAttack = useCallback(() => {
    if (!currentEnemy || !gameState?.player) {
      console.log("Cannot process player attack - missing enemy or player data");
      return;
    }
    
    console.log("Processing player attack against", currentEnemy.name);
    
    // Get current player stats
    const stats = getPlayerStats();
    console.log("Player stats:", stats);
    
    // Player attacks enemy
    const playerDamage = calculateDamage(stats.attack, stats.strength, currentEnemy.defense);
    console.log("Player damage calculated:", playerDamage);
    
    if (playerDamage > 0) {
      // Update enemy health
      const newEnemyHealth = Math.max(0, currentEnemy.health - playerDamage);
      console.log(`Enemy health: ${currentEnemy.health} -> ${newEnemyHealth}`);
      
      setCurrentEnemy(prev => {
        if (!prev) return null;
        const updated = { ...prev, health: newEnemyHealth };
        console.log("Updated enemy:", updated);
        return updated;
      });
      
      // Add attack message to combat log
      addLogMessage(`You hit the ${currentEnemy.name} for ${playerDamage} damage!`);
      
      // Trigger animation
      setCombatTick(prev => prev + 1);
      
      // Award combat XP
      updateGameState(prevState => {
        if (!prevState) return prevState;
        
        const newState = JSON.parse(JSON.stringify(prevState));
        
        // Add XP to Attack and Strength
        if (newState.player.skills[SKILL_IDS.ATTACK]) {
          const attackXp = playerDamage * 4;
          const currentAttackXp = newState.player.skills[SKILL_IDS.ATTACK].xp || 0;
          newState.player.skills[SKILL_IDS.ATTACK].xp = currentAttackXp + attackXp;
          
          // Check for level ups
          const attackLevel = newState.player.skills[SKILL_IDS.ATTACK].level;
          const xpForNextLevel = calculateXpForNextLevel(attackLevel);
          if (newState.player.skills[SKILL_IDS.ATTACK].xp >= xpForNextLevel) {
            newState.player.skills[SKILL_IDS.ATTACK].level += 1;
            addLogMessage(`Congratulations! Your Attack level is now ${newState.player.skills[SKILL_IDS.ATTACK].level}`);
          }
        }
        
        if (newState.player.skills[SKILL_IDS.STRENGTH]) {
          const strengthXp = playerDamage * 4;
          const currentStrengthXp = newState.player.skills[SKILL_IDS.STRENGTH].xp || 0;
          newState.player.skills[SKILL_IDS.STRENGTH].xp = currentStrengthXp + strengthXp;
          
          // Check for level ups
          const strengthLevel = newState.player.skills[SKILL_IDS.STRENGTH].level;
          const xpForNextLevel = calculateXpForNextLevel(strengthLevel);
          if (newState.player.skills[SKILL_IDS.STRENGTH].xp >= xpForNextLevel) {
            newState.player.skills[SKILL_IDS.STRENGTH].level += 1;
            addLogMessage(`Congratulations! Your Strength level is now ${newState.player.skills[SKILL_IDS.STRENGTH].level}`);
          }
        }
        
        return newState;
      });
      
      // Check if enemy is defeated
      if (newEnemyHealth <= 0) {
        console.log("Enemy defeated!");
        handleEnemyDefeated(currentEnemy);
        return;
      }
    } else {
      addLogMessage(`Your attack missed the ${currentEnemy.name}!`);
      // Still trigger animation for the miss
      setCombatTick(prev => prev + 1);
    }
    
    // Schedule next player attack
    setLastPlayerAttack(Date.now());
    console.log("Player attack completed, next attack scheduled");
  }, [currentEnemy, gameState, getPlayerStats, calculateDamage, addLogMessage, updateGameState, calculateXpForNextLevel, handleEnemyDefeated]);
  
  /**
   * Process enemy attack
   */
  const processEnemyAttack = useCallback(() => {
    if (!currentEnemy || !gameState?.player) {
      console.log("Cannot process enemy attack - missing enemy or player data");
      return;
    }
    
    console.log("Processing enemy attack from", currentEnemy.name);
    
    const stats = getPlayerStats();
    console.log("Player stats for defense:", stats);
    
    // Enemy attacks player
    const enemyDamage = calculateDamage(currentEnemy.attack, currentEnemy.attack, stats.defense);
    console.log("Enemy damage calculated:", enemyDamage);
    
    if (enemyDamage > 0) {
      addLogMessage(`The ${currentEnemy.name} hits you for ${enemyDamage} damage!`);
      
      // Trigger animation
      setCombatTick(prev => prev + 2); // Use a different number to trigger a different animation
      
      // Update player health and award Defense XP
      updateGameState(prevState => {
        if (!prevState) return prevState;
        
        const newState = JSON.parse(JSON.stringify(prevState));
        
        // Add XP to Defense (positive XP for being hit)
        if (newState.player.skills[SKILL_IDS.DEFENCE]) {
          const defenseXp = enemyDamage * 4;
          const currentDefenseXp = newState.player.skills[SKILL_IDS.DEFENCE].xp || 0;
          newState.player.skills[SKILL_IDS.DEFENCE].xp = currentDefenseXp + defenseXp;
          
          // Check for level ups
          const defenseLevel = newState.player.skills[SKILL_IDS.DEFENCE].level;
          const xpForNextLevel = calculateXpForNextLevel(defenseLevel);
          if (newState.player.skills[SKILL_IDS.DEFENCE].xp >= xpForNextLevel) {
            newState.player.skills[SKILL_IDS.DEFENCE].level += 1;
            addLogMessage(`Congratulations! Your Defense level is now ${newState.player.skills[SKILL_IDS.DEFENCE].level}`);
          }
        }
        
        // Reduce Hitpoints XP (as damage)
        if (newState.player.skills[SKILL_IDS.HITPOINTS]) {
          const currentHitpointsXp = newState.player.skills[SKILL_IDS.HITPOINTS].xp || 10;
          const newHitpointsXp = Math.max(0, currentHitpointsXp - enemyDamage);
          console.log(`Player health: ${currentHitpointsXp} -> ${newHitpointsXp}`);
          
          newState.player.skills[SKILL_IDS.HITPOINTS].xp = newHitpointsXp;
          
          // Check if player is defeated
          if (newHitpointsXp <= 0) {
            console.log("Player defeated!");
            handlePlayerDefeated();
          }
        }
        
        return newState;
      });
    } else {
      addLogMessage(`The ${currentEnemy.name}'s attack missed you!`);
      // Still trigger animation for the miss
      setCombatTick(prev => prev + 2);
    }
    
    // Schedule next enemy attack
    setLastEnemyAttack(Date.now());
    console.log("Enemy attack completed, next attack scheduled");
  }, [currentEnemy, gameState, getPlayerStats, calculateDamage, addLogMessage, updateGameState, calculateXpForNextLevel, handlePlayerDefeated]);
  
  /**
   * Process a single combat round - now manages the timing for both player and enemy attacks
   */
  const processCombatRound = useCallback(() => {
    if (!currentEnemy || !gameState?.player) {
      console.log("Combat round skipped - no enemy or player");
      return;
    }
    
    const now = Date.now();
    const playerSpeed = getPlayerAttackSpeed();
    const enemySpeed = currentEnemy.attackSpeed || 2000; // Default to 2 seconds if not specified
    
    // Check if it's time for player to attack
    const timeSincePlayerAttack = now - lastPlayerAttack;
    if (timeSincePlayerAttack >= playerSpeed) {
      console.log(`Player attack triggered (${timeSincePlayerAttack}ms elapsed, speed: ${playerSpeed}ms)`);
      processPlayerAttack();
    }
    
    // Check if it's time for enemy to attack
    const timeSinceEnemyAttack = now - lastEnemyAttack;
    if (timeSinceEnemyAttack >= enemySpeed) {
      console.log(`Enemy attack triggered (${timeSinceEnemyAttack}ms elapsed, speed: ${enemySpeed}ms)`);
      processEnemyAttack();
    }
  }, [currentEnemy, gameState, getPlayerAttackSpeed, lastPlayerAttack, lastEnemyAttack, processPlayerAttack, processEnemyAttack]);
  
  /**
   * Start combat with an enemy
   */
  const startCombat = useCallback((enemyId: string) => {
    console.log("Starting combat with enemy:", enemyId);
    
    // Stop any existing combat
    if (combatInterval) {
      clearInterval(combatInterval);
      setCombatInterval(null);
    }
    
    if (playerAttackTimer) {
      clearTimeout(playerAttackTimer);
      setPlayerAttackTimer(null);
    }
    
    if (enemyAttackTimer) {
      clearTimeout(enemyAttackTimer);
      setEnemyAttackTimer(null);
    }
    
    // Find the enemy
    const enemy = enemies.find(e => e.id === enemyId);
    if (!enemy) {
      console.error(`Enemy with ID ${enemyId} not found`);
      return;
    }
    
    // Clone the enemy to avoid modifying the original
    const enemyClone: Enemy = {
      ...enemy,
      health: enemy.maxHealth, // Reset health
      attackSpeed: enemy.attackSpeed || 2000 // Ensure attackSpeed is set
    };
    
    console.log("Enemy clone created:", enemyClone);
    
    setCurrentEnemy(enemyClone);
    setCombatLog([`Combat started with ${enemyClone.name}!`]);
    
    // Reset attack timers
    const now = Date.now();
    setLastPlayerAttack(now);
    setLastEnemyAttack(now);
    
    // Update game state
    updateGameState(prevState => {
      if (!prevState) return prevState;
      
      return {
        ...prevState,
        player: {
          ...prevState.player,
          combat: {
            currentEnemy: enemyClone,
            isFighting: true
          }
        }
      };
    });
    
    // Process the first player attack immediately
    console.log("Processing first player attack");
    processPlayerAttack();
    
    // Set up the enemy's first attack with appropriate delay
    console.log("Setting up enemy attack timer");
    const enemyDelay = enemyClone.attackSpeed / 2; // Half the enemy's speed for first attack
    console.log("Enemy will attack in", enemyDelay, "ms");
    
    const enemyTimer = setTimeout(() => {
      console.log("Processing enemy attack from timer");
      processEnemyAttack();
    }, enemyDelay);
    
    setEnemyAttackTimer(enemyTimer);
    
    // Start combat loop - check for attacks every 100ms
    console.log("Setting up combat interval");
    const interval = setInterval(() => {
      console.log("Combat round check");
      processCombatRound();
    }, 100);
    setCombatInterval(interval);
    
    return () => {
      console.log("Cleaning up combat timers");
      clearInterval(interval);
      clearTimeout(enemyTimer);
    };
  }, [enemies, combatInterval, playerAttackTimer, enemyAttackTimer, updateGameState, processCombatRound, processPlayerAttack, processEnemyAttack]);
  
  /**
   * Flee from combat
   */
  const fleeCombat = useCallback(() => {
    if (!currentEnemy) return;
    
    // Always succeed at fleeing
    addLogMessage('You successfully fled from combat!');
    
    // Stop combat loop
    if (combatInterval) {
      clearInterval(combatInterval);
      setCombatInterval(null);
    }
    
    // Stop attack timers
    if (playerAttackTimer) {
      clearTimeout(playerAttackTimer);
      setPlayerAttackTimer(null);
    }
    
    if (enemyAttackTimer) {
      clearTimeout(enemyAttackTimer);
      setEnemyAttackTimer(null);
    }
    
    // Update player state
    updateGameState(prevState => {
      if (!prevState) return prevState;
      
      return {
        ...prevState,
        player: {
          ...prevState.player,
          combat: {
            isFighting: false,
            currentEnemy: undefined
          }
        }
      };
    });
    
    // Reset current enemy
    setCurrentEnemy(null);
  }, [currentEnemy, combatInterval, playerAttackTimer, enemyAttackTimer, addLogMessage, updateGameState]);
  
  // Clean up interval and timers on unmount
  useEffect(() => {
    return () => {
      if (combatInterval) {
        clearInterval(combatInterval);
      }
      if (playerAttackTimer) {
        clearTimeout(playerAttackTimer);
      }
      if (enemyAttackTimer) {
        clearTimeout(enemyAttackTimer);
      }
    };
  }, [combatInterval, playerAttackTimer, enemyAttackTimer]);
  
  return {
    enemies,
    currentEnemy,
    isFighting: !!currentEnemy,
    playerStats,
    combatLog,
    combatTick, // Expose combat tick for animations
    startCombat,
    fleeCombat,
    processCombatRound // Exposed for manual combat if needed
  };
}; 