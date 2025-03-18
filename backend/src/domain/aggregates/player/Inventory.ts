import { Item } from '../../../shared/types';

export class Inventory {
  private items: { [itemId: string]: Item } = {};

  constructor() {
    this.items = {};
  }

  addItem(item: Item) {
    const itemId = item.id;
    if (this.items[itemId]) {
      this.items[itemId].quantity += item.quantity;
    } else {
      this.items[itemId] = { ...item };
    }
  }

  removeItem(itemId: string, quantity: number) {
    if (this.items[itemId] && this.items[itemId].quantity >= quantity) {
      this.items[itemId].quantity -= quantity;
      if (this.items[itemId].quantity === 0) {
        delete this.items[itemId];
      }
    } else {
      throw new Error(`Cannot remove ${quantity} of item ${itemId}`);
    }
  }

  hasItem(itemId: string, quantity = 1): boolean {
    return !!this.items[itemId] && this.items[itemId].quantity >= quantity;
  }

  getItemQuantity(itemId: string): number {
    return this.items[itemId]?.quantity || 0;
  }

  getItems(): { [itemId: string]: Item } {
    return { ...this.items };
  }
}