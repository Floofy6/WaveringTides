import { Player as PlayerInterface, GoldAmount, Skill, Item, Enemy } from '../../../shared/types';
import { Inventory } from './Inventory';
import { Equipment } from './Equipment';
import { Skill as SkillEntity } from './Skill';
import { SKILL_IDS } from '../../../shared/constants';

export class Player implements PlayerInterface {
  id: string;
  gold: GoldAmount;
  lastUpdate: number;
  skills: { [skillId: string]: Skill };
  inventory: { [itemId: string]: Item };
  equipment: {
    weapon?: Item;
    armor?: Item;
  };
  combat: { currentEnemy?: Enemy; isFighting: boolean; };
  private inventoryEntity: Inventory;
  private equipmentEntity: Equipment;

  constructor(id: string) {
    this.id = id;
    this.gold = 0;
    this.lastUpdate = Date.now();
    this.skills = {};
    this.inventory = {};
    this.equipment = {};
    this.combat = { isFighting: false };
    this.inventoryEntity = new Inventory();
    this.equipmentEntity = new Equipment();
  }

  addGold(amount: GoldAmount) {
    this.gold += amount;
  }

  removeGold(amount: GoldAmount) {
    if (this.gold >= amount) {
      this.gold -= amount;
    } else {
      throw new Error("Insufficient gold");
    }
  }

  addSkill(skill: SkillEntity) {
    this.skills[skill.id] = skill;
  }

  getSkillLevel(skillId: string): number {
    return this.skills[skillId]?.level || 0;
  }

  addXpToSkill(skillId: string, xp: number) {
    if (this.skills[skillId]) {
      const skill = this.skills[skillId];
      skill.xp += xp;
      // Update level based on XP
      while (skill.xp >= this.getXpRequiredForLevel(skill.level + 1)) {
        skill.level += 1;
      }
    }
  }

  getXpRequiredForLevel(level: number): number {
    return Math.floor(100 * (level ** 1.5));
  }

  addItem(item: Item) {
    this.inventoryEntity.addItem(item);
    this.inventory = this.inventoryEntity.getItems();
  }

  removeItem(itemId: string, quantity: number) {
    this.inventoryEntity.removeItem(itemId, quantity);
    this.inventory = this.inventoryEntity.getItems();
  }

  hasItem(itemId: string, quantity = 1): boolean {
    return this.inventoryEntity.hasItem(itemId, quantity);
  }

  getItemQuantity(itemId: string): number {
    return this.inventoryEntity.getItemQuantity(itemId);
  }

  equipItem(item: Item) {
    if (this.hasItem(item.id, 1)) {
      this.equipmentEntity.equip(item);
      this.equipment = this.equipmentEntity.getEquipment();
      this.removeItem(item.id, 1);
    } else {
      throw new Error("Item not in inventory");
    }
  }

  unequipItem(slot: 'weapon' | 'armor') {
    const unequippedItem = this.equipmentEntity.unequip(slot);
    if (unequippedItem) {
      this.addItem(unequippedItem);
    }
    this.equipment = this.equipmentEntity.getEquipment();
  }

  startFighting(enemy: Enemy) {
    this.combat.currentEnemy = { ...enemy }; // Clone enemy to not modify original
    this.combat.isFighting = true;
  }

  stopFighting() {
    this.combat.isFighting = false;
    this.combat.currentEnemy = undefined;
  }

  getTotalAttack(): number {
    let baseAttack = this.getSkillLevel(SKILL_IDS.ATTACK);
    baseAttack += this.equipment.weapon?.stats?.attackBonus || 0;
    return baseAttack;
  }

  getTotalStrength(): number {
    let baseStrength = this.getSkillLevel(SKILL_IDS.STRENGTH);
    baseStrength += this.equipment.weapon?.stats?.strengthBonus || 0;
    return baseStrength;
  }

  getTotalDefense(): number {
    let baseDefense = this.getSkillLevel(SKILL_IDS.DEFENCE);
    baseDefense += this.equipment.armor?.stats?.defenseBonus || 0;
    return baseDefense;
  }
}