import { ModuleType, type ShipSlot } from '../types/ship.types';

export const SHIP_SLOTS: ShipSlot[] = [
    {
        id: 'slot_weapon_1',
        type: ModuleType.WEAPON,
        name: 'primary_weapon',
        allowedTypes: [ModuleType.WEAPON],
        equippedModuleId: 'weapon_laser_1'
    },
    {
        id: 'slot_weapon_2',
        type: ModuleType.WEAPON,
        name: 'secondary_weapon',
        allowedTypes: [ModuleType.WEAPON],
        equippedModuleId: null
    },
    {
        id: 'slot_defense_1',
        type: ModuleType.SHIELD,
        name: 'defense_system',
        allowedTypes: [ModuleType.SHIELD, ModuleType.CORE],
        equippedModuleId: 'shield_basic_1'
    },
    {
        id: 'slot_special_1',
        type: ModuleType.SPECIAL,
        name: 'special_module',
        allowedTypes: [ModuleType.SPECIAL, ModuleType.CORE],
        equippedModuleId: null
    }
];
