export interface LootTableEntry {
    itemId: string;
    quantity: number;
    chance: number;
}
export declare class Enemy {
    private id;
    private name;
    private attack;
    private defense;
    private health;
    private maxHealth;
    private lootTable;
    constructor(id: string, name: string, attack: number, defense: number, health: number, lootTable?: LootTableEntry[]);
    getId(): string;
    getName(): string;
    getAttack(): number;
    getDefense(): number;
    getHealth(): number;
    getMaxHealth(): number;
    getLootTable(): LootTableEntry[];
    setHealth(health: number): void;
    takeDamage(damage: number): void;
    heal(amount: number): void;
    isDefeated(): boolean;
    reset(): void;
    generateLoot(): LootTableEntry[];
}
