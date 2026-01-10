import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabase.service';
import { PersistenceService } from '../services/persistence.service';
import { IdentityService } from '../services/identity.service';
import type { Session, User } from '@supabase/supabase-js';

export const useAuth = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshSession = useCallback(async () => {
        const { data: { session }, error } = await supabase.auth.refreshSession();
        if (error) {
            // Fallback to getSession if refresh fails (e.g. no session exists)
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
        } else {
            setSession(session);
            setUser(session?.user ?? null);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        // Initial load
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            
            if (session?.user?.id) {
                IdentityService.setPlayerId(session.user.id);
            } else {
                IdentityService.clearPlayerId();
            }

            setUser(session?.user ?? null);
            setLoading(false);
        };
        init();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const newUser = session?.user ?? null;

            // Sync IdentityService
            if (newUser?.id) {
                IdentityService.setPlayerId(newUser.id);
            } else {
                IdentityService.clearPlayerId();
            }

            // Clear persistence cache if user switched
            setUser(current => {
                if (current?.id !== newUser?.id) {
                    PersistenceService.clearCache();
                }
                return newUser;
            });

            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

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
