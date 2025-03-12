import { Player } from '../../domain/aggregates/player/Player';
import { PlayerRepository } from '../../domain/repositories/PlayerRepository';
import { ShopService } from './ShopService';
import { CraftingService } from './CraftingService';
import { EnemyRepository } from '../../domain/repositories/EnemyRepository';
import { Skill } from '../../domain/aggregates/player/Skill';

export class PlayerService {
  private playerRepository: PlayerRepository;
  private shopService: ShopService;
  private craftingService: CraftingService;
  private enemyRepository?: EnemyRepository;

  constructor(
    playerRepository: PlayerRepository,
    shopService: ShopService,
    craftingService: CraftingService,
    enemyRepository?: EnemyRepository
  ) {
    this.playerRepository = playerRepository;
    this.shopService = shopService;
    this.craftingService = craftingService;
    this.enemyRepository = enemyRepository;
  }

  async loadGame(playerId: string): Promise<Player | undefined> {
    return this.playerRepository.getById(playerId);
  }

  async saveGame(player: Player): Promise<void> {
    await this.playerRepository.save(player);
  }

  async startSkill(playerId: string, skillId: string): Promise<void> {
    const player = await this.playerRepository.getById(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    const skillObj = player.skills[skillId];
    if (!skillObj) {
      throw new Error(`Skill with ID ${skillId} not found`);
    }

    // Check if it's an instance of the Skill class
    if (skillObj instanceof Skill) {
      skillObj.activate();
    } else {
      // Force activate by directly setting property (backup approach)
      skillObj.isActive = true;
    }
    
    await this.playerRepository.save(player);
  }

  async stopSkill(playerId: string, skillId: string): Promise<void> {
    const player = await this.playerRepository.getById(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    const skillObj = player.skills[skillId];
    if (!skillObj) {
      throw new Error(`Skill with ID ${skillId} not found`);
    }

    // Check if it's an instance of the Skill class
    if (skillObj instanceof Skill) {
      skillObj.deactivate();
    } else {
      // Force deactivate by directly setting property (backup approach)
      skillObj.isActive = false;
    }
    
    await this.playerRepository.save(player);
  }

  async craftItem(playerId: string, itemId: string): Promise<void> {
    const player = await this.playerRepository.getById(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    await this.craftingService.craft(player, itemId);
    await this.playerRepository.save(player);
  }

  async buyItem(playerId: string, itemId: string, quantity: number): Promise<void> {
    const player = await this.playerRepository.getById(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    await this.shopService.buyItem(player, itemId, quantity);
    await this.playerRepository.save(player);
  }

  async sellItem(playerId: string, itemId: string, quantity: number): Promise<void> {
    const player = await this.playerRepository.getById(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    await this.shopService.sellItem(player, itemId, quantity);
    await this.playerRepository.save(player);
  }

  async startCombat(playerId: string, enemyId: string): Promise<void> {
    if (!this.enemyRepository) {
      throw new Error("Enemy repository not initialized");
    }

    const player = await this.playerRepository.getById(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    const enemy = await this.enemyRepository.getById(enemyId);
    if (!enemy) {
      throw new Error(`Enemy with ID ${enemyId} not found`);
    }

    player.startFighting(enemy);
    await this.playerRepository.save(player);
  }

  async stopCombat(playerId: string): Promise<void> {
    const player = await this.playerRepository.getById(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    player.stopFighting();
    await this.playerRepository.save(player);
  }

  async equipItem(playerId: string, itemId: string): Promise<void> {
    const player = await this.playerRepository.getById(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    if (!player.hasItem(itemId)) {
      throw new Error(`Item with ID ${itemId} not found in inventory`);
    }

    const item = player.inventory[itemId];
    player.equipItem(item);
    await this.playerRepository.save(player);
  }

  async unequipItem(playerId: string, slot: 'weapon' | 'armor'): Promise<void> {
    const player = await this.playerRepository.getById(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    player.unequipItem(slot);
    await this.playerRepository.save(player);
  }
}