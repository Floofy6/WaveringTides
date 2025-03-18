import mongoose from 'mongoose';
import { PlayerModel } from './schemas/PlayerSchema';
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
export { PlayerModel };
