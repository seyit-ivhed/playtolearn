import { describe, it, expect } from 'vitest';
import { generateGeometryData, GeometryPuzzleData } from './GeometryEngine';
import { PuzzleType } from '../../../../types/adventure.types';

describe('GeometryEngine', () => {
    it('should generate puzzle data with correct structure', () => {
        const difficulty = 1;
        const data = generateGeometryData(difficulty) as GeometryPuzzleData;

        expect(data.puzzleType).toBe(PuzzleType.GEOMETRY);
        expect(data.shapes).toBeDefined();
        expect(data.correctShapeId).toBeDefined();
        expect(data.questionKey).toBeDefined();
        expect(data.targetShapeType).toBeDefined();
    });

    it('should generate correct number of shapes for difficulty 1', () => {
        const data = generateGeometryData(1) as GeometryPuzzleData;
        expect(data.shapes.length).toBe(3);
    });

    it('should generate correct number of shapes for difficulty 2', () => {
        const data = generateGeometryData(2) as GeometryPuzzleData;
        expect(data.shapes.length).toBe(4);
    });

    it('should calculate correct answer within generated shapes', () => {
        const data = generateGeometryData(1) as GeometryPuzzleData;
        const correctShape = data.shapes.find(s => s.id === data.correctShapeId);
        expect(correctShape).toBeDefined();
        expect(correctShape?.type).toBe(data.targetShapeType);
    });
});
