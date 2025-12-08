export interface Monster {
    id: string; // instance id
    templateId: string;
    name: string;
    maxHealth: number;
    currentHealth: number;
    maxShield: number;
    currentShield: number;
    damage: number;
    color: string;
    icon: string;
}

export const MONSTERS = {
    'goblin_scout': {
        name: 'Goblin Scout',
        maxHealth: 30,
        damage: 8,
        color: '#27ae60', // Green
        icon: '👺'
    },
    'stone_golem': {
        name: 'Stone Golem',
        maxHealth: 60,
        damage: 12,
        color: '#7f8c8d', // Grey
        icon: '🗿'
    },
    'dark_sorcerer': {
        name: 'Dark Sorcerer',
        maxHealth: 40,
        damage: 15,
        color: '#8e44ad', // Purple
        icon: '🧙'
    }
};

export const createMonster = (templateId: string, instanceId: string): Monster => {
    const template = MONSTERS[templateId as keyof typeof MONSTERS];
    return {
        id: instanceId,
        templateId,
        name: template.name,
        maxHealth: template.maxHealth,
        currentHealth: template.maxHealth,
        maxShield: 0,
        currentShield: 0,
        damage: template.damage,
        color: template.color,
        icon: template.icon
    };
};
