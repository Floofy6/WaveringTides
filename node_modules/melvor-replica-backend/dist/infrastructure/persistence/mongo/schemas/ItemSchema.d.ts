import mongoose from 'mongoose';
export declare const ItemModel: mongoose.Model<{
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
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
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
}>>;
