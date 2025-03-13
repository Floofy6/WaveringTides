"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const Inventory_1 = require("./Inventory");
const Equipment_1 = require("./Equipment");
const constants_1 = require("../../../shared/constants");
class Player {
    constructor(id) {
        this.id = id;
        this.gold = 0;
        this.lastUpdate = Date.now();
        this.skills = {};
        this.inventory = {};
        this.equipment = {};
        this.combat = { isFighting: false };
        this.inventoryEntity = new Inventory_1.Inventory();
        this.equipmentEntity = new Equipment_1.Equipment();
    }
    addGold(amount) {
        this.gold += amount;
    }
    removeGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
        }
        else {
            throw new Error("Insufficient gold");
        }
    }
    addSkill(skill) {
        this.skills[skill.id] = skill;
    }
    getSkillLevel(skillId) {
        var _a;
        return ((_a = this.skills[skillId]) === null || _a === void 0 ? void 0 : _a.level) || 0;
    }
    addXpToSkill(skillId, xp) {
        if (this.skills[skillId]) {
            const skill = this.skills[skillId];
            skill.xp += xp;
            // Update level based on XP
            while (skill.xp >= this.getXpRequiredForLevel(skill.level + 1)) {
                skill.level += 1;
            }
        }
    }
    getXpRequiredForLevel(level) {
        return Math.floor(100 * (level ** 1.5));
    }
    addItem(item) {
        this.inventoryEntity.addItem(item);
        this.inventory = this.inventoryEntity.getItems();
    }
    removeItem(itemId, quantity) {
        this.inventoryEntity.removeItem(itemId, quantity);
        this.inventory = this.inventoryEntity.getItems();
    }
    hasItem(itemId, quantity = 1) {
        return this.inventoryEntity.hasItem(itemId, quantity);
    }
    getItemQuantity(itemId) {
        return this.inventoryEntity.getItemQuantity(itemId);
    }
    equipItem(item) {
        if (this.hasItem(item.id, 1)) {
            this.equipmentEntity.equip(item);
            this.equipment = this.equipmentEntity.getEquipment();
            this.removeItem(item.id, 1);
        }
        else {
            throw new Error("Item not in inventory");
        }
    }
    unequipItem(slot) {
        const unequippedItem = this.equipmentEntity.unequip(slot);
        if (unequippedItem) {
            this.addItem(unequippedItem);
        }
        this.equipment = this.equipmentEntity.getEquipment();
    }
    startFighting(enemy) {
        this.combat.currentEnemy = { ...enemy }; // Clone enemy to not modify original
        this.combat.isFighting = true;
    }
    stopFighting() {
        this.combat.isFighting = false;
        this.combat.currentEnemy = undefined;
    }
    getTotalAttack() {
        var _a, _b;
        let baseAttack = this.getSkillLevel(constants_1.SKILL_IDS.ATTACK);
        baseAttack += ((_b = (_a = this.equipment.weapon) === null || _a === void 0 ? void 0 : _a.stats) === null || _b === void 0 ? void 0 : _b.attackBonus) || 0;
        return baseAttack;
    }
    getTotalStrength() {
        var _a, _b;
        let baseStrength = this.getSkillLevel(constants_1.SKILL_IDS.STRENGTH);
        baseStrength += ((_b = (_a = this.equipment.weapon) === null || _a === void 0 ? void 0 : _a.stats) === null || _b === void 0 ? void 0 : _b.strengthBonus) || 0;
        return baseStrength;
    }
    getTotalDefense() {
        var _a, _b;
        let baseDefense = this.getSkillLevel(constants_1.SKILL_IDS.DEFENCE);
        baseDefense += ((_b = (_a = this.equipment.armor) === null || _a === void 0 ? void 0 : _a.stats) === null || _b === void 0 ? void 0 : _b.defenseBonus) || 0;
        return baseDefense;
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map