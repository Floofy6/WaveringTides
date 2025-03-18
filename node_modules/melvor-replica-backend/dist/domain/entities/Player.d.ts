import { Skill } from './Skill';
import { Item } from './Item';
import { Enemy } from './Enemy';
export declare class Player {
    private id;
    private gold;
    private lastUpdate;
    private skills;
    private inventory;
    private equipment;
    private combat;
    constructor(id: string);
    getId(): string;
    getGold(): number;
    getLastUpdate(): number;
    getSkills(): {
        [skillId: string]: Skill;
    };
    getInventory(): {
        [itemId: string]: Item;
    };
    getEquipment(): {
        weapon?: Item;
        armor?: Item;
    };
    getCombatState(): {
        currentEnemy?: Enemy;
        isFighting: boolean;
    };
    setGold(gold: number): void;
    setLastUpdate(lastUpdate: number): void;
    setCombatState(isFighting: boolean): void;
    setCurrentEnemy(enemy: Enemy): void;
    addGold(amount: number): void;
    removeGold(amount: number): boolean;
    addSkill(skill: Skill): void;
    getSkill(skillId: string): Skill | undefined;
    addInventoryItem(item: Item): void;
    removeInventoryItem(itemId: string, quantity: number): boolean;
    equipItem(item: Item): boolean;
    unequipItem(slot: 'weapon' | 'armor'): boolean;
    startCombat(enemy: Enemy): void;
    stopCombat(): void;
}
