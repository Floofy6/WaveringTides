"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(id) {
        this.id = id;
        this.gold = 0;
        this.lastUpdate = Date.now();
        this.skills = {};
        this.inventory = {};
        this.equipment = {};
        this.combat = {
            isFighting: false
        };
    }
    getId() {
        return this.id;
    }
    getGold() {
        return this.gold;
    }
    getLastUpdate() {
        return this.lastUpdate;
    }
    getSkills() {
        return this.skills;
    }
    getInventory() {
        return this.inventory;
    }
    getEquipment() {
        return this.equipment;
    }
    getCombatState() {
        return this.combat;
    }
    setGold(gold) {
        this.gold = gold;
    }
    setLastUpdate(lastUpdate) {
        this.lastUpdate = lastUpdate;
    }
    setCombatState(isFighting) {
        this.combat.isFighting = isFighting;
    }
    setCurrentEnemy(enemy) {
        this.combat.currentEnemy = enemy;
    }
    addGold(amount) {
        if (amount < 0) {
            throw new Error('Cannot add negative gold amount');
        }
        this.gold += amount;
    }
    removeGold(amount) {
        if (amount < 0) {
            throw new Error('Cannot remove negative gold amount');
        }
        if (this.gold < amount) {
            return false;
        }
        this.gold -= amount;
        return true;
    }
    addSkill(skill) {
        this.skills[skill.getId()] = skill;
    }
    getSkill(skillId) {
        return this.skills[skillId];
    }
    addInventoryItem(item) {
        const existingItem = this.inventory[item.getId()];
        if (existingItem) {
            existingItem.increaseQuantity(item.getQuantity());
        }
        else {
            this.inventory[item.getId()] = item;
        }
    }
    removeInventoryItem(itemId, quantity) {
        const item = this.inventory[itemId];
        if (!item || item.getQuantity() < quantity) {
            return false;
        }
        item.decreaseQuantity(quantity);
        if (item.getQuantity() <= 0) {
            delete this.inventory[itemId];
        }
        return true;
    }
    equipItem(item) {
        if (!item.isEquippable()) {
            return false;
        }
        const slot = item.getSlot();
        if (!slot)
            return false;
        // Unequip current item if any
        const currentEquipped = this.equipment[slot];
        if (currentEquipped) {
            this.addInventoryItem(currentEquipped);
        }
        // Equip new item
        this.equipment[slot] = item;
        // Remove from inventory
        this.removeInventoryItem(item.getId(), 1);
        return true;
    }
    unequipItem(slot) {
        const item = this.equipment[slot];
        if (!item) {
            return false;
        }
        // Add to inventory
        this.addInventoryItem(item);
        // Remove from equipment
        this.equipment[slot] = undefined;
        return true;
    }
    startCombat(enemy) {
        this.combat.currentEnemy = enemy;
        this.combat.isFighting = true;
    }
    stopCombat() {
        this.combat.isFighting = false;
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map