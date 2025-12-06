import { ModuleType, type ShipSlot } from '../types/ship.types';

export const SHIP_SLOTS: ShipSlot[] = [
    // Weapon Slots (2)
    {
        id: 'slot_weapon_1',
        type: ModuleType.WEAPON,
        name: 'primary_weapon',
        allowedTypes: [ModuleType.WEAPON],
        equippedModuleId: 'weapon_laser_1',
        isCombatSlot: true
    },
    {
        id: 'slot_weapon_2',
        type: ModuleType.WEAPON,
        name: 'secondary_weapon',
        allowedTypes: [ModuleType.WEAPON],
        equippedModuleId: null,
        isCombatSlot: true
    },
    // Support Slots (2) - can be shield, special, or core modules
    {
        id: 'slot_support_1',
        type: ModuleType.SUPPORT,
        name: 'support_system_1',
        allowedTypes: [ModuleType.SUPPORT, ModuleType.CORE],
        equippedModuleId: 'shield_basic_1',
        isCombatSlot: true
    },
    {
        id: 'slot_support_2',
        type: ModuleType.SUPPORT,
        name: 'support_system_2',
        allowedTypes: [ModuleType.SUPPORT, ModuleType.CORE],
        equippedModuleId: null,
        isCombatSlot: true
    }
];

// Helper to get combat-active slots
export const getCombatSlots = (): ShipSlot[] => {
    return SHIP_SLOTS.filter(slot => slot.isCombatSlot);
};
