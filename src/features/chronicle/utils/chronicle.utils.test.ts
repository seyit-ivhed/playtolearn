import { describe, it, expect, vi } from 'vitest';
import {
    resolveCurrentAdventureIndex,
    generateAdventureTitles,
    getBookStateFromUrl,
    calculatePageZIndex
} from './chronicle.utils';
import { ADVENTURES } from '../../../data/adventures.data';
import type { TFunction } from 'i18next';
import type { Adventure } from '../../../types/adventure.types';

describe('chronicle.utils', () => {
    const mockT = vi.fn((key: string) => {
        if (key.startsWith('adventures.') && key.endsWith('.title')) {
            const id = key.split('.')[1];
            return `Title ${id}`;
        }
        return key;
    });

    describe('resolveCurrentAdventureIndex', () => {
        const mockAdventures = [
            { id: '1' },
            { id: '2' }
        ] as unknown as Adventure[];

        it('should return correct index if found', () => {
            expect(resolveCurrentAdventureIndex(mockAdventures, '1')).toBe(0);
            expect(resolveCurrentAdventureIndex(mockAdventures, '2')).toBe(1);
        });

        it('should return 0 if not found', () => {
            expect(resolveCurrentAdventureIndex(mockAdventures, 'non-existent')).toBe(0);
        });

        it('should return 0 if id is undefined', () => {
            expect(resolveCurrentAdventureIndex(mockAdventures, undefined)).toBe(0);
        });
    });

    describe('generateAdventureTitles', () => {
        it('should generate a map of titles', () => {
            const result = generateAdventureTitles(mockT as unknown as TFunction);

            ADVENTURES.forEach(a => {
                expect(result[a.id]).toBe(`Title ${a.id}`);
            });
            expect(result['prologue']).toBeUndefined();
        });
    });

    describe('getBookStateFromUrl', () => {
        it('should return COVER when pageId is undefined', () => {
            expect(getBookStateFromUrl(undefined)).toBe('COVER');
        });

        it('should return COVER when pageId is "cover"', () => {
            expect(getBookStateFromUrl('cover')).toBe('COVER');
        });

        it('should return LOGIN when pageId is "login"', () => {
            expect(getBookStateFromUrl('login')).toBe('LOGIN');
        });

        it('should return DIFFICULTY when pageId is "difficulty"', () => {
            expect(getBookStateFromUrl('difficulty')).toBe('DIFFICULTY');
        });

        it('should return ADVENTURE when pageId is a number', () => {
            expect(getBookStateFromUrl('1')).toBe('ADVENTURE');
            expect(getBookStateFromUrl('123')).toBe('ADVENTURE');
        });

        it('should return COVER for unknown strings', () => {
            expect(getBookStateFromUrl('unknown')).toBe('COVER');
            expect(getBookStateFromUrl('abc')).toBe('COVER');
        });
    });

    describe('calculatePageZIndex', () => {
        it('should return 100 for active state', () => {
            expect(calculatePageZIndex('active', 0)).toBe(100);
            expect(calculatePageZIndex('active', 5)).toBe(100);
        });

        it('should return 10 + position for flipped state', () => {
            expect(calculatePageZIndex('flipped', 0)).toBe(10);
            expect(calculatePageZIndex('flipped', 5)).toBe(15);
        });

        it('should return 50 - position for upcoming state', () => {
            expect(calculatePageZIndex('upcoming', 0)).toBe(50);
            expect(calculatePageZIndex('upcoming', 5)).toBe(45);
        });
    });
});
