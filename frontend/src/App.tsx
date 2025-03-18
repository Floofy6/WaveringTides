import React from 'react';
import { GameProvider, useGameContext } from './context/GameContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import SkillList from './features/skills/SkillList';
import CombatPanel from './features/combat/CombatPanel';
import InventoryPanel from './features/inventory/InventoryPanel';
import ShopPanel from './features/shop/ShopPanel';
import EquipmentPanel from './features/equipment/EquipmentPanel';
import GameTick from './components/GameTick';
import './App.css';

/**
 * GameContent component - Only renders game UI when gameState is loaded
 * Fully optimized for desktop viewing with minimal scrolling
 */
const GameContent: React.FC = () => {
  const { loading, error } = useGameContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-color">
        <div className="text-center">
          <div className="inline-block animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-lg text-text">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-color">
        <div className="text-center p-8 bg-panel rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-danger mb-4">Oops! Something went wrong</h2>
          <p className="text-text mb-4">{error}</p>
          <p className="text-text">Please refresh the page to try again.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <GameTick />
      <div className="h-[calc(100vh-120px)] flex">
        {/* Left sidebar - Skills (narrower column) */}
        <div className="w-64 flex-shrink-0 overflow-hidden pr-3">
          <div className="h-full overflow-auto custom-scrollbar">
            <SkillList />
          </div>
        </div>
        
        {/* Main content area - Combat */}
        <div className="flex-1 overflow-hidden px-3">
          <div className="h-full overflow-auto custom-scrollbar">
            <CombatPanel />
          </div>
        </div>
        
        {/* Right sidebar - Player resources */}
        <div className="w-80 flex-shrink-0 overflow-hidden pl-3">
          <div className="h-full flex flex-col gap-3">
            {/* Top section - Inventory (33% height) */}
            <div className="h-1/3 overflow-auto custom-scrollbar">
              <InventoryPanel />
            </div>
            
            {/* Middle section - Equipment (33% height) */}
            <div className="h-1/3 overflow-auto custom-scrollbar">
              <EquipmentPanel />
            </div>
            
            {/* Bottom section - Shop (33% height) */}
            <div className="h-1/3 overflow-auto custom-scrollbar">
              <ShopPanel />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <MainLayout>
          <GameContent />
        </MainLayout>
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;