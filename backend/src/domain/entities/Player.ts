import { Skill } from './Skill';
import { Item } from './Item';
import { Enemy } from './Enemy';

export class Player {
  private id: string;
  private gold: number;
  private lastUpdate: number;
  private skills: { [skillId: string]: Skill };
  private inventory: { [itemId: string]: Item };
  private equipment: {
    weapon?: Item;
    armor?: Item;
  };
  private combat: {
    currentEnemy?: Enemy;
    isFighting: boolean;
  };

  constructor(id: string) {
    this.id = id;
    this.gold = 0;
    this.lastUpdate = Date.now();
    this.skills = {};
    this.inventory = {};
    this.equipment = {};
    this.combat = {
      isFighting: false
    };
  }

  public getId(): string {
    return this.id;
  }

  public getGold(): number {
    return this.gold;
  }

  public getLastUpdate(): number {
    return this.lastUpdate;
  }

  public getSkills(): { [skillId: string]: Skill } {
    return this.skills;
  }

  public getInventory(): { [itemId: string]: Item } {
    return this.inventory;
  }

  public getEquipment(): { weapon?: Item; armor?: Item } {
    return this.equipment;
  }

  public getCombatState(): { currentEnemy?: Enemy; isFighting: boolean } {
    return this.combat;
  }

  public setGold(gold: number): void {
    this.gold = gold;
  }

  public setLastUpdate(lastUpdate: number): void {
    this.lastUpdate = lastUpdate;
  }

  public setCombatState(isFighting: boolean): void {
    this.combat.isFighting = isFighting;
  }

  public setCurrentEnemy(enemy: Enemy): void {
    this.combat.currentEnemy = enemy;
  }

  public addGold(amount: number): void {
    if (amount < 0) {
      throw new Error('Cannot add negative gold amount');
    }
    this.gold += amount;
  }

  public removeGold(amount: number): boolean {
    if (amount < 0) {
      throw new Error('Cannot remove negative gold amount');
    }
    if (this.gold < amount) {
      return false;
    }
    this.gold -= amount;
    return true;
  }

  public addSkill(skill: Skill): void {
    this.skills[skill.getId()] = skill;
  }

  public getSkill(skillId: string): Skill | undefined {
    return this.skills[skillId];
  }

  public addInventoryItem(item: Item): void {
    const existingItem = this.inventory[item.getId()];
    if (existingItem) {
      existingItem.increaseQuantity(item.getQuantity());
    } else {
      this.inventory[item.getId()] = item;
    }
  }

  public removeInventoryItem(itemId: string, quantity: number): boolean {
    const item = this.inventory[itemId];
    if (!item || item.getQuantity() < quantity) {
      return false;
    }

    item.decreaseQuantity(quantity);
    if (item.getQuantity() <= 0) {
      delete this.inventory[itemId];
    }
    return true;
  }

  public equipItem(item: Item): boolean {
    if (!item.isEquippable()) {
      return false;
    }

    const slot = item.getSlot();
    if (!slot) return false;

    // Unequip current item if any
    const currentEquipped = this.equipment[slot];
    if (currentEquipped) {
      this.addInventoryItem(currentEquipped);
    }

    // Equip new item
    this.equipment[slot] = item;

    // Remove from inventory
    this.removeInventoryItem(item.getId(), 1);
    return true;
  }

  public unequipItem(slot: 'weapon' | 'armor'): boolean {
    const item = this.equipment[slot];
    if (!item) {
      return false;
    }

    // Add to inventory
    this.addInventoryItem(item);

    // Remove from equipment
    this.equipment[slot] = undefined;
    return true;
  }

  public startCombat(enemy: Enemy): void {
    this.combat.currentEnemy = enemy;
    this.combat.isFighting = true;
  }

  public stopCombat(): void {
    this.combat.isFighting = false;
  }
} 