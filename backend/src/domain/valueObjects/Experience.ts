/**
 * Experience value object represents skill experience points in the game.
 * This provides type safety and domain meaning to what would otherwise be a primitive number.
 */
export type Experience = number;

export class ExperienceVO {
  private readonly value: Experience;

  constructor(experience: Experience) {
    if (experience < 0) {
      throw new Error('Experience cannot be negative');
    }
    this.value = experience;
  }

  getValue(): Experience {
    return this.value;
  }

  /**
   * Add experience points and return a new ExperienceVO
   */
  add(experienceToAdd: Experience): ExperienceVO {
    return new ExperienceVO(this.value + experienceToAdd);
  }

  /**
   * Check if this amount of experience is enough to reach a specific level
   * @param level The level to check against
   */
  isEnoughForLevel(level: number): boolean {
    return this.value >= this.calculateRequiredXpForLevel(level);
  }

  /**
   * Calculate what level this amount of experience corresponds to
   */
  getLevel(): number {
    let level = 1;
    while (this.isEnoughForLevel(level + 1)) {
      level++;
    }
    return level;
  }

  /**
   * Calculate the experience required to reach a specific level
   * @param level The target level
   */
  private calculateRequiredXpForLevel(level: number): number {
    if (level <= 1) return 0;
    return Math.floor(100 * ((level - 1) ** 1.5));
  }
  
  /**
   * Calculate experience progress towards the next level (0-100%)
   */
  getProgressToNextLevel(): number {
    const currentLevel = this.getLevel();
    const currentLevelXp = this.calculateRequiredXpForLevel(currentLevel);
    const nextLevelXp = this.calculateRequiredXpForLevel(currentLevel + 1);
    
    const xpDifference = nextLevelXp - currentLevelXp;
    const progressXp = this.value - currentLevelXp;
    
    return Math.min(100, Math.floor((progressXp / xpDifference) * 100));
  }
}