import { Enemy as EnemyInterface, LootTableEntry } from '../../../shared/types';

export class Enemy implements EnemyInterface {
  id: string;
  name: string;
  attack: number;
  defense: number;
  health: number;
  maxHealth: number;
  lootTable: LootTableEntry[];

  constructor(
    id: string,
    name: string,
    attack: number,
    defense: number,
    health: number,
    lootTable: LootTableEntry[]
  ) {
    this.id = id;
    this.name = name;
    this.attack = attack;
    this.defense = defense;
    this.health = health;
    this.maxHealth = health;
    this.lootTable = lootTable;
  }

  takeDamage(damage: number) {
    this.health = Math.max(0, this.health - damage);
  }

  heal(amount: number) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  reset() {
    this.health = this.maxHealth;
  }

  isDead(): boolean {
    return this.health <= 0;
  }
}