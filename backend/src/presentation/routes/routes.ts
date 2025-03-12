import express from 'express';
import { PlayerController } from '../controllers/PlayerController';
import { PlayerService } from '../../application/services/PlayerService';
import { GameService } from '../../application/services/GameService';
import { SkillService } from '../../application/services/SkillService';
import { CombatService } from '../../application/services/CombatService';
import { CraftingService } from '../../application/services/CraftingService';
import { ShopService } from '../../application/services/ShopService';
import { InMemoryPlayerRepository } from '../../infrastructure/persistence/inMemory/InMemoryPlayerRepository';
import { InMemoryItemRepository } from '../../infrastructure/persistence/inMemory/InMemoryItemRepository';
import { InMemoryEnemyRepository } from '../../infrastructure/persistence/inMemory/InMemoryEnemyRepository';
import { InMemoryShopRepository } from '../../infrastructure/persistence/inMemory/InMemoryShopRepository';

const router = express.Router();

// Create instances of repositories
const playerRepository = new InMemoryPlayerRepository();
const itemRepository = new InMemoryItemRepository();
const enemyRepository = new InMemoryEnemyRepository();
const shopRepository = new InMemoryShopRepository();

// Create instances of services
const skillService = new SkillService(itemRepository);
const combatService = new CombatService(itemRepository);
const craftingService = new CraftingService(itemRepository);
const shopService = new ShopService(shopRepository);
const playerService = new PlayerService(
  playerRepository,
  shopService,
  craftingService,
  enemyRepository
);
const gameService = new GameService(playerRepository, skillService, combatService);

// Create instance of controller
const playerController = new PlayerController(playerService, gameService);

// Define routes
router.get('/api/game/:playerId?', (req, res) => playerController.getGame(req, res));

// Skill routes
router.post('/api/skill/:skillId/start/:playerId?', (req, res) => playerController.startSkill(req, res));
router.post('/api/skill/:skillId/stop/:playerId?', (req, res) => playerController.stopSkill(req, res));

// Crafting routes
router.post('/api/craft/:itemId/:playerId?', (req, res) => playerController.craftItem(req, res));

// Shop routes
router.post('/api/shop/buy/:itemId/:playerId?', (req, res) => playerController.buyItem(req, res));
router.post('/api/shop/sell/:itemId/:playerId?', (req, res) => playerController.sellItem(req, res));

// Combat routes
router.post('/api/combat/start/:enemyId/:playerId?', (req, res) => playerController.startCombat(req, res));
router.post('/api/combat/stop/:playerId?', (req, res) => playerController.stopCombat(req, res));

// Equipment routes
router.post('/api/equipment/equip/:itemId/:playerId?', (req, res) => playerController.equipItem(req, res));
router.post('/api/equipment/unequip/:slot/:playerId?', (req, res) => playerController.unequipItem(req, res));

export default router;