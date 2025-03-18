import React, { useState } from 'react';
import { useSkills } from '../../hooks/useSkills';
import SkillProgressBar from './SkillProgressBar';
import { Skill } from '../../types';
import { useGameContext } from '../../context/GameContext';

// Skill emoji mapping
const SKILL_EMOJIS: Record<string, string> = {
  mining: '⛏️',
  woodcutting: '🪓',
  fishing: '🎣',
  cooking: '🍳',
  crafting: '🧵',
  smithing: '🔨',
  farming: '🌱',
  combat: '⚔️',
  magic: '✨',
  default: '📊'
};

/**
 * SkillPanel component - Displays player skills and their progression
 * Optimized for narrow sidebar with minimal width
 */
const SkillPanel: React.FC = () => {
  const { skills, currentSkill, selectSkill, startSkill, stopSkill } = useSkills();
  const { loading } = useGameContext();
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);
  
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

  /**
   * Toggle expanded skill details view
   */
  const toggleSkillDetails = (skillId: string) => {
    setExpandedSkillId(expandedSkillId === skillId ? null : skillId);
    selectSkill(skillId);
  };
  
  /**
   * Get skill emoji based on skill ID/name
   */
  const getSkillEmoji = (skill: Skill): string => {
    for (const [key, emoji] of Object.entries(SKILL_EMOJIS)) {
      if (skill.id.toLowerCase().includes(key) || skill.name.toLowerCase().includes(key)) {
        return emoji;
      }
    }
    return SKILL_EMOJIS.default;
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="bg-panel rounded-lg shadow-md border border-panel-border h-full overflow-hidden">
        <div className="px-3 py-2 bg-header-bg text-header-text">
          <h2 className="m-0 text-base font-bold flex items-center">
            <span className="mr-2">📊</span> Skills
          </h2>
        </div>
        
        <div className="flex items-center justify-center h-full text-text-secondary p-3">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
            <span className="text-xs">Loading skills...</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Handle case where skills might not be available
  if (!skills || Object.keys(skills).length === 0) {
    return (
      <div className="bg-panel rounded-lg shadow-md border border-panel-border h-full overflow-hidden">
        <div className="px-3 py-2 bg-header-bg text-header-text">
          <h2 className="m-0 text-base font-bold flex items-center">
            <span className="mr-2">📊</span> Skills
          </h2>
        </div>
        
        <div className="flex items-center justify-center h-full text-text-secondary p-3">
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl mb-2">📋</div>
            <p className="mb-1 font-medium text-sm">No skills available</p>
            <p className="text-xs opacity-75">Check back soon!</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-panel rounded-lg shadow-md border border-panel-border h-full overflow-hidden flex flex-col">
      <div className="px-3 py-2 bg-header-bg text-header-text">
        <h2 className="m-0 text-base font-bold flex items-center">
          <span className="mr-2">📊</span> Skills
        </h2>
      </div>
      
      <div className="p-2 flex-1 overflow-hidden">
        <div className="flex flex-col gap-1.5 h-full overflow-y-auto pr-1 custom-scrollbar">
          {Object.values(skills).filter(Boolean).map((skill: Skill) => (
            <div 
              key={skill.id} 
              className={`bg-item-bg border rounded-md overflow-hidden transition-all duration-200 text-xs
                ${currentSkill?.id === skill.id ? 'border-primary shadow-sm' : 'border-item-border'}`}
            >
              <div 
                className="cursor-pointer p-1.5"
                onClick={() => toggleSkillDetails(skill.id)}
                tabIndex={0}
                aria-label={`${skill.name} skill, level ${skill.level}`}
                onKeyDown={(e) => e.key === 'Enter' && toggleSkillDetails(skill.id)}
              >
                <div className="flex items-center mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-panel-bg flex items-center justify-center mr-1.5 text-base">
                    {getSkillEmoji(skill)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs text-text truncate">{skill.name}</div>
                    <div className="flex items-center justify-between">
                      <div className="text-xxs text-text-secondary flex items-center">
                        {skill.isActive ? (
                          <span className="flex items-center text-success">
                            <span className="w-1 h-1 bg-success rounded-full mr-0.5 animate-pulse"></span>
                            Active
                          </span>
                        ) : 'Inactive'}
                      </div>
                      <span className="bg-primary/10 text-primary text-xxs font-medium px-1 py-0.5 rounded-full">
                        Lvl {skill.level}
                      </span>
                    </div>
                  </div>
                </div>
                
                <SkillProgressBar skill={skill} showActionProgress={true} />
                
                <div className="flex justify-end mt-1">
                  <button
                    className={`px-2 py-0.5 rounded text-xxs font-medium transition-all flex items-center ${
                      skill.isActive 
                        ? 'bg-danger text-white hover:bg-danger/90' 
                        : 'bg-primary text-white hover:bg-primary-dark'
                    }`}
                    onClick={(e) => handleToggleSkill(skill, e)}
                    aria-label={skill.isActive ? `Stop ${skill.name}` : `Start ${skill.name}`}
                  >
                    {skill.isActive ? (
                      <>
                        <svg className="w-2.5 h-2.5 mr-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
                          <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
                        </svg>
                        Stop
                      </>
                    ) : (
                      <>
                        <svg className="w-2.5 h-2.5 mr-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 5.14V19.14L19 12.14L8 5.14Z" fill="currentColor" />
                        </svg>
                        Start
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {expandedSkillId === skill.id && (
                <div className="px-1.5 pb-1.5 pt-0.5 border-t border-panel-border bg-panel-bg/50">
                  <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                    <div className="bg-panel-bg rounded p-1 flex flex-col">
                      <span className="text-xxs text-text-secondary">XP/action</span>
                      <span className="font-medium text-xxs text-text flex items-center">
                        <span className="text-primary mr-0.5">+</span>
                        {skill.xpPerAction}
                      </span>
                    </div>
                    <div className="bg-panel-bg rounded p-1 flex flex-col">
                      <span className="text-xxs text-text-secondary">Total XP</span>
                      <span className="font-medium text-xxs text-text">
                        {skill.totalXp ? skill.totalXp.toLocaleString() : skill.xp.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  {skill.mastery && skill.mastery.unlocks && Object.keys(skill.mastery.unlocks).length > 0 && (
                    <div>
                      <h4 className="text-xxs font-semibold mb-1 text-text flex items-center">
                        <span className="mr-0.5">🔓</span> Mastery Unlocks
                      </h4>
                      <div className="bg-panel-bg rounded p-1">
                        <div className="text-xxs divide-y divide-panel-border">
                          {Object.entries(skill.mastery.unlocks).slice(0, 2).map(([level, description]) => (
                            <div 
                              key={level}
                              className={`py-0.5 px-1 ${
                                skill.level >= parseInt(level) 
                                  ? 'opacity-100' 
                                  : 'opacity-60'
                              }`}
                            >
                              <div className="flex items-start">
                                <span className={`inline-block shrink-0 rounded-full px-1 text-xxs font-medium ${
                                  skill.level >= parseInt(level) 
                                    ? 'bg-primary/10 text-primary' 
                                    : 'bg-gray-200 dark:bg-gray-700 text-text-secondary'
                                }`}>
                                  {level}
                                </span> 
                                <span className="ml-1 text-xxs text-text line-clamp-1">{description}</span>
                              </div>
                            </div>
                          ))}
                          {Object.keys(skill.mastery.unlocks).length > 2 && (
                            <div className="py-0.5 px-1 text-xxs text-primary-dark text-center hover:underline cursor-pointer">
                              + {Object.keys(skill.mastery.unlocks).length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillPanel; 