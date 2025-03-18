import { Item } from '../../../shared/types';
export declare class Equipment {
    private weapon?;
    private armor?;
    constructor();
    equip(item: Item): void;
    unequip(slot: 'weapon' | 'armor'): Item | undefined;
    getEquipment(): {
        weapon: Item | undefined;
        armor: Item | undefined;
    };
}
