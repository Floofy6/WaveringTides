import React from 'react';
import SkillPanel from './SkillPanel';

/**
 * SkillList component - Container that renders the SkillPanel component
 */
const SkillList: React.FC = () => {
  // We don't need to extract skills here since SkillPanel handles that
  
  return <SkillPanel />;
};

export default SkillList; 