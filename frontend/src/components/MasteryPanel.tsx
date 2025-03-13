import React, { useState } from 'react';
import { Mastery } from '../types';
import { calculateMasteryXpForLevel } from '../hooks/useSkills';

interface MasteryPanelProps {
  mastery: Mastery;
  compact?: boolean;
}

/**
 * MasteryPanel component - Displays skill mastery information
 */
const MasteryPanel: React.FC<MasteryPanelProps> = ({ 
  mastery,
  compact = false
}) => {
  const [showDetails, setShowDetails] = useState(!compact);
  
  const progressPercentage = calculateMasteryProgress(mastery);
  const nextLevel = mastery.level + 1;
  const xpNeeded = calculateXpNeeded(mastery);
  
  return (
    <div className={`mastery-panel ${compact ? 'compact' : ''}`}>
      <div className="mastery-header">
        <h4 className="mastery-level">
          Mastery Level {mastery.level}
        </h4>
        
        {compact && (
          <button 
            className="mastery-toggle"
            onClick={() => setShowDetails(!showDetails)}
            aria-label={showDetails ? 'Hide details' : 'Show details'}
          >
            {showDetails ? '▲' : '▼'}
          </button>
        )}
      </div>
      
      <div className="mastery-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="mastery-progress-info">
          <span>{mastery.xp.toLocaleString()} XP</span>
          <span>{progressPercentage}%</span>
        </div>
        
        <div className="mastery-next-level">
          <span>{xpNeeded.toLocaleString()} XP to level {nextLevel}</span>
        </div>
      </div>
      
      {showDetails && Object.keys(mastery.unlocks).length > 0 && (
        <MasteryUnlocks 
          unlocks={mastery.unlocks} 
          currentLevel={mastery.level} 
        />
      )}
    </div>
  );
};

/**
 * MasteryUnlocks component - Displays unlockable perks at each mastery level
 */
interface MasteryUnlocksProps {
  unlocks: { [level: string]: string };
  currentLevel: number;
}

const MasteryUnlocks: React.FC<MasteryUnlocksProps> = ({ unlocks, currentLevel }) => {
  return (
    <div className="mastery-unlocks">
      <h5>Unlocks:</h5>
      <ul>
        {Object.entries(unlocks)
          .sort(([levelA], [levelB]) => parseInt(levelA) - parseInt(levelB))
          .map(([level, description]) => {
            const levelNum = parseInt(level);
            const isUnlocked = levelNum <= currentLevel;
            
            return (
              <li 
                key={level} 
                className={`mastery-unlock ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <span className="unlock-level">Level {level}:</span>
                <span className="unlock-description">{description}</span>
                {isUnlocked && <span className="unlock-badge">✓</span>}
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

/**
 * Calculate mastery progress percentage to next level
 */
const calculateMasteryProgress = (mastery: Mastery): number => {
  const currentLevelXp = calculateMasteryXpForLevel(mastery.level);
  const nextLevelXp = calculateMasteryXpForLevel(mastery.level + 1);
  const xpInCurrentLevel = mastery.xp - currentLevelXp;
  const xpRequiredForNextLevel = nextLevelXp - currentLevelXp;
  
  return Math.min(100, Math.floor((xpInCurrentLevel / xpRequiredForNextLevel) * 100));
};

/**
 * Calculate XP needed for next level
 */
const calculateXpNeeded = (mastery: Mastery): number => {
  const nextLevelXp = calculateMasteryXpForLevel(mastery.level + 1);
  return Math.max(0, nextLevelXp - mastery.xp);
};

export default MasteryPanel;