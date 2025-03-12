import axios from 'axios';
import { GameState } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = {
  getGame: async (): Promise<GameState> => {
    const response = await axios.get(`${API_URL}/game`);
    return response.data;
  },
  
  startSkill: async (skillId: string): Promise<GameState> => {
    const response = await axios.post(`${API_URL}/skill/${skillId}/start`);
    return response.data;
  },
  
  stopSkill: async (skillId: string): Promise<GameState> => {
    const response = await axios.post(`${API_URL}/skill/${skillId}/stop`);
    return response.data;
  },
  
  craftItem: async (itemId: string): Promise<GameState> => {
    const response = await axios.post(`${API_URL}/craft/${itemId}`);
    return response.data;
  },
  
  buyItem: async (itemId: string, quantity: number): Promise<GameState> => {
    const response = await axios.post(`${API_URL}/shop/buy/${itemId}`, { quantity });
    return response.data;
  },
  
  sellItem: async (itemId: string, quantity: number): Promise<GameState> => {
    const response = await axios.post(`${API_URL}/shop/sell/${itemId}`, { quantity });
    return response.data;
  },
  
  startCombat: async (enemyId: string): Promise<GameState> => {
    const response = await axios.post(`${API_URL}/combat/start/${enemyId}`);
    return response.data;
  },
  
  stopCombat: async (): Promise<GameState> => {
    const response = await axios.post(`${API_URL}/combat/stop`);
    return response.data;
  },
  
  equipItem: async (itemId: string): Promise<GameState> => {
    const response = await axios.post(`${API_URL}/equipment/equip/${itemId}`);
    return response.data;
  },
  
  unequipItem: async (slot: 'weapon' | 'armor'): Promise<GameState> => {
    const response = await axios.post(`${API_URL}/equipment/unequip/${slot}`);
    return response.data;
  }
};

export default api;