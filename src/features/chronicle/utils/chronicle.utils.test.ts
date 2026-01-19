import { describe, it, expect, vi } from 'vitest';
import {
    resolveCurrentVolume,
    resolveVolumeAdventures,
    resolveCurrentAdventureIndex,
    generateAdventureTitles
} from './chronicle.utils';
import { VOLUMES } from '../../../data/volumes.data';
import { ADVENTURES } from '../../../data/adventures.data';
import type { TFunction } from 'i18next';
import type { Adventure } from '../../../types/adventure.types';

describe('chronicle.utils', () => {
    const mockT = vi.fn((key: string) => {
        if (key === 'adventures.prologue.title') return 'Prologue Title';
        if (key === 'adventures.prologue.story_hook') return 'Prologue Hook';
        if (key.startsWith('adventures.') && key.endsWith('.title')) {
            const id = key.split('.')[1];
            return `Title ${id}`;
        }
        return key;
    });

    describe('resolveCurrentVolume', () => {
        it('should return origins volume for adventure 4', () => {
            const result = resolveCurrentVolume('4');
            expect(result.id).toBe('origins');
        });

        it('should return the first volume for the prologue', () => {
            const result = resolveCurrentVolume('prologue');
            expect(result.id).toBe('origins');
        });

        it('should return the first volume if adventure is not found', () => {
            const result = resolveCurrentVolume('non-existent');
            expect(result.id).toBe(VOLUMES[0].id);
        });

        it('should return the first volume if adventureId is undefined', () => {
            const result = resolveCurrentVolume(undefined);
            expect(result.id).toBe(VOLUMES[0].id);
        });
    });

    describe('resolveVolumeAdventures', () => {
        it('should include prologue for origins volume', () => {
            const originsVolume = VOLUMES.find(v => v.id === 'origins')!;
            const result = resolveVolumeAdventures(originsVolume, mockT as unknown as TFunction);

            expect(result[0].id).toBe('prologue');
            expect(result[0].title).toBe('Prologue Title');

            const expectedAdventureIds = ADVENTURES
                .filter(a => a.volumeId === originsVolume.id)
                .map(a => a.id);

            expect(result.slice(1).map(a => a.id)).toEqual(expectedAdventureIds);
        });
    });

    describe('resolveCurrentAdventureIndex', () => {
        const mockAdventures = [
            { id: 'prologue' },
            { id: '1' },
            { id: '2' }
        ] as unknown as Adventure[];

        it('should return correct index if found', () => {
            expect(resolveCurrentAdventureIndex(mockAdventures, '1')).toBe(1);
            expect(resolveCurrentAdventureIndex(mockAdventures, 'prologue')).toBe(0);
        });

        it('should return 0 if not found', () => {
            expect(resolveCurrentAdventureIndex(mockAdventures, 'non-existent')).toBe(0);
        });

        it('should return 0 if id is undefined', () => {
            expect(resolveCurrentAdventureIndex(mockAdventures, undefined)).toBe(0);
        });
    });

    describe('generateAdventureTitles', () => {
        it('should generate a map of titles including prologue', () => {
            const result = generateAdventureTitles(mockT as unknown as TFunction);

            expect(result['prologue']).toBe('Prologue Title');
            ADVENTURES.forEach(a => {
                expect(result[a.id]).toBe(`Title ${a.id}`);
            });
        });
    });
});
