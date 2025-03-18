import { Skill as SkillInterface } from '../../../shared/types';

export class Skill implements SkillInterface {
  id: string;
  name: string;
  level: number;
  xp: number;
  xpPerAction: number;
  isActive: boolean;

  constructor(id: string, name: string, xpPerAction: number) {
    this.id = id;
    this.name = name;
    this.level = 1;
    this.xp = 0;
    this.xpPerAction = xpPerAction;
    this.isActive = false;
  }

  addXp(xp: number) {
    this.xp += xp;
    this.levelUp();
  }

  levelUp() {
    while (this.xp >= this.getXpRequiredForNextLevel()) {
      this.level++;
    }
  }

  getXpRequiredForNextLevel(): number {
    return Math.floor(100 * (this.level ** 1.5));
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }
}