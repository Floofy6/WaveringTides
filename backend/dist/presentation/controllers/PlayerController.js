"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerController = void 0;
const PlayerAdapter_1 = require("../../application/adapters/PlayerAdapter");
class PlayerController {
    constructor(gameService, playerService) {
        this.gameService = gameService;
        this.playerService = playerService;
    }
    async getPlayer(req, res) {
        try {
            const playerId = req.params.id;
            // Load using PlayerService which returns AggregatePlayer
            let player = await this.playerService.loadGame(playerId);
            if (!player) {
                // Create a new player using GameService which returns EntityPlayer
                const entityPlayer = await this.gameService.createPlayer(playerId);
                // Convert EntityPlayer to AggregatePlayer
                player = PlayerAdapter_1.PlayerAdapter.toAggregate(entityPlayer);
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
        }
        catch (error) {
            console.error('Error in getPlayer:', error);
            res.status(500).json({ error: 'Failed to get player' });
        }
    }
    async updatePlayer(req, res) {
        try {
            const playerId = req.params.id;
            await this.gameService.update(playerId);
            res.json({ success: true });
        }
        catch (error) {
            console.error('Error in updatePlayer:', error);
            res.status(500).json({ error: 'Failed to update player' });
        }
    }
    async startSkill(req, res) {
        try {
            const playerId = req.params.playerId || 'player1';
            const { skillId } = req.params;
            await this.playerService.startSkill(playerId, skillId);
            await this.gameService.update(playerId);
            const player = await this.playerService.loadGame(playerId);
            res.status(200).json({ player });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async stopSkill(req, res) {
        try {
            const playerId = req.params.playerId || 'player1';
            const { skillId } = req.params;
            await this.playerService.stopSkill(playerId, skillId);
            await this.gameService.update(playerId);
            const player = await this.playerService.loadGame(playerId);
            res.status(200).json({ player });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async craftItem(req, res) {
        try {
            const playerId = req.params.playerId || 'player1';
            const { itemId } = req.params;
            await this.playerService.craftItem(playerId, itemId);
            await this.gameService.update(playerId);
            const player = await this.playerService.loadGame(playerId);
            res.status(200).json({ player });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async buyItem(req, res) {
        try {
            const playerId = req.params.playerId || 'player1';
            const { itemId } = req.params;
            const { quantity } = req.body;
            await this.playerService.buyItem(playerId, itemId, quantity || 1);
            await this.gameService.update(playerId);
            const player = await this.playerService.loadGame(playerId);
            res.status(200).json({ player });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async sellItem(req, res) {
        try {
            const playerId = req.params.playerId || 'player1';
            const { itemId } = req.params;
            const { quantity } = req.body;
            await this.playerService.sellItem(playerId, itemId, quantity || 1);
            await this.gameService.update(playerId);
            const player = await this.playerService.loadGame(playerId);
            res.status(200).json({ player });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async startCombat(req, res) {
        try {
            const playerId = req.params.playerId || 'player1';
            const { enemyId } = req.params;
            await this.playerService.startCombat(playerId, enemyId);
            await this.gameService.update(playerId);
            const player = await this.playerService.loadGame(playerId);
            res.status(200).json({ player });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async stopCombat(req, res) {
        try {
            const playerId = req.params.playerId || 'player1';
            await this.playerService.stopCombat(playerId);
            await this.gameService.update(playerId);
            const player = await this.playerService.loadGame(playerId);
            res.status(200).json({ player });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async equipItem(req, res) {
        try {
            const playerId = req.params.playerId || 'player1';
            const { itemId } = req.params;
            await this.playerService.equipItem(playerId, itemId);
            await this.gameService.update(playerId);
            const player = await this.playerService.loadGame(playerId);
            res.status(200).json({ player });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async unequipItem(req, res) {
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
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}
exports.PlayerController = PlayerController;
//# sourceMappingURL=PlayerController.js.map