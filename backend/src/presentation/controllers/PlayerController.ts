import { Request, Response } from 'express';
import { GameService } from '../../application/services/GameService';
import { PlayerService } from '../../application/services/PlayerService';
import { PlayerAdapter } from '../../application/adapters/PlayerAdapter';

export class PlayerController {
  private gameService: GameService;
  private playerService: PlayerService;

  constructor(gameService: GameService, playerService: PlayerService) {
    this.gameService = gameService;
    this.playerService = playerService;
  }

  async getPlayer(req: Request, res: Response): Promise<void> {
    try {
      const playerId = req.params.id;
      // Load using PlayerService which returns AggregatePlayer
      let player = await this.playerService.loadGame(playerId);
      
      if (!player) {
        // Create a new player using GameService which returns EntityPlayer
        const entityPlayer = await this.gameService.createPlayer(playerId);
        // Convert EntityPlayer to AggregatePlayer
        player = PlayerAdapter.toAggregate(entityPlayer);
      }
      
      // Create a sanitized version of the player data for the response
      const playerData = {
        id: player.id,
        gold: player.gold,
        lastUpdate: player.lastUpdate,
        skills: player.skills,
        inventory: player.inventory,
        equipment: player.equipment,
        combat: player.combat
      };
      
      res.json(playerData);
    } catch (error) {
      console.error('Error in getPlayer:', error);
      res.status(500).json({ error: 'Failed to get player' });
    }
  }

  async updatePlayer(req: Request, res: Response): Promise<void> {
    try {
      const playerId = req.params.id;
      await this.gameService.update(playerId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error in updatePlayer:', error);
      res.status(500).json({ error: 'Failed to update player' });
    }
  }

  async startSkill(req: Request, res: Response): Promise<void> {
    try {
      const playerId = req.params.playerId || 'player1';
      const { skillId } = req.params;
      
      await this.playerService.startSkill(playerId, skillId);
      await this.gameService.update(playerId);
      
      const player = await this.playerService.loadGame(playerId);
      res.status(200).json({ player });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async stopSkill(req: Request, res: Response): Promise<void> {
    try {
      const playerId = req.params.playerId || 'player1';
      const { skillId } = req.params;
      
      await this.playerService.stopSkill(playerId, skillId);
      await this.gameService.update(playerId);
      
      const player = await this.playerService.loadGame(playerId);
      res.status(200).json({ player });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async craftItem(req: Request, res: Response): Promise<void> {
    try {
      const playerId = req.params.playerId || 'player1';
      const { itemId } = req.params;
      
      await this.playerService.craftItem(playerId, itemId);
      await this.gameService.update(playerId);
      
      const player = await this.playerService.loadGame(playerId);
      res.status(200).json({ player });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async buyItem(req: Request, res: Response): Promise<void> {
    try {
      const playerId = req.params.playerId || 'player1';
      const { itemId } = req.params;
      const { quantity } = req.body;
      
      await this.playerService.buyItem(playerId, itemId, quantity || 1);
      await this.gameService.update(playerId);
      
      const player = await this.playerService.loadGame(playerId);
      res.status(200).json({ player });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async sellItem(req: Request, res: Response): Promise<void> {
    try {
      const playerId = req.params.playerId || 'player1';
      const { itemId } = req.params;
      const { quantity } = req.body;
      
      await this.playerService.sellItem(playerId, itemId, quantity || 1);
      await this.gameService.update(playerId);
      
      const player = await this.playerService.loadGame(playerId);
      res.status(200).json({ player });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async startCombat(req: Request, res: Response): Promise<void> {
    try {
      const playerId = req.params.playerId || 'player1';
      const { enemyId } = req.params;
      
      await this.playerService.startCombat(playerId, enemyId);
      await this.gameService.update(playerId);
      
      const player = await this.playerService.loadGame(playerId);
      res.status(200).json({ player });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async stopCombat(req: Request, res: Response): Promise<void> {
    try {
      const playerId = req.params.playerId || 'player1';
      
      await this.playerService.stopCombat(playerId);
      await this.gameService.update(playerId);
      
      const player = await this.playerService.loadGame(playerId);
      res.status(200).json({ player });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async equipItem(req: Request, res: Response): Promise<void> {
    try {
      const playerId = req.params.playerId || 'player1';
      const { itemId } = req.params;
      
      await this.playerService.equipItem(playerId, itemId);
      await this.gameService.update(playerId);
      
      const player = await this.playerService.loadGame(playerId);
      res.status(200).json({ player });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async unequipItem(req: Request, res: Response) {
    try {
      const playerId = req.params.playerId || 'player1';
      const { slot } = req.params;
      
      if (slot !== 'weapon' && slot !== 'armor') {
        return res.status(400).json({ message: 'Invalid equipment slot' });
      }
      
      await this.playerService.unequipItem(playerId, slot);
      await this.gameService.update(playerId);
      
      const player = await this.playerService.loadGame(playerId);
      return res.status(200).json({ player });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}