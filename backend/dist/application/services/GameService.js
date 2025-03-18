"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const Player_1 = require("../../domain/entities/Player");
const Skill_1 = require("../../domain/entities/Skill");
const constants_1 = require("../../shared/constants");
const PlayerAdapter_1 = require("../adapters/PlayerAdapter");
class GameService {
    constructor(playerRepository, skillService, combatService) {
        this.playerRepository = playerRepository;
        this.skillService = skillService;
        this.combatService = combatService;
    }
    async update(playerId) {
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
                    const aggregatePlayer = PlayerAdapter_1.PlayerAdapter.toAggregate(player);
                    // Convert skill to the type expected by the skill service
                    this.skillService.applySkillAction({
                        id: skill.getId(),
                        name: skill.getName(),
                        level: skill.getLevel(),
                        xp: skill.getXp(),
                        xpPerAction: skill.getXpPerAction(),
                        isActive: skill.getIsActive()
                    }, aggregatePlayer, elapsedTime);
                    // Convert back to entity type after the skill service updates
                    Object.assign(player, PlayerAdapter_1.PlayerAdapter.toEntity(aggregatePlayer));
                }
            }
        }
        // Handle combat
        const combatState = player.getCombatState();
        if (combatState.isFighting && combatState.currentEnemy) {
            // Convert player to aggregate type for the combat service
            const aggregatePlayer = PlayerAdapter_1.PlayerAdapter.toAggregate(player);
            // Convert enemy to the type expected by the combat service
            const enemy = combatState.currentEnemy;
            this.combatService.handleCombatRound(aggregatePlayer, {
                id: enemy.getId(),
                name: enemy.getName(),
                health: enemy.getHealth(),
                attack: enemy.getAttack(),
                defense: enemy.getDefense(),
                maxHealth: enemy.getMaxHealth(),
                lootTable: enemy.getLootTable()
            }, elapsedTime);
            // Convert back to entity type after the combat service updates
            Object.assign(player, PlayerAdapter_1.PlayerAdapter.toEntity(aggregatePlayer));
        }
        // Update timestamp and save
        player.setLastUpdate(now);
        await this.playerRepository.save(player);
    }
    async createPlayer(playerId) {
        const newPlayer = new Player_1.Player(playerId);
        // Initialize base skills
        const woodcutting = new Skill_1.Skill(constants_1.SKILL_IDS.WOODCUTTING, 'Woodcutting', 5);
        const fishing = new Skill_1.Skill(constants_1.SKILL_IDS.FISHING, 'Fishing', 7);
        const mining = new Skill_1.Skill(constants_1.SKILL_IDS.MINING, 'Mining', 10);
        const firemaking = new Skill_1.Skill(constants_1.SKILL_IDS.FIREMAKING, 'Firemaking', 4);
        const cooking = new Skill_1.Skill(constants_1.SKILL_IDS.COOKING, 'Cooking', 6);
        const smithing = new Skill_1.Skill(constants_1.SKILL_IDS.SMITHING, 'Smithing', 8);
        const attack = new Skill_1.Skill(constants_1.SKILL_IDS.ATTACK, 'Attack', 4);
        const strength = new Skill_1.Skill(constants_1.SKILL_IDS.STRENGTH, 'Strength', 4);
        const defence = new Skill_1.Skill(constants_1.SKILL_IDS.DEFENCE, 'Defence', 4);
        const hitpoints = new Skill_1.Skill(constants_1.SKILL_IDS.HITPOINTS, 'Hitpoints', 3);
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
exports.GameService = GameService;
//# sourceMappingURL=GameService.js.map