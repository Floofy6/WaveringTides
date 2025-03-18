import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { GameState, Item, Skill } from '../types';
import { SKILL_IDS, ITEM_IDS } from '../constants';
import { createMockItems } from '../utils/mockData';
import api from '../services/api';
import { 
  safeSetItem, 
  safeGetItem, 
  safeRemoveItem, 
  isStorageAvailable,
  cleanupStorage 
} from '../utils/storageUtils';

// Default empty game state to prevent undefined player errors
const DEFAULT_GAME_STATE: GameState = {
  player: {
    id: '',
    gold: 0,
    lastUpdate: Date.now(),
    skills: {},
    inventory: {},
    equipment: {},
    combat: {
      isFighting: false
    }
  }
};

interface GameContextProps {
  gameState: GameState;
  loading: boolean;
  error: string | null;
  updateGameState: (updater: (prevState: GameState) => GameState) => void;
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
  const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE);
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
      const savedPlayerId = safeGetItem<string>('playerId', '');
      if (savedPlayerId) {
        setPlayerId(savedPlayerId);
      }
      
      // Try to fetch from API
      try {
        console.log('Attempting to fetch from API...');
        const gameData = await api.getGame();
        if (gameData && gameData.player) {
          console.log('Game data loaded from API:', gameData);
          setGameState(gameData);
          setLoading(false);
          return;
        } else {
          console.error('API returned invalid game data (missing player):', gameData);
        }
      } catch (apiError) {
        console.log('API not available, falling back to local storage', apiError);
        
        // Try to load from localStorage if API fails
        const savedGameState = safeGetItem<GameState | null>('gameState', null);
        if (savedGameState && savedGameState.player) {
          console.log('Game data loaded from localStorage:', savedGameState);
          setGameState(savedGameState);
          setLoading(false);
          return;
        } else {
          console.error('localStorage had invalid game data or none was found');
          // Try to clean up storage to free space
          cleanupStorage(['playerId']);
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
    
    // Store the playerId separately from the game state
    safeSetItem('playerId', playerId);
    
    // Use smaller chunks or remove unnecessary data to fit in localStorage
    const minimalState = removeUnnecessaryData(mockData);
    safeSetItem('gameState', minimalState);
    
    setLoading(false);
  };

  /**
   * Remove unnecessary data to reduce storage size
   */
  const removeUnnecessaryData = (state: GameState): GameState => {
    // Create a deep copy to avoid modifying the original
    const copy = JSON.parse(JSON.stringify(state));
    
    // Remove any large unnecessary data
    // For example, we could remove lengthy descriptions or history data
    
    // Clean up player's inventory - if there are items with quantity 0, remove them
    if (copy.player && copy.player.inventory) {
      Object.keys(copy.player.inventory).forEach(key => {
        if (copy.player.inventory[key].quantity === 0) {
          delete copy.player.inventory[key];
        }
      });
    }
    
    return copy;
  };

  /**
   * Refresh game state from API
   */
  const refreshGameState = async () => {
    try {
      setLoading(true);
      const gameData = await api.getGame();
      if (gameData && gameData.player) {
        setGameState(gameData);
      } else {
        console.error('API refreshGameState returned invalid game data (missing player):', gameData);
        // If API doesn't return a valid player, use the current state which has DEFAULT_GAME_STATE
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
  const updateGameState = useCallback((updater: (prevState: GameState) => GameState) => {
    setGameState(prev => {
      try {
        // Apply the updater function to get the new state
        const newState = updater(prev);
        
        // Store a minimal version of the state
        const minimalState = removeUnnecessaryData(newState);
        safeSetItem('gameState', minimalState);
        
        return newState;
      } catch (error) {
        // If something fails in the updater function, log and return the previous state
        console.error('Error updating game state:', error);
        return prev;
      }
    });
  }, []);

  /**
   * Save the game to localStorage and API
   */
  const saveGame = useCallback(async () => {
    try {
      // Update last saved timestamp
      const stateWithTimestamp = {
        ...gameState,
        lastSaved: Date.now()
      };
      
      // Store a minimal version of the state
      const minimalState = removeUnnecessaryData(stateWithTimestamp);
      const saveSuccessful = safeSetItem('gameState', minimalState);
      
      if (!saveSuccessful) {
        console.warn('Failed to save game to localStorage due to size limits or quota exceeded');
        
        // Attempt cleanup to free space
        cleanupStorage(['playerId']);
        
        // Try to save just the critical parts (like player stats)
        const criticalState = extractCriticalGameState(stateWithTimestamp);
        safeSetItem('gameState_critical', criticalState);
      }
      
      // Try to save to API
      try {
        console.log('Saving game to API...');
        await api.updateGame(stateWithTimestamp);
      } catch (apiError) {
        console.error('Error saving to API:', apiError);
      }
    } catch (err) {
      console.error('Error in saveGame function:', err);
      setError('Failed to save game data');
    }
  }, [gameState]);

  /**
   * Extract only the most critical game state to ensure it fits in storage
   */
  const extractCriticalGameState = (state: GameState): Partial<GameState> => {
    // Only keep the most important parts of the state
    return {
      player: {
        id: state.player.id,
        gold: state.player.gold,
        lastUpdate: state.player.lastUpdate || Date.now(),
        skills: state.player.skills,
        // Minimal inventory data
        inventory: {},
        equipment: state.player.equipment,
        combat: {
          isFighting: state.player.combat.isFighting
        }
      }
    };
  };

  /**
   * Reset the game to default values
   */
  const resetGame = useCallback(() => {
    safeRemoveItem('gameState');
    safeRemoveItem('gameState_critical');
    // Keep playerId for consistency
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