import type { SupabaseClient } from '@supabase/supabase-js';

export interface AccountConversionResult {
    success: boolean;
    error?: string;
}

export interface AccountConversionParams {
    email: string;
    password: string;
    refreshSession: () => Promise<void>;
    translation: (key: string, options?: Record<string, unknown>) => string;
    supabaseClient: SupabaseClient;
}

/**
 * Validates the account creation form fields.
 * Returns an error message if invalid, or null if valid.
 */
export const validateAccountCreationForm = (
    email: string,
    confirmEmail: string,
    password: string,
    translation: (key: string, options?: Record<string, unknown>) => string
): string | null => {
    if (!email || !email.includes('@')) {
        return translation('premium.store.account.errors.invalid_email');
    }

    if (email !== confirmEmail) {
        return translation('premium.store.account.errors.emails_dont_match');
    }

    if (password.length < 6) {
        return translation('premium.store.account.errors.weak_password');
    }

    return null;
};

/**
 * Performs the process of converting an anonymous session to a permanent account.
 */
export const performAccountConversion = async ({
    email,
    password,
    refreshSession,
    translation,
    supabaseClient
}: AccountConversionParams): Promise<AccountConversionResult> => {
    try {
        // 1. Ensure we have a session and the user is ANONYMOUS
        const { data: { session: currentSession } } = await supabaseClient.auth.getSession();
        let session = currentSession;

        if (!session) {
            console.log('No session found, creating anonymous session first...');
            const { data: signInData, error: signInError } = await supabaseClient.auth.signInAnonymously();
            if (signInError) throw signInError;
            session = signInData.session;
        }

        if (session?.user && !session.user.is_anonymous) {
            console.warn('User is already authenticated. Skipping conversion.');
            return { success: true };
        }

        console.log('Converting session for email:', email);

        // 2. Convert to permanent user
        const { error: updateError } = await supabaseClient.auth.updateUser({
            email,
            password
        });

        if (updateError) {
            // If the email is already taken, Supabase returns 422 or specific message
            if (updateError.message.toLowerCase().includes('already registered') ||
                updateError.message.toLowerCase().includes('already in use') ||
                updateError.status === 422) {
                return {
                    success: false,
                    error: translation('premium.store.account.errors.already_exists', 'This email is already registered. Please sign in with your existing account.')
                };
            } else {
                throw updateError;
            }
        }

        console.log('Account conversion triggered successfully. Finalizing profile...');

        // 3. Ensure a player profile exists and is updated
        const userId = session?.user.id;
        if (userId) {
            console.log('Synchronizing player profile for:', userId);
            const { error: upsertError } = await supabaseClient
                .from('player_profiles')
                .upsert({ id: userId }, { onConflict: 'id' });

            if (upsertError) {
                console.error('Error synchronizing profile:', upsertError);
            } else {
                console.log('Profile synchronized.');
            }
        }

        console.log('Refreshing session...');

        // 4. Force a session refresh to get the updated JWT
        await refreshSession();

        // 5. Double check we have a valid session now
        const { data: { session: updatedSession } } = await supabaseClient.auth.getSession();
        console.log('Post-conversion session check:', updatedSession ? 'Valid' : 'Missing');

        if (!updatedSession) {
            console.error('Session not found after conversion. This might happen if Email Confirmation is enabled.');
        }

        // 6. Slightly longer delay to ensure the session is propagated before proceeding to checkout
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { success: true };

    } catch (err: unknown) {
        const errObj = err as Error;
        console.error('Account creation error:', errObj);
        return { success: false, error: errObj.message || 'Failed to create account' };
    }
};
