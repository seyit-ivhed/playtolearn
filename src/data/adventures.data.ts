import { type Adventure } from '../types/adventure.types';
import { ADVENTURE_1 } from './adventures/adventure-1.data';
import { ADVENTURE_2 } from './adventures/adventure-2.data';
import { ADVENTURE_3 } from './adventures/adventure-3.data';
import { ADVENTURE_4 } from './adventures/adventure-4.data';
import { ADVENTURE_5 } from './adventures/adventure-5.data';
import { ADVENTURE_6 } from './adventures/adventure-6.data';

export const ADVENTURES: Adventure[] = [
    ADVENTURE_1,
    ADVENTURE_2,
    ADVENTURE_3,
    ADVENTURE_4,
    ADVENTURE_5,
    ADVENTURE_6
];

export const getAdventureById = (id: string): Adventure | undefined => {
    return ADVENTURES.find(m => m.id === id);
};
