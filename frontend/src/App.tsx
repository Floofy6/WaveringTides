import React from 'react';
import { GameProvider } from './context/GameContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import SkillList from './features/skills/SkillList';
import CombatPanel from './features/combat/CombatPanel';
import InventoryPanel from './features/inventory/InventoryPanel';
import ShopPanel from './features/shop/ShopPanel';
import EquipmentPanel from './features/equipment/EquipmentPanel';
import GameTick from './components/GameTick';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <MainLayout>
          <GameTick />
          <div className="game-container">
            <div className="left-panel">
              <SkillList />
            </div>
            <div className="center-panel">
              <CombatPanel />
            </div>
            <div className="right-panel">
              <InventoryPanel />
              <ShopPanel />
              <EquipmentPanel />
            </div>
          </div>
        </MainLayout>
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;