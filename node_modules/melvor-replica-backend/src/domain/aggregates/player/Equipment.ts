import { Item } from '../../../shared/types';

export class Equipment {
  private weapon?: Item;
  private armor?: Item;

  constructor() {
    // Initialize with no equipment
  }

  equip(item: Item) {
    if (item.type === 'equipment') {
      switch (item.slot) {
        case 'weapon':
          this.weapon = { ...item, quantity: 1 };
          break;
        case 'armor':
          this.armor = { ...item, quantity: 1 };
          break;
        default:
          throw new Error("Invalid equipment slot");
      }
    } else {
      throw new Error("Item is not equippable");
    }
  }

  unequip(slot: 'weapon' | 'armor'): Item | undefined {
    let unequippedItem: Item | undefined;
    
    if (slot === 'weapon' && this.weapon) {
      unequippedItem = { ...this.weapon };
      this.weapon = undefined;
    } else if (slot === 'armor' && this.armor) {
      unequippedItem = { ...this.armor };
      this.armor = undefined;
    }
    
    return unequippedItem;
  }

  getEquipment() {
    return {
      weapon: this.weapon,
      armor: this.armor
    };
  }
}