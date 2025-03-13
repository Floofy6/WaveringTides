"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = void 0;
class Skill {
    constructor(id, name, xpPerAction) {
        this.id = id;
        this.name = name;
        this.level = 1;
        this.xp = 0;
        this.xpPerAction = xpPerAction;
        this.isActive = false;
    }
    addXp(xp) {
        this.xp += xp;
        this.levelUp();
    }
    levelUp() {
        while (this.xp >= this.getXpRequiredForNextLevel()) {
            this.level++;
        }
    }
    getXpRequiredForNextLevel() {
        return Math.floor(100 * (this.level ** 1.5));
    }
    activate() {
        this.isActive = true;
    }
    deactivate() {
        this.isActive = false;
    }
}
exports.Skill = Skill;
//# sourceMappingURL=Skill.js.map