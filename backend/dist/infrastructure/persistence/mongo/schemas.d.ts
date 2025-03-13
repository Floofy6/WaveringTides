import mongoose from 'mongoose';
export declare const PlayerModel: mongoose.Model<{
    equipment: {
        weapon?: {
            id: string;
            type: "resource" | "equipment";
            name: string;
            quantity: number;
            slot?: "weapon" | "armor" | undefined;
            buyPrice?: number | undefined;
            sellPrice?: number | undefined;
            stats?: {
                defenseBonus?: number | undefined;
                attackBonus?: number | undefined;
                strengthBonus?: number | undefined;
            } | undefined;
            craftingRecipe?: {
                level: number;
                itemId: string;
                skillId: string;
                requirements?: Map<string, number> | undefined;
            } | undefined;
        } | undefined;
        armor?: {
            id: string;
            type: "resource" | "equipment";
            name: string;
            quantity: number;
            slot?: "weapon" | "armor" | undefined;
            buyPrice?: number | undefined;
            sellPrice?: number | undefined;
            stats?: {
                defenseBonus?: number | undefined;
                attackBonus?: number | undefined;
                strengthBonus?: number | undefined;
            } | undefined;
            craftingRecipe?: {
                level: number;
                itemId: string;
                skillId: string;
                requirements?: Map<string, number> | undefined;
            } | undefined;
        } | undefined;
    };
    id: string;
    gold: number;
    lastUpdate: number;
    combat: {
        isFighting: boolean;
        currentEnemy?: {
            attack: number;
            id: string;
            name: string;
            defense: number;
            health: number;
            maxHealth: number;
            lootTable: mongoose.Types.DocumentArray<{
                itemId: string;
                quantity: number;
                chance: number;
            }>;
        } | undefined;
    };
    skills?: Map<string, {
        id: string;
        level: number;
        xp: number;
        name: string;
        xpPerAction: number;
        isActive: boolean;
    }> | undefined;
    inventory?: Map<string, {
        id: string;
        type: "resource" | "equipment";
        name: string;
        quantity: number;
        slot?: "weapon" | "armor" | undefined;
        buyPrice?: number | undefined;
        sellPrice?: number | undefined;
        stats?: {
            defenseBonus?: number | undefined;
            attackBonus?: number | undefined;
            strengthBonus?: number | undefined;
        } | undefined;
        craftingRecipe?: {
            level: number;
            itemId: string;
            skillId: string;
            requirements?: Map<string, number> | undefined;
        } | undefined;
    }> | undefined;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    equipment: {
        weapon?: {
            id: string;
            type: "resource" | "equipment";
            name: string;
            quantity: number;
            slot?: "weapon" | "armor" | undefined;
            buyPrice?: number | undefined;
            sellPrice?: number | undefined;
            stats?: {
                defenseBonus?: number | undefined;
                attackBonus?: number | undefined;
                strengthBonus?: number | undefined;
            } | undefined;
            craftingRecipe?: {
                level: number;
                itemId: string;
                skillId: string;
                requirements?: Map<string, number> | undefined;
            } | undefined;
        } | undefined;
        armor?: {
            id: string;
            type: "resource" | "equipment";
            name: string;
            quantity: number;
            slot?: "weapon" | "armor" | undefined;
            buyPrice?: number | undefined;
            sellPrice?: number | undefined;
            stats?: {
                defenseBonus?: number | undefined;
                attackBonus?: number | undefined;
                strengthBonus?: number | undefined;
            } | undefined;
            craftingRecipe?: {
                level: number;
                itemId: string;
                skillId: string;
                requirements?: Map<string, number> | undefined;
            } | undefined;
        } | undefined;
    };
    id: string;
    gold: number;
    lastUpdate: number;
    combat: {
        isFighting: boolean;
        currentEnemy?: {
            attack: number;
            id: string;
            name: string;
            defense: number;
            health: number;
            maxHealth: number;
            lootTable: mongoose.Types.DocumentArray<{
                itemId: string;
                quantity: number;
                chance: number;
            }>;
        } | undefined;
    };
    skills?: Map<string, {
        id: string;
        level: number;
        xp: number;
        name: string;
        xpPerAction: number;
        isActive: boolean;
    }> | undefined;
    inventory?: Map<string, {
        id: string;
        type: "resource" | "equipment";
        name: string;
        quantity: number;
        slot?: "weapon" | "armor" | undefined;
        buyPrice?: number | undefined;
        sellPrice?: number | undefined;
        stats?: {
            defenseBonus?: number | undefined;
            attackBonus?: number | undefined;
            strengthBonus?: number | undefined;
        } | undefined;
        craftingRecipe?: {
            level: number;
            itemId: string;
            skillId: string;
            requirements?: Map<string, number> | undefined;
        } | undefined;
    }> | undefined;
}>>;
export declare const EnemyModel: mongoose.Model<{
    attack: number;
    id: string;
    name: string;
    defense: number;
    health: number;
    maxHealth: number;
    lootTable: mongoose.Types.DocumentArray<{
        itemId: string;
        quantity: number;
        chance: number;
    }>;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    attack: number;
    id: string;
    name: string;
    defense: number;
    health: number;
    maxHealth: number;
    lootTable: mongoose.Types.DocumentArray<{
        itemId: string;
        quantity: number;
        chance: number;
    }>;
}>>;
