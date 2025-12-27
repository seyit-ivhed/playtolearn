import type { Volume } from '../types/adventure.types';

export const VOLUMES: Volume[] = [
    {
        id: 'origins',
        title: 'The World of Origins',
        description: 'Where the journey begins. Join Amara and Tariq as they face the first challenges of their quest.',
        coverImage: '/assets/covers/origins.webp',
        isLocked: false,
        adventureIds: ['1', '2', '3']
    },
    {
        id: 'baobab',
        title: 'The Baobab Plains',
        description: 'Explore the vast savannah and ancient kingdoms with Zahara.',
        coverImage: '/assets/covers/baobab.webp',
        isLocked: true,
        price: 4.99,
        adventureIds: ['4', '5', '6', '7']
    },
    {
        id: 'sakura',
        title: 'The Sakura Highlands',
        description: 'Climb the misty mountains and cherry blossom forests with Kenji.',
        coverImage: '/assets/covers/sakura.webp',
        isLocked: true,
        price: 4.99,
        adventureIds: ['8', '9', '10', '11']
    }
];
