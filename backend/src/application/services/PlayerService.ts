import { Player as AggregatePlayer } from '../../domain/aggregates/player/Player';
import { Player as EntityPlayer } from '../../domain/entities/Player';
import { PlayerRepository } from '../../domain/repositories/PlayerRepository';
import { ShopService } from './ShopService';
import { CraftingService } from './CraftingService';
import { EnemyRepository } from '../../domain/repositories/EnemyRepository';
import { PlayerAdapter } from '../adapters/PlayerAdapter';

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

  async loadGame(playerId: string): Promise<AggregatePlayer | undefined> {
    const entityPlayer = await this.playerRepository.getById(playerId);
    if (!entityPlayer) {
      return undefined;
    }
    
    // Convert entity player to aggregate player
    return PlayerAdapter.toAggregate(entityPlayer as EntityPlayer);
  }

  async saveGame(player: AggregatePlayer): Promise<void> {
    // Convert aggregate player to entity player
    const entityPlayer = PlayerAdapter.toEntity(player);
    await this.playerRepository.save(entityPlayer);
  }

  async startSkill(playerId: string, skillId: string): Promise<void> {
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

  async stopSkill(playerId: string, skillId: string): Promise<void> {
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

  async craftItem(playerId: string, itemId: string): Promise<void> {
    const player = await this.loadGame(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    await this.craftingService.craft(player, itemId);
    await this.saveGame(player);
  }

  async buyItem(playerId: string, itemId: string, quantity: number): Promise<void> {
    const player = await this.loadGame(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    await this.shopService.buyItem(player, itemId, quantity);
    await this.saveGame(player);
  }

  async sellItem(playerId: string, itemId: string, quantity: number): Promise<void> {
    const player = await this.loadGame(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    await this.shopService.sellItem(player, itemId, quantity);
    await this.saveGame(player);
  }

  async startCombat(playerId: string, enemyId: string): Promise<void> {
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

  async stopCombat(playerId: string): Promise<void> {
    const player = await this.loadGame(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    player.stopFighting();
    await this.saveGame(player);
  }

  async equipItem(playerId: string, itemId: string): Promise<void> {
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

  async unequipItem(playerId: string, slot: 'weapon' | 'armor'): Promise<void> {
    const player = await this.loadGame(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    player.unequipItem(slot);
    await this.saveGame(player);
  }
}