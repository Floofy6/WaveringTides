"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ItemSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    type: { type: String, required: true, enum: ['resource', 'equipment'] },
    sellPrice: { type: Number },
    buyPrice: { type: Number },
    stats: {
        attackBonus: { type: Number },
        strengthBonus: { type: Number },
        defenseBonus: { type: Number }
    },
    slot: { type: String, enum: ['weapon', 'armor'] },
    craftingRecipe: {
        itemId: { type: String },
        requirements: { type: Map, of: Number },
        skillId: { type: String },
        level: { type: Number }
    }
});
exports.ItemModel = mongoose_1.default.model('Item', ItemSchema);
//# sourceMappingURL=ItemSchema.js.map