/**
 * Timer functions interface for dependency injection.
 * Allows tests to inject fake timers for fast, deterministic testing.
 */
export interface TimerFunctions {
    setTimeout: typeof globalThis.setTimeout;
    clearTimeout: typeof globalThis.clearTimeout;
}

/**
 * Options for configuring the DebouncedQueue.
 */
export interface DebouncedQueueOptions<TInput> {
    /** The async function to process queued items */
    processor: (input: TInput) => Promise<void>;
    /** Debounce delay in milliseconds */
    debounceMs: number;
    /** Timer functions for testing (defaults to global timers) */
    timers?: TimerFunctions;
}

/**
 * A debounced queue that implements last-write-wins semantics.
 * 
 * When multiple items are enqueued rapidly, only the last item is processed
 * after the debounce delay. This prevents race conditions and reduces
 * unnecessary async operations.
 * 
 * @example
 * ```typescript
 * const queue = new DebouncedQueue({
 *   processor: async (data) => await saveToDatabase(data),
 *   debounceMs: 300
 * });
 * 
 * // Rapid updates - only the last one will be processed
 * queue.enqueue({ value: 1 });
 * queue.enqueue({ value: 2 });
 * queue.enqueue({ value: 3 }); // Only this will be saved
 * ```
 */
export class DebouncedQueue<TInput> {
    private processor: (input: TInput) => Promise<void>;
    private debounceMs: number;
    private timers: TimerFunctions;
    
    private timeout: ReturnType<typeof setTimeout> | null = null;
    private pendingInput: TInput | null = null;
    private isProcessing = false;

    constructor(options: DebouncedQueueOptions<TInput>) {
        this.processor = options.processor;
        this.debounceMs = options.debounceMs;
        this.timers = options.timers || {
            setTimeout: globalThis.setTimeout.bind(globalThis),
            clearTimeout: globalThis.clearTimeout.bind(globalThis)
        };
    }

    /**
     * Enqueue an item for processing.
     * If called multiple times rapidly, only the last item will be processed.
     */
    enqueue(input: TInput): void {
        // Store the latest input (last-write-wins)
        this.pendingInput = input;

        // Clear any existing timeout
        if (this.timeout !== null) {
            this.timers.clearTimeout(this.timeout);
        }

        // Schedule processing
        this.timeout = this.timers.setTimeout(() => {
            this.processPending();
        }, this.debounceMs);
    }

    /**
     * Process the pending input if one exists and we're not already processing.
     */
    private async processPending(): Promise<void> {
        // If already processing or no pending input, return
        if (this.isProcessing || this.pendingInput === null) {
            return;
        }

        // Mark as processing and capture the current input
        this.isProcessing = true;
        const inputToProcess = this.pendingInput;
        this.pendingInput = null;
        this.timeout = null;

        try {
            await this.processor(inputToProcess);
        } catch (error) {
            console.error('DebouncedQueue processor error:', error);
        } finally {
            this.isProcessing = false;

            // If new input arrived while processing, schedule another run
            if (this.pendingInput !== null) {
                this.timeout = this.timers.setTimeout(() => {
                    this.processPending();
                }, this.debounceMs);
            }
        }
    }

    /**
     * Clear any pending operations and reset the queue.
     * Useful for cleanup or testing.
     */
    clear(): void {
        if (this.timeout !== null) {
            this.timers.clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.pendingInput = null;
    }

    /**
     * Check if there's a pending operation scheduled.
     */
    hasPending(): boolean {
        return this.pendingInput !== null || this.timeout !== null;
    }

    /**
     * Check if currently processing an item.
     */
    isCurrentlyProcessing(): boolean {
        return this.isProcessing;
    }
}
