import express from 'express';
import { RepositoryFactory } from '../../infrastructure/persistence/RepositoryFactory';
import { ShopService } from '../../application/services/ShopService';
import { GameService } from '../../application/services/GameService';
import { PlayerService } from '../../application/services/PlayerService';
import { CombatService } from '../../application/services/CombatService';
import { CraftingService } from '../../application/services/CraftingService';
import { SkillService } from '../../application/services/SkillService';
import { PlayerController } from '../controllers/PlayerController';

const router = express.Router();

// Initialize repositories
const playerRepository = RepositoryFactory.createPlayerRepository();
const itemRepository = RepositoryFactory.createItemRepository();
const enemyRepository = RepositoryFactory.createEnemyRepository();

// Initialize services
const skillService = new SkillService();
const combatService = new CombatService();
const craftingService = new CraftingService(itemRepository);
const shopService = new ShopService(itemRepository);

const gameService = new GameService(
  playerRepository,
  skillService,
  combatService
);

const playerService = new PlayerService(
  playerRepository,
  shopService,
  craftingService,
  enemyRepository
);

// Initialize controllers
const playerController = new PlayerController(gameService, playerService);

// Game routes
router.get('/api/game/:id', (req, res) => playerController.getPlayer(req, res));
router.post('/api/game/:id/update', (req, res) => playerController.updatePlayer(req, res));

// Skill routes
router.post('/api/game/:id/skill/:skillId/start', async (req, res) => {
  try {
    const { id, skillId } = req.params;
    await playerService.startSkill(id, skillId);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/api/game/:id/skill/:skillId/stop', async (req, res) => {
  try {
    const { id, skillId } = req.params;
    await playerService.stopSkill(id, skillId);
    res.status(200).json({ success: true });
  } catch (error: any) {
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
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/api/game/:id/sell/:itemId', async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const quantity = parseInt(req.body.quantity || '1');
    await playerService.sellItem(id, itemId, quantity);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/api/game/:id/craft/:itemId', async (req, res) => {
  try {
    const { id, itemId } = req.params;
    await playerService.craftItem(id, itemId);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Items data
router.get('/items', async (_req, res) => {
  try {
    const items = await itemRepository.getAll();
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Combat routes
router.post('/api/game/:id/combat/start/:enemyId', async (req, res) => {
  try {
    const { id, enemyId } = req.params;
    await playerService.startCombat(id, enemyId);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/api/game/:id/combat/stop', async (req, res) => {
  try {
    const { id } = req.params;
    await playerService.stopCombat(id);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Equipment routes
router.post('/api/game/:id/equip/:itemId', async (req, res) => {
  try {
    const { id, itemId } = req.params;
    await playerService.equipItem(id, itemId);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/api/game/:id/unequip/:slot', async (req, res) => {
  try {
    const { id } = req.params;
    const slot = req.params.slot as 'weapon' | 'armor';
    await playerService.unequipItem(id, slot);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export { router };