import { Player } from '../../domain/aggregates/player/Player';
import { Enemy, Item } from '../../shared/types';
import { SKILL_IDS, ITEMS } from '../../shared/constants';

export class CombatService {
  constructor() {}

  // Helper method to create properly typed items
  private createTypedItem(templateId: string, quantity: number): Item {
    const template = ITEMS[templateId];
    return {
      id: template.id,
      name: template.name,
      quantity: quantity,
      type: template.type as 'resource' | 'equipment',
      sellPrice: template.sellPrice,
      buyPrice: template.buyPrice,
      stats: template.stats,
      slot: template.slot as 'weapon' | 'armor' | undefined
    };
  }

  calculateDamage(attackerStrength: number, attackerAttack: number, defenderDefence: number): number {
    const attackRoll = Math.floor(Math.random() * attackerAttack);
    const defenceRoll = Math.floor(Math.random() * defenderDefence);

    if (attackRoll > defenceRoll) {
      return Math.max(1, Math.floor(Math.random() * attackerStrength));
    }
    return 0;
  }

  handleCombatRound(player: Player, enemy: Enemy, elapsedTime: number) {
    // Calculate how many combat rounds based on elapsed time
    // Assuming one round every 2 seconds
    const rounds = Math.floor(elapsedTime / 2000);
    
    for (let i = 0; i < rounds && player.combat.isFighting; i++) {
      // Player attacks enemy
      const playerDamage = this.calculateDamage(
        player.getTotalStrength(),
        player.getTotalAttack(),
        enemy.defense
      );
      
      if (playerDamage > 0) {
        enemy.health -= playerDamage;
        player.addXpToSkill(SKILL_IDS.ATTACK, playerDamage * 4);
        player.addXpToSkill(SKILL_IDS.STRENGTH, playerDamage * 4);
      }

      // Check if enemy is defeated
      if (enemy.health <= 0) {
        this.handleEnemyDefeat(player, enemy);
        break;
      }

      // Enemy attacks player
      const enemyDamage = this.calculateDamage(
        enemy.attack,
        enemy.attack,
        player.getTotalDefense()
      );
      
      if (enemyDamage > 0) {
        player.addXpToSkill(SKILL_IDS.DEFENCE, enemyDamage * 4);
        player.addXpToSkill(SKILL_IDS.HITPOINTS, -enemyDamage);
        
        // Check if player is defeated (hitpoints at 0)
        const hitpointsSkill = player.skills[SKILL_IDS.HITPOINTS];
        if (hitpointsSkill && hitpointsSkill.xp <= 0) {
          this.handlePlayerDefeat(player);
          break;
        }
      }
    }
  }

  handleEnemyDefeat(player: Player, enemy: Enemy) {
    // Generate loot
    for (const lootEntry of enemy.lootTable) {
      if (Math.random() < lootEntry.chance) {
        const item = this.createTypedItem(lootEntry.itemId, lootEntry.quantity);
        player.addItem(item);
      }
    }

    // Reset combat state
    player.stopFighting();
    
    // Add some gold
    player.addGold(Math.floor(Math.random() * 5) + 5);
  }

  handlePlayerDefeat(player: Player) {
    // Reset combat state
    player.stopFighting();
    
    // Reset hitpoints XP to a small positive value
    if (player.skills[SKILL_IDS.HITPOINTS]) {
      player.skills[SKILL_IDS.HITPOINTS].xp = 10;
    }
  }
}