import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabase.service';
import { IdentityService } from '../services/identity.service';
import type { Session, User } from '@supabase/supabase-js';

export const useAuth = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshSession = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
    }, []);

    useEffect(() => {
        refreshSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [refreshSession]);

    const signInAnonymously = async () => {
        try {
            setLoading(true);
            const { error, data } = await supabase.auth.signInAnonymously({
                options: {
                    data: { device_id: IdentityService.getDeviceId() }
                }
            });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error signing in anonymously:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        session,
        user,
        isAuthenticated: !!session,
        loading,
        signInAnonymously,
        refreshSession
    };
};
