export declare const ITEM_IDS: {
    LOGS: string;
    RAW_FISH: string;
    ORE: string;
    BRONZE_BAR: string;
    BRONZE_SWORD: string;
    COOKED_FISH: string;
    LEATHER_ARMOR: string;
};
export declare const SKILL_IDS: {
    WOODCUTTING: string;
    FISHING: string;
    MINING: string;
    FIREMAKING: string;
    COOKING: string;
    SMITHING: string;
    ATTACK: string;
    STRENGTH: string;
    DEFENCE: string;
    HITPOINTS: string;
};
export declare const ENEMY_IDS: {
    GOBLIN: string;
    RAT: string;
    BANDIT: string;
};
export declare const ITEMS: {
    [x: string]: {
        id: string;
        name: string;
        type: string;
        sellPrice: number;
        quantity: number;
        buyPrice?: undefined;
        slot?: undefined;
        stats?: undefined;
    } | {
        id: string;
        name: string;
        type: string;
        sellPrice: number;
        buyPrice: number;
        quantity: number;
        slot?: undefined;
        stats?: undefined;
    } | {
        id: string;
        name: string;
        type: string;
        slot: string;
        sellPrice: number;
        buyPrice: number;
        stats: {
            attackBonus: number;
            strengthBonus: number;
            defenseBonus?: undefined;
        };
        quantity: number;
    } | {
        id: string;
        name: string;
        type: string;
        slot: string;
        sellPrice: number;
        buyPrice: number;
        stats: {
            defenseBonus: number;
            attackBonus?: undefined;
            strengthBonus?: undefined;
        };
        quantity: number;
    };
};
export declare const ENEMIES: {
    [x: string]: {
        id: string;
        name: string;
        attack: number;
        defense: number;
        health: number;
        maxHealth: number;
        lootTable: {
            itemId: string;
            quantity: number;
            chance: number;
        }[];
    };
};
