import React, { useEffect, useRef } from 'react';
import { useSkills } from '../hooks/useSkills';
import { useGameContext } from '../context/GameContext';

/**
 * GameTick component - Handles game updates at regular intervals
 * This component doesn't render anything but creates a game loop
 */
const GameTick: React.FC = () => {
  const { getActiveSkills, addExperience, addMasteryExperience } = useSkills();
  const { gameState } = useGameContext();
  const lastUpdateRef = useRef<number>(Date.now());
  
  // Set up game tick for recurring actions
  useEffect(() => {
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
          // Calculate XP gain based on skill's xpPerAction and time elapsed
          // Increased XP gain for more noticeable progression (20x faster for testing)
          const xpGain = skill.xpPerAction * (deltaTime / 1000) * 20;
          
          console.log(`Adding ${xpGain} XP to ${skill.name}`);
          
          // Add XP to the skill
          addExperience(skillId, xpGain);
          
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