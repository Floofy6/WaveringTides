import { Player } from '../../domain/aggregates/player/Player';
import { Skill } from '../../domain/aggregates/player/Skill';
import { PlayerRepository } from '../../domain/repositories/PlayerRepository';
import { SkillService } from './SkillService';
import { CombatService } from './CombatService';
import { SKILL_IDS } from '../../shared/constants';

export class GameService {
  private playerRepository: PlayerRepository;
  private skillService: SkillService;
  private combatService: CombatService;

  constructor(
    playerRepository: PlayerRepository,
    skillService: SkillService,
    combatService: CombatService
  ) {
    this.playerRepository = playerRepository;
    this.skillService = skillService;
    this.combatService = combatService;
  }

  async update(playerId: string): Promise<void> {
    const player = await this.playerRepository.getById(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    const now = Date.now();
    const elapsedTime = now - player.lastUpdate;
    
    // Update active skills
    for (const skillId in player.skills) {
      if (player.skills.hasOwnProperty(skillId)) {
        const skill = player.skills[skillId];
        if (skill.isActive) {
          this.skillService.applySkillAction(skill, player, elapsedTime);
        }
      }
    }

    // Handle combat
    if (player.combat.isFighting && player.combat.currentEnemy) {
      this.combatService.handleCombatRound(player, player.combat.currentEnemy, elapsedTime);
    }

    // Update timestamp and save
    player.lastUpdate = now;
    await this.playerRepository.save(player);
  }

  async createPlayer(playerId: string): Promise<Player> {
    const newPlayer = new Player(playerId);
    
    // Initialize base skills
    const woodcutting = new Skill(SKILL_IDS.WOODCUTTING, 'Woodcutting', 5);
    const fishing = new Skill(SKILL_IDS.FISHING, 'Fishing', 7);
    const mining = new Skill(SKILL_IDS.MINING, 'Mining', 10);
    const firemaking = new Skill(SKILL_IDS.FIREMAKING, 'Firemaking', 4);
    const cooking = new Skill(SKILL_IDS.COOKING, 'Cooking', 6);
    const smithing = new Skill(SKILL_IDS.SMITHING, 'Smithing', 8);
    const attack = new Skill(SKILL_IDS.ATTACK, 'Attack', 4);
    const strength = new Skill(SKILL_IDS.STRENGTH, 'Strength', 4);
    const defence = new Skill(SKILL_IDS.DEFENCE, 'Defence', 4);
    const hitpoints = new Skill(SKILL_IDS.HITPOINTS, 'Hitpoints', 3);
    
    newPlayer.addSkill(woodcutting);
    newPlayer.addSkill(fishing);
    newPlayer.addSkill(mining);
    newPlayer.addSkill(firemaking);
    newPlayer.addSkill(cooking);
    newPlayer.addSkill(smithing);
    newPlayer.addSkill(attack);
    newPlayer.addSkill(strength);
    newPlayer.addSkill(defence);
    newPlayer.addSkill(hitpoints);
    
    // Give starting gold
    newPlayer.addGold(50);
    
    await this.playerRepository.save(newPlayer);
    return newPlayer;
  }
}