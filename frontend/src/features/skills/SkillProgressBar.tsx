import React from 'react';
import { Skill } from '../../types';

interface SkillProgressBarProps {
  skill: Skill;
}

/**
 * SkillProgressBar component - Visual representation of skill progression
 */
const SkillProgressBar: React.FC<SkillProgressBarProps> = ({ skill }) => {
  // Calculate required XP for next level
  const requiredXp = calculateXpForNextLevel(skill.level);
  
  // Calculate percentage progress
  const progressPercentage = Math.min(Math.floor((skill.xp / requiredXp) * 100), 100);
  
  return (
    <div>
      <div className="skill-progress-bar">
        <div 
          className="skill-progress-fill"
          style={{ width: `${progressPercentage}%` }} 
        />
      </div>
      <div className="skill-progress-text">
        {Math.floor(skill.xp)} / {requiredXp} XP ({progressPercentage}%)
      </div>
    </div>
  );
};

/**
 * Calculate the XP required for the next level
 * This is a simple formula that can be adjusted as needed
 */
const calculateXpForNextLevel = (currentLevel: number): number => {
  // Example formula: base 100 XP with 10% increase per level
  return Math.floor(100 * Math.pow(1.1, currentLevel - 1));
};

export default SkillProgressBar; 