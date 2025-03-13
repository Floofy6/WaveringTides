"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoPlayerRepository = void 0;
const PlayerSchema_1 = require("./schemas/PlayerSchema");
const PlayerAdapter_1 = require("../../../application/adapters/PlayerAdapter");
const Player_1 = require("../../../domain/aggregates/player/Player");
const Skill_1 = require("../../../domain/aggregates/player/Skill");
class MongoPlayerRepository {
    async getById(playerId) {
        try {
            const playerDocument = await PlayerSchema_1.PlayerModel.findOne({ id: playerId });
            if (!playerDocument) {
                return undefined;
            }
            // First create an aggregate player
            const aggregatePlayer = this.mapToAggregate(playerDocument);
            // Then convert to entity player
            return PlayerAdapter_1.PlayerAdapter.toEntity(aggregatePlayer);
        }
        catch (error) {
            console.error('Error fetching player:', error);
            return undefined;
        }
    }
    async save(player) {
        try {
            // Convert entity player to aggregate
            const aggregatePlayer = PlayerAdapter_1.PlayerAdapter.toAggregate(player);
            // Map to MongoDB document format
            const playerData = this.mapToPersistence(aggregatePlayer);
            await PlayerSchema_1.PlayerModel.findOneAndUpdate({ id: player.getId() }, playerData, { upsert: true });
        }
        catch (error) {
            console.error('Error saving player:', error);
        }
    }
    mapToAggregate(playerDocument) {
        // Create a new aggregate player instance
        const player = new Player_1.Player(playerDocument.id);
        // Set basic properties
        player.gold = playerDocument.gold || 0;
        player.lastUpdate = playerDocument.lastUpdate || Date.now();
        // Map skills
        if (playerDocument.skills) {
            for (const skillKey in playerDocument.skills) {
                const skillData = playerDocument.skills[skillKey];
                // Create the skill directly in the skills object
                // Note: AggregateSkill constructor only takes 3 parameters (id, name, xpPerAction)
                const skill = new Skill_1.Skill(skillData.id, skillData.name, skillData.xpPerAction || 1);
                // Set additional properties
                skill.level = skillData.level || 1;
                skill.xp = skillData.xp || 0;
                skill.isActive = skillData.isActive || false;
                player.skills[skillData.id] = skill;
            }
        }
        // Map inventory
        if (playerDocument.inventory) {
            for (const itemKey in playerDocument.inventory) {
                const itemData = playerDocument.inventory[itemKey];
                player.addItem({
                    id: itemData.id,
                    name: itemData.name,
                    quantity: itemData.quantity || 1,
                    type: itemData.type,
                    sellPrice: itemData.sellPrice,
                    buyPrice: itemData.buyPrice,
                    stats: itemData.stats,
                    slot: itemData.slot,
                    craftingRecipe: itemData.craftingRecipe
                });
            }
        }
        // Map equipment
        if (playerDocument.equipment) {
            if (playerDocument.equipment.weapon) {
                player.equipItem(playerDocument.equipment.weapon);
            }
            if (playerDocument.equipment.armor) {
                player.equipItem(playerDocument.equipment.armor);
            }
        }
        // Map combat state
        if (playerDocument.combat) {
            player.combat.isFighting = playerDocument.combat.isFighting || false;
            if (playerDocument.combat.currentEnemy) {
                player.startFighting(playerDocument.combat.currentEnemy);
            }
        }
        return player;
    }
    mapToPersistence(player) {
        // Create a representation of player suitable for MongoDB
        return {
            id: player.id,
            gold: player.gold,
            lastUpdate: player.lastUpdate,
            skills: player.skills,
            inventory: player.inventory,
            equipment: player.equipment,
            combat: player.combat
        };
    }
}
exports.MongoPlayerRepository = MongoPlayerRepository;
//# sourceMappingURL=MongoPlayerRepository.js.map