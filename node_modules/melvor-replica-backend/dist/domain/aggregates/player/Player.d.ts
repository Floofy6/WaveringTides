import { Player as PlayerInterface, GoldAmount, Skill, Item, Enemy } from '../../../shared/types';
import { Skill as SkillEntity } from './Skill';
export declare class Player implements PlayerInterface {
    id: string;
    gold: GoldAmount;
    lastUpdate: number;
    skills: {
        [skillId: string]: Skill;
    };
    inventory: {
        [itemId: string]: Item;
    };
    equipment: {
        weapon?: Item;
        armor?: Item;
    };
    combat: {
        currentEnemy?: Enemy;
        isFighting: boolean;
    };
    private inventoryEntity;
    private equipmentEntity;
    constructor(id: string);
    addGold(amount: GoldAmount): void;
    removeGold(amount: GoldAmount): void;
    addSkill(skill: SkillEntity): void;
    getSkillLevel(skillId: string): number;
    addXpToSkill(skillId: string, xp: number): void;
    getXpRequiredForLevel(level: number): number;
    addItem(item: Item): void;
    removeItem(itemId: string, quantity: number): void;
    hasItem(itemId: string, quantity?: number): boolean;
    getItemQuantity(itemId: string): number;
    equipItem(item: Item): void;
    unequipItem(slot: 'weapon' | 'armor'): void;
    startFighting(enemy: Enemy): void;
    stopFighting(): void;
    getTotalAttack(): number;
    getTotalStrength(): number;
    getTotalDefense(): number;
}
