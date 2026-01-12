import { supabase } from './supabase.service';
import { IdentityService } from './identity.service';
import { DebouncedQueue } from '../utils/debounced-queue';

interface SyncInput {
    authId: string;
    state: object;
}

export const PersistenceService = {
    // Debounced queue to prevent race conditions during rapid state updates
    syncQueue: new DebouncedQueue<SyncInput>({
        processor: async (input) => {
            await PersistenceService.pushState(input.authId, input.state);
        },
        debounceMs: 300
    }),

    /**
     * Fetches or creates a player profile for a given authId.
     * Returns the profile id.
     */
    async getOrCreateProfile(authId: string) {
        // Since authId IS the profile id now, we can just upsert to ensure it exists
        // and update the device_id.
        const { data, error } = await supabase
            .from('player_profiles')
            .upsert({
                id: authId,
                device_id: IdentityService.getDeviceId(),
                last_login: new Date().toISOString()
            }, {
                onConflict: 'id'
            })
            .select('id')
            .single();

        if (error) throw error;

        return { id: data.id };
    },

    /**
     * Pushes the current game state to Supabase.
     */
    async pushState(authId: string, state: object) {
        try {
            // Upsert the game state
            const { error: upsertError } = await supabase
                .from('game_states')
                .upsert({
                    player_id: authId,
                    state_blob: state,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'player_id'
                });

            if (upsertError) throw upsertError;

            return { success: true };
        } catch (error) {
            console.error('Failed to push state to Supabase:', error);
            return { success: false, error };
        }
    },

    /**
     * Pulls the latest game state from Supabase for a given authId.
     */
    async pullState(authId: string) {
        // Get the game state for that profile
        const { data, error } = await supabase
            .from('game_states')
            .select('state_blob')
            .eq('player_id', authId)
            .maybeSingle();

        if (error) throw error;
        return data?.state_blob || null;
    },

    /**
     * Helper to sync provided state if a session exists.
     * Useful for event-driven syncing from store slices.
     * 
     * Uses a debounced queue to prevent race conditions when multiple
     * rapid sync calls occur. Only the latest state will be pushed.
     */
    async sync(state: object) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                console.log('Event-driven sync triggered...');
                this.syncQueue.enqueue({ authId: session.user.id, state });
            }
        } catch (error) {
            console.error('Error in sync helper:', error);
        }
    }
};

