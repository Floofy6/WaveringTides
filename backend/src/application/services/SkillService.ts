import { Player } from '../../domain/aggregates/player/Player';
import { Skill as SkillInterface, Item } from '../../shared/types';
import { SKILL_IDS, ITEM_IDS, ITEMS } from '../../shared/constants';

export class SkillService {
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

  // Helper to check if a skill has mastery features
  private hasMasteryFeatures(skill: SkillInterface): boolean {
    return 'mastery' in skill && 
           'addMasteryXp' in skill && 
           'getMasteryBonus' in skill && 
           'hasMasteryChance' in skill;
  }

  calculateXpGain(skill: SkillInterface, elapsedTime: number): number {
    return skill.xpPerAction * (Math.max(1, skill.level) / 10 + 1) * (elapsedTime / 1000);
  }

  applyXp(skill: SkillInterface, xp: number) {
    skill.xp += xp;
  }

  applySkillAction(skill: SkillInterface, player: Player, elapsedTime: number) {
    const xpGained = this.calculateXpGain(skill, elapsedTime);
    this.applyXp(skill, xpGained);
    
    // Handle mastery if the skill has these features
    if (this.hasMasteryFeatures(skill)) {
      const masteryXpGained = xpGained * 0.1;
      (skill as any).addMasteryXp(masteryXpGained);
    }

    switch (skill.id) {
      case SKILL_IDS.WOODCUTTING:
        this.applyWoodcutting(player, elapsedTime, skill);
        break;
      case SKILL_IDS.FISHING:
        this.applyFishing(player, elapsedTime, skill);
        break;
      case SKILL_IDS.MINING:
        this.applyMining(player, elapsedTime, skill);
        break;
    }
  }

  applyWoodcutting(player: Player, elapsedTime: number, skill: SkillInterface) {
    // Default multipliers
    let resourceMultiplier = 1.0;
    let speedMultiplier = 1.0;
    
    // Apply mastery bonuses if available
    if (this.hasMasteryFeatures(skill)) {
      resourceMultiplier = (skill as any).getMasteryBonus('resourceMultiplier');
      speedMultiplier = (skill as any).getMasteryBonus('speedMultiplier');
    }
    
    const baseTime = 3000 / speedMultiplier;
    const baseQuantity = Math.floor(elapsedTime / baseTime) * (1 + Math.floor(player.skills[SKILL_IDS.WOODCUTTING].level / 10));
    let quantity = Math.floor(baseQuantity * resourceMultiplier);
    
    // Check for double resource chance
    if (this.hasMasteryFeatures(skill) && (skill as any).hasMasteryChance('doubleResource')) {
      quantity = Math.floor(quantity * 2);
      console.log('Double logs from mastery bonus!');
    }
    
    if (quantity > 0) {
      const logs = this.createTypedItem(ITEM_IDS.LOGS, quantity);
      player.addItem(logs);
    }
  }

  applyFishing(player: Player, elapsedTime: number, skill: SkillInterface) {
    // Default multipliers
    let resourceMultiplier = 1.0;
    let speedMultiplier = 1.0;
    
    // Apply mastery bonuses if available
    if (this.hasMasteryFeatures(skill)) {
      resourceMultiplier = (skill as any).getMasteryBonus('resourceMultiplier');
      speedMultiplier = (skill as any).getMasteryBonus('speedMultiplier');
    }
    
    const baseTime = 4000 / speedMultiplier;
    const baseQuantity = Math.floor(elapsedTime / baseTime) * (1 + Math.floor(player.skills[SKILL_IDS.FISHING].level / 10));
    let quantity = Math.floor(baseQuantity * resourceMultiplier);
    
    if (this.hasMasteryFeatures(skill) && (skill as any).hasMasteryChance('specialResource')) {
      console.log('Special fish chance triggered!');
    }
    
    if (quantity > 0) {
      const fish = this.createTypedItem(ITEM_IDS.RAW_FISH, quantity);
      player.addItem(fish);
    }
  }

  applyMining(player: Player, elapsedTime: number, skill: SkillInterface) {
    // Default multipliers
    let resourceMultiplier = 1.0;
    let speedMultiplier = 1.0;
    
    // Apply mastery bonuses if available
    if (this.hasMasteryFeatures(skill)) {
      resourceMultiplier = (skill as any).getMasteryBonus('resourceMultiplier');
      speedMultiplier = (skill as any).getMasteryBonus('speedMultiplier');
    }
    
    const baseTime = 5000 / speedMultiplier;
    const baseQuantity = Math.floor(elapsedTime / baseTime) * (1 + Math.floor(player.skills[SKILL_IDS.MINING].level / 10));
    let quantity = Math.floor(baseQuantity * resourceMultiplier);
    
    if (this.hasMasteryFeatures(skill) && (skill as any).hasMasteryChance('specialResource')) {
      console.log('Gem chance triggered!');
    }
    
    if (quantity > 0) {
      const ore = this.createTypedItem(ITEM_IDS.ORE, quantity);
      player.addItem(ore);
    }
  }
}