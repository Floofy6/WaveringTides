import React from 'react';
import { Skill } from '../../types';

interface SkillProgressBarProps {
  skill: Skill;
  showActionProgress?: boolean;
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
 * Optimized for narrow sidebar with minimal width
 */
const SkillProgressBar: React.FC<SkillProgressBarProps> = ({ 
  skill,
  showActionProgress = true
}) => {
  // Validate inputs to prevent errors
  if (!skill) {
    console.error('SkillProgressBar: No skill data provided');
    return <div className="px-1 py-0.5 bg-danger/10 text-danger rounded text-xxs">Error: Missing data</div>;
  }
  
  // Check level bounds
  const level = Math.max(1, Math.min(99, skill.level));
  
  // If we're at max level, show 100%
  if (level >= 99) {
    return (
      <div>
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-primary to-purple-500" style={{ width: '100%' }} />
        </div>
        <div className="flex justify-between items-center mt-0.5">
          <div className="text-xxs font-medium text-purple-500 flex items-center">
            <span className="inline-block h-1 w-1 rounded-full bg-purple-500 mr-0.5"></span>
            Max
          </div>
          <div className="text-xxs text-text-secondary">
            13M
          </div>
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
  
  // Calculate action progress percentage if skill is active
  const actionProgress = (skill.isActive && skill.actionProgress) 
    ? Math.min(Math.floor((skill.actionProgress) * 100), 100)
    : 0;
  
  // Select the appropriate color gradient based on progress
  const getProgressGradient = () => {
    if (progressPercentage < 25) return 'from-blue-500 to-cyan-400';
    if (progressPercentage < 50) return 'from-cyan-400 to-teal-500';
    if (progressPercentage < 75) return 'from-teal-500 to-green-500';
    return 'from-green-500 to-primary';
  };
  
  return (
    <div className="space-y-1">
      {/* XP Progress bar */}
      <div>
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
          <div 
            className={`h-full bg-gradient-to-r ${getProgressGradient()} transition-all duration-300`}
            style={{ width: `${progressPercentage}%` }} 
          />
        </div>
        
        <div className="flex justify-between items-center mt-0.5">
          <div 
            className="text-xxs text-text-secondary group relative cursor-help"
            aria-label="XP progress details"
          >
            <span className="group-hover:opacity-100 opacity-0 pointer-events-none absolute -top-[36px] left-0 bg-panel-bg border border-panel-border text-text text-xxs px-2 py-1 rounded whitespace-nowrap transition-opacity duration-150 shadow-md z-10">
              <div className="flex justify-between gap-2">
                <span>Progress:</span> <span>{progressPercentage}%</span>
              </div>
              <div className="absolute bottom-[-6px] left-2 w-2 h-2 bg-panel-bg border-r border-b border-panel-border transform rotate-45"></div>
            </span>
            {Math.floor(displayXp)} / {Math.floor(xpForNextLevel)}
          </div>
        </div>
      </div>
      
      {/* Action progress bar for active skills */}
      {showActionProgress && skill.isActive && (
        <div>
          <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner mt-1">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-warning transition-all duration-100"
              style={{ width: `${actionProgress}%` }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillProgressBar; 