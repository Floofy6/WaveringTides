import React, { useEffect, useRef } from 'react';
import { useSkills } from '../hooks/useSkills';
import { useGameContext } from '../context/GameContext';

/**
 * Calculate the total XP needed to reach a specific level in OSRS
 */
const totalXpForLevel = (level: number): number => {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += calculateXpForNextLevel(i);
  }
  return total;
};

/**
 * Calculate the XP required for the next level based on OSRS formula
 */
const calculateXpForNextLevel = (currentLevel: number): number => {
  // OSRS formula: Each level requires points equal to Math.floor(level * 300 * 2^(level/7)) / 4
  const MAX_LEVEL = 99;
  
  if (currentLevel >= MAX_LEVEL) {
    return Number.MAX_SAFE_INTEGER; // Effectively cap at level 99
  }
  
  return Math.floor((Math.pow(2, (currentLevel) / 7) * currentLevel * 300) / 4);
};

/**
 * GameTick component - Handles game updates at regular intervals
 * This component doesn't render anything but creates a game loop
 */
const GameTick: React.FC = () => {
  const { getActiveSkills, addExperience, addMasteryExperience } = useSkills();
  const { gameState, updateGameState } = useGameContext();
  const lastUpdateRef = useRef<number>(Date.now());
  const initializedRef = useRef<boolean>(false);
  
  // Initialize totalXp for existing skills (for older saves)
  useEffect(() => {
    if (gameState && !initializedRef.current) {
      initializedRef.current = true;
      
      // Check if any skills don't have totalXp and initialize them
      const needsUpdate = Object.values(gameState.player.skills).some(
        (skill: any) => skill.totalXp === undefined
      );
      
      if (needsUpdate) {
        console.log('Initializing totalXp for older saves');
        updateGameState((prevState) => {
          if (!prevState) return null;
          
          const newState = JSON.parse(JSON.stringify(prevState));
          
          // Use proper type for skill and ensure all skills have totalXp
          Object.values(newState.player.skills).forEach((skill: any) => {
            if (skill.totalXp === undefined) {
              // Calculate totalXp based on current level and xp
              const levelBaseXp = totalXpForLevel(skill.level);
              skill.totalXp = levelBaseXp + (skill.xp || 0);
              
              // Ensure xp is initialized if missing
              if (skill.xp === undefined) {
                skill.xp = 0;
              }
              
              // Ensure xpPerAction is initialized if missing
              if (skill.xpPerAction === undefined) {
                skill.xpPerAction = 5; // Default value
                console.warn(`Missing xpPerAction for skill ${skill.name}, initializing to ${skill.xpPerAction}`);
              }
            }
          });
          
          return newState;
        });
      }
    }
  }, [gameState, updateGameState]);
  
  // Set up game tick for recurring actions
  useEffect(() => {
    if (!gameState) return; // Don't set up game tick if no gameState
    
    console.log('GameTick initialized');
    
    const tickInterval = 1000; // Update every second
    
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = now - lastUpdateRef.current;
      lastUpdateRef.current = now;
      
      // Get all active skills
      const activeSkills = getActiveSkills();
      
      if (activeSkills.length > 0) {
        console.log('Active skills:', activeSkills);
      }
      
      // Update each active skill
      activeSkills.forEach(skillId => {
        const skill = gameState?.player?.skills?.[skillId];
        if (skill) {
          // Ensure skill has required properties
          if (typeof skill.xpPerAction !== 'number' || isNaN(skill.xpPerAction)) {
            console.error(`Skill ${skillId} has invalid xpPerAction: ${skill.xpPerAction}`);
            return;
          }
          
          // Calculate XP gain based on skill's xpPerAction and time elapsed
          // Increased XP gain for more noticeable progression (50x faster for testing)
          const xpGain = skill.xpPerAction * (deltaTime / 1000) * 50;
          
          // Ensure we have a totalXp value
          if (typeof skill.totalXp !== 'number') {
            console.warn(`Skill ${skill.name} missing totalXp property, this may cause progress bar issues`);
          }
          
          // Add XP to the skill (ensure it's a positive number)
          addExperience(skillId, Math.max(0, xpGain));
          
          // If the skill has mastery, add mastery experience as well
          if (skill.mastery) {
            // Mastery XP is typically a fraction of regular XP
            const masteryXpGain = xpGain * 0.5;
            addMasteryExperience(skillId, masteryXpGain);
          }
        } else {
          console.error(`Skill ${skillId} is active but not found in gameState`);
        }
      });
    };
    
    // Start the game loop
    const timer = setInterval(gameLoop, tickInterval);
    console.log('Game loop started with interval:', tickInterval);
    
    // Clean up on unmount
    return () => {
      console.log('GameTick component unmounted, clearing interval');
      clearInterval(timer);
    };
  }, [gameState, getActiveSkills, addExperience, addMasteryExperience]);
  
  // This component doesn't render anything
  return null;
};

export default GameTick; 