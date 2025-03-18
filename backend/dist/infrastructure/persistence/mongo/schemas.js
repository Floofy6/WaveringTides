"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerModel = exports.EnemyModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PlayerSchema_1 = require("./schemas/PlayerSchema");
Object.defineProperty(exports, "PlayerModel", { enumerable: true, get: function () { return PlayerSchema_1.PlayerModel; } });
// Schema for LootTableEntry
const LootTableEntrySchema = new mongoose_1.default.Schema({
    itemId: { type: String, required: true },
    quantity: { type: Number, required: true },
    chance: { type: Number, required: true }
});
// Schema for Enemy
const EnemySchema = new mongoose_1.default.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    attack: { type: Number, required: true },
    defense: { type: Number, required: true },
    health: { type: Number, required: true },
    maxHealth: { type: Number, required: true },
    lootTable: [LootTableEntrySchema]
});
// Create the Enemy model
exports.EnemyModel = mongoose_1.default.model('Enemy', EnemySchema);
//# sourceMappingURL=schemas.js.map