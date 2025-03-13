export interface LootTableEntry {
  itemId: string;
  quantity: number;
  chance: number;
}

export class Enemy {
  private id: string;
  private name: string;
  private attack: number;
  private defense: number;
  private health: number;
  private maxHealth: number;
  private lootTable: LootTableEntry[];

  constructor(
    id: string,
    name: string,
    attack: number,
    defense: number,
    health: number,
    lootTable: LootTableEntry[] = []
  ) {
    this.id = id;
    this.name = name;
    this.attack = attack;
    this.defense = defense;
    this.health = health;
    this.maxHealth = health;
    this.lootTable = lootTable;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getAttack(): number {
    return this.attack;
  }

  public getDefense(): number {
    return this.defense;
  }

  public getHealth(): number {
    return this.health;
  }

  public getMaxHealth(): number {
    return this.maxHealth;
  }

  public getLootTable(): LootTableEntry[] {
    return this.lootTable;
  }

  public setHealth(health: number): void {
    this.health = Math.max(0, Math.min(health, this.maxHealth));
  }

  public takeDamage(damage: number): void {
    this.health = Math.max(0, this.health - damage);
  }

  public heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  public isDefeated(): boolean {
    return this.health <= 0;
  }

  public reset(): void {
    this.health = this.maxHealth;
  }

  public generateLoot(): LootTableEntry[] {
    return this.lootTable.filter(entry => Math.random() < entry.chance);
  }
} 