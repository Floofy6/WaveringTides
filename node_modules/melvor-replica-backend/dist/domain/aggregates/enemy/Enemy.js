"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enemy = void 0;
class Enemy {
    constructor(id, name, attack, defense, health, lootTable) {
        this.id = id;
        this.name = name;
        this.attack = attack;
        this.defense = defense;
        this.health = health;
        this.maxHealth = health;
        this.lootTable = lootTable;
    }
    takeDamage(damage) {
        this.health = Math.max(0, this.health - damage);
    }
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    reset() {
        this.health = this.maxHealth;
    }
    isDead() {
        return this.health <= 0;
    }
}
exports.Enemy = Enemy;
//# sourceMappingURL=Enemy.js.map