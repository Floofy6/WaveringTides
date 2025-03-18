"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enemy = void 0;
class Enemy {
    constructor(id, name, attack, defense, health, lootTable = []) {
        this.id = id;
        this.name = name;
        this.attack = attack;
        this.defense = defense;
        this.health = health;
        this.maxHealth = health;
        this.lootTable = lootTable;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getAttack() {
        return this.attack;
    }
    getDefense() {
        return this.defense;
    }
    getHealth() {
        return this.health;
    }
    getMaxHealth() {
        return this.maxHealth;
    }
    getLootTable() {
        return this.lootTable;
    }
    setHealth(health) {
        this.health = Math.max(0, Math.min(health, this.maxHealth));
    }
    takeDamage(damage) {
        this.health = Math.max(0, this.health - damage);
    }
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    isDefeated() {
        return this.health <= 0;
    }
    reset() {
        this.health = this.maxHealth;
    }
    generateLoot() {
        return this.lootTable.filter(entry => Math.random() < entry.chance);
    }
}
exports.Enemy = Enemy;
//# sourceMappingURL=Enemy.js.map