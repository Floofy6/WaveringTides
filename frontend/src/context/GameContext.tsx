import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { GameState, Item, Skill } from '../types';
import { SKILL_IDS, ITEM_IDS } from '../constants';
import { createMockItems } from '../utils/mockData';
import api from '../services/api';

interface GameContextProps {
  gameState: GameState | null;
  loading: boolean;
  error: string | null;
  updateGameState: (updater: (prevState: GameState | null) => GameState | null) => void;
  saveGame: () => void;
  resetGame: () => void;
  refreshGameState: () => Promise<void>;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

/**
 * Custom hook to access the GameContext
 */
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

/**
 * GameProvider component - Provides game state and operations to the entire app
 */
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string>('player1'); // Default player ID

  /**
   * Load game data from API or create a new game
   */
  const loadGameData = useCallback(async () => {
    console.log('Loading game data...');
    try {
      setLoading(true);
      setError(null);
      
      // Try to load from localStorage first to get the player ID
      const savedPlayerId = localStorage.getItem('playerId');
      if (savedPlayerId) {
        setPlayerId(savedPlayerId);
      }
      
      // Try to fetch from API
      try {
        console.log('Attempting to fetch from API...');
        const gameData = await api.getGame();
        if (gameData) {
          console.log('Game data loaded from API:', gameData);
          setGameState(gameData);
          setLoading(false);
          return;
        }
      } catch (apiError) {
        console.log('API not available, falling back to local storage', apiError);
        
        // Try to load from localStorage if API fails
        const savedGame = localStorage.getItem('gameState');
        if (savedGame) {
          try {
            const parsedGameState = JSON.parse(savedGame);
            console.log('Game data loaded from localStorage:', parsedGameState);
            setGameState(parsedGameState);
            setLoading(false);
            return;
          } catch (parseError) {
            console.error('Error parsing saved game data:', parseError);
            // If parsing fails, remove corrupted data
            localStorage.removeItem('gameState');
          }
        }
      }
      
      // If no data from API or localStorage, create a new game
      console.log('Creating new game...');
      createNewGame();
    } catch (err) {
      console.error('Error loading game:', err);
      setError('Failed to load game data. Please try again.');
      // Create a new game even if loading fails to prevent a blank screen
      createNewGame();
    } finally {
      // Ensure loading is set to false regardless of the outcome
      setLoading(false);
    }
  }, []);

  /**
   * Create a new game with default values
   */
  const createNewGame = () => {
    // Create mock skills
    const mockSkills: { [id: string]: Skill } = {
      [SKILL_IDS.WOODCUTTING]: {
        id: SKILL_IDS.WOODCUTTING,
        name: 'Woodcutting',
        level: 1,
        xp: 0,
        xpPerAction: 5,
        isActive: false,
        mastery: {
          level: 1,
          xp: 0,
          unlocks: {
            '5': 'Faster woodcutting speed',
            '10': 'Double logs chance (10%)'
          }
        }
      },
      [SKILL_IDS.FISHING]: {
        id: SKILL_IDS.FISHING,
        name: 'Fishing',
        level: 1,
        xp: 0,
        xpPerAction: 7,
        isActive: false,
        mastery: {
          level: 1,
          xp: 0,
          unlocks: {
            '5': 'Better fish quality',
            '10': 'Double fish chance (10%)'
          }
        }
      },
      [SKILL_IDS.MINING]: {
        id: SKILL_IDS.MINING,
        name: 'Mining',
        level: 1,
        xp: 0,
        xpPerAction: 6,
        isActive: false,
        mastery: {
          level: 1,
          xp: 0,
          unlocks: {}
        }
      }
    };

    // Convert ITEMS to proper Item type
    const itemsWithProperType = createMockItems();

    // Create mock inventory
    const mockInventory: { [id: string]: Item } = {
      [ITEM_IDS.LOGS]: { ...itemsWithProperType[ITEM_IDS.LOGS], quantity: 5 },
      [ITEM_IDS.RAW_FISH]: { ...itemsWithProperType[ITEM_IDS.RAW_FISH], quantity: 3 }
    };

    const mockData: GameState = {
      player: {
        id: playerId,
        gold: 100,
        lastUpdate: Date.now(),
        skills: mockSkills,
        inventory: mockInventory,
        equipment: {},
        combat: {
          isFighting: false
        }
      }
    };
    
    console.log('New game created:', mockData);
    setGameState(mockData);
    localStorage.setItem('playerId', playerId);
    localStorage.setItem('gameState', JSON.stringify(mockData));
    setLoading(false);
  };

  /**
   * Refresh game state from API
   */
  const refreshGameState = async () => {
    try {
      setLoading(true);
      const gameData = await api.getGame();
      if (gameData) {
        setGameState(gameData);
      }
    } catch (err) {
      console.error('Error refreshing game state:', err);
      // Don't set an error message here to avoid disrupting the UI
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initialize the game on component mount
   */
  useEffect(() => {
    loadGameData();
    
    // Set up autosave
    const saveInterval = setInterval(() => {
      if (gameState) {
        saveGame();
      }
    }, 60000); // Save every minute
    
    return () => clearInterval(saveInterval);
  }, [loadGameData]);

  /**
   * Update the game state
   */
  const updateGameState = useCallback((updater: (prevState: GameState | null) => GameState | null) => {
    setGameState(prev => {
      const newState = updater(prev);
      
      // Save immediately on state update
      if (newState) {
        localStorage.setItem('gameState', JSON.stringify(newState));
      }
      
      return newState;
    });
  }, []);

  /**
   * Save the game to localStorage and API
   */
  const saveGame = useCallback(async () => {
    if (!gameState) return;
    
    try {
      // Update last saved timestamp
      const stateWithTimestamp = {
        ...gameState,
        lastSaved: Date.now()
      };
      
      localStorage.setItem('gameState', JSON.stringify(stateWithTimestamp));
      
      // Try to save to API
      try {
        // This is where we'd call the API to update the game state
        console.log('Saving game to API...');
        await api.updateGame(stateWithTimestamp);
      } catch (apiError) {
        console.error('Error saving to API, saved locally only:', apiError);
      }
    } catch (err) {
      console.error('Error saving game:', err);
      setError('Failed to save game data');
    }
  }, [gameState]);

  /**
   * Reset the game to default values
   */
  const resetGame = useCallback(() => {
    localStorage.removeItem('gameState');
    createNewGame();
  }, []);

  return (
    <GameContext.Provider 
      value={{ 
        gameState, 
        loading, 
        error,
        updateGameState,
        saveGame,
        resetGame,
        refreshGameState
      }}
    >
      {children}
    </GameContext.Provider>
  );
}; 