import React, { useEffect, useRef } from 'react';
import { useGameContext } from '../context/GameContext';
import { useSkills } from '../hooks/useSkills';
import { calculateMasteryXpForLevel } from '../hooks/useSkills';

// Helper functions (normally these would be in a separate utils file)
const totalXpForLevel = (level: number): number => {
  // Simple formula for testing
  return Math.floor((level - 1) * 100);
};

const getLevelFromXp = (xp: number): number => {
  // Simple formula for testing
  return Math.floor(xp / 100) + 1;
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
  const actionProgressRef = useRef<{ [skillId: string]: number }>({});
  
  // OSRS-like skill action configuration
  const SKILL_ACTION_BASE_TIME = 3000; // 3 seconds per action (like OSRS)
  
  // Initialize totalXp for existing skills (for older saves)
  useEffect(() => {
    // Safety check: ensure gameState and player exist
    if (!gameState || !gameState.player || !gameState.player.skills) {
      console.error("GameTick: Cannot initialize totalXp, gameState.player.skills is not available");
      return;
    }
    
    if (!initializedRef.current) {
      initializedRef.current = true;
      
      try {
        // Check if any skills don't have totalXp and initialize them
        const needsUpdate = Object.values(gameState.player.skills).some(
          (skill: any) => skill && skill.totalXp === undefined
        );
        
        if (needsUpdate) {
          console.log('Initializing totalXp for older saves');
          updateGameState((prevState) => {
            // Safety check on prevState
            if (!prevState || !prevState.player || !prevState.player.skills) {
              console.error("Cannot update skills, prevState.player.skills is missing");
              return prevState; // Return unmodified
            }
            
            const newState = JSON.parse(JSON.stringify(prevState));
            
            // Use proper type for skill and ensure all skills have totalXp
            Object.values(newState.player.skills).forEach((skill: any) => {
              if (!skill) return; // Skip if skill is undefined
              
              if (skill.totalXp === undefined) {
                // Calculate totalXp based on current level and xp
                const levelBaseXp = totalXpForLevel(skill.level || 1);
                skill.totalXp = levelBaseXp + (skill.xp || 0);
                
                // Ensure xp is initialized if missing
                if (skill.xp === undefined) {
                  skill.xp = 0;
                }
                
                // Ensure xpPerAction is initialized if missing
                if (skill.xpPerAction === undefined) {
                  skill.xpPerAction = 5; // Default value
                  console.warn(`Missing xpPerAction for skill ${skill.name || 'unknown'}, initializing to ${skill.xpPerAction}`);
                }
              }
            });
            
            return newState;
          });
        }
      } catch (error) {
        console.error("Error initializing totalXp:", error);
      }
    }
  }, [gameState, updateGameState]);
  
  // Set up game tick for recurring actions
  useEffect(() => {
    console.log('GameTick initialized');
    
    const tickInterval = 100; // Update more frequently for smoother progress
    
    const gameLoop = () => {
      try {
        // Safety check: ensure gameState and player exist
        if (!gameState || !gameState.player || !gameState.player.skills) {
          console.error("GameTick: gameState.player.skills is not available in game loop");
          return;
        }
        
        const now = Date.now();
        const deltaTime = now - lastUpdateRef.current;
        lastUpdateRef.current = now;
        
        // Get all active skills
        const activeSkills = getActiveSkills();
        
        // Update each active skill progress
        activeSkills.forEach(skillId => {
          try {
            if (!gameState.player.skills[skillId]) {
              console.error(`Skill ${skillId} is active but not found in gameState`);
              return;
            }
            
            const skill = gameState.player.skills[skillId];
            
            // Ensure skill has required properties
            if (typeof skill.xpPerAction !== 'number' || isNaN(skill.xpPerAction)) {
              console.error(`Skill ${skillId} has invalid xpPerAction: ${skill.xpPerAction}`);
              return;
            }
            
            // Initialize action progress tracking for this skill if not exists
            if (!actionProgressRef.current[skillId]) {
              actionProgressRef.current[skillId] = 0;
            }
            
            // Calculate skill level modifier (higher levels = slightly faster actions, as in OSRS)
            const levelModifier = 1 - Math.min((skill.level - 1) * 0.005, 0.3); // Max 30% reduction at level 61+
            const actionTime = SKILL_ACTION_BASE_TIME * levelModifier;
            
            // Increment progress for this skill
            actionProgressRef.current[skillId] += deltaTime;
            
            // Check if an action is completed
            if (actionProgressRef.current[skillId] >= actionTime) {
              // How many actions completed
              const actionsCompleted = Math.floor(actionProgressRef.current[skillId] / actionTime);
              
              // Update progress remainder
              actionProgressRef.current[skillId] %= actionTime;
              
              // Add XP for completed action(s)
              const xpGain = skill.xpPerAction * actionsCompleted;
              
              // Add XP to the skill (only give XP when action completes, like OSRS)
              addExperience(skillId, xpGain);
              
              // If the skill has mastery, add mastery experience as well
              if (skill.mastery) {
                // Mastery XP is typically a fraction of regular XP in OSRS
                const masteryXpGain = xpGain * 0.1;
                addMasteryExperience(skillId, masteryXpGain);
              }
              
              // Update the UI with action progress
              updateActionProgress(skillId, actionProgressRef.current[skillId] / actionTime);
            } else {
              // Update the UI with action progress
              updateActionProgress(skillId, actionProgressRef.current[skillId] / actionTime);
            }
          } catch (skillError) {
            console.error(`Error processing skill ${skillId}:`, skillError);
          }
        });
      } catch (loopError) {
        console.error("Error in game loop:", loopError);
      }
    };
    
    // Helper function to update action progress in the game state
    const updateActionProgress = (skillId: string, progress: number) => {
      updateGameState((prevState) => {
        // Safety check
        if (!prevState || !prevState.player || !prevState.player.skills || !prevState.player.skills[skillId]) {
          return prevState;
        }
        
        const newState = JSON.parse(JSON.stringify(prevState));
        newState.player.skills[skillId].actionProgress = progress;
        return newState;
      });
    };
    
    // Set up recurring game tick
    const tickTimer = setInterval(gameLoop, tickInterval);
    
    // Initial tick
    gameLoop();
    
    // Clean up interval on unmount
    return () => {
      clearInterval(tickTimer);
    };
  }, [gameState, addExperience, addMasteryExperience, getActiveSkills, updateGameState]);
  
  // This component doesn't render anything
  return null;
};

export default GameTick; 