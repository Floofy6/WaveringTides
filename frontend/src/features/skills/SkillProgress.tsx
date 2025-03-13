import React from 'react';
import { Skill } from '../../types';

interface SkillProgressProps {
  skill: Skill;
  showLabel?: boolean;
}

/**
 * SkillProgress component - Displays skill progress with XP bar
 * Extracted as a separate component for better reusability
 */
const SkillProgress: React.FC<SkillProgressProps> = ({ 
  skill, 
  showLabel = true 
}) => {
  const progressPercentage = calculateProgressPercentage(skill);
  
  return (
    <div className="skill-progress">
      {showLabel && (
        <div className="skill-progress-labels">
          <span>XP: {skill.xp.toLocaleString()}</span>
          <span>{progressPercentage}%</span>
        </div>
      )}
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progressPercentage}%` }}
          title={`${progressPercentage}% to next level`}
        />
      </div>
      
      {showLabel && (
        <div className="skill-next-level">
          <span>Next level: {calculateXpForNextLevel(skill).toLocaleString()} XP</span>
        </div>
      )}
    </div>
  );
};

/**
 * Calculate the percentage progress towards the next level
 */
const calculateProgressPercentage = (skill: Skill): number => {
  const currentLevelXp = calculateXpForLevel(skill.level);
  const nextLevelXp = calculateXpForLevel(skill.level + 1);
  const xpInCurrentLevel = skill.xp - currentLevelXp;
  const xpRequiredForNextLevel = nextLevelXp - currentLevelXp;
  
  return Math.min(100, Math.floor((xpInCurrentLevel / xpRequiredForNextLevel) * 100));
};

/**
 * Calculate total XP required for a given level
 */
const calculateXpForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(level, 1.5));
};

/**
 * Calculate how much XP is needed to reach the next level
 */
const calculateXpForNextLevel = (skill: Skill): number => {
  const currentLevelXp = calculateXpForLevel(skill.level);
  const nextLevelXp = calculateXpForLevel(skill.level + 1);
  return nextLevelXp - skill.xp;
};

export { 
  SkillProgress,
  calculateProgressPercentage,
  calculateXpForLevel,
  calculateXpForNextLevel
}; 