import React, { useRef, useEffect } from 'react';

interface CombatLogProps {
  logs: string[];
}

/**
 * CombatLog component - Displays a scrollable log of combat events
 * Optimized for compact display in horizontal layout
 */
const CombatLog: React.FC<CombatLogProps> = ({ logs }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when new logs are added
  useEffect(() => {
    try {
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    } catch (error) {
      console.error('Error scrolling combat log:', error);
    }
  }, [logs]);
  
  // Helper function to determine message type for styling and icon
  const getMessageInfo = (message: string): { classes: string; icon: string } => {
    if (!message) return { classes: 'border-l-gray-500 bg-gray-500/10', icon: '📜' };
    
    try {
      if (message.includes('hit') && message.includes('damage')) {
        return message.includes('You hit') 
          ? { classes: 'border-l-success bg-success/10', icon: '⚔️' } 
          : { classes: 'border-l-danger bg-danger/10', icon: '🛡️' };
      } else if (message.includes('missed')) {
        return { classes: 'border-l-gray-400 bg-gray-400/10 opacity-80', icon: '💨' };
      } else if (message.includes('defeated')) {
        return { classes: 'border-l-warning bg-warning/10 font-bold', icon: '💀' };
      } else if (message.includes('Congratulations')) {
        return { classes: 'border-l-purple-600 bg-purple-600/10 font-bold', icon: '🎉' };
      } else if (message.includes('found') || message.includes('received')) {
        return { classes: 'border-l-primary bg-primary/10', icon: '🎁' };
      } else if (message.includes('fled') || message.includes('flee')) {
        return message.includes('successfully') 
          ? { classes: 'border-l-warning bg-warning/10', icon: '🏃' } 
          : { classes: 'border-l-danger bg-danger/10', icon: '❌' };
      } else if (message.includes('defeated')) {
        return { classes: 'border-l-purple-600 bg-purple-600/10 font-bold', icon: '🏆' };
      } else if (message.includes('heal') || message.includes('healing')) {
        return { classes: 'border-l-green-500 bg-green-500/10', icon: '❤️' };
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
    
    return { classes: 'border-l-gray-500 bg-gray-500/10', icon: '📜' };
  };
  
  // Format the message to highlight numbers
  const formatMessage = (message: string): React.ReactNode => {
    if (!message) return null;
    
    try {
      // Regex to find numbers (with optional + sign for positive values)
      const parts = message.split(/(\+?\d+)/g);
      
      return (
        <>
          {parts.map((part, idx) => {
            // If part is a number, highlight it
            if (/^\+?\d+$/.test(part)) {
              return (
                <span key={idx} className={`font-bold ${part.startsWith('+') ? 'text-success' : 'text-warning'}`}>
                  {part}
                </span>
              );
            }
            return <span key={idx}>{part}</span>;
          })}
        </>
      );
    } catch (error) {
      console.error('Error formatting message:', error);
      return <span>{message}</span>;
    }
  };
  
  // Handle scrolling to latest log
  const scrollToLatest = () => {
    try {
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    } catch (error) {
      console.error('Error scrolling to latest log:', error);
    }
  };
  
  // Generate a timestamp for messages
  const getMessageTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex flex-col bg-panel-bg border border-panel-border rounded-md overflow-hidden shadow-inner h-full">
      <div className="py-1 px-2 bg-header-bg text-header-text text-xs font-medium flex items-center">
        <span className="mr-1.5 text-xs">📜</span> Combat Log
        <span className="ml-auto text-xxs bg-white/20 text-white px-1.5 py-0.5 rounded-full">
          {logs && logs.length > 0 ? `${logs.length} events` : 'No events'}
        </span>
      </div>
      
      <div 
        className="overflow-y-auto bg-bg-color/30 p-1.5 flex-1 custom-scrollbar" 
        ref={logContainerRef}
      >
        {!logs || logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-2 text-center text-text-secondary opacity-70">
            <div className="text-xl mb-1">⚔️</div>
            <p className="m-0 text-xxs">No combat activity yet</p>
            <p className="text-xxs mt-0.5">Select an enemy to begin combat</p>
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log, index) => {
              const { classes, icon } = getMessageInfo(log);
              return (
                <div 
                  key={`log-${index}-${log.substring(0, 10)}`} 
                  className={`py-0.5 px-1.5 rounded text-xxs border-l-2 transition-colors hover:bg-panel-bg/50 text-text ${classes} flex items-start`}
                >
                  <span className="mr-1 text-xs mt-0.5 shrink-0">{icon}</span>
                  <span className="flex-1 line-clamp-1">{formatMessage(log)}</span>
                  <span className="text-xxs text-text-secondary ml-1 opacity-60 shrink-0">
                    {getMessageTimestamp()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="px-2 py-0.5 border-t border-panel-border bg-panel-bg flex justify-end items-center text-xxs text-text-secondary">
        {logs && logs.length > 0 && (
          <span>
            {logs.length} total events
          </span>
        )}
      </div>
    </div>
  );
};

export default CombatLog; 