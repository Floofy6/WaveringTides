import { Enemy as EnemyInterface, LootTableEntry } from '../../../shared/types';
export declare class Enemy implements EnemyInterface {
    id: string;
    name: string;
    attack: number;
    defense: number;
    health: number;
    maxHealth: number;
    lootTable: LootTableEntry[];
    constructor(id: string, name: string, attack: number, defense: number, health: number, lootTable: LootTableEntry[]);
    takeDamage(damage: number): void;
    heal(amount: number): void;
    reset(): void;
    isDead(): boolean;
}
