import React, { ReactNode, useEffect, useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * MainLayout component - Serves as the main container for the game interface
 * Optimized exclusively for desktop viewing with enhanced visual styling
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
    <div className="min-h-screen flex flex-col bg-bg-color" data-theme={theme}>
      <header className="bg-header-bg text-header-text px-6 py-3 flex justify-between items-center shadow-md relative z-10">
        <div className="flex items-center">
          <div className="mr-2 text-xl">🌊</div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-header-text to-header-text/90">
            Wavering Tides
          </h1>
        </div>
        <div className="flex items-center space-x-5">
          <PlayerStatusBar />
          <button 
            className="bg-transparent hover:bg-white/10 rounded p-1.5 transition-colors flex items-center justify-center"
            onClick={toggleTheme} 
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>
      
      <main className="flex-1 p-5 max-w-[1400px] mx-auto w-full">
        {loading && !forceShowContent ? (
          <div className="flex items-center justify-center h-[calc(100vh-150px)]">
            <div className="bg-panel-bg p-8 rounded-lg shadow-lg text-center">
              <div className="inline-block animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
              <p className="text-lg text-text">Loading your adventure...</p>
              <p className="text-sm text-text/60 mt-2">Gathering resources and preparing your journey</p>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-danger/10 border border-danger text-danger p-4 rounded-lg mb-5 flex justify-between items-center">
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-3 py-1.5 bg-danger text-white rounded hover:bg-danger/90 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}
            {children}
          </>
        )}
      </main>
      
      <footer className="bg-header-bg text-header-text/70 py-2 px-5 text-center text-sm">
        <p>© 2023 Wavering Tides - An Idle Adventure</p>
      </footer>
    </div>
  );
};

/**
 * PlayerStatusBar component - Shows player's gold and other key stats
 */
const PlayerStatusBar: React.FC = () => {
  const { gameState } = useGameContext();
  
  return (
    <div className="flex items-center">
      <div className="flex items-center bg-black/20 px-3 py-1.5 rounded-md">
        <span className="text-gold-color text-lg mr-2">💰</span>
        <span className="text-gold-color font-medium mr-1">{gameState?.player?.gold?.toLocaleString() || 0}</span>
        <span className="text-header-text/80 text-sm">gold</span>
      </div>
    </div>
  );
};

export default MainLayout; 