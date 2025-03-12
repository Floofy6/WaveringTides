import React from 'react';
import { Skill } from '../types';

interface SkillListProps {
  skills: { [id: string]: Skill };
  onStartSkill: (skillId: string) => void;
  onStopSkill: (skillId: string) => void;
}

const SkillList: React.FC<SkillListProps> = ({ skills, onStartSkill, onStopSkill }) => {
  const calculateXpProgress = (skill: Skill): number => {
    const nextLevelXp = Math.floor(100 * (skill.level ** 1.5));
    const currentLevelXp = Math.floor(100 * ((skill.level - 1) ** 1.5));
    const levelXpRange = nextLevelXp - currentLevelXp;
    const xpProgress = skill.xp - currentLevelXp;
    
    return Math.min(100, Math.floor((xpProgress / levelXpRange) * 100));
  };

  return (
    <div className="skill-list">
      <h2>Skills</h2>
      <div className="skills-container">
        {Object.values(skills).map((skill) => (
          <div key={skill.id} className="skill-card">
            <div className="skill-header">
              <h3>{skill.name}</h3>
              <span className="skill-level">Level {skill.level}</span>
            </div>
            
            <div className="skill-progress">
              <div 
                className="skill-progress-bar" 
                style={{ width: `${calculateXpProgress(skill)}%` }}
              ></div>
            </div>
            
            <div className="skill-actions">
              {skill.isActive ? (
                <button 
                  className="skill-btn stop-btn"
                  onClick={() => onStopSkill(skill.id)}
                >
                  Stop
                </button>
              ) : (
                <button 
                  className="skill-btn start-btn"
                  onClick={() => onStartSkill(skill.id)}
                >
                  Start
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillList;