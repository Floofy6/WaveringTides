"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MasterySchema = new mongoose_1.default.Schema({
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    unlocks: { type: Map, of: String }
});
const SkillSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    xpPerAction: { type: Number, required: true },
    isActive: { type: Boolean, default: false },
    mastery: { type: MasterySchema }
});
const StatSchema = new mongoose_1.default.Schema({
    attackBonus: { type: Number },
    strengthBonus: { type: Number },
    defenseBonus: { type: Number }
});
const CraftingRecipeSchema = new mongoose_1.default.Schema({
    itemId: { type: String },
    requirements: { type: Map, of: Number },
    skillId: { type: String },
    level: { type: Number }
});
const ItemSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    type: { type: String, required: true, enum: ['resource', 'equipment'] },
    sellPrice: { type: Number },
    buyPrice: { type: Number },
    stats: { type: StatSchema },
    slot: { type: String, enum: ['weapon', 'armor'] },
    craftingRecipe: { type: CraftingRecipeSchema }
});
const LootTableEntrySchema = new mongoose_1.default.Schema({
    itemId: { type: String, required: true },
    quantity: { type: Number, required: true },
    chance: { type: Number, required: true }
});
const EnemySchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    attack: { type: Number, required: true },
    defense: { type: Number, required: true },
    health: { type: Number, required: true },
    maxHealth: { type: Number, required: true },
    lootTable: [{ type: LootTableEntrySchema }]
});
const CombatSchema = new mongoose_1.default.Schema({
    currentEnemy: { type: EnemySchema },
    isFighting: { type: Boolean, default: false }
});
const EquipmentSchema = new mongoose_1.default.Schema({
    weapon: { type: ItemSchema },
    armor: { type: ItemSchema }
});
const PlayerSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true, unique: true },
    gold: { type: Number, default: 0 },
    lastUpdate: { type: Number, default: Date.now },
    skills: { type: Map, of: SkillSchema },
    inventory: { type: Map, of: ItemSchema },
    equipment: { type: EquipmentSchema },
    combat: { type: CombatSchema }
});
exports.PlayerModel = mongoose_1.default.model('Player', PlayerSchema);
//# sourceMappingURL=PlayerSchema.js.map