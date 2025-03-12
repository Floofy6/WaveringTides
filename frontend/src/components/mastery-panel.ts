import React from 'react';
import { Skill } from '../types';

interface MasteryPanelProps {
  skill: Skill;
}

const MasteryPanel: React.FC<MasteryPanelProps> = ({ skill }) => {
  if (!skill.mastery) {
    return <div className="mastery-empty">Mastery not available for this skill.</div>;
  }

  const calculateMasteryProgress = (): number => {
    const nextLevelXp = Math.floor(150 * (skill.mastery.level ** 1.8));
    const currentLevelXp = Math.floor(150 * ((skill.mastery.level - 1) ** 1.8));
    const levelXpRange = nextLevelXp - currentLevelXp;
    const xpProgress = skill.mastery.xp - currentLevelXp;
    
    return Math.min(100, Math.floor((xpProgress / levelXpRange) * 100));
  };

  return (
    <div className="mastery-panel">
      <div className="mastery-header">
        <h3>{skill.name} Mastery</h3>
        <span className="mastery-level">Level {skill.mastery.level}</span>
      </div>
      
      <div className="mastery-progress">
        <div 
          className="mastery-progress-bar" 
          style={{ width: `${calculateMasteryProgress()}%` }}
        ></div>
      </div>
      
      <div className="mastery-xp">
        <span>XP: {Math.floor(skill.mastery.xp)}</span>
      </div>
      
      <div className="mastery-unlocks">
        <h4>Unlocks:</h4>
        <ul className="unlock-list">
          {Object.entries(skill.mastery.unlocks).map(([level, description]) => (
            <li 
              key={level}
              className={parseInt(level) <= skill.mastery.level ? 'unlocked' : 'locked'}
            >
              <span className="unlock-level">Level {level}:</span>
              <span className="unlock-description">{description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MasteryPanel;