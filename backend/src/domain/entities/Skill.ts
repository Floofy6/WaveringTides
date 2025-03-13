export interface Mastery {
  level: number;
  xp: number;
  unlocks: { [level: string]: string };
}

export class Skill {
  private id: string;
  private name: string;
  private level: number;
  private xp: number;
  private xpPerAction: number;
  private isActive: boolean;
  private mastery?: Mastery;

  constructor(id: string, name: string, xpPerAction: number) {
    this.id = id;
    this.name = name;
    this.level = 1;
    this.xp = 0;
    this.xpPerAction = xpPerAction;
    this.isActive = false;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getLevel(): number {
    return this.level;
  }

  public getXp(): number {
    return this.xp;
  }

  public getXpPerAction(): number {
    return this.xpPerAction;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getMastery(): Mastery | undefined {
    return this.mastery;
  }

  public setLevel(level: number): void {
    this.level = level;
  }

  public setXp(xp: number): void {
    this.xp = xp;
    this.levelUp();
  }

  public setXpPerAction(xpPerAction: number): void {
    this.xpPerAction = xpPerAction;
  }

  public setIsActive(isActive: boolean): void {
    this.isActive = isActive;
  }

  public setMastery(mastery: Mastery): void {
    this.mastery = mastery;
  }

  public addXp(xp: number): void {
    this.xp += xp;
    this.levelUp();

    // Also add mastery XP if mastery exists
    if (this.mastery) {
      this.addMasteryXp(xp * 0.1); // 10% of skill XP goes to mastery
    }
  }

  private levelUp(): void {
    let nextLevelXp = this.getXpRequiredForNextLevel();
    while (this.xp >= nextLevelXp) {
      this.level++;
      nextLevelXp = this.getXpRequiredForNextLevel();
    }
  }

  public getXpRequiredForNextLevel(): number {
    return Math.floor(100 * (Math.pow(this.level, 1.5)));
  }

  public activate(): void {
    this.isActive = true;
  }

  public deactivate(): void {
    this.isActive = false;
  }

  // Mastery-related methods
  public addMasteryXp(xp: number): void {
    if (!this.mastery) {
      this.mastery = {
        level: 1,
        xp: 0,
        unlocks: {}
      };
    }

    this.mastery.xp += xp;
    this.updateMasteryLevel();
  }

  private updateMasteryLevel(): void {
    if (!this.mastery) return;

    let nextLevelXp = this.getMasteryXpForNextLevel();
    while (this.mastery.xp >= nextLevelXp) {
      this.mastery.level++;
      nextLevelXp = this.getMasteryXpForNextLevel();
    }
  }

  private getMasteryXpForNextLevel(): number {
    if (!this.mastery) return 0;
    return Math.floor(150 * (Math.pow(this.mastery.level, 1.8)));
  }
} 