import { Request, Response } from 'express';
import { GameService } from '../../application/services/GameService';
import { PlayerService } from '../../application/services/PlayerService';
export declare class PlayerController {
    private gameService;
    private playerService;
    constructor(gameService: GameService, playerService: PlayerService);
    getPlayer(req: Request, res: Response): Promise<void>;
    updatePlayer(req: Request, res: Response): Promise<void>;
    startSkill(req: Request, res: Response): Promise<void>;
    stopSkill(req: Request, res: Response): Promise<void>;
    craftItem(req: Request, res: Response): Promise<void>;
    buyItem(req: Request, res: Response): Promise<void>;
    sellItem(req: Request, res: Response): Promise<void>;
    startCombat(req: Request, res: Response): Promise<void>;
    stopCombat(req: Request, res: Response): Promise<void>;
    equipItem(req: Request, res: Response): Promise<void>;
    unequipItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
