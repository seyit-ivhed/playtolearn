import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase.service';
import type { Session, User } from '@supabase/supabase-js';

export const useAuth = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (!session) {
                // Automatically sign in anonymously if no session exists
                signInAnonymously();
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInAnonymously = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInAnonymously();
            if (error) throw error;
        } catch (error) {
            console.error('Error signing in anonymously:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        session,
        user,
        loading,
        signInAnonymously
    };
};
