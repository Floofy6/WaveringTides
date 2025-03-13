"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemyModel = exports.PlayerModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Schema for Skill
const SkillSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    level: { type: Number, required: true, default: 1 },
    xp: { type: Number, required: true, default: 0 },
    xpPerAction: { type: Number, required: true },
    isActive: { type: Boolean, required: true, default: false }
});
// Schema for Item stats
const ItemStatsSchema = new mongoose_1.default.Schema({
    attackBonus: { type: Number },
    strengthBonus: { type: Number },
    defenseBonus: { type: Number }
});
// Schema for Item
const ItemSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    type: { type: String, required: true, enum: ['resource', 'equipment'] },
    sellPrice: { type: Number },
    buyPrice: { type: Number },
    stats: { type: ItemStatsSchema },
    slot: { type: String, enum: ['weapon', 'armor'] },
    craftingRecipe: {
        type: {
            itemId: { type: String, required: true },
            requirements: { type: Map, of: Number },
            skillId: { type: String, required: true },
            level: { type: Number, required: true }
        }
    }
});
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
// Schema for Combat
const CombatSchema = new mongoose_1.default.Schema({
    isFighting: { type: Boolean, required: true, default: false },
    currentEnemy: { type: EnemySchema }
});
// Schema for Equipment
const EquipmentSchema = new mongoose_1.default.Schema({
    weapon: { type: ItemSchema },
    armor: { type: ItemSchema }
});
// Schema for Player
const PlayerSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true, unique: true },
    gold: { type: Number, required: true, default: 0 },
    lastUpdate: { type: Number, required: true },
    skills: { type: Map, of: SkillSchema },
    inventory: { type: Map, of: ItemSchema },
    equipment: { type: EquipmentSchema, required: true },
    combat: { type: CombatSchema, required: true }
});
// Create the models
exports.PlayerModel = mongoose_1.default.model('Player', PlayerSchema);
exports.EnemyModel = mongoose_1.default.model('Enemy', EnemySchema);
//# sourceMappingURL=schemas.js.map