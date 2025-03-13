import { useState, useCallback } from 'react';
import { useGameContext } from '../context/GameContext';

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
  const { gameState, updateGameState } = useGameContext();
  const [currentSkillId, setCurrentSkillId] = useState<string | null>(null);
  
  const skills = gameState?.player.skills || {};
  const currentSkill = currentSkillId ? skills[currentSkillId] : null;
  
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
    if (!gameState) return;
    
    const updatedSkills = {
      ...gameState.player.skills,
      [skillId]: {
        ...gameState.player.skills[skillId],
        isActive: true,
        lastActiveTime: Date.now()
      }
    };
    
    updateGameState((prevState) => {
      if (!prevState) return null;
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
    if (!gameState) return;
    
    const updatedSkills = {
      ...gameState.player.skills,
      [skillId]: {
        ...gameState.player.skills[skillId],
        isActive: false
      }
    };
    
    updateGameState((prevState) => {
      if (!prevState) return null;
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
    if (!gameState) return;
    
    console.log(`Adding ${amount} XP to skill ${skillId}`);
    
    updateGameState((prevState) => {
      if (!prevState) return null;
      
      // Create a deep copy of the previous state
      const newState = JSON.parse(JSON.stringify(prevState));
      
      // Get the skill
      const skill = newState.player.skills[skillId];
      if (!skill) {
        console.error(`Skill ${skillId} not found`);
        return prevState;
      }
      
      // Add the experience to total XP counter
      skill.totalXp = (skill.totalXp || 0) + amount;
      
      // Calculate the new level based on total XP
      const newLevel = getLevelFromXp(skill.totalXp);
      
      // Check if we leveled up
      if (newLevel > skill.level) {
        skill.level = newLevel;
        // Reset current level XP to 0 for progress bar purposes
        skill.xp = 0;
        console.log(`LEVEL UP! ${skill.name} is now level ${skill.level}`);
      } else {
        // For progress bar, only track XP within current level
      const requiredXP = calculateXpForNextLevel(skill.level);
      if (skill.xp >= requiredXP) {
        skill.level += 1;
        console.log(`LEVEL UP! ${skill.name} is now level ${skill.level}`);
        
        // You could add more level-up logic here, like unlocking new abilities
      }
      
      return newState;
    });
  }, [gameState, updateGameState]);
  
  /**
   * Get a list of all active skills
   */
  const getActiveSkills = useCallback(() => {
    if (!gameState) return [];
    
    return Object.keys(gameState.player.skills).filter(
      skillId => gameState.player.skills[skillId].isActive
    );
  }, [gameState]);
  
  /**
   * Check if a skill has reached a specific level
   */
  const hasReachedLevel = useCallback((skillId: string, level: number) => {
    if (!gameState) return false;
    
    const skill = gameState.player.skills[skillId];
    return skill ? skill.level >= level : false;
  }, [gameState]);
  
  /**
   * Add experience to a skill's mastery and handle level ups
   */
  const addMasteryExperience = useCallback((skillId: string, amount: number) => {
    if (!gameState) return;
    
    updateGameState((prevState) => {
      if (!prevState) return null;
      
      // Create a deep copy of the previous state
      const newState = JSON.parse(JSON.stringify(prevState));
      
      const skill = newState.player.skills[skillId];
      if (!skill || !skill.mastery) return prevState;
      
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
    });
  }, [gameState, updateGameState]);
  
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