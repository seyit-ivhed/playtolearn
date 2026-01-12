import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DebouncedQueue } from './debounced-queue';

describe('DebouncedQueue', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('should process a single enqueued item after debounce delay', async () => {
        const processor = vi.fn().mockResolvedValue(undefined);
        const queue = new DebouncedQueue({
            processor,
            debounceMs: 300,
            timers: { setTimeout: vi.fn(setTimeout), clearTimeout: vi.fn(clearTimeout) }
        });

        queue.enqueue('test-value');

        // Should not process immediately
        expect(processor).not.toHaveBeenCalled();

        // Advance time by debounce delay
        await vi.advanceTimersByTimeAsync(300);

        // Should have processed the item
        expect(processor).toHaveBeenCalledTimes(1);
        expect(processor).toHaveBeenCalledWith('test-value');
    });

    it('should implement last-write-wins for multiple rapid enqueues', async () => {
        const processor = vi.fn().mockResolvedValue(undefined);
        const queue = new DebouncedQueue({
            processor,
            debounceMs: 300,
            timers: { setTimeout: vi.fn(setTimeout), clearTimeout: vi.fn(clearTimeout) }
        });

        // Enqueue multiple items rapidly
        queue.enqueue('value-1');
        queue.enqueue('value-2');
        queue.enqueue('value-3');

        // Should not process yet
        expect(processor).not.toHaveBeenCalled();

        // Advance time
        await vi.advanceTimersByTimeAsync(300);

        // Should only process the last value
        expect(processor).toHaveBeenCalledTimes(1);
        expect(processor).toHaveBeenCalledWith('value-3');
    });

    it('should reset debounce timer on each enqueue', async () => {
        const processor = vi.fn().mockResolvedValue(undefined);
        const queue = new DebouncedQueue({
            processor,
            debounceMs: 300,
            timers: { setTimeout: vi.fn(setTimeout), clearTimeout: vi.fn(clearTimeout) }
        });

        queue.enqueue('value-1');
        
        // Advance time partially
        await vi.advanceTimersByTimeAsync(200);
        expect(processor).not.toHaveBeenCalled();

        // Enqueue again, resetting the timer
        queue.enqueue('value-2');

        // Advance another 200ms (total 400ms from first enqueue)
        await vi.advanceTimersByTimeAsync(200);
        expect(processor).not.toHaveBeenCalled();

        // Advance final 100ms (300ms from second enqueue)
        await vi.advanceTimersByTimeAsync(100);
        expect(processor).toHaveBeenCalledTimes(1);
        expect(processor).toHaveBeenCalledWith('value-2');
    });

    it('should not process concurrently', async () => {
        let processingCount = 0;
        let maxConcurrent = 0;

        const processor = vi.fn().mockImplementation(async () => {
            processingCount++;
            maxConcurrent = Math.max(maxConcurrent, processingCount);
            
            // Simulate async work
            await new Promise(resolve => setTimeout(resolve, 100));
            
            processingCount--;
        });

        const queue = new DebouncedQueue({
            processor,
            debounceMs: 300,
            timers: { setTimeout: vi.fn(setTimeout), clearTimeout: vi.fn(clearTimeout) }
        });

        queue.enqueue('value-1');
        await vi.advanceTimersByTimeAsync(300);

        // While first is processing, enqueue another
        queue.enqueue('value-2');
        await vi.advanceTimersByTimeAsync(50); // Still processing first

        // Advance to finish first processing
        await vi.advanceTimersByTimeAsync(50);

        // Now second should be scheduled
        await vi.advanceTimersByTimeAsync(300);
        await vi.advanceTimersByTimeAsync(100);

        // Should have processed both, but never concurrently
        expect(processor).toHaveBeenCalledTimes(2);
        expect(maxConcurrent).toBe(1);
    });

    it('should re-schedule if new item arrives during processing', async () => {
        const processor = vi.fn().mockImplementation(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
        });

        const queue = new DebouncedQueue({
            processor,
            debounceMs: 300,
            timers: { setTimeout: vi.fn(setTimeout), clearTimeout: vi.fn(clearTimeout) }
        });

        // First enqueue
        queue.enqueue('value-1');
        await vi.advanceTimersByTimeAsync(300);

        // Now processing value-1, enqueue value-2 while processing
        queue.enqueue('value-2');

        // Finish processing value-1
        await vi.advanceTimersByTimeAsync(100);

        // value-2 should be scheduled
        expect(processor).toHaveBeenCalledTimes(1);

        // Advance to process value-2
        await vi.advanceTimersByTimeAsync(300);
        await vi.advanceTimersByTimeAsync(100);

        expect(processor).toHaveBeenCalledTimes(2);
        expect(processor).toHaveBeenNthCalledWith(1, 'value-1');
        expect(processor).toHaveBeenNthCalledWith(2, 'value-2');
    });

    it('should handle processor errors gracefully', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const processor = vi.fn().mockRejectedValue(new Error('Processing failed'));

        const queue = new DebouncedQueue({
            processor,
            debounceMs: 300,
            timers: { setTimeout: vi.fn(setTimeout), clearTimeout: vi.fn(clearTimeout) }
        });

        queue.enqueue('value-1');
        await vi.advanceTimersByTimeAsync(300);

        // Should log error
        expect(consoleErrorSpy).toHaveBeenCalled();

        // Should still be able to process next item
        queue.enqueue('value-2');
        await vi.advanceTimersByTimeAsync(300);

        expect(processor).toHaveBeenCalledTimes(2);
        
        consoleErrorSpy.mockRestore();
    });

    it('should clear pending operations', async () => {
        const processor = vi.fn().mockResolvedValue(undefined);
        const queue = new DebouncedQueue({
            processor,
            debounceMs: 300,
            timers: { setTimeout: vi.fn(setTimeout), clearTimeout: vi.fn(clearTimeout) }
        });

        queue.enqueue('value-1');
        expect(queue.hasPending()).toBe(true);

        queue.clear();
        expect(queue.hasPending()).toBe(false);

        // Advance time - should not process
        await vi.advanceTimersByTimeAsync(300);
        expect(processor).not.toHaveBeenCalled();
    });

    it('should track processing state correctly', async () => {
        const processor = vi.fn().mockImplementation(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
        });

        const queue = new DebouncedQueue({
            processor,
            debounceMs: 300,
            timers: { setTimeout: vi.fn(setTimeout), clearTimeout: vi.fn(clearTimeout) }
        });

        expect(queue.isCurrentlyProcessing()).toBe(false);

        queue.enqueue('value-1');
        await vi.advanceTimersByTimeAsync(300);

        expect(queue.isCurrentlyProcessing()).toBe(true);

        await vi.advanceTimersByTimeAsync(100);

        expect(queue.isCurrentlyProcessing()).toBe(false);
    });

    it('should work with complex object types', async () => {
        interface TestState {
            id: string;
            count: number;
            nested: { value: string };
        }

        const processor = vi.fn().mockResolvedValue(undefined);
        const queue = new DebouncedQueue<TestState>({
            processor,
            debounceMs: 300,
            timers: { setTimeout: vi.fn(setTimeout), clearTimeout: vi.fn(clearTimeout) }
        });

        const state1: TestState = { id: '1', count: 1, nested: { value: 'a' } };
        const state2: TestState = { id: '2', count: 2, nested: { value: 'b' } };

        queue.enqueue(state1);
        queue.enqueue(state2);

        await vi.advanceTimersByTimeAsync(300);

        expect(processor).toHaveBeenCalledTimes(1);
        expect(processor).toHaveBeenCalledWith(state2);
    });

    it('should handle multiple items arriving during processing', async () => {
        const processor = vi.fn().mockImplementation(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
        });

        const queue = new DebouncedQueue({
            processor,
            debounceMs: 300,
            timers: { setTimeout: vi.fn(setTimeout), clearTimeout: vi.fn(clearTimeout) }
        });

        // Start processing first item
        queue.enqueue('value-1');
        await vi.advanceTimersByTimeAsync(300);

        // While processing, enqueue multiple items
        queue.enqueue('value-2');
        queue.enqueue('value-3');
        queue.enqueue('value-4');

        // Finish first processing
        await vi.advanceTimersByTimeAsync(100);

        // Should schedule the last item (value-4)
        await vi.advanceTimersByTimeAsync(300);
        await vi.advanceTimersByTimeAsync(100);

        expect(processor).toHaveBeenCalledTimes(2);
        expect(processor).toHaveBeenNthCalledWith(1, 'value-1');
        expect(processor).toHaveBeenNthCalledWith(2, 'value-4');
    });
});
