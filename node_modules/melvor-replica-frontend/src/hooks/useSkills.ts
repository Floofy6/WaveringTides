import { useState, useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
import { Skill } from '../types';

/**
 * Calculate the XP required for the next level based on OSRS formula
 * In OSRS, level 99 requires about 13 million XP
 */
const calculateXpForNextLevel = (currentLevel: number): number => {
  // OSRS formula: Each level requires points equal to Math.floor(level * 300 * 2^(level/7)) / 4
  // This is a simplified implementation that closely mimics OSRS XP curve
  const MAX_LEVEL = 99;
  
  if (currentLevel >= MAX_LEVEL) {
    return Number.MAX_SAFE_INTEGER; // Effectively cap at level 99
  }
  
  // Get points required for next level
  return Math.floor((Math.pow(2, (currentLevel) / 7) * currentLevel * 300) / 4);
};

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
 * Get the level based on total XP earned (OSRS style)
 */
const getLevelFromXp = (totalXp: number): number => {
  let level = 1;
  while (level < 99 && totalXp >= totalXpForLevel(level + 1)) {
    level++;
  }
  return level;
};

/**
 * Calculate the XP required for a specific mastery level
 * This uses a different formula than regular skill levels
 */
export const calculateMasteryXpForLevel = (level: number): number => {
  // Example formula: steeper curve for mastery levels
  return Math.floor(150 * Math.pow(level, 1.8));
};

/**
 * useSkills hook - Manages skill-related state and operations
 */
export const useSkills = () => {
  const { gameState, updateGameState, loading } = useGameContext();
  const [currentSkillId, setCurrentSkillId] = useState<string | null>(null);
  
  // Use empty object as fallback if player or skills is not available
  const skills = gameState?.player?.skills || {};
  const currentSkill = currentSkillId && skills[currentSkillId] ? skills[currentSkillId] : null;
  
  /**
   * Select a skill to view its details
   */
  const selectSkill = useCallback((skillId: string) => {
    setCurrentSkillId(skillId);
  }, []);
  
  /**
   * Start a skill activity
   */
  const startSkill = useCallback((skillId: string) => {
    // Safety check
    if (!gameState || !gameState.player || !gameState.player.skills || !gameState.player.skills[skillId]) {
      console.error(`Cannot start skill ${skillId}, player data not available`);
      return;
    }
    
    const updatedSkills = {
      ...gameState.player.skills,
      [skillId]: {
        ...gameState.player.skills[skillId],
        isActive: true,
        lastActiveTime: Date.now()
      }
    };
    
    updateGameState((prevState) => {
      // Safety check
      if (!prevState || !prevState.player) {
        console.error("Cannot update skills, player data not available");
        return prevState;
      }
      
      return {
        ...prevState,
        player: {
          ...prevState.player,
          skills: updatedSkills
        }
      };
    });
  }, [gameState, updateGameState]);
  
  /**
   * Stop a skill activity
   */
  const stopSkill = useCallback((skillId: string) => {
    // Safety check
    if (!gameState || !gameState.player || !gameState.player.skills || !gameState.player.skills[skillId]) {
      console.error(`Cannot stop skill ${skillId}, player data not available`);
      return;
    }
    
    const updatedSkills = {
      ...gameState.player.skills,
      [skillId]: {
        ...gameState.player.skills[skillId],
        isActive: false
      }
    };
    
    updateGameState((prevState) => {
      // Safety check
      if (!prevState || !prevState.player) {
        console.error("Cannot update skills, player data not available");
        return prevState;
      }
      
      return {
        ...prevState,
        player: {
          ...prevState.player,
          skills: updatedSkills
        }
      };
    });
  }, [gameState, updateGameState]);
  
  /**
   * Add experience to a skill
   */
  const addExperience = useCallback((skillId: string, amount: number): void => {
    if (loading) return; // Skip if we're loading
    
    console.log(`Adding ${amount} XP to skill ${skillId}`);
    
    updateGameState((prevState) => {
      try {
        // Safety check
        if (!prevState || !prevState.player || !prevState.player.skills) {
          console.error("Cannot add experience, player data not available");
          return prevState;
        }
        
        // Safety check for the skill
        if (!prevState.player.skills[skillId]) {
          console.error(`Skill ${skillId} not found`);
          return prevState;
        }
        
        // Create a deep copy of the previous state
        const newState = JSON.parse(JSON.stringify(prevState));
        
        // Get the skill
        const skill = newState.player.skills[skillId];
        
        // Initialize totalXp if it doesn't exist
        if (typeof skill.totalXp !== 'number') {
          // If we don't have totalXp yet, initialize it based on current level and xp
          const levelBaseXp = totalXpForLevel(skill.level);
          skill.totalXp = levelBaseXp + (skill.xp || 0);
        }
        
        // Add the experience to total XP counter
        skill.totalXp += amount;
        
        // Calculate the new level based on total XP
        const newLevel = getLevelFromXp(skill.totalXp);
        
        // Check if we leveled up
        if (newLevel > skill.level) {
          const oldLevel = skill.level;
          skill.level = newLevel;
          
          // Calculate XP within the new level
          const newLevelBaseXp = totalXpForLevel(newLevel);
          skill.xp = skill.totalXp - newLevelBaseXp;
          
          console.log(`LEVEL UP! ${skill.name} from ${oldLevel} to ${newLevel} (${skill.xp} XP into new level)`);
        } else {
          // No level up, just update XP within current level
          const currentLevelBaseXp = totalXpForLevel(skill.level);
          skill.xp = skill.totalXp - currentLevelBaseXp;
          
          console.log(`Added XP to ${skill.name}: now ${skill.xp}/${calculateXpForNextLevel(skill.level)} within current level`);
        }
        
        return newState;
      } catch (error) {
        console.error("Error adding experience:", error);
        return prevState;
      }
    });
  }, [loading, updateGameState]);
  
  /**
   * Get a list of all active skills
   */
  const getActiveSkills = useCallback(() => {
    if (!gameState || !gameState.player || !gameState.player.skills) {
      return [];
    }
    
    return Object.keys(gameState.player.skills).filter(
      skillId => gameState.player.skills[skillId]?.isActive
    );
  }, [gameState]);
  
  /**
   * Check if a skill has reached a specific level
   */
  const hasReachedLevel = useCallback((skillId: string, level: number) => {
    if (!gameState || !gameState.player || !gameState.player.skills) {
      return false;
    }
    
    const skill = gameState.player.skills[skillId];
    return skill ? skill.level >= level : false;
  }, [gameState]);
  
  /**
   * Add experience to a skill's mastery and handle level ups
   */
  const addMasteryExperience = useCallback((skillId: string, amount: number) => {
    if (loading) return; // Skip if we're loading
    
    updateGameState((prevState) => {
      try {
        // Safety check
        if (!prevState || !prevState.player || !prevState.player.skills) {
          console.error("Cannot add mastery experience, player data not available");
          return prevState;
        }
        
        // Create a deep copy of the previous state
        const newState = JSON.parse(JSON.stringify(prevState));
        
        const skill = newState.player.skills[skillId];
        if (!skill || !skill.mastery) {
          console.error(`Skill ${skillId} or its mastery not found`);
          return prevState;
        }
        
        const mastery = skill.mastery;
        let newXp = mastery.xp + amount;
        let newLevel = mastery.level;
        
        // Check for level up
        while (newXp >= calculateMasteryXpForLevel(newLevel + 1)) {
          newLevel++;
          console.log(`MASTERY LEVEL UP! ${skill.name} mastery is now level ${newLevel}`);
        }
        
        // Update the mastery in the skill
        skill.mastery = {
          ...mastery,
          level: newLevel,
          xp: newXp
        };
        
        return newState;
      } catch (error) {
        console.error("Error adding mastery experience:", error);
        return prevState;
      }
    });
  }, [loading, updateGameState]);
  
  return {
    skills,
    currentSkill,
    selectSkill,
    startSkill,
    stopSkill,
    addExperience,
    addMasteryExperience,
    getActiveSkills,
    hasReachedLevel
  };
}; 