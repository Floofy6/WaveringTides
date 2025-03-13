import React from 'react';
import { useSkills } from '../../hooks/useSkills';
import SkillProgressBar from './SkillProgressBar';
import { Skill } from '../../types';

/**
 * SkillPanel component - Displays player skills and their progression
 */
const SkillPanel: React.FC = () => {
  const { skills, currentSkill, selectSkill, startSkill, stopSkill } = useSkills();
  
  /**
   * Handler to toggle skill activity state
   */
  const handleToggleSkill = (skill: Skill, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the skill selection
    if (skill.isActive) {
      stopSkill(skill.id);
    } else {
      startSkill(skill.id);
    }
  };
  
  return (
    <>
      <h2>Skills</h2>
      
      <div className="skill-container">
        <div className="skill-list-container">
          {Object.values(skills).map((skill: Skill) => (
            <div 
              key={skill.id} 
              className={`skill-item ${currentSkill?.id === skill.id ? 'selected' : ''}`}
              onClick={() => selectSkill(skill.id)}
            >
              <div className="skill-header">
                <div className="skill-name">{skill.name}</div>
                <span className="skill-level">Level {skill.level}</span>
              </div>
              
              <SkillProgressBar skill={skill} />
              
              <div className="skill-actions">
                <button
                  className={`skill-action-btn ${skill.isActive ? 'stop-btn' : 'start-btn'}`}
                  onClick={(e) => handleToggleSkill(skill, e)}
                >
                  {skill.isActive ? 'Stop' : 'Start'}
                </button>
              </div>
              
              {currentSkill?.id === skill.id && (
                <div className="skill-details">
                  <p>XP per action: {skill.xpPerAction}</p>
                  <p>Status: {skill.isActive ? 'Active' : 'Inactive'}</p>
                  
                  {skill.mastery && (
                    <div className="mastery-list">
                      <h4>Mastery Unlocks</h4>
                      <ul>
                        {Object.entries(skill.mastery.unlocks).map(([level, description]) => (
                          <li 
                            key={level}
                            className={skill.level >= parseInt(level) ? 'unlocked' : 'locked'}
                          >
                            Level {level}: {description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SkillPanel; 