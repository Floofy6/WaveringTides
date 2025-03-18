import React, { useState, useEffect } from 'react';
import { useCombat } from '../../hooks/useCombat';
import CombatLog from './CombatLog';

// Enemy type emojis mapping
const ENEMY_EMOJIS: Record<string, string> = {
  goblin: '👺',
  rat: '🐀',
  bandit: '🥷',
  skeleton: '💀',
  slime: '🟢',
  spider: '🕷️',
  wolf: '🐺',
  zombie: '🧟',
  default: '👾'
};

/**
 * CombatPanel component - Handles combat UI and interactions
 * Optimized for desktop viewing with horizontal layout
 */
const CombatPanel: React.FC = () => {
  const {
    enemies,
    currentEnemy,
    isFighting,
    playerStats,
    combatLog,
    combatTick,
    startCombat,
    fleeCombat
  } = useCombat();
  
  // State for animations and effects
  const [playerAttackAnimation, setPlayerAttackAnimation] = useState(false);
  const [enemyAttackAnimation, setEnemyAttackAnimation] = useState(false);
  const [playerHitSplat, setPlayerHitSplat] = useState<number | null>(null);
  const [enemyHitSplat, setEnemyHitSplat] = useState<number | null>(null);
  
  // Helper function to format attack speed for display
  const formatAttackSpeed = (speedMs: number): string => {
    const speedPerSecond = (1000 / speedMs).toFixed(1);
    return `${speedPerSecond}/s`;
  };
  
  // Trigger animations based on combat tick changes
  useEffect(() => {
    // Early return if not fighting or no current enemy
    if (!isFighting || !currentEnemy) {
      // Reset animation states when not in combat
      setPlayerAttackAnimation(false);
      setEnemyAttackAnimation(false);
      setPlayerHitSplat(null);
      setEnemyHitSplat(null);
      return;
    }
    
    console.log("Combat tick updated:", combatTick);
    
    try {
      // If combat tick is odd, it's a player attack
      if (combatTick % 2 === 1) {
        console.log("Triggering player attack animation");
        
        // Player attack animation
        setPlayerAttackAnimation(true);
        setTimeout(() => setPlayerAttackAnimation(false), 500);
        
        // Determine random hit value for display (visual only)
        // Use playerStats.strength to calculate a more realistic damage value
        const potentialPlayerDamage = Math.floor((Math.random() * (playerStats.strength * 0.3)) + 1);
        setEnemyHitSplat(potentialPlayerDamage);
        setTimeout(() => setEnemyHitSplat(null), 1000);
      } 
      // If combat tick is even and not 0, it's an enemy attack
      else if (combatTick % 2 === 0 && combatTick !== 0) {
        console.log("Triggering enemy attack animation");
        
        // Enemy attack animation
        setEnemyAttackAnimation(true);
        setTimeout(() => setEnemyAttackAnimation(false), 500);
        
        // Determine random hit value for display (visual only)
        if (currentEnemy) {
          const potentialEnemyDamage = Math.floor((Math.random() * (currentEnemy.attack * 0.3)) + 1);
          setPlayerHitSplat(potentialEnemyDamage);
          setTimeout(() => setPlayerHitSplat(null), 1000);
        }
      }
    } catch (error) {
      console.error('Error in combat animation:', error);
      // Reset animation states to prevent UI issues
      setPlayerAttackAnimation(false);
      setEnemyAttackAnimation(false);
      setPlayerHitSplat(null);
      setEnemyHitSplat(null);
    }
  }, [combatTick, isFighting, currentEnemy, playerStats.strength]);
  
  // Handle enemy selection
  const handleSelectEnemy = (enemyId: string) => {
    if (isFighting) {
      console.log("Cannot select new enemy while in combat");
      return; // Prevent changing enemy during combat
    }
    console.log("Selected enemy:", enemyId);
    startCombat(enemyId);
  };
  
  // Handle fleeing from combat
  const handleFlee = () => {
    console.log("Attempting to flee from combat");
    fleeCombat();
  };
  
  // Get enemy emoji based on enemy ID
  const getEnemyEmoji = (enemyId: string) => {
    if (!enemyId) return ENEMY_EMOJIS.default;
    
    for (const [key, emoji] of Object.entries(ENEMY_EMOJIS)) {
      if (enemyId.toLowerCase().includes(key)) {
        return emoji;
      }
    }
    return ENEMY_EMOJIS.default;
  };
  
  return (
    <div className="bg-panel rounded-lg shadow-md border border-panel-border overflow-hidden h-full flex flex-col">
      <div className="relative px-4 py-2 bg-header-bg text-header-text">
        <h2 className="mt-0 mb-0 text-base font-bold flex items-center">
          <span className="mr-2">⚔️</span> Combat Arena
        </h2>
      </div>
      
      <div className="flex-1 flex flex-col p-2 overflow-hidden">
        {/* Main combat area - top 60% */}
        <div className="flex mb-2 gap-2" style={{ height: '60%' }}>
          {/* Enemy selection - left side 30% */}
          <div className="w-[30%] bg-panel-bg rounded-md p-2 overflow-hidden flex flex-col">
            <h3 className="mt-0 mb-2 text-xs font-semibold text-text flex items-center">
              <span className="mr-1 text-xs">🎯</span> Choose Enemy
            </h3>
            <div className="flex-1 overflow-auto custom-scrollbar pr-1">
              {enemies && enemies.length > 0 ? (
                <div className="grid grid-cols-1 gap-1.5">
                  {enemies.map(enemy => (
                    <div 
                      key={enemy.id}
                      className={`bg-item-bg border rounded-md p-1.5 cursor-pointer transition-all duration-200 text-xs
                        ${currentEnemy?.id === enemy.id 
                          ? 'border-primary shadow-sm' 
                          : 'border-item-border'} 
                        ${isFighting && currentEnemy?.id !== enemy.id ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}`}
                      onClick={() => handleSelectEnemy(enemy.id)}
                    >
                      <div className="flex items-center gap-1.5">
                        <div className="text-lg bg-panel-bg w-6 h-6 rounded-full flex items-center justify-center shadow-inner">
                          {getEnemyEmoji(enemy.id)}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <h4 className="font-bold text-xs m-0 text-text truncate">{enemy.name}</h4>
                          <div className="text-xxs text-text-secondary flex items-center">
                            <span className="truncate">CP: {Math.floor((enemy.attack + enemy.defense) / 2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-text-secondary">
                  <p className="text-xs text-center">No enemies available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Combat details - right side 70% */}
          <div className="w-[70%] flex flex-col overflow-hidden">
            {currentEnemy ? (
              <div className="h-full flex flex-col">
                {/* Combat status */}
                <div className="bg-item-bg rounded-md p-2 mb-2 relative flex-none">
                  <div className="text-sm font-bold text-text mb-1.5 flex items-center">
                    <span className="text-lg mr-1.5">{getEnemyEmoji(currentEnemy.id)}</span>
                    <span className="truncate">{currentEnemy.name}</span>
                    <span className="ml-auto text-xxs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                      CP {Math.floor((currentEnemy.attack + currentEnemy.defense) / 2)}
                    </span>
                  </div>
                  
                  {/* Health bars */}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xxs font-medium text-text-secondary">Enemy:</label>
                        <span className="text-xxs text-text">{currentEnemy.health}/{currentEnemy.maxHealth}</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
                          style={{ width: `${(currentEnemy.health / currentEnemy.maxHealth) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-0.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xxs font-medium text-text-secondary">You:</label>
                        <span className="text-xxs text-text">{Math.floor(playerStats.health)}/{playerStats.maxHealth}</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                          style={{ width: `${(playerStats.health / playerStats.maxHealth) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Battle visualization */}
                  <div className="flex justify-between items-center py-2 px-2 bg-panel-bg rounded-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-panel-bg opacity-50 z-0"></div>
                    
                    <div className={`relative z-10 flex flex-col items-center ${playerAttackAnimation ? 'animate-player-attack' : ''}`}>
                      <div className="text-2xl">🧙</div>
                      <div className="text-xxs font-medium">You</div>
                      {playerHitSplat !== null && (
                        <div className="absolute -top-1 -right-1 bg-danger/90 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold animate-hit-splat shadow-md border border-white text-xxs">
                          {playerHitSplat}
                        </div>
                      )}
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="text-xs font-bold text-text py-0.5 px-1.5 bg-panel border border-panel-border rounded-full">VS</div>
                      {isFighting && (
                        <div className="mt-0.5 px-1 py-px bg-primary/10 text-primary text-xxs rounded-full">
                          Fighting
                        </div>
                      )}
                    </div>
                    
                    <div className={`relative z-10 flex flex-col items-center ${enemyAttackAnimation ? 'animate-enemy-attack' : ''}`}>
                      <div className="text-2xl">{getEnemyEmoji(currentEnemy.id)}</div>
                      <div className="text-xxs font-medium">{currentEnemy.name}</div>
                      {enemyHitSplat !== null && (
                        <div className="absolute -top-1 -left-1 bg-success/90 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold animate-hit-splat shadow-md border border-white text-xxs">
                          {enemyHitSplat}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Combat stats and actions */}
                <div className="mb-2 flex-none">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-item-bg rounded-md p-2">
                      <h4 className="mt-0 mb-1 text-xs font-semibold text-text flex items-center">
                        <span className="mr-1 text-xs">📊</span> Stats
                      </h4>
                      <div className="grid grid-cols-3 gap-1.5">
                        <div className="bg-panel-bg rounded-md p-1 flex flex-col items-center">
                          <span className="text-xxs text-text-secondary">ATK</span>
                          <span className="text-text font-semibold text-xs">{playerStats.attack}</span>
                        </div>
                        <div className="bg-panel-bg rounded-md p-1 flex flex-col items-center">
                          <span className="text-xxs text-text-secondary">STR</span>
                          <span className="text-text font-semibold text-xs">{playerStats.strength}</span>
                        </div>
                        <div className="bg-panel-bg rounded-md p-1 flex flex-col items-center">
                          <span className="text-xxs text-text-secondary">DEF</span>
                          <span className="text-text font-semibold text-xs">{playerStats.defense}</span>
                        </div>
                      </div>
                      
                      {/* Show attack speeds */}
                      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                        <div className="bg-panel-bg rounded-md p-1 flex flex-col items-center">
                          <span className="text-xxs text-text-secondary">Your Speed</span>
                          <span className="text-success font-semibold text-xs">{formatAttackSpeed(2000)}</span>
                        </div>
                        {currentEnemy && (
                          <div className="bg-panel-bg rounded-md p-1 flex flex-col items-center">
                            <span className="text-xxs text-text-secondary">Enemy Speed</span>
                            <span className="text-danger font-semibold text-xs">{formatAttackSpeed(currentEnemy.attackSpeed || 2000)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-item-bg rounded-md p-2 flex flex-col">
                      <h4 className="mt-0 mb-1 text-xs font-semibold text-text flex items-center">
                        <span className="mr-1 text-xs">⚡</span> Action
                      </h4>
                      <div className="flex-1 flex items-center justify-center">
                        <button 
                          className={`w-full py-1 px-2 rounded text-xs font-medium transition-colors flex items-center justify-center
                            ${!isFighting ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-danger text-white hover:bg-danger-dark'}`}
                          onClick={handleFlee}
                          disabled={!isFighting}
                          aria-label="Flee from combat"
                        >
                          <span className="mr-1">🏃</span> Flee
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-item-bg rounded-md text-text opacity-70 p-3">
                <div className="text-3xl mb-2">🎯</div>
                <p className="text-center text-xs">
                  Select an enemy to begin combat.
                  <span className="text-xxs text-text-secondary mt-1 block">Defeating enemies will reward you with XP and loot!</span>
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Combat log - bottom 40% */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full">
            <CombatLog logs={combatLog} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombatPanel; 