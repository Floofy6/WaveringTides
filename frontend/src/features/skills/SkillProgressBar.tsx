import React, { useEffect } from 'react';
import { Skill } from '../../types';

interface SkillProgressBarProps {
  skill: Skill;
}

// Import these functions from a shared location
const calculateXpForNextLevel = (currentLevel: number): number => {
  // OSRS formula: Each level requires points equal to Math.floor(level * 300 * 2^(level/7)) / 4
  const MAX_LEVEL = 99;
  
  if (currentLevel >= MAX_LEVEL) {
    return Number.MAX_SAFE_INTEGER; // Effectively cap at level 99
  }
  
  return Math.floor((Math.pow(2, (currentLevel) / 7) * currentLevel * 300) / 4);
};

const totalXpForLevel = (level: number): number => {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += calculateXpForNextLevel(i);
  }
  return total;
};

/**
 * Format a number with commas for better readability
 */
const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * SkillProgressBar component - Visual representation of skill progression
 */
const SkillProgressBar: React.FC<SkillProgressBarProps> = ({ skill }) => {
  // Debug logging
  useEffect(() => {
    console.log(`SkillProgressBar rendering for ${skill.name}:`, {
      level: skill.level,
      totalXp: skill.totalXp,
      xp: skill.xp
    });
  }, [skill]);
  
  // Validate inputs to prevent errors
  if (!skill) {
    console.error('SkillProgressBar: No skill data provided');
    return <div>Error: Skill data missing</div>;
  }
  
  // Check level bounds
  const level = Math.max(1, Math.min(99, skill.level));
  
  // If we're at max level, show 100%
  if (level >= 99) {
    return (
      <div>
        <div className="skill-progress-bar">
          <div className="skill-progress-fill" style={{ width: '100%' }} />
        </div>
        <div className="skill-progress-text">
          Max Level (13,034,431 XP)
        </div>
      </div>
    );
  }
  
  // Get XP thresholds for current level and next level
  const currentLevelTotalXp = totalXpForLevel(level);
  const nextLevelTotalXp = totalXpForLevel(level + 1);
  
  // Calculate XP needed for next level from current level
  const xpForNextLevel = nextLevelTotalXp - currentLevelTotalXp;
  
  // Current XP progress within this level
  let currentLevelXp = 0;
  
  // Make sure we have a valid totalXp value
  if (typeof skill.totalXp === 'number') {
    // Calculate how much XP we've earned within this level
    currentLevelXp = skill.totalXp - currentLevelTotalXp;
  } else if (typeof skill.xp === 'number') {
    // Directly use the level's xp if totalXp is not available
    currentLevelXp = skill.xp;
  }
  
  // Ensure currentLevelXp is not negative
  currentLevelXp = Math.max(0, currentLevelXp);
  
  // Ensure currentLevelXp doesn't exceed what's needed for next level
  const displayXp = Math.min(xpForNextLevel, currentLevelXp);
  
  // Calculate percentage progress toward next level
  const progressPercentage = Math.min(Math.floor((displayXp / xpForNextLevel) * 100), 100);
  
  // Log final calculated values
  console.log(`Final display values for ${skill.name}:`, {
    currentLevelXp,
    displayXp,
    xpForNextLevel,
    progressPercentage
  });
  
  return (
    <div>
      <div className="skill-progress-bar">
        <div 
          className="skill-progress-fill"
          style={{ width: `${progressPercentage}%` }} 
        />
      </div>
      <div className="skill-progress-text">
        {formatNumber(Math.floor(displayXp))} / {formatNumber(xpForNextLevel)} XP ({progressPercentage}%)
      </div>
      {skill.totalXp && (
        <div className="skill-total-xp">
          Total XP: {formatNumber(Math.floor(skill.totalXp))}
        </div>
      )}
    </div>
  );
};

export default SkillProgressBar; 