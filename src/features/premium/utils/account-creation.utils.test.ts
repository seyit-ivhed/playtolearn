import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { validateAccountCreationForm, performAccountConversion } from './account-creation.utils';
import type { SupabaseClient } from '@supabase/supabase-js';

describe('account-creation.utils', () => {
    const translation = vi.fn((key) => key);

    describe('validateAccountCreationForm', () => {
        it('should return error for invalid email', () => {
            expect(validateAccountCreationForm('', '', 'password', translation)).toBe('premium.store.account.errors.invalid_email');
            expect(validateAccountCreationForm('invalid-email', 'invalid-email', 'password', translation)).toBe('premium.store.account.errors.invalid_email');
        });

        it('should return error if emails dont match', () => {
            expect(validateAccountCreationForm('test@test.com', 'other@test.com', 'password', translation)).toBe('premium.store.account.errors.emails_dont_match');
        });

        it('should return error for weak password', () => {
            expect(validateAccountCreationForm('test@test.com', 'test@test.com', '123', translation)).toBe('premium.store.account.errors.weak_password');
        });

        it('should return null if valid', () => {
            expect(validateAccountCreationForm('test@test.com', 'test@test.com', 'password', translation)).toBeNull();
        });
    });

    describe('performAccountConversion', () => {
        const refreshSession = vi.fn();
        const email = 'test@test.com';
        const password = 'password';

        let mockSupabaseClient: any;

        beforeEach(() => {
            vi.clearAllMocks();
            vi.useFakeTimers();

            // Suppress console logs
            vi.spyOn(console, 'log').mockImplementation(() => {});
            vi.spyOn(console, 'warn').mockImplementation(() => {});
            vi.spyOn(console, 'error').mockImplementation(() => {});

            mockSupabaseClient = {
                auth: {
                    getSession: vi.fn(),
                    signInAnonymously: vi.fn(),
                    updateUser: vi.fn(),
                },
                from: vi.fn(() => ({
                    upsert: vi.fn().mockResolvedValue({ error: null }),
                })),
            };
        });

        afterEach(() => {
            vi.useRealTimers();
            vi.restoreAllMocks();
        });

        it('should handle successful conversion', async () => {
            mockSupabaseClient.auth.getSession
                .mockResolvedValueOnce({ data: { session: { user: { id: '123', is_anonymous: true } } } as any, error: null })
                .mockResolvedValueOnce({ data: { session: { user: { id: '123', is_anonymous: false } } } as any, error: null });
            
            mockSupabaseClient.auth.updateUser.mockResolvedValueOnce({ data: {}, error: null } as any);

            const conversionPromise = performAccountConversion({ 
                email, 
                password, 
                refreshSession, 
                translation, 
                supabaseClient: mockSupabaseClient as unknown as SupabaseClient 
            });

            // Fast-forward through the 1.5s delay
            await vi.runAllTimersAsync();

            const result = await conversionPromise;

            expect(result.success).toBe(true);
            expect(mockSupabaseClient.auth.updateUser).toHaveBeenCalledWith({ email, password });
            expect(refreshSession).toHaveBeenCalled();
        });

        it('should sign in anonymously if no session exists', async () => {
            mockSupabaseClient.auth.getSession
                .mockResolvedValueOnce({ data: { session: null }, error: null })
                .mockResolvedValueOnce({ data: { session: { user: { id: 'new-id', is_anonymous: false } } } as any, error: null });
            
            mockSupabaseClient.auth.signInAnonymously.mockResolvedValueOnce({ data: { session: { user: { id: 'new-id', is_anonymous: true } } }, error: null } as any);
            mockSupabaseClient.auth.updateUser.mockResolvedValueOnce({ data: {}, error: null } as any);

            const conversionPromise = performAccountConversion({ 
                email, 
                password, 
                refreshSession, 
                translation, 
                supabaseClient: mockSupabaseClient as unknown as SupabaseClient 
            });

            await vi.runAllTimersAsync();
            const result = await conversionPromise;

            expect(result.success).toBe(true);
            expect(mockSupabaseClient.auth.signInAnonymously).toHaveBeenCalled();
        });

        it('should skip conversion if user is already permanent', async () => {
            mockSupabaseClient.auth.getSession.mockResolvedValueOnce({ data: { session: { user: { id: '123', is_anonymous: false } } } as any, error: null });

            const result = await performAccountConversion({ 
                email, 
                password, 
                refreshSession, 
                translation, 
                supabaseClient: mockSupabaseClient as unknown as SupabaseClient 
            });

            expect(result.success).toBe(true);
            expect(mockSupabaseClient.auth.updateUser).not.toHaveBeenCalled();
        });

        it('should return error if email already exists', async () => {
            mockSupabaseClient.auth.getSession.mockResolvedValueOnce({ data: { session: { user: { id: '123', is_anonymous: true } } } as any, error: null });
            
            mockSupabaseClient.auth.updateUser.mockResolvedValueOnce({ 
                data: null, 
                error: { message: 'User already registered', status: 422 } as any 
            });

            const result = await performAccountConversion({ 
                email, 
                password, 
                refreshSession, 
                translation, 
                supabaseClient: mockSupabaseClient as unknown as SupabaseClient 
            });

            expect(result.success).toBe(false);
            expect(result.error).toBe('premium.store.account.errors.already_exists');
        });

        it('should return generic error if conversion fails', async () => {
            mockSupabaseClient.auth.getSession.mockResolvedValueOnce({ data: { session: { user: { id: '123', is_anonymous: true } } } as any, error: null });
            
            mockSupabaseClient.auth.updateUser.mockRejectedValueOnce(new Error('Network error'));

            const result = await performAccountConversion({ 
                email, 
                password, 
                refreshSession, 
                translation, 
                supabaseClient: mockSupabaseClient as unknown as SupabaseClient 
            });

            expect(result.success).toBe(false);
            expect(result.error).toBe('Network error');
        });
    });
});
