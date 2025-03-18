"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerService = void 0;
const PlayerAdapter_1 = require("../adapters/PlayerAdapter");
class PlayerService {
    constructor(playerRepository, shopService, craftingService, enemyRepository) {
        this.playerRepository = playerRepository;
        this.shopService = shopService;
        this.craftingService = craftingService;
        this.enemyRepository = enemyRepository;
    }
    async loadGame(playerId) {
        const entityPlayer = await this.playerRepository.getById(playerId);
        if (!entityPlayer) {
            return undefined;
        }
        // Convert entity player to aggregate player
        return PlayerAdapter_1.PlayerAdapter.toAggregate(entityPlayer);
    }
    async saveGame(player) {
        // Convert aggregate player to entity player
        const entityPlayer = PlayerAdapter_1.PlayerAdapter.toEntity(player);
        await this.playerRepository.save(entityPlayer);
    }
    async startSkill(playerId, skillId) {
        const player = await this.loadGame(playerId);
        if (!player) {
            throw new Error(`Player with ID ${playerId} not found`);
        }
        const skillObj = player.skills[skillId];
        if (!skillObj) {
            throw new Error(`Skill with ID ${skillId} not found`);
        }
        // Set the skill to active
        skillObj.isActive = true;
        await this.saveGame(player);
    }
    async stopSkill(playerId, skillId) {
        const player = await this.loadGame(playerId);
        if (!player) {
            throw new Error(`Player with ID ${playerId} not found`);
        }
        const skillObj = player.skills[skillId];
        if (!skillObj) {
            throw new Error(`Skill with ID ${skillId} not found`);
        }
        // Set the skill to inactive
        skillObj.isActive = false;
        await this.saveGame(player);
    }
    async craftItem(playerId, itemId) {
        const player = await this.loadGame(playerId);
        if (!player) {
            throw new Error(`Player with ID ${playerId} not found`);
        }
        await this.craftingService.craft(player, itemId);
        await this.saveGame(player);
    }
    async buyItem(playerId, itemId, quantity) {
        const player = await this.loadGame(playerId);
        if (!player) {
            throw new Error(`Player with ID ${playerId} not found`);
        }
        await this.shopService.buyItem(player, itemId, quantity);
        await this.saveGame(player);
    }
    async sellItem(playerId, itemId, quantity) {
        const player = await this.loadGame(playerId);
        if (!player) {
            throw new Error(`Player with ID ${playerId} not found`);
        }
        await this.shopService.sellItem(player, itemId, quantity);
        await this.saveGame(player);
    }
    async startCombat(playerId, enemyId) {
        if (!this.enemyRepository) {
            throw new Error("Enemy repository not initialized");
        }
        const player = await this.loadGame(playerId);
        if (!player) {
            throw new Error(`Player with ID ${playerId} not found`);
        }
        const enemy = await this.enemyRepository.getById(enemyId);
        if (!enemy) {
            throw new Error(`Enemy with ID ${enemyId} not found`);
        }
        player.startFighting(enemy);
        await this.saveGame(player);
    }
    async stopCombat(playerId) {
        const player = await this.loadGame(playerId);
        if (!player) {
            throw new Error(`Player with ID ${playerId} not found`);
        }
        player.stopFighting();
        await this.saveGame(player);
    }
    async equipItem(playerId, itemId) {
        const player = await this.loadGame(playerId);
        if (!player) {
            throw new Error(`Player with ID ${playerId} not found`);
        }
        if (!player.hasItem(itemId)) {
            throw new Error(`Item with ID ${itemId} not found in inventory`);
        }
        const item = player.inventory[itemId];
        player.equipItem(item);
        await this.saveGame(player);
    }
    async unequipItem(playerId, slot) {
        const player = await this.loadGame(playerId);
        if (!player) {
            throw new Error(`Player with ID ${playerId} not found`);
        }
        player.unequipItem(slot);
        await this.saveGame(player);
    }
}
exports.PlayerService = PlayerService;
//# sourceMappingURL=PlayerService.js.map