import axios from 'axios';
import { GameState } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Set default player ID
const DEFAULT_PLAYER_ID = 'player1';

// Get player ID from localStorage or use default
const getPlayerId = () => localStorage.getItem('playerId') || DEFAULT_PLAYER_ID;

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

const api = {
  getGame: async (): Promise<GameState> => {
    try {
      const playerId = getPlayerId();
      const response = await axiosInstance.get(`/game/${playerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching game state:', error);
      throw error;
    }
  },
  
  updateGame: async (gameState: GameState): Promise<GameState> => {
    try {
      const playerId = getPlayerId();
      const response = await axiosInstance.post(`/game/${playerId}/update`, gameState);
      return response.data;
    } catch (error) {
      console.error('Error updating game state:', error);
      throw error;
    }
  },
  
  startSkill: async (skillId: string): Promise<GameState> => {
    try {
      const playerId = getPlayerId();
      const response = await axiosInstance.post(`/game/${playerId}/skill/${skillId}/start`);
      return response.data;
    } catch (error) {
      console.error(`Error starting skill ${skillId}:`, error);
      throw error;
    }
  },
  
  stopSkill: async (skillId: string): Promise<GameState> => {
    try {
      const playerId = getPlayerId();
      const response = await axiosInstance.post(`/game/${playerId}/skill/${skillId}/stop`);
      return response.data;
    } catch (error) {
      console.error(`Error stopping skill ${skillId}:`, error);
      throw error;
    }
  },
  
  craftItem: async (itemId: string): Promise<GameState> => {
    try {
      const playerId = getPlayerId();
      const response = await axiosInstance.post(`/game/${playerId}/craft/${itemId}`);
      return response.data;
    } catch (error) {
      console.error(`Error crafting item ${itemId}:`, error);
      throw error;
    }
  },
  
  buyItem: async (itemId: string, quantity: number): Promise<GameState> => {
    try {
      const playerId = getPlayerId();
      const response = await axiosInstance.post(`/game/${playerId}/buy/${itemId}`, { quantity });
      return response.data;
    } catch (error) {
      console.error(`Error buying item ${itemId}:`, error);
      throw error;
    }
  },
  
  sellItem: async (itemId: string, quantity: number): Promise<GameState> => {
    try {
      const playerId = getPlayerId();
      const response = await axiosInstance.post(`/game/${playerId}/sell/${itemId}`, { quantity });
      return response.data;
    } catch (error) {
      console.error(`Error selling item ${itemId}:`, error);
      throw error;
    }
  },
  
  startCombat: async (enemyId: string): Promise<GameState> => {
    try {
      const playerId = getPlayerId();
      const response = await axiosInstance.post(`/game/${playerId}/combat/start/${enemyId}`);
      return response.data;
    } catch (error) {
      console.error(`Error starting combat with ${enemyId}:`, error);
      throw error;
    }
  },
  
  stopCombat: async (): Promise<GameState> => {
    try {
      const playerId = getPlayerId();
      const response = await axiosInstance.post(`/game/${playerId}/combat/stop`);
      return response.data;
    } catch (error) {
      console.error('Error stopping combat:', error);
      throw error;
    }
  },
  
  equipItem: async (itemId: string): Promise<GameState> => {
    try {
      const playerId = getPlayerId();
      const response = await axiosInstance.post(`/game/${playerId}/equipment/equip/${itemId}`);
      return response.data;
    } catch (error) {
      console.error(`Error equipping item ${itemId}:`, error);
      throw error;
    }
  },
  
  unequipItem: async (slot: 'weapon' | 'armor'): Promise<GameState> => {
    try {
      const playerId = getPlayerId();
      const response = await axiosInstance.post(`/game/${playerId}/equipment/unequip/${slot}`);
      return response.data;
    } catch (error) {
      console.error(`Error unequipping item from slot ${slot}:`, error);
      throw error;
    }
  }
};

export default api;