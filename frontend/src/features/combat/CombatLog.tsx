import React, { useRef, useEffect } from 'react';

interface CombatLogProps {
  logs: string[];
}

/**
 * CombatLog component - Displays a scrollable log of combat events
 */
const CombatLog: React.FC<CombatLogProps> = ({ logs }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when new logs are added
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);
  
  return (
    <div className="combat-log">
      <h3>Combat Log</h3>
      
      <div className="log-container" ref={logContainerRef}>
        {logs.length === 0 ? (
          <div className="empty-log">No combat activity yet</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="log-entry">
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CombatLog; 