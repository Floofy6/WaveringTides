import { Item } from '../../../shared/types';
export declare class Inventory {
    private items;
    constructor();
    addItem(item: Item): void;
    removeItem(itemId: string, quantity: number): void;
    hasItem(itemId: string, quantity?: number): boolean;
    getItemQuantity(itemId: string): number;
    getItems(): {
        [itemId: string]: Item;
    };
}
