import { Player } from '../../../domain/aggregates/player/Player';
import { PlayerRepository } from '../../../domain/repositories/PlayerRepository';
import { PlayerModel } from './schemas';
import { Skill } from '../../../domain/aggregates/player/Skill';
import { SKILL_IDS } from '../../../shared/constants';

export class MongoPlayerRepository implements PlayerRepository {
  async getById(playerId: string): Promise<Player | undefined> {
    try {
      const playerDocument = await PlayerModel.findOne({ id: playerId });
      
      if (!playerDocument) {
        return undefined;
      }
      
      // Convert document to domain entity
      const player = new Player(playerDocument.id);
      player.gold = playerDocument.gold;
      player.lastUpdate = playerDocument.lastUpdate;
      
      // Convert skills
      const skillsMap = playerDocument.get('skills');
      if (skillsMap) {
        for (const [skillId, skillData] of skillsMap.entries()) {
          const skill = new Skill(skillData.id, skillData.name, skillData.xpPerAction);
          skill.level = skillData.level;
          skill.xp = skillData.xp;
          skill.isActive = skillData.isActive;
          player.addSkill(skill);
        }
      }
      
      // Convert inventory
      const inventoryMap = playerDocument.get('inventory');
      if (inventoryMap) {
        for (const [itemId, itemData] of inventoryMap.entries()) {
          player.addItem({
            id: itemData.id,
            name: itemData.name,
            quantity: itemData.quantity,
            type: itemData.type,
            sellPrice: itemData.sellPrice,
            buyPrice: itemData.buyPrice,
            stats: itemData.stats,
            slot: itemData.slot,
            craftingRecipe: itemData.craftingRecipe
          });
        }
      }
      
      // Convert equipment
      if (playerDocument.equipment) {
        if (playerDocument.equipment.weapon) {
          player.equipItem(playerDocument.equipment.weapon);
        }
        if (playerDocument.equipment.armor) {
          player.equipItem(playerDocument.equipment.armor);
        }
      }
      
      // Convert combat
      if (playerDocument.combat) {
        player.combat.isFighting = playerDocument.combat.isFighting;
        if (playerDocument.combat.currentEnemy) {
          player.combat.currentEnemy = {
            id: playerDocument.combat.currentEnemy.id,
            name: playerDocument.combat.currentEnemy.name,
            attack: playerDocument.combat.currentEnemy.attack,
            defense: playerDocument.combat.currentEnemy.defense,
            health: playerDocument.combat.currentEnemy.health,
            maxHealth: playerDocument.combat.currentEnemy.maxHealth,
            lootTable: playerDocument.combat.currentEnemy.lootTable
          };
        }
      }
      
      return player;
    } catch (error) {
      console.error('Error fetching player from MongoDB:', error);
      return undefined;
    }
  }

  async save(player: Player): Promise<void> {
    try {
      // Convert player to document structure
      await PlayerModel.findOneAndUpdate(
        { id: player.id },
        {
          id: player.id,
          gold: player.gold,
          lastUpdate: player.lastUpdate,
          skills: player.skills,
          inventory: player.inventory,
          equipment: player.equipment,
          combat: player.combat
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Error saving player to MongoDB:', error);
      throw error;
    }
  }
}