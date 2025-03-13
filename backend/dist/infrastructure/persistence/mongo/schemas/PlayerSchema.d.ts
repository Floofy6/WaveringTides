import mongoose from 'mongoose';
export declare const PlayerModel: mongoose.Model<{
    id: string;
    gold: number;
    lastUpdate: number;
    equipment?: {
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
                level?: number | undefined;
                itemId?: string | undefined;
                requirements?: Map<string, number> | undefined;
                skillId?: string | undefined;
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
                level?: number | undefined;
                itemId?: string | undefined;
                requirements?: Map<string, number> | undefined;
                skillId?: string | undefined;
            } | undefined;
        } | undefined;
    } | undefined;
    skills?: Map<string, {
        id: string;
        level: number;
        xp: number;
        name: string;
        xpPerAction: number;
        isActive: boolean;
        mastery?: {
            level: number;
            xp: number;
            unlocks?: Map<string, string> | undefined;
        } | undefined;
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
            level?: number | undefined;
            itemId?: string | undefined;
            requirements?: Map<string, number> | undefined;
            skillId?: string | undefined;
        } | undefined;
    }> | undefined;
    combat?: {
        isFighting: boolean;
        currentEnemy?: {
            attack: number;
            id: string;
            name: string;
            defense: number;
            health: number;
            maxHealth: number;
            lootTable: {
                type?: {
                    itemId: string;
                    quantity: number;
                    chance: number;
                } | undefined;
            }[];
        } | undefined;
    } | undefined;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    id: string;
    gold: number;
    lastUpdate: number;
    equipment?: {
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
                level?: number | undefined;
                itemId?: string | undefined;
                requirements?: Map<string, number> | undefined;
                skillId?: string | undefined;
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
                level?: number | undefined;
                itemId?: string | undefined;
                requirements?: Map<string, number> | undefined;
                skillId?: string | undefined;
            } | undefined;
        } | undefined;
    } | undefined;
    skills?: Map<string, {
        id: string;
        level: number;
        xp: number;
        name: string;
        xpPerAction: number;
        isActive: boolean;
        mastery?: {
            level: number;
            xp: number;
            unlocks?: Map<string, string> | undefined;
        } | undefined;
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
            level?: number | undefined;
            itemId?: string | undefined;
            requirements?: Map<string, number> | undefined;
            skillId?: string | undefined;
        } | undefined;
    }> | undefined;
    combat?: {
        isFighting: boolean;
        currentEnemy?: {
            attack: number;
            id: string;
            name: string;
            defense: number;
            health: number;
            maxHealth: number;
            lootTable: {
                type?: {
                    itemId: string;
                    quantity: number;
                    chance: number;
                } | undefined;
            }[];
        } | undefined;
    } | undefined;
}>>;
