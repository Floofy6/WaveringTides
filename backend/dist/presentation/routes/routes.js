"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const RepositoryFactory_1 = require("../../infrastructure/persistence/RepositoryFactory");
const ShopService_1 = require("../../application/services/ShopService");
const GameService_1 = require("../../application/services/GameService");
const PlayerService_1 = require("../../application/services/PlayerService");
const CombatService_1 = require("../../application/services/CombatService");
const CraftingService_1 = require("../../application/services/CraftingService");
const SkillService_1 = require("../../application/services/SkillService");
const PlayerController_1 = require("../controllers/PlayerController");
const router = express_1.default.Router();
exports.router = router;
// Initialize repositories
const playerRepository = RepositoryFactory_1.RepositoryFactory.createPlayerRepository();
const itemRepository = RepositoryFactory_1.RepositoryFactory.createItemRepository();
const enemyRepository = RepositoryFactory_1.RepositoryFactory.createEnemyRepository();
// Initialize services
const skillService = new SkillService_1.SkillService();
const combatService = new CombatService_1.CombatService();
const craftingService = new CraftingService_1.CraftingService(itemRepository);
const shopService = new ShopService_1.ShopService(itemRepository);
const gameService = new GameService_1.GameService(playerRepository, skillService, combatService);
const playerService = new PlayerService_1.PlayerService(playerRepository, shopService, craftingService, enemyRepository);
// Initialize controllers
const playerController = new PlayerController_1.PlayerController(gameService, playerService);
// Game routes
router.get('/api/game/:id', (req, res) => playerController.getPlayer(req, res));
router.post('/api/game/:id/update', (req, res) => playerController.updatePlayer(req, res));
// Skill routes
router.post('/api/game/:id/skill/:skillId/start', async (req, res) => {
    try {
        const { id, skillId } = req.params;
        await playerService.startSkill(id, skillId);
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.post('/api/game/:id/skill/:skillId/stop', async (req, res) => {
    try {
        const { id, skillId } = req.params;
        await playerService.stopSkill(id, skillId);
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Item routes
router.post('/api/game/:id/buy/:itemId', async (req, res) => {
    try {
        const { id, itemId } = req.params;
        const quantity = parseInt(req.body.quantity || '1');
        await playerService.buyItem(id, itemId, quantity);
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.post('/api/game/:id/sell/:itemId', async (req, res) => {
    try {
        const { id, itemId } = req.params;
        const quantity = parseInt(req.body.quantity || '1');
        await playerService.sellItem(id, itemId, quantity);
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.post('/api/game/:id/craft/:itemId', async (req, res) => {
    try {
        const { id, itemId } = req.params;
        await playerService.craftItem(id, itemId);
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Items data
router.get('/items', async (_req, res) => {
    try {
        const items = await itemRepository.getAll();
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Combat routes
router.post('/api/game/:id/combat/start/:enemyId', async (req, res) => {
    try {
        const { id, enemyId } = req.params;
        await playerService.startCombat(id, enemyId);
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.post('/api/game/:id/combat/stop', async (req, res) => {
    try {
        const { id } = req.params;
        await playerService.stopCombat(id);
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Equipment routes
router.post('/api/game/:id/equip/:itemId', async (req, res) => {
    try {
        const { id, itemId } = req.params;
        await playerService.equipItem(id, itemId);
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.post('/api/game/:id/unequip/:slot', async (req, res) => {
    try {
        const { id } = req.params;
        const slot = req.params.slot;
        await playerService.unequipItem(id, slot);
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
//# sourceMappingURL=routes.js.map