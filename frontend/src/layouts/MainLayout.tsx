import React, { ReactNode, useEffect, useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * MainLayout component - Serves as the main container for the game interface
 * Handles loading states and provides a consistent layout structure
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { loading, gameState, error } = useGameContext();
  const { theme, toggleTheme } = useTheme();
  const [forceShowContent, setForceShowContent] = useState(false);
  
  // Add a fallback that shows the content after 5 seconds
  // in case the loading state gets stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      setForceShowContent(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="main-layout" data-theme={theme}>
      <header className="game-header">
        <h1>Wavering Tides</h1>
        <div className="header-controls">
          <PlayerStatusBar />
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme} 
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>
      
      <main className="game-main">
        {loading && !forceShowContent ? (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading your adventure...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="error-message global-error">
                {error}
                <button onClick={() => window.location.reload()} className="retry-button">
                  Retry
                </button>
              </div>
            )}
            {children}
          </>
        )}
      </main>
      
      <footer className="game-footer">
        <p>© 2023 Wavering Tides - An Idle Adventure</p>
      </footer>
    </div>
  );
};

/**
 * PlayerStatusBar component - Shows player's gold and other key stats
 * Extracted as a separate component for better modularity
 */
const PlayerStatusBar: React.FC = () => {
  const { gameState } = useGameContext();
  
  return (
    <div className="player-status-bar">
      <div className="status-item">
        <span className="status-label">Gold:</span>
        <span className="status-value">{gameState?.player?.gold || 0}</span>
      </div>
      {/* Can be extended with more status indicators as needed */}
    </div>
  );
};

export default MainLayout; 