import { Player } from '../../domain/entities/Player';
import { Skill } from '../../domain/entities/Skill';
import { PlayerRepository } from '../../domain/repositories/PlayerRepository';
import { SkillService } from './SkillService';
import { CombatService } from './CombatService';
import { SKILL_IDS } from '../../shared/constants';
import { PlayerAdapter } from '../adapters/PlayerAdapter';

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
    const elapsedTime = now - player.getLastUpdate();
    
    // Update active skills
    const skills = player.getSkills();
    for (const skillId in skills) {
      if (Object.prototype.hasOwnProperty.call(skills, skillId)) {
        const skill = skills[skillId];
        if (skill.getIsActive()) {
          // Convert player to aggregate type for the skill service
          const aggregatePlayer = PlayerAdapter.toAggregate(player);
          // Convert skill to the type expected by the skill service
          this.skillService.applySkillAction(
            { 
              id: skill.getId(),
              name: skill.getName(),
              level: skill.getLevel(),
              xp: skill.getXp(),
              xpPerAction: skill.getXpPerAction(),
              isActive: skill.getIsActive()
            }, 
            aggregatePlayer, 
            elapsedTime
          );
          // Convert back to entity type after the skill service updates
          Object.assign(player, PlayerAdapter.toEntity(aggregatePlayer));
        }
      }
    }

    // Handle combat
    const combatState = player.getCombatState();
    if (combatState.isFighting && combatState.currentEnemy) {
      // Convert player to aggregate type for the combat service
      const aggregatePlayer = PlayerAdapter.toAggregate(player);
      // Convert enemy to the type expected by the combat service
      const enemy = combatState.currentEnemy;
      this.combatService.handleCombatRound(
        aggregatePlayer,
        {
          id: enemy.getId(),
          name: enemy.getName(),
          health: enemy.getHealth(),
          attack: enemy.getAttack(),
          defense: enemy.getDefense(),
          maxHealth: enemy.getMaxHealth(),
          lootTable: enemy.getLootTable()
        }, 
        elapsedTime
      );
      // Convert back to entity type after the combat service updates
      Object.assign(player, PlayerAdapter.toEntity(aggregatePlayer));
    }

    // Update timestamp and save
    player.setLastUpdate(now);
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