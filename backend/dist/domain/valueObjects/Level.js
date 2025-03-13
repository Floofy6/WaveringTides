"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelVO = void 0;
class LevelVO {
    constructor(level) {
        if (level < LevelVO.MIN_LEVEL || level > LevelVO.MAX_LEVEL) {
            throw new Error(`Level must be between ${LevelVO.MIN_LEVEL} and ${LevelVO.MAX_LEVEL}`);
        }
        this.value = level;
    }
    getValue() {
        return this.value;
    }
    /**
     * Calculates the XP required to reach the next level
     */
    getXpForNextLevel() {
        return Math.floor(100 * (this.value ** 1.5));
    }
    /**
     * Creates a new LevelVO with incremented level
     */
    increment() {
        if (this.value >= LevelVO.MAX_LEVEL) {
            return this; // Cannot go above max level
        }
        return new LevelVO(this.value + 1);
    }
    /**
     * Checks if this level can be increased (is not at max)
     */
    canLevelUp() {
        return this.value < LevelVO.MAX_LEVEL;
    }
}
exports.LevelVO = LevelVO;
// Constants
LevelVO.MIN_LEVEL = 1;
LevelVO.MAX_LEVEL = 99;
//# sourceMappingURL=Level.js.map