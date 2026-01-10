import { supabase } from './supabase.service';
import { IdentityService } from './identity.service';

export const PersistenceService = {


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
    async pushState(authId: string, state: object, playerId?: string) {
        try {
            // Player ID is same as Auth ID now
            const actualPlayerId = playerId || authId;


            // Ensure profile exists (idempotent) - arguably we could skip this if we trust the flow
            // but it's safer to ensure profile exists before linking game state
            if (actualPlayerId === authId && !playerId) {
                 await this.getOrCreateProfile(authId);
            }

            // 2. Upsert the game state
            const { error: upsertError } = await supabase
                .from('game_states')
                .upsert({
                    player_id: actualPlayerId,
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
    async pullState(authId: string, playerId?: string) {
        const actualPlayerId = playerId || authId;


        // Step 1: Get the game state for that profile
        const { data, error } = await supabase
            .from('game_states')
            .select('state_blob')
            .eq('player_id', actualPlayerId)
            .maybeSingle();

        if (error) throw error;
        return data?.state_blob || null;
    },

    /**
     * Helper to sync provided state if a session exists.
     * Useful for event-driven syncing from store slices.
     */
    async sync(state: object) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                console.log('Event-driven sync triggered...');
                return this.pushState(session.user.id, state, session.user.id);
            }
        } catch (error) {
            console.error('Error in sync helper:', error);
        }
    }
};
