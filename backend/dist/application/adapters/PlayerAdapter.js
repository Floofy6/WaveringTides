"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerAdapter = void 0;
const Player_1 = require("../../domain/entities/Player");
const Player_2 = require("../../domain/aggregates/player/Player");
const Item_1 = require("../../domain/entities/Item");
const Enemy_1 = require("../../domain/entities/Enemy");
const Skill_1 = require("../../domain/entities/Skill");
const Skill_2 = require("../../domain/aggregates/player/Skill");
/**
 * Adapter class to convert between different Player implementations
 * This helps resolve the type conflicts between domain entities and aggregates
 */
class PlayerAdapter {
    /**
     * Convert an Entity Player to an Aggregate Player
     */
    static toAggregate(entityPlayer) {
        const aggregatePlayer = new Player_2.Player(entityPlayer.getId());
        // Copy basic properties
        aggregatePlayer.gold = entityPlayer.getGold();
        aggregatePlayer.lastUpdate = entityPlayer.getLastUpdate();
        // Copy skills
        const skills = entityPlayer.getSkills();
        for (const skillId in skills) {
            if (Object.prototype.hasOwnProperty.call(skills, skillId)) {
                const skill = skills[skillId];
                // Create a skill instance instead of a plain object
                const aggregateSkill = new Skill_2.Skill(skillId, skill.getName(), skill.getXpPerAction());
                // Set additional properties
                aggregateSkill.level = skill.getLevel();
                aggregateSkill.xp = skill.getXp();
                aggregateSkill.isActive = skill.getIsActive();
                aggregatePlayer.skills[skillId] = aggregateSkill;
            }
        }
        // Copy inventory
        const inventory = entityPlayer.getInventory();
        for (const itemId in inventory) {
            if (Object.prototype.hasOwnProperty.call(inventory, itemId)) {
                const item = inventory[itemId];
                const itemData = {
                    id: item.getId(),
                    name: item.getName(),
                    quantity: item.getQuantity(),
                    type: item.getType(),
                    sellPrice: item.getSellPrice(),
                    buyPrice: item.getBuyPrice(),
                    stats: item.getStats(),
                    slot: item.getSlot(),
                    craftingRecipe: item.getCraftingRecipe()
                };
                aggregatePlayer.addItem(itemData);
            }
        }
        // Copy equipment
        const equipment = entityPlayer.getEquipment();
        if (equipment.weapon) {
            // Convert EntityItem to ItemType
            const weaponData = {
                id: equipment.weapon.getId(),
                name: equipment.weapon.getName(),
                quantity: equipment.weapon.getQuantity(),
                type: equipment.weapon.getType(),
                sellPrice: equipment.weapon.getSellPrice(),
                buyPrice: equipment.weapon.getBuyPrice(),
                stats: equipment.weapon.getStats(),
                slot: equipment.weapon.getSlot(),
                craftingRecipe: equipment.weapon.getCraftingRecipe()
            };
            aggregatePlayer.equipItem(weaponData);
        }
        if (equipment.armor) {
            // Convert EntityItem to ItemType
            const armorData = {
                id: equipment.armor.getId(),
                name: equipment.armor.getName(),
                quantity: equipment.armor.getQuantity(),
                type: equipment.armor.getType(),
                sellPrice: equipment.armor.getSellPrice(),
                buyPrice: equipment.armor.getBuyPrice(),
                stats: equipment.armor.getStats(),
                slot: equipment.armor.getSlot(),
                craftingRecipe: equipment.armor.getCraftingRecipe()
            };
            aggregatePlayer.equipItem(armorData);
        }
        // Copy combat state
        const combatState = entityPlayer.getCombatState();
        if (combatState.isFighting && combatState.currentEnemy) {
            // Convert EntityEnemy to EnemyType
            const enemyData = {
                id: combatState.currentEnemy.getId(),
                name: combatState.currentEnemy.getName(),
                health: combatState.currentEnemy.getHealth(),
                attack: combatState.currentEnemy.getAttack(),
                defense: combatState.currentEnemy.getDefense(),
                maxHealth: combatState.currentEnemy.getMaxHealth(),
                lootTable: combatState.currentEnemy.getLootTable()
            };
            aggregatePlayer.startFighting(enemyData);
        }
        return aggregatePlayer;
    }
    /**
     * Convert an Aggregate Player to an Entity Player
     */
    static toEntity(aggregatePlayer) {
        const entityPlayer = new Player_1.Player(aggregatePlayer.id);
        // Copy basic properties
        entityPlayer.setGold(aggregatePlayer.gold);
        entityPlayer.setLastUpdate(aggregatePlayer.lastUpdate);
        // Copy skills
        for (const skillId in aggregatePlayer.skills) {
            if (Object.prototype.hasOwnProperty.call(aggregatePlayer.skills, skillId)) {
                const skill = aggregatePlayer.skills[skillId];
                // Create an EntitySkill instead of a plain object
                const skillEntity = new Skill_1.Skill(skillId, skill.name, skill.xpPerAction);
                skillEntity.setLevel(skill.level);
                skillEntity.setXp(skill.xp);
                skillEntity.setIsActive(skill.isActive);
                entityPlayer.addSkill(skillEntity);
            }
        }
        // Copy inventory
        for (const itemId in aggregatePlayer.inventory) {
            if (Object.prototype.hasOwnProperty.call(aggregatePlayer.inventory, itemId)) {
                const item = aggregatePlayer.inventory[itemId];
                // Create an Item entity instead of passing the interface object
                const itemEntity = new Item_1.Item(item.id, item.name, item.type, item.quantity, item.sellPrice, item.buyPrice, item.stats, item.slot);
                // Set craftingRecipe if it exists
                if (item.craftingRecipe) {
                    itemEntity.setCraftingRecipe(item.craftingRecipe);
                }
                entityPlayer.addInventoryItem(itemEntity);
            }
        }
        // Copy equipment
        if (aggregatePlayer.equipment.weapon) {
            const weapon = aggregatePlayer.equipment.weapon;
            // Create an Item entity for the weapon
            const weaponEntity = new Item_1.Item(weapon.id, weapon.name, weapon.type, weapon.quantity, weapon.sellPrice, weapon.buyPrice, weapon.stats, weapon.slot);
            // Set craftingRecipe if it exists
            if (weapon.craftingRecipe) {
                weaponEntity.setCraftingRecipe(weapon.craftingRecipe);
            }
            entityPlayer.equipItem(weaponEntity);
        }
        if (aggregatePlayer.equipment.armor) {
            const armor = aggregatePlayer.equipment.armor;
            // Create an Item entity for the armor
            const armorEntity = new Item_1.Item(armor.id, armor.name, armor.type, armor.quantity, armor.sellPrice, armor.buyPrice, armor.stats, armor.slot);
            // Set craftingRecipe if it exists
            if (armor.craftingRecipe) {
                armorEntity.setCraftingRecipe(armor.craftingRecipe);
            }
            entityPlayer.equipItem(armorEntity);
        }
        // Copy combat state
        if (aggregatePlayer.combat.isFighting) {
            entityPlayer.setCombatState(true);
            if (aggregatePlayer.combat.currentEnemy) {
                const enemy = aggregatePlayer.combat.currentEnemy;
                try {
                    // Using the correct constructor signature for EntityEnemy
                    // The constructor likely expects: id, name, health, attack, defense, lootTable
                    const enemyEntity = new Enemy_1.Enemy(enemy.id, enemy.name, enemy.health, enemy.attack, enemy.defense, enemy.lootTable || []);
                    entityPlayer.setCurrentEnemy(enemyEntity);
                }
                catch (error) {
                    console.error('Error creating enemy entity:', error);
                    // If we can't create the enemy, at least set the combat state
                    entityPlayer.setCombatState(true);
                }
            }
        }
        return entityPlayer;
    }
}
exports.PlayerAdapter = PlayerAdapter;
//# sourceMappingURL=PlayerAdapter.js.map