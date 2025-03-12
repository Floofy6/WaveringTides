import { Request, Response } from 'express';
import { PlayerService } from '../../application/services/PlayerService';
import { GameService } from '../../application/services/GameService';

export class PlayerController {
  private playerService: PlayerService;
  private gameService: GameService;

  constructor(playerService: PlayerService, gameService: GameService) {
    this.playerService = playerService;
    this.gameService = gameService;
  }

  async getGame(req: Request, res: Response) {
    try {
      const playerId = req.params.playerId || 'player1'; // Default for MVP
      let player = await this.playerService.loadGame(playerId);
      
      if (!player) {
        player = await this.gameService.createPlayer(playerId);
      } else {
        await this.gameService.update(playerId);
      }
      
      const gameState = { player };
      res.status(200).json(gameState);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async startSkill(req: Request, res: Response) {
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

  async stopSkill(req: Request, res: Response) {
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

  async craftItem(req: Request, res: Response) {
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

  async buyItem(req: Request, res: Response) {
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

  async sellItem(req: Request, res: Response) {
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

  async startCombat(req: Request, res: Response) {
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

  async stopCombat(req: Request, res: Response) {
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

  async equipItem(req: Request, res: Response) {
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