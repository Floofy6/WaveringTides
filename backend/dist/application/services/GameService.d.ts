import { Player } from '../../domain/entities/Player';
import { PlayerRepository } from '../../domain/repositories/PlayerRepository';
import { SkillService } from './SkillService';
import { CombatService } from './CombatService';
export declare class GameService {
    private playerRepository;
    private skillService;
    private combatService;
    constructor(playerRepository: PlayerRepository, skillService: SkillService, combatService: CombatService);
    update(playerId: string): Promise<void>;
    createPlayer(playerId: string): Promise<Player>;
}
